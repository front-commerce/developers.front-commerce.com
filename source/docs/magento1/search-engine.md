---
id: search-engine
title: Search engine
---

As of Front-Commerce 2.5.0, it is possible to use Elasticsearch or Algolia to
bring a search engine to your website.

## Elasticsearch

### Requirements

On Magento's side, you need to install [the
`front-commerce-oss/magento1-elasticsuite-indexer`
module](https://github.com/front-commerce/magento1-elasticsuite-indexer#magento-1-elasticsearch-indexer-).
You can install it with composer:

```
composer require front-commerce-oss/magento1-elasticsuite-indexer
```

After the installation, you need to configure it, at least:

1. in System > Catalog > Catalog in the _Catalog Search_ section, make sure the
   search engine is set on _Smile Searchandising Suite_
1. in the same section, set the server host and port
1. take note of the alias (`magento` by default)

You can then run the indexer so that the products, categories and cms pages are
indexed in Elasticsearch.

### Front-Commerce configuration

First, you need to make sure the Elasticsearch search client is installed:

```
npm i @elastic/elasticsearch
```

On Front-Commerce side, you need to enable the Elasticsearch datasource by
making the changes in your `.front-commerce.js` file similar to:

```diff
// .front-commerce.js
-  modules: [],
+  modules: ["./node_modules/front-commerce/modules/datasource-elasticsearch"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
+    {
+      name: "Magento1Elasticsearch",
+      path: "datasource-elasticsearch/server/modules/magento1-elasticsearch",
+    },
     { name: "Magento1", path: "server/modules/magento1" },
   ]
```

<blockquote class="warning">
⚠️ Known issue: the Elasticsearch server module needs to be enabled **before** the Magento's module.
</blockquote>

Then, in your `.env` file, you need to define [the `FRONT_COMMERCE_ES_HOST` and
`FRONT_COMMERCE_ES_ALIAS` variables](/docs/reference/environment-variables.html#Elasticsearch).

After restarting Front-Commerce, you should be able run a GraphQL query to
search for products, for instance:

```graphql
query Search {
  search(query: "whatever you want to search for") {
    query
    products(params: { from: 0, size: 5 }) {
      total
      products {
        sku
        name
      }
    }
  }
}
```

If you are using the default theme or the theme Chocolatine, the search bar
should now be visible.

## Algolia

### Requirements

On Magento's side, you need to install [the `algolia/algoliasearch-magento`
module](https://github.com/algolia/algoliasearch-magento). You can install it
with modman:

```
modman clone https://github.com/algolia/algoliasearch-magento.git
```

After the installation, you need to configure it, at least:

1. in System > Algolia Search > Configuration in the _Credentials & Setup_
   section, set the _Enable Indexing_ option
1. in the same section, fill the credentials you can find on [the Algolia
   Dashboard](https://www.algolia.com/dashboard/api-keys)
1. take note of the index name prefix (`magento_` by default)

You can then run the indexer so that the products are indexed in Algolia's
index.

### Front-Commerce configuration

First, you need to make sure the Algolia's search client is installed:

```
npm i algoliasearch
```

On Front-Commerce side, you need to enable the Algolia datasource by
making the changes in your `.front-commerce.js` file similar to:

```diff
// .front-commerce.js
-  modules: [],
+  modules: ["./node_modules/front-commerce/modules/datasource-algolia"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
+    {
+      name: "Magento1Elasticsearch",
+      path: "datasource-algolia/server/modules/magento1-algolia",
+    },
     { name: "Magento1", path: "server/modules/magento1" },
   ]
```

<blockquote class="warning">
⚠️ Known issue: the Algolia server module needs to be enabled **before** the Magento's module.
</blockquote>

Then, in your `.env` file, you need to define [all the Algolia related
environment variables](/docs/reference/environment-variables.html#Algolia).

After restarting Front-Commerce, you should be able run a GraphQL query to
search for products, for instance:

```graphql
query Search {
  search(query: "whatever you want to search for") {
    query
    products(params: { from: 0, size: 5 }) {
      total
      products {
        sku
        name
      }
    }
  }
}
```

If you are using the default theme or the theme Chocolatine, the search bar
should now be visible.
