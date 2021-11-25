---
id: magento2-b2b
title: Magento2 B2B features
---

<blockquote class="feature--new">
_Since version 2.11.0_
</blockquote>

Front-Commerce supports several Magento2 B2B features:

* Display details of the Company a customer belongs to
* Company users handling (list, create, modify and deactivate company users)
* [_Payment on account_](/docs/advanced/payments/payment-on-account.html) payment method
* Display company credit history

<blockquote class="info">
Those features are only available with [Adobe Commerce and its B2B module](https://docs.magento.com/user-guide/getting-started.html#b2b-features) and requires at least Adobe Commerce 2.4.3.
</blockquote>

## Enable B2B support

To leverage those features, you need to enable and integrate the Magento2 B2B module. Here is how to do it:

1. You need to enable the module in your `.front-commerce.js`:
  ```diff
diff --git a/.front-commerce.js b/.front-commerce.js
index d607e0c..93ae34d 100644
--- a/.front-commerce.js
+++ b/.front-commerce.js
@@ -3,6 +3,7 @@ module.exports = {
   url: "http://localhost:4000",
   modules: [
     "./node_modules/front-commerce/modules/datasource-elasticsearch",
+    "./node_modules/front-commerce/modules/front-commerce-b2b",
     "./node_modules/front-commerce/theme-chocolatine",
     "./src",
   ],
@@ -13,10 +14,16 @@ module.exports = {
       path: "datasource-elasticsearch/server/modules/magento2-elasticsearch",
     },
     { name: "Magento2", path: "server/modules/magento2" },
+    { name: "Magento2B2B", path: "front-commerce-b2b/server/modules/magento2" },
   ],
   webModules: [
     { name: "FrontCommerce", path: "front-commerce/src/web" },
     { name: "ThemeChocolatine", path: "front-commerce/theme-chocolatine/web" },
+    {
+      name: "FrontCommerceB2B",
+      path: "front-commerce/modules/front-commerce-b2b/web",
+    },
+
     { name: "Skeleton", path: "./src/web" },
   ],
 };
  ```
1. The web module provides a SCSS file that needs to be imported. To do that, you can create an override of `main.scss` containing the following code:
  ```scss
// src/web/theme/main.scss
@import "~front-commerce/theme-chocolatine/web/theme/main";
/*
if you use the default theme as a base theme, you should use:
@import "~front-commerce/src/web/theme/main.scss";
*/
@import "~theme/b2b";
  ```

And that's it. After having restarted Front-Commerce, the B2B module should be enabled and integrated into your project. If you login as a company user and then go to the user account dashboard, you should see new B2B specific menu entries (company management, credit history…).

To enable _Payment on account_ payment method, please refer to [the Payment on account guide](/docs/advanced/payments/payment-on-account.html).
