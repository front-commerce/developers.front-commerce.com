---
id: quickorder
title: Quick orders
---

# QuickOrder Component

<blockquote class="feature--new">
_Since version 2.11_
</blockquote>

You may want to allow your customers to directly order an item based on its unique code.

The <QuickOrder /> component does that by show a simple compact form with item code and quantity information.

The component automatically adds the item to the cart with the set quantity.


## Display QuickOrder 

You can include the component in your page with the following lines:

```diff
import React from "react";
+ import QuickOrder from "theme/modules/QuickOrder";

const MyPage = () => {
  return <div>
+    <QuickOrder />
  </div>
}
```


## Customize the QuickOrder texts

The placeholders and messages displayed by the QuickOrder component are based on the following translations keys :

```json
  "modules.QuickOrder.Labels.Sku": "Item code",
  "modules.QuickOrder.Labels.Quantity": "Quantity",
  "modules.QuickOrder.Labels.Confirmed": "The product has been added to the cart",
  "modules.QuickOrder.Actions.AddToCart": "Add to the cart",
```

<div class="center">
  <a class="link primary button" href="/docs/advanced/theme/translations.html">Learn about translations in Front-Commerce</a>
</div>