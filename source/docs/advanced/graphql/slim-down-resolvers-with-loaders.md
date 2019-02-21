---
id: slim-down-resolvers-with-loaders
title: Slim down resolvers with loaders
---

GraphQL modules may grow over time depending on the features they provide, and
remote services they interact with.
GraphQL resolvers will then have more and more code, and very often require developers
to introduce an abstraction **containing all the business logic to keep code maintainable
and increase testability.**

In Front-Commerce’s core and platforms integrations (such as Magento2) we have introduced the concept of _« loaders »_ to achieve this.

This page explains what loaders are, how you can create them and should allow you
to have a better understanding of our code when browsing it.

<blockquote class="info">
If you have used Apollo Server recently, you might already be familiar with a
similar pattern named [data sources](https://www.apollographql.com/docs/tutorial/data-source.html).
It is also similar to [GrAMPS’s models](https://gramps-graphql.github.io/gramps-express/data-source/tutorial-model/).
</blockquote>

## Why loaders?

TODO:
- pure JS (import existing code, or export if migrating away from FC)
- handles remote data source interactions
- testable

## What are loaders?

TODO:
- anything you want

## How to create loaders?

TODO:
- contextEnhancer
- context.loaders
- dependency injection
- dataloaders

## Example from the core

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