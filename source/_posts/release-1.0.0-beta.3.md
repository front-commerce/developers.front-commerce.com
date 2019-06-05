---
title: "Release: 1.0.0-beta.3"
date: 2019-06-05
---

Front-Commerce `1.0.0-beta.3` has been released with several improvements: bla bla bla…

Two smaller bugfixes releases have been tagged since `1.0.0-beta.0` so that some projects could move forward faster, but they did not contain any significant changes.

<!-- more -->

## New features

Even though we are still in our `beta` releases, we don't want to slow down our customers and keep on adding the features they need.

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

## Bugfixes

We also made a few bugfixes such as:

* TODO

## Magento1 support in progress

We have also worked on the Magento1 integration, and things are taking shape.
The first projects have been started and we plan to merge the feature branch in `master` in the next release.

An online demo will also be deployed so you could have a look at a real instance!

<a class="link primary button" href="mailto:contact@front-commerce.com?subject=I’d like to keep my Magento1 and give it superpowers!">Contact us now to discuss about a PWA with Magento 1!</a>

## And more

To know more about this release, we recommend you to check the following pages:
- [Migration guide from 1.0.0-beta.0 to 1.0.0-beta.3](/docs/appendices/migration-guides.html#1-0-0-beta-0-gt-1-0-0-beta-3)
- [Full changelog from Front-Commerce release notes](https://gitlab.com/front-commerce/front-commerce/releases) and [its Magento 2 extension](https://gitlab.com/front-commerce/magento2-module-front-commerce/releases) (Partners and Customers only)

As always, feel free to send us [an email](mailto:contact@front-commerce.com) or a [Slack](https://join.slack.com/t/front-commerce/shared_invite/enQtMzI2OTEyMDYzOTkxLWY0Y2JjYmRmNGQ2MWM1NzQyMjQwNzlmYzJmYzgzNTIwYzQ3MDVkMWZiYmYwNWFhODhmYWM5OTI4YjdiZDJkY2Q) message if you have any question.
