---
id: dataloaders-and-cache-invalidation
title: DataLoaders and cache invalidation
---

One of the main responsibility of GraphQL modules in Front-Commerce is fetching data from remote sources in resolvers. A naive approach may reach a few limits in a real application, that is why **Front-Commerce provides helpers allowing developers to build high-performance applications**.

This section introduce the DataLoader pattern and how to use it in a Front-Commerce application. It then details how to configure the caching layer to keep remote API response in cache to boost performance. Finally, it explains how to invalidate the cache from remote systems.

By the end of this guide, you will have a good understanding of the mechanisms at your disposal to compensate for the slowness of a remote API.

## Why?

Imagine a resolver on a `Product.qty` field that fetches the current quantity in stock for a product from the `https://inventory.example.com/stock/PRODUCT_SKU` remote API.

Let's see what happens when we run a query like this on our GraphQL endpoint:

```graphql
{
  category("pants") {
    name
    products({ limit: 10 }) {
      sku
      name
      qty
    }
  }
}
```

### The problem

This query would lead to 12 HTTP requests from the server to the remote datasource:

- 1 request to fetch category information
- 1 request to fetch products in the category, with sku and name (in the best case)
- 10 additional requests to fetch products `qty` field

Furthermore, the `qty` requests will be started only after the previous category response has been received, leading to network waterfalls which will delay the GraphQL response.

This problem is also known as [the N+1 problem](https://engineering.shopify.com/blogs/engineering/solving-the-n-1-problem-for-graphql-through-batching) and DataLoaders are a way to solve this using **batching** and **caching**.

### Batching

Batching, in this context is the process of grouping every data that is required so that they could be retrieved in an efficient manner.

Let's suppose that our category contained 10 products `PANT-01`, `PANT-02`, …, `PANT-10`. Then, instead of making 10 HTTP requests for each product stock, we could leverage batching to fetch all product inventories with a single remote API call (ex: `https://inventory.example.com/stocks?skus=PANT-01,PANT-02,…,PANT-10`).

These kind of batch endpoints are not always available on remote services. But if they exist, they can avoid many remote API calls and lead to better performance.

### Caching

Caching mechanisms are useful for GraphQL resolvers in two ways:

1. to prevent re-fetching the same data across different queries (or for different users)
2. to prevent re-fetching the same data twice during the same query resolution

The first use case is something one may already know from other systems. In the previous example, caching would allow to do the remote API calls when the first user visits the page, and retrieve this information from the cache for further visitors. The following GraphQL responses will then be faster and the remote system's load will decrease dramatically.

The second one is more specific to GraphQL. To understand its gain, we should consider the following query:

```graphql
{
  category("pants") {
    name
    products({ limit: 10 }) {
      sku
      name
      qty
      upsells({ limit: 2 }) {
        sku
        name
        qty
      }
    }
  }
}
```

If the product `PANT-01` was an upsell of all other products in the `pants` category, the inventory API would be requested again when resolving the `upsells.qty` field. Query-level caching prevents those extra-calls, by reusing the response from `products.qty` that has already been fetched previously to resolve data.

## What are DataLoaders?

DataLoader is a pattern promoted by Facebook, from their internal implementations, to solve problems with data fetching. We use this name because it is the name of the reference implementation in Javascript: [graphql/dataloader](https://github.com/graphql/dataloader).

A DataLoader is instantiated with a **batching function**, that will allow to fetch data in a grouped way (see [Batching](#Batching) above). It also has a caching strategy that prevents fetching the same data twice in the same request or across requests (see [Caching](#Caching) above).

By default every DataLoader provides request-level caching. But this can be configured to switch to a persistent caching strategy instead. For instance, Front-Commerce provides a Redis strategy to share the cache between users and requests.

In our previous example, if the `Product.qty` resolver was implemented using a DataLoader the query could have been resolved using only 2 remote API requests:
- 1 request to fetch category information
- 1 request to fetch products in the category
- 1 batch request to fetch quantities of the products if an API was available: `https://inventory.example.com/stocks?skus=PANT-01,PANT-02,…,PANT-10`

We encourage you to read the [DataLoader readme](https://github.com/graphql/dataloader) documentation to learn more about how it works.

Front-Commerce provides a factory function to create DataLoaders from your GraphQL modules while keeping caching strategies configurable. Under the hood it is a pure DataLoader instance, so you could use it in a standard manner.

## Using DataLoaders in Front-Commerce

When building a GraphQL module, Front-Commerce will inject a `makeDataLoader` factory function in your [module’s `contextEnhancer` function](/docs/reference/graphql-module-definition.html#contextEnhancer-optional).

### `makeDataLoader` usage

The `makeDataLoader` factory allows developers to build a DataLoader without worrying about the current store scope (in a multi-store environment) or caching concern).

Here is an example based on the use case above:

```js
// index.js
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";
import StockLoader from "./loader";

export default {
  namespace: "Acme/Inventory",
  typeDefs,
  resolvers,
  contextEnhancer: ({ makeDataLoader, req }) => {
    const axiosInstance = axios.create({
      baseURL: req.config.inventoryApiEndpointUrl
    });

    return {
      // create an instance of the loader, to be made available in resolvers
      Stock: StockLoader(makeDataLoader, axiosInstance)
    };
  }
};
```

```graphql
# schema.gql
extend type Product {
  qty: Int
}
```

```js
// resolvers.js
export default {
  Product: {
    qty: ({ sku }, _, { loaders }) => {
      // use the loader instance to fetch data
      // batching and caching is transparent in the resolver
      return loaders.Stock.loadBySku(sku);
    }
  }
}
```

```js
// loader.js
import { reorderForIds } from "server/core/graphql/dataloaderHelpers";

const StockLoader = (makeDataLoader, axiosInstance) => {
  // our batching function that will be injected in the DataLoader factory
  // it is important to return results in the same order than the passed `skus`
  // hence the use of `reorderForIds` (documented later in this page)
  const loadStocksBatch = skus => {
     return axiosInstance
        .get("/stocks", { params: { skus } })
        .then(response => response.data.items)
        .then(reorderForIds(skus, "sku"));
  }

  // The `Stock` key here must be unique across the project
  // and is used in cache configuration to determine the caching strategy to use
  const loader = makeDataLoader("Stock")(
    skus => loadStocksBatch(skus)
  );

  return {
    // `loader` is a standard DataLoader instance, so you can use any available methods on it
    loadBySku: sku => loader.load(sku)
  }
};

export default StockLoader;
```

The 2nd parameter to `makeDataLoader` are the options to pass to the DataLoader instance. You usually don't have to use it. Please refer to [dataloader's documentation](https://github.com/graphql/dataloader#new-dataloaderbatchloadfn--options) for further information.

### Useful patterns

#### Prevent caching errors (data not found)

Batching functions will sometimes return `null` or _falsy_ data for nonexistent items. By default, these values will be cached so further data retrieval could return this `null` value instead of doing a remote API call.

In some specific cases, you may want to force fetching data from the remote source every time. You can do so by returning an `Error` for the nonexistent item.

Here is an example:

```js
const fooLoader = makeDataLoader("AcmeFoo")(
  ids => loadFooBatch(ids).then(
    items => items.map(item => {
      if (!item) {
        return new Error('not found');
      }
      return item;
    })
  )
);
```

#### Using a predefined TTL

In some contexts, cache invalidation could be impossible or difficult to implement in remote systems. You may still want to leverage Front-Commerce's caching features, such as [the Redis persistent cache](#Redis), to improve performance of your application.

The Redis strategy supports an additional option (to be provided during instantiation) that allows you to create a loader with a specified expiration time for cached items.

Here is how you could use it:

```js
const fooLoader = makeDataLoader("AcmeFoo")(
  ids => loadFooBatch(ids),
  { expire: EXPIRE_TIME_IN_SECONDS } // see https://github.com/DubFriend/redis-dataloader
);
```

#### Caching scalar values

DataLoaders mostly manipulate objects. Hence, it is safer to design your application to return objects from batching functions. This will ensure a wider range of caching strategies' compatibility (ex: Redis strategy does not support caching of scalar values).

```js
const fooLoader = makeDataLoader("AcmeFoo")(
  ids => loadFooBatch(ids).then(
    results => results.map(result => ({ value: result }))
  )
);

// …

return fooLoader.load(id).then(data => data.value)
```

## Helpers available to create dataLoaders

Writing batching functions and loaders could lead to reusing the same patterns. We have extracted some utility functions to help you in this task.

One can find them in the [`server/core/graphql/dataloaderHelpers`](https://gitlab.com/front-commerce/front-commerce/blob/master/src/server/core/graphql/dataloaderHelpers.js) module.

### `reorderForIds`

Batch functions must satisfy two constraints to be used in a DataLoader (from the [graphql/dataloader documentation](https://github.com/graphql/dataloader#batch-function)):

> * The Array of values must be the same length as the Array of keys.
> * Each index in the Array of values must correspond to the same index in the Array of keys.

`reorderForIds` will ensure that these constraints are satisfied.

Signature: `const reorderForIds = (ids, idKey = "id") => data => sortedData;`

It will sort `data` by `idKey` to match the order from the `ids` array passed in parameters. In case no matching values is found, it will return `null` and log a message so you could then understand why no result was found for a given id.

Example:

```js
// skus will very likely be a param of your batch loader
const skus = ["P01", "P02", "P03"];

return axiosInstance
  .get("/frontcommerce/price", {
    params: {
      skus: skus.join(',')
    }
  })
  .then(response => {
    const prices = response.data
    /* [
      {sku: "P02", price: 12},
      {sku: "P03", price: 13},
      {sku: "P01", price: 11},
    ] */
    return prices;
  })
  // results will be sorted according to the initial skus passed (P01, P02, P03)
  .then(reorderForIds(skus, "sku"));
```

### `reorderForIdsCaseInsensitive`

As its name implies, it is very similar to `reorderForIds` but ids are compared in a case insensitive way.

Example:

```js
return axiosInstance
  .get(`/products`, { params: searchCriteria })
  .then(response => response.data.items.map(convertMagentoProductForFront))
  .then(reorderForIdsCaseInsensitive(skus, "sku"));
```

### `makeBatchLoaderFromSingleFetch`

Until now, we created batching functions using a remote API that allowed to request several results at once (`https://inventory.example.com/stocks?skus=PANT-01,PANT-02,…,PANT-10`).

When using 3rd party APIs or legacy systems, such APIs might not always be available. Using dataLoaders in this case will not allow you to reduce the number of requests in the absolute, however it could still allow you to prevent most of these requests (or reduce its number in practice) thanks to [caching](#Caching). It is thus very convenient when dealing with a slow service.

The `makeBatchLoaderFromSingleFetch` allows you to create a batching function from a single fetching function easily.

Pseudo signature:

```
makeBatchLoaderFromSingleFetch = (
  function singleFetch, // function that fetches data for a single id
  function singleResponseMapper = ({ data }) => data // function that transform a response into data
) => ids => Observable(sortedData);
```

Example (from [the Magento2 category loader](https://gitlab.com/front-commerce/front-commerce/-/blob/6ba7ceed3244c47f1c75e03a60c8a5e87a3f5104/src/server/modules/magento1/catalog/categories/categoryLoader.js#L6)):

```js
import { makeBatchLoaderFromSingleFetch } from "server/core/graphql/dataloaderHelpers";

// …
const loadBatch = makeBatchLoaderFromSingleFetch(
  id => axiosInstance.get(`/categories/${id}`),
  response => convertCategoryMainAttributesForFront(response.data)
);

const loader = makeDataLoader("CatalogCategory")(ids =>
  loadBatch(ids).toPromise() // <-- note the `toPromise()` here
);
```

<blockquote class="note">
  Please note that `makeBatchLoaderFromSingleFetch` returns an Observable. You must thus convert it to a Promise using the `.toPromise()` method.
</blockquote>

## Caching dataLoaders data

By default, all dataLoaders are using a **per-request in-memory caching strategy**. It means that during the same GraphQL query, the same data will only be requested once.

Front-Commerce is also shipped with a persistent cache implementation, using a Redis strategy (see [Caching strategies](#Caching-strategies)). One can implement new strategies to support more services (we also can help and support more strategies, please [contact us](mailto:contact@front-commerce.com)).

The DataLoader cache must be configured in the [`config/caching.js` configuration file](/docs/reference/configurations.html#config-caching-js). Please refer to the reference documentation for further details or read the following section to choose the most relevant strategies for your context.

## Caching strategies

This section provides details about the available strategies implementations in Front-Commerce. They can be used by using them in the `implementation` key of your caching strategies configuration.

### `Redis`

The `Redis` implementation allows to cache data in a redis server.

It uses node's [`redis` package](https://www.npmjs.com/package/redis) as a redis client. Please refer to the package documentation for [all the available options](https://www.npmjs.com/package/redis#options-object-properties).

Here is a configuration example:

```js
// my-module/config/caching.js
export default {
  strategies: [
    {
      implementation: "Redis",
      supports: "*",
      config: {
        // see https://www.npmjs.com/package/redis#options-object-properties
        host: "127.0.0.1",
        port: 6379,
        db: 1
      }
    }
  ]
};
```

### `PerMagentoCustomerGroup`

<blockquote class="feature--new">
_Since version 2.0.0-rc.0_
</blockquote>

The `PerMagentoCustomerGroup` implementation is a decorator that is specific to Magento 1 and Magento 2 modules. It will decorate the existing caching strategies so that DataLoader keys are specific to the current customer group. We highly recommend to use it on Magento stores that have price per group, so they can leverage other caching mechanisms (such as `Redis`).

It is possible to provide a default group to use as scope for guest users.

Here is a configuration example:

```js
// my-module/config/caching.js
export default {
  strategies: [
    // The PerMagentoCustomerGroup strategy MUST be registered after a persistent cache implementation
    // because it has no effect in the context of the default per-request in-memory caching.
    {
      implementation: "Redis",
      supports: "*",
      config: {
        host: "127.0.0.1"
      }
    },
    {
      implementation: "PerMagentoCustomerGroup",
      // Will scope all data from the CatalogPrice DataLoader with the customer group
      // (and other relevant price data loaders)
      // before they are transmitted to the previous strategy (Redis).
      // Other dataLoaders will use Redis storage in a standard fashion.
      supports: [
        "CatalogPrice",
        "CatalogProductChildrenPrice",
        "CatalogProductBundlePrice",
      ],
      config: {
        defaultGroupId: 0
      }
    }
  ]
};
```

### `PerCurrency`

<blockquote class="feature--new">
_Since version 2.2.0_
</blockquote>

The `PerCurrency` implementation is a decorator that is specific to Magento 1 integrations. It will decorate the existing caching strategies so that DataLoader keys are different depending on the store's currency selected by the user. This is only useful if a store has multiple currencies ([`config/stores.js::availableCurrencies`](/docs/advanced/production-ready/multistore.html#Multiple-currencies)). It should be used on any DataLoader that returns a price value based on the user's session.

Here is a configuration example:

```js
// my-module/config/caching.js
export default {
  strategies: [
    // The PerCurrency strategy MUST be registered after a persistent cache implementation
    // because it has no effect in the context of the default per-request in-memory caching.
    {
      implementation: "Redis",
      supports: "*",
      config: {
        host: "127.0.0.1"
      }
    },
    {
      implementation: "PerCurrency",
      supports: [
        "CatalogPrice",
        "CatalogProductChildrenPrice",
        "CatalogProductBundlePrice",
      ],
    },
  ]
};
```

### `PerMagentoAdminRole`

<blockquote class="feature--new">
_Since version 2.1.0_
</blockquote>

The `PerMagentoAdminRole` implementation is a decorator that is specific to Magento 2 integrations. It will decorate the existing caching strategies so that DataLoader keys are different for admin users and customers. This is useful if a custom Magento API returns a different result for admins and normal customers.

Here is a configuration example:

```js
// my-module/config/caching.js
export default {
  strategies: [
    // The PerMagentoAdminRole strategy MUST be registered after a persistent cache implementation
    // because it has no effect in the context of the default per-request in-memory caching.
    {
      implementation: "Redis",
      supports: "*",
      config: {
        host: "127.0.0.1"
      }
    },
    {
      implementation: "PerMagentoAdminRole",
      supports: ["CatalogProduct"],
    },
  ]
};
```

### Advanced usage

If you need additional implementations or want to leverage strategies for a specific use case, please [contact us](mailto:contact@front-commerce.com) so we can discuss it and guide you!

## Invalidating the cache

For persistent cache, it is necessary that remote systems invalidate cache when relevant.

Front-Commerce provides several endpoints for it. They respond to `GET` or `POST` queries and are secured with a token to be passed in a `auth-token` header.
The expected token must be configured with the [`FRONT_COMMERCE_CACHE_API_TOKEN` environment variable](/docs/reference/environment-variables.html#Cache).

### `POST` for batched invalidations

<blockquote class="feature--new">
_Since version 2.1.0_
</blockquote>

This is the recommended way to invalidate cache. It allows to invalidate several entries in one HTTP call which is more efficient.

* Endpoint: `/_cache` invalidate all data from the scopes sent in the body
* Body: list of cache invalidation descriptor with the following object keys
  * `scope`: shop code (for instance one store)
  * `key`: loader key to invalidate
  * `id`: single id to invalidate for the `key` loader (in the given `scope`)

For each key of the invalidation descriptor, it is possible to define the value `"all"` (reserved keyword) to invalidate every defined object. See the example below.

Example:
```
[
  { scope: "default", key: "CatalogProduct", id: "VSK12" },
  { scope: "default", key: "all", id: "VSK13" },
  { scope: "all", key: "CatalogCategory", id: "42" },
  { scope: "default", key: "CmsPage", id: "all" },
]
```

<blockquote class="info">
  The payload is [limited to 1Mb by default](https://gitlab.com/front-commerce/front-commerce/-/blob/2af896b935b2ead5d1ea5b76bc6109b1a3f56ecd/src/server/express/config/expressConfigProvider.js#L10) to prevent abuses. You can extend this limit using configurations. See ["I cannot `POST` a big payload to the server
"](/docs/appendices/troubleshooting.html#I-cannot-POST-a-big-payload-to-the-server) for a way to define a greater value.
</blockquote>

### `GET` for atomic invalidations

These endpoints were the first ones implemented in Front-Commerce. They are less efficient than batching invalidations, but may be more convenient for webhooks or simple scripts.

* `/_cache`: invalidate all data in persistent cache
* `/_cache/:scope`: invalidate all data for a given scope (for instance one store)
* `/_cache/:scope/:key`: invalidate all data of a given loader (matching `:key`) for a given store
* `/_cache/:scope/:key/:id`: invalidate cached data for a single id of a given loader in a given store

> **Note:** our Magento 2 and Magento 1 extensions handles cache invalidation by default, please refer to their respective documentations to learn how to add your own invalidation logic (for custom Magento entities).

## Troubleshooting

Front-Commerce provides a way to debug several aspects of the caching layer. You can use the [`DEBUG="front-commerce:cache"` environment variable](/docs/reference/environment-variables.html#Debugging) to view information about caching strategies used for a GraphQL query, along with cache invalidation requests received by your Front-Commerce server.
