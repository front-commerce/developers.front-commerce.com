---
title: "Release: Front-Commerce 2.2"
date: 2020-11-18
---

Front-Commerce 2.2 has a heavy focus on Magento 1 features thanks to new clients migrating their Legacy Magento 1 shops on Front-Commerce. Read more about this version.

<!-- more -->

## Guest Checkout

It is now possible to complete a Checkout in Front-Commerce without being logged. This is a frequently asked feature as it can really boost your sales. This also means that we've made all the changes necessary to the theme and that it will now be possible to add the Guest Checkout to Magento 2 with very few changes. Stay tuned!

## More product types

In Front-Commerce we already supported simple products and configurable products which are the most commonly used types in the Magento ecosystem. In Front-Commerce's Magento 1 integration it is now possible to use Bundle Products and Virtual Products.

Virtual products are especially exciting because this means that it is now possible to remove completly the shipping step from the checkout if a customer only buys virtual items.

Just like the Guest Checkout this also means that we're close to add the support for these types in Magento 2's integration.

For Magento 2, we've added support for Grouped Products.

## Multiple currencies

In Magento there are multiple ways to sell your products in different currencies. You can either configure a different website or set multiple currencies on a single store. Each one has its pros and cons, but luckily for you, we now support both ways in Magento 1.

Please refer to [Multiple currencies](/docs/advanced/production-ready/multistore.html#Multiple-currencies) for more details.

## Other changes

- improved guest session invalidation
- support region fields in addresses
- support credit memos in Magento 1
- fixes in the checkout to improve the validation of the shipping step

<hr />
<div class="center">
  <p>
    <a class="link primary button" href="https://www.front-commerce.com/en/contact-us/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.2.0](/docs/appendices/migration-guides.html#2-1-x-gt-2-2-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.2.0)
  </p>
</div>
