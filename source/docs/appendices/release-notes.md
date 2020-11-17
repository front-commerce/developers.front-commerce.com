---
id: release-notes
title: Release notes
---

This page lists the public releases will let you know what's important if you need to upgrade to this version.

## Latest version

**Front-Commerce [`2.2.0`](#2-2-0)**

Compatible with:

- **Node.js:** 10.15+
- **Magento2**: 2.3.1+ (Open Source & Commerce)
- **Magento1**: CE 1.7+, EE 1.12+, [OpenMageLTS](https://www.openmage.org/supported-versions.html) 19.4+

## 2.2.0

> - Support more features from Magento 1 (Guest Checkout, Bundle Products, Virtual Products, Credit Memo)
> - Allow to switch currency inside of a store view
> - Improve regions/state selectors

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.2.0)

Requirements: same than [2.1.0](#2-1-0)

## 2.1.3

> It contains 1 bugfix:
>
> - the "Use for shipping" toggle is now working again for new addresses created in the checkout (regression introduced in 2.0.0)

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.1.3)

Requirements: same than [2.1.0](#2-1-0)

## 2.1.2

> It contains 2 bugfixes:
>
> - the service worker can now be built in production mode
> - the HTTP Basic Auth protection (for staging servers) works again (a regression was introduced in [2.0.0](#2-0-0), when we've upgraded a dependency)

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.1.2)

Requirements: same than [2.1.0](#2-1-0)

> > > > > > > master

## 2.1.1

> - Fix a regression in cache invalidation using Redis strategy

- [Changelog](https://gitlab.com/front-commerce/front-commerce/tags/2.1.1)

Requirements: same than [2.1.0](#2-1-0)

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
