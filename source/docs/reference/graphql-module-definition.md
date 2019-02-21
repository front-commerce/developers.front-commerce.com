---
id: graphql-module-definition
title: GraphQL module definition
---

**Front-Commerce’s GraphQL modules** is the mechanism allowing to extend and override any part of the schema defined by other modules.

<blockquote class="info">
To get started with GraphQL modules, we recommend you to read the [Extend the GraphQL schema](/docs/essentials/extend-the-graphql-schema.html) documentation page.
</blockquote>

A Front-Commerce GraphQL module has to export an object containing its definition.
This page contains the API different keys available in a GraphQL module’s definition.

## `namespace`

The simplest (but useless) GraphQL module definition only requires an unique `namespace` key:

```js
// A minimal Front-Commerce GraphQL module that basically does nothing
module.exports = {
  namespace: "Acme/HelloWorld"
};
```

This `namespace` can be used by other modules as a dependency, to ensure another module has been registered in the application.

## `modules` (optional)

The `modules` key is useful when creating a
[meta module](/docs/advanced/graphql/meta-modules.html).
It allows to declare the submodules to be registered when this module is registered.

It should be an array with a list of submodules to be included in the application.

Example:
```js
import Core from "./core";
import FeatureA from "./feature-a";
import FeatureB from "./feature-b";

module.exports = {
  namespace: "Acme/All",
  modules: [
    Core,
    FeatureA,
    FeatureB
  ]
};
```

<blockquote class="info">
**Dependency management:** submodules dependencies will be resolved independently.

It means that if a meta module `A` declares `A1` and `A2` in its `modules` key,
and `A1` depends on module `B` then there is no guarantee that `A2` will be
initialized _after_ `B`.

You should make dependencies explicit either in the meta module definition or in
each submodule definition.
</blockquote>

## `dependencies` (optional)

A list of module namespaces which must have been registered in the application to allow this module to work. Dependencies will be initialized before this module.

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
**In depth:** modules are sorted using the [toposort](https://www.npmjs.com/package/toposort) library. See [`flattenAndReorderModulesUsingDependencies`](https://gitlab.com/front-commerce/front-commerce/blob/develop/src/server/core/graphql/__tests__/flattenAndReorderModulesUsingDependencies.js) code and tests for further details.
</blockquote>

## `typeDefs` (optional)

GraphQL type definitions provided by this module. As a developer, this is a contract with the rest of your codebase.

Type definitions must be [GraphQL schema language](https://graphql.org/learn/schema/) strings, and can be declared inline or loaded from a `.gql` file.

You can create new types, add top level queries (by extending the `Query` type), mutations or extend types from other modules.

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

## `resolvers` (optional)

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

## `contextEnhancer` (optional)

The `contextEnhancer` module definition key should be a function that initializes code that will be made available in GraphQL’s context, under the `loaders` key. **It is specific to Front-Commerce.**

<blockquote class="info">
This is where you could construct models or [dataloaders](#TODO) that should be used in your GraphQL resolvers. See [Slim down resolvers with loaders](/docs/advanced/graphql/slim-down-resolvers-with-loaders.html) for more information.
</blockquote>

The `contextEnhancer` function must return an object whose keys will be merged with previous modules’. It will be passed a single argument with the following keys:

* `req`: the current server request
* `loaders`: current loaders (from module initialized beforehand)
* `makeDataLoader`: a factory to build a dataloader (see [dataloaders](#TODO))
* `config`: the global configuration

Example:
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