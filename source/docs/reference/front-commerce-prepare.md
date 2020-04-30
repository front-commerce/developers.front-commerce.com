---
id: front-commerce-prepare-js
title: front-commerce-prepare.js
---

The `front-commerce-prepare.js` configuration file at the root of any web modules folder.

From this file, Front-Commerce will call hooks that will let you customize some of those steps. Each hook should be exported using the syntax:

## `onCreateRoute`

A function that transforms a `route` found in the modules defined in [`.front-commerce.js:webModules`](/docs/reference/front-commerce-js.html#webModules).

See [Routing reference](/docs/reference/routing.html#How-routes-are-loaded) for details about the terms used.

### Parameters

- `route`: an object with the following properties:
  - `fromModule` (string): path of the web module defining the current route
  - `filepath` (string): absolute path to the route file
  - `path` (string): `path` that will be used for mapping URLs to this file (see [Routing reference](/docs/reference/routing.html#How-routes-are-loaded) for details)
  - `isLayout` (bool): Is the file a `_layout.js`?
  - `isLayoutAddition` (bool): Is the file a layout customization? (`_error.js` or `_inner-layout.js`)
  - `isRoute` (bool): Is the file a route (= neither a layout nor a layout addition)

### Return value

An optional route object with the following keys:

- `fromModule` (string): path of the web module defining the current route
- `filepath` (string): absolute path to the route file
- `path` (string): `path` that will be used for mapping URLs to this file (see [Routing reference](/docs/reference/routing.html#How-routes-are-loaded) for details)

If no route is returned, the route is ignored.

### Example:

```js
module.exports.onCreateRoute = route => {
  // Remove all the `/contact/` pages
  if (route.path === "/contact/") {
    return null;
  }

  return route;
};
```
