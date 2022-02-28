---
id: help
title: Help
---

## Need help?

This developer area is being improved every day based on your feedbacks and
contributions (issues, PR). Our team is available to answer you in a timely
manner. Here are a few ways to contact us:

- Join the discussion in our
  [Slack channel](https://join.slack.com/t/front-commerce/shared_invite/enQtMzI2OTEyMDYzOTkxLWEzODg2NjM5MmVhNGUwODE0OTI4MWMwYTcxZWZkNzE1YjU4MzRlZmQ0YWY5NDNkZWM0ZGMzMGQ4NDc4OTgxMTU)
- [Reach us by email](mailto:contact@front-commerce.com) for
  questions about this documentation and the project
- Find out what's new by following
  [@Front_Commerce](https://twitter.com/Front_Commerce) on Twitter

We also invite you to read our [Troubleshooting documentation page](/docs/appendices/troubleshooting.html) to see if it does not contain relevant information for your current problem.

## Frequently Asked Questions

### Do you provide an open source license?

No.

As a bootstrapped company with a small team, we do not think we could be able to
achieve our vision <!-- TODO Link to « our vision » page -->in a sustainable way with an open source
business model yet.

That being said, we are open sourcing part of our stack and contributing to open
source projects we use as much as possible.

See more information on [our license page](/license.html).

### Will I have access to the source code?

A valid license gives you access to our whole codebase.

There are no private dependencies, compiled or obfuscated code. You could browse
the code as you wish and use it as an inspiration to learn and build your own
endpoints and custom theme.

### How to set up a Front-Commerce + Magento2 project?

1.  Install our Magento extension to extend Magento2’s Web APIs
2.  Ensure that your custom extensions expose their services through the Web
    APIs
3.  Configure the solutions so Magento2 and Front-Commerce connector can
    communicate together
4.  If needed, add new GraphQL types and datasources to leverage your custom
    features
5.  Customize your Front-Commerce theme by extending the base theme

More information in our [getting started section](/docs/essentials/installation.html).

### What benefits should I expect?

#### Backend

Only expose API and you are good to go. You don't have to work with views,
blocks or any display logic specific to your eCommerce solution. It makes
development much more simpler and maintainable.

The GraphQL middleware in Front-Commerce allows you to leverage your existing
APIs and to combine them in an efficient way, thus reducing the number of
endpoints to create.

#### Frontend

Not depending on your CMS templating system allows you a total freedom to build
what you’ll need. By using the Design System we provide, your team collaboration
will improve and it will show on your theme.

We estimate that it could make you reduce your development cost of ~20%
depending — of course — of your experience.

For your users, you might expect a page load time decrease of 75% in average
(see [our public demo](https://demo.front-commerce.com)). For you, it might
result in better SEO performances and more sales.

### When will the Front-Commerce team step in my project?

Since you have access to the whole codebase of our solution, you are autonomous
for your project.

During the onboarding, our team will help you by explaining each steps of the
set up. We will also give you an overview of the tools and media you could then
use to access our support.

Our technical interaction will be limited to the setup. If you need our team
afterwards, it will be either:

- through the support (part of the license)
- for additional professional services such as training, consulting, auditing or
  custom development

### Supported platforms

Right now, Front-Commerce is compatible with Magento2.

Depending on feedbacks from partners and potential customers we will support
other platforms.

So far, we are considering to support the following platforms:

- OroCommerce
- Akeneo
- WordPress
- Drupal
- Sylius
- Elasticpath
- Izberg

### What kind of projects is Front-Commerce particularly appropriated for?

Front-Commerce is targeted at teams wanting to leverage modern tools and
technologies to improve their online stores. It will shine in an user-centric
approach with continuous improvement in mind. Our goal is to empower
multidisciplinary teams by providing the technical foundations for building
things together.

Like any other PWA platforms, Front-Commerce is also particularly suited to
stores targeting mobile users and / or emerging markets.

It can also play a major part in a microservice architecture. When a project is
composed of different systems (ERP, CRM, PIM, CMS, Shipping Platform, …), the
GraphQL middleware will allow to cut integration costs by reducing the number of
interactions between systems.

### What are the drawbacks?

The biggest challenge for a team mastering an existing CMS solution is to learn
new paradigms. Learning Component based frontend (in React), the GraphQL query
language and microservices architecture using REST APIs can be tough in some
teams or projects due to existing culture.

Front-Commerce relies on external APIs to « get things done ». Having poor or no
API in your existing platforms could be a huge impediment.

For Magento2 stores for instance, you must be aware that most of the extension
we encountered so far are not exposing a Web API. If — by chance — it does have
a solid Service API you will still have to extend it to expose what you’ll need.
It can be an overhead depending on the extension’s quality.

Last but not least, there are some settings from existing CMS that might not be
supported in Front-Commerce. For instance, layout and design features from
Magento2’s admin area will probably never be supported in Front-Commerce. Due to
the current state of our product, it is very likely that some other settings
have not yet been supported in the product… but our roadmap is
shaped by your needs, so there’s always hope!

### I have not found an answer to my question

We're sorry to hear that. 😟

Please, open
[a public issue](https://github.com/front-commerce/developers.front-commerce.com/issues)
with your question, or [contact us](mailto:contact@front-commerce.com) and we
will do our best to answer you and improve this site!
