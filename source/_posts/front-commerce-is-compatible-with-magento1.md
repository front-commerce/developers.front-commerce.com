---
title: "Front-Commerce supports Magento1"
date: 2019-11-20
---

Have you heard? We are compatible with Magento1! And that's awesome!

This means that you can finally develop your shop at your own schedule and you no longer are forced to migrate based on Magento's schedule. This also means that you can improve your front-end without waiting for a complex migration of your back-office. Let's see how this is possible with Front-Commerce.

<!-- more -->

## How does Magento 1 support works?

Before explaining how Front-Commerce's Magento 1 support is different from other e-commerce PWA solutions, we need to explain how Front-Commerce works under the hood. There are two parts:

* The React front-end which unlocks a better UX for your customers
* The GraphQL middleware that unifies how to fetch data from your remote services.

In a simple Front-Commerce shop, this means that the GraphQL fetches all its data from a single e-commerce solution. The first supported solution was Magento 2.

![The React App fetches its data from the GraphQL middleware which itself fetches the data from Magento](/images/blog/simplified-fc-magento-solution.svg)

But since the GraphQL schema abstracts away Magento, it is possible to map two different APIs to the same GraphQL schema. Afterall, a product, be it in Magento 1, Magento 2, or any other e-commerce platform is still a product.

This is why we have been especially careful to share the same GraphQL schema for Magento 1 and Magento 2's Front-Commerce modules. And this is also why the queries that exist in Front-Commerce's base theme will work on both Magento 1 and Magento 2.

```graphql
query Product($sku: String!) {
  product(sku: $sku) {
    sku
    name
  }
}
```

Thus, switching from Magento 1 to Magento 2 is one line of configuration:

```diff
module.exports = {
  // ...
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },,
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento1", path: "server/modules/magento1" }
  ]
};
```

## A lighter migration path

This is great technically and all but let's see how can this be useful to you.

First, this means that if you have heard of Magento 1's end of life and are worried about the complex migration awaiting you, you can plan a smoother migration. You don't have to migrate both the front-end and back-end at the same time. You can continue to use Magento 1 back-end but use Front-Commerce for your front-end. By doing this you can still improve your shop without worrying about the fact that everything will be thrown out sooner or later. Everything you are doing on your front-end will still be available when it is time for you to migrate from Magento 1.

![First Magento 1, then Magento 1 with Front-Commerce and finally Magento 2 with Front-Commerce](/images/blog/migration-m1-m2-fc.svg)

This will also make the use of Magento 1 safer while it is no longer support since it won't be exposed to the outside world anymore.

But you migrating to Magento 2 is not the only option. You can also make Magento's migration itself lighter by using other services that better suit your needs. For instance you could imagine migrating [your CMS pages or adding a blog with WordPress](https://demo.front-commerce.com/). You could also start unifying your catalog using a PIM like [Akeneo](https://www.akeneo.com/).

![Before migrating to Magento 2 you can also add other services such as Akeneo or Wordpress](/images/blog/migration-m1-m2-cms-fc.svg)

Since these data are fetched directly from Front-Commerce instead of Magento, there will also be no additional work during Magento 1's migration.

And last but not least, it might be also the opportunity to think about Magento alternatives (OroCommerce, Salesforce, etc.). The only thing that will be needed with other integrations is to map the REST APIs of those solutions to the same GraphQL schema, and you will still be able to reuse the same Front-Commerce theme. For now we are only supporting Magento 1 and Magento 2 as e-commerce solutions, but we are eager to support more of them. If you are interested in a specific solution. Please [contact us](mailto:contact@front-commerce.com) and maybe we can figure out a partnership to develop those integrations.

## Conclusion

While Magento 1 migration has been daunting for many busniesses and developers, Front-Commerce can make things smoother for you. It is our job to make the difficult technical implementations and allow you to focus on what brings value to your customers.

<div class="center">
  <a class="link primary button" href="mailto:contact@front-commerce.com?subject=I’d like to have Front-Commerce in front of my Magento 1!">Contact us to talk about Magento 1!</a>
</div>


