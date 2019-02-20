---
id: add-a-page-client-side
title: Add a new page
---

Depending on the level of customization of your Front-Commerce application, you might want to add a new kind of page to your React application.

There are two ways to do so:

1. add a page using a static URL
2. add a page using dynamic URLs

## Add a page using a static URL

Let's say that your goal is to display a component `MyCustomPage` when a user goes to the URL `/custom-page`.

To do so, you need to create the file `my-module/web/moduleRoutes.js` in your module. (See [Extend the theme](/docs/essentials/extend-the-theme.html) if you don't have any module yet.)

```jsx
import React from "react";
import Route from "react-router/Route";
import MyCustomPage from "theme/pages/MyCustomPage";

export default () => [
  <Route path="/custom-page" exact render={() => <MyCustomPage />} key="1" />
];
```

If you take a look at the line #2, you will notice that the underlying technology is [React Router](https://github.com/ReactTraining/react-router). For this reason, you can use any feature that is available in this library. In particular, if you need to pass some paramaters in your URL, you can use the params the params syntax of React Router (`/page/:id`).

<blockquote class="warning">
    **Warning:** If several modules are registered in your application and several of them define the same route, the page of the first module in `.frontcommerce.js` will be displayed.
</blockquote>

## Add a page using dynamic URLs

Some URLs might be a bit more troublesome to use. For instance, in a e-commerce shop, you usually want some nice URLs for SEO reasons. Instead of `/product/:sku` you'll want `/my-product-title`. If you come from a Magento background, this is what we call [URL Rewrites](https://docs.magento.com/m2/ce/user_guide/marketing/url-rewrite.html).

Some of these cases are already taken into account within Front-Commerce (Products, Categories, CMS pages, ...). But depending on your own site, you might need to add new ones.

To do so, you need to:

1. Export the named object `dispatchedRoutes` in your `my-module/web/moduleRoutes.js` file
```
export const dispatchedRoutes = {
  pageType: props => <MyCustomPage id={props.matched.identifier} />
};
```
2. Make sure that the GraphQL endpoint `matchUrls` will resolve your url to the following kind of object:
```
{
  url: "my-dynamic-custom-url",
  type: "pageType", // matches the key in your `dispatchedRoutes` object
  identifier: "identifier", // id that makes it possible to fetch the data needed in the page
  target_path: "my-dynamic-custom-url",
  redirect_type: 301
}
```
This can be achieved by overriding the `Query.matchUrls` resolver within [a GraphQL module](#TODO).

<blockquote class="info">
**Magento:** If the url you are trying to add are managed by Magento, this can be achieved by [adding an url rewrite directly in your backend](https://devdocs.magento.com/guides/v2.2/cloud/configure/import-url-rewrites.html), since the mechanism already exists in the Magento module of Front-Commerce.
</blockquote>