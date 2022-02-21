---
id: payzen
title: PayZen / Lyra Collect integration
---

This page contains information about the different ways you can accept payments with [PayZen](https://payzen.eu/) or [Lyra Collect](https://www.lyra.com/lyra-collect/) in your Front-Commerce application.

- [Front-Commerce Payment](#Front-Commerce-Payment)
- [Magento2 module](#Magento2-module)

> **Note:** each integration method is independent from the others, meaning that you don't have to install additional modules on your eCommerce platform if using Front-Commerce payments.

## Front-Commerce Payment

This section explains how to configure and customize the PayZen Front-Commerce Payment module into an existing Front-Commerce application. The implementation use [PayZen embedded form / Javascript with REST API](https://payzen.io/fr-FR/rest/V4.0/javascript/) to create payments.

### Lyra Collect support

Lyra Collect is a payment solution that shares the same infrastructure and API with Payzen. In Front-Commerce, it is the exact same module that is used. The only differences are:

- the `FRONT_COMMERCE_PAYZEN_PRODUCT` environment variable (to be set to `lyra_collect`)
- the URLs to use when [updating your CSPs](#Update-your-CSPs) should be `api.lyra.com` instead of `static.payzen.eu`

### Configure your environment

Get your access keys by following the [Payzen documentation](https://payzen.io/fr-FR/rest/V4.0/api/get_my_keys.html). Update your `.env` with the following values:

```shell
FRONT_COMMERCE_PAYZEN_PUBLIC_KEY=58039770:testpublickey_xxxxxxx
FRONT_COMMERCE_PAYZEN_PRIVATE_KEY=58039770:testpassword_yyyyyyy
FRONT_COMMERCE_PAYZEN_SHA256=xxxxxxxxx
#FRONT_COMMERCE_PAYZEN_PRODUCT=payzen # use lyra_collect to switch to Lyra Collect's API URLs
```

### Register the PayZen payment module

In your Front-Commerce application:

#### Magento2

```diff
// .front-commerce.js
   modules: [],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "PayZen", path: "server/modules/payment-payzen" }
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
+    { name: "PayZen", path: "server/modules/payment-payzen/index.magento1.js" }
   ]
```

### Register your PayZen payment component

1. Override the file that lets you register additional payments forms in Front-Commerce

```
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```

2. Register PayZen

```diff
+import PayzenEmbeddedForm from "./PayzenEmbeddedForm";

const ComponentMap = {
+  payzen_embedded: PayzenEmbeddedForm
};
```

### Update your CSPs

To allow loading PayZen related remote resources:

```diff
// my-module/config/website.js
  contentSecurityPolicy: {
    directives: {
-      scriptSrc: [],
-      frameSrc: [],
-      styleSrc: [],
-      imgSrc: [],
+      scriptSrc: ["static.payzen.eu", "secure.payzen.eu"],
+      frameSrc: ["static.payzen.eu", "secure.payzen.eu"],
+      styleSrc: ["static.payzen.eu", "secure.payzen.eu"],
+      imgSrc: ["static.payzen.eu", "secure.payzen.eu"],
      styleSrc: [],
      imgSrc: [],
      connectSrc: [],
      baseUri: []
    }
  },
```

<blockquote class="important">
**Lyra Collect:** when using the Lyra Collect integration, use the `api.lyra.com` and `secure.lyra.com` value instead of `static.payzen.eu` and `secure.payzen.eu` in the example above.
</blockquote>

### Advanced: customize data sent to PayZen

<blockquote class="wip">
**Work In Progress** This advanced pattern must be documented with further details. While we are working on it, please [contact us](mailto:contact@front-commerce.com) if you need further assistance.
</blockquote>

The PayZen payment module is extensible. It leverages Front-Commerce's "data transform" pattern to allow developers to customize payloads sent to PayZen for a [Payment Request creation](https://payzen.io/en-EN/rest/V4.0/api/playground/?ws=Charge/CreatePayment#vMGdf).

The Payment request object can be customized at application level. It allows to add additional metadata depending on your own logic. For this, you can use the `registerPaymentRequestDataTransform` method of the Payzen loader to add your custom transformers.

See the test for an example (while a detailed documentation is being written):

- https://gitlab.com/front-commerce/front-commerce/-/blob/c1ca1ef8a60ecb545e2758d04a4d11577e764658/src/server/modules/payment-payzen/__pacts__/loader.js#L132

## Magento2 module

<blockquote class="wip">
**Work In Progress** This integration is aimed at being transparent for administrators and developers. That is why we haven't duplicated documentation from existing Magento resources. Please [contact us](mailto:contact@front-commerce.com) if you need further assistance.
</blockquote>

Front-Commerce Magento2 module contains [headless payment adapters](/docs/magento2/headless-payments.html) for the [**PayZen Standard** method](https://github.com/lyra/plugin-magento) (Lyra's official Magento module).

The PayZen module must be configured in a normal way, as for a non-headless Magento store.
