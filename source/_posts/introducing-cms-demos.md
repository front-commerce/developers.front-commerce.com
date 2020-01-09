---
title: "Introducing Front-Commerce CMS demos"
date: 2019-11-20
---

One of the strength of Front-Commerce is that it is platform agnostic: you can virtually connect to any service and display its data directly on your shop's front-end.

But if you are not used to these notions, it might be unclear what does this means. This is why we've added two new demos focused on <abbr title="Content Management System">CMS</abbr> solutions: [WordPress](https://wordpress.demo.front-commerce.com) and [Prismic](https://prismic.demo.front-commerce.com).

<!-- more -->

## What's a CMS and why should I care?

A <abbr title="Content Management System">CMS</abbr> is a tool that focuses on managing your contents. It can bring you features like advanced content edition, publishing and reviews tools, version managements, etc. But at the very least, it is usually better than your e-commerce back office.

This is because an e-commerce solution focuses on what brings you value: managing orders. Some don't even have tools to edit contents like. And the ones that have some are either not that great or expensive (ex: Magento's Page Builder is only available on the Commerce version).

Using a dedicated <abbr title="Content Management System">CMS</abbr> seems to be an interesting alternative. But previously it usually meant that you had to have two websites:

- the users could feel lost and not really know where to find the correct information
- the developers will have to maintain two separate front-ends and recreate the same features on both websites
- the search engines will favor your CMS contents' rather than your shop

## Headless CMS can be a solution

But you can have the best of both worlds:

- a nice CMS that will make your publishers happy
- only one website that will group your contents and your shop

This is where Front-Commerce comes in. Thanks to its GraphQL middleware, you can decide to retrieve part of the graph from your CMS's API rather than from your shop's API.

By doing this, your users will only have one website but will be able to see pages that have contents that come from both your shop and your CMS. For instance, you can imagine [blog posts featuring products](https://wordpress.demo.front-commerce.com/blog/post-with-a-product-card) or [home pages with complex contents easily administrable](https://prismic.demo.front-commerce.com/). Possibilities are endless.

But the best part is that you don't _have to_ start with the correct architecture or services right from the start. You can first deploy a shop that uses [Magento's CMS](https://docs.magento.com/m2/ce/user_guide/cms/page-add.html) pages for instance, and then move your contents to a dedicated CMS when you need. You won't have to change your theme, but only import the correct GraphQL module in your Front-Commerce application.

This is all possible thanks to Front-Commerce's architecture.

Browse our demos:

<section class="fc-section">
  <div class="card-grid">
    <div class="card card--large">
      <img src="/images/wordpress-logo.svg">
      <h3><a href="https://wordpress.demo.front-commerce.com">WordPress</a></h3>
      <ul>
        <li>Replaces <a href="">Magento's CMS Pages</a></li>
        <li>Adds a blog</li>
        <li>Displays products and cart on the blog</li>
      </ul>
    </div>
    <div class="card card--large">
      <img src="/images/prismic-logo.svg">
      <h3><a href="https://prismic.demo.front-commerce.com">Prismic</a></h3>
      <ul>
        <li>Replaces <a href="https://docs.magento.com/m2/ce/user_guide/cms/page-add.html">Magento's CMS Pages</a></li>
        <li>Adds a slider on the home page</li>
        <li>Adds a store locator</li>
      </ul>
    </div>
  </div>
</section>

## How does that work technically?

Behind the scene, we have implemented a Front-Commerce module for each CMS. On each of these modules we've got two parts.

### [A GraphQL module](/docs/essentials/extend-the-graphql-schema.html)

It replaces the CMS Pages resolvers to fetch the pages from the new CMS instead of Magento. This is possible by creating a GraphQL module that only defines loaders. These will override Magento's module loaders and will then fetch the data from the CMS's API.

It also adds its own schema to add features specific to the CMS (example: blog queries). In the case of Prismic we are even using Schema Stitching in order to be able to query Prismic's GraphQL directly from Front-Commerce's GraphQL. This makes the integration work as minimal as possible and lets you build new features quickly while still making them configurable in an admin panel.

### [A theme extension](/docs/essentials/extend-the-theme.html)

First of all, it does not need any changes regarding the CMS pages because the only thing a theme cares about is the GraphQL schema. If it didn't change, there is no reason to change the theme. And this is why fetching some parts of your graph to dedicated services can be done during the life of your project and does not need to wait for a big migration or rewrite.

The new features however are developped by fetching the new data and adding [the pages](/docs/essentials/add-a-page-client-side.html) and [components](/docs/essentials/create-a-business-component.html) depending on the new schema provided by the GraphQL module. However, this is not a full rewrite. Any component that already existed in Front-Commerce can be reused (simple ones like links, buttons, etc. and complex ones like ProductItems, MiniCart, etc.).

This also means that if you want to add the features we've developed in these demos in your Front-Commerce shops, you could do it by simply adding the modules to your [`.front-commerce.js`](/docs/reference/front-commerce-js.html). A one line change that brings a complete blog to your shop.

---

Do you want to learn more about Front-Commerce? Do you want to implement a specific CMS feature or integrate another CMS?

<div class="center">
  <a class="link primary button" href="mailto:contact@front-commerce.com?subject=I’d like to have a great CMS on my shop!">Contact us to talk about the future of CMS!</a>
</div>
