---
id: release-notes
title: Release notes
---

This page lists the public releases and will let you know what is included in each release so you could clearly define an upgrade plan for your project.

## Latest version

**Front-Commerce [`2.5.0`](#2-5-0)**

Compatible with:

- **Node.js:** 10.15+
- **Magento2**: 2.3.2 -> 2.4.1 (Open Source & Commerce)
- **Magento1**: CE 1.7+, EE 1.12+, [OpenMageLTS](https://www.openmage.org/supported-versions.html) 19.4+

## 2.5.0

> This release contains product improvements that increase its flexibility:
> - search datasources allows you to choose between Algolia or ElasticSearch to power your search
> - new Shipping modules and Map implementations will reduce your integration costs
> - allow your Customers to return products with RMA
> - leverage our low-level tools to improve your Core Web Vitals

- [Changelog](https://gitlab.com/front-commerce/front-commerce/-/releases/2.5.0)

Requirements: same as [2.4.0](#2-4-0)

## 2.4.5

> This release contains a bugfix that improves resilience in case of ElasticSearch downtimes.

- [Changelog](https://gitlab.com/front-commerce/front-commerce/-/releases/2.4.5)

Requirements: same as [2.4.0](#2-4-0)

## 2.4.4

> This release contains minor bugfixes related to displaying invoices and dropdown.

- [Changelog](https://gitlab.com/front-commerce/front-commerce/-/releases/2.4.4)

Requirements: same as [2.4.0](#2-4-0)

## 2.4.3

> This release contains additional fixes related to product visibility, and fixes the payments method order if you are using Front-Commerce payments.
>
> It requires [Front-Commerce Magento2 module 2.2.0](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/releases/2.2.0) to fully enable these fixes.

- [Changelog](https://gitlab.com/front-commerce/front-commerce/-/releases/2.4.3)

Requirements: same as [2.4.0](#2-4-0)

## 2.4.2

> This release contains a **CRITICAL bugfix** for applications using the base theme.
> The regression introduced in Front-Commerce 2.4.0 prevents Customers to move to the next checkout step if they first tried to submit the payment form without accepting GSC (unless they temporarily select another payment method and reselect the previous one).

- [Changelog](https://gitlab.com/front-commerce/front-commerce/-/releases/2.4.2)

Requirements: same as [2.4.0](#2-4-0)

## 2.4.1

> This release contains several important bugfixes:
>
> - allow guest customers with an address in a country with a required region to place a Magento2 order
> - display warnings to customers when products from their cart went out of stock or were removed from the website
> - better customer feedback during the checkout when their cart becomes impossible to finalize (if the last product was just bought for instance)
> - security improvements and robustness of the client logging API
>
> **We highly recommend this upgrade to Magento 2 users.**
> The `2.2.0-rc.4` release fixes Magento and Front-Commerce API that were exposing products from other websites in a multistore environment.
> Many edge cases were found with our deep investigations: bundle items all out of stock, grouped products, crossell products only in another website etc.
>
> We ended up fixing many things from the core ourselves, and hope you'll now have a consistent catalog !

- [Changelog](https://gitlab.com/front-commerce/front-commerce/-/releases/2.4.1)

Requirements: same as [2.4.0](#2-4-0)

## 2.4.0

> This release brings a **new base theme ("Chocolatine")**. It contains several accessibility improvements, and provides a better user experience out of the box.
>
> It also contains a new feature: invoices. **Magento 2 invoices** are now displayed in the Customer account. Customers can print them from the web, and developers can customize the print layout to match their needs.

Requirements:
- Magento2: 2.3.2+ -> 2.4.1 - requires [magento module version 2.2.0+](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/releases/2.2.0) - (Open Source & Commerce)
- or Magento1: CE 1.7+, EE 1.12+, [OpenMageLTS](https://www.openmage.org/supported-versions.html) 19.4+
- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2+
- ElasticSearch: 6.7+ and 7.x with the plugins:
  - analysis-phonetic
  - analysis-icu

## 2.3.0

> **Magento 2:**
>   - Product reviews support
>   - Bundle and virtual products support
>   - Textual product custom options support
>   - Guest checkout support. Customers can register after placing an order as guests
>   - New payment methods available:
>       - Adyen
>       - BuyBox
>   - Log as a customer from Magento admin area
>
> **Magento (all versions):**
> New Magento configurations supported for Customer addresses:
>   - optional zip code support,
>   - configurable number of lines for street inputs
>
> **Front-Commerce payments:**
>   - all existing Front-Commerce payment methods are now compatible with Guest checkout
>
> **Technical improvements:**
>   - ElasticSearch 7.x and ElasticSuite 2.10 support
>   - Support for always enabled analytics scripts
>   - Checkout and Front-Commerce payment improvements: more scenarii are now possible, edge cases better supported in payment form interactions
>   - Allow to link to external invoice files
>   - Performance improvements

- [Changelog](https://gitlab.com/front-commerce/front-commerce/-/releases/2.3.0)

Requirements:
- Magento2: 2.3.2+ -> 2.4.0 (Open Source & Commerce)
- or Magento1: CE 1.7+, EE 1.12+, [OpenMageLTS](https://www.openmage.org/supported-versions.html) 19.4+
- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2+
- ElasticSearch: 6.7+ and 7.x with the plugins:
  - analysis-phonetic
  - analysis-icu

## 2.2.0

> - Support more features from Magento 1 (Guest Checkout, Bundle Products, Virtual Products, Credit Memo)
> - Allow to switch currency inside of a store view
> - Improve regions/state selectors

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.2.0)

Requirements: same as [2.1.0](#2-1-0)

## 2.1.3

> It contains 1 bugfix:
>
> - the "Use for shipping" toggle is now working again for new addresses created in the checkout (regression introduced in 2.0.0)

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.1.3)

Requirements: same as [2.1.0](#2-1-0)

## 2.1.2

> It contains 2 bugfixes:
>
> - the service worker can now be built in production mode
> - the HTTP Basic Auth protection (for staging servers) works again (a regression was introduced in [2.0.0](#2-0-0), when we've upgraded a dependency)

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.1.2)

Requirements: same as [2.1.0](#2-1-0)

## 2.1.1

> - Fix a regression in cache invalidation using Redis strategy

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.1.1)

Requirements: same as [2.1.0](#2-1-0)

## 2.1.0

> - Magento 2.3.5 and MSI Support
> - Magento2 configurations
> - Magento2 admin detection
> - Affirm and Adyen (developer preview) Magento2 payment methods
> - Translation improvements

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.1.0)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 6.7 or 6.8 with the plugins:
  - analysis-phonetic
  - analysis-icu
- Magento2: 2.3.1+ (Open Source & Commerce)
- Magento1: CE 1.7+, EE 1.12+, [OpenMageLTS](https://www.openmage.org/supported-versions.html) 19.4+

## 2.0.0

> - Remove deprecation warnings
> - Update dependencies

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.0.0)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 6.7 or 6.8 with the plugins:
  - analysis-phonetic
  - analysis-icu
- Magento2: 2.3.1+ (Open Source & Commerce)
- Magento1: CE 1.7+, EE 1.12+, [OpenMageLTS](https://www.openmage.org/supported-versions.html) 19.4+

## 1.0.0-beta.4

> - Bug fixes
> - Enable customizations for session storages (ex: Redis sessions)
> - Improve caching and headers for all requests

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/1.0.0-beta.4)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 6.7 with the plugins:
  - analysis-phonetic
  - analysis-icu
- Magento: 2.3.1

## 1.0.0-beta.3

> - Bug fixes
> - WYSIWYG improvement with widgets support
> - Stripe payment improvements
> - Remote schema improvements (authentication…)
> - Config files fallback mechanisms between modules

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/1.0.0-beta.3)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 6.7 with the plugins:
  - analysis-phonetic
  - analysis-icu
- Magento: 2.3.1

## 1.0.0-beta.2

> - Bug fixes

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/1.0.0-beta.2)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 6.7 with the plugins:
  - analysis-phonetic
  - analysis-icu
- Magento: 2.3.1

## 1.0.0-beta.1

> - Bug fixes

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/1.0.0-beta.1)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 6.7 with the plugins:
  - analysis-phonetic
  - analysis-icu
- Magento: 2.3.1

## 1.0.0-beta.0

> - Revamp elasticsearch for Magento 2.3 compatibilty
> - Translation fallbacks
> - Wishlist
> - Performance

- [Announcement](/blog/2019/05/07/release-1.0.0-beta.0/)
- [Migration guide](/docs/appendices/migration-guides.html#1-0-0-alpha-2-gt-1-0-0-beta-0)
- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/1.0.0-beta.0)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 6.7 with the plugins:
  - analysis-phonetic
  - analysis-icu
- Magento: 2.3.1

## 1.0.0-alpha.3

> Add Stripe payment

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/1.0.0-alpha.3)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 2.4
- Magento: 2.2.1

## 1.0.0-alpha.2

> Improve the Cart and refactor styles to ease themes development

- [Announcement](https://developers.front-commerce.com/blog/2019/03/25/release-1.0.0-alpha.2/)
- [Migration guide](https://developers.front-commerce.com/docs/appendices/migration-guides.html#1-0-0-alpha-1-gt-1-0-0-alpha-2)
- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/1.0.0-alpha.2)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 2.4
- Magento: 2.2.1

## 1.0.0-alpha.1

> Refactor environment definitions and bug fixes

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/1.0.0-alpha.1)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 10.15+
- Redis: 3.2
- ElasticSearch: 2.4
- Magento: 2.2.1

## 0.15.0

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/0.15.0)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 8.4+
- Redis: 3.2
- ElasticSearch: 2.4
- Magento: 2.2.1

## 0.13.0

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/0.13.0)

Requirements:

- Reverse Proxy : Nginx 1.10 or more
- NodeJS: 8.4+
- Redis: 3.2
- ElasticSearch: 2.4
- Magento: 2.2.1
