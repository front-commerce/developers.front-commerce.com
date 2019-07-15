---
id: add-new-attribute
title: Add a new attribute
---

Let's say we want to add a new element to display on a product's page (for instance, a product's rate). You will have to:

1. Add the attribute's actual value to your database.
2. Create a new module.
3. Define the schema, implement the resolver and display it on screen.

## Add a value to your database.

The process to do so may vary with the backend software you are using. For Magento 2 (used in this example), you can refer to [this](https://www.fastcomet.com/tutorials/magento2/product-attributes).

## Create a new GraphQL module

We want to add a **User rate** feature to a product page. This feature will be stored in a new module called `mymodule` ; you could directly edit the files at `node_modules/front-commerce/path/to/something`, but this is deprecated.
Learn more about Front-Commerce's folder structure [here](/docs/concepts/front-commerce-folder-structure.md).

```bash
mkdir mymodule
cd mymodule
```

In this example, the files we are going to override are located at `node_modules/front-commerce/src/web/theme/modules/ProductView/Synthesis/`, so will create in our `mymodule` folder the following directories:

```bash
mkdir -p server/modules/acme
```

(Note that the `acme` name has been chosen arbitrarily.)

### Expand the Product definition

Create a file named `schema.gql` and type in the following code. It means that we are expanding the definition of a product : it can now be rated.

```js
// mymodule/server/modules/acme/schema.gql
extend type Product {
  rate: String
}
```

### Implement the resolver

We must now define what Front-Commerce should fetch when `rate` is requested in a GraphQL query ; in other words we must write the code that will **resolve** the queries for the rates.

Create a file named `resolvers.js` and type in the following code. It implements the resolver.

```js
// mymodule/server/modules/acme/resolvers.js
export default {
  Product: {
    rate: parent => {
      return parent.rate;
    }
  }
};
```

### Index our changes

aaaaa

If we want our code to be taken into account when the module is loaded, we must index it.

Create a file named `index.js` and type in the following code. It indexes the schema and the resolver from earlier.

```js
// mymodule/server/modules/acme/index.js
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";

export default {
  namespace: "Acme",
  typeDefs: typeDefs,
  resolvers: resolvers
};
```

### Overriding the files

In **this** example, the files to be overridden are `ProductSynthesisFragment.gql` and `Synthesis.js` both located at `node_modules/front-commerce/src/web/theme/modules/ProductView/Synthesis/`. Copy and paste them into your folder.

### Making the query

In `ProductSynthesisFragment;gql`, add the following query line. It means that the application will request the `rate` field as well when sending the query. (Depending on the version of Front-Commerce you are using, the content might differ slightly.)

```diff
#import "theme/components/organisms/Configurator/ProductConfiguratorFragment.gql"
#import "theme/modules/AddToCart/ProductStockFragment.gql"
#import "theme/components/atoms/Typography/Price/ProductPriceFragment.gql"
#import "theme/modules/ProductView/Details/ProductDetailsFragment.gql"

fragment ProductSynthesisFragment on Product {
  sku
  name
  ...ProductPriceFragment
  description
+ rate
  ...ProductConfiguratorFragment
  ...ProductStockFragment
  ...ProductDetailsFragment
  configurations {
    product {
      sku
      ...ProductPriceFragment
    }
  }
}
```

### Displaying the result on screen

We're almost there! In the file `Synthesis.js` (which generates the product page), you can add some code to display the `rate`. Knowing React.js or at least HTML syntax is necessary to perform this step without screwing the other items on the page.

```js
// Many more things here
const ProductSynthesis = props => {
  const {
    product
    // Many more things here
  } = props;
  return (
    <div className="product__synthesis">
      {/* Many more things here */}
      <p>Rate: {product.rate} / 5</p>
      {/* Many more things here */}
    </div>
  );
};

export default ProductSynthesis;
```

## Add the module

Last step: adding the module we just made to Front-Commerce. Edit the `.front-commerce.js` file (root folder) as shown below to do so:

```diff
module.exports = {
  name: "Front Commerce Skeleton",
  url: "http://localhost:4000",
- modules: ["./src"],
+ modules: ["./mymodule", "./src"],
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },
    { name: "Magento2", path: "server/modules/magento2" },
+   { name: "Acme", path: "./mymodule/server/modules/acme" }
  ]
};

```

## Additional note

This page has been redacted by an intern, who is also a rookie in React, GraphQL, Front-Commerce, and Web development in general. Please, don't be mad at me, I did my best! :)
