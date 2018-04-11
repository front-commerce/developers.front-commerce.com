---
id: getting-started
title: Getting started with Front-Commerce
sidebar_label: Installation
---

While Front-Commerce is a
[closed source product](http://developers.front-commerce.test/en/license.html),
we don't want you to trust us blindly.

Because of this, we created a lighter version of Front-Commerce. It should make
you feel how it is like to work with our product. While it isn't
[fully featured](#TODO-link-what-is-missing), we believe that if you enjoy
working with it, you will enjoy working with Front-Commerce since we use the
same
[concepts](http://developers.front-commerce.test/docs/architecture-overview.html)
and the same [file structure](#TODO-link-file-structure). You could even reuse
most of your code within Front-Commerce if you want to upgrade to the licensed
version.

But first, let's get started!

## Requirements

Front-Commerce is a node.js server that will serve a GraphQL endpoint and a
React application to your customers. In order to run it, you need to make sure
you have `npm` (>= 5.x) and `node` (>= 8.x) installed on your machine.

You can check your versions by running these commands:

```
npm -v
node -v
```

If you don't have the minimum requirements,
[please follow the instructions on node's website](https://nodejs.org/).

## Installation

Once your machine is set, let's clone the repository of Front Commerce Lite and
install the needed dependencies:

```sh
git clone https://github.com/front-commerce/front-commerce-lite.git
cd front-commerce-lite
npm install
```

## Launch the application

Finally, by running this command, you will launch the development environnment:

```sh
npm start
```

This is it! You can now open http://0.0.0.0:8080/ and begin hacking.

## What's next?

* [Extend the GraphQL Schema](extend-graphql-schema.md)
* [Request new data in a component](request-new-data.md)
* [Adapt the look & feel to your brand](adapt-theme-to-brand.md)
* [Create a custom page](create-custom-page.md)
