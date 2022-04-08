---
id: mondial-relay
title: Mondial Relay integration
---

This page contains information about the different ways you can ship orders with [Mondial Relay](https://www.mondialrelay.fr/) in your Front-Commerce application.

## Prerequisites

No matter the backend solution, the MondialRelay Front-Commerce modules requires a Map component to display pickup points. Thus, before proceeding, please make sure that you've chosen a Map implementation from [Display a map](/docs/advanced/features/display-a-map.html).

## Integrate with Magento2

<blockquote class="feature--new">
_Since version 2.10.0_
</blockquote>

The integration of MondialRelay in Magento2 & Front-Commerce relies on [Magentix' module](https://mondialrelay.magentix.fr/fr/magento-2/) for pickup points. So you first need to [install and configure this module (at least the version 100.10.7)](https://mondialrelay.magentix.fr/fr/magento-2/documentation.html).

Then, within your Front-Commerce project, you have to:

- Use the module in your `.front-commerce.js`

```diff
  // .front-commerce.js
  module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: [
+ "./node_modules/front-commerce/modules/shipping-mondialrelay"
  "./src"
  ],
  serverModules: [
  { name: "FrontCommerce", path: "server/modules/front-commerce" },
  { name: "Magento2", path: "server/modules/magento2" },
+ {
+     name: "MondialRelay",
+     path: "shipping-mondialrelay/server/modules/magento2-mondialrelay",
+ },
  ],
  webModules: [
  { name: "FrontCommerce", path: "./src/web" },
  ],
  };
```

- Import styles of MondialRelay related components by overriding the `_modules.scss`

```diff
// src/web/theme/modules/_modules.scss

+@import "~theme/modules/MondialRelay/MondialRelay";
```

- Import MondialRelay component in by overriding the [`getAdditionalDataComponent`](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js) used for Shipping methods

```diff
// src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js
+import MondialRelay from "theme/modules/MondialRelay";

const ComponentMap = {
+ mondialrelay: {
+   pickup: MondialRelay,
+ }
};
```

## Integrate with Magento1

<blockquote class="feature--new">
_Since version 2.5.0_
</blockquote>

The integration of MondialRelay in Magento1 & Front-Commerce relies on [man4x's module](https://github.com/OpenMageModuleFostering/man4x_mondialrelay) for pickup points. You will also need the [front-commerce/mondialrelay-magento1-module](https://github.com/front-commerce/magento1-module-mondialrelay-front-commerce) for extra endpoints needed in Front-Commerce.

So you first need to install and configure those modules.

Then, within your Front-Commerce project, you have to:

- Use the module in your `.front-commerce.js`

```diff
// .front-commerce.js
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: [
+   "./node_modules/front-commerce/modules/shipping-mondialrelay"
    "./src"
  ],
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },
    { name: "Magento1", path: "server/modules/magento1" },
+   {
+     name: "MondialRelay",
+     path: "shipping-mondialrelay/server/modules/magento1-mondialrelay",
+   },
  ],
  webModules: [
    { name: "FrontCommerce", path: "./src/web" },
  ],
};
```

- Import styles of Mondial Relay by overriding the `_modules.scss`

```diff
// src/web/theme/modules/_modules.scss
+@import "~theme/modules/MondialRelay/MondialRelay";
```

- Import MondialRelay component in by overriding the [`getAdditionalDataComponent`](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js) used for Shipping methods

```diff
// src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js

+import MondialRelay from "theme/modules/MondialRelay";

const ComponentMap = {
+  "24R": {
+    mondialrelaypickup: MondialRelay,
+  },
};
```

After following this guide, customers will be able to choose MondialRelay as a shipping method and will be able to choose a pickup point on a map.
