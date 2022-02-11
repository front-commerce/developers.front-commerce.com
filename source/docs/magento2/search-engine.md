---
id: m2-search-engine
title: Search engine
---

When configured with Magento2, Front-Commerce can leverage Elasticsearch to bring a search engine to your website.

## Elasticsearch

### Requirements

On Magento2 side, Front-Commerce requires [Elasticsuite](https://github.com/Smile-SA/elasticsuite) and [its CMS Page search plugin](https://github.com/Smile-SA/magento2-module-elasticsuite-cms-search) to be installed.

The Elasticsuite installation and configuration procedure can be found [in a dedicated page on the project wiki](https://github.com/Smile-SA/elasticsuite/wiki/ModuleInstall) while for the CMS Page search plugin, [the setup is detailed in its readme document](https://github.com/Smile-SA/magento2-module-elasticsuite-cms-search#how-to-use).

### Front-Commerce configuration

First, you need to make sure the Elasticsearch search client is installed with a version that matches your Elasticsearch server version (6 or 7):

```
npm i @elastic/elasticsearch@7
```

On Front-Commerce side, you need to enable the Elasticsearch datasource by making changes in your `.front-commerce.js` file similar to:

```diff
// .front-commerce.js
-  modules: [],
+  modules: ["./node_modules/front-commerce/modules/datasource-elasticsearch"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
+    {
+      name: "Magento2Elasticsearch",
+      path: "datasource-elasticsearch/server/modules/magento2-elasticsearch",
+    },
     { name: "Magento2", path: "server/modules/magento2" },
   ]
```

<blockquote class="warning">
⚠️ Known issue: the Elasticsearch server module needs to be enabled **before** the Magento's module.
</blockquote>

Then, in your `.env` file, you need to define [the `FRONT_COMMERCE_ES_HOST`, `FRONT_COMMERCE_ES_ALIAS` and `FRONT_COMMERCE_ES_ELASTICSUITE_VERSION` variables](/docs/reference/environment-variables.html#Elasticsearch).

> The prefix value can be found in the admin interface under _Stores > Elasticsuite > Base Settings > Indices Settings_ in the field _Indices Alias Name_ (the default value is `magento2`).

After restarting Front-Commerce, you should be able run a GraphQL query to search for products, categories and/or pages, for instance:

```graphql
query Search {
  search(query: "whatever you want to search for") {
    query
    products {
      total
      products {
        sku
        name
      }
    }
    categories {
      name
    }
    pages {
      identifier
      title
    }
  }
}
```

If you are using the default theme or the theme Chocolatine, the search bar should now be visible.
