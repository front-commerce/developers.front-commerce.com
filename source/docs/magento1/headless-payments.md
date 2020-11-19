---
id: magento1-headless-payments
title: Magento1 headless payments
---

Historically, Magento1 does not support headless payments. Even though some payment providers are using APIs from their module, most of them often rely on the user's session to persist meaningful information across checkout steps.

Front-Commerce’s Magento module provides a generic way to expose Magento payment modules headlessly and supports [the relevant Front-Commerce payment workflows](/docs/advanced/payments/payment-workflows.html).

## Supported Payment platforms

Our Magento1 integration currently provides native adapters for the platforms below, learn how to install each one of them from the related documentation page:

- [Paypal](/docs/advanced/payments/paypal.html#Magento1-module)

<blockquote class="info">
  If you want to use a Payment module not yet listed above, please [contact us](mailto:contact@front-commerce.com) so we can provide information about a potential upcoming native support for it.
</blockquote>

## Implement a new Magento1 Payment method Adapter

<blockquote class="wip">
**Work In Progress** This section will be documented in the future. In the meantime, please [contact us](mailto:contact@front-commerce.com) so we can show you the steps to create your own headless payment in Magento1.
</blockquote>
