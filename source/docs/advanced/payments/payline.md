---
id: payline
title: Monext Online integration
description: This guide explain how Front-Commerce allows to use Monext Online (Payline) in a headless commerce project.
---

There is only one way to accept payments with [Monext Online (Payline)](https://www.monext.fr/online) in your Front-Commerce application for now.

## Magento1 module

<blockquote class="feature--new">
  _This feature has been added in versions: Front-Commerce `2.5.0`_
</blockquote>

<blockquote class="note">
**Note** This integration is aimed at being transparent for administrators and developers. That is why we haven't duplicated documentation from existing Magento resources. Please <span class="intercom-launcher">[contact us](mailto:support@front-commerce.com)</span> if you need further assistance.
</blockquote>

Front-Commerce for Magento 1 requires a [`FrontCommerce_Payline` module](https://github.com/front-commerce/magento1-module-payline-front-commerce) that turns the [Monext Payline official Magento 1 extension](https://docs.monext.fr/display/DT/Plugin+Magento+1) into a headless payment method for Front-Commerce. It is aimed at being transparent for Magento administrators and developers while allowing for a better Customer experience in a Front-Commerce application.

This integration is slightly different from [traditional Magento1 headless payments](/docs/magento1/headless-payments.html) in that sense that it contains a "companion component" in Front-Commerce. The component allows to get payment information from the checkout page. No redirection to Payline is involved (except for 3DS or PayPal authentication), the Customer remains on the Front-Commerce store.

Here is how to set this payment method up.

### Install and configure the `Monext_Payline` Magento1 extension

Follow [Monext Payline's documentation](https://docs.monext.fr/display/DT/Plugin+Magento+1) to install and configure the official Magento1 extension. You should configure it in a standard fashion.

### Install the `FrontCommerce_Payline` Magento1 extension

Turn Monext Online (Payline) into a headless payment method by installing [Front-Commerce's `FrontCommerce_Payline` module](https://github.com/front-commerce/magento1-module-payline-front-commerce). No configuration is needed.

```shell
composer require front-commerce/magento1-module-payline
```

<blockquote class="note">
**Note** If your project does not use composer, you can also use [modman](https://github.com/colinmollenhour/modman) or download the latest module version and copy files in your project.
</blockquote>

### Register the Payline for Magento 1 payment module in Front-Commerce

In your Front-Commerce application:

```diff
// .front-commerce.js
-  modules: [],
+  modules: ["./node_modules/front-commerce/modules/payment-payline-magento1"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento1", path: "server/modules/magento1" }
+    { name: "Magento1", path: "server/modules/magento1" },
+    {
+      name: "Payline",
+      path: "payment-payline-magento1/server/modules/payment-payline",
+    }
   ],
   webModules: [
```

### Register the Payline payment component

1. Override the file that lets you register additional payments forms in Front-Commerce

```
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```

2. Register Payline

```diff
+import PaylineMagento1 from "./PaylineMagento1";

const ComponentMap = {
+  PaylineCPT: PaylineMagento1,
};
```

### Update your CSPs

To allow loading Monext Online (Payline) related remote resources:

```diff
// my-module/config/website.js
  contentSecurityPolicy: {
    directives: {
-      scriptSrc: [],
-      frameSrc: [],
-      styleSrc: [],
-      imgSrc: [],
-      connectSrc: [],
-      fontSrc: [],
+      scriptSrc: [
+        "*.cdn.payline.com",
+        "pixel.cdnwidget.com",
+      ],
+      frameSrc: ["*.cdn.payline.com"],
+      styleSrc: ["*.cdn.payline.com"],
+      imgSrc: [
+        "*.cdn.payline.com",
+        "*.cdnwidget.com",
+      ],
+      connectSrc: ["*.payline.com"],
+      fontSrc: ["*.cdn.payline.com", "maxcdn.bootstrapcdn.com"],
      baseUri: []
    }
  },
```

### That's it!

You can now configure the Magento extension to use the ["HOMO" Environment](https://docs.monext.fr/display/DT/Plugin+Magento+1#PluginMagento1-Commonsettings/Param%C3%A8trescommuns) and [test the integration](https://docs.monext.fr/display/DT/Les+cartes+de+test)
