---
id: ingenico
title: Ingenico integration
description: This guide explains how Front-Commerce allows using Ingenico in a headless commerce project.
---

There are different ways for you to accept payments with [Ingenico](https://www.ingenico.com/) (Ogone) in your Front-Commerce application.

- [Front-Commerce Payment](#front-commerce-payment)
  - [Configure your environment](#configure-your-environment)
  - [Register the Ogone payment module](#register-the-ogone-payment-module)
  - [Register your Ogone payment component](#register-your-ogone-payment-component)
  - [Update your CSPs](#update-your-csps)
- [Magento2 module](#magento2-module)

> **Note:** each integration method is independent from the others, meaning that you don't have to install additional modules on your eCommerce platform if using Front-Commerce payments.

## Front-Commerce Payment

This section explains how to configure and customize the Ingenico Front-Commerce Payment module into an existing Front-Commerce application. The implementation use [Ingenico's FlexCheckout solution](https://epayments-support.ingenico.com/en/integration/all-sales-channels/flexcheckout/index) to create payments.

### Configure your environment

<blockquote class="wip">
**Work In Progress** See [Ogone related environment variables](/docs/reference/environment-variables.html#Ogone) for information.
</blockquote>

### Register the Ogone payment module

In your Front-Commerce application:

```diff
// .front-commerce.js
   modules: [],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "Ogone", path: "server/modules/payment-ogone" }
   ]
```

### Register your Ogone payment component

1. Override the file that lets you register additional payments forms in Front-Commerce

```
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```

2. Register Ogone

```diff
+import OgoneFlexCheckoutForm from "./OgoneFlexCheckoutForm";

const ComponentMap = {
+  ogone_flexcheckout: OgoneFlexCheckoutForm
};
```

### Update your CSPs

To allow loading Ogone related remote resources:

```diff
// my-module/config/website.js
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [],
-      frameSrc: [],
+      frameSrc: ["secure.ogone.com", "ogone.test.v-psp.com"],
      styleSrc: [],
      imgSrc: [],
      connectSrc: [],
      baseUri: []
    }
  },
```

## Magento2 module

<blockquote class="wip">
  This integration is aimed at being transparent for administrators and developers. That is why we haven't duplicated documentation from existing Magento resources. Please <span class="intercom-launcher">[contact us](mailto:support@front-commerce.com)</span> if you need further assistance.
</blockquote>

Front-Commerce Magento2 module contains [headless payment adapters](/docs/magento2/headless-payments.html) for the [Ingenico ePayments **OpsCCRedirect** method](https://epayments.developer-ingenico.com/documentation/ecommerce-extensions/) (Ingenicos's official Magento module).

The Ingenico module must be configured in a normal way, as for a non-headless Magento store.
