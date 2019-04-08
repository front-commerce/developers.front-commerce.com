---
id: checklist-before-production
title: Before going to production
wip: https://github.com/front-commerce/developers.front-commerce.com/issues/63
---

Before going to production, you want to ensure that everything is in place. But some features are not critical enough to block your developments and you may have missed them. These are still a big part of any Front-Commerce application.

To ensure that you are good to go, you can go through this checklist :

* [ ] Style your **Offline page**
  This page is accessible when you disable your network while navigating in your shop.
  If you have `FRONT_COMMERCE_ENV !== "production"` this page will also be available at `/__front-commerce/offline`. You can then edit the `theme/pages/Offline` component to make sure that this page suits your brand.
* [ ] Style your **Maintenance page**
  This page is accessible when your backend returns is in Maintenance mode (503).
  If you have `FRONT_COMMERCE_ENV !== "production"` this page will also be available at `/__front-commerce/maintenance`. You can then edit the `theme/pages/Maintenance` component to make sure that this page suits your brand.
