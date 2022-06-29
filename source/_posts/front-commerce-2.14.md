---
title: "2.14: Create and sell virtual content with downloadable products, increase customer loyalty with store credits and learn a bit about stress tests with Front-Commerce!"
date: 2022-03-31
---

Spring is here! With it come the sunny days and our Front-Commerce 2.14 release 🎉

Here are the highlights of the past 6 weeks at Front-Commerce:

- We continued the projects initiated at the beginning of the year, with our new BigCommerce connector and services around our Front-Commerce Cloud offer
- We have continued to enrich the features available for Front-Commerce with store credit and downloadable products
- In parallel, we had the opportunity to train and onboard new users! Welcome to the headless commerce family 👋
- Finally, we helped prepare the launch of several new sites on Front-Commerce: this implicates the realization of stress tests, an important step to verify that your website will be able to hold the load in the event of a peak in traffic.

Next week, the team will be fully reunited for our Spring session, an opportunity to spend quality time altogether, under the sun 🤞🏼 in southern France ☀️

Until then, enjoy reading, and as always, should you have any requests regarding the product roadmap, do not hesitate [to contact Josquin](https://calendly.com/josquin-front-commerce/30min) 👋

<!-- more -->

## BigCommerce: our first MVP will be live soon!

BigCommerce has become a key player in [headless commerce](https://www.front-commerce.com/fr/nos-partenaires/), aware that this model allows brands to have more flexibility while offering the possibility to work with the market’s best-of-breed solutions, adapted to each and every use case.

Our [partnership](https://www.front-commerce.com/fr/nos-partenaires/) with BigCommerce is a natural step. We are working on the development of a connector to allow your BigCommerce sites to benefit from the power of Front-Commerce!

The first version of our MVP should be publicly released for version 2.15 (12-5-2022): stay tuned!

## Downloadable products: create and sell content easily using Front-Commerce

In an era where the production and sale of content have become a must, you may be wondering about the possibility of making virtual content available to your customers.

Thanks to downloadable products, it is now possible! The feature is already available for Magento, demo to come soon !

## Store Credits: increase loyalty by letting your clients use the credit they have in your shop

As a brand, you may have to refund an in-store credit or conduct commercial operations to offer vouchers to your customers.

With store credits for Magento 2 (Adobe Commerce) x Front-Commerce _(as a reminder, the feature was already available for Magento 1 Enterprise Edition since [our 2.6 version](https://developers.front-commerce.com/changelog/front-commerce-2.6/))_, it is now possible for your customers to keep track of their credit balance and decide whether they want to use their remaining credit or not when performing an order. Stay tuned for the upcoming demo!

## Stress tests or how to ensure your website will bear the load

We have conducted stress tests during the past 6 weeks, before the launch of 3 new customers on Front-Commerce.

It is recommended to regularly perform this kind of test on your e-commerce stack, in order to ensure that it is capable of handling peaks in load and activity, especially before a website launch, if your brand is growing rapidly or if you are carrying out an acquisition campaign causing a significant flow of users on your site.

However, if the site is experiencing malfunctions, especially when the number of requests becomes important, the conversion rate could be strongly impacted.

Thus, stress tests should help to understand:

- The number of users the application/site can support simultaneously
- The maximum operational capacity of the application
- Whether the current infrastructure can allow users to take advantage of the application/website in an optimal way
- The durability of the application/website when subjected to load peaks

<aside>
👋 Want to know more about stress tests? Contact us for more information!
</aside>

## Prismic: technical and performance improvements

We are excited to announce some technical and performance improvements in our Prismic module! Here are the main elements of this release:

- our route resolver has been improved to allow for advanced paths using trailing slashes, rewrites, and URL resolvers.
- additionally, we have added support for Document, Media and external Links using the `LinkTransformer`.
- finally, we have fixed unformatted proxy images so that your domain is in front of each image.

We hope you find these improvements helpful!

## Other changes

### Bug Fixes

- **media:** prevented double slashes (`//`) in images URL in misconfigured applications
- **payment:** prevent showing an empty cart page before redirecting the payment platform (in redirect after order flows)
- **seo:** the `<Review />` component now correctly exposes the author as a [schema.org](http://schema.org) Person for product reviews
- **cache:** prevent unconfigured caching strategies from being initialized
- **graphql:** maintenance errors are now properly detected in schema stiching contexts
- **server:** prevent syntax errors (`Unexpected token '.'`) on node < 14
- **node:** prevent FC to install on Node 17+ until we fully support this version
- **b2b:** requisition list items count is now properly updated when an item is removed from the list

Fixes from the 2.14 version have also been backported into previous minor versions. The following patch versions were released:
[2.6.7](https://gitlab.com/front-commerce/front-commerce/-/releases/2.6.7),
[2.7.8](https://gitlab.com/front-commerce/front-commerce/-/releases/2.7.8),
[2.8.9](https://gitlab.com/front-commerce/front-commerce/-/releases/2.8.9),
[2.9.8](https://gitlab.com/front-commerce/front-commerce/-/releases/2.9.8),
[2.10.6](https://gitlab.com/front-commerce/front-commerce/-/releases/2.10.6),
[2.11.3](https://gitlab.com/front-commerce/front-commerce/-/releases/2.11.3)
[2.12.2](https://gitlab.com/front-commerce/front-commerce/-/releases/2.12.2)
and [2.13.3](https://gitlab.com/front-commerce/front-commerce/-/releases/2.13.3).

### Features

- **caching:** a new `PerMagentoCustomerTaxZone` caching strategy allows to cache Magento 2 prices per tax zone
- **Adyen:** Front-Commerce’s Adyen Payment is now compatible with Magento2
- **invoice:** the invoice detail page title now contains the invoice number
- **Button:** some properties deprecated in v1 have been removed for the `<Button />` component (we forgot to do it in 2.0)
- **DX:** it is now possible to preview the server error page in development mode to ensure it matches the application UI and style it
- **npm:** improve installation performance for npm 7+, by upgrading our default lockfile to v2
- **test:** we enabled new Jest lint rules to enforce good practices in tests

<hr />
<div class="center">
  <p>
    <a class="link primary button intercom-launcher" href="https://www.front-commerce.com/contact/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.14.0](/docs/appendices/migration-guides.html#2-13-0-gt-2-14-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.14.0)
  </p>
</div>
