---
id: sitemap
title: Sitemap generation
description: The sitemap is a key piece of each e-commerce website. It allows search engines to crawl and index your pages faster, driving to more visitors and potential clients. This guide explains how Front-Commerce generates sitemap and how to add your custom content in it.
---

> **Prequisite:** To follow this guide, you first need to know [how to create new pages](/docs/essentials/add-a-page-client-side.html) and [a GraphQL module](/docs/essentials/extend-the-graphql-schema.html) in Front-Commerce.

## Generate a Sitemap

Within Front-Commerce you can generate a sitemap by running the command [`npm run sitemap` command](/docs/reference/scripts.html#sitemap-js) in your Skeleton. It will run a GraphQL query that will fetch all the routes registered in your application.

The GraphQL query looks like this:

```graphql
query Sitemap {
  sitemap {
    baseUrl
    nodes {
      path
      priority
      changefreq
      lastmod
    }
  }
}
```

This query will be run for each store available in your `config/stores.js` file.

If the request does not work, please make sure that the environment variable [`FRONT_COMMERCE_SITEMAP_TOKEN`](/docs/reference/environment-variables.html#Sitemap) is available when running your script.

The result of this query will then be transformed in xml files that are available in the `build/client/sitemaps` folder. A sitemap index file will be accessible via the following url: https://your-shop.example.com/sitemaps/sitemap.xml. You could share this location with tools such as Google Search Console to ensure your website is indexed properly in search engines.

> On your production website, we suggest that you execute this request every night through a cron to ensure that the sitemap is up to date.

## Add your own routes in the sitemap

By default the sitemap will contain nodes that have been registered by modules declared in your Front-Commerce application. For instance, if you have registered a `server/modules/magento2` module in your [`.front-commerce.js`'s `serverModules` key](/docs/reference/front-commerce-js.html#serverModules), you should have categories, products and CMS pages available in your sitemap.

However, if you need to setup your own routes, you will need to register your own nodes.

### Add a static page

If the pages you are adding to your sitemap are static and exist regardless of the state of your shop, you can add them by creating `config/hardcodedSitemap.js` in your module.

```js
module.exports = [
  {
    path: "/",
    priority: 1,
    changefreq: "daily",
    lastmod: new Date("2017-06-01").toISOString(),
  },
];
```

### Add dynamic pages

Most of the time, your pages will be dynamic and rely on editable entities with an identifier like an id or a slug in their URL. Front-Commerce's sitemap mechanism allows you to include such pages in the sitemap by following these two steps:

- declare a GraphQL type as `Sitemapable`
- register the pages by calling `loaders.Sitemap.registerNodesFetcher` from a [GraphQL module's `contextEnhancer`](/docs/reference/graphql-module-definition.html#contextEnhancer-optional)

Let's say that we have a FAQ with a single page (`/faq/:slug`) for each question. In order to add these pages to the sitemap, we will consider that we already created a GraphQL modules that:

- declares the following types

  ```graphql
  # src/server/modules/faq/schema.gql
  type FaqEntry {
    slug: String
    question: String
    answer: String
  }

  extend type Query {
    allFaq: [FaqEntry]
    faq(slug: String!): FaqEntry
  }
  ```

- declares a loader that allows to fetch all the FAQ entries and returns an array of object containing the slug, the question and the answer for each FAQ entry.
  ```js
  // src/server/modules/faq/loaders.js
  const FaqLoader = () => {
    return {
      allFaq: () => {
        return fetch("https://my-faq-service.example.org/all").then(
          (response) => response.data
        );
      },
    };
  };
  ```

Here is how we could then include all pages in the sitemap.

#### Declare `FaqEntry` type as `Sitemapable`

First thing first, we will need to edit our `FaqEntry` type so it implements the `Sitemapable` GraphQL interface (from Front-Commerce's core):

```diff
# src/server/modules/faq/schema.gql
-type FaqEntry {
+type FaqEntry implements Sitemapable {
  slug: String
  question: String
  answer: String
+  "The location used to display this FaqEntry"
+  path: String
+  "The priority of crawling defined in the sitemap"
+  priority: Float
+  "Last modification date of the content of the page"
+  lastmod: String
+  "The change frequency of the page"
+  changefreq: String
+  "The list of images related to this page"
+  seoImages: [SitemapImage]
}
```

`path`, `priority`, `seoImages`, `lastmod` and `changefreq` are fields that will be used to render the sitemap. To define their values, you can use the usual GraphQL way. In our case, we will use small resolvers:

```diff
// src/server/modules/faq/resolvers.js
export default {
  // ...
+  FaqEntry: {
+    path: ({ slug }) => `/faq/${slug}`,
+    priority: () => 0.5,
+    lastmod: () => new Date().toISOString(),
+    changefreq: () => "daily",
+    seoImages: () => []
+  }
};
```

#### Add the question pages to the sitemap

If we want these pages to appear in the sitemap, we will need to fetch all the questions and register them in the sitemap. Thus, in the `index.js` file where you have declared your FAQ GraphQL module (ex: `src/server/modules/faq/index.js`), you will need to register your nodes like this:

```diff
// src/server/modules/faq/index.js
export default {
  // ...
+  dependencies: ["Front-Commerce/Core"]
-  contextEnhancer: () => {
+  contextEnhancer: ({ loaders }) => {
    const Faq = FaqLoader()

+    loaders.Sitemap.registerNodesFetcher("Faq", () =>
+      Faq.loadAll().then(entries => {
+        return entries.map(entry => ({
+          ...entry,
+          __typename: "FaqEntry"
+        }));
+      })
+    );

    return {
        Faq: Faq
    }
  }
  // ...
};
```

The `Sitemap` loader is a loader that is available in the `Front-Commerce/Core` GraphQL module. Hence, don't forget to add `Front-Commerce/Core` in the [`dependencies` key](/docs/reference/graphql-module-definition.html#dependencies-optional). It will help you detect errors in case something is not working properly.

Once you are done, you should be able to run `npm run sitemap` and see the new pages in the generated sitemap at `build/client/sitemaps`. During development, it can be faster to directly execute the GraphQL query fetching the sitemap's node on your GraphQL playground. You will have clearer error messages and a faster feedback loop.

> **Advanced:** By calling `registerNodesFetcher`, we let the sitemap know that there are new entries that will be concatenated with existing ones. If instead you want to replace entries that were already sent by another GraphQL module, you will need to call `overrideNodesFetcher(namespace, nodesFetcher)`. The namespace should be the same as the one available in the existing GraphQL module and the `nodesFetcher` will work just like in `registerNodesFetcher`. This could allow you to change the products you want to display in your sitemap for instance.
