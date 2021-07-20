---
id: routable-types
title: Prismic Routable Types
---

To make a custom Prismic data type routable these steps are required:

- [Create a field to represent the Url of the custom type](#create-a-field-to-represent-the-url-of-the-custom-type)
- [Create a GraphQL type to represent the custom type](#create-a-graph-ql-type-to-represent-the-custom-type)
- [Register the Prismic custom type as a routable type](#register-the-prismic-custom-type-as-a-routable-type)
- [Map GraphQL type to a component](#map-graph-ql-type-to-a-component)
- Optionally [add a routable custom type to the sitemap](#add-a-routable-custom-type-to-the-sitemap)

## Create a field to represent the Url of the custom type

To create a custom field to represent the Url of the custom type:

1. Head over to the Prismic console and navigate to custom types (https://<prismic_repository_name>.prismic.io/masks/)
1. Select the custom type to make routable
1. Drag and drop "Key Text - Text field for exact match search" from the right to the Main tab on the left.
1. Give the new field a "Field name", "API ID" and optionally a "Field placeholder" (note the "API ID" is an important field and will be used below)
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

Note we added a path field resolver that appends the shop's baseUrl  to the `url` field of our custom Prismic type.

## Register the Prismic custom type as a routable type

To make a custom Prismic type routable it must be registered with the Prismic module. First ensure that the `Prismic/core` is added as a module's dependency then use `loaders.Prismic.registerRoutableType` to add the custom type as routable type:

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
+    const contentTransformOptions = {
+      fieldTransformers: {
+        title: new TitleTransformer(),
+        release_date: new DateTransformer(),
+      },
+    };
+
+    loaders.Prismic.registerRoutableType({
+      typeIdentifier: "album", // <-- Prismic custom type
+      urlFieldName: "url",     // <-- Prismic API ID mentioned above
+      graphQLType: "Album",    // <-- GraphQL type created above
+      contentTransformOptions,
+      isSitemapable: false,
+      postTransformer: (url, document) => { // optional function postTransformer
+        if(document.isPublished) {  // possible usecase
+          return document;
+        }
+      }
+    });

    return {};
  },
};
```

Note the `postTransformer` above is optional. It is a function that will be called after the transformation is done using `contentTransformOptions`. it is given the current URL being resolved and the transformed document. It can be used if you have some custom logic to apply to the transformed document or if you want to supress a document from showing using some custom logic (returning a falsey value).

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
+  priority: Float
+  seoImages: [SitemapImage]
+  lastmod: String
+  changefreq: String
}
```

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
+    priority: () => 1,
+    seoImages: (content) => [],
+    lastmod: () => "2020-01-01T12:00:00.000Z",
+    changefreq: () => "daily",
  },
};
```

2. Enable sitemap in the module definition file:

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
    const contentTransformOptions = {
      fieldTransformers: {
        title: new TitleTransformer(),
        release_date: new DateTransformer(),
      },
    };

    loaders.Prismic.registerRoutableType({
      typeIdentifier: "album", // <-- the Prismic custom type
      urlFieldName: "url",     // <-- Prismic API ID mentioned above
      graphQLType: "Album",    // <-- GraphQL type created above
      contentTransformOptions,
-      isSitemapable: false,
+      isSitemapable: true,
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
