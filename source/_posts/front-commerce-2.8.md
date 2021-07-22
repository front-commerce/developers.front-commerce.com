---
title: '2.8: Content-Driven Commerce with Prismic, Proximis connector in alpha and Summer backlog cleaning'
date: 2021-22-0
---

Front-Commerce 2.8 is available! This new version contains advanced Prismic features for Content Driven storefronts, an alpha version of our new Proximis connector and several "Summer backlog cleaning" items (bugfixes, improvements from performance profilings, technical debt removal).

<!-- more -->

## Content-Driven Commerce with Prismic

eCommerce has evolved from a transactional process into a content-driven experience. Marketers work hard to create superior content because it leads to a superior Customer Experience.

In this release, we've improved our Prismic connector to serve this goal. Developers can now leverage Prismic features in their Front-Commerce application in many new ways:
- embrace the **"Don't Ship Pages, Ship a Page Builder"** Prismic vision with [Content Slices](/docs/prismic/content-slices.html) without sacrificing creative freedom
- improve Content manager experience with [Integration Fields](/docs/prismic/integration-fields.html) so they can create rich content referencing any Front-Commerce data without leaving the writing room (Products, Categories, …)
- optimize SEO with [Routable types](/docs/prismic/routable-types.html). Expose custom Prismic content on any URL managed from Prismic and seamlessly include these pages in Front-Commerce's sitemap

These features are deeply integrated into Front-Commerce core features and benefits from all the optimizations you already know (preloading, performant images, …).

**We're excited to see what you will build with it!**

## Unified Commerce with Proximis

Customers interact with brands in many different ways. We're partnering with [Proximis](https://www.proximis.com/en) to bring [the benefits of headless commerce](https://www.front-commerce.com/en/front-commerce-a-modern-ecommerce-architecture/) to Retailers selling online and in store.

In this alpha release, we've made progress on every features involved during a customer journey (PLP, PDP, Cart, Store locator…). This connector will be production ready before the end of the year.

[Contact us](https://www.front-commerce.com/en/contact-us/) to discuss your project.

## Summer backlog cleaning

Front-Commerce 2.8 contains many different improvements and bugfixes. We've scheduled some time to clean our backlog and reduce technical debt.

While some changes were related to our internal test suite, we also fixed warnings and errors aggregated from Front-Commerce Cloud customers logs. We've also spent time on performance testing and profiled our server to optimize some areas.

[Bugfixes](https://gitlab.com/front-commerce/front-commerce/-/releases/2.8.0#bug-fixes) will be backported to all 2.4+ Front-Commerce versions in the next few days, so they can benefit to every Customers.

## Other changes

- custom order statuses are now displayed in the User account for Magento1 projects
- it is now possible to customize the bounds of a map without location
- multi-store setups with main URL and subdirectories for locales (e.g: https://example.com/ and https://example.com/fr) are now fully supported
- it is now possible to access the original image through the media proxy [with the `format=original` query parameter](/docs/advanced/production-ready/media-middleware.html#How-to-query-an-image)
- all shipping methods are now displayed for Magento1 shipping modules containing several methods (e.g: Owebia)
- server response compression [can now be deactivated](/docs/advanced/performance/deactivating-unnecessary-features.html#Deactivate-response-compression) if needed

<hr />
<div class="center">
  <p>
    <a class="link primary button" href="https://www.front-commerce.com/en/contact-us/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.8.0](/docs/appendices/migration-guides.html#2-7-0-gt-2-8-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.8.0)
  </p>
</div>
