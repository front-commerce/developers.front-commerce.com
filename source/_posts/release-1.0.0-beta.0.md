---
title: "Release: 1.0.0-beta.0"
date: 2019-05-13
---

Front-Commerce `1.0.0-beta.0` has been released with several improvements: revamped elasticsearch queries, translation fallbacks, wishlist, performance…

We are getting really close to the 1.0!

<!-- more -->

## New features

Even though we are still in our `beta` releases, we don't want to slow down our customers and keep on adding the features they need.

### Improved search experience

While working on our compatibility with Magento 2.3, we decided to use [ElasticSuite](https://elasticsuite.io/), a well established Magento extension provided by [Smile](https://www.smile.eu/), that indexes a Magento catalog into [Elasticsearch](https://www.elastic.co/products/elasticsearch). This was an opportunity for us to rethink how we build search queries thanks to the experience we gained during our own dogfooding. This means that you can now easily customize your queries with a few well thought extension points (add search parameters, customize facets, etc.). More documentation to come.

Moreover, this is the first step of greater plans we are really excited about:

* an improved layered navigation on the client side with more room for customization
* a catalog entirely fetched from Elasticsearch for greater performances (as an optional extension)

Stay tuned!

### Wishlist

A Wishlist is now available in Front-Commerce by default with the latest Magento2 module. This is one of the features we wanted to add a long time ago.

However, we didn't have any concrete use cases and weren't able to dogfood its implementation until now. Recently, one of the Front-Commerce's integrators needed it for their own shop. This was the perfect opportunity to add it to the core.

The wishlist feature is still quite simple right now and focuses on saving the wishlist to the customer's account in Magento. But we will keep iterating and add more features according to our clients' customers needs in the future.

### Translation fallbacks

Keeping translations synchonized between the core and your own theme could prove to be troublesome. Indeed, all translations were gathered in `translations/[locale].json` files at the root of your project. But when we added/updated/removed some from the core, you needed to update your own files manually.

This is no longer the case because in your `translations/[locale].json` file, you will be able to only put your custom translation keys and the ones you want to override from the core.

Read more in our documentation: [Translations fallback](https://developers.front-commerce.com/docs/advanced/theme/translations.html#Translations-fallback).

### Storybook 5

Your styleguide is now powered by Storybook 5. The interface has been completly overhauled and makes it easier to navigate in your code.

This was also an opportunity to upgrade a few stories and to make sure that languages were loaded dynamically.

A nice tool that we have added by default with this upgrade is the [a11y addon](https://github.com/storybooks/storybook/tree/master/addons/a11y) which let's you run [`axe-core`](https://www.npmjs.com/package/axe-core) checks runs on your components. It is part of our vision to help promoting quality in your projects, be sure to have a look at this new panel!

### Stripe integration

In this release, we also added support for Stripe as a Front-Commerce payment gateway.
It means that one can use Stripe, no matter the eCommerce platform behind Front-Commerce.

Our integration is based on the new Stripe foundational API: [Payment Intents](https://stripe.com/docs/payments/payment-intents).
This way, you won’t have to worry about the upcoming Strong Customer Authentication (SCA) requirement: your store will be compliant months before the SCA becomes mandatory (14th of September 2019).

This is also one of the thing that we want to take care for you! All you have to do is keeping your Front-Commerce up-to-date ;-)

We are still working on a complete documentation of Payments in Front-Commerce, but you can already read [this comment explaining how to enable Stripe](https://github.com/front-commerce/developers.front-commerce.com/issues/47#issuecomment-476633486) if you want to use it in your application.

## Major performance improvements

Our Magento 2 extension has also been updated with Wishlist related features and performance improvements.
Some API responses were made 70% faster! Prices, product options, parent products,… many improvements that will improve the raw performance of a page before relying on the redis cache.

This is the kind of free performance wins that you gain by using Front-Commerce. :)

## Improved DX

### Debugging

Until now, debugging required some internals knowledge to log and learn how the core worked. To address this, we have started to use [`debug`](https://www.npmjs.com/package/debug), an node package widely used by the community. It lets you display logs of your application by adding an environment variable `DEBUG`.

Read more about it in our documentation: [Debugging](https://developers.front-commerce.com/docs/reference/environment-variables.html#Debugging).

### Unstable Magento detected

Magento in a local environment tend to be in an unstable state after commands like `setup:upgrade`, `setup:di:compile`, etc. This is now nicely detected and the errors will be explicit in GraphQL.

## Bugfixes

We also made a few bugfixes such as:

* <abbr title="accessibility">a11y</abbr> improvements
* 404 pages were a bit too loose on product and category pages. Some 500 errors were identified as 404, but this is no longer the case.

## See it live!

The online demo has been updated and will let you see how things have evolved since then. This is quite an update since we didn't have the opporunity to deploy the demo since 0.14 (june 2018)!

<figure>
![./images/demo-diff.png](/images/blog/demo-diff.png)
<figcaption>1320 commits since the last demo update!</figcaption>
</figure>

<a class="link primary button" href="https://demo.front-commerce.com">Discover the new demo</a>

## And more

To know more about this release, we recommend you to check the following pages:
- [Migration guide from 1.0.0-alpha.2 to 1.0.0-beta.0](/docs/appendices/migration-guides.html#1-0-0-alpha-2-gt-1-0-0-beta-0)
- [Full changelog from release notes](https://gitlab.com/front-commerce/front-commerce/releases) (Partners and Customers only)

As always, feel free to send us [an email](mailto:contact@front-commerce.com) or a [Slack](https://join.slack.com/t/front-commerce/shared_invite/enQtMzI2OTEyMDYzOTkxLWY0Y2JjYmRmNGQ2MWM1NzQyMjQwNzlmYzJmYzgzNTIwYzQ3MDVkMWZiYmYwNWFhODhmYWM5OTI4YjdiZDJkY2Q) message if you have any question.
