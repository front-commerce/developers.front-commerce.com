---
title: "Release: Front-Commerce 2.3"
date: 2021-01-13
---

Front-Commerce 2.3 is our first release of 2021. It contains an increased support of Magento 2 advanced features, new Payment methods and performance improvements. Read more about this version.

<!-- more -->

## Guest Checkout

Building on [Front-Commerce 2.2's guest checkout support for Magento 1](/blog/2020/11/18/front-commerce-2.2/#Guest-Checkout), it is now possible to complete a Checkout in Front-Commerce without being logged for Magento 2 stores too!

This is a frequently asked feature as it can really boost your sales. In this release, Customers can also register an account after placing an order as guests.

We've also ensured in this release that **all Front-Commerce payment methods were fully compatible with Guest Checkout**.

## More product types

As announced in our [2.2 release announcement](/blog/2020/11/18/front-commerce-2.2/#More-product-types), we've added support for **Bundle and Virtual products for Magento 2**.

This release also allows merchants to use **textual product custom options** for their products.

## Customer reviews

Customer can now publish reviews from a product page. Reviews can be moderated from Magento admin area as usual, and will be displayed upon acceptance.

## Adyen and BuyBox payment methods

Two new payment methods are available for your Front-Commerce store. Each one of them uses new checkout workflows, which allowed us to make **Front-Commerce checkout and payments even more flexible!**

For further details, visit our documentation pages for [Adyen](/docs/advanced/payments/adyen.html) and [BuyBox](/docs/advanced/payments/buybox.html).

## Log as a Customer

Magento administrators can now login as a Customer on their Front-Commerce storefront. It was a **highly requested feature from merchants and customer support teams**.

This feature is exciting as it builds on [our Magento Admin detection feature (Front-Commerce 2.1)](/blog/2020/07/24/front-commerce-2.1/#Magento2-Admin-Detection) to empower store owners in their day to day activities. Future Front-Commerce releases will bring new features in that sense too.

## Other changes

- new Magento configurations supported for Customer addresses:
  - optional zip code support
  - configurable number of lines for street inputs
- edge cases better supported in payment form interactions
- support for ElasticSearch 7.x and ElasticSuite 2.10 versions
- allow to link to external invoice files (online invoice pages will be available in 2.4)
- support for always enabled analytics scripts (e.g Google Analytics with anonymizeIp option)
- performance improvements:
  - better caching headers for static assets,
  - expiration time for redis keys,
  - node clustering and PM2 readiness,
  - better NewRelic support
- bug fixes (see changelog for a complete list)

<hr />
<div class="center">
  <p>
    <a class="link primary button" href="https://www.front-commerce.com/en/contact-us/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.3.0](/docs/appendices/migration-guides.html#2-2-x-gt-2-3-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.3.0)
  </p>
</div>
