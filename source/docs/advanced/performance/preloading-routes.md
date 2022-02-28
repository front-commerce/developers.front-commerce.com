---
id: preloading-routes
title: Preloading Routes' data
---

<blockquote class="feature--new">
  _This feature has been added in version `2.0.0-rc.0`_
</blockquote>

When a website is slow, the first thing that comes to mind is to improve raw metrics like the Speed Index. And while this is definitely useful, we shouldn't overlook the [_perceived_ performances](https://blog.teamtreehouse.com/perceived-performance). The goal is not to improve the response time, but to better manage the time to make the user _think_ that the website is fast.

One way to do this is to anticipate the user's need and start the long running tasks before they actually need it. For instance, when a user is navigating on a catalog, on desktop, they will hover the product before clicking on it. Thus, we can start loading the product page as soon as the user hovers the product element, instead of waiting for the click. This can seem like a micro-optimization, but it definitely improves how fast the user _thinks_ your site is.

## How to preload data?

The main idea is to launch Apollo requests twice:

- when you think that the user will need the data
- when you are displaying the data

By doing this, you will first warm up Apollo's cache and this cache will be reused when you display your data. But this can be tedious. This is why in Front-Commerce, we have added a <abbr title="Higher Order Component">HOC</abbr> that will do this: `web/core/apollo/graphqlWithPreload`.

Let's see how it works by upgrading adding preload to a product component:

```diff
import React from "react";
-import { graphql } from "react-apollo";
+import graphqlWithPreload from "web/core/apollo/graphqlWithPreload";

const Product = props => {
  return <div>{props.product.name}</div>;
};

const EnhancedProduct = (
-  graphql(ProductQuery, {
+  graphqlWithPreload(ProductQuery, {
    options: props => ({
      variables: {
        sku: props.sku
      }
-    })
+    }),
+    preloadOptions: params => ({
+      variables: {
+        sku: params.sku
+      }
+    })
  })
)(Product);
```

We swap the `graphql` HOC that is usually used when requesting data with `graphqlWithPreload`. The only difference is that we add `preloadOptions`. This option should return the same object as in `options`. The only difference is that `options` takes the `props` as in React as parameters whereas `preloadOptions` uses `params`.

The `params` used here are actually the params passed to the static preload property that the `graphqlWithPreload` HOC creates.

```js
EnhancedProduct.preload(params);
```

This means that you are responsible to recreate the `params` each time you call the `preload` function.

For instance, let's say that we want to preload the product with SKU `VD12` when you click on a button. This means that you will write something like:

```jsx
const PreloadProductButton = () => {
  return (
    <button
      onClick={() => {
        EnhancedProduct.preload({ sku: "VD12" });
      }}
    >
      Preload product
    </button>
  );
};
```

This is a very contrived example. However, you could imagine doing this on whatever event: hover, focus, click or even IntersectionObserver.

<blockquote class="warning" id="preloading-hoist-static">
  **Warning:** if you have some HOC that you are using before `graphqlWithPreload`, you won't have any `preload` static property on your final component. You will need to hoist the static properties at the top level.

```diff
-import { withProps } from "recompose";
+import { compose, hoistStatics, withProps } from "recompose";
const EnhancedComponent = compose(
-  withRouter,
-  withProps(() => /* ... */),
+  hoistsStatics(
+    compose(
+      withRouter,
+      withProps(() => /* ... */)
+    )
+  )
graphqlWithPreload(Query)
)(BaseComponent)
```

</blockquote>

## How to preload routes?

However, in some cases you don't really know which component you should preload. This is the case for the url: `/venia-dresses` for instance. If you are familiar with Magento Venia's sample data, you will recognize that it is a category. But you may not know which component is actually used to display it.

This is why we have implemented preloads on links too. This is possible with the React hook `theme/modules/Router/usePreload` that will give you a preload function to load the components and data for a given link.

<blockquote class="note">
This hook is useful if you want to have custom events to preload data. However, the default links in Front-Commerce already use the `usePreload` hook and will preload pages before the user needs them. This documentation is here to explain how this works under the hood.
</blockquote>

```js
import { usePreload } from "theme/modules/Router/usePreload";

const PreloadVeniaDresses = () => {
  const preload = usePreload();

  return (
    <button
      onClick={() => {
        preload("/venia-dresses");
      }}
    >
      Preload product
    </button>
  );
};
```

If you inspect your network dev tools in your browser, you should see some requests appearing when you click on the button. They preload the data needed to display the `/venia-dresses` page.

Under the hood, it looks into the `.front-commerce/themes.es.js` file generated at build time from your `theme/routes` folders (cf. [Routing documentation](/docs/reference/routing.html)). If the URL matches one of the routes available here, it will preload the component and then preload its data using the `preload` static property of the component.

This is why if you have trouble preloading data on one of your custom routes, you first need to make sure that the `preload` property is available. If it is not, please refer to [the first part of this documentation](#How-to-preload-data).

Additionally, it will also preload the data needed for the layouts around the matched route. This means that you can also set a `preload` static property on layouts and inner layouts.

## How to preload routes with parameters?

You can now preload static pages such as `/contact` or `/home`. But what about `/product/:sku` or `/my-seo-friendly-product-url`?

The `usePreload` hook will take care of this for you by calling the `preload` static property of your component with an object containing:

- `match`: a [React Router object](https://reacttraining.com/react-router/web/api/match) that describes the currently matched route.
  - `params` (object): Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
  - `isExact` (boolean): true if the entire URL was matched (no trailing characters)
  - `path` (string): The path pattern used to match. Useful for building nested `<Route>`s
  - `url` (string): The matched portion of the URL. Useful for building nested `<Link>`s
- `location`: a [React Router object](https://reacttraining.com/react-router/web/api/location) that describes the url that you passed to the `preload` function (`/venia-dresses` in the example above)

These two parameters allow you to almost expect to have the same properties between the `options` and `preloadOptions` functions of `graphqlWithPreload`.

For instance, let's consider that the URL `/product/:sku` should display the following component.

```js
import React from "react";
import graphqlWithPreload from "web/core/apollo/graphqlWithPreload";

const Product = (props) => {
  return <div>{props.product.name}</div>;
};

const EnhancedProduct = graphqlWithPreload(ProductQuery, {
  options: (props) => ({
    variables: {
      sku: props.match.params.sku,
    },
  }),
  preloadOptions: (params) => ({
    variables: {
      sku: params.match.params.sku,
    },
  }),
})(Product);
```

Then this means that if you call `preload("/product/VD12")`, in `params.match.params.sku` (line 17) you will have the value `VD12`.

If you need search parameters in the URL (e.g. `?param=value`), it will be available at `params.location.search`.

## Front-Commerce Fast Mode

To conclude, if you want your application to feel even faster to your users, you need to:

- add a `preload` static property to your routes thanks to `graphqlWithPreload`
- use `usePreload` hook through the default Link component in Front-Commerce or manually in your own events.

You can tweak how the `usePreload` works in links by adding a [`preload` property in your `config/website.js`](/docs/reference/configurations.html#config-website-js).
