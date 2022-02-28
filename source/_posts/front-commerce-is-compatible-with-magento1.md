---
title: "Front-Commerce supports Magento1"
date: 2019-11-20
---

Have you heard? We are compatible with Magento1! And that's awesome!

This means that you can finally develop your shop at your own schedule and you no longer are forced to migrate based on Magento's schedule. This also means that you can improve your front-end without waiting for a complex migration of your current platform. Let's see how this is possible with Front-Commerce.

<!-- more -->

## How does Magento 1 support works?

Before explaining how Front-Commerce's Magento 1 support is different from other e-commerce PWA solutions, we need to explain how Front-Commerce works under the hood. There are two parts:

- The React front-end which unlocks a better UX for your customers
- The GraphQL middleware that unifies how to fetch data from your remote services.

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

Thus, switching from Magento 1 to Magento 2 is as easy as a single configuration change:

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

This is great technically speaking, and it opens a wide range of opportunities for your project.

First, this means that if you have heard of Magento 1's <abbr title="End Of Life">EOL</abbr> and are worried about an upcoming complex migration, you can plan a smoother one. You don't have to migrate both the front-end and back-end at the same time. You can continue to use Magento 1 back-end while using Front-Commerce for your front-end. By doing this you can start improving your shop to increase your sales right now and build upon this investment when switching to another eCommerce headless-friendly platform (Magento 2 or any other one). Everything you are doing on your front-end will still be available when it is time for you to migrate away from Magento 1.

![First Magento 1, then Magento 1 with Front-Commerce and finally Magento 2 with Front-Commerce](/images/blog/migration-m1-m2-fc.svg)

This will also make the use of Magento 1 safer when its <abbr title="End Of Life">EOL</abbr> is reached since it won't be exposed to the outside world anymore.

Please note that a full re-platforming to Magento 2 is not the only option anymore. You can also embrace agility and move to your targetted architecture step by step by incrementally adopting other services that better suit your needs. For instance, you could imagine migrating [your CMS pages or adding a blog with WordPress](https://wordpress.demo.front-commerce.com/). You could also start unifying your catalog using a <abbr title="Product Information Management">PIM</abbr> such as [Akeneo](https://www.akeneo.com/). With a reduced number of responsibilities for your eCommerce platform, migrating away from Magento 1 would thus be much easier and less risky.

![Before migrating to Magento 2 you can also add other services such as Akeneo or Wordpress](/images/blog/migration-m1-m2-cms-fc.svg)

Since these data are fetched directly from Front-Commerce instead of Magento, there will also be no additional work during Magento 1's migration.

By the time you'll be there, alternative platforms may appear to be more relevant for your strategy and you could start evaluating the best fit in your context (OroCommerce, Salesforce Commerce, BigCommerce, OpenMage's Magento LTS, etc.). The only thing that will be needed with other integrations is to map the REST APIs of those solutions to the same GraphQL schema, and you will still be able to reuse the same Front-Commerce theme. For now, we are only supporting Magento 1 and Magento 2 as e-commerce solutions, but we are eager to support more of them. If you are interested in a specific solution. Please [contact us](mailto:contact@front-commerce.com) to help us shape a roadmap that will make you satisfied.

## Conclusion

While Magento 1 migration has been daunting for many businesses and developers, Front-Commerce can make things smoother for you. We aim at solving the difficult technical tasks so you could focus on what brings value to your projects.

<div class="center">
  <a class="link primary button" href="mailto:contact@front-commerce.com?subject=I’d like to have Front-Commerce in front of my Magento 1!">Contact us to talk about Magento 1!</a>
</div>
