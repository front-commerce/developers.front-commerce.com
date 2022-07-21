---
id: routable-types
title: Prismic Routable Types
description: You might want to create new pages managed from Prismic. These pages should be accessible with a URL and may have to be included in the Sitemap with a clean URL. This guide explains everything that is supported by Front-Commerce's Prismic module.
---

The Prismic module allows to leverage [Front-Commerce's Dispatcher](/docs/advanced/theme/route-dispatcher.html) to make content from custom types routable.

To make a custom Prismic data type routable these steps are required:

- [Create a field to represent the Url of the custom type](#create-a-field-to-represent-the-url-of-the-custom-type)
- [Create a GraphQL type to represent the custom type](#create-a-graphql-type-to-represent-the-custom-type)
- [Add GraphQL type to the dispatcher query](#add-graphql-type-to-the-dispatcher-query)
- [Register the Prismic custom type as a routable type](#register-the-prismic-custom-type-as-a-routable-type)
- [Map GraphQL type to a component](#map-graphql-type-to-a-component)
- [Add a routable custom type to the sitemap](#add-a-routable-custom-type-to-the-sitemap)
- [Methods](#methods)
  - [`registerRoutableType(options)`](#registerroutabletypeoptions)
  - [`registerPrismicRoute(options)`](#registerprismicrouteoptions)
- [Advanced usage](#advanced-usage)
  - [Trailing Slash](#trailing-slash)
  - [Path Rewrites](#path-rewrites)
  - [Content Relationship Resolvers](#content-relationship-resolvers)

## Create a field to represent the Url of the custom type

To create a custom field to represent the Url of the custom type:

1. Head over to the Prismic console and navigate to custom types (`https://<prismic_repository_name>.prismic.io/masks/`)
1. Select the custom type to make routable
1. Drag and drop `Key Text - Text field for exact match search` from the right to the Main tab on the left.
1. Give the new field a `Field name`, `API ID` and optionally a `Field placeholder` (note the API ID is an important field and will be used below)
1. Click ok to confirm the inputs
1. Save the changes

**For the sake of simplicity we will assume the name of this field is `url` for the rest of this documentation**

## Create a GraphQL type to represent the custom type

If no GraphQL type was created to represent the custom data type within Front-Commerce, please create a GraphQL type to represent the custom type in schema.gql of the server module's directory

```diff
+type Album implements Routable {
+  url: String # the newly added field
+  artist: String
+  title: String
+  release_date: Date
+  path: String # for the routable interface
+}
```

Note that in order for the custom type to be routable it needs to implement the core Front-Commerce [Routable interface](https://gitlab.com/front-commerce/front-commerce/-/blob/2.7.1/src/server/modules/front-commerce/core/schema.gql#L87). That is why the GraphQL type must have a field called `path` to represent the URL of the routable type.

Add a new GraphQL type to the module's resolver:

```diff
export default {
  Query: {
    ...
  },
+  Album: {
+    path: async (content, _, { loaders }) => {
+      const baseUrl = (await loaders.Shop.getCurrentShop()).baseUrl,
+      return `{baseUrl}/${content.url}`;
+    },
+  },
+};
```

Note we added a path field resolver that appends the shop's baseUrl to the `url` field of our custom Prismic type.

## Add GraphQL type to the dispatcher query

Now you need to add your type to the GraphQL dispatcher query. For more info on the topic please refer to [Add GraphQL type to the dispatcher query section of the route dispatcher documentation](/docs/advanced/theme/route-dispatcher.html#Add-GraphQL-type-to-the-dispatcher-query)

## Register the Prismic custom type as a routable type

To make a custom Prismic type routable it must be registered with the Prismic module. First ensure that the `Prismic/Core` is added as a module's dependency then use `loaders.Prismic.registerRoutableType` to add the custom type as a routable type:

```diff
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";

export default {
  namespace: "<module_name_space>",
-  dependencies: [],
+  dependencies: ["Prismic/Core"],
  typeDefs,
  resolvers,
  contextEnhancer: ({ req, loaders }) => {
+    const { TitleTransformer, DateTransformer } = loaders.Prismic.transformers;

+    loaders.Prismic.defineContentTransformers("album", {
+      fieldTransformers: {
+        title: new TitleTransformer(),
+        release_date: new DateTransformer(),
+      },
+    })

+    loaders.Prismic.registerRoutableType({
+      typeIdentifier: "album", // <-- Prismic custom type
+      urlFieldName: "url",     // <-- Prismic API ID mentioned above
+      graphQLType: "Album",    // <-- GraphQL type created above
+      path: "/albums/:url",    // <-- The dynamic route. Examples: '/:uid', '/:lang/:uid', '/:section/:category?/:uid'.
+      isSitemapable: false,
+      postTransformer: (url, document, params) => { // optional function postTransformer
+        if(document.isPublished) {  // possible use case.
+          return document;
+        }
+      }
+    });

    return {};
  },
};
```

**Note:** the `postTransformer` above is optional. It is a function that will be called after [the transformation is done using `contentTransformOptions`](/docs/prismic/expose-content.html#Field-Transformers). It is given the current URL being resolved and the transformed document. It can be used if you have some custom logic to apply to the document or if you want to prevent the document from showing using some custom logic (returning a _falsy_ value).

**Note:**
If you have a nested route e.g. `/albums/:category/:uid` then you need add the `resolvers` that list the Content Relationships identifiers in the route, in this example the `album` has a content relationship to `category`.

```diff
      loaders.Prismic.registerRoutableType({
          typeIdentifier: "album",
-         path: "/albums/:url",
+         path: "/:category/:url",
+         resolvers : {
+           category: "category",
+         }
      });
```

<blockquote class="warning">
**Depth Limit:** The Route Resolver is limited to retrieving data from 2 levels deep, please see the [Route Resolver example](https://prismic.io/docs/technologies/route-resolver-nuxtjs#route-resolver-examples) for more information.
</blockquote>

## Map GraphQL type to a component

To map a GraphQL type to React component, create a file called `moduleRoutes.js` at the root of the `web` directory and add the following to it:

```js
import React from "react";

export const dispatchedRoutes = {
  Album: ({ loading, matched }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!matched) {
      return <div>No Album</div>;
    }
    const { title, artist, release_date } = matched;
    return (
      <div>
        <h3>Album:</h3>
        {title}
        <br />
        {artist}
        <br />
        {release_date?.toString()}
        <br />
      </div>
    );
  },
};
```

For more details please refer to [Add the mapping between the type and the page component](/docs/advanced/theme/route-dispatcher.html#Add-the-mapping-between-the-type-and-the-page-component) in the [route dispatcher](/docs/advanced/theme/route-dispatcher.html).

Now an instance of the custom Prismic type with the `url` field set to `my-custom-url` will be accessible at `https://<website_domain>/my-custom-url` (or `https://<website_domain>/<shop_name>/my-custom-url` if in a multi shop environment)

## Add a routable custom type to the sitemap

Optionally to add the custom Prismic type to the sitemap use the following steps:

1. implement the Sitemapable interface on the GraphQL type, and resolver.

```diff
// schema.gql
-type Album implements Routable {
+type Album implements Routable & Sitemapable {
url: String # the newly added field
artist: String
title: String
release_date: Date
path: String # for the routable interface
+ priority: Float
+ seoImages: [SitemapImage]
+ lastmod: String
+ changefreq: String
}
```

and

```diff
// resolvers.js
export default {
Query: {
...
},
Album: {
path: async (content, _, { loaders }) => {
  const baseUrl = (await loaders.Shop.getCurrentShop()).baseUrl,
  return `{baseUrl}/${content.url}`;
},
+ priority: () => 1,
+ seoImages: (content) => [],
+ lastmod: () => "2020-01-01T12:00:00.000Z",
+ changefreq: () => "daily",
},
};
```

1. Enable sitemap in the module definition file:

```diff
// index.js
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";

export default {
namespace: "<module_name_space>",
dependencies: ["Prismic/Core"],
typeDefs,
resolvers,
contextEnhancer: ({ req, loaders }) => {
  const { TitleTransformer, DateTransformer } = loaders.Prismic.transformers;
  loaders.Prismic.defineContentTransformers("album", {
    fieldTransformers: {
      title: new TitleTransformer(),
      release_date: new DateTransformer(),
    },
  })

  loaders.Prismic.registerRoutableType({
    typeIdentifier: "album", // <-- the Prismic custom type
    urlFieldName: "url",     // <-- Prismic API ID mentioned above
    graphQLType: "Album",    // <-- GraphQL type created above
-   isSitemapable: false,
+   isSitemapable: true,
    postTransformer: (url, document) => { // optional function postTransformer
      if(document.isPublished) {  // possible usecase
        return document;
      }
    }
  });

  return {};
},
};
```

## Methods

### `registerRoutableType(options)`

Registers a routable type within Front-Commerce and adds the route to the Prismic Route Resolver, it can also create a sitemapable route.

**Options:**

- `typeIdentifier` (string): the Prismic custom type identifier
- `urlFieldName` (string): the Prismic field name that contains the URL
- `graphQLType` (string): the GraphQL type to map to the custom type
- `path` (string): the dynamic route. Examples: `/:uid`, `/:lang/:uid`, `/:section/:category?/:uid`.
- `rewrites` (string[]) : the rewrite paths to apply on a url, they will be redirected the base path.
- `isSitemapable` (boolean): whether the type should be included in the sitemap
- `postTransformer` ([PostTransformerCallback](https://gitlab.com/front-commerce/front-commerce-prismic/blob/084cbb54049614259cf31045bf03de636c08c201/prismic/server/modules/prismic/core/makeRoutableTypeRegisterer.js#L114-120)): a function that will be called after the transformation is done using `contentTransformOptions`

**Example:**

```js
loaders.Prismic.registerRoutableType({
  typeIdentifier: "foo",
  graphQLType: "Foo",
  urlFieldName: "uid",
  path: "/foo/bar/:uid",
  rewrites: ["/baz/bar/:uid"],
  resolvers: {
    category: "category",
  },
  isSitemapable: true,
  postTransformer: (url, document, params) => {
    if (document.isPublished) {
      return document;
    }
  },
});
```

### `registerPrismicRoute(options)`

To leverage the [Prismic Route Resolver](https://prismic.io/docs/core-concepts/link-resolver-route-resolver#route-resolver), you add a route to the Route Resolver using the `registerPrismicRoute` method.

**Options:**

- `typeIdentifier` (string): the Prismic custom type identifier
- `path` (string): the dynamic route. Examples: `/:uid`, `/:lang/:uid`, `/:section/:category?/:uid`.

**Example:**

You might have a document type `foo` with a field `bar` and `baz`, but only `foo` is a routable type.

This method will allow you to add a route to the Route Resolver and the Prismic client which will in turn be able to resolve a `url` for the document type. e.g.

```js
  loaders.Prismic.registerRoutableType({ // This method registers a routable type
    type: "foo",
    path: "/foo-path/:uid",
    ...
  });
  loaders.Prismic.registerPrismicRoute({ // This method registers a route to the Route Resolver
    type: "bar",
    path: "/foo-path/:url" // this is a property in bar
  });
  loaders.Prismic.registerPrismicRoute({
    type: "baz",
    path: "/foo-path/:url" // this is a property in baz
  });
```

It's also important to note that only one route for a document type can be added to the route resolver, the last registered route will override the previous route e.g.

```js
loaders.Prismic.registerPrismicRoute({
  type: "foo",
  path: "/foo/:uid",
});
loaders.Prismic.registerPrismicRoute({
  type: "foo",
  path: "/bar/:uid",
});

// output for foo type is /bar/:uid
```

> This method will not create a resolvable route in Front-Commerce. If you need a routable type please use the `registerRoutableType` method instead, it also registers a prismic route.

## Advanced usage

### Trailing Slash

By default Front-Commerce will redirect urls with trailing slashes to their counterpart without a trailing slash. For example `/album/` will redirect to `/album`. You can configure this behavior to act the opposite way, where urls without trailing slashes are redirected to their counterparts with trailing slashes.

To achieve this you can add a trailing slash to the `path` on the `registerRoutableType` method:

```diff
  PrismicLoader.registerRoutableType({
-   path: "/album/:uid",
+   path: "/album/:uid/",   // this will enforce redirects to trailing slash
    ...
  })
```

> ProTip : You can use the online [express-route-tester@2.0.0](http://forbeslindesay.github.io/express-route-tester) to test your paths.

| path     | url     | result     |
| -------- | ------- | ---------- |
| `/:uid`  | `/foo`  | `match`    |
| `/:uid`  | `/foo/` | `redirect` |
| `/:uid/` | `/foo`  | `redirect` |
| `/:uid/` | `/foo/` | `match`    |

### Path Rewrites

Rewrites allow you to map an incoming request path to a different destination path.
Rewrites act as a URL proxy and mask the destination path, making it appear the user hasn't changed their location on the site. In contrast, redirects will reroute to a new page and show the URL changes.
To use rewrites you can use the `rewrites` key in the `registerRoutableType` method:

```js
PrismicLoader.registerRoutableType({
  typeIdentifier: "foo",
  path: "/baz/:uid",
  rewrites: ["/foo/:uid", "/bar/:uid"],
});
```

### Content Relationship Resolvers

When using nested paths `/:section/:category/:uid` you should use the `resolvers` to map the `:category` and `:section` relationships to the Prismic document fields.

> The nesting is currently limited at 2 levels deep.

```
// Level 1 (The document being queried via the uid)
{
   type : "album"
   title: "Gates of Thorns",
   uid: "gates-of-thorns",
   parent_category: "hard-rock",  <- Relationship Field
}

// Level 2 (Relationship to album)
{
    type: "category",
    title: "Hard Rock",
    uid: "hard-rock"
    parent: "rock" <- Relationship Field
}

// level 3 (Relationship to category)
{
   type: "category",
   title: "Rock",
   uid: "rock",
   parent: "music" <- Relationship Field
}
```

As you may notice the relationships fields can continue infinitely deep, but as mentioned they are limited to the second level.

```
    loaders.Prismic.registerRoutableType({
      typeIdentifier: "album",
      urlFieldName: "uid",
      graphQLType: "Album",
      path: "/:level1?/:level2?/:level3?/:uid",
      resolvers: {
        level1: "parent_category",
        level2: "parent_category.parent",
        level3: "parent_category.parent.parent", ❌ this will fail as it's trying to access the 3rd nested level
      },
    });

    loaders.Prismic.registerRoutableType({
      typeIdentifier: "album",
      urlFieldName: "uid",
      graphQLType: "Album",
      path: "/:level1?/:level2?/:uid",
      resolvers: {
        level1: "parent_category",
        level2: "parent_category.parent",
      },
    });
```

Here are some examples of how the paths would be resolved for this registered route.

**Example 1:** with existing relationships

```js

// Level 1
{
   uid: "gates-of-thorns",
   parent_category: "hard-rock",  <- Relationship Field
}

// Level 2
{
    uid: "hard-rock"
    parent: "rock" <- Relationship Field
}

path: `/:level1?/level2?/:uid`
url: `/rock/hard-rock/gates-of-thorns`
```

**Example 2:** without existing relationships

```js

// Level 1
{
   uid: "gates-of-thorns",
}


path: `/:level1?/level2?/:uid`
url: `/gates-of-thorns`
```
