---
id: magento2-headless-payments
title: Magento2 headless payments
---

Historically, Magento2 did not support headless payments. Even though some payment providers are slowly exposing REST or GraphQL APIs from their module, most of them often rely on the `CheckoutSession` or `CustomerSession` to persist meaningful information across checkout steps.

Front-Commerce’s Magento module provides a generic way to expose Magento payment modules headlessly and supports [the relevant Front-Commerce payment workflows](/docs/advanced/payments/payment-workflows.html).

<blockquote class="important">
**Important:** the implementation uses very low-level Magento mechanisms. One must be very careful about the implementation and **must rigorously test the payment integration** because some extensions could have nasty side effects. Read more about it in the [Warnings & Known issues](#Warnings-amp-Known-issues) section if you plan to use such payment methods.
</blockquote>

## Supported Payment platforms

Our Magento2 integration currently provides native adapters for the platforms below, learn how to install each one of them from the related documentation page:

- [Affirm](/docs/advanced/payments/affirm.html#Magento2-module)
- [Ingenico](/docs/advanced/payments/ingenico.html#Magento2-module)
- [Paypal](/docs/advanced/payments/paypal.html#Magento2-module)
- [PayZen](/docs/advanced/payments/payzen.html#Magento2-module)
- [Payment on account](/docs/advanced/payments/payment-on-account.html)

<blockquote class="info">
  If you want to use a Payment module not yet listed above, please [`contact us`](mailto:hello@front-commerce.com) so we can provide information about a potential upcoming native support for it.
</blockquote>

## Implement a new Magento2 Payment method Adapter

<blockquote class="wip">
**Work In Progress** This section is not as detailed as we would love it to be. Please let us know if you need further information before we improve it.
</blockquote>

We will explain the mechanisms available to implement your own adapter if supported Magento payment modules do not suit your needs.

**Payment Adapters must implement the [`\FrontCommerce\Integration\Api\HeadlessPayment\Adapter`](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/main/app/code/FrontCommerce/Integration/Api/HeadlessPayment/Adapter.php) interface no matter the [workflows](/docs/advanced/payments/payment-workflows.html) they support.**

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

Converts an internal Magento response to a [`RedirectionInterface`](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/main/app/code/FrontCommerce/Integration/Api/Data/HeadlessPayment/RedirectionInterface.php) value object.

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

Converts an internal Magento response to a [`RedirectionInterface`](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/main/app/code/FrontCommerce/Integration/Api/Data/HeadlessPayment/RedirectionInterface.php) value object.

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

This is a factory to build a [`ProxiedAction`](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/main/app/code/FrontCommerce/Integration/Api/HeadlessPayment/ProxiedAction.php) matching the next step for the Customer depending on information transmitted by the payment system in the return url the user was redirected to when coming back to the store

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

Wether you've implemented a new Payment Adapter or are reusing an existing one, adapters have to be registered so Front-Commerce's module could instantiate it when relevant. Using the `di.xml`, inject the adapter in the [`FrontCommerce\Integration\Model\HeadlessPayments\AdapterFactory` `$adapters` constructor param](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/main/app/code/FrontCommerce/Integration/Model/HeadlessPayments/AdapterFactory.php#L12).

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
We encourage you to investigate existing Adapters' source code from [Front-Commerce's core](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/tree/main/app/code/FrontCommerce/Integration/Model/HeadlessPayments/Adapter) to learn about advanced patterns.
</blockquote>

## Allow the Payment's URLs

Since we're using Magento's modules, this means that we also need to use their URLs. However, in Front-Commerce, there's is an option that let's you disable the Magento's front-end in order to redirect users from Magento to Front-Commerce.

Using the `di.xml`, you will need to inject routing policies in order to make sure that the URLs needed for the payment method is allowed.

<blockquote class="important">
**Important:** Please make sure to test your payment after you've enabled the option: "Stores > Configuration > General > General > Front-Commerce > Disable Magento Front-End"
</blockquote>

Below is an example from Front-Commerce's core:

```xml
<type name="FrontCommerce\Integration\Observer\DisableFrontEnd">
    <arguments>
        <argument name="routingPolicies" xsi:type="array">
            <item name="/^.*\/?\bswagger\b\//" xsi:type="const">FrontCommerce\Integration\Observer\DisableFrontEnd::ROUTING_POLICY_ACCEPT</item>
            <item name="/^.*\/?\bstatic\b\//" xsi:type="const">FrontCommerce\Integration\Observer\DisableFrontEnd::ROUTING_POLICY_ACCEPT</item>
            <item name="/^.*\/?\bpaypal\b\//" xsi:type="const">FrontCommerce\Integration\Observer\DisableFrontEnd::ROUTING_POLICY_ACCEPT</item>
            <item name="/^.*\/?\bpayzen\b\//" xsi:type="const">FrontCommerce\Integration\Observer\DisableFrontEnd::ROUTING_POLICY_ACCEPT</item>
            <item name="/^.*\/?\bops\b\//" xsi:type="const">FrontCommerce\Integration\Observer\DisableFrontEnd::ROUTING_POLICY_ACCEPT</item>
            <item name="/^.*\/?\badyen\b\//" xsi:type="const">FrontCommerce\Integration\Observer\DisableFrontEnd::ROUTING_POLICY_ACCEPT</item>
        </argument>
    </arguments>
</type>
```

## Warnings & Known issues

Front-Commerce Headless Payment support relies on Magento low-level internal code. The Magento classes used have some internal state for optimization purpose, and depending on Magento versions and installed modules it could lead to undesirable behaviors.

**We recommend that you test payments workflows rigorously for Payment Methods relying on Front-Commerce Headless Payment mechanisms.** If you need help investigating such issues, please contact us.

### How does it work?

It is important to understand how Headless Payment works to understand the limitations and reasons of the issues:
1. Front-Commerce calls REST endpoints provided by the Front-Commerce Magento module (headless payments API)
2. the REST endpoint will load the relevant headless payment adapter
3. it then bootstraps [a Magento internal Request](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/64784f627064d0068ca04842317eb69f3fd143b7/app/code/FrontCommerce/Integration/Model/HeadlessPayments.php#L148) object, and initializes it with session information (user, order, quote…) by delegating some initialization to the payment adapter
4. it then dispatches the request (in an emulated `frontend` Magento area)
5. the Magento internal HTTP response is finally converted back to a Front-Commerce headless payment response (the payment adapter is responsible for extracting and transforming data)
6. the Front-Commerce headless payment endpoint returns the JSON response that is understood and used by Front-Commerce to do whatever is needed (redirect the customer to a success page, to the payment provider page …)

**The steps 3 and 4 above will trigger low-level Magento mechanisms and there are known side effects in some Magento versions**. Switching from a `webapi_rest` area to a `frontend` area (for another internal Magento Request) and then switching back to the `webapi_rest` area to send the API response… is what may cause issues.

### Known issues

There are still some issues we know about and were not able to solve in our module, either because Magento does not provide extension point to do it from a module or because it is difficult to do it across the whole range of Magento versions Front-Commerce supports.

#### Magento 2.3

No known issues! 😎

#### Magento 2.4.0+

> "CSP can only be configured for storefront or admin area" error

This error is due to event handlers being merged and not reset upon Magento area switch. `Magento_Csp` event handlers (for `frontend` area) are incorrectly executed when sending back the `webapi_rest` HTTP response.

Possible workarounds:
- disable `Magento_Csp` module: for an admin-only store, it could make sense!
- patch the `Magento\Framework\Config\Data\Scoped` class with the patch attached in the related issue

[Read the related issue for details](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/issues/49).

#### Magento 2.4.1+

> "Notice: Undefined index: Magento\Webapi\Controller\Rest" error

This error is due to the `$this->_pluginInstances` attribute is not reset properly when we switch between Magento areas.

Possible workarounds:
- call `$pluginList->getNext($type, $method, $code);` in the interceptor to reinitialize internal state properly
- patch the `PluginList` class to handle this edge case (undefined index)

[Read the related issue for details](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/issues/57).
