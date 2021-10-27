---
id: quickorder
title: Quick orders
---

# QuickOrder Component

<blockquote class="feature--new">
_Since version 2.11_
</blockquote>

You may want to allow your customers to directly order an item based on its <abbr title="Stock Keeping Unit">SKU</abbr>

The `<QuickOrder />` component enables that by displaying a compact form to enter SKU and quantity information.

The component automatically adds the item to the cart with the set quantity.


## Display QuickOrder 

You must include the component in your page with the following lines:

```diff
import React from "react";
+ import QuickOrder from "theme/modules/QuickOrder";

const MyPage = () => {
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