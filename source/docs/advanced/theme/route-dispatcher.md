---
id: route-dispatcher
title: Handle dynamic URLs with the Dispatcher
---

In some cases, you will need more control over URLs formats than what we introduced in the [Add a new page guide](../../essentials/add-a-page-client-side). For instance, you may prefer to have `/my-product` instead of `/product/my-product-slug` for SEO reasons.

That is what Front-Commerce’s Dispatcher is responsible for, and what we will cover in this documentation.

## What is the goal of the Dispatcher?

The dispatcher is actually a component within Front-Commerce that will be displayed in case no other route was found. Its goal will be to ask the server (by using the `route` root query in your GraphQL Schema) what kind of page is associated with the current URL and will display the page's component accordingly.

Below is a flowchart illustrating the URL resolution logic:

<figure>
![Diagram explaining how an URL is displayed](./assets/dispatcher.svg)
</figure>

If you come from a Magento background, this is the concept behind [URL Rewrites](https://docs.magento.com/m2/ce/user_guide/marketing/url-rewrite.html).

In Front-Commerce’s core integrations (such as Magento2), the association between a URL and a page is already implemented for entities like Products, Categories, CMS pages… But depending on your own site, you might need to add new ones.

To do so, you will need to proceed in two steps:

- Register a new urlMatcher
- Add the mapping between the type returned by `route` and the page component that should be displayed

## Register a new urlMatcher

<blockquote class="info">
**Magento:** If the url you are trying to add are managed by Magento, you don't need any of this. You should instead [add an url rewrite directly in your backend](https://devdocs.magento.com/guides/v2.2/cloud/configure/import-url-rewrites.html), since the mechanism already exists in the Magento module of Front-Commerce.
</blockquote>

To add a new `urlMatcher` to a module you need to register `FrontCommerce/Core` as a module dependecy and then use `registerUrlMatcher` to add a custom `urlMatcher`:

```diff
import typeDefs from "./schema.gql";
+import myCustomUrlMatcher from './urlMatcher.js';
import MyCustomLoader from './loader.js';
import { makeUserClientFromRequest } from "server/modules/magento2/core/factories";

const moduleDefinition = {
  namespace: "MyCustomModule",
-  dependencies: ["Front-Commerce/Core"],
+  dependencies: [],
  typeDefs,
  contextEnhancer: ({ req, loaders }) => {
    const axiosInstance = makeUserClientFromRequest(req);
    const CustomLoader = MyCustomLoader(axiosInstance);
+    loaders.Page.registerUrlMatcher(myCustomUrlMatcher(CustomLoader));
    return {
      MyCustomLoader: CustomLoader
    };
  },
};

export default moduleDefinition;
```

```js
// urlMatcher.js
const myCustomUrlMatcher = (loader) => async (url, match) => {
  if (match.__typename) {
    // a match have been already loaded (you can still override it or return it as is like we do here)
    return match;
  }
  const myMatch = await loader.loadByUrl(url);
  if (!myMatch) {
    return match; // return original match if none is found (this is needed!)
  }
  return {
    // return your custom routable entity
    path: myMatch.canonical_url || url, // depending on your use case can be same as url
    url,
    __typename: "MyCustomType", // the GraphQL type of your custom type (should be added in schema.gql),
    ...myMatch, // or some adaptation of it. this will be available to your component defined bellow on a prop called `matched`
  };
};

export default myCustomUrlMatcher;
```

```gql
# schema.gql
MyCustomType implements Routable {
  path: String! # needed for Routable
  title: String! # example field
  ... # define own schema
}
```

```js
// loader.js
const MyCustomLoader = (axiosInstance) => {
  return {
    loadByUrl: (url) => {
      return (
        // example: get data by issuing an external api call
        axiosInstance
          .get(`/my/api/my-custom-entity?url=${encodeURIComponent(url)}`)
          .then((response) => response.data)
          .catch((err) =>
            err.response?.status === 404 ? null : Promise.reject(err)
          )
      );
    },
  };
};
```

<blockquote class="note">
    See [Loaders](/docs/advanced/graphql/slim-down-resolvers-with-loaders.html) documentation to learn how to instantiate your loader and add it to your GraphQL context.
</blockquote>

Once this is done, you should be able to test that everything works as expected by using the GraphQL Playground at http://localhost:4000/playground and executing the following query:

```gql
{
  route(url: "some-dynamic-custom-url") {
    path
    ... on MyCustomType {
      title # example
    }
  }
}
```

## Add GraphQL type to the dispatcher query

Override `DispatcherQuery` if you have not already done so. You can find it under `src/web/theme/modules/Router/DispatcherQuery.gql`.

Add an [inline fragment](https://graphql.org/learn/queries/#inline-fragments) to the `DispatcherQuery` for your newly created GraphQL type:

```diff
...
+import 'path_to_your_fragment/MyCustomTypeFragment.gql'
+import 'path_to_your_fragment/MyCustomTypeCacheControlFragment.gql'
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
      ...ProductCacheControlFragment
    }
    ... on Category {
      ...CategoryFragment
      ...CategoryCacheControlFragment
    }
    ... on CmsPage {
      ...CmsPageFragment
      ...CmsPageCacheControlFragment
    }
+    ... on MyCustomType {
+      ...MyCustomTypeFragment
+      ...MyCustomTypeCacheControlFragment # optional check note below for link
+    }
  }
}
```

```gql
# MyCustomTypeFragment.gql
fragment AlbumFragment on Album {
  title
  # more fields go here
}
```

Note: for more info related to setting up cache control check [the cache control and CDN documentation](/docs/advanced/performance/cache-control-and-cdn)

## Add the mapping between the `__typename` and the page component

Once your server is correctly configured, you need to map the `__typename` of your GraphQL datatype to a custom component.

To do so, you need to create the `my-module/web/moduleRoutes.js` file in your module that will contain the mapping. You might have already created if you followed the [Add a new page](/docs/essentials/add-a-page-client-side.html#Map-the-URL-to-the-page-component) guide. But instead of using the default export, you will need to export a named object `dispatchedRoutes`.

This object has `__typenames` as keys (in our case `MyCustomType`), and a render function as values that will tell the application what to render for a specific key (in our case, it renders `MyCustomPage`). This will give you something like this:

```js
//` my-module/web/moduleRoutes.js`
import React from "react";
import MyCustomPage from "theme/pages/MyCustomPage";

export const dispatchedRoutes = {
  MyCustomType: (props) => <MyCustomPage dataPropName={props.matched} />,
};

// you can still export your static routes here
// export default () => [
//   <Route ... />
// ];
```

In the props passed to a render function (L6), you will have access to a `matched` property that is in fact the object returned by your `matchUrl` function.

Once you've created your file, you can refresh your application
(`npm run start`), and you should see your new route if you go
to the `/some-dynamic-custom-url` URL. It will display `MyCustomPage` component.

And this is it! From now on, any URL that is matched by the url matcher, will now be displayed with the render function defined in your `dispatchedRoutes` export under the matching key. Otherwise, a 404 page will still be displayed to the user.
