---
title: "Release: 1.0.0-alpha.2"
date: 2019-03-25
---

Front-Commerce `1.0.0-alpha.2` has been released with several improvements: revamped cart page, remote schema stitching, sitemap generation…

Read more about what’s new in this release that makes us closer to 1.0!

<!-- more -->

## Atoms improvements

As you may know, [Front-Commerce UI components are organized according to Atomic Design’s principles](/docs/concepts/react-components-structure.html).
In this release, several atoms have been improved to make their API clearer and reduce the risk to use them incorrectly.

The main components impacted are: `<Button>` (and its variants), `<Link>`, `<ResizedImage>` and some form-related atoms.

We also ensured that styles were not leaking across components, and that all variants were identified and used.

Their Storybook stories were also cleaned and homogeneized.

## Consistent variants API

Components were exposing heterogeneous API for using a variant (boolean props, `type` pros…).

To improve consistency and [make impossible states impossible](https://kentcdodds.com/blog/make-impossible-states-impossible), we’ve decided to change their API and always use an `appearance` property which is an enumeration of existing variants.

**These changes are backward compatible.**
Deprecation warnings will appear if you keep using the old properties.

## Cart page revamped

The Cart page was one of the oldest in our base theme.
It used legacy components and was overriden in most of the existing Front-Commerce projects.

Based on real-world use cases and feedbacks from partners, we revamped it to be more consistent with other pages.
We reused several components from the checkout and atoms/molecules for a more consistent UI and a cleaner code.

The Minicart has also been improved accordingly.

## GraphQL remote schemas

[GraphQL modules](/docs/essentials/extend-the-graphql-schema.html) can now register remote schemas to be stitched in the GraphQL schema, with custom transforms.

It enables a wide range of use cases for reusing your existing GraphQL endpoints in you eCommerce storefront.
Here are some example:

- use GraphQL headless CMS such as [GraphCMS](https://graphcms.com) or [Strapi](https://strapi.io) without any overhead
- use Magento2 GraphQL endpoint _as-is_ (useful for unsupported features or custom extensions)
- develop and deploy your microservices using another technology, and expose its GraphQL API in your Front-Commerce GraphQL schema
- … many more!

Read more in our documentation: [GraphQL remote schemas](/docs/advanced/graphql/remote-schemas.html).

## Magento2.3: store configurations are now exposed

Several people asked us to be able to get Magento store configurations from the theme, so administrators could be autonomous for some storefront customizations.

Thanks to remote schema stitching we have been able to reuse the `storeConfig` Magento2 GraphQL query.
Frontend developers can access these configurations the same way they would in a standard Magento2 PWA project, from the `Magento2GraphQL_storeConfig` root query.

<blockquote class="important">
In order to allow compatibility with Magento 2.2 stores, you will have to register a new GraphQL module if you want to use it and are on Magento 2.3.
See our [Magento2 GraphQL documentation page](/docs/magento2/graphql.html) for more information.
</blockquote>

<blockquote class="twitter-tweet" data-lang="fr"><p lang="en" dir="ltr">Here is the whole codebase of a module exposing Magento’s GraphQL queries in a <a href="https://twitter.com/Front_Commerce?ref_src=twsrc%5Etfw">@Front_Commerce</a> application.<br>This is why you can (should?) start an M2 shop right now with FC and adopt GraphQL/PWA Studio features when they’ll be stable. <a href="https://t.co/5kQNcj6yaX">pic.twitter.com/5kQNcj6yaX</a></p>&mdash; Pierre Martin (@pierremartin) <a href="https://twitter.com/pierremartin/status/1108157053732835329?ref_src=twsrc%5Etfw">20 mars 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


## Sitemap generation and image cache warmup scripts are back!

During our first alpha releases, we had not taken the time to migrate existing scripts to the new architecture.
This is now fixed and you can use scripts from Front-Commerce’s core on your servers.

Read more about them in our documentation: [Front-Commerce’s scripts reference](/docs/reference/scripts.html).

## And more

There are a few other things that were included in this release:
- bug fixes
- `graphql-js` update to its latest version
- removed unused methods from the core
- resolve relative paths from the current file in `*.scss`

To know more about this release, we recommend you to check the following pages:
- [Migration guide from 1.0.0-alpha.1 to 1.0.0-alpha.2](/docs/appendices/migration-guides.html#1-0-0-alpha-1-gt-1-0-0-alpha-2)
- [Full changelog from release notes](https://gitlab.com/front-commerce/front-commerce/releases) (Partners and Customers only)

As always, feel free to send us [an email](mailto:contact@front-commerce.com) or a [Slack](https://join.slack.com/t/front-commerce/shared_invite/enQtMzI2OTEyMDYzOTkxLWEzODg2NjM5MmVhNGUwODE0OTI4MWMwYTcxZWZkNzE1YjU4MzRlZmQ0YWY5NDNkZWM0ZGMzMGQ4NDc4OTgxMTU) message if you have any question.