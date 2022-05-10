---
id: in-stock-alert
title: In-Stock Alert
---

<blockquote class="feature--new">
_Since version 2.15_
</blockquote>

In-stock alerts allow users to subscribe to email notifications when a product is out of stock, so they can be notified as soon as it is back in stock.

Currently supoported for Magento 1 and Magento 2, enabling this feature will add a button on a product's detail page for every product that is out of stock.

![Example with the default theme's component](/docs/advanced/features/in_stock_alert/in-stock-alert-sample.png)

## Enable In-Stock Alerts in your project

To use in-stock alerts in your project, you must first make sure the feature is enabled in your backend configuration.

### Magento 1

Navigate to `System > Configuration > Catalog > Catalog`. Within the `Product Alerts` menu, make sure `Allow Alert When Product Comes Back in-Stock` is set to `Yes`.

### Magento 2

Navigate to `Stores > Configuration > Catalog > Catalog`. Within the `Product Alerts` menu, make sure `Allow Alert When Product Comes Back in Stock` is set to `Yes`.

## Customize In-Stock Alert texts

By default, having the configuration enabled for in-stock alerts in your backend will automatically add the default component (`SubscribeToInStockAlert`) on each out-of-stock product page.

The placeholders and messages displayed by the `SubscribeToInStockAlert` component have translation keys prefixed with `modules.SubscribeToInStockAlert`. You can customize the text from your application translations files.

<div class="center">
  <a class="link primary button" href="/docs/advanced/theme/translations.html">Learn about translations in Front-Commerce</a>
</div>
