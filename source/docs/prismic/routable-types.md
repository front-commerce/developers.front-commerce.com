---
id: routable-types
title: Prismic Routable Types
---

To make a custom prismic data type routable these steps are required:

- [Create a field to represent the Url of the custom type](#create-a-field-to-represent-the-url-of-the-custom-type)

- [Create a GraphQL type to represent the custom data type](#create-a-graph-ql-type-to-represent-the-custom-data-type)

- [Register the prismic custom type as a routable type](#register-the-prismic-custom-type-as-a-routable-type)

- [Map GraphQL type to component](#map-graph-ql-type-to-component)

- Optionally [add a routable custom type to the site map](#add-a-routable-custom-type-to-the-site-map)

## Create a field to represent the Url of the custom type

To create a custom field to represent the Url of the custom type:

1- Head over to the prismic console and navigate to custom types (https://<prismic_repository_name>.prismic.io/masks/)

2- Select the custom type to make routable

3- Drag and drop "Key Text - Text field for exact match search" from the right to the Main tab on the left.

4- Give the new field a "Field name", "API ID" and optionally a "Field placeholder" (note the "API ID" is an important field and will be used below)

5- Click ok to confirm the inputs

6- Save the changes

**For the sake of simplicity we will assume the name of this field is `url` for the rest of this documentation**

## Create a GraphQL type to represent the custom data type

If no GraphQL type was created a to represent the custom data type its time to do so.

Create a GraphQL type to represent the custom datatype in schema.gql of the server module's directory

```diff
+type Album implements Routable {
+  url: String # the newly added field
+  artist: String
+  title: String
+  release_date: Date
+  path: String # for the routable interface
+}
```

Note that inorder for the custom type to be routable it needs to implement the core front-commerce [Routable interface](https://gitlab.com/front-commerce/front-commerce/-/blob/2.7.1/src/server/modules/front-commerce/core/schema.gql#L87). Which basically means the GraphQL type will have to have a field called `path` to represent the url of the routable type.

Add a new GraphQL type to the module's resolver:

```diff
export default {
  Query: {
    ...
  },
+  Album: {
+    path: (content) => {
+      return (
+        "/" + content.url
+      );
+    },
+  },
+};
```

Note we added a path field resolver that appends a `/` to the `url` field of our custom prismic type.

## Register the prismic custom type as a routable type

To register the custom type as a routeable prismic type it must be registered with the prismic module. First ensure that the `Prismic/core` is added as a module's dependency then use `loaders.Prismic.registerRoutableType` to add the custom type as routable type:

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
+      typeIdentifier: "album", // <-- prismic custom type
+      urlFieldName: "url",     // <-- prisic API ID mentioned above
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

## Map GraphQL type to component

To map a GraphQL type to react component, create a file called `moduleRoutes.js` at the root of the `web` directory and add the folowing to it:

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

Now an instance of the custom prismic type with the `url` field = `my-custom-url` will be browsable using the following link https://<website_domain>/my-custom-url (or https://<website_domain>/<shop_name>/my-custom-url if in a multi shop environment)

## Add a routable custom type to the site map

Optionally to can add the custom primic type to the site map use the folowing steps:

1- implement the Sitemapable interface on the GraphQL type, and resolver.

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
    path: (content) => {
      return (
        "/" + content.url
      );
    },
+    priority: () => 1,
+    seoImages: (content) => [],
+    lastmod: () => "2020-01-01T12:00:00.000Z",
+    changefreq: () => "daily",
  },
};
```

2- Enable sitemap in the module defenition file:

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
      typeIdentifier: "album", // <-- the prismic custom type
      urlFieldName: "url",     // <-- prisic API ID mentioned above
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
