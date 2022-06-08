---
id: change-resolver-behavior
title: Change a resolver behavior
description: In a project, it is quite usual to have the need to change the implementation of the resolver associated with a GraphQL field. This page explains how to do it properly so that the project remains as maintenable as possible.
---

As an example, we will change the way the Product `meta_description` field value is generated.

## Create dedicated GraphQL module

First, you have to create a GraphQL module. For that, you can follow the process detailed in the [Create a new GraphQL module](/docs/essentials/extend-the-graphql-schema.html#Create-a-new-GraphQL-module). Don't forget to also to [register the module in Front-Commerce](/docs/essentials/extend-the-graphql-schema.html#Register-the-module-in-the-application).

For this example, this results in `src/server/modules/productmetadescription/index.js` containing:

```javascript
export default {
  namespace: "ProductMetaDescription",
};
```

## Set the module dependency

Before being able to inject you custom resolver logic, you first need to find the module that defines the resolver for the field. In our example, the Product `meta_description` is resolved [by the resolver provided by the `Magento2/Catalog/Products` module](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/server/modules/magento2/catalog/products/resolvers.js#L245-248). As a result, the `Magento2/Catalog/Products` module must be added as a dependency of our custom module:

```diff
export default {
  namespace: "ProductMetaDescription",
+ dependencies: ["Magento2/Catalog/Products"],
};
```

## Implement your custom resolver logic

Our custom module can now provide a resolver with a custom logic. In `src/server/modules/productmetadescription/index.js`:

```diff
+import resolvers from "./resolvers";
+
export default {
  namespace: "ChangeResolverBehavior",
  dependencies: ["Magento2/Catalog/Products"],
+ resolvers,
};
```

And the resolver could look like:

```javascript
export default {
  Product: {
    meta_description: (product) => {
      // your implementation here
      return "my custom description";
    },
  },
};
```

This custom resolver will now be merged with the existing ones and the `meta_description` will be resolved with our custom implementation instead of the default one.
