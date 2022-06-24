---
id: quickorder
title: Quick orders
description: Front-Commerce's QuickOrder component allows customers to add products to the cart by entering a SKU and a quantity. This component is self-contained and renders a compact form that has been designed to be integrated into different contexts. This guide explains how to integrate this feature in your application.
---

<blockquote class="feature--new">
_Since version 2.11_
</blockquote>

The `<QuickOrder />` component adds a user interface allowing your customers to directly order an item based on its <abbr title="Stock Keeping Unit">SKU</abbr>

![Example with the component added to the default's theme minicart](/docs/advanced/features/quickorder_images/Quickorder-sample.png)

## Integrate QuickOrder into your project

You must include the component in your page with the following lines:

```diff
import React from "react";
+ import QuickOrder from "theme/modules/QuickOrder";

const MyComponent = () => {
  return <div>
+    <QuickOrder />
  </div>
}
```

You will also need to add the following line to your `web/theme/modules/_modules.scss` file:

```diff
+@import "~theme/modules/QuickOrder/QuickOrder";
```

## Customize the QuickOrder texts

The placeholders and messages displayed by the QuickOrder component have translation keys prefixed with `modules.QuickOrder`. You can customize the text from your application translations files.

<div class="center">
  <a class="link primary button" href="/docs/advanced/theme/translations.html">Learn about translations in Front-Commerce</a>
</div>
