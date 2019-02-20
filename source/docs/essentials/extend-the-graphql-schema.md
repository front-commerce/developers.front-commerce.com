---
id: extend-the-graphql-schema
title: Extend the GraphQL schema
---

When developing an e-commerce store, you might at some point need to expose new data in
your [unified GraphQL schema](https://principledgraphql.com/integrity#1-one-graph) to support new features and allow frontend developers to use them.


**Front-Commerce’s GraphQL modules** is the mechanism allowing to extend and override any part of the
schema defined by other modules. It leverages features from the GraphQL Schema Definition Language (<abbr title="Schema Definition Language">SDL</abbr>).

Front-Commerce’s core and platforms integrations (such as Magento2) are implemented as GraphQL modules too.

<blockquote class="info">
The concepts documented below have been adopted by many actors in the GraphQL ecosystem
since our initial implementation years ago.
On our road to 1.0.0, we have opened a <abbr title="Request For Comments">RFC</abbr> in [#44](https://gitlab.com/front-commerce/front-commerce/issues/44)
to discuss using an external library sharing the same principles instead of maintaining our
own implementation. **The migration path would be seamless if we chose to migrate to this library.**
Please do not hesitate to share your thoughts with us there.
</blockquote>

In order to extend the schema, you will have to:
1. register the GraphQL module in the Front-Commerce application
2. implement the GraphQL module itself using the API provided

## Register a GraphQL module

Front-Commerce allows you to manage your modules in the `serverModules` key of the [`.frontcommerce.js`](#TODO) file located in your project’s root.

Let’s add a `HelloWorld` module!

To add a new GraphQL module, add it to the existing list:

```diff
module.exports = {
  name: "Front-Commerce",
  url: "https://www.front-commerce.test",
  modules: ["./src"],
  serverModules: [
    { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "HelloWorld", path: "./src/server/modules/hello-world" }
  ]
};
```

The `name` key must be unique across your server modules. It is a temporary name that is used during a code generation step and has no other usage in the application.

The `path` must be a path to your module definition file (see below).

<blockquote class="info">
**In depth:** under the hood, Front-Commerce is generating a `.front-commerce/modules.js` file from this configuration which is loaded very early in the server bootstrapping process. The name is used to import the correct module and export it in an homogeneous list, used by the `withGraphQLApi` express middleware.
</blockquote>

## Implement a GraphQL module

A Front-Commerce GraphQL module has to export an object containing the different services it provides.

In the previous GraphQL module registration example, the module definition file would be located at
`src/server/modules/hello-world/index.js` with other module files in the same directory.

Below are documented the available keys to define a Front-Commerce GraphQL module.

### `namespace`

The simplest (but useless) GraphQL module only requires an unique `namespace` key:

```js
// A minimal Front-Commerce GraphQL module that basically does nothing
module.exports = {
  namespace: "Acme/HelloWorld"
};
```

This `namespace` can be used by other modules as a dependency, to ensure another module has been registered in the application.

### `dependencies` (optional)

A list of module namespaces which must have been registered in the application. Dependencies will be initialized before this module.

Example:

```js
module.exports = {
  namespace: "Acme/HelloWorld",
  dependencies: ["Acme/Core"],
  // …
};
```

<blockquote class="warning">
**Note:** we recommend to try to avoid dependencies between your modules. Usually this is a smell that the schema may be implemented differently and modules are too coupled together. A good use case is for instance to depend on a Front-Commerce core module.
</blockquote>

<blockquote class="info">
**In depth:** modules are sorted using the [toposort](https://www.npmjs.com/package/toposort) library. See `flattenAndReorderModulesUsingDependencies` code and tests to understand the implementation
</blockquote>

### `typeDefs` (optional)

GraphQL type definitions provided by this module. As a developer, this is a contract with the rest of your codebase.

Type definitions must [GraphQL schema language strings](https://graphql.org/learn/schema/), and can be declared inline or loaded from a `gql` file. One can create new types, add top level queries (by extending the `Query` type), mutations or extend types from other modules.

```js
// or import typeDefs from './schema.gql';
const typeDefs = `
extend type Query {
  "Be polite!"
  sayHello (name: String!): Message
}

type Message {
  response: String
  audio: String
}
`

module.exports = {
  namespace: "Acme/HelloWorld",
  typeDefs: typeDefs
};
```

<blockquote class="info">
**In depth:** under the hood, all module’s `typeDefs` are merged in a single array passed to graphql-tools' [`makeExecutableSchema`](https://www.apollographql.com/docs/graphql-tools/generate-schema.html#makeExecutableSchema) function
</blockquote>

### `resolvers` (optional)

This is an object containing all the resolvers for resolving fields defined in the schema (usually from your `typeDefs`). This is where the implementation resides.

Resolver map must follow [the format documented in Apollo Tools](https://www.apollographql.com/docs/graphql-tools/resolvers.html).

```js
// or import resolvers from './resolvers.js';
const resolvers = {
  Query: {
    sayHello: (_, { name }) => {
      const message = `Hello ${name}`;
      return {
        message: message,
        audio: `https://tts.service.com/q=${message}`
      };
    }
  }
};

module.exports = {
  namespace: "Acme/HelloWorld",
  // …
  resolvers: resolvers
};
```

<blockquote class="info">
**In depth:** under the hood, all module’s `resolvers` are merged in a single object (using [lodash.merge](https://lodash.com/docs/#merge) passed to graphql-tools' [`makeExecutableSchema`](https://www.apollographql.com/docs/graphql-tools/generate-schema.html#makeExecutableSchema) function. It is possible to override resolvers declared in another module by declaring it as a dependency and registering a local resolver.
</blockquote>

### `contextEnhancer` (optional)

The `contextEnhancer` module definition key should be a function that initializes code that will be made available in GraphQL’s context, under the `loaders` key. **It is specific to Front-Commerce.**

This is where you could construct models or [dataloaders](#TODO) that should be used in your GraphQL resolvers.

The `contextEnhancer` function must return an object whose keys will be merged with previous modules’. It will be passed a single argument with the following keys:

* `req`: the current server request
* `loaders`: current loaders (from module initialized beforehand)
* `makeDataLoader`: a factory to build a dataloader (see [dataloaders](#TODO))
* `config`: the global configuration

Here is an example:

```
const MessageLoader = require("./loader");

module.exports = {
  namespace: "Acme/HelloWorld",
  resolvers: {
    Query: {
      sayHello: (_, { name }, { loaders }) => {
        return loaders.Message.load(`Hello ${name}`);
      }
    }
  }
  contextEnhancer: ({ req, loaders, makeDataLoader, config }) => {
    return {
      Message: MessageLoader(makeDataLoader)(config.apiBaseUrl)
    }
  }
}
```

## Grouping small modules in a « meta-module »

We recommend to keep your GraphQL modules small and focused on a single feature.
If several teams are working on the project, small modules are a way to [federate the graph implementation](https://principledgraphql.com/integrity#2-federated-implementation).
It also makes it easier to change implementations and service providers later in the project.
For instance you could replace a `Magento2/Cms` module with a `Wordpress/Cms` one without impacting
the web application (as soon as both schema shares a common API).

But having a lot of different modules could make distribution more tedious.
That is why Front-Commerce supports the concept of « meta-modules », which are a way to group
smaller modules together.

For instance, [Front-Commerce’s Magento2 integration](#TODO) can be registered in your project
using only one line if you want all the features:

```diff
// .front-commerce.js
module.exports = {
  name: "Front-Commerce",
  url: "https://www.front-commerce.test",
  modules: [],
  serverModules: [
-    { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" }
+    { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
+    { name: "Magento2", path: "server/modules/magento2" }
  ]
};
```

Under the hood, it imports several modules at once (`Magento2/Cms`, `Magento2/Catalog`, `Magento2/Checkout`, `Magento2/Search`…).

For a module to be considered as a meta-module, you only need to expose a list of
sub-modules in the `modules` key of the module definition (along with the namespace).

Here is an example from Magento2 meta-module:

```js
// node_modules/front-commerce/src/server/modules/magento2/index.js
import Cart from "./cart";
// […]

module.exports = {
  namespace: "Magento2",
  modules: [
    Cart,
    // […]
  ]
};
```

## Example module definition

Front-Commerce itself is written as GraphQL modules. You can browse Front-Commerce’s source code to
find more examples and understand how it works.

Here is for instance how Magento2 CMS module’s entrypoint looks like:

```js
const { makeUserClientFromRequest } = require("../magento2Connector/factories");

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