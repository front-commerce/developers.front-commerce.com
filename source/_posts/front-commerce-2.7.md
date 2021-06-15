---
title: '2.7: SmartForms, Prismic, Magento 2.4.2 compatibility'
date: 2021-06-15
---

Front-Commerce 2.7 is available! This new version integrates practical solutions to improve your efficiency.

<!-- more -->

## New Feature: SmartForms has been developed in-house in order to guarantee you valid customer data.

With [SmartForms](/docs/advanced/features/smart-forms.html) completing a form is quicker for your users, and also reduces the number of invalid data inputs by controlling the integrity of the data entered.

Our first integration uses CapAddress (by Capency) but SmartForms has been conceived with an agnostic design to connect to other systems later on.


## You can also benefit from Prismic!

With the addition of [Prismic](/docs/prismic/), content management will be simplified for the entire team. Rich content modeling (reusable slices, page specific templates) for dynamic content, all whilst maintaining the coherence and the separation of concerns between developers and content publishers. 😅

Prismic [recently announced an exciting vision for content creation with Slices](https://prismic.io/announcement/from-headless-cms-to-custom-website-builder) and Front-Commerce will allow you to leverage it! Please [contact us](mailto:contact@front-commerce.com) if you want to use Prismic with your Front-Commerce application.

## Version 2.7 is now officially compatible with Magento 2.4.2-p1!

This version was successfully tested with the latest Magento 2.4.2-p1 version so you can upgrade your backend.

New features were also introduced for Magento 2 store owners:
- allow visitors to follow their order status from an order id and the related email address
- leverage Wishlist send by email features, and save product option (see [2.6 release notes](https://developers.front-commerce.com/blog/2021/04/29/front-commerce-2.6/#Wishlist-improvements-send-by-email-and-save-product-options))

## Other changes

Version 2.7 includes a lot of practical improvements across different product areas:
- EXIF: images orientation now respects EXIF metadata for resized images
- Canonical URLs: main pages now have canonical links (home, category, product…)
- Accept payments with Lyra Collect
- Facets generation for ElasticSearch now takes Magento (1 & 2) attributes configuration into account
- UI improvements for unavailable swatch UI: it is now more obvious when an option is not selectable
- Users can now unselect optional radio options for bundle products
- It is now possible to exclude some files from the media proxy. If your Magento media directory contains other files (pdfs, excel sheets…), you could prevent browsers from keeping them indefinitely in cache
- Users are now redirected to the first page when browsing an out of bounds Category page number
- Magento (1 & 2) API communication can now contain custom extra headers
- We rework several “Front-Commerce” terms from default translations so that stores will not need to override pages only for the sake of changing these terms
- Internally, we’ve also finished upgrading all our contract tests to the latest version of [Pact](https://docs.pact.io/). The old Pact 4.x dependency is not needed anymore in development.

<hr />
<div class="center">
  <p>
    <a class="link primary button" href="https://www.front-commerce.com/en/contact-us/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.7.0](/docs/appendices/migration-guides.html#2-6-0-gt-2-7-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.7.0)
  </p>
</div>
