---
id: buybox
title: BuyBox integration
---

This page contains information about the different ways you can accept payments with [BuyBox](https://www.buybox.net/) in your Front-Commerce application.

## Front-Commerce Payment

<blockquote class="feature--new">
_Since version 2.3.0_
</blockquote>

This section explains how to configure and customize the BuyBox Front-Commerce Payment module into an existing Front-Commerce application. The implementation use BuyBox's API to initiate payments and redirect customers to BuyBox to proceed to the payment using their Gift Card.

### Configure your environment

With API keys found [on your BuyBox dashboard (sandbox)](https://sandbox.buybox.net/wallet_backoffice/core/infos.php).

```diff
// .env
+# BuyBox payment
+# API Keys from https://sandbox.buybox.net/wallet_backoffice/core/infos.php
+FRONT_COMMERCE_BUYBOX_IS_PRODUCTION_MODE=false
+FRONT_COMMERCE_BUYBOX_USER=xxxx
+FRONT_COMMERCE_BUYBOX_PWD=xxxxxxxxx
+FRONT_COMMERCE_BUYBOX_SIGNATURE=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Register the BuyBox payment module

In your Front-Commerce application:

#### Magento2

```diff
// .front-commerce.js
-   modules: [],
+   modules: ["./node_modules/front-commerce/modules/payment-buybox"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "BuyBox", path: "payment-buybox/server/modules/payment-buybox" }
   ]
```

#### Magento1

BuyBox is not yet supported for Magento 1. Please contact us if you need this integration.

### That's it!

Restart your application and test your payments.

> You can use the `front-commerce:payment:buybox` flag to `DEBUG` this integration and view the interactions with the payment API.