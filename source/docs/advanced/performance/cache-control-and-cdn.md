---
id: cache-control-and-cdn
title: Cache control and CDN/Reverse proxy
---

<blockquote class="feature--new">
  _This feature has been added in version `2.6.0`_
</blockquote>

# NOTES

Caching is disabled by default for user related content and for cart related content. This is done to avoid inadvertently caching sensitive user information.

# Introduction

To enable CDN caching you need to first set up proper [cache headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) for your site.

In Front-Commerce we have implemented a mechanism where you can easily set up the `cache-control` headers for different parts of your site. You can also provide a custom implementation of the `cache-control` if needed (e.g. products with old last modified have longer caching duration).

# Dynamic Pages

The default theme already contains specific fragments that you can override to customize Cache-Control settings for the most common pages. Please look for the `*CacheControlFragment.gql` files across the theme. Override the desired `*CacheControlFragment.gql` file. Then uncomment the `cacheControl` part of the query. Finally set the `sMaxAge` and `staleWhileRevalidate` values to meet your requirements. For example the `CategoryCacheControlFragment.gql` could look something like this:

```gql
fragment CategoryCacheControlFragment on Category {
  cacheControl(input: { sMaxAge: 600, staleWhileRevalidate: 3600 }) {
    sMaxAge
    staleWhileRevalidate
  }
}
```

P.S. we use `sMaxAge` instead of `maxAge` because this is the value used by shared caches (e.g. reverse proxies or CDN)

# Static Pages

To set up cache control headers for static pages you need to set a static attribute on the matching route component. Please make sure that this attribute is hoisted all the way to be visible on the exported route component. Your static page component should look something like this:

```js
import Home from "theme/pages/Home";

Home.cacheControlDefinition = {
  sMaxAge: 10,
  staleWhileRevalidate: 1000,
};

export default Home;
```

# GraphQL queries

To enable caching for GraphQL queries you should make your GraphQL queries use the `GET` method. This can be done by adding the following environment variable to your `.env` file:

```
FRONT_COMMERCE_WEB_USE_GET_FOR_PERSISTED_QUERIES=true
```

Once you have enabled `GET` for your GraphQL queries the dispatcher will automatically set the values for the `cache-control` header based on the `cacheControl` fields contained in your GraphQL query.

**Please note:** setting `FRONT_COMMERCE_WEB_USE_GET_FOR_PERSISTED_QUERIES=true` will disable GraphQL query batching.

# Setting up the CDN

Finally after you have set up the appropriate cache controls for your site you now need to configure a CDN (or a reverse proxy such as Nginx) which will take care of caching pages for users. See [Which CDN providers support stale-while-revalidate?](https://www.ctrl.blog/entry/cdn-rfc5861-support.html) for a list of CDN that supports it. As of 2.6, Front-Commerce requires that the CDN ignores the cache for requests containing a cookie named `connect.sid`. Please refer to your CDN's documentation for more details. **If you are using Front-Commerce Cloud, you have nothing to do** unless you changed default values. Please [contact us](support@front-commerce.com) if you need support to enable caching.

# Advanced usage

## Customise cache headers per category/product/CMS page

You can have a more fine grained control on your cache headers' configurations than the one presented [in the Dynamic Pages above](#Dynamic-Pages). This can be done in the resolver/loader of the module itself.

For example let us have a look at the resolver of the Magento 2 Categories found at `src/server/modules/magento2/catalog/categories/resolvers.js`. You can see a section there dedicated to cache control. It is there that you can add any logic you want to tweek the cache control headers to your liking depending on the category at hand. Note we recommend you write the logic in the loader and call it from the resolver as with any other function.

## Implementing cache control for your custom module

Say you have a custom module and you want to add caching capabilities to your module. In Front-Commerce this is possible by implementing the `Cacheable` GraphQL interface and adding the `cacheControl` field to your module's resolver. Lets see how CmsPage schema and resolver has been updated:

```diff
-type CmsPage implements Sitemapable & Routable {
+type CmsPage implements Sitemapable & Routable & Cacheable {
  "The Page's identifier"
  identifier: String
  "The Page's title"
  title: String
  "The Page's content"
  content: String
  # ...
+  cacheControl(input: CacheControlInput): CacheControlDefinition
}
```

```diff
export default {
  ...
  CmsPage: {
    path: ({ identifier }) => `/` + identifier,
    priority: () => 0.25,
    ...
+    cacheControl: (_, { input: cacheControlDefinition }, { loaders }) => {
+      return loaders.CacheControl.loadDefaultCacheControl(
+        cacheControlDefinition
+      );
+    },
  },
  ...
};
```

You also need to make sure that from the client side the `cacheControl` field is requested by your GraphQL query related to your custom module, and is set up with proper values. Lets see how `MatchUrls` query has been updated:

```diff
#import "theme/pages/Product/ProductFragment.gql"
#import "theme/pages/Category/CategoryFragment.gql"
#import "theme/pages/CmsPage/CmsPageFragment.gql"
+#import "theme/pages/Product/ProductCacheControlFragment.gql"
+#import "theme/pages/Category/CategoryCacheControlFragment.gql"
+#import "theme/pages/CmsPage/CmsPageCacheControlFragment.gql"

query MatchUrls($url: String!, $params: QueryInput) {
  route(url: $url) {
    path
    __typename
    ... on RedirectEntity {
      redirectTo
      redirectType
    }
    ... on Product {
      ...ProductFragment
+      ...ProductCacheControlFragment
    }
    ... on Category {
      ...CategoryFragment
+      ...CategoryCacheControlFragment
    }
    ... on CmsPage {
      ...CmsPageFragment
+      ...CmsPageCacheControlFragment
    }
  }
}
```
