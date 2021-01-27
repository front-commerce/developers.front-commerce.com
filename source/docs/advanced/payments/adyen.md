---
id: adyen
title: Adyen integration
---

This page contains information about the different ways you can accept payments with [Adyen](https://www.adyen.com/) in your Front-Commerce application.

## Magento2 module

<blockquote class="feature--new">
  _Since version 2.3.0 (developer preview since 2.1.0)_
</blockquote>

<blockquote class="note">
**Note** This integration is aimed at being transparent for administrators and developers. That is why we haven't duplicated documentation from existing Magento resources. Please [contact us](mailto:contact@front-commerce.com) if you need further assistance.
</blockquote>

Front-Commerce is compatible with [Adyen's official Magento module PWA storefront integration](https://docs.adyen.com/plugins/magento-2/magento-pwa-storefront) in its native version.

This integration is slightly different from [traditional Magento2 headless payments](/docs/magento2/headless-payments.html) in that sense that it contains a "companion component" in Front-Commerce. The component allows to display and Authorize payments from the checkout page, using [Adyen's Web Drop-in integration](https://docs.adyen.com/checkout/drop-in-web) on the front-end. No redirection to other payment platform is involved unless its absolutely necessary, the Customer remains on the Front-Commerce store.

Here is how to set this payment method up.

### Install and configure the `Adyen_Payment` Magento2 extension (6.5+)

Follow [Adyen's documentation](https://docs.adyen.com/plugins/magento-2) to install and configure the official Magento2 extension for Adyen payments. The minimum supported version is [6.5.0](https://github.com/Adyen/adyen-magento2/releases/tag/6.5.0).

You must configure the "Payment Origin URL" in the "Advanced: PWA" with your Front-Commerce URL **for each of your stores**.

<blockquote class="important">
**IMPORTANT** please note that enabling or disabling payments in Magento's admin area has no effect on payment methods visible on the storefront. This is a *feature* from the module: every active payment methods in Adyen will be available. **You either have to filter them in the frontend or from your Adyen account.**
</blockquote>

### Register the Adyen for Magento2 payment module in Front-Commerce

In your Front-Commerce application:

```diff
// .front-commerce.js
-  modules: [],
+  modules: ["./node_modules/front-commerce/modules/payment-magento2-adyen"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    {
+      name: "Magento2Adyen",
+      path: "payment-magento2-adyen/server/modules/payment-magento2-adyen",
+    }
   ],
   webModules: [
-    { name: "FrontCommerce", path: "front-commerce/src/web" }
+    { name: "FrontCommerce", path: "front-commerce/src/web" },
+    {
+      name: "Magento2Adyen",
+      path: "front-commerce/modules/payment-magento2-adyen/web",
+    }
   ]
```
### Register your Adyen payment components

<blockquote class="note">
**NOTE** this is a temporary way to setup payment components. We are aware that it is tedious. It will definitely change in the future, when Front-Commerce will support new extension points for Payments.
</blockquote>

1. Override the file that lets you register additional payments forms in Front-Commerce
```
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```
2. Register Adyen
```diff
+import Magento2AdyenCheckout from "./Magento2AdyenCheckout";

const ComponentMap = {};

const getAdditionalDataComponent = (method) => {
+  if (method.code.startsWith("adyen_")) {
+    return Magento2AdyenCheckout;
+  }
  return ComponentMap[method.code];
};
```
3. Override the file that lets you register additional payments actions in Front-Commerce
```
mkdir -p my-module/web/theme/modules/Checkout/PlaceOrder
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/PlaceOrder/getAdditionalActionComponent.js my-module/web/theme/modules/Checkout/PlaceOrder/getAdditionalActionComponent.js
```
4. Register the Adyen action
```diff
import None from "./AdditionalAction/None";
+import Magento2Adyen from "./AdditionalAction/Magento2Adyen";

const ComponentMap = {};

const getAdditionalActionComponent = (paymentCode, paymentAdditionalData) => {
+  if (paymentCode.startsWith("adyen")) {
+    return Magento2Adyen;
+  }
  return ComponentMap?.[paymentCode] ?? None;
};
```
5. register [custom Flash message components](/docs/advanced/features/flash-messages.html#Create-custom-flash-message-components) to display payment messages in an optimized way (**recommended**)
```
mkdir -p my-module/web/theme/modules/FlashMessages
cp -u node_modules/front-commerce/src/web/theme/modules/FlashMessages/getFlashMessageComponent.js my-module/web/theme/modules/FlashMessages/getFlashMessageComponent.js
```
  and
```diff
import React from "react";
import {
  InfoAlert,
  ErrorAlert,
  SuccessAlert,
} from "theme/components/molecules/Alert";
import { BodyParagraph } from "theme/components/atoms/Typography/Body";
+ import {
+   AdyenPaymentSuccess,
+   AdyenPaymentError,
+ } from "theme/modules/Adyen/FlashMessage";

// […]
const ComponentMap = {
  default: makeAlertMessageComponent(InfoAlert),
  info: makeAlertMessageComponent(InfoAlert),
  error: makeAlertMessageComponent(ErrorAlert),
  success: makeAlertMessageComponent(SuccessAlert),
+  adyenSuccess: AdyenPaymentSuccess,
+  adyenError: AdyenPaymentError,
};
```

### Update your CSPs

<blockquote class="important">
**IMPORTANT** CSPs can cause issues with some 3DS2 authentication mechanisms. Please check with the Adyen support if there are known workarounds. **Otherwise you may have to disable CSP altogether.**
</blockquote>

To allow loading Adyen related remote resources:

```diff
// my-module/config/website.js
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [],
-      frameSrc: [],
+      frameSrc: ["*.adyen.com"],
      styleSrc: [],
-      imgSrc: [],
+      imgSrc: ["*.adyen.com"],
-      connectSrc: [],
+      connectSrc: ["*.adyen.com"],
      baseUri: []
    }
  },
```

### Register custom styles (optional)

Developers can [customize Adyen drop-in UI styles using CSS](https://docs.adyen.com/checkout/drop-in-web/customization).

You can add an optional stylesheet from Front-Commerce in your application to customize styles. The provided stylesheet reuses existing styles from the theme as much as possible for a good integration by default. You can override it if needed to adapt the UI as wanted.

Add the following line to your `web/theme/modules/_modules.scss` file to load these styles:
```scss
@import "~theme/modules/Adyen/dropinCustomizations";
```

### That's it!

You can now configure the Magento extension to use a Test mode and [test the integration](https://docs.adyen.com/development-resources/test-cards/test-card-numbers)

<blockquote class="note">
Please keep in mind that Adyen payment methods depends on the Customer country, the Cart amount and the Store currency. Different contexts could display different payment methods in the checkout.
</blockquote>