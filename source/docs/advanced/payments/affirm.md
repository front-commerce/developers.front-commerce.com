---
id: affirm
title: Affirm integration
---

This page contains information about the different ways you can accept payments with [Affirm](https://www.affirm.com/) in your Front-Commerce application.

## Magento2 module

<blockquote class="feature--new">
  _This feature has been added in versions: Front-Commerce `2.1.0`, Front-Commerce's Magento2 module `2.1.0`_
</blockquote>

<blockquote class="note">
**Note** This integration is aimed at being transparent for administrators and developers. That is why we haven't duplicated documentation from existing Magento resources. Please <span class="intercom-launcher">[contact us](mailto:support@front-commerce.com)</span> if you need further assistance.
</blockquote>

Front-Commerce for Magento2 contains a `FrontCommerce_HeadlessAffirm` module that turns the [Affirm's official Magento extension](https://github.com/Affirm/Magento2_Affirm) into a headless payment method for Front-Commerce. It is aimed at being transparent for Magento administrators and developers while allowing for a better Customer experience in a Front-Commerce application.

This integration is slightly different from [traditional Magento2 headless payments](/docs/magento2/headless-payments.html) in that sense that it contains a "companion component" in Front-Commerce. The component allows to Authorize payments from the checkout page. No redirection to Affirm is involved, the Customer remains on the Front-Commerce store.

Here is how to set this payment method up.

### Install and configure the `Astound_Affirm` Magento2 extension

Follow [Affirm's documentation](https://docs.affirm.com/affirm-developers/docs/magento-2) to install and configure the official Magento2 extension for Affirm payments. You only need to follow steps `1.` and `2.` since other storefront features are not relevant in a headless context.

You have to **configure the `Checkout Flow Type` to `Modal`** (instead of `Redirect`).

### Enable the `FrontCommerce_HeadlessAffirm` Magento2 extension

Turn Affirm into a headless payment method by enabling Front-Commerce's `HeadlessAffirm` module. No configuration is needed.

```shell
php bin/magento module:enable FrontCommerce_HeadlessAffirm
php bin/magento setup:upgrade
php bin/magento setup:di:compile
```

<blockquote class="note">
**Note** If the `FrontCommerce_HeadlessAffirm` is not detected by your Magento installation, please ensure that you are using a Front-Commerce module version `> 2.1.0`. Otherwise, you must first update your dependencies.
</blockquote>

### Register the Affirm for Magento2 payment module in Front-Commerce

In your Front-Commerce application:

```diff
// .front-commerce.js
   modules: [],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "Magento2Affirm", path: "server/modules/payment-magento2-affirm" },
   ]
```

### Register your Affirm payment component

1. Override the file that lets you register additional payments forms in Front-Commerce

```
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```

2. Register Affirm

```diff
+import Affirm from "./Affirm";

const ComponentMap = {
+  affirm_gateway: Affirm,
};
```

### Update your CSPs

To allow loading Affirm related remote resources:

```diff
// my-module/config/website.js
  contentSecurityPolicy: {
    directives: {
-      scriptSrc: [],
-      frameSrc: [],
+      scriptSrc: ["*.affirm.com"],
+      frameSrc: ["*.affirm.com"],
      styleSrc: [],
      imgSrc: [],
-      connectSrc: [],
+      connectSrc: ["*.affirm.com"],
      baseUri: []
    }
  },
```

### That's it!

You can now configure the Magento extension to use a Sandbox mode and [test the integration](https://docs.affirm.com/affirm-developers/docs/test-and-go-live)

<blockquote class="note">
Please keep in mind that Affirm is only available for US addresses and orders placed in a store using the `USD` as main currency.
</blockquote>
