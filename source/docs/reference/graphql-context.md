---
id: graphql-context
title: GraphQL context
---

**Front-Commerce’s GraphQL modules** can register GraphQL schema extensions and resolvers to actually fetch the data.
Front-Commerce manages a **context object** and makes it available in the GraphQL schema so resolvers can use it [using standard GraphQL mechanisms](https://graphql.org/learn/execution/#root-fields-resolvers).

<blockquote class="info">
  To get started with GraphQL modules, we recommend you to read the [Extend the
  GraphQL schema](/docs/essentials/extend-the-graphql-schema.html) documentation
  page.
</blockquote>

This page contains the different keys available in the GraphQL context object managed by Front-Commerce.

## `loaders`

The `loaders` key contains all the loaders registered by GraphQL modules, from their [`contextEnhancer` module definition method](/docs/reference/graphql-module-definition.html#contextEnhancer-optional).

Example :

```js
// my-module/server/modules/clicks-counters/resolvers.js
export default {
  Product: {
    clicksCounter: ({ sku }, _, context) => {
      return context.loaders.Counter.loadBySku(sku);
    }
  }
}
```

See [Slim down resolvers with loaders](/docs/advanced/graphql/slim-down-resolvers-with-loaders.html) to understand how to leverage this value.


## `req`

The `req` key contains the current HTTP request (from [Express server](https://expressjs.com/en/api.html#req)) having triggered the GraphQL query.

It could be useful in some specific cases, but we generally recommend **NOT TO** use it directly. Resolvers should to use [`loaders`](#loaders) instead.

One of the reason why it has been introduced in the core, is to allow context customization in Remote schema stitching scenarii.
See [`linkContextBuilders` for an usage example](/docs/reference/graphql-module-definition.html#linkContextBuilders-optional).