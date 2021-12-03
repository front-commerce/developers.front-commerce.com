---
id: search-engine
title: Search engine
---

As of Front-Commerce 2.5.0, it is possible to use Elasticsearch or Algolia to
bring a search engine to your website.

<blockquote class="warning">
⚠️ NOTE: The default behavior in Front-Commerce is that in the top search bar we search products, categories and pages(CMS Pages). While on the search page we search products only. This is an implementation choice we took. It is up to the integrator to modify these behavior if needed (components and GraphQL queries under `theme/modules/Search` will need to be overriden).
</blockquote>

<br/>

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

First, you need to make sure the Elasticsearch search client is installed with a version that matches your ElasticSearch server:

```
npm i @elastic/elasticsearch@6
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

<br/>

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

<blockquote class="warning">
⚠️ Common mistake: For magento 2 the elasticsuite does not index cms pages. To do that you need to install <a href="https://github.com/Smile-SA/magento2-module-elasticsuite-cms-search" target="_blank">Smile elasticsuite cms search module</a> on your magento instance. Failing to do so will cause the top search bar to malfunction. If you do not need the CMS Page search you can always override related `SearchBar` Components/GraphQL queries to disable the cms page search functionality as in the following diff:

<details>
<summary>
Disable CMS Pages Search Diff
</summary>

#### Base theme:

```
diff --git a/src/web/theme/modules/Search/SearchBar/Autocomplete/Autocomplete.js b/src/web/theme/modules/Search/SearchBar/Autocomplete/Autocomplete.js
index 9bc108484..ea9a2c91f 100644
--- a/src/web/theme/modules/Search/SearchBar/Autocomplete/Autocomplete.js
+++ b/src/web/theme/modules/Search/SearchBar/Autocomplete/Autocomplete.js
@@ -3,10 +3,9 @@ import PropTypes from "prop-types";
 import { FormattedMessage } from "react-intl";
 import ProductsResults from "./ProductsResults";
 import CategoriesResults from "./CategoriesResults";
-import PagesResults from "./PagesResults";
 
 const hasResults = ({ products, categories, pages }) =>
-  products.length || categories.length || pages.length;
+  products.length || categories.length;
 
 const Autocomplete = (props) => {
   if (!props.results || !hasResults(props.results)) {
@@ -36,9 +35,6 @@ const Autocomplete = (props) => {
           onSelect={props.onSelect}
         />
       )}
-      {props.results.pages.length > 0 && (
-        <PagesResults results={props.results.pages} onSelect={props.onSelect} />
-      )}
     </div>
   );
 };
diff --git a/src/web/theme/modules/Search/SearchBar/SearchBarQuery.gql b/src/web/theme/modules/Search/SearchBar/SearchBarQuery.gql
index 15da9b1a4..9a01d02bd 100644
--- a/src/web/theme/modules/Search/SearchBar/SearchBarQuery.gql
+++ b/src/web/theme/modules/Search/SearchBar/SearchBarQuery.gql
@@ -1,6 +1,5 @@
 #import "theme/modules/Search/SearchBar/ProductAutocompleteFragment.gql"
 #import "theme/modules/Search/SearchBar/CategoryAutocompleteFragment.gql"
-#import "theme/modules/Search/SearchBar/PageAutocompleteFragment.gql"
 
 query SearchSuggestions($query: String!, $resultsPerType: Int = 5) {
   searchSuggestions: search(query: $query) {
@@ -13,8 +12,5 @@ query SearchSuggestions($query: String!, $resultsPerType: Int = 5) {
     categories(size: $resultsPerType) {
       ...CategoryAutocompleteFragment
     }
-    pages(size: $resultsPerType) {
-      ...PageAutocompleteFragment
-    }
   }
 }
```

#### Theme Chocolatine:

```
diff --git a/theme-chocolatine/web/theme/modules/Search/SearchBar/SearchBarResults/SearchBarResults.js b/theme-chocolatine/web/theme/modules/Search/SearchBar/SearchBarResults/SearchBarResults.js
index a02d89d6e..65ee82443 100644
--- a/theme-chocolatine/web/theme/modules/Search/SearchBar/SearchBarResults/SearchBarResults.js
+++ b/theme-chocolatine/web/theme/modules/Search/SearchBar/SearchBarResults/SearchBarResults.js
@@ -12,7 +12,7 @@ import SearchBarResultsError from "./SearchBarResultsEmptyError";
 import { useAutocompleteOption } from "theme/components/organisms/Autocomplete/useAutocomplete";
 
 const hasResults = ({ products, categories, pages }) =>
-  products.length > 0 || categories.length > 0 || pages.length > 0;
+  products.length > 0 || categories.length > 0;
 
 const SearchBarResults = (props) => {
   const isEmpty = !props.results || !hasResults(props.results);
@@ -36,13 +36,11 @@ const SearchBarResults = (props) => {
 
   const hasProducts = props.results.products.length > 0;
   const hasCategories = props.results.categories.length > 0;
-  const hasPages = props.results.pages.length > 0;
 
   return (
     <div
       className={classNames("searchbar-results", {
-        "searchbar-results--two-columns":
-          hasProducts && (hasCategories || hasPages),
+        "searchbar-results--two-columns": hasProducts && hasCategories,
       })}
     >
       <Stack size="2">
@@ -56,7 +54,7 @@ const SearchBarResults = (props) => {
               />
             </div>
           )}
-          {(hasCategories || hasPages) && (
+          {hasCategories && (
             <div key="categories-pages" className="searchbar-results__element">
               <Stack size="2" mobileSize="4">
                 {hasCategories && (
@@ -67,14 +65,6 @@ const SearchBarResults = (props) => {
                     onSelect={props.onSelect}
                   />
                 )}
-                {hasPages && (
-                  <PagesResults
-                    key="pages"
-                    results={props.results.pages}
-                    selected={props.selected}
-                    onSelect={props.onSelect}
-                  />
-                )}
               </Stack>
             </div>
           )}
diff --git a/theme-chocolatine/web/theme/modules/Search/SearchBar/SearchBarResults/SearchBarResultsFragment.gql b/theme-chocolatine/web/theme/modules/Search/SearchBar/SearchBarResults/SearchBarResultsFragment.gql
index 175f9454c..4fc45fb3a 100644
--- a/theme-chocolatine/web/theme/modules/Search/SearchBar/SearchBarResults/SearchBarResultsFragment.gql
+++ b/theme-chocolatine/web/theme/modules/Search/SearchBar/SearchBarResults/SearchBarResultsFragment.gql
@@ -1,5 +1,4 @@
 #import "theme/modules/Search/SearchBar/CategoriesResults/CategoriesResultsFragment.gql"
-#import "theme/modules/Search/SearchBar/PagesResults/PagesResultsFragment.gql"
 #import "theme/modules/Search/SearchBar/ProductsResults/ProductsResultsFragment.gql"
 
 fragment SearchBarResultsFragment on SearchResult {
@@ -12,7 +11,4 @@ fragment SearchBarResultsFragment on SearchResult {
   categories(size: $resultsPerType) {
     ...CategoriesResultsFragment
   }
-  pages(size: $resultsPerType) {
-    ...PagesResultsFragment
-  }
 }

```

</details>
</blockquote>

<br/>

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
1. The attribute `category_ids` must be listed in both the facets configuration and in the indexed product attributes (and there it must be set as _Searchable_) as Front-Commerce relies on it to list the products in categories.


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

As of Front-Commerce 2.6, Algolia's module is automatically configured. If you
are using Front-Commerce 2.5, you need to define [all the Algolia related
environment variables](/docs/reference/environment-variables.html#Algolia) in
your `.env` file.

Front-Commerce 2.6 takes the following parameters from Magento:

* [the Application ID](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id)
* [the search only API key](https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key)
* the index name prefix
* the number of values per facet
* the configured facet attributes

On the configured facets, only the attribute name is taken into account (Facet type, Label, Searchable and Create Query rule are ignored for now).

<blockquote class="warning">
⚠️ For performance reason, the configuration retrieved from Magento is cached. As
a result, after changing a parameter in the backoffice, the new parameter will
be taken into account after at most one minute by Front-Commerce.
</blockquote>

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


<blockquote class="warning">
⚠️ For now Front-Commerce Algolia implementation is only able to provide Product search. If you need to search through Categories or CMS pages, please [contact us](mailto:contact@front-commerce.com).
</blockquote>
