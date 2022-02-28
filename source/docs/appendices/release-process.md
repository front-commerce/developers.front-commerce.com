---
id: release-process
title: Release process
---

Front-Commerce is built around the motto "Make it work, then make it better". This means that it is possible **today** to develop and deploy your website to production.

Our mission of making your life easier, and your customers happier is an ongoing process. Front-Commerce will thus regularly evolve. Our main strength is our flexibility. We do take into account our clients needs and adapt our Roadmap to match theirs. If you have any particular needs, feel free to <span class="intercom-launcher">[contact us](mailto:hello@front-commerce.com)</span> and we will see what we can do to help you :)

This page explains our release philosophy.

## Semantic Versioning

We aim at releasing often and follow [Semantic Versioning](https://semver.org) to clearly communicate our advancements to developers. We document each migration process (changelog, release notes and documentation updates) and add deprecation warnings while keeping backwards compatibility to keep upgrades as seamless as possible.

**TL;DR:** (from the [Semantic Versioning](https://semver.org) documentation)

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> 1. MAJOR version when you make incompatible API changes,
> 2. MINOR version when you add functionality in a backwards compatible manner, and
> 3. PATCH version when you make backwards compatible bug fixes.
>
> Additional labels for pre-release can (and in our case will) be added to the MAJOR.MINOR.PATCH format.

## Release pace

### When to expect a new release?

At Front-Commerce, the team has been growing a lot! _(as part of [our fundraising](https://www.usine-digitale.fr/article/front-commerce-leve-1-5-million-d-euros-pour-sa-solution-d-optimisation-des-boutiques-en-ligne.N1163477) notably_ 👀*)*

We are now able to implement a lot of new elements between two minor releases, **every 6 weeks** (new features, tech improvements, bug fixes ...)

In order to follow the pace of our users, we have decided to release 2 intermediate pre-releases between 2 minor releases, to allow our early-adopters to integrate the features as soon as possible and to give us feedback.

Therefore, here is the theoretical rhythm of a cycle (Front-Commerce is currently in MAJOR version 2):

![Front-Commerce’s release pace and cycles](/docs/appendices/assets/release-pace.jpg)

### The 2022 release calendar

- **[2.12.0](/docs/appendices/release-notes.html#2-12-0-2022-01-06)**: 6 january
- **2.13.0**: 18 february
- 2.14:
  - 4 march: _2.14.0-beta.0_
  - 18 march: _2.14.0-beta.1_
  - **1 april: 2.14.0**
- 2.15:
  - 15 april: _2.15.0-beta.0_
  - 29 april: _2.15.0-beta.1_
  - **13 may: 2.15.0**
- 2.16:
  - 27 may: _2.16.0-beta.0_
  - 10 june: _2.16.0-beta.1_
  - **24 june: 2.16.0**
- 2.17:
  - 8 july: _2.17.0-beta.0_
  - 22 july: _2.17.0-beta.1: 22-07-2022_
  - **5 august: 2.17.0**
- 2.18:
  - 19 august: _2.18.0-beta.0_
  - 2 september: _2.18.0-beta.1_
  - **16 september: 2.18.0**
- 2.19:
  - 30 september: _2.19.0-beta.0_
  - 14 october: _2.19.0-beta.1_
  - **28 october: 2.19.0**
- 2.20:
  - 11 november: _2.20.0-beta.0_
  - 25 november: _2.20.0-beta.1_
  - **9 december: 2.20.0**
