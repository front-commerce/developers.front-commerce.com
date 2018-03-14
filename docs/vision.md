---
id: vision
title: Why Front-Commerce?
---

This page is aimed at explaining our vision for building Front-Commerce.

No matter what the current state of the project is, it will always evolve
according to this vision. If you share it with us, it is very likely that you
will be very productive with Front-Commerce and should start working with it
right away.

But first, let's start with a bit of background to fully understand where this
vision comes from.

## Once upon a time

Back in 2015, in a french agency named [Occitech](https://www.occitech.fr), a
friendly team of developers saw the announcements of the new major version
of the eCommerce solution they were experts in: **Magento2**.

A few things were very cool (Service API and testing for instance), but something
made them feel bad… **very bad**: after all these years, the frontend part had
not been reworked and this major version was adding new engineering layers on top
of it. **It was like a J2EE version of a 2008 HTML website…** with jQuery instead
of Prototype, a dying JS framework named KnockoutJS plus a bunch of XML files!
**¯\\\_(ツ)\_/¯**

ECommerce was not their only activity, and they were also developing custom
business application with rich domains and task oriented UIs. That’s how they
were noticing the rise of what was called _« Component Based »_ frontend
architectures.

React was gaining traction, and this team enjoyed developing their first
projects with it. **Its declarative and composable nature made them
productive and turned complex UIs into things easier to reason about.**

Then came **the announcements** of
[Falcor](https://www.youtube.com/watch?v=WiO1f6h15c8) by Netflix and
[GraphQL](http://graphql.org/blog/graphql-a-query-language/) by Facebook.
Pieces came together and Component Based UIs were now possible (and already
in production on huge sites). Design methodologies (Brad Frost’s
[Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/)), tools
(Pattern libraries, Sketch) and engineering practices could now live together
to build scalable and maintainable web and mobile UIs. **While it solved the
same problems as Magento2's complex system, it felt simpler and cleaner as a
solution.**

After all eCommerce is about creating custom user experiences, and it is where
we spend most of our time when building and maintaining an online store:
**let’s make it a pleasant experience** and never do a Magento2 theme using
their stack.

**Front-Commerce was born.**

Inspired by another trend towards simpler backend services and headless
eCommerce solutions (the JAMStack, and solutions such as
[Snipcart](https://snipcart.com/) or [Moltin](https://moltin.com/)),
they decided to introduce a middleware to loosen their dependency on Magento2
and embrace the upcoming changes that may happen in the eCommerce world.

## What it is

Fast forward to today, this team evolved and we are now proud of what we
achieved since that time.

After a <abbr title="Proof Of Concept">POC</abbr> and developing the React
frontend using Falcor for data fetching, we demo-ed the product to several
people and got a lot of very positive feedbacks. When we decided to « go for
it » and launch the Front-Commerce product for real (in October 2016) we
moved to GraphQL and (the yet young) Apollo client to embrace their rich and
innovative ecosystem.

Since then, we worked hard to build a product that supports a wide range of
eCommerce features. We kept our focus on Magento2 which is the platform we
knew most and which allows to support a lot of eCommerce use cases.

**Front-Commerce is in production, serving Magento2 stores, since
February 2018. It supports most of the Magento Opensource edition.**
It is composed of a React application, a GraphQL middleware using Magento2
Web APIs, Redis for caching and ElasticSearch for search — more details on
[Front-Commerce’s architecture documentation page](architecture-overview.md).

We wanted to be our first integrators and to create a few stores with
Front-Commerce before distributing the product to the world. By doing this
we could develop empathy and know how it feels to work with Front Commerce.
It also allows us to be confident in our claims and deliver a solid v1.0.

Being in production means that we focused on what is the most important
for an online stores: catalog, checkout, shipping, payments, theme overrides,
deployments, caching, logging… and everything you would expect from such a
solution. **That makes us the most mature « eCommerce PWA theme » in our field.**

We are now working on technical documentation and refactoring to deliver
Front-Commerce v1.0. On an other hand, we are finalizing business and legal
aspects to start selling licenses to customers. It also means that we are
building an ecosystem of partners. See [the license page](/license.html)
for further information.

**The product is alive, and ready to use!** We are now entering in a
release cycle to [deliver incremental improvements regularly](roadmap.md).

## What do we want it to be

Over the years, it became clear that Front-Commerce (and PWA in general) was
focused on users and their shopping experience.

In a web environment it means that we have to match high quality standards.
Hence our vision is to **sell a product that contains all the best practices
for building qualitative online stores by default** so teams can stay focused
on what is relevant to their context.

Best practices means:

* efficient collaboration between people and teams
* web performance
* accessibility
* SEO
* consistent web UIs
* new web APIs
* different types of tests (unit, integration, visual regression, contracts…)
* continuous deployment
* microservices architecture and resilient websites

Our field evolves at a fast pace and **it is difficult to remain aware of all
the best practices**. By using Front-Commerce, you will benefit from all our
experience and get those new practices with our regular updates:
**your stores will perform better over time**.

Relieved from this burden, we hope that **you will focus more on your
users** and deliver the shopping experience they deserve and love.

As developers, you will also learn new concepts since Front-Commerce lowers
the entry cost and makes experimenting with what you wanted to learn a breeze.
**If you are working on a team and want to increase the overall quality,
Front-Commerce can help you introduce better practices**.

We believe that together we can build a faster and more usable web,
starting with online stores. Are you ready for this revolution?
[Get started!](getting-started.md)
