---
id: magento2-headless-payments
title: Magento2 headless payments
---

Historically, Magento2 did not support headless payments. Even though some payment providers are slowly exposing REST or GraphQL APIs from their module, most of them often rely on the `CheckoutSession` or `CustomerSession` to persist meaningful information across checkout steps.

Front-Commerce’s Magento module provides a generic way to expose Magento payment modules headlessly and supports [the relevant Front-Commerce payment workflows](/docs/advanced/payments/payment-workflows.html).

## Supported Payment platforms

Our Magento2 integration currently provides native adapters for the platforms below, learn how to install each one of them from the related documentation page:
- [Affirm](/docs/advanced/payments/affirm.html#Magento2-module)
- [Ingenico](/docs/advanced/payments/ingenico.html#Magento2-module)
- [Paypal](/docs/advanced/payments/paypal.html#Magento2-module)
- [PayZen](/docs/advanced/payments/payzen.html#Magento2-module)

<blockquote class="info">
  If you want to use a Payment module not yet listed above, please [`contact us`](mailto:contact@front-commerce.com) so we can provide information about a potential upcoming native support for it.
</blockquote>

## Implement a new Magento2 Payment method Adapter

<blockquote class="wip">
**Work In Progress** This section is not as detailed as we would love it to be. Please let us know if you need further information before we improve it.
</blockquote>

We will explain the mechanisms available to implement your own adapter if supported Magento payment modules do not suit your needs.

**Payment Adapters must implement the [`\FrontCommerce\Integration\Api\HeadlessPayment\Adapter`](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/master/app/code/FrontCommerce/Integration/Api/HeadlessPayment/Adapter.php) interface no matter the [workflows](/docs/advanced/payments/payment-workflows.html) they support.**

Front-Commerce module will simulate a Magento action as if the page was loaded in a frontend context. It will:
1. create a `RequestInterface` instance
2. dispatch the request through Magento’s Front Controller
3. converts the response into a Front-Commerce headless API response

Adapters must implement methods that are called at key times in order to:
- allow to initialize the request
- or convert a response depending on the payment module internal implementations

### `redirectionFromCheckoutRedirectActionResponse`

<blockquote class="info">
**Payment flows:** [Redirect before order](/docs/advanced/payments/payment-workflows.html#Redirect-Before-Order)
</blockquote>

Converts an internal Magento response to a [`RedirectionInterface`](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/master/app/code/FrontCommerce/Integration/Api/Data/HeadlessPayment/RedirectionInterface.php) value object.

```php
public function redirectionFromCheckoutRedirectActionResponse(
    Response $response,
    ManagerInterface $messagesManager
): RedirectionInterface;
```

### `redirectionFromCheckoutRedirectAfterActionResponse`

<blockquote class="info">
**Payment flows:** [Redirect after order](/docs/advanced/payments/payment-workflows.html#Redirect-After-Order)
</blockquote>

Converts an internal Magento response to a [`RedirectionInterface`](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/master/app/code/FrontCommerce/Integration/Api/Data/HeadlessPayment/RedirectionInterface.php) value object.

```php
public function redirectionFromCheckoutRedirectAfterActionResponse(
    Response $response,
    ManagerInterface $messagesManager
): RedirectionInterface;
```

### `prepareAfterCheckoutContext`

<blockquote class="info">
**Payment flows:** [Redirect after order](/docs/advanced/payments/payment-workflows.html#Redirect-After-Order)
</blockquote>

Populates session objects with information required by the payment action.

```php
public function prepareAfterCheckoutContext(
    CheckoutSession $checkoutSession,
    CustomerSession $customerSession,
    Order $order
);
```

### `checkoutRedirectUrl`

<blockquote class="info">
**Payment flows:** [Redirect before order](/docs/advanced/payments/payment-workflows.html#Redirect-Before-Order), [Redirect after order](/docs/advanced/payments/payment-workflows.html#Redirect-After-Order)
</blockquote>

Should return the url that will be dispatched internally to trigger the redirection to the payment provider in the payment module.

```php
public function checkoutRedirectUrl(
    ConfigProviderInterface $configProvider,
    Payment $payment = null
): string;
```

### `changeAfterCheckoutResponseFromResult`

<blockquote class="info">
**Payment flows:** [Redirect after order](/docs/advanced/payments/payment-workflows.html#Redirect-After-Order)
</blockquote>

May populate or change the Magento response object while still in the correct store context. It can for instance render blocks or things like that…

```php
public function changeAfterCheckoutResponseFromResult(
    HttpInterface $response,
    BlockFactory $blockFactory,
    ResultInterface $result = null,
    ObjectManagerInterface $objectManager
);
```

### `buildReturnFromPlatformProxiedAction`

<blockquote class="info">
**Payment flows:** [Redirect before order](/docs/advanced/payments/payment-workflows.html#Redirect-Before-Order), [Redirect after order](/docs/advanced/payments/payment-workflows.html#Redirect-After-Order)
</blockquote>

This is a factory to build a [`ProxiedAction`](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/master/app/code/FrontCommerce/Integration/Api/HeadlessPayment/ProxiedAction.php) matching the next step for the Customer depending on information transmitted by the payment system in the return url the user was redirected to when coming back to the store

```php
public function buildReturnFromPlatformProxiedAction(
    string $actionName,
    array $additionalData,
    $customerId = null
): ProxiedAction;
```

_Note:_ in case an action is not supported, we recommend to throw an exception so Front-Commerce could gracefully prevent the checkout process by displaying a relevant information to the Customer.

Example: `throw new \RuntimeException('Checkout flow not supported');`

## Register the Payment Adapter

Wether you've implemented a new Payment Adapter or are reusing an existing one, adapters have to be registered so Front-Commerce's module could instantiate it when relevant. Using the `di.xml`, inject the adapter in the [`FrontCommerce\Integration\Model\HeadlessPayments\AdapterFactory` `$adapters` constructor param](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/master/app/code/FrontCommerce/Integration/Model/HeadlessPayments/AdapterFactory.php#L12).

Below is an example from Front-Commerce's core:

```xml
<type name="FrontCommerce\Integration\Model\HeadlessPayments\AdapterFactory">
  <arguments>
    <argument name="adapters" xsi:type="array">
      <item name="paypal_express" xsi:type="string">FrontCommerce\Integration\Model\HeadlessPayments\Adapter\PaypalExpress</item>
      <item name="payzen_standard" xsi:type="string">FrontCommerce\Integration\Model\HeadlessPayments\Adapter\PayzenStandard</item>
      <item name="ops_cc" xsi:type="string">FrontCommerce\Integration\Model\HeadlessPayments\Adapter\OpsCc</item>
      <item name="adyen_hpp" xsi:type="string">FrontCommerce\Integration\Model\HeadlessPayments\Adapter\AdyenHpp</item>
    </argument>
  </arguments>
</type>
```

<blockquote class="note">
We encourage you to investigate existing Adapters' source code from [Front-Commerce's core](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/tree/master/app/code/FrontCommerce/Integration/Model/HeadlessPayments/Adapter) to learn about advanced patterns.
</blockquote>