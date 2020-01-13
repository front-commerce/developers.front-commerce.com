---
id: roadmap
title: Roadmap
---

Front-Commerce is built around the motto "Make it work, then make it better". This means that it is possible **today** to develop and deploy your website to production. But we still have a lot of things to work on to accomplish our mission: make your life easier, and your customers happier.

So let's have a look at what is coming in Front-Commerce.

<blockquote class="note">
But keep in mind that our main strength is our flexibility. We do take into account our clients needs and adapt our Roadmap to match theirs. If you have any particular needs, feel free to [contact us](mailto:contact@front-commerce.com) and we will see what we can do to help you :)
</blockquote>

## Release process

We aim at releasing often and follow [Semantic Versioning](https://semver.org) to clearly communicate our advancements to developers. We plan to document each migration process (changelog, release notes and documentation updates) and add deprecation warnings while keeping backwards compatibility to keep upgrades as seamless as possible.

Each minor release will contain at least one <abbr title="release candidate">`rc`</abbr> version, so early adopters could give it a try and provide us feedbacks as soon as possible.

It is up to each team / project to decide wether they prefer to follow our incremental releases or update in bigger chunks.

With close partners, we found agreements to **migrate some projects as soon as a new Front-Commerce `rc` version is released** so we could ensure in real-world scenarii that we are providing a seamless migration path and detect potential issues.

## 1.0: Partners Ready (in progress)

Even though our solution works, is in production and already has its early-adopters, the goal of this release is to support a broader range of development environments and avoid future breaking changes.
Through several `alpha` and `rc` releases we will focus on:

* Documentation
* Update the libraries and tools to their latest versions (React 16.8, Magento2.3, etc.)
* Setup e2e tests
* Cleanup parts of the base theme
* Release front-commerce's package to a npm repository

## 1.1: Backport features from our dogfooding

We've been hard at work integrating Front-Commerce for our own customers while incubating the product within [Occitech](https://www.occitech.fr). We've identified improvements from those shops that could make their way back into the main Front-Commerce codebase.

* Improve webperf (improve images loading, find a lightweight alternative to analytics.js, ...)
* Improve a11y
* Add command support to launch scripts such as crons
* Create product feeds for marketing purposes
* ...

## 1.2: Add missing features requested by Front-Commerce integrators

Front-Commerce already covers a wide range of features for the most common e-commerce use cases. But new integrators and new shops need their own set of features. So let's make it as seamless as possible and add those features.

* Guest checkout
* Bundle products
* Catalog Segmentation
* Content Staging

<blockquote class="note">
**Important:** this list is to be updated depending on popular requests and priorities.
See and discuss [Feature requests on our issue tracker](https://gitlab.com/front-commerce/front-commerce/issues?label_name%5B%5D=Feature+request). We are eager to receive your feedback!
</blockquote>

## 1.3: Demonstrate that Front-Commerce is an API Gateway

You might have seen this already, but we don't want Front-Commerce to be a Magento only solution. Our third store in production doesn't even use Magento!

The goal here is not to change the whole backend at once, but to enable partners to integrate new solutions for parts that matter (ERP, PIM, etc.).

Definitely not a final list, be we're eager to try some integrations with:

* [OroCommerce](https://oroinc.com/b2b-ecommerce/)
* [Sylius](https://sylius.com/)
* [Elasticpash](https://www.elasticpath.com/)
* [Akeneo](https://www.akeneo.com/)
* [Marello](https://www.marello.com/)

This iteration should also be a starting point to make our schema more [Demand oriented](https://principledgraphql.com/agility#4-abstract-demand-oriented-schema) and pave the way towards **2.0**.

## To infinity, and beyond!

This is broad overview to let you know about our priorities on the short-mid term. But we've got **so many ideas** that we want to experiment and integrate in Front-Commerce...

If you have one that you'd like to share with us, we would love to hear from you!

* [Slack](https://join.slack.com/t/front-commerce/shared_invite/enQtMzI2OTEyMDYzOTkxLWEzODg2NjM5MmVhNGUwODE0OTI4MWMwYTcxZWZkNzE1YjU4MzRlZmQ0YWY5NDNkZWM0ZGMzMGQ4NDc4OTgxMTU)
* [Twitter](https://twitter.com/Front_Commerce)
* [Contact](mailto:contact@front-commerce.com)

As our CTO likes to say: the sky is the limit! 🌈