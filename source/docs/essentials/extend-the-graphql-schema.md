---
id: extend-the-graphql-schema
title: Extend the GraphQL schema
---

When developing an e-commerce store, you might at some point need to expose new
data in your
[unified GraphQL schema](https://principledgraphql.com/integrity#1-one-graph) to
support new features and allow frontend developers to use them.

<blockquote class="info">
  The concepts documented below have been adopted by many actors in the GraphQL
  ecosystem since our initial implementation years ago. On our road to 1.0.0, we
  have opened a <abbr title="Request For Comments">RFC</abbr> in
  [#44](https://gitlab.com/front-commerce/front-commerce/issues/44) to discuss
  using an external library sharing the same principles instead of maintaining
  our own implementation. **The migration path would be seamless if we chose to
  migrate to this library.** Please do not hesitate to share your thoughts with
  us there.
</blockquote>

**Front-Commerce’s GraphQL modules** is the mechanism allowing to extend and
override any part of the schema defined by other modules. It leverages features
from the GraphQL Schema Definition Language
(<abbr title="Schema Definition Language">SDL</abbr>).

Front-Commerce’s core and platforms integrations (such as Magento2) are
implemented as GraphQL modules too.

This page will guide you through the process of exposing a new feature in your
GraphQL schema. We will create a GraphQL module that allows to maintain a
counter of clicks for a product.

You will learn to:

1. create a new GraphQL module
2. register the GraphQL module in the Front-Commerce application
3. implement the GraphQL module itself: add a field to the `Product` type and
   add a new `Mutation` to the schema

## Create a new GraphQL module

Let’s say that we want to expose a counter of clicks for each product in our
store. We first have to create a `ClicksCounters` GraphQL module.

This GraphQL module should appear in the folder of a Front-Commerce module. For
instance, if the Front-Commerce module is in `my-module`, the GraphQL module
should be in `my-module/server/modules/clicks-counter`. Learn more about
Front-Commerce modules within
[Extend the theme](/docs/essentials/extend-the-theme.html).

In the GraphQL module folder, there should be a definition file
`my-module/server/modules/clicks-counters/index.js` which will set how the
module should behave within your Schema:

```js
// my-module/server/modules/clicks-counters/index.js
export default {
  namespace: "ClicksCounters"
};
```

A GraphQL module has to export an object containing the different services it
provides.

This module is valid even though it does nothing. However, it is not used in
your application yet. You need to register it.

## Register the module in the application

Front-Commerce allows you to manage your modules in the [`serverModules` key of
the `.front-commerce.js` file](/docs/reference/front-commerce-js.html#serverModules) located in your project’s root.

Let’s add a `ClicksCounters` GraphQL module by adding it to the existing list:

```diff
// .front-commerce.js
module.exports = {
  name: "Front-Commerce",
  url: "https://www.front-commerce.test",
  modules: [],
  serverModules: [
    { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "ClicksCounters", path: "./my-module/server/modules/clicks-counters" }
  ]
};
```

The `name` key must be unique across your server modules. It is a temporary name
that is used during a code generation step and has no other usage in the
application. _Do not worry about it, it will be deprecated in a near future: see
[#179](https://gitlab.com/front-commerce/front-commerce/issues/179) for further
information._

The `path` must be a path to your module definition file (created above).

<blockquote class="info">
  **In depth:** under the hood, Front-Commerce is generating a
  `.front-commerce/modules.js` file from this configuration which is loaded very
  early in the server bootstrapping process. The name is used to import the
  correct module and export it in an homogeneous list, used by the
  `withGraphQLApi` express middleware.
</blockquote>

Restart your application.

**Congratulations!** You now have a new custom module ready to enhance the data
exposed in the GraphQL middleware.

## Implement module’s features

All the wiring is now done and it is time to develop the features of this
module. In GraphQL a good practice is to start thinking about the schema, from a
business domain perspective.

It is important to name things with a language shared by the team and prevent
exposing implementation details (ids, different names…) as much as possible. We
recommend the reading of the GraphQL documentation page
[Thinking in Graphs](https://graphql.github.io/learn/thinking-in-graphs/).
<!-- TODO Add a link to detailed explanations about ids and Apollo Client cache -->

Let’s add the code to expose a counter field and a mutation in our graph.

### Define the schema

Front-Commerce lets you describe your schema using the expressive
[GraphQL Schema Definition Language (SDL)](https://graphql.org/learn/schema/#type-language).

Create a `my-module/server/modules/clicks-counters/schema.gql` file to contain
the schema matching our use case.

We would like to:

1. add a `clicksCounter` field to the existing `Product` type
2. add an `incrementProductCounter` mutation

It could look like so:

```graphql
# my-module/server/modules/clicks-counters/schema.gql
extend type Product {
  clicksCounter: Int
}

extend type Mutation {
  incrementProductCounter(sku: String!, incrementValue: Int): MutationSuccess
}
```

<blockquote class="info">
  The `Product` type is part of Front-Commerce’s `Magento2` module. The
  `MutationSuccess` type used as the mutation response type is part of
  Front-Commerce’s core.
</blockquote>

<blockquote class="info">
Please note that it could have been implemented as a top level Query as well:
```graphql
extend type Query {
  clicksCounterByProductSKU(sku: String!): Int
}
```
However we feel it would have been less intuitive for frontend developers. It
may seem more natural for people used to design relational databases or REST
APIs, but we recommend to try limiting as much as possible the number of
top-level queries in your projects to learn _thinking in GraphQL_.

</blockquote>

Then expose the schema using the `typeDefs` key of the module definition. We
recommend to make the dependency to Magento’s Product module explicit by adding
a `dependencies` key. Update the
`my-module/server/modules/clicks-counters/index.js` entrypoint:

```diff
// my-module/server/modules/clicks-counters/index.js
+import typeDefs from "./schema.gql";
+
export default {
-  namespace: "ClicksCounters"
+  namespace: "ClicksCounters",
+  dependencies: [
+    "Magento2/Catalog/Products"
+  ],
+  typeDefs: typeDefs
};
```

<blockquote class="info">
  Webpack is in fact taking care of converting SDL into a Javascript object
  using an appropriate loader.
</blockquote>

**Congratulations again!** You should now be able to see these new fields and
use them in GraphQL, **without even having to restart the application!**

Try to execute the query below in your GraphQL playground (by default at
[http://localhost:4000/playground](http://localhost:4000/playground)):

```graphql
# http://localhost:4000/playground
{
  product(sku: "WH09") {
    sku
    clicksCounter
  }
}
```

Our GraphQL module does not yet have any code for sending content. This means
that even if you can request the `clicksCounter` field, it won't actually return
any data. So you should see the following response:

```json
{
  "data": {
    "product": {
      "sku": "WH09",
      "clicksCounter": null
    }
  }
}
```

Let’s now add some executable logic to our module.

### Implement resolvers

The GraphQL middleware relies on resolver functions to determine the data to
return for a given field. This is where most of the « real work » is done, for
instance by fetching remote datasources or transforming data.

Resolvers are exposed using the `resolvers` key of the module definition. It
should be a
[**Resolver map**](https://www.apollographql.com/docs/graphql-tools/resolvers):
an object where each key is a GraphQL type name, and values are mapping between
field names and resolver function. Resolver functions may return a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
for asynchronous operations.

<blockquote class="more">
  To know more about resolvers and their internals, we recommend the reading of
  [GraphQL Tools resolvers
  documentation](https://www.apollographql.com/docs/graphql-tools/resolvers).
</blockquote>

First, update the module definition as follow:

```diff
// my-module/server/modules/clicks-counters/index.js
import typeDefs from "./schema.gql";
+import resolvers from "./resolvers";

export default {
  namespace: "ClicksCounters",
  dependencies: [
    "Magento2/Catalog/Products"
  ],
-  typeDefs: typeDefs
+  typeDefs: typeDefs,
+  resolvers: resolvers
};
```

And then create the `my-module/server/modules/clicks-counters/resolvers.js` file
with a resolver map as below (we are going to analyze it in details in a few
seconds):

```js
// my-module/server/modules/clicks-counters/resolvers.js
const counters = new Map();

const currentValueOf = sku => counters.get(sku) || 0;

module.exports = {
  Product: {
    clicksCounter: ({ sku }) => currentValueOf(sku)
  },

  Mutation: {
    incrementProductCounter(_, { sku, incrementValue = 1 }) {
      counters.set(sku, currentValueOf(sku) + incrementValue);
      return {
        success: true
      };
    }
  }
};
```

Let’s analyze this code in detail.

#### Returning the counter value for every `Product`

First of all, the exported resolver map defines a resolver for the
`clicksCounter` field of any `Product` field.

```js
// …
module.exports = {
  Product: {
    clicksCounter: ({ sku }) => currentValueOf(sku)
  }
  // …
};
```

It implements data retrieval for the following part of the schema declared
earlier:

```graphql
extend type Product {
  clicksCounter: Int
}
```

The resolver function will use the `sku` key from its parent data and will
return the the current counter value from its local state (defaulting to `0` if
no clicks occured).

It is important to understand that the `sku` is not a parameter provided by
frontend developers in the Query. It comes from data returned by earlier
resolvers that fetched a `Product`, no matter where in the graph (category,
upsells, cart…).

#### Incrementing the counter for a SKU

The second part of this resolver map is a `incrementProductCounter` mutation.
Mutations in GraphQL are a way to modify server-side data, like `POST` requests
in REST (whereas queries allow to read data, like `GET` requests in REST).

GraphQL modules must declare mutations by extending the top-level GraphQL
`Mutation` type. You can read more about Mutations in the
[GraphQL’s Mutations documentation](https://graphql.org/learn/queries/#mutations).

```js
// …
module.exports = {
  // …
  Mutation: {
    incrementProductCounter(_, { sku, incrementValue = 1 }) {
      counters.set(sku, currentValueOf(sku) + incrementValue);
      return {
        success: true
      };
    }
  }
};
```

In this resolver, the first parameter is unused because in a top level resolver
there is no _parent data_. The second parameter contains arguments passed to the
mutation. These arguments are the `(sku: String!, incrementValue: Int)` part of
the schema definition declared earlier:

```graphql
extend type Mutation {
  incrementProductCounter(sku: String!, incrementValue: Int): MutationSuccess
}
```

The resolver will:

1. use the mandatory `sku` argument to fetch the current counter value from its
   local state
2. increment the counter value of the `incrementValue` optional argument. If the
   `incrementValue` argument has not been defined explicitely in the GraphQL
   request, it defaults to `1`.
3. set this new incremented value for the counter
4. finally, return a value matching the `MutationSuccess` Front-Commerce type
   which in this example is always successful (`{success: true}`).
   <!-- TODO Add a reference page (and link it from here) for the MutationSuccess type -->

<blockquote class="info">
  ProTip™: you can debug the data passed in a resolver using `console.log` to
  view its shape in your server console shell output. To do so, a convenient
  thing to know is that `console.log` returns a falsy value. Hence, in the
  resolver above you could debug the `sku` value by updating the resolver as
  below:

```diff
-clicksCounter: ({sku}) => currentValueOf(sku),
+clicksCounter: ({sku}) => console.log(sku) || currentValueOf(sku),
```

</blockquote>

**Awesome!** Your GraphQL server now has a new feature, let’s use it!

### Query your new graph

Try to execute the previous query again in your GraphQL playground:

```graphql
# http://localhost:4000/playground
{
  product(sku: "WH09") {
    sku
    clicksCounter
  }
}
```

You must now have a real value returned!

```json
{
  "data": {
    "product": {
      "sku": "WH09",
      "clicksCounter": 0
    }
  }
}
```

You can even increment the counter by sending a Mutation to your server:

```graphql
# http://localhost:4000/playground
mutation {
  incrementProductCounter(sku: "WH09", incrementValue: 2) {
    success
  }
}
```

If it was successful, the above query must now return `2` in the `clicksCounter`
field.

### Asynchronous resolvers

In the previous example resolvers were synchronous, meaning that they returned a
value that was immediately available. Most of the time, your resolvers will
fetch data from a remote service and return them asynchronously using a
`Promise`.

Returning `Promise` from resolvers is supported out of the box. Here is an
example of turning the previous resolvers to asynchronous ones:

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

## Make it scale!

Over time your resolvers may grow and contain more business logic. See
[Slim down resolvers with loaders](/docs/advanced/graphql/slim-down-resolvers-with-loaders.html)
to learn how you could extract logic from your resolvers and keep them easy to
understand.
