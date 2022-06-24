---
id: architecture-overview
title: Overview
description: In this section, you will learn how Front-Commerce interacts with your different platforms and its role.
---

## The main entrypoint for your users

Front-Commerce is the interface between users and your different services. It
acts as a Gateway for your different APIs. **You can host it on your
infrastructure**, as soon as it supports Node.js apps.

> **Note:** your services do not have to be publicly exposed on the web any more.
> You could add firewall rules or networking restrictions so only
> Front-Commerce’s middleware is allowed to interact with them.

![Front-Commerce as the central point of a microservice architecture](/docs/assets/architecture-overview.svg)

When Customers visit your online store, they will interact directly with
Front-Commerce (see below for more details).

Front-Commerce will then **use your eCommerce platform API (2)** to retrieve
information or trigger actions (e.g add a product to the Customer’s cart). In
its current state, Front-Commerce also uses **ElasticSearch (3) for navigation
features** (search, facets, filters…) instead of the Magento2 native API. It
allows to get more accurate results.

In a standard Magento2 architecture, Magento may then interact with other
services **(4)** such as PIM or ERP to synchronize data.

Front-Commerce can help you by **interacting directly with those services
(4’)**, which will reduce the load of your Magento instance and improve
resilience. It will also very likely be simpler and faster to implement.

## A typical request in Front-Commerce

Front-Commerce is composed of several parts:

- a Node.js express server
- a React application
- (optional) a Redis cache

![Front-Commerce’s internal architecture: React app, SSR, GraphQL server with caching](/docs/assets/architecture-internals.svg)

**Upon first page load (1)** — from Customers — the Node.js express server will
analyze the request and respond with the whole page **HTML content (2)**. This
initial step is named <abbr title="Server Side Rendering">SSR</abbr>. It is no
different than how servers have been serving web pages for years.

The key difference here is that Front-Commerce will use the React application as
the view layer, to render data returned by GraphQL queries **(1’)**.

As soon as Customers receive a response from the server (with a readable HTML
page), **the React application becomes their main interface (3)**.

Interactions may at some point trigger actions or require further data. An HTTP
request will be sent to the server and **GraphQL will respond (4)** with a
minimal and size-efficient JSON response.

Front-Commerce’s GraphQL middleware is a key component of this architecture. It
is **responsible for the communication across your different services to expose
unified data to clients**. GraphQL powerful typing system allows to describe
your domain in a clear an expressive way, no matter where data comes from.

Data retrieval in the GraphQL middleware has been designed to allow developers to easily cache specific data. Hence **every API could benefit of application layer caching, to reduce the load and improve performance**. For now, Front-Commerce only supports Redis as a cache mechanism.

## Front-Commerce in depth

Now that you know how Front-Commerce works, let’s dig into its different parts
to understand how to use them and design your application.

> **Coming soon:**
>
> - Thinking in Components
> - Thinking in Graph
> - GraphQL datasources (type, model, connectors, dataloaders)
> - React app component types and organization (UI Components, Modules,
>   Enhancers)
> - How is it extensible
