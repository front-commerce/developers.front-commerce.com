---
id: add-a-page-client-side
title: Add a new page
---

Front-Commerce comes with a classic set of pages for an e-commerce application.
It has URLs for Catalog routes (Categories, Product, Search…), Checkout routes,
Account routes, Cms pages…

But when building your own e-commerce experience you will most likely need
to add your own pages/routes. And that's what we will focus on in this guide.

We will take the example of a shop that is selling ingredients. It might make
sense for such a website to also present a bunch of recipes to inspire their
customers. Thus, we will add the needed routes to display:

* a page containing the list of all the recipes
* a page containing the details of one recipe

## Add a page using a static URL

First, let's add the page containing the list of all recipes. To do so you will
need to:

* Create the route file that will be mapped to an URL
* Declare your module as a web module

<blockquote class="info">
This system is inspired by JavaScript frameworks like [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), [Sapper](https://sapper.svelte.dev/), [Nuxt](https://nuxtjs.org/), etc. If you understand how these work, implementing routing within Front-Commerce will be easier. 
See [Routing reference](/docs/reference/routing.html#How-routes-are-loaded) for more advanced information.
</blockquote>

### Create the route file that will be mapped to an URL

Create a route file in the folder `web/theme/routes/` of your module. If you don't have any module yet, please refer to [Extend the theme](extend-the-theme.html).

The url of your route will then depend on the name of the file you've created in the `web/theme/routes/` folder. Thus, if we want to display a page at the URL `/recipes`, we will create a file in `web/theme/routes/recipes.js` which will export the component you want to display on this page.

```jsx
import React from "react";
import { H1 } from "theme/components/atoms/Typography/Heading"
import RecipesList from "theme/modules/Recipes/List"

const Recipes = () => <div>
  <H1>Discover our recipes</H1>
  <RecipesList />
</div>;

export default Recipes;
```

<blockquote class="note">
Note that there is a `RecipesList` component here. It is in fact a business component that you can create by refering to [Create a business component](/docs/essentials/create-a-business-component.html).
</blockquote>

We have decided here to put the file under `web/theme/routes/recipes.js`, but it would have still worked if we've put it under `web/theme/routes/recipes/index.js`. The page would still be displayed at the URL `/recipes`.

### Declare your module as a web module

You have now declared that if your module's routes are loaded, it will display the `Recipes` component at the URL `/recipes`. However, your module routes are not loaded yet. You need to declare it in your `.front-commerce.js` file.

To do so, create an empty file in `web/index.js`. This is useful for module resolution at the build level. Then add it as a webModule in your `.front-commerce.js` file.

```diff
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: ["./my-module"],
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },
    { name: "Magento2", path: "server/modules/magento2" }
  ],
  webModules: [
    { name: "FrontCommerce", path: "front-commerce/src/web/index.js" },
+   { name: "MyWebModule", path: "./my-module/web/index.js" },
  ]
};
```

Once you're done, you can refresh your application
(`npm run start`), and you should see your new route if you go
to the `/recipes` URL.

🎉

<blockquote class="warning">
    **Warning:** If several web modules are registered in your application and several of them define the same route, the route of the last web module in `.front-commerce.js` will be displayed. This can be useful if you want to override a default feature of Front-Commerce.
</blockquote>

## Add a page using an URL with parameters

Now, let's add a `RecipeDetails` page that should be mapped to the `/recipes/my-recipe-slug`. You will need to create the route file that will match the URL. Since you have a parameter in the URL, you will need to put brackets around it.

Thus, create a `RecipeDetails` component in `web/theme/routes/recipes/[slug].js`. This will allow you to display the `RecipeDetails` component in any url looking like `/recipes/.*`.

```jsx
import React from "react";
import { H1 } from "theme/components/atoms/Typography/Heading"
import Recipe from "theme/modules/Recipes/Details"

const RecipeDetails = (props) => <div>
  <H1>You are looking at the recipe matching the slug {props.match.params.slug}</H1>
  <Recipe slug={props.match.params.slug} />
</div>;

export default RecipeDetails;
```

What's interesting to note here is that:
* anything that is between brackets in your file path will be transformed into a parameter available in `props.match.params.slug`
* you can create sub folders in your `web/theme/routes` folder if you want to have deeper URLs

You can now restart your application (`npm run start`) and you should see your route `RecipeDetails` displayed at `/recipe/baguette`. 🎉

<blockquote class="warning">
  **Note:** Internally, this works by transforming any `/recipes/[slug]` kind of routes to `/recipes/:slug` that is then used by [React-Router](https://github.com/ReactTraining/react-router), a major routing library in React's ecosystem.
</blockquote>

## What about dynamic URLs?

If your URL can't be mapped to a pattern that can be transformed into filenames, do not worry,
we have got you covered! There is a second extension point in Front-Commerce that allows you to achieve this: the `Dispatcher`.

[You can learn more about it in our advanced documentation.](../advanced/theme/route-dispatcher.html)

## How can I share layouts between routes?

You can also wonder how can a route be displayed but use the same layout as the other routes. This is also handled by Front-Commerce by using files like `_layout.js` or `_inner-layout.js` in your routes.

[You can learn more about it in our advanced documentation.](../advanced/theme/layouts.html)