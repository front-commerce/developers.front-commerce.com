---
id: payment-on-account
title: Payment on account
---

Payment on account is a payment method for B2B contexts. It allows companies to make place orders using the credit limit that is specified in their profile.

## Magento2 B2B

<blockquote class="feature--new">
_Since version 2.11.0_
</blockquote>

### Enable Payment on account

<blockquote class="note">
This feature is directly provided by Adobe Commerce. Please refer to [the corresponding documentation page to properly configure it on Magento side](https://docs.magento.com/user-guide/payment/payment-on-account.html).
</blockquote>

#### Enable the B2B module

First, you need to [enable and integrate the Front-Commerce B2B module for Magento2](/docs/magento2/b2b.html#Enable-B2B-support).

#### Register the Payment on account payment component

1. Override the file that lets you register additional payments components in Front-Commerce

```bash
mkdir -p my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/
cp -u node_modules/front-commerce/src/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js my-module/web/theme/modules/Checkout/Payment/AdditionalPaymentInformation/getAdditionalDataComponent.js
```

1. Register the component `PaymentOnAccount` to be used for `companycredit` payments in `getAdditionalDataComponent.js`

```diff
+import PaymentOnAccount from "theme/modules/Checkout/Payment/AdditionalPaymentInformation/PaymentOnAccount";

const ComponentMap = {
+  companycredit: PaymentOnAccount,
};
```

And that's it. After having restarted Front-Commerce, a company customer having _Payment on account_ enabled should be able to use this payment method.
