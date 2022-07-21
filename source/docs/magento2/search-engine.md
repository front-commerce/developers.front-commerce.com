---
id: m2-search-engine
title: Search engine
description: When configured with Magento2, Front-Commerce provides search capabilities for your website using different technologies. This guide shows you the different options available to you.
---

You can configure search and product lists with filters using the following platforms:

- [Native Magento feature](#Native-search) (using its GraphQL API)
- [ElasticSearch - direct access](#Elasticsearch) (using ElasticSuite)
- [Algolia](#Algolia)

## Native search

<blockquote class="feature--new">
_Since version 2.15_
</blockquote>

Front-Commerce supports the native Magento API for search and category listing pages. It means that any Magento search module compatible with its GraphQL API will be used in your Front-Commerce project without any specific work.

<blockquote class="wip">
  **Work In Progress:** this section is being written.
  Please <span class="intercom-launcher">[get in touch](mailto:support@front-commerce.com)</span> if you want to ask any question!
</blockquote>

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

## Algolia

<blockquote class="feature--new">
  _This feature has been added in Front-Commerce `2.13.0`_
</blockquote>

### Requirements

On Magento's side, you need to [install and configure the Algolia module for Magento2](https://www.algolia.com/doc/integration/magento-2/getting-started/quick-start/?client=php#installation).

In addition, the attribute `category_ids` must be configured as both an indexed attribute and as a facet:

1. under _Stores > Configuration > Algolia Search > Products_, add `category_ids` as _Searchable_ in the _Attributes_ parameter
1. under _Stores > Configuration > Algolia Search > Instant Search Result Page_, add `category_ids` in the _Facets_ parameter

You can then run the indexer so that the products are indexed in Algolia's index.

### Front-Commerce configuration

First, you need to make sure the Algolia's search client is installed:

```
npm i algoliasearch@4.8
```

On Front-Commerce side, you need to enable the Algolia datasource by making the changes in your `.front-commerce.js` file similar to:

```diff
// .front-commerce.js
-  modules: [],
+  modules: ["./node_modules/front-commerce/modules/datasource-algolia"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
+    {
+      name: "Magento2Algolia",
+      path: "datasource-algolia/server/modules/magento2-algolia",
+    },
     { name: "Magento2", path: "server/modules/magento2" },
   ]
```

<blockquote class="warning">
⚠️ Known issue: the Algolia server module needs to be enabled **before** the Magento's module.
</blockquote>

Front-Commerce retrieves the following parameters from Magento:

- [the Application ID](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id)
- [the search only API key](https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key)
- the index name prefix
- the number of values per facet
- the configured facet attributes

On the configured facets, only the attribute name is taken into account (_Facet type_, _Label_, _Searchable_ and _Create Query rule_ are ignored for now).

<blockquote class="warning">
⚠️ For performance reason, the configuration retrieved from Magento is cached. As a result, after changing a parameter in the backoffice, the new parameter will be taken into account after at most one minute by Front-Commerce.
</blockquote>

After restarting Front-Commerce, you should be able to run a GraphQL query to search for products, categories or pages, for instance:

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
    categories(size: 5) {
      name
    }
    pages(size: 5) {
      title
    }
  }
}
```

If you are using the default theme or the Chocolatine theme, the search bar should now be visible.

## Fallback Search

<blockquote class="feature--new">
_Since version 2.15_
</blockquote>

If no search module is configured Front-Commerce will default to using the native Magento search API to do the search.

native Magento search API uses the price without tax value to achieve its price filtering capabilities. This is not what customers typically expect. To overcome this you need to set `FRONT_COMMERCE_MAGENTO_SEARCH_TAX_RATE` to the expected tax rate on your site. Please note this may not work for all scenarios as you may have different tax rates depending on country. So we recommend you use the tax rate that most applies to your customers.
