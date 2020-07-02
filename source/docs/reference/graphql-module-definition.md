---
id: graphql-module-definition
title: GraphQL module definition
---

**Front-Commerce’s GraphQL modules** is the mechanism allowing to extend and
override any part of the schema defined by other modules.

<blockquote class="info">
  To get started with GraphQL modules, we recommend you to read the [Extend the
  GraphQL schema](/docs/essentials/extend-the-graphql-schema.html) documentation
  page.
</blockquote>

A Front-Commerce GraphQL module has to export an object containing its
definition. This page contains the API different keys available in a GraphQL
module’s definition.

## `namespace`

The simplest (but useless) GraphQL module definition only requires an unique
`namespace` key:

```js
// A minimal Front-Commerce GraphQL module that basically does nothing
export default {
  namespace: "Acme/HelloWorld"
};
```

This `namespace` can be used by other modules as a dependency (see
[`dependencies`](#dependencies-optional)), to ensure another module has been
registered in the application.

## `modules` (optional)

The `modules` key is useful when creating a
[meta module](/docs/advanced/graphql/meta-modules.html). It allows to declare
the submodules to be registered when this module is registered.

It should be an array with a list of submodules to be included in the
application.

Example:

```js
import Core from "./core";
import FeatureA from "./feature-a";
import FeatureB from "./feature-b";

export default {
  namespace: "Acme/All",
  modules: [Core, FeatureA, FeatureB]
};
```

<blockquote class="info">
  <p>
    **Dependency management:** submodules dependencies will be resolved
    independently.
  </p>
  <p>
    It means that if a meta module `A` declares `A1` and `A2` in its `modules`
    key, and `A1` depends on module `B` then there is no guarantee that `A2`
    will be initialized _after_ `B`.
  </p>
  <p>
    You should make dependencies explicit either in the meta module definition
    or in each submodule definition. Our goal is to make sure that each module
    can be used separately as far as possible. Thus, each dependency should be
    added to the module needing it and not in a meta module.
  </p>
</blockquote>

## `dependencies` (optional)

A list of module namespaces (see [`namespace`](#namespace)) which must have been
registered in the application to allow this module to work. Dependencies will be
initialized before this module.

Example:

```js
export default {
  namespace: "Acme/HelloWorld",
  dependencies: ["Acme/Core"]
  // …
};
```

<blockquote class="info">
  **In depth:** modules are sorted using the
  [toposort](https://www.npmjs.com/package/toposort) library. See
  [`flattenAndReorderModulesUsingDependencies`](https://gitlab.com/front-commerce/front-commerce/blob/develop/src/server/core/graphql/__tests__/flattenAndReorderModulesUsingDependencies.js)
  code and tests for further details.
</blockquote>

## `typeDefs` (optional)

GraphQL type definitions provided by this module. As a developer, this is a
contract with the rest of your codebase.

Type definitions must be
[GraphQL Schema Definition Language](https://graphql.org/learn/schema/) strings,
and can be declared inline or loaded from a `.gql` file.

You can create new types, add top level queries (by extending the `Query` type),
mutations or extend types from other modules.

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
`;

export default {
  namespace: "Acme/HelloWorld",
  typeDefs: typeDefs
};
```

<blockquote class="info">
  **In depth:** under the hood, all module’s `typeDefs` are merged in a single
  array passed to graphql-tools'
  [`makeExecutableSchema`](https://www.graphql-tools.com/docs/generate-schema/#makeexecutableschemaoptions)
  function
</blockquote>

## `resolvers` (optional)

This is an object containing all the resolvers providing data for the fields defined in the schema (usually from your `typeDefs`). This is where the implementation resides.

Resolver map must follow [the format documented in GraphQL Tools](https://www.graphql-tools.com/docs/resolvers).

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

export default {
  namespace: "Acme/HelloWorld",
  // …
  resolvers: resolvers
};
```

<blockquote class="info">
  **In depth:** under the hood, all module’s `resolvers` are merged in a single
  object (using [lodash.merge](https://lodash.com/docs/#merge) passed to
  graphql-tools'
  [`makeExecutableSchema`](https://www.graphql-tools.com/docs/generate-schema/#makeexecutableschemaoptions)
  function. It is possible to override resolvers declared in another module by
  declaring it as a dependency and registering a local resolver.
</blockquote>

## `contextEnhancer` (optional)

The `contextEnhancer` module definition key should be a function that
initializes code that will be made available in GraphQL’s context, under the
`loaders` key. **It is specific to Front-Commerce.**

<blockquote class="info">
  This is where you could construct models or dataloaders that should be used in
  your GraphQL resolvers. See [Slim down resolvers with
  loaders](/docs/advanced/graphql/slim-down-resolvers-with-loaders.html) for
  more information.
</blockquote>

The `contextEnhancer` function must return an object whose keys will be merged
with previous modules’. It will be passed a single argument with the following
keys:

- `req`: the current server request
- `loaders`: current loaders (from module initialized beforehand)
- `makeDataLoader`: a factory to build a dataloader (see [`makeDataLoader` usage](/docs/advanced/graphql/dataloaders-and-cache-invalidation.html#makeDataLoader-usage))
- `config`: the global configuration

Example:

```js
import MessageLoader from "./loader";

export default {
  namespace: "Acme/HelloWorld",
  resolvers: {
    Query: {
      sayHello: (_, { name }, { loaders }) => {
        return loaders.Message.load(`Hello ${name}`);
      }
    }
  },
  contextEnhancer: ({ req, loaders, makeDataLoader, config }) => {
    return {
      Message: MessageLoader(makeDataLoader)(config.apiBaseUrl)
    }
  }
}
```

## `remoteSchema` (optional)

The `remoteSchema` key allows you to achieve [remote schema stitching in Front-Commerce](/docs/advanced/graphql/remote-schemas.html).

It should be an object with the following keys.

### `uri`

The `uri` key is **mandatory** and must contain the remote GraphQL endpoint.

Example:

```js
export default {
  namespace: "Acme/RemoteFeature",
  remoteSchema: {
    uri: "https://remote-feature.acme.org/graphql"
  }
};
```

By default all queries and mutations are merged with the current schema.
A set of default transformations are applied: read [the dedicated documentation section](/docs/advanced/graphql/remote-schemas.html#Default-transforms) for further information.

### `transforms` (optional)

The `transforms` key allows you to optionally manipulate the remote schema before it is stitched with the existing Front-Commerce schema.

It must be an array of valid [`graphql-tools` Schema Transforms](https://www.graphql-tools.com/docs/schema-stitching/#using-with-transforms), and will be applied **before** Front-Commerce’s [default transforms](/docs/advanced/graphql/remote-schemas.html#Default-transforms).

Example:

```js
import { FilterRootFields } from "@graphql-tools/wrap";

export default {
  namespace: "Acme/RemoteFeature",
  remoteSchema: {
    uri: "https://remote-feature.acme.org/graphql"
    transforms: [
      new FilterRootFields(
        (operation, rootField) =>
          operation === "Query" && rootField === "aRootFieldToExpose"
      )
    ]
  }
};
```

### `executor` (optional)

<blockquote class="feature--new">
  _This feature has been added in version `2.0.0`_
</blockquote>

The `executor` key allows you to optionally modify the underlying [executor](https://www.graphql-tools.com/docs/remote-schemas/#wrapschemaschemaconfig) for each request sent to the remote schema.

For instance it allows you to add new headers to your requests if the remote schema needs them. This is usually the case when there is an authentication system in your remote service.

You can create your own executor from scratch by following [Creating an executor](https://www.graphql-tools.com/docs/remote-schemas/#creating-an-executor) from GraphQL Tools or use the [`makeExecutor` helper](/docs/reference/remote-schema-helpers.html#makeExecutor) available in Front-Commerce.

The following example demonstrates how to add an `Authorization` header to your requests.

```js
import makeExecutor from "server/core/graphql/makeExecutor";

const authenticateRequest = () => (fetchOptions, { context }) => {
  const req = (context && context.req) || {};
  const authService = makeAuthServiceFromRequest(req);
  if (!authService.isAuthenticated()) {
    return fetchOptions;
  }

  return {
    ...fetchOptions,
    headers: {
      ...(fetchOptions.headers || {}),
      Authorization: `Bearer ${authService.getAuthToken()}`,
    },
  };
};

// […]
export default {
  namespace: "Acme/RemoteFeature",
  remoteSchema: {
    uri: "https://remote-feature.acme.org/graphql",
    // […]
      executor: makeExecutor(uri, {
        fetchOptionsAdapter: withMagentoAuthorizationHeaders(),
      }),
  }
};
```

### Deprecated fields

#### `linkContextBuilders` (optional)

<blockquote class="feature--new">
  _This feature has been added in version `1.0.0-beta.3` and is deprecated since 2.0.0_
</blockquote>

This option will be ignored if `executor` option is defined.

The `linkContextBuilders` key allows you to optionally modify the underlying [Apollo’s HTTP Link context](https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-http#context) for each request. Please note that the HTTP Link context is different from the [GraphQL Context](/docs/reference/graphql-context.html) (even if they share the same term!).

It should be a list of functions that will enrich the context with the value they return.

One of the most common usage for instance would be to authenticate remote requests by adding a `Authorization` header to requests. Context builders functions will receive the [Front-Commerce GraphQL context](/docs/reference/graphql-context.html) so they could implement a wide range of logic based on the current HTTP Request or loaders.

Example:

```js
// […]
const authenticateRequest = context => {
  const authService = makeAuthServiceFromRequest(context.req || {});
  if (authService.isAuthenticated()) {
    return {
      headers: {
        Authorization: `Bearer ${authService.getAuthToken()}`
      }
    };
  }
  return {};
};

// […]
export default {
  namespace: "Acme/RemoteFeature",
  remoteSchema: {
    uri: "https://remote-feature.acme.org/graphql",
    // […]
    linkContextBuilders: [authenticateRequest]
  }
};
```

#### `apolloLinkHttpOptions` (optional)

<blockquote class="feature--new">
  _This feature has been added in version `2.0.0-rc.0` and is deprecated since 2.0.0__
</blockquote>

This option will be ignored if `executor` option is defined.

The `apolloLinkHttpOptions` key allows you to customize options passed to the [apollo-link-http](https://www.apollographql.com/docs/link/links/http/#options) that fetches the schema.

This is especially useful if the remote GraphQL schema is using the GET method for GraphQL queries.


Example:

```js
// […]
export default {
  namespace: "Acme/RemoteFeature",
  remoteSchema: {
    uri: "https://remote-feature.acme.org/graphql",
    // […]
    apolloLinkHttpOptions: {
      useGETForQueries: true
    }
  }
};
```