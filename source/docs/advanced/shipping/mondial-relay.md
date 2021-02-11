---
id: mondial-relay
title: Mondial Relay integration
---

This page contains information about the different ways you can ship orders with [Mondial Relay](https://www.mondialrelay.fr/) in your Front-Commerce application.

## Magento1 module

<blockquote class="feature--new">
_Since version 2.5.0_
</blockquote>

The integration of Colissimo in Magento 1 & Front-Commerce relies on [man4x's module](https://github.com/OpenMageModuleFostering/man4x_mondialrelay) for pickup points.

## Installation

1. Install necessary dependencies :

```shell
npm i leaflet@^1.7 react-leaflet@^3.0
```

2. Use the module in your .front-commerce.js

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

3. Import styles

```diff
// src/web/theme/modules/_modules.scss

+@import "~theme/modules/MondialRelay/MondialRelay";
```

4. Import Mondialrelay component in Shipping additionalData component

```diff
// src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js

+import MondialRelay from "theme/modules/MondialRelay";

const ComponentMap = {
+  "24R": {
+    mondialrelaypickup: MondialRelay,
+  },
};

```

5. Allow OpenStreetMap tile loading in the Content Security Policies

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
