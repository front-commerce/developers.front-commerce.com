---
title: "Release: 1.0.0-beta.0"
date: 2019-05-07
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
* a catalog entirely fetched from Elasticsearch for greater performances

Stay tuned!

### Wishlist

A Wishlist is now available in Front-Commerce by default with the latest Magento2 module. This is one of the features we wanted to add a long time ago.

However, we didn't have any concrete use cases and weren't able to dogfood its implementation until now. Recently, one of the Front-Commerce's integrators needed it for their own shop. This was the perfect opportunity to add it to the core.

The wishlist feature is still quite simple right now and focuses on saving the wishlist to the customer's account in Magento. But we will keep iterating and add more features according to our clients' customers needs in the future.

### Translation fallbacks

Keeping translations synchonized between the core and your own theme could prove to be troublesome. Indeed, all translations were gathered in `translations/[locale].json` files at the root of your project. But when we added/updated/removed some from the core, you needed to update your own files manually.

This is no longer the case because in your `translations/[locale].json` file, you will be able to only put your custom translation keys and the ones you want to override from the core.

See [Translations fallback](https://developers.front-commerce.com/docs/advanced/theme/translations.html#Translations-fallback).

### Storybook 5

Your styleguide is now powered by Storybook 5. The interface has been completly overhauled and makes it easier to navigate in your code.

This was also an opportunity to upgrade a few stories and to make sure that languages were loaded dynamically.

A nice tool that we have added by default with this upgrade is the [a11y addon](https://github.com/storybooks/storybook/tree/master/addons/a11y) which let's you run [`axe-core`](https://www.npmjs.com/package/axe-core) checks runs on your components.

## Major performance improvements

Some calls to Magento 2 were made 70% faster! Prices, product options, parent products,… many improvements that will improve the raw performance of a page before relying on the redis cache.

This is the kind of free performance wins that you gain by using Front-Commerce. :)

## Improved DX

### Debugging

Until now, debugging required some internals knowledge to log and learn how the core worked. To address this, we have started to use [`debug`](https://www.npmjs.com/package/debug), an node package widely used by the community. It lets you display logs of your application by adding an environment variable `DEBUG`.

See [Debugging](https://developers.front-commerce.com/docs/reference/environment-variables.html#Debugging).

### Unstable Magento detected

Magento in a local environment tend to be in an unstable state after commands like `setup:upgrade`, `setup:di:compile`, etc. This is now nicely detected and the errors will be explicit in GraphQL.

## Bugfixes

We also made a few bugfixes such as:

* <abbr title="accessibility">a11y</abbr> improvements
* 404 pages were a bit too loose on product and category pages. Some 500 errors were identified as 404, but this is no longer the case.

## See it live!

The online demo has been updated and will let you see how things have evolved since then. This is quite an update since we didn't have the opporunity to deploy the demo since 0.14!

<figure>
![./images/demo-diff.png](/images/blog/demo-diff.png)
<figcaption>1320 commits since the last demo update!</figcaption>
</figure>

<a class="link primary button" href="https://demo.front-commerce.com">Discover the new demo</a>