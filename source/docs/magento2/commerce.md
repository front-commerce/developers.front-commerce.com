---
id: magento2-commerce
title: Magento2 Commerce
description: As of version 2.12, Front-Commerce comes with a Magento2 Commerce module to leverage Adobe Commerce specific features. This guide explains how to configure and use it.
---

<blockquote class="feature--new">
_Since version 2.12.0_
</blockquote>

For now, the Adobe Commerce module only improves the Cms Page handling to partially expose [the Page Hierarchy mechanism](https://docs.magento.com/user-guide/cms/page-hierarchy.html).

## Enable [Magento Commerce](https://docs.magento.com/user-guide/getting-started.html) support

### Magento2 Commerce module installation

You need to install the [`front-commerce/magento2-commerce-module` module](https://gitlab.com/front-commerce/magento2-commerce-module-front-commerce/):

```sh
composer config repositories.front-commerce-magento2-commerce git \
    git@gitlab.com:front-commerce/magento2-commerce-module-front-commerce.git

composer require front-commerce/magento2-commerce-module

php bin/magento setup:upgrade
```

### Front-Commerce configuration

To enable Magento2 Commerce features, you need to enable the Magento2 Commerce module:

```diff
diff --git a/.front-commerce.js b/.front-commerce.js
index d607e0c..426619f 100644
--- a/.front-commerce.js
+++ b/.front-commerce.js
@@ -13,6 +13,7 @@ module.exports = {
       path: "datasource-elasticsearch/server/modules/magento2-elasticsearch",
     },
     { name: "Magento2", path: "server/modules/magento2" },
+    { name: "Magento2Commerce", path: "server/modules/magento2-commerce" },
   ],
   webModules: [
     { name: "FrontCommerce", path: "front-commerce/src/web" },
```

After having restarted Front-Commerce, the Magento2 Commerce module should be enabled.

## Features

### Cms Page children

The Magento2 Commerce improves the Graph to expose the children pages of a Cms Page. With this module, you can for instance run the following the query:

```graphql
query CmsPage {
  cmsPageList(identifiers: ["customer-service"]) {
    identifier
    title
    children {
      # <- only available with magento2-commerce module
      identifier
      title
    }
  }
}
```

Depending the actual page hierarchy in Magento2, it could return something like:

```json
{
  "data": {
    "cmsPageList": [
      {
        "identifier": "customer-service",
        "title": "Customer Service",
        "children": [
          {
            "identifier": "how-to-return",
            "title": "How to return a product"
          },
          {
            "identifier": "faq",
            "title": "Frequently asked questions"
          }
        ]
      }
    ]
  }
}
```

This can be handy to build a structured menu for instance.
