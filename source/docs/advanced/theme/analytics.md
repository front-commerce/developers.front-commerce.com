---
id: analytics
title: Analytics
---

Most e-commerce website need advanced analytics to better understand their users and adapt their shops to their customers needs. But it can often be tedious to maintain when you have many trackings to manage.

In Front-Commerce, we use [`analytics.js`](https://segment.com/docs/sources/website/analytics.js/). It is a library created by [Segment.io](https://segment.com/) that aims at decoupling the tracking settings from the event.

If we represent how it works, it would look like this:

<figure>
![Schema explaining the concepts behind analytics.js](./assets/analytics.svg)
</figure>

Across your React application, you can track events using functions such as `trackEvent` or `trackPage`. Then, the event is dispatched to all the relevant integrations registered in your application.

This means that once you have correctly configured events in your React Components, adding new trackings can be really straightforward.

## Track an event

An event is something that happens in your application. For instance, it can happens when a user clicks on a button, opens a dropdown, etc. It usually conveys meaning to your marketing team to better understand what drives your users.

Most of the e-commerce related events are already implemented within Front-Commerce. But each website will have different behaviors, and it can be interesting to add your own events to see how your customers uses your application.

To do so, you will need to call the method `trackEvent` from `web/utils/analytics`.

For instance, let's say that you are building a grocery store and that you have created Recipe pages that display a list of ingredients needed for the current recipe. Below this list, you have a created a button that adds all the ingredients to the cart of the user, and you want to know if this button is useful and if users click on it.

The button would likely be a component that would look like this:

```jsx
import React from "react";
import Button from "theme/components/atoms/Button";

const AddIngredientsToCart = ({addToCart}) => {
  return (
    <Button onClick={() => {
      addToCart();
    }}>
      Add ingredients
    </Button>
  );
}

export default AddIngredientsToCart;
```

To add your tracking, you would need to call the `trackEvent` method when the user clicks on the Button. Thus, your new component would look like this:

```diff
import React from "react";
import Button from "theme/components/atoms/Button";
+import { trackEvent } from "web/core/analytics";

const AddIngredientsToCart = ({addToCart, ingredients}) => {
  return (
    <Button onClick={() => {
+     trackEvent("Added ingredients to cart", {
+       ingredients: ingredients
+     });
      addToCart();
    }}>
      Add ingredients
    </Button>
  );
}

export default AddIngredientsToCart;
```

This `trackEvent` method is actually a shortcut that lets you call the `analytics.track` method of `analytics.js`. It uses the exact same API. See [the official documentation](https://segment.com/docs/spec/track/) for more detailed information.

Additionally, you may wonder what name and properties you should give to your events. It depends on the integrations you are using and if you want to create a new event or use Semantic ones (supported events within Segment.io). To learn more about this, please refere to the [Semantic Events documentation](https://segment.com/docs/spec/semantic/).

### Track an event as a React Component

If you don't have an actual callback where to put the `trackEvent` (like `onClick`), you can use the `withTrackOnMount` enhancer that will let you call the `trackEvent` using [React lifecycle]((http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)).

For instance, in Front-Commerce's core, we are using `withTrackOnMount` like this to track when a user sees their cart.

```jsx
import withTrackOnMount from "theme/modules/Analytics/withTrackOnMount";

export default withTrackOnMount({
  event: "Cart Viewed",
  isResolvedFromProps: props => !props.loading && props.cart,
  shouldUpdateEvent: (prevProps, nextProps) =>
    prevProps.cart.id !== nextProps.cart.id,
  mapPropsToProperties: props => {
    return {
      cart_id: props.cart.id,
      products: props.cart.items.map((item, index) => ({
        sku: item.sku,
        name: item.name,
        quantity: item.qty,
        price: item.priceInfo.price.priceInclTax.value.amount,
        position: index + 1
      }))
    };
  }
})(Cart)
```

<blockquote class="note">
Please refer to [Analytics React Components](/docs/reference/analytics-components.html#withTrackOnMount) to have a detailed explanation of the API of `withTrackOnMount`.

Note that if you prefer to use render props you can refer to [`TrackOnMount`](docs/reference/analytics-components.html#TrackOnMount).
</blockquote>

### Track page

In trackings scripts, there is often a distinction between the `page` and the `event` even though a `page` event is only a subset of the `event`s.

To make this distinction clear, we provide an enhancer in the same spirit of `withTrackOnMount` but for page events: `withTrackPage`.

`withTrackPage` is an enhancer that lets you track a page each time a component is rendered and when the location has changed.

For instance, in Front-Commerce's core
```jsx
import withTrackPage from "theme/modules/Analytics/withTrackPage";

withTrackPage("Home")(Cart)
```

<blockquote class="note">
Please refer to [Analytics React Components](/docs/reference/analytics-components.html#withTrackPage) to have a detailed explanation of the API of `withTrackPage`.

Note that if you prefer to use render props you can refer to [`TrackPage`](docs/reference/analytics-components.html#TrackPage).

Moreover, we didn't talk about a `trackPage` method here. This is because a `Page` is tightly coupled to a React Component. This is why you shouldn't need to use `trackPage` directly.
</blockquote>

## Add an integration

An integration will listen each `event` and `page` tracking in your application and will send it to your tracking service. To configure which tracking service your application will use, you need to edit the `config/analytics.js` file:

```js
module.exports = {
  analytics: {
    // Make sure that your analytics is enabled
    enable: true,
    // Enables the debug mode of the `analytics.js` library
    debug: true,
    defaultSettings: {},
    // The list of integrations is defined here
    integrations: [
      {
        // The name allows to know if the user allowed to use
        // this tracking service or not
        name: "google-analytics",
        // Usually we always need to set it to true since GDPR
        needConsent: true,
        settings: {
          // Settings needed by the integration
          // The fact that it the key "Google Analytics" is
          // defined by the integration itself
          "Google Analytics": {
            trackingId: "123456",
            enhancedEcommerce: true
          }
        },
        // integration that will add itself to the `analytics.js` lib
        script: () =>
          require("@segment/analytics.js-integration-google-analytics")
      }
      // You can add other integrations here. They are loaded asynchronously and
      // won't impact the user's performance too much (as long as there are not
      // too many).
    ]
  }
};
```

Here we have used the Google Analytics integration. You can find the [list of existing integrations here](https://github.com/segment-integrations).

<blockquote class="warning">
However, please note that some integrations are not up to date. Even if you find one that matches your need, it might not work. However, looking into its code will let you know how to make it work, and you could eventually fork it to fix it.
</blockquote>

### GDPR consent

If your integrations need consent of the user before running, you need to setup the `config/cookieServices.js` file. This file will let you define which cookies and trackings services are used within your application and will let the user chose which tracking service to allow.

```js
export default [
  {
    // Category of cookies to allow the user to accept all the integrations at once in a specific category
    title: "Analytics",
    description:
      "These cookies allows us to measure the traffic on our contents and hence to improve them.",
    services: [
      {
        // The name should be the same as mentionned in the `config/analytics.js` file
        name: "google-analytics",
        title: "Google Analytics",
        // display all the cookies managed by Google Analytics
        cookies: [
          "_ga",
          "_gat",
          "_gid",
          "__utma",
          "__utmb",
          "__utmc",
          "__utmt",
          "__utmz"
        ],
        description:
          "Google Analytics cookies, from Google, are meant to gather statistics about visits.",
        link: "https://support.google.com/analytics/answer/6004245"
      }
    ]
  }
];
```

### How to create a custom integration?

<blockquote class="wip">
Currently, the integrations creation is not documented by Segment.io. We plan to add information here to help you to:
<ul>
  <li>define an integration that will add a specific pixel on a specific page</li>
  <li>understand which tracking scripts will make your life easier and which one will not in the context of an <abbr title="Single Page Application">SPA</abbr></li>
  <li>find which callback will be called within your integration depending on the event</li>
</ul>
If you need these informations right away, please [contact us](mailto:contact@front-commerce.com). We will make sure to answer you in a timely manner.
</blockquote>
