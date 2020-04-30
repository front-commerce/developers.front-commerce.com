---
id: meta-modules
title: Meta modules
---

We recommend to keep your GraphQL modules small and focused on a single feature.

If several teams are working on the project, small modules are a way to
[federate the graph implementation](https://principledgraphql.com/integrity#2-federated-implementation).
It also makes it easier to change implementations and service providers later in
the project. For instance you could replace a `Magento2/Cms` module with a
`Wordpress/Cms` one without impacting the web application (as long as both
schema shares a common API).

But **having a lot of different modules could make distribution more tedious**.
That is why Front-Commerce supports the concept of « meta modules », which are a
way to group smaller modules together.

## Using a meta module

**TL;DR: there is no difference between using a meta module and a _normal_
module!**

Let’s illustrate meta module by analyzing how
[Front-Commerce’s Magento2 integration](/docs/magento2/overview.html) can be registered in your
project.

If your Front-Commerce application is aimed at being a PWA frontend for a
monolithic Magento2 instance, then it is only a one line change to get all the
features:

```diff
// .front-commerce.js
module.exports = {
  name: "Front-Commerce",
  url: "https://www.front-commerce.test",
  modules: [],
  serverModules: [
-    { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" }
+    { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
+    { name: "Magento2", path: "server/modules/magento2" }
  ]
};
```

Under the hood, it imports several GraphQL modules at once (`Magento2/Cms`,
`Magento2/Catalog`, `Magento2/Checkout`, `Magento2/Search`…).

## How to define a meta module

For a module to be considered as a meta module, you need to expose a list of
submodules in the
[`modules`](/docs/reference/graphql-module-definition.html#modules-optional) key
of the module definition (along with the namespace).

Here is an example from Magento2 meta module definition:

```js
// node_modules/front-commerce/src/server/modules/magento2/index.js
import Cart from "./cart";
// […]

export default {
  namespace: "Magento2",
  modules: [
    Cart
    // […]
  ]
};
```
