---
id: extend-the-theme
title: Extend the theme
---

## Understanding theme overrides

Front-Commerce web application is a fully featured e-commerce [universal](https://cdb.reacttraining.com/universal-javascript-4761051b7ae9)
React application aimed at providing a sane base for your own theme.
Even though you could reuse pages and components individually in a totally different theme,
most of the time you might find easier and faster to start with the base theme and
iterate from there.

**Theme override is the mechanism allowing to extend, adapt, rewrite almost everything contained in the base theme.** It is what allows you to:

- customize the base theme,
- customize how an extension is displayed,
- upgrade Front-Commerce and benefit from the latest component improvements,
- or create a slightly different theme for the Black Friday in confidence!

Having an understanding of [themes in Magento](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/templates/template-overview.html), [child themes in Wordpress](https://developer.wordpress.org/themes/advanced-topics/child-themes/) / [Prestashop](https://devdocs.prestashop.com/1.7/themes/reference/template-inheritance/parent-child-feature/), [templates override in Drupal](https://www.drupal.org/docs/8/theming/twig/working-with-twig-templates), [themes in CakePHP](https://book.cakephp.org/3.0/en/views/themes.html) will help you understand Front-Commerce’s theme overrides because they all share the same philosophy.
If you have no previous experience with these other implementations, let’s see how it works!

Your own theme will be located in its own folder and will use default components from
parent theme(s) — at least from Front-Commerce base theme.
You would then copy the files you want to override in your theme folder by maintaining
an identical file structure.
Your component will then be used instead of the one in your parent theme(s).

This translates in those three steps:

1. configure your custom theme and use it in your application
2. copy the file (`js`, `scss` or `gql`) you want to override in the `theme` folder of your module
3. customize its content in your module directory

## Configure your custom theme and use it in your application

First, we need to create a minimalist module that will contain your own theme by creating the following file structure (for instance at the root of your project):

```
my-module
└── web
    └── theme
```

Then, we need to tell Front-Commerce that this module exists in your [`.front-commerce.js`](/docs/reference/front-commerce-js.html) file. If the module has been created at the root of your project, it would look like this:

```diff
module.exports = {
  name: "Front Commerce",
  url: "http://www.front-commerce.test",
- modules: ["./src"],
+ modules: ["./src", "./my-module"],
  serverModules: [
    // ...
  ]
};
```

Restart the application.
That’s it! You have successfully registered the module in your Front-Commerce application.

## Override a component

Let's add the description of a `Product` to a `ProductItem` as an example of overriding the base theme.

The original file is: [`node_modules/front-commerce/src/web/theme/modules/ProductView/ProductItem/ProductItem.js`](https://gitlab.com/front-commerce/front-commerce/blob/main/src/web/theme/modules/ProductView/ProductItem/ProductItem.js)

<blockquote class="info">
Please refer to the [Front-Commerce’s folder structure documentation page](/docs/concepts/front-commerce-folder-structure.html) to get a better
understanding of how components are organized in the base theme.
</blockquote>

1. copy it to: `my-module/web/theme/modules/ProductView/ProductItem/ProductItem.js`
2. add the description after the `<ProductOverview />` component in your `ProductItem` with `{this.props.description}`.

**But you are not done yet!**
The `description` information is not included in the GraphQL fields fetched by the application in the base theme.
You will thus need to update the fragment related to `ProductItem`.

The original fragment file is collocated with the original component at: [`node_modules/front-commerce/src/web/theme/modules/ProductView/ProductItem/ProductItemFragment.gql`](https://gitlab.com/front-commerce/front-commerce/blob/main/src/web/theme/modules/ProductView/ProductItem/ProductItemFragment.gql)

1. copy it to: `my-module/web/theme/modules/ProductView/ProductItem/ProductItemFragment.gql`
2. add the field `description` to the fragment.

```diff
// my-module/web/theme/modules/ProductView/ProductItem/ProductItemFragment.gql
 fragment ProductItemFragment on Product {
   path
   name
+  description
   ...ProductPriceFragment
   imageUrl
   sku
```

3. restart the application

The data will now be fetched from GraphQL every time the `ProductItem` is used (product listings, upsells…) and will be available for you to render it as wanted.

<blockquote class="warning">
**Important:** in development mode, you MIGHT need to restart the application for the override to be detected.
The tools used to provide the override feature do not detect automatically that you're trying to override a file yet. This is an upcoming improvement, see [#63](https://gitlab.com/front-commerce/front-commerce/issues/63) for further information.
</blockquote>

### Reuse the original component

<blockquote class="feature--new">
_New in version 1.0.0-alpha.1:_ importing a base Front-Commerce element instead of its override was added in 1.0.0-alpha.1 to help in specific cases.
</blockquote>

Front-Commerce has been designed with small components having a single responsibility.
**We believe that theme overrides should cover most of your use cases**.
For some features though, it appeared that reusing the base component could be really useful.
For instance, if you want to add a small feature or wrapper without changing the core feature of a component.

It is possible to import a component from the `front-commerce` node module in a standard way,
as you would import components from other libraries.

<blockquote class="note">
**Use with care!** We don't think that this method should be the default one, because it can make your updates more painful.
</blockquote>

In the file that we've created in the previous section, instead of copying the original source file you could set it up like this:

```jsx
// my-module/web/theme/modules/ProductView/ProductItem/ProductItem.js
import React from "react";
import BaseProductItem from "front-commerce/src/web/theme/modules/ProductView/ProductItem/ProductItem.js";

const ProductItem = props => (
  <div>
    {/* Add your feature here */}
    <BaseProductItem {...props} />
  </div>
);

export default ProductItem;
```
