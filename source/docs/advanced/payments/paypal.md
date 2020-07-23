---
id: paypal
title: Paypal integration
---

This page contains information about the different ways you can accept payments with [Paypal](https://paypal.com/) in your Front-Commerce application.

## Front-Commerce Payment

This section explains how to configure and customize the Paypal Front-Commerce Payment module into an existing Front-Commerce application. The implementation use [Paypal Checkout Smart Payment Buttons](https://developer.paypal.com/docs/checkout/) to create payments.

### Configure your environment

You can find the Client ID and the Secret in your [Paypal Developer dashboard](https://developer.paypal.com/developer/applications), by creating and editing a REST API application. Please make sure to use the keys that match your environment.

`FRONT_COMMERCE_WEB_PAYPAL_ENV` can be either `sandbox` or `production`.

```diff
// .env
+# Paypal configuration
+FRONT_COMMERCE_WEB_PAYPAL_ENV=xxx
+FRONT_COMMERCE_WEB_PAYPAL_CLIENT_ID=xxx
+FRONT_COMMERCE_PAYPAL_SECRET=xxx
```

### Register the Paypal payment module

In your Front-Commerce application:

#### Magento2

```diff
// .front-commerce.js
   modules: [],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "Paypal", path: "server/modules/payment-paypal" }
   ]
```

#### Magento1

```diff
// .front-commerce.js
   modules: [],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento1", path: "server/modules/magento1" }
+    { name: "Magento1", path: "server/modules/magento1" },
+    { name: "Paypal", path: "server/modules/payment-paypal/index.magento1.js" }
   ]
```

### Register your Paypal payment component

1. Override the file that lets you register additional payments forms in Front-Commerce
```
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```
2. Register Paypal
```diff
+import PaypalButton from "./PaypalButton";

const ComponentMap = {
+  paypal_button: PaypalButton
};
```

### Update your CSPs

```diff
// my-module/config/website.js
  contentSecurityPolicy: {
    directives: {
-     scriptSrc: [],
+     scriptSrc: ["www.paypalobjects.com"],
      frameSrc: [],
      styleSrc: [],
-     imgSrc: [],
+     imgSrc: ["*.paypal.com"],
      styleSrc: [],
      imgSrc: [],
      connectSrc: [],
      baseUri: []
    }
  },
```

### Advanced: customize data sent to Paypal

<blockquote class="wip">
**Work In Progress** This advanced pattern must be documented with further details. While we are working on it, please [contact us](mailto:contact@front-commerce.com) if you need further assistance.
</blockquote>

The Paypal payment module is extensible. It leverages Front-Commerce's "data transform" pattern to allow developers to customize payloads sent to Paypal for Payer data and Payer units.

Both the payer data and payer units objects can be customized at application level. It allows to add additional metadata depending on your own logic. For this, you can use the `registerPayerDataTransform` and `registerPurchaseUnitsDataTransform` methods of the Paypal loader to add your custom transformers.

See the tests for an example (while a detailed documentation is being written):
* https://gitlab.com/front-commerce/front-commerce/-/blob/c1ca1ef8a60ecb545e2758d04a4d11577e764658/src/server/modules/payment-paypal/__pacts__/loaders.js#L230
* https://gitlab.com/front-commerce/front-commerce/-/blob/c1ca1ef8a60ecb545e2758d04a4d11577e764658/src/server/modules/payment-paypal/__pacts__/loaders.js#L281

## Magento2 module

<blockquote class="wip">
**Work In Progress** This integration is aimed at being transparent for administrators and developers. That is why we haven't duplicated documentation from existing Magento resources. Please [contact us](mailto:contact@front-commerce.com) if you need further assistance.
</blockquote>

Front-Commerce Magento2 module contains [headless payment adapters](/docs/magento2/headless-payments.html) for the **Paypal Express** payment method.

The Paypal module must be configured in a normal way, as for a non-headless Magento store.