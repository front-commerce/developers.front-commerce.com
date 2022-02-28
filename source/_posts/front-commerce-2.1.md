---
title: "Release: Front-Commerce 2.1"
date: 2020-07-24
---

Front-Commerce 2.1 contains new features for Magento2, Affirm and Adyen payments along with several bundle improvements for stores with many languages. Read more about this version.

<!-- more -->

## Magento 2.3.5 and <abbr title="Multiple Source Inventory">MSI</abbr> Support

While already compatible with Magento 2.3.5, one feature wasn't supported in Front-Commerce 2.0. Front-Commerce 2.1 is now fully compatible with [MSI](https://docs.magento.com/user-guide/catalog/inventory-management.html). Our Magento2 extension has been updated to provide compatibility with MSI for stores having MSI modules enabled and remains compatible with stores without them or previous Magento versions.

## Magento2 configurations

Front-Commerce behavior is now administrable from Magento's admin area, which opens new opportunities for your application. While it was possible to fetch configurations from Magento2 in GraphQL, this release allow to easily expose and reuse any Magento configurations in GraphQL.

This implementation is also more performant than using Magento2 GraphQL implementation, thanks to caching mechanisms. Please refer to [Using Magento Configuration](/docs/magento2/using-magento-configuration.html) for further information.

## Magento2 Admin Detection

Another feature to improve Magento administrators daily work. It is now possible to detect in Front-Commerce that an user browsing the shop is an admin logged in Magento. You can start developing features targeting administrators. This is a first step towards a wide range of exciting features that will be delivered in future releases.

Please refer to [Detect admin users](/docs/magento2/detect-admin-users.html) for more details.

## New Magento2 payment methods

Front-Commerce for Magento2 now supports **Affirm payments**, embedded in the checkout page to reduce payment friction and deliver a great checkout experience. This integration is production ready. A **developer preview of Adyen Magento2 integration** is also available in this release. It will be production-ready in an upcoming version.

These new payment methods considerably increase the range of solutions available to accept payments in Front-Commerce. Our documentation has been updated with [a new section about Payments in Front-Commerce](/docs/advanced/payments/overview.html), go read it!

## Translation improvements

Previously, the translation mechanism only accepted a main language (`fr`, `en`, ...). It is now possible to declare more fine-grained locales per country (`fr-FR`, `en-US`, `en-GB`, ...) while having common language definitions for shared translations.

Front-Commerce now supports translations for "technical pages" such as the maintenance, offline or server error pages.

This release also reworked the way translation messages were packaged in the Javascript bundle to reduce the size downloaded by visitors. **It improves the overall web performance.**

## Other changes

- we've improved the development server to reduce the amount of error messages and be more memory efficient (it may be a good first step towards reducing memory consumption in dev mode)
- reduce the bundle size by improving polyfills detection and imports so they are only loaded for old browsers which need it
- it is now possible to invalidate the cache in a single HTTP call by batching invalidations
- cookies improvement: only set `SameSite=none` when secure mode in development
- fix a loading state for Paypal payments

<hr />
<div class="center">
  <p>
    <a class="link primary button" href="https://www.front-commerce.com/en/contact-us/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.1.0](/docs/appendices/migration-guides.html#2-0-0-gt-2-1-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.1.0)
  </p>
</div>
