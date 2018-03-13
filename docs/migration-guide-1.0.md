---
id: migration-guide-1.0
title: 1.0 Migration guide
---

> **IN PROGRESS**

Front-Commerce 1.0 is a backwards incompatible release
and upgrades since the 0.12 / 0.13 versions will need
several important changes. It is the architecture we
consider as the most viable for projects, based on the
first implementations in production with « real life » features.

We hope this big bang will allow us to ship future versions
in a smoother way!

We recommend that you plan a thorough testing phase as
part of the upgrade, and that you keep an eye on the
client and server logs after the release to catch the
latest bugs related to real world use case you have not
tested. Pay a particular attention to the overrides that you
have made.

The good news is that there are very few projects being
worked on those versions, and — if we haven’t already done yet —
we are providing the support you’ll need with it.

## To upgrade run the following commands

> **TODO** (npm / composer)

## Backward incompatible changes

### GraphQL extensions

Front-Commerce core and your server extensions have now been
homogeneized and work in a same way.

* `customModules` has been removed over the common `modules`
* You must add the `front-commerce-magento2` meta module in
  your module file. We recommend to add it in the first position

### GraphQL schema regressions

We have reworked the types, and homogeneize our naming.

* `Type` and `Interface` suffixes have been removed from type names

## Deprecations

None yet.

## Behavior changes

None yet.

## New Features

> **TODO**
