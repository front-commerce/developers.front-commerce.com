---
id: magento2-graphql
title: Magento2 GraphQL schema
description: Front-Commerce aims at making Magento developers productive by allowing them to work with what they know from Magento. This page explains how you could expose parts of the Magento GraphQL schema in your application.
---

In order to help close the gap between GraphQL features, our goal is to expose as much [Magento’s GraphQL schema](https://devdocs.magento.com/guides/v2.3/graphql/) as possible in Front-Commerce. We follow evolutions in Magento core very closely and aim at including the new stable parts of this schema in Front-Commerce **as soon as they match the parts we’ve developed over the years in terms of feature, performance, and stability**.

This section details what is available so far.

<blockquote class="info">
  Please note that it relies upon the [GraphQL modules remote schema](/docs/advanced/graphql/remote-schemas.html) support from Front-Commerce.
  We recommend to have at least a basic understanding of how it works if you know Magento’s GraphQL schema and would like to find yourself at home in Front-Commerce!
</blockquote>

## Enable Magento2 GraphQL module

Front-Commerce supports both Magento 2.2 and 2.3+ versions.
For this reason, GraphQL support for Magento is not part of the default Magento2 [meta module](/docs/advanced/graphql/meta-modules.html).

To enable GraphQL support for Magento 2.3+, you must register the `server/modules/magento2-graphql` module in your application.

To do so, add the following line in your [`.front-commerce.js`](/docs/reference/front-commerce-js.html) file:

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
+    { name: "Magento2GraphQL", path: "server/modules/magento2-graphql" }
  ]
};
```

**Restart your server**, and you should now see the additional endpoints.

## Store configurations

The public store configurations are available under the `Magento2GraphQL_storeConfig` query.

Example:

```graphql
{
  Magento2GraphQL_storeConfig {
    timezone
  }
}
```

See [the related Magento DevDocs page](https://devdocs.magento.com/guides/v2.3/graphql/reference/store-config.html) to learn which configurations are exposed by default in Magento's schema.

## Is something missing?

As detailed earlier, Front-Commerce already supports a wide range of Magento features.
We believe that — to date — **most of the features from Front-Commerce schema are more stable, performant and complete than Magento’s GraphQL counterpart** (even if the schema is slightly different).

However, our goal is to reduce this gap (and our codebase!) and your feedback is welcome.
If you think something is missing in Front-Commerce, or stable enough in Magento to be used in production <span class="intercom-launcher">[send us an email](mailto:hello@front-commerce.com)</span> and we could add it to our roadmap!
