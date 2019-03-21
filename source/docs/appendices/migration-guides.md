---
id: migration-guides
title: Migration Guides
---

This area will contain the Migration steps to follow for upgrading your store to new Front-Commerce versions.

Our goal is to make migrations as smooth as possible. This is why we try to make many changes backword compatible by using deprecation warnings. The deprecation warnings are usually removed in the next breaking release.

## `1.0.0-alpha.1` -> `1.0.0-alpha.2`

### Atoms refactoring ([#178](https://gitlab.com/front-commerce/front-commerce/issues/178))

One of the goals of `1.0.0` is to rewrite our CSS classes to make it easier for new external contributors to dive into Front-Commerce. However, this is a lot of work because of the many features already implemented in Front-Commerce. Thus, we've splitted this in 5 smaller iterations (see ([#97](https://gitlab.com/front-commerce/front-commerce/issues/97)) for more details). This release is the first step towards this goal.

This means that:

- CSS classes of atoms are no longer used directly in other components
- CSS classes of atoms now respect the BEM convention. However we are not too rigid about this convention because avoiding dependencies between components is our first priority. (Currently in the process of writing a documentation page explaining the whys behind this decision.)

On your part, the changes that will affect you the most are about the following components:

- `<Button>`: changed the classes and gathered the styles properties under an `appearance` property
- `<Link>`: changed the classes and use the classes of the `<Button>` if you use the `buttonAppearance` property.
  This is relevant because for UI reasons you might want to render a Button, but it should still redirect to a new page under the hood.
- `<ResizedImage>`: added a surrounding div and changed classes to better handle fluid vs fixed images.
  Moreover, you can now update only the components that handle the markup of a ResizedImage without overriding the core component. Please refer to `Image`, `ImageLoading` and `ImageNotFound` in `theme/components/atoms/ResizedImage` folder.
- `<Input>`: changed input classes
- `<NumberInput>`: changed the style to add +/- buttons next to the input button.

You should also check that if you have overriden some of the other components.

### Variant properties

For style variants of a component we had several behaviors in place:

- `type` property which was an enumeration of the variants
- `variantName` properties (for instance `primary` and `warning` for `<Button>`)

To improve consistency, we've decided to change this by always using an `appearance` property which will be an enumeration like what was done with the `type` property.

The goal is to avoid variants collision and to make it explicit when a variant only affects the style of a component.

These changes are backward compatible. Deprecation warnings will appear if you keep using the old properties.

### Cart refactoring

The Cart was one of the most outdated part of our code. This is no longer the case! Components and styles have been refactored to better match the style of the checkout and account pages. This is a great step forward because it is rarely heavily customized by online shops and it will now be a nice default.

#### Translations

Since few integrators had the opportunity to customize the existing Cart, the main changes you will need to take care of are the translations.

<details>
<summary>List of the changed translations regarding the Cart</summary>
<ul>
  <li>components.atoms.Form.Input.NumberInput.decrement</li>
  <li>components.atoms.Form.Input.NumberInput.increment</li>
  <li>modules.Cart.CartContent.CartHeader.products</li>
  <li>modules.Cart.CartItem.CartItemInfos.quantity</li>
  <li>modules.Cart.CartItem.CartItemInfos.subtotal</li>
  <li>modules.Cart.CartItem.CartItemInfos.unitPrice</li>
  <li>modules.Cart.CartItem.CartItemOptionsUpdater.button</li>
  <li>modules.Cart.CartItem.CartItemOptionsUpdater.error</li>
  <li>modules.Cart.CartItem.CartItemOptionsUpdater.submit</li>
  <li>modules.Cart.CartItem.CartItemOptionsUpdater.success</li>
  <li>modules.Cart.CartItem.CartItemOptionsUpdater.title</li>
  <li>modules.Cart.CartItem.CartItemQuantityForm.error</li>
  <li>modules.Cart.CartItem.CartItemQuantityForm.refresh</li>
  <li>modules.Cart.CartItem.CartItemQuantityForm.success</li>
  <li>modules.Cart.CartItem.remove</li>
  <li>modules.Cart.MiniCart.MiniCartContent.checkout</li>
  <li>modules.Cart.MiniCart.MiniCartContent.seeCart</li>
  <li>modules.Cart.CartTitle.continueShopping</li>
  <li>modules.Cart.CartTitle.title</li>
  <li>modules.Cart.CartAlerts.contactUs</li>
  <li>modules.Cart.CartAlerts.fromRenew</li>
  <li>modules.Cart.CartAlerts.paymentError</li>
  <li>modules.Cart.CartAlerts.renewError</li>
</ul>
</details>

Please refer to the translations files in the core of front-commerce to get the new translations within your application. This process should be easier in the future by using [translations fallbacks that is under development](https://gitlab.com/front-commerce/front-commerce/issues/54#note_152801124).

#### Styles

If you have overriden the `theme/modules/_modules.scss` file and didn't import the `front-commerce/src/web/theme/modules/_modules.scss` file, you will need to add the new styles for the Cart:

```diff
+@import "~theme/modules/Cart/EmptyCart/EmptyCart";
+@import "~theme/modules/Cart/CartTitle/CartTitle";
+@import "~theme/modules/Cart/CartContent/CartContent";
+@import "~theme/modules/Cart/CartContent/CartHeader/CartHeader";
+@import "~theme/modules/Cart/CartItem/CartItem";
+@import "~theme/modules/Cart/CartItem/CartItemInfos/CartItemInfos";
+@import "~theme/modules/Cart/CartItem/CartItemStatus/CartItemStatus";
+@import "~theme/modules/Cart/CartItem/CartItemQuantityForm/CartItemQuantityForm";
+@import "~theme/modules/Cart/CartItem/MiniCartItem/MiniCartItem";
+@import "~theme/modules/Cart/CartFooter/CartFooter";
-@import "~theme/modules/Cart/ProductItemCart/ProductItemCart";
```

If you have overriden the `theme/components/_components.scss` file and didn't import the `front-commerce/src/web/theme/components/_components.scss` file, you will need to add the new styles for the new components that have been added for the Cart's modules:

```diff
+@import "~theme/components/atoms/Typography/Sku/Sku";
+@import "~theme/components/atoms/Form/Input/NumberInput/NumberInput";
+@import "~theme/components/molecules/Form/FormTitle/FormTitle";
```
