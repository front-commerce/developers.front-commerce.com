---
id: slim-down-resolvers-with-loaders
title: Slim down resolvers with loaders
---

GraphQL modules may grow over time depending on the features they provide, and
remote services they interact with. GraphQL resolvers will then have more and
more code, and very often require developers to introduce an abstraction
**containing all the business logic to keep code maintainable and increase
testability.**

In Front-Commerce’s core and platforms integrations (such as Magento2) we have
introduced the concept of _« loaders »_ to achieve this.

This page explains what loaders are and how you can create them. This will also
help you better understand the Front-Commerce's core code.

<blockquote class="info">
  If you have used Apollo Server recently, you might already be familiar with a
  similar pattern named [data
  sources](https://www.apollographql.com/docs/tutorial/data-source.html). It is
  also similar to [GrAMPS’s
  models](https://gramps-graphql.github.io/gramps-express/data-source/tutorial-model/).
</blockquote>

## Why loaders?

When resolvers grow, you will likely extract functions or modules to share code
between resolvers. It can be: constructing an `axios` instance with the correct
URL and headers, modifying responses to return objects matching the GraphQL
schema or error management for instance.

Loaders are aimed at being node modules encapsulating all your domain/API
specific code. We recommend to design them as pure JS modules without any
dependency on Front-Commerce or GraphQL features. Designing loaders with this
approach has several advantages:

- you can reuse existing code or libraries from another project
- if you migrate away from Front-Commerce, this code could be reused easily in
  your new application (as soon as it is in a Javascript environment of course)
- testability: the code from both your resolvers and loaders would be easier to
  test. You could inject fakes or mock loaders to test resolvers, and you could
  test loaders without the complexity of a GraphQL context since they are pure
  JS modules.
- code sharing: under some circumstances you may also find convenient to share
  code between your server and react application (for data validation or
  transformation)

## What are loaders?

In short: **loaders can be anything you feel relevant to your use case.**

We recommend to use patterns that your team understands: classes, pure functions
or a mix between both approaches. It could be in-memory data transformation as
well as data fetching code.

The most important is to make it independent from the infrastructure (express
server, GraphQL implementation…) by injecting parameters or configuration
extracted from the environment (request or server configuration) where relevant.

In Front-Commerce’s core GraphQL module, you will often find loaders exposing a
_repository-like_ interface. Here is for instance the functions exposed by
Magento2’s product loader:

- `load(sku: string)`
- `loadBySkus(skus: array)`
- `loadByCategory(categoryId: int, paginationCriteria: object)`
- `countInCategory(categoryId: int)`
- `loadUpsellsOf(sku: string, paginationCriteria: object)`
- `loadRelatedOf(sku: string, paginationCriteria: object)`
- `loadCrosssellsOf(sku: string, paginationCriteria: object)`

Each function is responsible for calling Magento’s REST API (with error
management and headers corresponding to the current user) and formatting results
according to the GraphQL schema.

<blockquote class="info">
  **Prototype.** When prototyping or designing your GraphQL module, we have
  found convenient to start with fake implementations of loaders returning
  hardcoded static data. It allows to have an executable schema earlier, that
  could serve as a starting point for both frontend and backend developers.
</blockquote>

<blockquote class="info">
  **Be _lean_.** In a project, you could also start with a simple solution (such
  as reading data from a local CSV file) and add more advanced features (such as
  an admin interface to manage these data) later in the project. Loaders would
  then be the only part of your code to adapt to this complexity.
</blockquote>

## Refactoring to loaders

We will go through the process of extracting business logic from resolvers to a
loader and discover the different tools provided by Front-Commerce to achieve
this.

### Initial resolvers

For this example, we will reuse loaders from the example used in the
[Extend the GraphQL schema](/docs/essentials/extend-the-graphql-schema.html#Implement-resolvers)
guide.

Here is the initial code we will refactor:

```js
// my-module/server/modules/clicks-counters/resolvers.js
const counters = new Map();

const currentValueOf = sku => {
  return new Promise(resolve => {
    setTimeout(() => {
      const currentValue = counters.get(sku) || 0;
      resolve(currentValue);
    }, Math.random() * 3000);
  });
};

module.exports = {
  Product: {
    clicksCounter: ({ sku }) => currentValueOf(sku)
  },

  Mutation: {
    incrementProductCounter(_, { sku, incrementValue = 1 }) {
      return currentValueOf(sku)
        .then(currentValue => counters.set(sku, currentValue + incrementValue))
        .then(() => ({
          success: true
        }));
    }
  }
};
```

### Extract code in a loader

Let’s start by creating a new `loader.js` file with our loader module.

```js
// my-module/server/modules/clicks-counters/loader.js
const counters = new Map();

const currentValueOf = sku => {
  return new Promise(resolve => {
    setTimeout(() => {
      const currentValue = counters.get(sku) || 0;
      resolve(currentValue);
    }, Math.random() * 3000);
  });
};

const incrementValueOf = (sku, increment) => {
  return currentValueOf(sku).then(currentValue =>
    counters.set(sku, currentValue + increment)
  );
};

export default {
  loadBySku: sku => currentValueOf(sku),
  incrementBySku: (sku, increment) => incrementValueOf(sku, increment)
};
```

You can then update the resolvers to use this loader:

```diff
// my-module/server/modules/clicks-counters/resolvers.js
-const counters = new Map();
+import CounterLoader from "./loader";

-const currentValueOf = sku => {
-  return new Promise(resolve => {
-    setTimeout(() => {
-      const currentValue = counters.get(sku) || 0;
-      resolve(currentValue);
-    }, Math.random() * 3000);
-  });
-};
-
module.exports = {
  Product: {
-    clicksCounter: ({ sku }) => currentValueOf(sku)
+    clicksCounter: ({ sku }) => CounterLoader.loadBySku(sku)
  },

  Mutation: {
    incrementProductCounter(_, { sku, incrementValue = 1 }) {
-      return currentValueOf(sku)
-        .then(currentValue => counters.set(sku, currentValue + incrementValue))
+      return CounterLoader.incrementBySku(sku, incrementValue)
        .then(() => ({
          success: true
        }));
    }
  }
};
```

### Using GraphQL context for Dependency Injection

However, in the above example, resolvers are tightly coupled to the current
implementation. We recommend to leverage GraphQL’s context to inject a loader to
resolvers to solve this issue and improve the design.

The GraphQL context is (according to
[GraphQL.org](https://graphql.org/learn/execution/#root-fields-resolvers)):

> A value which is provided to every resolver and holds important contextual
> information like the currently logged in user, or access to a database.

In Front-Commerce (and most GraphQL implementations), the `context` is passed as
the 3rd argument of a resolver function.

Let’s refactor resolvers to use a loader from the context instead of importing
it:

```diff
// my-module/server/modules/clicks-counters/resolvers.js
-import CounterLoader from "./loader";
-
module.exports = {
  Product: {
-    clicksCounter: ({ sku }) => CounterLoader.loadBySku(sku)
+    clicksCounter: ({ sku }, _, { loaders }) => {
+      return loaders.Counter.loadBySku(sku);
+    }
  },

  Mutation: {
-    incrementProductCounter(_, { sku, incrementValue = 1 }) {
+    incrementProductCounter(_, { sku, incrementValue = 1 }, { loaders }) {
-      return CounterLoader.incrementBySku(sku, incrementValue)
+      return loaders.Counter.incrementBySku(sku, incrementValue)
        .then(() => ({
          success: true
        }));
    }
  }
};
```

**You might be wondering why we used the `loaders` value from the context, and
(more important) how this object was created… this is what we will learn in the
next section!**

### Registering a loader in Front-Commerce’s GraphQL context

For the previous refactoring to work, we must register our loader in GraphQL’s
context so the `loaders.Counter` could be used.

In Front-Commerce’s GraphQL modules, you can achieve this using the
[`contextEnhancer`](/docs/reference/graphql-module-definition.html#contextEnhancer-optional)
key of your module definition.

This function is called by Front-Commerce during each request for all GraphQL
modules, to construct the GraphQL `context.loaders` object. Each module can
build loaders and make them available in the context by returning an object to
be merged with previously declared loaders.

Let’s update the module definition to register a `Counter` loader:

```diff
// my-module/server/modules/clicks-counters/index.js
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";
+import CounterLoader from "./loader";

export default {
  namespace: "ClicksCounters",
  typeDefs: typeDefs
  typeDefs: typeDefs,
-  resolvers: resolvers
+  resolvers: resolvers,
+  contextEnhancer: (params) => {
+    return {
+      Counter: CounterLoader
+    };
+  }
};
```

<blockquote class="info">
  Please refer to the [GraphQL module definition
  reference](/docs/reference/graphql-module-definition.html#contextEnhancer-optional)
  for the exact signature and a more complex example.
</blockquote>

## Supporting advanced use cases

The refactoring explained above enable a wide range of use cases. We encourage
you to get used to this pattern and explore the following documentation pages to
see how you could combine them to achieve your goals.

<blockquote class="wip">
  The content below is currently being written. If you need more detailed
  information, please [contact us](mailto:contact@front-commerce.com). We will
  make sure to answer you in a timely manner.

<ul>
  <li>optimize remote data fetching with dataloaders</li>
  <li>interacting with Magento2 REST API</li>
  <li>accessing the user session</li>
  <li>
    using [GraphQL modules
    dependencies](/docs/reference/graphql-module-definition.html#dependencies-optional)
    to extend an existing loader
  </li>
</ul>

  </blockquote>

Let’s now take a look at a _real-world_ module definition as an example.

## Example from the core

Front-Commerce itself is written as GraphQL modules. You can browse
Front-Commerce’s source code to find more examples and understand how it works.

Here is for instance how Magento2 CMS module’s definition looks like. You should
see several patterns mentioned previously and get ideas about applying them in
your application:

```js
const {
  makeUserClientFromRequest
} = require("server/modules/magento2/core/factories");

const typeDefs = require("./schema.gql");
const resolvers = require("./resolvers");
const { CmsBlockLoader, CmsPageLoader } = require("./loaders");

module.exports = {
  namespace: "Magento2/Cms",
  dependencies: [
    "Magento2/Store" // loaders need the store loader to get the store id
  ],
  typeDefs,
  resolvers,
  contextEnhancer: ({ req, loaders, makeDataLoader, config }) => {
    const axiosInstance = makeUserClientFromRequest(
      config.magentoEndpoint,
      req
    );

    return {
      CmsPages: CmsPageLoader(makeDataLoader)(axiosInstance, loaders.Store),
      CmsBlocks: CmsBlockLoader(makeDataLoader)(axiosInstance, loaders.Store)
    };
  }
};
```

As you can see, the `contextEnhancer` is a bridge between the infrastructure
layer (request, caching strategies, configuration) and loaders. It creates
loader instances that could then be reused in resolvers, hiding Magento’s
specific concerns from them… leading to code easier to understand and maintain!
