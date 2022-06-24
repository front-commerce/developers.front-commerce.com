---
title: "2.9: Front-Commerce payments improved, platform agnostic Adyen support and Prismic enhancements"
date: 2021-09-02
---

Front-Commerce 2.9 is out! Over the past few weeks, we focused on delivering incremental improvements to existing features. Everyone on the team has also taken some time off during this period to recharge batteries.

<!-- more -->

## Bugfixes for all

As promised [in the 2.8 announcement](/changelog/front-commerce-2.8/#Summer-backlog-cleaning), we’ve released patch versions for the 5 minor versions released in 2021.

It allows customers to update their project without waiting for a minor version upgrade.
Each release contains bugfixes fixed in later minor versions.

For details, please visit each version’s release page: [2.8.1](https://gitlab.com/front-commerce/front-commerce/-/releases/2.8.1), [2.7.2](https://gitlab.com/front-commerce/front-commerce/-/releases/2.7.2), [2.7.1](https://gitlab.com/front-commerce/front-commerce/-/releases/2.7.1), [2.6.1](https://gitlab.com/front-commerce/front-commerce/-/releases/2.6.1), [2.5.3](https://gitlab.com/front-commerce/front-commerce/-/releases/2.5.3) and [2.4.7](https://gitlab.com/front-commerce/front-commerce/-/releases/2.4.7).

## Front-Commerce payments improved

[Front-Commerce payments](/docs/advanced/payments/front-commerce-payments.html) is a core feature used by every platform-agnostic payment method to hook into eCommerce platform’s checkout and order management systems.

We reworked this area of our product to enable new exciting use-cases:

- payment methods can now handle asynchronous notifications in a homogeneous way
- it is also possible to update an Order status in a more fine-grained way. Merchants will have more insight into the payment status from their back-office, no matter the payment scenario (even the more complex ones).
- payment logs are now very detailed and easier to analyze. Integrators can inspect any domain event that occurred and understand what customers did during their payment process

In the future, we will leverage these new capabilities in all our existing payment modules.

## Adyen support

Available for Magento 2 since Front-Commerce 2.3, Adyen is now available as a Front-Commerce payment method.
It means that it can be enabled for any eCommerce backend, without requiring a platform specific extension.

It leverages the new Front-Commerce payment improvements to provide a seamless checkout experience.

## Prismic enhancements: peak traffic scalability and multi-environment workflows

Shops that heavily rely on Prismic to compose pages and layouts **can now support 50x more simultaneous users than in the previous release**.
Our performance benchmarks highlighted a bottleneck due to our usage of the Prismic API in case of peak traffic.
In this release, we worked on our Prismic module to make it leverage Front-Commerce caching mechanisms for every piece of content.

**Sharing an actively updated Prismic repository** across several Front-Commerce environments (production, staging, development) is more convenient in this release.
An environment will now fetch the latest Prismic content version regularly (or upon error) without relying on Prismic webhooks.
Integrators gave us feedback from their usage of the Prismic module “in a real-world scenario”. We listened and improved the Prismic module to ensure that development and testing remains as smooth as possible in this context.

## Proximis connector is moving fast + live event in Paris (not virtual!)

We made significant progress on the Proximis connector during this release.

If you’re a retailer wondering whether headless is a good fit for your business, join us in Paris on the 21st of September… and be one of the first to discover what we’ve been up to!

More details on the [« Faut-il céder à la folie du Headless ? » event page.](https://hubs.li/H0Tldy70)

## Other changes

- added caching to Magento 1 category product listing fallback (for stores not using a search datasource on their PLP)
- fixed a visual issue impacting mini-cart and user menu on short page (Chocolatine theme)
- added JSDoc type checking as part of our CI pipeline. To know more about our typing strategy, please read [the related <abbr title="Architecture Decision Record">ADR</abbr> (customers only)](https://gitlab.com/front-commerce/front-commerce/-/blob/main/docs/adr/0003-jsdoc-typing.md)

<hr />
<div class="center">
  <p>
    <a class="link primary button" href="https://www.front-commerce.com/en/contact-us/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.9.0](/docs/appendices/migration-guides.html#2-8-0-gt-2-9-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.9.0)
  </p>
</div>
