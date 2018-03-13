---
id: roadmap
title: Roadmap
---

We built Front-Commerce with [an ambitious vision](vision.md)
so we have a lot of things on our plate!

## Our Context

### Web technologies are exciting, but the fatigue is here!

Due to the nature of the product, our roadmap is doomed to evolve
often according to the technologies around it.

Here are examples:

* a browser will support a new web API, making it relevant for
  production purpose
* a library we use will release a new major version, bringing
  awesomeness to our world
* a solution we connect with will release a new version, with API
  changes (breaking, or allowing us to interact with it in a more
  convenient way)
* what was once considered — at least by us — as a good practice
  has now found a better alternative

While all of these things happens, **we have a promise to keep with you:
you won’t have to suffer from this fatigue by using Front-Commerce.**

Thus we will have some work to make it available in the product,
without breaking your code or by making the upgrade as smooth as possible.

### We are a bootstrapped company

We have limited resources and have to focus on the Most Important Things ™
first to match business outcomes.

That is the reason why we sometimes have to introduce technical debt — but we are aware of it and plan to pay it back — or implement a component in a simple way for now.
Our roadmap will thus contain some technical debt reduction items, and
technical improvements to some low level components.

We are dedicated to make those changes as seamless for you as possible. Most
of the time you would benefit from them without any code changes, otherwise
we will publish in our migration guides what you should do if you want to
leverage them.

### We are part of an ecosystem

Truly valuing our Customers and Partners means that our roadmap will integrate
your feedbacks.

Here are examples:

* ouch! A critical — or not so critical — bug has been noticed… release needed!
* developers are working on a specific OS and are being annoyed by some
  slowness, or a bug with tho tooling
* project·s will need a new feature, and we know it would be of benefit
  as part of the core
* supporting a new solution is one of the most asked request we have, we
  have to investigate and build a POC

### We have dreams too

Sometimes it is also great to make our dreams come true, and be a bit selfish!

Be prepared to see this refactoring, a new feature that excites part of our team,
or a new tool for the documentation in our roadmap…

## Front-Commerce’s roadmap

> **Coming soon**: the first 2 projects using Front-Commerce are deployed in
> production and there are some new features needed (eg: Wishlist). On the
> other hand, we are working on the 1.0 release which will means a stable API.
>
> But the cool thing is that we have a lot of traction these days and our partners have
> several Front-Commerce projects in the pipe, with decisions in the next few weeks.
>
> For all these reasons the Roadmap will evolve a lot by mid-April and we will
> keep you updated.

If you want to have an imprecise vision of what comes next here is a
**temporary roadmap**.

### 1.0: mid-April

**Goal:** onboard the first external integrators and celebrate!

We prevented premature optimization and introduced technical debt.
Time has come to pay it back!

* **(Started)** GraphQL architecture reworked to its final module version
  (inspired by, or using [GrAMPS](https://gramps.js.org/))
* **(Started)** Document all components in our Design System, and review
  the Atomic Design architecture in place
* **(Started)** Public documentation (you are reading it!) with everything
  needed for partners to get started
* **(Started)** Improving the Developer Experience by upgrading tools (webpack 4)
  and allow faster reload times
* Homogenize and document configurations
* Make the base theme great again!™ by backporting things from our first
  projects’ themes and integrating what we have learnt from them
* PWA basics: manifest, simple Service Worker, offline page
* _(Very likely)_ Code splitting for reasonable bundle sizes
* _(Very likely)_ Use some of the tooling from Magento’s PWA Studio
* _(Very likely)_ Split code into several npm / composer packages managed from monorepos
* _(Maybe)_ Use Magento2 Elastic Suite extension instead of Wyomind ElasticSearch
  and make search / navigation more natural
* _(Maybe)_ Upgrade Apollo to Apollo 2.x (Apollo Boost?)

### Q2 2018

**Goal:** improve web quality (a11y, performance…) and ensure our
architecture is good enough

* Lazy load images (disabled for technical reasons in `0.12`)
* Responsive images and modern formats (e.g: `webp`)
* A11y: adding tooling for automated testing, improve the codebase
  with quick wins
* Applying best practices from performance and quality tools
* Improving code splitting
* Magento2: features needed by our Customers
  * wishlist
  * guest checkout
  * renew order
* POCs with other backends: Sylius, Shopify, Moltin, Akeneo, Wordpress, Drupal (list TBD)
* PWA: create an app shell with cache management where possible
* PWA: experiments around offline catalog with sync, samples and documentation

### Q3 2018

> **Coming sooner or later**: we have several paths in mind and what will happen in
> the next few weeks / months will shape the roadmap. So stay tuned!

Here is what is very likely for now:

* PWA:
  * improve UX when in offline mode
  * implement notifications for order tracking
  * implement notifications for price alerts (B2B use case)
  * geolocate users for store location / shipping estimates / relays
  * POC: Payment Request API
* A11y: in-depth improvements (`tabindex`…) to match high standards by default
* A11y: documentation about good practices to follow
* GraphQL-related improvements (common interfaces, Apollo offline / cache improvements)

> Interested by this roadmap? Need something else not listed here?
> Please [contact us](maito:contact@front-commerce.com) to see if we could make that happen…
