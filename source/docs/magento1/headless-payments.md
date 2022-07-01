---
id: magento1-headless-payments
title: Magento1 headless payments
description: Historically, Magento1 does not support headless payments. Even though some payment providers are using APIs from their module, most of them often rely on the user's session to persist meaningful information across checkout steps. This guide explains how to expose an existing Magento payment method for headless usage in Front-Commerce.
---

Front-Commerce’s Magento module provides a generic way to expose Magento payment modules headlessly and supports [the relevant Front-Commerce payment workflows](/docs/advanced/payments/payment-workflows.html).

## Supported Payment platforms

Our Magento1 integration currently provides native adapters for the platforms below, learn how to install each one of them from the related documentation page:

- [Paypal](/docs/advanced/payments/paypal.html#Magento1-module)

<blockquote class="info">
  If you want to use a Payment module not yet listed above, please <span class="intercom-launcher">[contact us](mailto:hello@front-commerce.com)</span> so we can provide information about a potential upcoming native support for it.
</blockquote>

## Implement a new Magento1 Payment method

<blockquote class="wip">
**Documentation In Progress** This section will be documented in the future. In the meantime, please <span class="intercom-launcher">[contact us](mailto:support@front-commerce.com)</span> so we can show you the steps to create your own headless payment in Magento1.
</blockquote>

### Using the "redirect after order" flow

<blockquote class="info">
**Payment flows:** [Redirect after order](/docs/advanced/payments/payment-workflows.html#Redirect-After-Order)
</blockquote>

1. Add your own payment instance on `config.xml` file

First, you need to create your own model implementing the `FrontCommerce_Integration_Model_Headlesspayment_Interface` interface and register it using the `<config><frontcommerce><payment_instances><{payment_method_code}>{class_name}</{payment_method_code}></payment_instances></frontcommerce></config>` XML node in your `config.xml` file.

**Note:** don't forget to replace `{payment_method_code}` by your method payment code and `{class_name}` by the class names you've just created

2. Implement the interface methods in your own model:

- `isHtml(): Boolean` if your payment return type is HTML content or not
- `isUrl(): Boolean` if your payment return type is URL or not
- `getValue(Mage_Sales_Model_Order $order): String` return URL or HTML when this payment method is call on front
- `getResponseSuccess(String $action, [String] $additionalData): Boolean` Failed or success payment action
- `getResponseMessage(String $action, [String] $additionalData): [String]` Failed action message
  - in success case, return an array of `quote_id` and `order_id`:
  ```
  return [
    (int) $additionalData['quote_id'], (int)  $additionalData['order_id']
  ];
  ```
  - in case of errors, return an array of error messages:
  ```
  return [{error message}]
  ```
- `returnAction(String $action, [String] $additionalData): Boolean` Callback after payment, for example, you can add your custom code here for retrieve customer cart after cancel payment
