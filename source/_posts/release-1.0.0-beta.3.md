---
title: "Release: 1.0.0-beta.3"
date: 2019-06-06
---

Front-Commerce `1.0.0-beta.3` has been released with several improvements: better embedded payment experience, customizable WYSIWYG components, configurations override…

We also want to thank our partner [PH2M](https://www.ph2m.com) for their first PRs, and [Webqam](https://www.webqam.fr) and [Occitech](https://www.occitech.fr) for their contributions. This release is the first one with PR merged from partners!

Two smaller bugfixes releases have been tagged since `1.0.0-beta.0` so that some projects could move forward faster, but they did not contain any significant changes.

<!-- more -->

## New features

Even though we are still in our `beta` releases, we don't want to slow down our customers and keep on adding the features they need.

### Improved embedded payments

In previous versions, embedded payments such as Stripe or Payzen needed two clicks for placing an order: one to validate the payment's information, and another to place the order. We have improved this behavior and the user now only needs to submit its payment, and this will place the order directly in one click.

We also upgraded Stripe and Payzen to their latest versions to make sure that your customers have the best payment experience.

Finally, Stripe integration has been improved to create Stripe Customers entities upon payments so merchants could identify them more easily. We also introduced ways to customize the data sent to Stripe so developers could add any additional metadata to Stripe Customers and PaymentIntents entities (each project may have its own requirements).

### Highly customizable Wysiwyg components

Nowadays, merchants need to contribute their content in an attractive way. They can't just add walls of text. This is why in Front-Commerce we have a `Wysiwyg` component that lets you parse the content of your backoffice and transforms it in a React component. This gives you all the freedom you need to contribute interactive content.

However, this component was a bit tough to customize in its previous versions. So we have revamped its API to make sure that you can customize it as much as you want. See [WYSIWYG documentation](/docs/advanced/theme/wysiwyg.html) for more details.

This was also an opportunity to support a wider range of Magento's features. For instance, we now support [Widgets](https://www.toptal.com/magento/custom-widgets-in-magento-2) in Magento. Any contributed widget will be parsed and then render a React component that you can customize depending on your needs. See [Magento's WYSIWYG supported features](/docs/advanced/theme/wysiwyg.html#Magento-theme-modules-Wysiwyg-MagentoWysiwyg) for more details. 

### Load configuration files from parent modules

[Custom themes](/docs/essentials/extend-the-theme.html) defined in the [`modules` key of your `.front-commerce.js` file](/docs/reference/front-commerce-js.html#modules) will now inherits configuration files from parent themes.

Before this change, all config files had to be defined in the latest module.
It was not very convenient for extension providers or short-lived themes (sales, Black Friday…) extending your default theme.

Example of what now works:

```js
// .front-commerce.js
module.exports = {
  name: "ACME Store",
  url: "http://www.acme.test",
  modules: ["./src", "./christmas"],
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },
    { name: "Magento2", path: "server/modules/magento2" }
  ]
};
```

File structure

```text
src
├── config
│   ├── analytics.js
│   ├── autocomplete.js
│   ├── caching.js
│   ├── stores.js
│   ├── website.js
├── template
│   ├── app-shell.html
│   └── index.html
└── web
    ├── theme
        ├── ………
christmas
├── config
│   ├── analytics.js
└── web
    └── theme
        ├── ………
```

### And more minor features

And a few more features such as:

* Auto redirect HTTP requests to HTTPS in production mode ([see more details](/docs/appendices/migration-guides.html#HTTPS))
* Improved schema stitching from developers feedbacks to allow custom headers and authenticated requests ([see more details](/docs/advanced/graphql/remote-schemas.html#Customize-remote-HTTP-requests))
* Expose a product's short description in the GraphQL schema

## Bugfixes

We also made a few bugfixes such as:

* Fix display of order statuses in a user's account
* Fix coupon deletion from cart
* Fix stories detection when using multiple modules

## Magento1 support in progress

We have also worked on the Magento1 integration, and things are taking shape.
The first projects have been started and we plan to merge the feature branch in `master` in the next release.

An online demo will also be deployed so you could have a look at a real instance!

<blockquote class="important"><strong>Update:</strong> [the demo is now online!](https://magento1.demo.front-commerce.com)</blockquote>

<a class="link primary button" href="mailto:contact@front-commerce.com?subject=I’d like to keep my Magento1 and give it superpowers!">Contact us now to discuss about a PWA with Magento 1!</a>

## And more

To know more about this release, we recommend you to check the following pages:
- [Migration guide from 1.0.0-beta.0 to 1.0.0-beta.3](/docs/appendices/migration-guides.html#1-0-0-beta-0-gt-1-0-0-beta-3)
- [Full changelog from Front-Commerce release notes](https://gitlab.com/front-commerce/front-commerce/releases) and [its Magento 2 extension](https://gitlab.com/front-commerce/magento2-module-front-commerce/releases) (Partners and Customers only)

As always, feel free to send us [an email](mailto:contact@front-commerce.com) or a [Slack](https://join.slack.com/t/front-commerce/shared_invite/enQtMzI2OTEyMDYzOTkxLWY0Y2JjYmRmNGQ2MWM1NzQyMjQwNzlmYzJmYzgzNTIwYzQ3MDVkMWZiYmYwNWFhODhmYWM5OTI4YjdiZDJkY2Q) message if you have any question.
