---
title: "2.5: RMA feature, search datasources and shipping modules"
date: 2021-03-11
---

Front-Commerce 2.5 is one of the most productive releases we had so far. Our team worked hard to improve the product and increase its flexibility:

- search datasources allows you to choose between Algolia or ElasticSearch to power your search
- new Shipping modules and Map implementations will reduce your integration costs
- allow your Customers to return products with <abbr title="Return Merchandise Authorization">RMA</abbr>
- leverage our low-level tools to improve your Core Web Vitals

<!-- more -->

## New Feature: Return Merchandise Authorization

In this release, we've continued to increase our feature coverage by implementing <abbr title="Return Merchandise Authorization">RMA</abbr>. **Customers can now select products they purchased from their Order page and ask for a return**. They can view all their returns from their account dashboard.

<div class="center">
![The Return form on mobile](/images/blog/rma.png)
</div>

While the UI is platform agnostic, we implemented the supporting server implementation in the **Magento1 Enterprise** module. It is fully integrated in the workflow you are used to and administrators can manage RMAs from the admin panel as usual.

## Search datasources: Algolia, ElasticSearch

We've reworked our search feature to allow registering different **datasources modules** without impacting your code. Our existing ElasticSearch implementation has been extracted in a datasource module, and we implemented a new Algolia datasource module as part of this release.

**The Algolia module allows Customers to find the product they are looking for (search, facets…) without friction** thanks to Algolia advanced merchandising features. The datasource only supports products search for now. Category and CMS pages search will come later.

This new search datasource abstraction will allow us to support other search engines very easily in the future. Solutions such as **Meilisearch, Klevu or Typesense** are rising, and each one of them could bring a better, faster search experience for your Users.

## Shipping modules: Colissimo, Mondial Relay

Front-Commerce 2.5 now supports **Shipping modules, to enhance the checkout process**. With these new extension points, it is possible to allow Customers to select the closest Pickup point or select an appointment with supported carriers for instance.

The first two carriers supported are **Colissimo** (compatible with [Magento2's Magentix module](https://colissimo.magentix.fr/magento-2/)) and **Mondial Relay** (compatible with Magento1). Pickup points are displayed in the checkout with any Map implementation supported (see next section) and saved in the eCommerce platform as usual.

## Maps: OpenStreetMap, Google Maps

Be it for **a Store Locator or Pickup points selectors**, our Customers often asked us if we provided performant components to display maps on their storefront. We seized the opportunity of working on Shipping modules to build "Map agnostic" components in Front-Commerce core. It means that **if your application or module relies on Front-Commerce Map components, it will be compatible with any compatible Map implementations.**

This first release contains Map implementations for the two most commons Map providers: **OpenStreetMap** (using the [Leaflet library](https://react-leaflet.js.org/)) and **[Google Maps ](https://www.npmjs.com/package/react-google-maps)**. It means for instance that you can choose whether your Customers select a Colissimo Pickup point from an <abbr title="OpenStreetMap">OSM</abbr> or a Google map!

In the future, we could support more implementations such as Mapbox or Maptiler to allow you to build a perfect integrated experience for your Customers.

## 🚀 Performance: batteries included to improve your Core Web Vitals!

Core Web Vitals (introduced in 2020) are signals **measuring how users perceive the experience of interacting with a web page**. They will become a factor in Google's ranking algorithm along with the existing UX-related signals.

More and more people are starting to care about these metrics, which is **a great opportunity to double-down on optimizing your storefront** to meet the expectations.

Our value proposition has always been to help you deliver smooth buying experiences using the best practices and frontend technologies. That's why **Front-Commerce 2.5 contains new tools and sensible defaults to build an optimized and performant theme**:

- preload critical fonts automatically,
- display above the fold images right away,
- use accessible components,
- send correct HTTP headers for your assets…

**From 2.5 onwards, Front-Commerce stores can aim for providing a best-in-class user experience and obtain great Core Web Vitals scores**.

There is no magic here though. Even if we keep improving the foundation your store is built upon, **it requires some efforts from your team too**. Understanding a Lighthouse report or a using the performance Devtools panel is important, so that you can spot issues in your theme. Then (and only then), you could use what Front-Commerce offers to implement the optimization.

We have created **a new [Improve your Core Web Vitals](/docs/advanced/performance/improve-your-core-web-vitals.html) page** in our documentation dedicated to help you understand what is killing your <abbr title="Cumulative Layout Shift">CLS</abbr>, increasing your <abbr title="Largest Contentful Paint">LCP</abbr> or slowing your <abbr title="First Input Delay">FID</abbr>… and how to fight back. Keep it in your bookmarks as we will enrich it over time!

## Other changes

- Enabled the use of a product image for swatches on Magento 2
- Improved order statuses to fetch the label from Magento (supports custom statuses)
- Defined titles for all User account pages
- Payline payment method for Magento 1 (in early preview, will be production ready in 2.6)
- Added performant image `sizes` and `priority` properties on the default theme
- Optimized fonts performance in theme Chocolatine
- Added code samples on new projects home page to improve the onboarding process
- Displayed multiple buttons consistently for order actions
- Reduced the ElasticSearch timeout to ensure that Front-Commerce fallback mechanism can serve a response to Visitors when the ES server does not respond
- Fixed delayed closing and toggle callback for the Dropdown component
- Fixed an issue with server modules on Windows environments
- Fixed a broken "Wishlist" link in theme Chocolatine's drawer
- Fixed the redirection after login in the default theme, to honor the `redirectTo` parameter

<hr />
<div class="center">
  <p>
    <a class="link primary button" href="https://www.front-commerce.com/en/contact-us/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.5.0](/docs/appendices/migration-guides.html#2-4-0-gt-2-5-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.5.0)
  </p>
</div>
