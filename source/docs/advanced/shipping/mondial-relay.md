---
id: mondial-relay
title: Mondial Relay integration
---

This page contains information about the different ways you can ship orders with [Mondial Relay](https://www.mondialrelay.fr/) in your Front-Commerce application.

## Magento1 module

<blockquote class="feature--new">
_Since version 2.5.0_
</blockquote>

The integration of Magento in Magento 1 & Front-Commerce relies on [man4x's module](https://github.com/OpenMageModuleFostering/man4x_mondialrelay) for pickup points.

You will also need the [front-commerce/mondialrelay-magento1-module](https://github.com/front-commerce/magento1-module-mondialrelay-front-commerce) for extra endpoints needed in Front-Commerce.

## Installation

- Install necessary dependencies :

```shell
npm install leaflet@^1.7 react-leaflet@^3.0
```

- Use the module in your .front-commerce.js

```diff
// .front-commerce.js
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
+  modules: ["./modules/shipping-mondialrelay-magento1"],
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },
    { name: "Magento1", path: "server/modules/magento1" },
+    {
+      name: "MondialRelay",
+      path: "shipping-mondialrelay-magento1/server/modules/mondialrelay",
+    },
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

- Import MondialRelay component in by overriding the getAdditionalDataComponent used for Shipping methods

```diff
// src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js

+import MondialRelay from "theme/modules/MondialRelay";

const ComponentMap = {
+  "24R": {
+    mondialrelaypickup: MondialRelay,
+  },
};
```

- Allow OpenStreetMap tile loading in the Content Security Policies

```diff
// src/config/website.js

  // [...]
  contentSecurityPolicy: {
      // [...]
      imgSrc: [
        // [...]
+        "*.openstreetmap.org",
      ],
      // [...]
  }
  // [...]
```
