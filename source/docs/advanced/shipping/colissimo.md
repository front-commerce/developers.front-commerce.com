---
id: colissimo
title: Colissimo integration
---

This page contains information about the different ways you can accept payments with [Affirm](https://www.affirm.com/) in your Front-Commerce application.

## Magento2 module

<blockquote class="feature--new">
_Since version 2.5.0_
</blockquote>

The integration of Colissimo in Magento 2 & Front-Commerce relies on [Magentix's module](https://colissimo.magentix.fr/magento-2/) for pickup points. If you don't need pickup points, any module should be supported by default.

### Installation

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
+  modules: ["./modules/shipping-colissimo-magento2"],
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },
    { name: "Magento2", path: "server/modules/magento2" },
+    {
+      name: "Colissimo",
+      path: "shipping-colissimo-magento2/server/modules/colissimo",
+    },
  ],
  webModules: [
    { name: "FrontCommerce", path: "./src/web" },
  ],
};
```

- Import styles of Colissimo by overriding the `_modules.scss`

```diff
// src/web/theme/modules/_modules.scss

+@import "~theme/modules/Colissimo/Colissimo";
```

- Import Colissimo component in by overriding the getAdditionalDataComponent used for Shipping methods

```diff
// src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js

+import Colissimo from "theme/modules/Colissimo";

const ComponentMap = {
+  colissimo: {
+    pickup: Colissimo,
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
