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

3. Import styles

```diff
// src/web/theme/modules/_modules.scss

+@import "~theme/modules/Colissimo/Colissimo";
```

4. Import Colissimo component in Shipping additionalData component

```diff
// src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js

+import Colissimo from "theme/modules/Colissimo";

const ComponentMap = {
+  colissimo: {
+    pickup: Colissimo,
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
