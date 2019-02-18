---
id: installation
title: Installation
---

While Front-Commerce is a
[closed source product](https://developers.front-commerce.com/en/license.html),
we don't want you to trust us blindly.

Because of this, we created a lighter version of Front-Commerce. It should make
you feel how it is like to work with our product. While it isn't
[fully featured](https://github.com/front-commerce/front-commerce-lite#what-it-is-not),
we believe that if you enjoy working with it, you will enjoy working with
Front-Commerce since we use the same [concepts](architecture-overview.md) and
the same [file structure](front-commerce-structure.md). You could even reuse
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

Finally, by running this command, you will launch the development environment:

```sh
npm start
```

This is it! You can now open [http://0.0.0.0:8080/](http://0.0.0.0:8080/) and
begin hacking.

## Bonus: launch Storybook, our UI Development Environment

Front-Commerce is component based, and uses
[Storybook](https://storybook.js.org/) to allow developers to focus on building
components in isolation.

Storybook is a separate application that will render all the « stories » written
in your code base so you can browse them.

To launch it run the following command:

```sh
npm run storybook
```

You can now open [http://0.0.0.0:9001/](http://0.0.0.0:9001/) and explore the
existing components.

## What's next?

- [Adapt the look & feel to your brand](adapt-theme-to-brand.md)
- [Create a UI component](create-a-ui-component.md)
- [Create a custom page](create-custom-page.md)
- [Extend the GraphQL Schema](extend-graphql-schema.md)
- [Create a Business component](create-a-business-component.md)
