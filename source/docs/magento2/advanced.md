---
id: magento2-advanced
title: Advanced
---

In this section, you will learn some advanced usages of the Magento 2 integration.

## Additional headers in Magento API calls

<blockquote class="feature--new">
_Since version 2.7.0_
</blockquote>

Front-Commerce allows you to send additional headers in all API calls. To do so, you must define the `magento.api.extraHeaders` (for storefront API) and/or `magento.api.extraAdminHeaders` (for admin API) configuration values from a [configuration provider](/docs/advanced/server/configurations.html#What-is-a-configuration-provider).

These additional headers could be useful if you want to add additional context to your queries, depending on the request or to detect Front-Commerce requests from your Magento server.

## Clearing Front-Commerce cache

To clear the front commerce cache, the below command needs to be run on the magento server:

```sh
bin/magento cache:clean -- front-commerce
```
