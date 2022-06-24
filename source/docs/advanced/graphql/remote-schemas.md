---
id: remote-schemas
title: Remote schemas
description: If you already have existing headless services exposing a GraphQL API, you might want to reuse them with the lowest possible overhead. This page will explain how you could expose remote GraphQL schemas as part of your Front-Commerce GraphQL schema.
---

Here are some use cases:

- use GraphQL headless CMS such as [GraphCMS](https://graphcms.com) or [Strapi](https://strapi.io) without any overhead
- use Magento2 GraphQL endpoint _as-is_ (useful for unsupported features or custom extensions)
- develop and deploy your microservices using another technology, and expose its GraphQL API in your Front-Commerce GraphQL schema
- … many more!

In Front-Commerce, GraphQL modules can declare their own local schema but they can also reuse remote schemas and make them available in the GraphQL schema.
This is referred to as **remote schema stitching**.

<blockquote class="feature--new">
  _This feature has been added in version `1.0.0-alpha.2`_
</blockquote>

## Exposing an entire remote schema

The simplest use case is to expose the whole remote schema in your existing application.

In this example, we are going to illustrate this feature by exposing the [Pokemon GraphQL API](https://graphql-pokemon.vercel.app/) in our eCommerce application… you may find it useful if you are selling Pokemon related goodies! 😸

First, let’s start by creating a new GraphQL module and register it in our application:

```js
// my-module/server/modules/pokemon/index.js
export default {
  namespace: "Pokemon",
};
```

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
+    { name: "Pokemon", path: "./my-module/server/modules/pokemon" }
  ]
};
```

<blockquote class="note">
  If you need more details about the steps above, you can read the [Extend the GraphQL schema](/docs/essentials/extend-the-graphql-schema.html) documentation page.
</blockquote>

In its current state, this GraphQL module does nothing at all!
Let’s update it to expose the remote GraphQL schema, by adding a [`remoteSchema`](/docs/reference/graphql-module-definition.html#remoteSchema-optional) key to the module definition.

```diff
// my-module/server/modules/pokemon/index.js
export default {
-  namespace: "Pokemon"
+  namespace: "Pokemon",
+  remoteSchema: {
+    uri: "https://graphql-pokemon.vercel.app/"
+  }
};
```

**Restart your application** and explore your schema using the GraphQL playground (by default at
[http://localhost:4000/playground](http://localhost:4000/playground)).

You must see several new top level queries prefixed by `Pokemon_`.
**Congratulations!** You now have access to all the Pokemon remote GraphQL queries and mutations in your Front-Commerce application, alongside your existing eCommerce ones.

Try the query below for instance:

```graphql
{
  Pokemon_pokemon(name: "raichu") {
    name
    weight {
      minimum
      maximum
    }
    image
    classification
  }

  product(sku: "VD11") {
    name
  }
}
```

## Default transforms

You may have noticed in the previous example, that the `pokemon` query was named `Pokemon_pokemon`.
The reason is that Front-Commerce applies some transforms to the remote schema before merging it into the local schema.
The goal is to allow to quickly merge remote schemas by reducing the probability of a conflict.

Here are the transforms applied to the remote schema by default.

### Prefix root queries and mutations

Root queries and mutations are prefixed with the GraphQL module namespace and an underscore.
In the example above, the remote query `pokemon(name: String!)` was renamed into `Pokemon_pokemon(name: String!)`.
If we renamed the module’s namespace in `MyPokedex` the query would be `MyPokedex_pokemon(name: String!)`.

<blockquote class="important">
  **Important:** _special_ characters are stripped from the module namespace to obtain a valid name.
  Example: for a module namespaced `Acme/Foo`, Front-Commerce will use `AcmeFoo_` as a prefix.
</blockquote>

### Prefix types

In a similar way, types from the remote schema are prefixed with the GraphQL module namespace and an underscore.

In the Pokemon example above schema, the `PokemonDimension` type would be renamed to `Pokemon_PokemonDimension`.

## Apply custom transforms

When doing remote schema stitching, you may want to apply your own transforms to the remote schema.

For instance, you may want to only expose the `pokemons` query from the remote schema.
Here is how you could achieve it thanks to Front-Commerce’s [`remoteSchema.transforms` GraphQL module definition key](/docs/reference/graphql-module-definition.html#transforms-optional):

```diff
+ import { FilterRootFields } from "graphql-tools";
+
export default {
  namespace: "Pokemon",
  remoteSchema: {
-    uri: "https://graphql-pokemon.vercel.app/"
+    uri: "https://graphql-pokemon.vercel.app/",
+    transforms: [
+      new FilterRootFields(
+        (operation, rootField) =>
+          operation === "Query" && rootField === "pokemons"
+      )
+    ]
  }
};
```

<blockquote class="info">
  Please note that these transforms are applied **before** Front-Commerce default ones.
  In this example, the `pokemons` root field will be renamed by default transforms as `Pokemon_pokemons`.
</blockquote>

## Customize remote HTTP requests

By default, the user IP address is the only information forwarded to the remote service (using the `X-Forwarded-For` HTTP header).

There might be situations where the remote service requires specific HTTP headers or content.
For instance, you may have to provide an API key in all calls or an `Authorization` header to act as the currently logged in Customer.

Front-Commerce allows you to configure the underlying implementation using the [`remoteSchema.executor` GraphQL module definition key](/docs/reference/graphql-module-definition.html#linkContextBuilders-optional).

## Mix local and remote schemas

A GraphQL module can expose both a remote schema and a local schema with resolvers.
Front-Commerce will first merge the remote schema, and then the local schema.

It means that you can add resolvers to enrich remote types with local data.
In the example below, the module adds a custom `relatedProducts` to the remote `Pokemon` type (named `Pokemon_Pokemon` in Front-Commerce) resolving to products fetched from the pokemon id (in a hypothetical loader).

```js
// my-module/server/modules/pokemon/index.js
const typeDefs = `
extend type Pokemon_Pokemon {
  relatedProducts: [Product]
}
`;

export default {
  namespace: "Pokemon",
  dependencies: ["Another/CatalogModule"],
  typeDefs,
  resolvers: {
    Pokemon_Pokemon: {
      relatedProducts: ({ id }, _, { loaders }) => {
        return loaders.Product.loadByPokemon(id);
      },
    },
  },
  remoteSchema: {
    uri: "https://graphql-pokemon.vercel.app/",
  },
};
```

## Caveats

### Server restart needed

Please note that **remote schema changes will only appear in your schema after a server restart**.
The remote schema definition is fetched during the server bootstrap process for performance reasons.

### Query root type must be provided

The remote schema (after transforms applied) **MUST** contain at least a `Query` root type.
This can happen when you only expose Mutations from your remote schema.

This limitation is identified in the library we use to merge schemas together.
See [apollographql/graphql-tools#764](https://github.com/apollographql/graphql-tools/issues/764) and [apollographql/graphql-tools#659 _(comment)_](https://github.com/apollographql/graphql-tools/issues/659#issuecomment-410042027) for details.

A _« solution »_ is to add a dummy Query field to your remote schema:

```graphql
type Query {
  _dummy: String
}
```

See [#196](https://gitlab.com/front-commerce/front-commerce/issues/196) for more information.

---

<blockquote class="wip">
  This remote schema stitching feature is still being explored, and we are looking for feedback to make it better.
  Please <span class="intercom-launcher">[get in touch](mailto:support@front-commerce.com)</span> if you want to share your thoughts with us or ask any question!
</blockquote>
