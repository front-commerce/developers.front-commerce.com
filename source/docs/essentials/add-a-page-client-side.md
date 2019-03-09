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
need to proceed in two steps:

1. Create the page component that will be displayed all your recipes
2. Map the `/recipes` URL to your page component

### Add a page component

A page component must live in the `web/theme/pages/` folder of your module. If you don't have any module yet, please refer to [Extend the theme](extend-the-theme.html).

The goal of adding your page in the `web/theme/pages/` folder of your module is to make it easier for you to find a specific page component in your source code, but also in Front-Commerce's source code.

Thus, in the case of our Recipes, we will create our component within the `my-module/web/theme/pages/Recipes` folder:

* `my-module/web/theme/pages/Recipes/Recipes.js`: will be your actual page component
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
* `my-module/web/theme/pages/Recipes/index.js`: will proxy the `Recipes.js` file in order to be able to do imports on the folder directly. See [this blog post](http://bradfrost.com/blog/post/this-or-that-component-names-index-js-or-component-js/) for more context about this pattern.
<!-- TODO add comment about code splitting and link to our documentation -->
```jsx
import Recipes from './Recipes.js'

export default Recipes;
```
* `my-module/web/theme/pages/Recipes/Recipes.story.js`: will add your page to the Storybook of your application. In the case of a page it might be troublesome to setup, but it is worth it because it will improve your code quality by being in a sandboxed environment and it will help you reference the edge cases.
```jsx
import Recipes from "./Recipes.js";
import { storiesOf } from "@storybook/react";

storiesOf("pages.Recipes", module).add("default", () => {
  return <Recipes />;
});
```
  <blockquote class="note">
  For a more detailed explanation of how Storybook works in the context of Front-Commerce, please refer to <a href="add-component-to-storybook.html">Add a component to your Design System</a>.
  </blockquote>

### Map the URL to the page component

Once you have created your component, you need to actually tell the application how to use it. To do so, Front-Commerce provides an extension point that will let you declare custom routes.

To active it in your module, you need to create the file `my-module/web/moduleRoutes.js` that will export the list of routes of your module.

```jsx
import React from "react";
import Route from "react-router/Route";
import Recipes from "theme/pages/Recipes";

export default () => [
  <Route
    path="/recipes"
    exact
    render={() => <Recipes />}
    key="recipes"
  />
];
```

Once you've created your file, you can refresh your application
(`npm run start`), and you should see your new route if you go
to the `/recipes` URL.

🎉

<blockquote class="warning">
    **Warning:** If several modules are registered in your application and several of them define the same route, the page of the first module in `.front-commerce.js` will be displayed. This can be useful if you want to override a default feature of Front-Commerce.
</blockquote>

## Add a page using an URL with parameters

Now, let's add a `RecipeDetails` page that should be mapped to the
`/recipes/:recipe-id-or-slug`. You will need to follow the exact
same steps as for the `/recipes` page:
* Create a `RecipeDetails` component in the
`theme/pages/Recipes/RecipeDetails` folder
* Map the `/recipes/:recipe-id-or-slug` to the new component

**But how can you make the URL have a parameter (`:recipe-id-or-slug`)?**

In fact, if you take a look at the line #2 of the `moduleRoutes.js` file we have just created, you will notice that we are using the [React Router](https://github.com/ReactTraining/react-router) routing library. For this reason, you can use any feature that it provides. In the `RecipesDetails` case, you can use the params syntax of React Router as shown below.

```diff
import React from "react";
import Route from "react-router/Route";
import Recipes from "theme/pages/Recipes";
+import RecipeDetails from "theme/pages/Recipes/RecipeDetails";

export default () => [
  <Route
    path="/recipes"
    exact
    render={() => <Recipes />}
    key="recipes"
-  />
+  />,
+  <Route
+    path="/recipes/:slug"
+    render={({ match }) => <RecipeDetails slug={match.params.slug} />}
+    key="recipe-details"
+  />
];
```

You will then be able to use the `slug` as a property of your `RecipeDetails` page like any other property.

## What about dynamic URLs?

If your URL can't be mapped to a pattern that React Router can recognize, do not worry,
we have got you covered! There is a second extension point in Front-Commerce that allows you to achieve this: the `Dispatcher`.

[You can learn more about it in our advanced documentation.](../advanced/theme/route-dispatcher.html)
