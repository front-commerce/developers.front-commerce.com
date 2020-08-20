---
id: adyen
title: Adyen integration
---

This page contains information about the different ways you can accept payments with [Adyen](https://www.adyen.com/) in your Front-Commerce application.

## Magento2 module

<blockquote class="feature--new">
  **DEVELOPER PREVIEW** _This feature is currently in **developer preview** since Front-Commerce `2.1.0`. It is planned to be **production ready** in a next release (`2.3.0` hopefully). Some APIs may evolve by then._
</blockquote>

<blockquote class="note">
**Note** This integration is aimed at being transparent for administrators and developers. That is why we haven't duplicated documentation from existing Magento resources. Please [contact us](mailto:contact@front-commerce.com) if you need further assistance.
</blockquote>

Front-Commerce is compatible with [Adyen's official Magento module PWA storefront integration](https://docs.adyen.com/plugins/magento-2/magento-pwa-storefront) in its native version.

This integration is slightly different from [traditional Magento2 headless payments](/docs/magento2/headless-payments.html) in that sense that it contains a "companion component" in Front-Commerce. The component allows to display and Authorize payments from the checkout page, using [Adyen's Web Drop-in integration](https://docs.adyen.com/checkout/drop-in-web) on the front-end. No redirection to other payment platform is involved unless its absolutely necessary, the Customer remains on the Front-Commerce store.

Here is how to set this payment method up.

### Install and configure the `Adyen_Payment` Magento2 extension

Follow [Adyen's documentation](https://docs.adyen.com/plugins/magento-2) to install and configure the official Magento2 extension for Adyen payments.

<blockquote class="important">
**IMPORTANT** please note that enabling or disabling payments in Magento's admin area has no effect on payment methods visible on the storefront. This is a *feature* from the module: every active payment methods in Adyen will be available. **You either have to filter them in the frontend or from your Adyen account.**
</blockquote>

### Register the Adyen for Magento2 payment module in Front-Commerce

In your Front-Commerce application:

```diff
// .front-commerce.js
   modules: [],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "Magento2Adyen", path: "server/modules/payment-magento2-adyen" },
   ]
```

### Define the `FRONT_COMMERCE_ADYEN_TMP_ORIGIN_KEY` environment variable

As a temporary way to configure the Web Drop-in, you must configure the Origin key for your domain using the `FRONT_COMMERCE_ADYEN_TMP_ORIGIN_KEY` variable in your `.env` file. See [Adyen's documentation page explaining how to get your client key](https://docs.adyen.com/user-management/client-side-authentication#get-your-client-key).

<blockquote class="note">
**NOTE** This is a temporary variable that might not be needed anymore in 2.3.0… so don't overengineer its definition!
</blockquote>

### Register your Adyen payment component

1. Override the file that lets you register additional payments forms in Front-Commerce
```
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```
2. Register Adyen
```diff
+import Magento2AdyenCheckout from "./Magento2AdyenCheckout";

const ComponentMap = {
+  adyen_cc: Magento2AdyenCheckout,
+  adyen_hpp: Magento2AdyenCheckout,
};
```

<blockquote class="note">
**NOTE** this is a temporary way to setup this checkout component. It will definitely change in the next version, when Front-Commerce will support new extension points for Payments.
</blockquote>

### Update your CSPs

To allow loading stripe related remote resources:

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
      connectSrc: [],
      baseUri: []
    }
  },
```

### That's it!

You can now configure the Magento extension to use a Test mode and [test the integration](https://docs.adyen.com/development-resources/test-cards/test-card-numbers)

<blockquote class="note">
Please keep in mind that Adyen payment methods depends on the Customer country, the Cart amount and the Store currency. Different contexts could display different payment methods in the checkout.
</blockquote>