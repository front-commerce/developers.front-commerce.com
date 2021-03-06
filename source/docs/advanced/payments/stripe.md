---
id: stripe
title: Stripe integration
---

This page contains information about the different ways you can accept payments with [Stripe](https://stripe.com/) in your Front-Commerce application.

## Front-Commerce Payment

This section explains how to configure and customize the Stripe Front-Commerce Payment module into an existing Front-Commerce application. The implementation use [Stripe's Payment Intents API](https://stripe.com/docs/payments/payment-intents) to create payments. Customers are also created in your Stripe account so you can identify them seamlessly.

### Configure your environment

With API keys found [on your Stripe’s dashboard](https://dashboard.stripe.com/account/apikeys).

```diff
// .env
+# Stripe payment
+# API Keys from https://dashboard.stripe.com/account/apikeys
+FRONT_COMMERCE_WEB_STRIPE_PUBLISHABLE_KEY=pk_xxxxxx
+FRONT_COMMERCE_STRIPE_SECRET_KEY=sk_xxxxxx
```

### Register the Stripe payment module

In your Front-Commerce application:

#### Magento2

```diff
// .front-commerce.js
   modules: [],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "Stripe", path: "server/modules/payment-stripe" }
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
+    { name: "Stripe", path: "server/modules/payment-stripe/index.magento1.js" }
   ]
```

### Register your Stripe payment component

1. Override the file that lets you register additional payments forms in Front-Commerce
```
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```
2. Register Stripe
```diff
+import StripeCheckout from "./StripeCheckout";

const ComponentMap = {
+  stripe: StripeCheckout
};
```

### Update your CSPs

To allow loading stripe related remote resources:

```diff
// my-module/config/website.js
  contentSecurityPolicy: {
    directives: {
-      scriptSrc: [],
-      frameSrc: [],
+      scriptSrc: ["js.stripe.com"],
+      frameSrc: ["js.stripe.com"],
      styleSrc: [],
      imgSrc: [],
      connectSrc: [],
      baseUri: []
    }
  },
```

### Advanced: customize data sent to Stripe

<blockquote class="wip">
**Work In Progress** This advanced pattern must be documented with further details. While we are working on it, please [contact us](mailto:contact@front-commerce.com) if you need further assistance.
</blockquote>

The Stripe payment module is extensible. It leverages Front-Commerce's "data transform" pattern to allow developers to customize payloads sent to Stripe for Customer and Cart content.

Both the `Customer` and `PaymentIntent` Stripe objects can be customized at application level. It allows to add additional metadata depending on your own logic. For this, you can use the `registerCustomerDataTransform` and `registerPaymentIntentDataTransform` methods of the Stripe loader to add your custom transformers.

See the tests for an example (while a detailed documentation is being written):
* https://gitlab.com/front-commerce/front-commerce/blob/3c550dfa0142dde7da3761011379118612841de7/src/server/modules/payment-stripe/__tests__/loader.js#L77
* https://gitlab.com/front-commerce/front-commerce/blob/3c550dfa0142dde7da3761011379118612841de7/src/server/modules/payment-stripe/__tests__/loader.js#L147