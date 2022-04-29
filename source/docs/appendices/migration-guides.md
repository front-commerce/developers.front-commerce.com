---
id: migration-guides
title: Migration Guides
---

This area will contain the Migration steps to follow for upgrading your store to new Front-Commerce versions.

Our goal is to make migrations as smooth as possible. This is why we try to make many changes backward compatible by using deprecation warnings. The deprecation warnings are usually removed in the next breaking release.

## `2.13.0` -> `2.14.0`

### New style sheet for B2B

In this release we updated the RequisitionList configurable options modal. In case you are using the B2B module and have overridden `modules/front-commerce-b2b/web/theme/modules/RequisitionList/_RequisitionList.scss` please add the following line to it:

```scss
@import "~theme/modules/RequisitionList/ProductConfigurationModal/ProductConfigurationModal";
```

### `withFlashMessages` now exports hooks

The logic of `withFlashMessages` is now also exported as a hook `useFlashMessages`. If you have overridden `withFlashMessages` please apply the changes in [this diff](https://gitlab.com/front-commerce/front-commerce/-/commit/11e7d55bc68d22b422ea5bc9c8357551cd2412ea) to it.

### Added downloadable products support for Magento2

<blockquote>
_Minimum required magento 2 module version 2.6.1_
</blockquote>

Support for shareable downloadable products was added. There is now a new page under the user account `/user/downloadable-products` that lists all the downloadable products of the current user.

P.S. The [withFlashMessage](#withFlashMessages-now-exports-hooks) update is required for the downloadable product page.

To add a link to the downloadable products in the account navigation please apply the following diffs to your project:

If you are using the base theme:

- [AccountNavigation](https://gitlab.com/front-commerce/front-commerce/-/commit/6f83e7b889369efab8a2560c66a410a1b3a6f7db?view=parallel#9f4b70799a5d0472977d4a6992b5f751d4c7b2a3)
- [AccountLayout](https://gitlab.com/front-commerce/front-commerce/-/commit/6f83e7b889369efab8a2560c66a410a1b3a6f7db?page=2#a85a9f3a6d6111152efe2fc74320dfab7295d39d)
- [EnhanceAccount](https://gitlab.com/front-commerce/front-commerce/-/commit/6f83e7b889369efab8a2560c66a410a1b3a6f7db?page=2#92527070b393735c35c5825b3174987e566962e6)
- [\_modules.scss](https://gitlab.com/front-commerce/front-commerce/-/commit/6f83e7b889369efab8a2560c66a410a1b3a6f7db?page=2#f9a39a6723f4100486c2658dff702698421eae41)

If you are using theme chocolatine:

- [AccountNavigation](https://gitlab.com/front-commerce/front-commerce/-/commit/6f83e7b889369efab8a2560c66a410a1b3a6f7db?page=2#e7af65f5100c0e8b1d5bda98a735eb5744a44386)
- [AccountLayout](https://gitlab.com/front-commerce/front-commerce/-/commit/6f83e7b889369efab8a2560c66a410a1b3a6f7db?page=2#f7e1de354176dd6902903dc889133f0c5f2733e3)
- [EnhanceAccount](https://gitlab.com/front-commerce/front-commerce/-/commit/6f83e7b889369efab8a2560c66a410a1b3a6f7db?page=3#899be9e8de73bf492922cdfdd67ff14b859454a0)
- [\_modules.scss](https://gitlab.com/front-commerce/front-commerce/-/commit/6f83e7b889369efab8a2560c66a410a1b3a6f7db?page=2#ec9462e7d49a82bcb8c759d1fb734ce39160140b)

### PaymentMethodLabel relocated

The `<PaymentMethodLabel>` component was moved from `theme/modules/User/Order/OrderMethod/PaymentMethodLabel.js` to `theme/modules/Checkout/Payment/PaymentMethodLabel.js` the old location will still work but will output deprecation messages when used. If you have overriden `<PaymentMethodLabel>` you should also relocate your override to the same path and update all references to point to it.

As a consequence of relocating `<PaymentMethodLabel>` we had to rename all the translation keys it uses. As such the following translation keys have been updated

| Old Key                                                        | New Key                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| modules.User.Order.OrderMethod.PaymentMethod.checkmo           | modules.Checkout.Payment.PaymentMethodLabel.checkmo           |
| modules.User.Order.OrderMethod.PaymentMethod.ogoneFlexcheckout | modules.Checkout.Payment.PaymentMethodLabel.ogoneFlexcheckout |
| modules.User.Order.OrderMethod.PaymentMethod.paymentOnAccount  | modules.Checkout.Payment.PaymentMethodLabel.paymentOnAccount  |
| modules.User.Order.OrderMethod.PaymentMethod.paypalButton      | modules.Checkout.Payment.PaymentMethodLabel.paypalButton      |
| modules.User.Order.OrderMethod.PaymentMethod.paypalExpress     | modules.Checkout.Payment.PaymentMethodLabel.paypalExpress     |
| modules.User.Order.OrderMethod.PaymentMethod.paypalStandard    | modules.Checkout.Payment.PaymentMethodLabel.paypalStandard    |
| modules.User.Order.OrderMethod.PaymentMethod.payzenEmbedded    | modules.Checkout.Payment.PaymentMethodLabel.payzenEmbedded    |
| modules.User.Order.OrderMethod.PaymentMethod.stripe            | modules.Checkout.Payment.PaymentMethodLabel.stripe            |
| modules.User.Order.OrderMethod.PaymentMethod.hipay             | modules.Checkout.Payment.PaymentMethodLabel.hipay             |

All translation keys that start with `modules.User.Order.OrderMethod.PaymentMethod` now starts with `modules.Checkout.Payment.PaymentMethodLabel`. You need to update any use of the old keys (if any) in your project to the respective new key.

### Update your CSPs

In this release, we have removed most of the module-related CSPs from Front-Commerce default configuration file. If you are using one or more of the following modules, please do update your CSPs accordingly in your `config/website.js` configuration:

- `Google Analytics` or `Google Tag Manager` (see [analytics configuration](/docs/advanced/theme/analytics.html#Universal-Analytics-Google-Analytics))
- `Paypal` (see [Paypal configuration](/docs/advanced/payments/paypal.html#Update-your-CSPs))
- `Payzen` (see [Payzen configuration](/docs/advanced/payments/payzen.html#Update-your-CSPs))

### Removed deprecations in `Button` component

The properties that were tagged as deprecated in `theme/components/atoms/Button/Button.js` before version 2.0 have been removed in this release:

- `appearance` should now be used instead of `primary`, `icon`, `link` and `warning`.
- `state` should now be used instead of `disabled` and `pending`.

Please update your code to fit the new behavior.

### Code clean up

In this release, we have removed some dead and unused code ([see corresponding MR](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/967)):

- `src/theme/pages/Account/Account.js` that despites its name is not used at all and very unlikely to be used by any project
- some loadable routes from `src/web/LoadableRoutes.js` there were useless since the addition of file based routing in `2.0.0-rc.0`.

If you have trouble about those removals while upgrading, <span class="intercom-launcher">[contact us](mailto:support@front-commerce.com)</span>.

### Fixed the Front-Commerce B2B module's company credit display

In the account menu we displayed the company credit menu even for companies not allowed to pay on account.

If you overrode `modules/front-commerce-b2b/web/theme/pages/Account/FirstnameQuery.gql` add the following code

```diff
query Firstname {
  me {
    ...
    company {
      name
+      credit {
+        availableCredit {
+          amount
+        }
+      }
    }
  }
}
```

If you overrode `theme/modules/User/AccountNavigation/AccountNavigation.js` perform the following changes

```diff
...

const isCompanyUser = (user) => {
  return Boolean(user?.company);
};

+const isCompanyCreditsAllowed = (user) => {
+  return Boolean(user?.company?.credit);
+};

...
-     isCompanyUser(user) && {
+     isCompanyCreditsAllowed(user) && {
        value: "/user/company/credit",
        label: intl.formatMessage(messages.companyCredit),
      },
...
-       {isCompanyUser(user) && (
+       {isCompanyCreditsAllowed(user) && (
          <Route
            exact
            path={`${basePath}/company/credit`}
            children={({ match }) => (
              <Link to="/user/company/credit" className={makeClassName(match)}>
                {intl.formatMessage(messages.companyCredit)}
                <Icon icon="cash" title="" />
              </Link>
            )}
          />
...
```

### New features in `2.14.0`

- [Custom routable pages now supports dynamic GraphQL variables from URL](/docs/advanced/theme/route-dispatcher.html#Advanced-queries)
- [New `FRONT_COMMERCE_GRAPHQL_PERSISTED_QUERIES_DISABLE` environment variable for temporarily deactivating the GraphQL Persisted Queries feature](/docs/reference/environment-variables.html#Server)
- New Prismic module features:
  - Support for [trailing slashes](/docs/prismic/routable-types.html#Trailing-Slash)
  - Support for [path rewrites](/docs/prismic/routable-types.html#Path-Rewrites)
  - Exposed the `url` to the [Content type](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/loaders/Content.js)

> When a Prismic document has been registered using the [`registerRoutableType`](/docs/prismic/routable-types.html#registerRoutableType-options) method or the [`registerPrismicRoute`](/docs/prismic/routable-types.html#registerPrismicRoute-options) method, A `url` property is exposed in the [Content type object](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/loaders/Content.js). This property contains the resolved url of the document.

## `2.12.0` -> `2.13.0`

### Upgrade the Magento2 module

If you are using Magento2, version 2.6.0 of `front-commerce/magento2-module` is now the minimum required version. To update it to the latest version, from Magento2 root, you can run:

```sh
composer update front-commerce/magento2-module
```

<blockquote class="info">
You can refer to the `Magento2` module [changelog](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/blob/main/CHANGELOG.md) for the full details.
</blockquote>

### Upgrade the Prismic module

The `front-commerce-prismic` module is now using the latest version of prismic.

```sh
npm install git+ssh://git@gitlab.com/front-commerce/front-commerce-prismic.git#1.0.0
```

The most notable breaking changes is the removal of the `FRONT_COMMERCE_PRISMIC_URL` and the inclusion of the `path` option for the `registerRoutableType` method.

<blockquote class="info">
You can refer to the `front-commerce-prismic` module [changelog](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/CHANGELOG.md) for the full details.
</blockquote>

#### `FRONT_COMMERCE_PRISMIC_URL` has been removed

The environment variable `FRONT_COMMERCE_PRISMIC_URL` has been removed. Please use `FRONT_COMMERCE_PRISMIC_REPOSITORY_NAME` instead.

```diff
# .env
- FRONT_COMMERCE_PRISMIC_URL=https://my-repo.prismic.io
+ FRONT_COMMERCE_PRISMIC_REPOSITORY_NAME=my-repo
```

#### Improved the `registerRoutableType` method

- A new required property has been added for dynamic routes: `path` <br /> Examples: `/:uid`, `/:lang/:uid`, `/:category*/:uid`, `/:section/:category?/:uid`.

<blockquote class="info">
**ProTip :** You can use the online [express-route-tester@2.0.0](http://forbeslindesay.github.io/express-route-tester) to test your paths.
</blockquote>

- A new `resolvers` property to allow the nested routes content relationship resolution.

```diff
  PrismicLoader.registerRoutableType({
    typeIdentifier: "album", // document type "album" will resolve to path `/albums/:uid`
-   path: "/album/:uid",     // "/album/queen"
+   path: "/:category/:uid", // "/rock-and-roll/queen"
+   resolvers: {
+     category: "category"   // identifier of the Content Relationship in the album Custom Type
+   },
    ...
  })
```

<blockquote class="warning">
**Depth Limit** The Route Resolver is limited to retrieving data from 2 levels deep, please see the [Route Resolver example](https://prismic.io/docs/technologies/route-resolver-nuxtjs#route-resolver-examples) for more information.
</blockquote>

#### `@prismicio/client` has been updated to v6

See https://prismic.io/docs/technologies/prismic-client-v6-migration-guide for the complete migration guide

The new predicate object contains the same predicate functions as Predicates with new names to better match the API's predicate names.

```diff
- import { Predicates } from "@prismicio/client";
+ import * as prismic from "@prismicio/client";

const query = new ListQuery(10)

- query.addPredicate(prismic.Predicates.gt('my.movie.rating', 3))
+ query.addPredicate(prismic.predicate.numberGreaterThan('my.movie.rating', 3))
```

The following `predicates` have been renamed:

- `dayOfMonth` → `dateDayOfMonth`
- `dayOfMonthAfter` → `dateDayOfMonthAfter`
- `dayOfMonthBefore` → `dateDayOfMonthBefore`
- `dayOfWeek` → `dateDayOfWeek`
- `dayOfWeekAfter` → `dateDayOfWeekAfter`
- `dayOfWeekBefore` → `dateDayOfWeekBefore`
- `month` → `dateMonth`
- `monthBefore` → `dateMonthBefore`
- `monthAfter` → `dateMonthAfter`
- `year` → `dateYear`
- `hour` → `dateHour`
- `hourBefore` → `dateHourBefore`
- `hourAfter` → `dateHourAfter`
- `gt` → `numberGreaterThan`
- `lt` → `numberLessThan`
- `inRange` → `numberInRange`
- `near` → `geopointNear`

#### `prismic-dom` replaced with `@prismicio/helpers`

See https://prismic.io/docs/technologies/prismic-helpers-v2-migration-guide for the complete migration guide

### Added FlashMessages to the Order Details

For the HiPay payment method, FlashMessages may be shown at the order detail level for errors.

If you overrode `<OrderDetailsLayout>` add the following lines to it

```diff
+ import FlashMessages from "theme/modules/FlashMessages";
...
  return (
    <div
      className={classNames("order-details-layout", {
        "account-orders-details--no-actions": !showOrderActions,
      })}
    >
+  <FlashMessages />
...
```

### Login Form Update

For the external logins feature `<AdditionalLoginFormActions>` and `<FlashMessages>` have been added to the `<LoginForm>`.

If you overrode `<LoginForm>` please add the following lines to it

```diff
...
+import AdditionalLoginFormActions from "theme/modules/User/LoginForm/AdditionalLoginFormActions";
+import FlashMessages from "theme/modules/FlashMessages";
...
          {props.errorMessage && <ErrorAlert>{props.errorMessage}</ErrorAlert>}
+          <FlashMessages />
...
            </SubmitButton>
+            <AdditionalLoginFormActions />
          </FormActions>
...
```

### New icons required

In this release, these new icons were added `google`, `facebook` to the `<Icon>` component `theme/components/atoms/Icon/Icon.js`.

If you have overridden the `<Icon>` component, you need to add the icons as follows to the list of icons to avoid any error messages at page loading:

```diff

-import { FaUserCircle } from "react-icons/fa";
+import { FaUserCircle, FaFacebook, FaGoogle } from "react-icons/fa";

const keyToComponent = {
  ...
  organigram: GiOrganigram,
  gripper: VscGripper,
+  facebook: FaFacebook,
+  google: FaGoogle,
};
```

### New features in `2.13.0`

These new features may be relevant for your existing application:

- [Search for products, categories and pages with Algolia in Magento2 based project](/docs/magento2/search-engine.html#Algolia)
- [Search for categories and pages with Algolia in Magento1 based project](/docs/magento1/search-engine.html#Algolia)
- [Prismic Preview](/docs/prismic/preview.html)
- [HiPay payment method](/docs/advanced/payments/hipay)
- [Facebook and Google external logins](/docs/advanced/features/external-logins)

## `2.11.0` -> `2.12.0`

### Upgrade the Magento2 module

If you are using Magento2, version 2.5.0 of `front-commerce/magento2-module` is now the minimum required version. To update it to the last version, from Magento2 root, you can run:

```sh
composer update front-commerce/magento2-module
```

### Homogenize the `Map` components

To ensure a more consistent usage we have homogenize the props of the map components and we added a few fixes.

- The `LocationInternalShape` has been deprecated in favor of `LocationInputShape`.
- The `CoordinatesShape` now accepts either {`latitude`,`longitude`} or {`lat`,`lng`}.
- Included the `onBoundsChanged` prop in the `Map` components

> For a list of available props for the map and marker components see: [Display a map](/docs/advanced/features/display-a-map.html#component-props)

### `carousel` image format

To support [the Slider and Slider Magento2 page builder content types](/docs/magento2/page-builder.html), we have moved the `<Carousel />` component from theme chocolatine to the default theme. If you plan to use this component directly or through the page builder Slider, you must add a `carousel` image format to your `src/config/images.js`:

```
// sr/config/images.js
@@ -6,6 +6,7 @@ module.exports = {
     large: { width: 1100, height: 1100, bgColors: [] },
+    carousel: { width: 1280, height: 600, bgColors: [] },
     zoomable: { width: 1100, height: 1100, bgColors: [], sizes: [2] },
   },
 };
```

### `swatch` image format in base theme

We backported the `swatch` image format from theme chocolatine to base theme. This image format is used to display product images of a requisition list. If you are using the base theme and want to use the requisition list feature of the B2B module you have to add the swatch image format to your `src/config/images.js` as follows:

```
// sr/config/images.js
module.exports = {
  defaultBgColor: "FFFFFF",
  presets: {
...
+    swatch: { width: 26, height: 26, bgColors: [] },
...
  },
};

```

### Smarter image resizing mechanism

In this release, we have improved the image resizing mechanism to be bit smarter. Before this release, a check on the requested file extension was done before trying to resize an image. As of this release, this check has been removed and it's now up to the underlying image processing library to check if this file is a image or not. As a result, out of the box, more image file formats can be processed without any configuration. The `extensions` setting from `config/images.js` becomes useless and is now deprecated. You should remove it from your application:

```diff
// src/config/images.js
    large: { width: 1100, height: 1100, bgColors: [] }
  },
-  extensions: [".jpg", ".jpeg", ".png"]
};
```

### Added requisition list features to B2B module (only theme chocolatine suported)

If you are using base theme and wish to use the B2B module you have to override `theme/modules/ProductView/Synthesis/AddProductToCart.js` from the base theme and provide a way to add to requisition list from the product page (see [AddProductToRequisitionList](https://gitlab.com/front-commerce/front-commerce/-/blob/2.12.0/modules/front-commerce-b2b/web/theme/modules/RequisitionList/AddProductToRequisitionList/AddProductToRequisitionList.js) and [B2B's AddProductToCart](https://gitlab.com/front-commerce/front-commerce/-/blob/2.12.0/modules/front-commerce-b2b/web/theme/modules/ProductView/Synthesis/AddProductToCart.js) for inspiration). You also need to override `theme/modules/AddToCart/_AddToCart.scss` if you have not already and just copy the styles from the base theme to it (`src/web/theme/modules/AddToCart/_AddToCart.scss`).

If you are using theme chocolatine and have overridden `theme/modules/ProductView/Synthesis/AddProductToCart.js` and want to use the B2B module you need to apply the following change to it:

```diff
...
+import AddProductToRequisitionList from "theme/modules/RequisitionList/AddProductToRequisitionList";
...
      <AddToCart
        appearance={appearance}
        selectedOptions={selectedOptions}
        selectedCustomOptions={selectedCustomOptions}
        selectedBundleOptions={selectedBundleOptions}
        onProductAdded={onProductAdded}
        product={withComputedPrice(product)}
        label={intl.formatMessage(messages.addToCartLabel)}
        unavailableLabel={intl.formatMessage(messages.unavailableLabel)}
        actions={
-          withWishlist !== false && (
+          <>
+            {withWishlist !== false && (
              <AddProductToWishlist
                sku={product.sku}
                selectedOptions={selectedOptions}
                selectedCustomOptions={selectedCustomOptions}
                selectedBundleOptions={selectedBundleOptions}
                size="big"
              />
-            )
+            )}
+            <AddProductToRequisitionList
+              product={product}
+              selectedConfigurableOptions={selectedOptions}
+              size="big"
+            />
+          </>
        }
      />
...
```

If you overrode `theme/modules/Cart/CartTitle/CartTitle.js` you need to apply the following diff to it:

```diff
...
+import AddCartToRequisitionList from "../../RequisitionList/AddCartToRequisitionList";
...
        <FormActions appearance="center">
+          <AddCartToRequisitionList cart={props.cart} size="big" />
          {hasCartError ? (
            <Button onDisableClick={() => {}} state="disabled">
              <ProceedToCheckout />
            </Button>
          ) : (
            <Link to="/checkout" buttonAppearance="primary">
              <ProceedToCheckout />
            </Link>
          )}
        </FormActions>
...
```

### Cookies max age configuration

The `cookieMaxAgeInMonths` configuration in `src/config/website.js` represents the consent cookie's maxage in months. It now has a default value of **12 months**. Previously if left unconfigured the cookie banner will appear to users every time they visit the site.

#### New links added to `<AccountNavigation>`

The company structure and requisition list links are added to the `<AccountNavigation>` component. Those links are part of the B2B features so if you need them and overrode the `<AccountNavigation>` component you need to apply the below diff to your overridden `<AccountNavigation>`:

<details>
<summary><strong>"AccountNavigation" diff (click to expand diff)</strong></summary>

```diff
import React from "react";
...

const messages = defineMessages({
...
+  companyStructureLink: {
+    id: "pages.Account.Navigation.companyStructure",
+    defaultMessage: "Company structure",
+  },
...
+  requisitionListsLink: {
+    id: "pages.Account.Navigation.requisitionLists",
+    defaultMessage: "Your requisition lists",
+  },
...
});

...

export const MobileSelector = injectIntl(
  ({
    intl,
    location,
    ordersCount,
    storeCredit,
    wishlist,
+    requisitionList,
    user,
    returnMerchandiseAuthorization,
  }) => {
    const companyRoutes = isCompanyUser(user)
      ? [
...
+          {
+            value: "/user/company/structure",
+            label: intl.formatMessage(messages.companyStructureLink),
+          },
        ]
      : [];

    const routes = [
...
+      requisitionList?.isFeatureActive && {
+        value: "/user/requisition-lists",
+        label: intl.formatMessage(messages.requisitionListsLink),
+      },
...
    ].filter(Boolean);
...
  }
);

...

export const DesktopLeftMenu = injectIntl(
  ({
    intl,
    basePath,
    ordersCount,
    storeCredit,
    wishlist,
    user,
+    requisitionList,
    returnMerchandiseAuthorization,
  }) => {
    return (
      <nav className="account-navigation">
...
        {isCompanyUser(user) ? (
          <>
...
+            <Route
+              exact
+              path={`${basePath}/company/structure`}
+              children={({ match }) => (
+                <Link
+                  to="/user/company/structure"
+                  className={makeClassName(match)}
+                >
+                  {intl.formatMessage(messages.companyStructureLink)}
+                  <Icon icon="organigram" title="" />
+                </Link>
+              )}
+            />
          </>
        ) : null}

...

+        {requisitionList?.isFeatureActive && (
+          <Route
+            path={`${basePath}/requisition-lists`}
+            children={({ match }) => (
+              <Link
+                to="/user/requisition-lists"
+                className={makeClassName(match, ordersCount === 0)}
+              >
+                {intl.formatMessage(messages.requisitionListsLink)}
+                <Icon icon="list" title="" />
+              </Link>
+            )}
+          />
+        )}
...
      </nav>
    );
  }
);
```

</details>

### New style sheets

If you overrode `theme/components/_components.scss` you need to add the following line to it

```scss
@import "~theme/components/molecules/LoadingOverlay/LoadingOverlay";
@import "~theme/components/molecules/SelectMenu/SelectMenu";
```

If you overrode `theme/components/_modules.scss` you need to add the following line to it to use the `<ProductPicker>` component (used by [the QuickOrder feature](/docs/advanced/features/quickorder.html))

```scss
@import "~theme/modules/ProductPicker/ProductPicker";
```

If you are using the B2B module and overrode `theme/_b2b.scss` you need to add the following lines to it

```scss
@import "~theme/components/organisms/Tree/Tree";
@import "~theme/modules/Company/CompanyStructure/CompanyStructure";
@import "~theme/modules/RequisitionList/RequisitionList";
@import "~theme/modules/RequisitionList/RequisitionListTable/RequisitionListTable";
```

If you overrode `src/web/theme/components/atoms/Button/_Button.scss` apply the following diff to it:

<details>
<summary><strong>Diff for base theme</strong></summary>

```diff
...
+.button--disabled {
+  &:hover,
+  &:focus {
+    background: $white;
+  }
+}
...
.button--disabled {
+  &,
+  &:hover,
+  &:focus,
+  &:active {
+    background: $white;
+    text-decoration: none;
    cursor: not-allowed;
    border-color: $shade04;
    background: $white;
    color: $shade04;
    &.button--primary {
      border-color: $shade04;
      background: $shade04;
      color: $white;
    }
    &.button--icon {
      background: transparent;
      color: $shade04;
    }
+  }
}
```

</details>

<details>
<summary><strong>Diff for theme chocolatine</strong></summary>

```diff
...
.button--disabled {
  border-color: $shade03;
  &:hover,
- &:focus {
+ &:focus,
+ &:active {
    background: $white;
  }
}
...
.button--disabled {
-  cursor: not-allowed;
-
-  &,
-  &:hover {
+  &,
+  &:hover,
+  &:focus,
+  &:active {
+    text-decoration: none;
+    cursor: not-allowed;
    border-color: $shade03;
    background: $white;
    color: $shade03;
    &.button--primary {
      border-color: $shade03;
      background: $shade03;
      color: $fontColor;
    }
  }
}
```

</details>

if you overrode `theme/modules/AddToCart/_AddToCart.scss` and are using theme chocolatine apply the following diff to it:

```diff
...
  &__actions {
    display: none;
    padding: math.div($boxSizeMargin, 2);

    @media screen and (min-width: $menuBreakpoint) {
      display: block;
    }
  }

  &__actions {
-    display: none;
+    display: flex;
    padding: math.div($boxSizeMargin, 2);

-    @media screen and (min-width: $menuBreakpoint) {
-      display: block;
-    }
+    > * {
+      margin-left: math.div($boxSizeMargin, 2);
+    }
+    :first-child {
+      margin-left: 0;
+    }
  }...
```

### New icons required

In this release, these new icons were added `eye-off`, `user-circle`, `organigram` and `gripper` to the `<Icon>` component `theme/components/atoms/Icon/Icon.js`.

If you have overridden the `<Icon>` component, you need to add the icons as follows to the list of icons to avoid any error messages at page loading:

```diff
import {
  ...
+ IoIosEyeOff,
} from "react-icons/io";
+import { FaUserCircle } from "react-icons/fa";
+import { GiOrganigram } from "react-icons/gi";
+import { VscGripper } from "react-icons/vsc";

const keyToComponent = {
  ...
  eye: IoIosEye,
+ "eye-off": IoIosEyeOff,
  pencil: IoMdCreate,
  ...
+  "user-circle": FaUserCircle,
+  organigram: GiOrganigram,
+  gripper: VscGripper,
};
```

### Password field updated with a show/hide feature

The `<Password>` input now displays a show/hide icon allowing users to reveal their password. It is enabled by default. You can opt-out this feature using the `disableShowPassword` prop:

```diff
<Password
  id="password"
  name="password"
  required
+ disableShowPassword
/>
```

This new `Password` component requires a stylesheet to add in the `_components.scss` file if you overrode it.

```diff
// theme/components/_components.scss
...
@import "~theme/components/atoms/Form/Label/Label";
+@import "~theme/components/atoms/Form/Input/Password/Password";
@import "~theme/components/atoms/Form/Input/Select/Select";
...
```

If you overrode the `_Input.scss` file, you may need to indicate the inputs height by adding an `input-height` class to correct the vertical alignment of the icon.

```diff
// theme/components/atoms/Form/Input/_Input.scss
input,
+.input-height,
select {
  height: 3.4rem;
}
```

### New `<PasswordStrengthHint>` component in default forms

We've included a `<PasswordStrengthHint>` to provide a better feedback to users about the expected password complexity.

> If you don't want to use this feature in your application, please follow the [Disable password strength hints](/docs/advanced/features/password-fields.html#disable-password-strength-hints) guide

Please update the files below, to ensure that your application displays user forms consistently:

```diff
// theme/components/_components.scss
+@import "~theme/components/atoms/Form/Input/PasswordStrengthHint/PasswordStrengthHint";
+@import "~theme/components/atoms/ProgressStatus/ProgressStatus";
```

```diff
// theme/components/atoms/Form/Input/index.js
+import PasswordStrengthHint from "./PasswordStrengthHint";

export {
  ...
+ PasswordStrengthHint,
};
```

You should add the `<PasswordStrengthHint>` component in every override using the `<Password>` input. In the default theme, the following components were affected:

- `theme/modules/User/RegisterForm/RegisterForm.js`
- `theme/pages/Account/Information/ChangeUserPasswordForm.js`
- `theme/pages/PasswordManagment/PasswordReset/PasswordReset.js`
- `theme/modules/User/PasswordManagement/PasswordResetForm/PasswordResetForm.js`

Here is an example of the changes involved to use this component (usually added after the `<Password>` field):

```diff
+import PasswordStrengthHint from "theme/components/atoms/Form/Input/PasswordStrengthHint/PasswordStrengthHint";

<Password
  name="password"
  ...
/>
+ <PasswordStrengthHint
+  formValuePath="password" // must equal the password name value
+/>
```

### `passwordValidation` deprecation

The file `theme/components/atoms/Form/Input/Password/passwordValidation.js` is now deprecated. If you overrode it, you must also override the password validity configuration in `theme/components/atoms/Form/Input/Password/passwordConfig.js` (introduced in this release).

See [the password field's documentation](/docs/advanced/features/password-fields.html#configure-password-validity) for more details on the password field validation configuration.

If you overrode some of the following components:

- `theme/modules/User/RegisterForm/RegisterForm.js`
- `theme/pages/Account/Information/ChangeUserPasswordForm.js`
- `theme/pages/PasswordManagment/PasswordReset/PasswordReset.js`
- `theme/modules/User/PasswordManagement/PasswordResetForm/PasswordResetForm.js`

You must use the new `src/web/theme/components/atoms/Form/Input/Password/passwordFieldValidator.js` instead of the deprecated `passwordValidation` as follow:

```diff
-import {
-  isPasswordValid,
-  errorMessage,
-  MIN_PASSWORD_LENGTH,
-  MIN_CHAR_CLASSES,
-} from "theme/components/atoms/Form/Input/Password/passwordValidation";
+import {
+  passwordValidationRules,
+  passwordValidationErrors,
+} from "theme/components/atoms/Form/Input/Password/passwordFieldValidator";

...

<Password
  name="password"
- validations={{
-   magentoPasswordRule: (_, value) => isPasswordValid(value),
- }}
+ validations={passwordValidationRules}
- validationError={intl.formatMessage(errorMessage, {
-   minLength: MIN_PASSWORD_LENGTH,
-   minClasses: MIN_CHAR_CLASSES,
- })}
+ validationError={passwordValidationErrors}
/>
```

### New Confirmation Modal

We added a new `<ConfirmationModal>` in `theme/components/organisms/Modal`.
If you overrode the `theme/components/organisms/Modal/index.js` file please add the following lines to ensure that the confirmation modal works :

```diff
+import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";

-export { CloseModal };
+export { CloseModal, ConfirmationModal };
```

### New features in `2.12.0`

These new features may be relevant for your existing application:

- Page builder: Slider content type and Slide support
- the `<Password>` component now allows the user to reveal the password
- New component: `<PasswordStrengthHint>` to show hints of password's strength criterias to the user
- New component: `<ProgressStatus>` to show a progressbar with a label
- New component: `<ConfirmationModal>` to simplify confirmation modals

## `2.10.0` -> `2.11.0`

### Zoom-in on product images

In this release, we have added the ability for customers to zoom in on product images in the product page. For that, we have implemented [a `<Ligthbox />` component](https://magento2.front-commerce.app/styleguide/?path=/story/modules-organisms-lightbox--with-images) that leverages [react-image-lightbox library](https://www.npmjs.com/package/react-image-lightbox) behind the scene.

This feature is enabled by default in both in theme Chocolatine and in the base theme. **You MUST decide whether you want it or not and follow the related instructions below:**

- [Integrating the zoom in feature](#Integrating-the-zoom-in-feature)
- or [Disabling the zoom in feature](#Disabling-the-zoom-in-feature)

#### Disabling the zoom in feature

This feature is controlled by the `enableZoomOnImage` property of the product `<Gallery />` component in the base theme or the `<GalleryWithCarousel />` component in theme Chocolatine. So If you want to disable this feature and one of these components is used in your integration, you can pass `false` in the `enableZoomOnImage` property.

<blockquote class="note">
In the base theme, the `<Gallery />` component is rendered by `theme/modules/ProductView/ProductView`, while in theme Chocolatine, the `<GalleryWithCarousel />` is rendered by `theme/modules/ProductView/Gallery/Gallery`.
</blockquote>

#### Integrating the zoom in feature

If you want to add that feature to your project you have to define an image format named `zoomable`. For instance, we have added one in [the last version of the Skeleton](https://gitlab.com/front-commerce/front-commerce-skeleton/-/commit/4b0d4175f9468c47e1a9af9329f3856c2b00c025) but the actual format parameters depends on your project constraints.

<blockquote class="note">
`zoomable` is the default image format used by the `<Lightbox />` component to render the image on which the customer can zoom in. This component accepts an `imageFormat` property in which you can pass an other image format.
</blockquote>

Then, depending on the amount of customization, you might also have to bring changes similar to what we have done in the merge requests for that feature:

- https://gitlab.com/front-commerce/front-commerce/-/merge_requests/699/diffs
- https://gitlab.com/front-commerce/front-commerce/-/merge_requests/717/diffs
- https://gitlab.com/front-commerce/front-commerce/-/merge_requests/719/diffs

In a nutshell, when the feature is enabled, we place a transparent button on top of the product image; if the customer clicks on it, we then render a `<Lightbox />` for that image.

### MondialRelay shipping in a Magento2 based project

In this version, we have improved the MondialRelay shipping support with Magento2 so that a customer can only choose a pickup point suitable for the products being ordered. This improvement requires an update of Magentix's module to [install at least the version 100.10.7](/docs/advanced/shipping/mondial-relay.html#Integrate-with-Magento2).

### New icons required

In this release, two new icons (`warn` and `users`) were added to [the `<Icon>` component](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/web/theme/components/atoms/Icon/Icon.js).

If you have overridden the `<Icon>` component, you need to add both icons as follows to the list of icons to avoid any error messages at page loading:

```diff
import {
  ...
+ IoIosWarning,
+ IoIosPeople,
} from "react-icons/io";

const keyToComponent = {
  ...
+ warn: IoIosWarning,
+ users: IoIosPeople,
};
```

### Dependencies updates

**We recommend to reformat your source code using the latest Prettier version** (see below).

Here are some highlights of the main changes in upstream libraries that _unlikely may_ impact your application. We have tested them and haven't found any regression, but we prefer to mention these changes in case you detect a weird issue after upgrading:

- `axios` does not append the `charset=utf-8` anymore for requests with `Content-Type:application/json`. See [#680](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/680#note_711807434), [#4016](https://github.com/axios/axios/issues/4016) and [#2154](https://github.com/axios/axios/issues/2154) and for details.
- `prettier` has been updated [from 2.2.1 to 2.4.1](https://github.com/prettier/prettier/blob/main/CHANGELOG.md) ([MR!742](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/742)). We've reformatted our code with this version, so it may lead to style differences with your overrides. To update your application code, you can run `npx prettier -w ./path/to/your/directories` and commit the changes.

> ProTip™: we've discovered the [git `ignoreRevsFile` option](https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---ignore-revs-fileltfilegt) it could be useful [in your project too](https://www.moxio.com/blog/43/ignoring-bulk-change-commits-with-git-blame) 😎

### Unnecessary safeHtml in product overviews

The product overview component does not need to escape the product name with `safeHtml`.

If you did override any of the following components, you can safely [remove `safeHtml` calls](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/750) in them:

- `src/web/theme/modules/ProductView/Overview/Overview.js`
- `theme-chocolatine/web/theme/modules/ProductView/ProductItem/Overview/Overview.js`

```diff
- {<span dangerouslySetInnerHTML={{ __html: safeHtml(name) }} />}
+ {name}
```

### New Magento `<WysiwygV2>` transforms may conflict with yours

In order to support Magento Page Builder's default content types, we have added new components to the [default `MagentoWysiwyg` transforms](/docs/advanced/theme/wysiwyg-platform.html#MagentoWysiwyg).

See [the Page Builder ones](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/web/theme/modules/WysiwygV2/MagentoWysiwyg/PageBuilder/index.js) and ensure there is no collision with your custom WYSIWYG components. While very unlikely, it could be possible. For instance, if you may have overridden the `theme/modules/WysiwygV2/MagentoWysiwyg/MagentoWysiwyg.js` to add a custom `heading` component to the `componentsMap`.

### New features in `2.11.0`

These new features may be relevant for your existing application:

- [Magento2 B2B initial support](/docs/magento2/b2b.html) and [_Payment on account_ payment method support](/docs/advanced/payments/payment-on-account.html)
- [A quickorder module has been created to order by SKU](/docs/advanced/features/quickorder.html)
- Customer can now zoom in on product images in the product page
- [Magento Page Builder content](/docs/magento2/page-builder.html) is now supported for `MagentoWysiwyg` data. You can register new content types and extend our default ones.
- Front-Commerce dependencies are now regularly (and automatically) updated using [Depfu](https://depfu.com/). Patches are automatically applied if the CI is green, minor versions are manually approved. We always review changelogs provided by Depfu. **You can review updates any time [by filtering Merge Requests tagged `depfu`](https://gitlab.com/front-commerce/front-commerce/-/merge_requests?scope=all&state=merged&label_name[]=depfu).**

## `2.9.0` -> `2.10.0`

### Magento1 MondialRelay module update

In this release we have added support for MondialRelay as a shipping method in Magento2 based Front-Commerce implementation. As a result, we have changed the way files are organized on the disk.

In a nutshell, the Front-Commerce module `modules/shipping-mondialrelay-magento1` has been renamed to `modules/shipping-mondialrelay` and this module was defining a GraphQL module that has been renamed from `mondialrelay` to `magento1-mondialrelay`. So, if you are upgrading a Magento1 based project using the MondialRelay module, you have to update your `.front-commerce.js` as documented in [the MondialRelay guide page](/docs/advanced/shipping/mondial-relay.html#Integrate-with-Magento1). In addition, if you have custom code importing files from `modules/shipping-mondialrelay-magento1`, you will also have to update those imports to match the new file layout.

### Magento2 Adyen module update

In this release the Magento2 Adyen Front-Commerce module got a major revamp to make it compatible with the latest Magento2 Adyen plugin (7.2). Several steps are needed to upgrade your project if you are using this payment platform:

1. the Magento2 Adyen Front-Commerce module has been moved. As a result, you have to [update your `.front-commerce.js` as documented in the Adyen integration page](/docs/advanced/payments/adyen.html#Register-the-Adyen-for-Magento2-payment-module-in-Front-Commerce).
1. the `FRONT_COMMERCE_ADYEN_CLIENT_KEY` environment variable is now required so you have [to configure the environment so that it is defined](/docs/advanced/payments/adyen.html#Add-the-Adyen-client-key-in-the-environment)
1. we have made some changes and fixes to [the Adyen related frontend components](https://gitlab.com/front-commerce/front-commerce/-/tree/2.10.0/modules/payment-adyen/web/theme/modules/Adyen). If you have overridden some of those, you have to backport the changes.

### Magento1 Payline module update

In this release, we've implemented automatic configuration for the Payline environment from the related Magento setting.
Payline will use the `HOMO` or `PRODUCTION` environment based on what is configured in Magento.

If using Payline, you should update the Magento module to version [1.3.0](https://github.com/front-commerce/magento1-module-payline-front-commerce/releases/tag/1.3.0).
If you don't, you will see the error below in your logs (and the `PRODUCTION` environment will be used):

> ERROR on reorderForIds, the id payment/payline_common/environment has no associated result

### Configurable options HOC refactoring

**We highly recommend to test products configuration on the product and cart pages after this migration.** Product configuration, bundle and custom options selectors where homogeneized between these pages to fix some issues.

In this release we have done a refactor of the configurable product options. We have extracted much of the logic from configurable product options from HOCs into functions that can be used even outside of react.

This refactoring homogenized how options were used and allowed us to fix some discrepancies between the product page and cart item update configurators. Internal APIs were updated to cope with this change, and we deprecated some legacy props.

#### CartItemOptionsUpdater needs `product` prop

`<CartItemOptionsUpdater>` now expects a `product` prop if you are using it you should now send it the `product` as a prop like below:

```diff
-<CartItemOptionsUpdater {...props} />
+<CartItemOptionsUpdater product={product} {...props} />
```

#### ConfigurableOptions needs `selectedOptions` and deprecates `currentOptions`

`currentOptions` is deprecated in `<ConfigurableOptions>` (format `{ optionLabel: valueLabel }`). `<ConfigurableOptions>` now expects `selectedOptions` (format `{ optionId: valueId }` same as what `useSelectedProductWithConfigurableOptions` returns)

```diff
-<ConfigurableOptions currentOptions={currentOptions} {...props} />
+<ConfigurableOptions selectedOptions={selectedOptions} {...props} />
```

#### New style sheet for `CartItemOptionsUpdater`

add the following line to `theme/modules/_modules.scss`

```scss
@import "~theme/modules/Cart/CartItem/CartItemOptionsUpdater/CartItemOptionsUpdater";
```

#### Import `hasCartItemOptions` from its own file in theme chocolatine

We refactored `hasCartItemOptions` from `theme/modules/Cart/CartItem/CartItemOptions/CartItemOptions` to `theme/modules/Cart/CartItem/CartItemOptions/hasCartItemOptions` so if you where using it you need to change where you are importing if like below:

```diff
-import { hasCartItemOptions } from "theme/modules/Cart/CartItem/CartItemOptions/CartItemOptions";
+import hasCartItemOptions from "theme/modules/Cart/CartItem/CartItemOptions/hasCartItemOptions";
```

### SmartForms field internal changes

In this release, we've reworked the internals of SmartForm fields to better support browser autocomplete.

The public API remains unchanged but if you've overriden internal components, please check your overrides against their original. See these Merge Requests: [#641](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/641) and [#645](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/645)

### New features in `2.10.0`

These new features may be relevant for your existing application:

- [Front-Commerce is now compatible with the latest Magento2 Adyen plugin](/docs/advanced/payments/adyen.html)
- [MondialRelay shipping method support in Magento2](/docs/advanced/shipping/mondial-relay.html#Integrate-with-Magento2)
- [A new hook to homogenize configurable options handling](/docs/reference/use-selected-product-with-configurable-options.html)

## `2.8.0` -> `2.9.0`

### Sass Update

We have updated sass to its last stable version (1.36). In the 1.33 version, [`/` as division has been deprecated](https://sass-lang.com/documentation/breaking-changes/slash-div), as a result when upgrading to 2.9, you might see some deprecation warnings when starting Front-Commerce. To avoid those warnings, you can use the sass-migrator script to automatically fix your Sass files:

```sh
npx sass-migrator division --no-multiplication src/web/**/*.scss
```

### Customs options `price` and `price_type` field deprecations

<blockquote class="important">
This features requires an up-to-date Magento module, for Magento1 you need at least [the version 1.3.3](https://gitlab.com/front-commerce/magento1-module-front-commerce/-/releases/1.3.3) while for Magento2, the minimum required version is [the 2.5.0](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/releases/2.5.0).
</blockquote>

As of the version 2.9.0, the `price` and `price_type` fields of the types `ProductCustomOption` and `ProductCustomOptionValue` have been deprecated in order to provide both the price including and excluding taxes for each options. Custom options prices or rate are now carried by the `extraCost` field available in those types. To stop using those deprecated fields, the following files have been modified:

- `theme/modules/Cart/CartItem/CartItemOptionsUpdater/CartItemOptionsUpdaterFragment.gql`
- `theme/components/organisms/Configurator/ProductConfiguratorFragment.gql`
- `theme/components/organisms/Configurator/CustomOption/CustomOptionLabelWithPrice.js`
- `theme/modules/ProductView/withSelectedCustomOptions.js`

So if you have overridden those files, you have to apply [the same update than the one done in Front-Commerce](https://gitlab.com/front-commerce/front-commerce/-/commit/71ddc7be40df3fb05574bb46b39becbed12cf5ef?merge_request_iid=622).

We highly recommend you to test your product and cart pages for products with custom options of both "fixed price" and "percentage" types if your project makes use of this Magento feature.

### Prismic legacy features removed

In order to make code more maintainable, we've removed two legacy features from the Prismic module:

- Default CMS module
- Default GraphQL remote schema stitching

It is very unlikely that you were using these features but if you did, please read [the related Merge Request](https://gitlab.com/front-commerce/front-commerce-prismic/-/merge_requests/43) for replacement options.

### Front-Commerce Payment module

We've extracted payment related code from Magento 1 and Magento 2 modules into a platform agnostic Front-Commerce Payment module.
While we paid attention to backwards compatibility, if you implemented payment methods in Front-Commerce we recommend that you test them once again.

The `PaymentLoader` is not exported by default from `server/modules/magentoX/checkout/loaders`. We recommend that you use the loader in `server/modules/front-commerce/payment/loaders` now. To reuse the exact same (deprecated) code, you will have to update your import as below:

```diff
- import { PaymentLoader } from "server/modules/magentoX/checkout/loaders";
+ // TODO use server/modules/front-commerce/payment/loaders
+ import PaymentLoader from "server/modules/magentoX/checkout/loaders/payment";
```

Migration will depends on what you've implemented. Please contact us if you have any questions.

### Dedicated Payment logs

In this release, we've split payment related logs from other server logs. The goal is to allow integrators to have different logging strategies to investigate and audit payment interactions more easily.

By default, a new `logs/payment.log` file will be used, but you will see a warning:

> You do not have any logging configuration or your configuration is invalid for the "payment" log context. […]

To remove this warning please update your `src/config/logging.js` configuration file with a new `payment` entry:

```diff
module.exports = {
  server: [
    {
      type: "file",
      filename: "server.log",
    },
  ],
+  payment: [
+    {
+      type: "file",
+      filename: "payment.log",
+    },
+  ],
  client: [
```

### Magento 1 module update may be needed

We added caching in the default Magento 1 category listing page.

If you're not relying on a search datasource for this page (facets etc…), you must ensure that the Magento 1 module is up-to-date (1.4.0+). Starting from 1.4.0, the module will invalidate the product list cache whenever a product is updated.

### New features in `2.9.0`

These new features may be relevant for your existing application:

- For custom options, the Graph now exposes an `extraCost` field where you can find the rate to apply or the prices including and excluding taxes of each option and value.
- Prismic API calls are now cached using the `PrismicAPI` dataloader. Ensure your `caching.js` config supports this key if you want to benefit from it. A specific `front-commerce:prismic:cache` debug flag allows you to view usage information. The new`FRONT_COMMERCE_PRISMIC_API_CACHE_TTL_IN_SECONDS` environment variable allows to change [the default TTL configuration](/docs/prismic/installation.html#Configure-the-environment-for-Prismic).
- New logger dedicated to payments. If you maintain a custom Front-Commerce payment implementation you might want to use the new `loaders.Payment.getLogger()` method to inject this logger instead of using `winston`.

## `2.7.0` -> `2.8.0`

### Ensure your pages will be rendered server side

We've added a guard to ensure that Server Side Rendering [is only tried for relevant pages](/docs/advanced/theme/server-side-rendering.html#Restrictions-on-pages-that-will-be-server-rendered). Front-Commerce will now only render pages on the server for URLs that have **no extension** or the `.html` extension.

If your application contains pages whose URL have extensions other than `.html`, please contact us.

### New features in `2.8.0`

These new features may be relevant for your existing application:

- reduce CPU usage by [deactivating response compression](/docs/advanced/performance/deactivating-unnecessary-features.html#Deactivate-response-compression)

## `2.6.0` -> `2.7.0`

### Support serving assets from a CDN or different domain

To allow [serving assets from a custom domain (e.g. a CDN)](/docs/advanced/performance/assets-cdn-domain.html), we had to do some changes to our themes' `template/index.html`, `template/error.html` and `core/shop/ShopQuery.gql`, so if you have overridden one of those files, you have to apply [similar changes](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/557/diffs):

1. in `index.html`, make sure there's a `script` tag defining `window.__ASSETS_BASE_URL__` for instance right after the one defining `window.__BASE_URL__`:
   ```html
   <script>
     window.__ASSETS_BASE_URL__ = "%%__ASSETS_BASE_URL__%%";
   </script>
   ```
1. in both `error.html` and `index.html`, make sure `<link>`s reference external assets with `%%__ASSETS_BASE_URL__%%` instead of `%%__BASE_URL__%%`
1. in `ShopQuery.gql`, add `imageBaseUrl` to the list of requested fields

### `FRONT_COMMERCE_FAST` mode removed

Introduced in version 2.0, this experimental flag could help improving SSR performance by only executing the top level GraphQL query.
It could lead to issues, and was not a huge performance boost.

Since 2.6, one can use [Cache-Control headers](/docs/advanced/performance/cache-control-and-cdn.html) to achieve the same goal in a more efficient manner. For this reason, we've removed the `FRONT_COMMERCE_FAST` SSR mode.

You should remove `FRONT_COMMERCE_FAST` from your environment variables. It is now unused.

### EXIF orientation now honored for images

Images having an EXIF orientation metadata are now properly rotated and optimized by [the media middleware](/docs/advanced/production-ready/media-middleware.html).
It will solve issues with existing media, but one must keep in mind that it may lead to an orientation different from previous versions.

See [the related Merge Request](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/544) for details.

### Canonical URLs

In this release, we have changed both the default theme and the theme chocolatine to add the canonical URL to the category, cms, product and home pages. For the category, cms and product pages, the [`CategorySeo`](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/519), [`CmsPageSeo`](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/513) and [`ProductSeo`](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/498) components have respectively been modified, so if you have overridden one of those, you might want to synchronize your own version with these changes. For the home page, we have introduced the [`HomeSeo`](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/511) component that you might want to use on own home page implementation.

### More reliable facets generation with Elasticsearch

As of the 2.7 version, Front-Commerce fetches the attributes on which facets can be generated from Magento (for both version 1 and 2). Previously, the implementation was relying on an attribute added in the Elasticsearch index by the ElasticSuite module to figure out which ones can be used to generate facets. This could lead to wrong Elasticsearch queries and it was common to have to ignore some attributes using [the `search.ignoredAttributeKeys` configuration](/docs/reference/configurations.html#config-website-js). As a result, when upgrading to 2.7:

1. make sure the attributes on which you want some facets are configured so that _Use in Layered Navigation_ is set to _Filterable (with results)_
1. if you need to have an attribute configured this way but still want to ignore it in the facets, you can add it to the `search.ignoredAttributeKeys` configuration
1. you can remove attribute codes that are not "Used in Layered Navigation" from the `search.ignoredAttributeKeys` configuration. They were probably text fields added here to prevent incorrect Elasticsearch queries (`description`, `short_description`,…)

### `pact` 4.x dependency removed

If your application contains Pact tests and you saw the following deprecation message in your current version, you will have an action to do during this migration:

> server/model/**fixtures**/provider/makeDescribeWithProvider deprecated Will be removed in 3.0.0. Please update your tests by moving them in a `__pacts__` directory and setup interactions in each test. Front-Commerce will setup everything for you, using the latest @pact-foundation/pact library.

The warning warns about usage of a deprecated `makeDescribeWithProvider` helper used by Front-Commerce when you import `describeWithProvider` directly in a test from a `__tests__` server directory.

```
// DEPRECATED
import { describeWithProvider } from "server/model/__fixtures__/provider/magento2";
```

Since [Front-Commerce 2.0.0](https://gitlab.com/front-commerce/front-commerce/commit/f69fd72717e99040e7e613705752f1175f589509), we use the latest `@pact-foundation/pact` library. Front-Commerce's [`test` CLI command](/docs/reference/cli.html#front-commerce-test) will automatically provide a `describeWithProvider` function in your tests from the `__pacts__` directory. It runs Pact tests in a more stable way and is the recommended way to use Pact in your application.

We've finished to update all of our internal tests to this latest version and have removed the direct dependency to the old Pact version to prevents downloading the Pact binary twice during an `npm install`. Your tests using the deprecated `describeWithProvider` will now fail unless you:

- add the dependency back to your project
- or (**RECOMMENDED**) you move your tests to a `__pacts__` directory and update them a bit. See [commits from our own migration](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/520/commits) (especially [this one](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/520/diffs?commit_id=f195479395a51f62664ca5522e0915f345ff22b4)) for examples and details.

### `root_categories_path` configuration removed

The `root_categories_path` configuration key from `website.js` is not used any more. **You can remove it from your codebase** after ensuring you didn't use it for application specific code.

It was first introduced for the navigation menu in Magento GraphQL modules (then unused), but used for breadcrumbs. We've reworked how breadcrumbs are generated from the category "path" value returned by magento to make it useless. We now always remove the first two category levels of the path, no matter their values. It prevent userland errors due to a misconfiguration of their app.

### Payzen / Lyra Collect URL changes

We've consolidated the Payzen module to support Lyra Collect. Both products are based on the same APIs and client libraries, but loaded from different sources. It appeared that we were using a mix of both URLs, and we've cleaned this a bit.

If you use Payzen as Front-Commerce embedded payment method you must:

- update your `config/website.js` CSP configurations
- ensure that the `PayzenEmbeddedQuery` query contains the `assetsBaseUrl` field

#### CSP configurations update

Replace `api.payzen.eu` and `api.lyra.com` in your `config/website.js` file with the `static.payzen.eu` domain to ensure that the CSPs will allow to load the payment form assets. **Please do a test payment to ensure that everything is working as expected**.

If you are using Lyra Collect, use the `api.lyra.com` value as per [our documentation](/docs/advanced/payments/payzen.html#Lyra-Collect-supportq)

#### `PayzenEmbeddedQuery` query update

If you have overridden `modules/Checkout/Payment/AdditionalPaymentInformation/PayzenEmbeddedForm/PayzenEmbeddedQuery.gql`, please update it as follow:

```diff
query PayzenEmbeddedQuery {
  shop {
    id
    locale
  }
  cart {
    id
    payZenEmbedded {
      formToken
      publicKey
+      assetsBaseUrl
    }
  }
}
```

and ensure that the `modules/Checkout/Payment/AdditionalPaymentInformation/PayzenEmbeddedForm/PayzenScriptWrapper.js` is not overridden either (very unlikely).

### Core Form atoms updated

The following core atoms where updated to accomodate the SmartForms functionality:

1. `BaseInput.js`
2. `FormComponent.js`
3. `Input.js`
4. `Textarea.js`

If you have overridden any of the above atoms and you want to use the SmartForms functionality, you need to ensure you add the suggestions functionality to `<BaseInput>`, `<Input>` and `<Textarea>`, and also add the `useFormFieldState`, `useFormDataSetter` and `useFormErrorSetter` to `<FormComponent>`. For further reference please take a look at the corresponding files in [the 2.6-2.7 diff](https://gitlab.com/front-commerce/front-commerce/-/compare/2.6.0...2.7.0?from_project_id=9218054) to help you integrate the updates in the files you have overridden.

### Style sheets updates

In case you have overridden `_pages.scss` you need to add the following line to it to include styles for the Guest order search feature:

```
@import "~theme/pages/Orders/Orders";
```

In case you have overridden `_Input.scss` you need to add the following to it to include styles for the smart forms module:

```
.input-wrapper {
  &__suggestions {
    .autocomplete-results__option {
      cursor: pointer;
    }

    &-wrapper {
      position: relative;
      height: 0;
    }

    position: absolute;
    width: 100%;
    z-index: 2;
    background: $white;
    border: 1px solid $shade05;
    border-top: none;
    box-sizing: border-box;
    padding: $boxSizeMargin;
  }
}
```

In case you are using base theme and have overridden `_components.scss` you need to add the following line to it:

```
@import "~theme/components/organisms/Autocomplete/Autocomplete";
```

In case you are using theme chocolatine and have overridden `_components.scss` you need to perform the following update:

```diff
-@import "~./organisms/Autocomplete/Autocomplete";
+@import "~theme/components/organisms/Autocomplete/Autocomplete";
```

## `2.5.0` -> `2.6.0`

### Minimum Node.js version

Node.js 10.x [reaches its end of life at the end of April 2021](https://nodejs.org/en/about/releases/). As a result, the minimum supported Node.js version in Front-Commerce is **12.22.1**.

We also recommend to use Node.js 14.x as this version is also supported and it is the current active Long Term Support Node.js release.

### Wishlist Provider

In this release we have implemented a [wishlist provider](/docs/reference/wishlist-provider) to unify and optimize some queries related to the wishlist. As a result a number of Graph QL queries and fragments have been deprecated or moved to the provider. If you use this feature or have overridden related components, we highly recommend you to update them. Leveraging the wishlist provider instead of querying the data directly reduces the number of client / server requests and make your application more performant.

Deprecated queries/fragments:

- `WishlistProductGridQuery`: use `LoadWishlistQuery` instead
- `AddProductToWishlistQuery`: use `useLoadWishlistItem` hook instead
- `IsWishlistEnabledQuery`: use `useIsWishlistEnabled` hook instead
- `WishlistProductGridFragment`: use `LoadWishlistQueryFragment` instead
- `WishlistProductItemFragment`: use `LoadWishlistItemFragment` instead
- `AddProductToWishlistFragment`: use `useLoadWishlistItem` hook instead

#### Enabling the wishlist provider

The wishlist provider is enabled by default in Front-Commerce 2.6.0. However you need to make sure you have not overridden the following:

- [`src/web/makeApp.js`](https://gitlab.com/front-commerce/front-commerce/-/blob/2.6.0/src/web/makeApp.js)
- any story that uses the wishlist

If you have overridden `src/web/makeApp.js` (**which is NOT recommended! ;-)**) you need to make sure that the provider is included in the `makeApp` function [just above the `<Routes>` component](https://gitlab.com/front-commerce/front-commerce/-/blob/2.6.0/src/web/makeApp.js#L53) as follows:

```jsx
import { WishlistProvider } from "theme/modules/Wishlist/WishlistProvider/WishlistProvider";

  ... // later in makeApp function...
  <WishlistProvider>
    <Router>
      <Routes />
    </Router>
  </WishlistProvider>
  ...
```

If you have updated a story or created any story related to or uses the wishlist, you need to:

- Add the `WishlistDecorator` to your story just above the `ApolloDecorator`
- use the `wishlistMeFakeValues` helper function to provide fake values to the `ApolloDecorator`.

Please refer to [the `WishlistProvider` documentation](/docs/reference/wishlist-provider) for more details

### New icon required

In this release we added the functionality to share a wishlist. As such we needed a share icon. We added this icon in [the theme's <Icon> component](https://gitlab.com/front-commerce/front-commerce/-/blob/2.6.0/src/web/theme/components/atoms/Icon/Icon.js#L95). If you have overridden the `<Icon>` component please add an icon named `share` to the list of icons. Failing to display a `<Icon icon="share">` component will result in an error message being displayed when users visit their wishlist page.

### Style sheets updates

In case you have overridden `_modules.scss` you need to add the following line to it:

```
@import "~theme/modules/ProductThumbnail/ProductThumbnail";
@import "~theme/modules/Wishlist/AddAllWishlistToCartModal/AddAllWishlistToCartModal";
@import "~theme/modules/Wishlist/ShareWishlistModal/ShareWishlistModal";

```

#### In case you are using theme chocolatine

1. If you have overridden `_pages.scss` you need to add to it:

```
@import "~theme/pages/SharedWishlist/SharedWishlist";
```

2. If you have overridden `_components.scss` you need to:

- Remove:

```
@import "~./atoms/Tag/Tag";
```

- And Add

```
@import "~theme/components/atoms/Tag/Tag";
```

#### In case you are using the base theme:

1. If you have overridden `_components.scss` you need to add to it:

```
@import "~theme/components/atoms/Tag/Tag";
@import "~theme/modules/ProductView/ProductName/ProductName";
```

### Cache Control and CDN

Front-Commerce 2.6 comes with a new powerful HTTP cache mechanism, Please refer to [the Cache Control and CDN documentation](/docs/advanced/performance/cache-control-and-cdn) for a more in depth explanation about the topic

To avoid any performance regression when enabling cache control it is highly recommended to use the `<WishlistProvider>` to handle wishlist related tasks (such as checking if a product is in the wishlist). This is the default behaviour of Front-Commerce since 2.6.0. So if you started with Front-Commerce at or after 2.6.0 you have nothing to worry about. However if you upgraded from versions lower than 2.6.0 please refer to the [WishlistProvider migration guide](#Wishlist-Provider)

### Automatic Algolia configuration

The Front-Commerce Algolia module is now automatically configured with the
Algolia's configuration filled in the Magento 1 backoffice. As a result, the
environment variables `FRONT_COMMERCE_ALGOLIA_INDEX_NAME_PREFIX`,
`FRONT_COMMERCE_ALGOLIA_APPLICATION_ID`,
`FRONT_COMMERCE_ALGOLIA_SEARCH_ONLY_API_KEY` can safely be removed from the
`.env` file.

### Analytics and cookie bar

The Cookie consent bar now contains a "Deny all" button by default to comply with [some European](https://www.iubenda.com/en/help/23748-reject-button-cookie-banner) [recommendations](https://www.cnil.fr/fr/cookies-et-traceurs-comment-mettre-mon-site-web-en-conformite). Please ensure that you include it in your theme if you customized the bar.

New options were also added in the analytics initialization, which allows you to use the user consents in external integrations. We've updated our [<abbr title="Google Tag Manager">GTM</abbr> example documentation section](/docs/advanced/theme/analytics.html#Google-Tag-Manager) to illustrate this.

### Updated dependencies

In this release we have updated [several dependencies](https://gitlab.com/front-commerce/front-commerce/-/commits/main/package.json). For most of them, the
upgrade will be transparent. However, the following dependency updates require
some attention though:

- [`base-64`](https://www.npmjs.com/package/base-64) has been removed. It was
  not used at all by Front-Commerce. If you use it, you have to make sure it's
  installed on your environment by running `npm i base-64`.
- [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app)
  has been updated to 6.0.0. In this new release, there's [a new rule we don't
  follow and we had to override](https://gitlab.com/front-commerce/front-commerce/-/commit/576554fd32057e33f7b4f8b05d9b322e5c3dd54a#dbc0c31823b8f2e4ed04a397722fed33a67f123f_79_80).
  If your `.eslintrc.js` doesn't include Front-Commerce one, you'll probably
  need to do the same change. In addition, depending on your code, eslint
  might also warn you about new errors.
- [`axios`](https://www.npmjs.com/package/axios) has been updated to 0.21.1.
  Among other changes, it contains a fix that makes sure [the `@` character is
  correctly URL encoded in URLs](https://github.com/axios/axios/issues/1212).
  As a result, remote APIs now receive `%40` instead of a plain `@` when this
  character is used in a query string parameter.
- [`react-paginate`](https://www.npmjs.com/package/react-paginate) 7.1.2 is now
  used. It now adds a `rel` attribute on previous/next buttons.
- [`react-intl`](https://www.npmjs.com/package/react-intl) has been updated to
  5.15.8. [The 5.x release has a minor backward incompatible](https://formatjs.io/docs/react-intl/upgrade-guide-5x)
  compared to 4.x.
- [`helmet`](https://www.npmjs.com/package/helmet) has been updated to 4.5.0. As a result, [some middlewares previously included by default are not called anymore](https://github.com/helmetjs/helmet/wiki/Helmet-4-upgrade-guide#which-middlewares-were-removed) while [several middlewares are now enabled by default](https://github.com/helmetjs/helmet/wiki/Helmet-4-upgrade-guide#which-middlewares-were-added-by-default). Those HTTP headers [can be customized if needed](/docs/advanced/server/customize-response-http-headers.html).

## `2.4.0` -> `2.5.0`

To leverage all the new features, we recommend that you upgrade your Magento modules to their latest version:

- Magento 1: [1.3.0](https://gitlab.com/front-commerce/magento1-module-front-commerce/-/releases/1.3.0) + [EE module](https://gitlab.com/front-commerce/magento1-module-enterprise-front-commerce)
- Magento 2: [2.3.0](https://gitlab.com/front-commerce/magento2-module-front-commerce/-/releases/2.3.0)

Front-Commerce Cloud customers must update the FCC submodule to version [1.4.0](https://gitlab.com/front-commerce/front-commerce-cloud/-/releases/1.4.0).

### Default Redis TTL change

We've reduced the default TTL for the [Redis application caching strategy](/docs/advanced/graphql/dataloaders-and-cache-invalidation.html#Redis). It used to be 10 days, and we reduced it to 23h to ensure cache invalidation misses don't impact the store for too long.

We feel it's a better default. If you want it to be 10 days again, please update your `caching.js` with the `defaultExpireInSeconds: 864000` value.

### New shipping methods

In this release we've mainly worked on supporting new shipping methods. This means that we are now compatible with the following methods with pickup points:

- Colissimo (M2) - see [Documentation](/docs/advanced/shipping/colissimo.html) (the experimental one that lived in the core was removed)
- Mondial Relay (M1) - see [Documentation](/docs/advanced/shipping/mondial-relay.html)

We've also made sure that Colissimo M1 was compatible with FC although we're not supporting pickup points yet.

This change introduced a new `Map` and `PostalAddressSelector` component that can prove useful for your store locators or your own shipping methods. Keep in mind though that this means that you'll need to import `theme/components/organisms/Map/Map.scss` and `theme/components/organisms/PostalAddressSelector/PostalAddressSelector.scss` in your CSS.

For those relying on `theme/components/components.scss` directly, this also means that we've added a `map` CSS class. If you already had one, please check that it does not conflict with yours.

Finally, the additional shipping method's components should now handle the submit button on their own. The legacy behavior is still supported, but this feature will likely be deprecated in the future. See [Custom Shipping Information](/docs/advanced/shipping/custom-shipping-information.html) for more details.

### Support of Magento 1 Enterprise features

In this release comes the first official support for a Magento 1 Enterprise feature. This is the grounding work that will also to support more features in the future.

This first feature is RMA (Return Merchandize Authorization). In order to add support for this feature, you will need to:

- Install the new [front-commerce/magento1-module-enterprise](https://gitlab.com/front-commerce/magento1-module-enterprise-front-commerce). The installation documentation is available in the [Magento 1 installation guide](/docs/magento1/installation.html).
- Add the Magento1 Enterprise GraphQL module in your `.front-commerce.js`
  ```diff
  module.exports = {
    // ...
    serverModules: [
      { name: "FrontCommerce", path: "server/modules/front-commerce" },
      { name: "Magento1", path: "server/modules/magento1" },
  +    { name: "Magento1ee", path: "server/modules/magento1ee" },
    ],
    // ...
  };
  ```
- Ensure that the returns are properly displayed on the customer's order page if the feature is enabled in Magento. If you didn't override any file related to the Account pages, it will work out of the box. If you did, you can check that it's still working by ensuring that the following features work:
  - If the order was shipped, a link to create a return should appear in the `<OrderActions />` component
  - Clicking on this link, the user should land on a form displaying the list of items they can return
  - Upon a successful submission, the user will be redirected to the order page, and a success message should appear above the order. If this is not the case, please ensure that `<FlashSuccessMessage />` is available in the `<AccountLayout />` component.
  - On an order with a registered RMA should display a `Returned Items` section. If this is not the case, this means that you should check your `theme/pages/Account/Order/Details/Details.js` and ensure that the `<OrderReturns />` is properly used.
  - Your CSS stylesheets should either import the core's `theme/modules/_modules.scss` and `theme/pages/_pages.scss`, or you should ensure that your overrides import
    `theme/modules/User/Order/OrderReturns/OrderReturns`, `theme/modules/User/Return/ReturnsTable/ReturnsTable` and `theme/pages/Account/Orders/Details/ReturnForm/ReturnForm"`.

### Elasticsearch in a dedicated module

Elasticsearch related code has been moved to a dedicated module. As a result, if
you were using it in 2.4.x you now need to enable the module in your
`.front-commerce.js`.

<blockquote class="warning">
⚠️ Known issue: the Elasticsearch server module needs to be enabled **before** the Magento's module.
</blockquote>

For a Magento2 based Front-Commerce setup:

```diff
// .front-commerce.js
-  modules: [],
+  modules: ["./node_modules/front-commerce/modules/datasource-elasticsearch"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
+    {
+      name: "Magento2Elasticsearch",
+      path: "datasource-elasticsearch/server/modules/magento2-elasticsearch",
+    },
     { name: "Magento2", path: "server/modules/magento2" },
   ]
```

For a Magento1 based Front-Commerce setup:

```diff
// .front-commerce.js
-  modules: [],
+  modules: ["./node_modules/front-commerce/modules/datasource-elasticsearch"],
   serverModules: [
     { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
+    {
+      name: "Magento1Elasticsearch",
+      path: "datasource-elasticsearch/server/modules/magento1-elasticsearch",
+    },
     { name: "Magento1", path: "server/modules/magento1" },
   ]
```

#### Deprecated search related API

Some modules and functions related to search have been deprecated.

If in your custom code, you were importing files from
`server/core/esDatasource`, Front-Commerce will issue some deprecation warnings.
To fix those, you have to replace every occurence of `server/core/esDatasource/`
by `datasource-elasticsearch/server/datasource/` while importing components.

`makeSearchDatasource` available in `server/modules/magento2/core/factories` or
`server/modules/magento1/core/factories` is deprecated. Instead, you can
directly retrieve the registered datasource, for instance if you are working in
a `contextEnhancer`:

```diff
-import { makeSearchDataSource } from "server/modules/magento2/core/factories";
-
-const esDatasource = makeSearchDataSource();
-
 export default {
   namespace: "MyProject/Search",
-  dependencies: ["Magento2/Catalog/Layers"],
+  dependencies: ["Front-Commerce/Search", "Magento2/Catalog/Layers"],
   typeDefs,
   contextEnhancer: ({ req, loaders }) => {
+    const esDatasource = loaders.Search.buildSearchDatasource();
     // do stuff with esDatasource
     // ...
   }
 };
```

## `2.3.x` -> `2.4.0`

<blockquote class="important">
  **We recommend that you first follow the [`2.2.x` -> `2.3.0` migration guide](#2-2-x-gt-2-3-0).**
  This release was mostly focused on a new optional base theme, and there are not many upgrade instructions.
</blockquote>

### Cart content edge cases

We fixed some issues in case a product previously added to cart **went out of stock**.

Our default components were also not resilient to Cart items not having an attached product and led to errors if a product **was removed from the website**.

If you've overridden these components, please update them to ensure they can handle such use-case. You can refer to [these changes as an example](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/339/diffs#41f37f156cb39d8de257eb219fc96d2a29e3c398).

### Ensure that invoices are appropriately exposed to Customers

By default in this version, Magento 2 invoices will appear in the Customer account for each Order (unless you override some components). They could print it from the web. **We recommend you to ensure that printed invoices match your brand.**

If your invoicing process is different you could disable them altogether or customize the behavior. Please read our [Invoice feature documentation page](/docs/advanced/features/invoices.html) to learn about the extension points. It illustrates how you could customize invoices to **replace them with a downloadable PDF** for instance.

## `2.2.x` -> `2.3.0`

<blockquote class="important">
  **We recommend that you use these upgrade instructions while upgrading your application to Front-Commerce 2.4 directly.**
  It was released a few days after 2.3 and will not be a big upgrade (it was mostly focused on a new optional base theme).
</blockquote>

### Update the Front-Commerce Magento module

While this Front-Commerce version works with older Front-Commerce Magento module versions, it is recommended to update the Magento module to its latest version to benefit from the latest feature (grouped products support, more efficient category fetching, new configurations…).

For Magento 2, you must install the **2.2.0** module version and the **1.3.0** version for Magento 1.

With this release Front-Commerce also starts to use **Magento 2 GraphQL API** for new features. You must **ensure that GraphQL usage is allowed in your Magento environment**.

### Improve your images

Images are an important factor of web performance.

This release contains several improvements to the `<Image>` component. It may solve issues you faced and open the room for improvements in your theme. We recommend that you ensure that images work as expected, and if possible leverage these improvements:

- if there is a background on the image, it will now be used to replace the transparent parts within the image
- images are now loaded using an element from the DOM instead of an abstract element created in javascript. This allows to make sure that the image loaded fits what the browser is supposed to load. You still have to set [the `sizes` attribute on your images](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes) for an optimized loading.
- the `<Image>` component now has a `priority` prop to preload images and render them on the server (without lazy loading). **We recommend that you use this new prop for above the fold images** to improve the perceived performance.
- if your theme contains a list of images but you don't actually know the ratio of the final image, you might be interested by the newly introduced `placeholderHeight` attribute of images presets (see [the updated `config/images.js` example](/docs/advanced/production-ready/media-middleware.html#How-to-configure-it))
- ensure you no longer use our 0.x `<ResizedImage>` component ([introduced in 2.0.0-rc.0](#Responsive-images)). The `<Image>` component has the same API and should work seamlessly.

### Street lines

Previously, the address form could hold two lines for the street input. It is now using the number of lines configured in the Magento backend (Magento 1 & Magento 2). In order to use this feature, please make sure that:

- your FC module in Magento is up to date (front-commerce/magento1-module >= 1.3.0 & front-commerce/magento2-module >= 2.3.0)
- you didn't override the `<AddressForm />` component or apply the updates to your own version. You can have a look at these two commits ([807fa0a8](https://gitlab.com/front-commerce/front-commerce/-/commit/807fa0a81669067b9e78ebe412de1c71ced35a90) & [49be4da9](https://gitlab.com/front-commerce/front-commerce/-/commit/49be4da9d0efa47eaac8d06dad80a689f4260dc6)) to learn how to update your own component.

### Virtual products (Magento 2)

In release 2.2.0 we've added support for Virtual Products in Magento 1. It is now possible to use them in Magento 2.

If you want to use this feature, please ensure that your checkout customization **support skipping the shipping step** for Carts only containing virtual products.

### Bundle products (Magento 2)

The Bundle products are now available for Magento 2. In order to enable these, please
keep in mind that you will need to update your Magento 2's Front-Commerce module to version 2.2.0.

Moreover, if you have cache strategies influence price loaders, you should add the ``loader key to the`supports` list:

```diff
// ...
  strategies: [
// ...
    {
      implementation: "PerCurrency",
      // The support list should contain any loader that send different
      // currency values based on the user's selected currency
      supports: [
        "CatalogPrice",
        "CatalogProductChildrenPrice",
+        "CatalogProductBundlePrice",
      ],
    },
// ...
```

### Grouped products (Magento 2)

Grouped products are now supported for Magento 2. In order to enable these, please keep in mind that you will need to update your Magento 2's Front-Commerce module to version 2.2.0.

### Optional zip codes (Magento 2 & Magento 1)

Some countries don't need zipcodes for their addresses. This is now possible in both Magento 1 & Magento 2. In order to support this feature, you will need to update the Front-Commerce modules in Magento (2.2.0 for Magento 2 & 1.3.0 for Magento 1).

If you have updated the `Form`, `AddressForm` or `CountryFieldWithRegion` components, please consider backporting the changes from Front-Commerce. Details can be found [in this merge request](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/272/diffs). If you have any trouble upgrading, feel free to contact us.

### Product reviews for Magento < 2.4.1

If your Magento version is lower than 2.4.1, you must install the [front-commerce-magento/module-review-graph-ql](https://github.com/front-commerce/magento-module-review-graph-ql) module to enable support for the product reviews feature.

```
composer require front-commerce-magento/module-review-graph-ql:4.1.2
```

### Checkout overrides

If you have a customized checkout, we recommend that you double check it after an upgrade. Front-Commerce 2.3.0 brings several fixes for edge cases that you might want to integrate in your checkout.

#### Guest checkout

When enabling the guest checkout, we recommend that you rigorously test your checkout process as a guest to ensure your customizations supports it. A common issue could be that [you rely on an address `id` or customer `id` whereas in such scenario there aren't any](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/242).

Custom payment and shipping methods may not support it too. You can look at how Front-Commerce's core payment methods handle this as an inspiration. If you have any questions, please don't hesitate to contact us.

#### Payment form improvements

The payment form was heavily covered with tests and some edge cases were fixed. If you had overridden it, please check [these changes](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/316/diffs#62ede4890a658456822c51902ba132fb53a655bc) to backport them in your theme.

#### Addresses and transitions

Several state transitions could led to a poor user experience when customers manipulated addresses from the Checkout. We improved a few things in the core to support them. If you have overridden the `stepDefinitions.js`, the `User/Address/AddressForm` module or the `Checkout/ShippingMethod` module you might want to double check the differences.

See the Pull Requests [#253](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/253) and [#242](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/242).

### Impersonate as customer (Magento 2)

To leverage this new feature, you will have some manual configurations to do.
Read the [Log as Customer documentation page](/docs/magento2/log-as-customer.html) for a guide.

### Sitemaps

We've improved error messages and retries for sitemap. A bug that prevented to leverage ElasticSearch results has been fixed too.

Please check that your sitemaps still works fine after the upgrade because internal mechanisms have changed and your customizations may be impacted (even if this is unlikely). Please contact us if you detect any regression.

### ElasticSearch 7.x and ElasticSuite 2.9+

Front-Commerce is now compatible with both ElasticSearch 6.x and 7.x. If you want to upgrade your ElasticSearch server to 7.x, you will have to update the `@elastic/elasticsearch` client version in your project accordingly:

```
npm install --save @elastic/elasticsearch@7
```

We also introduced a `FRONT_COMMERCE_ES_ELASTICSUITE_VERSION` environment variable to enable support for versions >= 2.9. **If you upgrade the Magento 2 ElasticSuite module to a recent version, you must define this variable**. It allows Front-Commerce to adapt its queries to a new indexing pattern.

### New Flash messages mechanism

Front-Commerce 2.3 introduces a “flash message” mechanism to allow developers to implement ephemeral messages without boilerplate. It may be useful to refactor existing developments to use it.

[Read the Flash Messages documentation](/docs/advanced/features/flash-messages.html) to learn more about it.

### New configurations

You may be interested in customizing new configurations added in this version:

- `analytics.integrations.enabledByDefault` in [config/analytics.js](/docs/advanced/theme/analytics.html#Add-an-integration) (useful for Google analytics with `anonymizeIp` for instance)
- `search.attributeFacetMinimumDocumentCount` and `search.categoryFacetMinimumDocumentCount` in [`config/website.js`](/docs/reference/configurations.html#config-website-js)
- `FRONT_COMMERCE_EXPERIMENTAL_NEW_RELIC_INSTRUMENT_GRAPHQL_SERVER=true` in your `.env` to turn on an experimental logging of GraphQL resolvers metrics in New Relic. It uses the [New Relic Apollo Server plugin](https://www.npmjs.com/package/@newrelic/apollo-server-plugin).
- PM2 configuration: we've [documented some useful configurations](/docs/advanced/production-ready/front-commerce-and-pm2.html) if you use Front-Commerce with PM2
- `FRONT_COMMERCE_EXPRESS_LOG_ACCESS_ENABLED=false` in your `.env` to disable access logs (in `logs/access.log`). If you have a proxy with access logs it will make you save some disk space!

## `2.1.x` -> `2.2.0`

### New Magento 1 features

Here is the list of newly supported features for Magento 1 coming with the 2.2.0 release:

- Guest Checkout
- Bundle Products
- Virtual Products
- Credit Memo

In order to get these, you must upgrade your Magento 1's FC module to version 1.2.0.

These new features shouldn't impact your store if you don't need them. If you do, and they don't seem to work, please check that the files you have overriden don't miss any feature.

For the Guest Checkout, you need to make sure that you have enabled it in Magento 1's admin « System > Configuration > Sales > Checkout > Checkout Options > Allow Guest Checkout ».

If you are looking for these features in Magento 2, please contact us.

### New Magento 2 features

The most notable newly available feature for Magento 2 is the support for Grouped Products. To enable these, you need to make sure that your Magento has the module `magento/module-grouped-product-graph-ql` installed. This is by default since 2.3.5.

### Currency selector for Magento 1

A store in Magento can now have multiple currencies and user can switch between them. To enable this feature, you need to:

1. Enable multiple currencies in your Magento admin panel ([first part of this blog post](https://inchoo.net/magento/how-to-add-currency-selector-to-magentos-header/))
2. Update your `config/stores.js` by adding an `availableCurrencies` key to the relevant store:

```diff
module.exports = {
  // the key is the code of your store
  default_en: {
    // ...
    currency: "EUR",
+    availableCurrencies: ["EUR", "GBP"]
    // ...
  },
}
```

3. Update your `config/caching.js` strategies in case you are using redis:

```diff
// ...
  strategies: [
    {
      implementation: "Redis",
      supports: "*",
      config: {
        host: "127.0.0.1",
        db: 0,
      },
    },
+    {
+      implementation: "PerCurrency",
+      // The support list should contain any loader that send different
+      // currency values based on the user's selected currency
+      supports: ["CatalogPrice", "CatalogProductChildrenPrice", "CatalogProductBundle"],
+    },
// ...
```

You can then restart your server and the currency selector should appear in the header. If this is not the case, please check if you have changed the header behavior and add `<CurrencySelector />` from `theme/modules/User/CurrencySelector` in the relevant locations. In Front-Commerce's core, [it is used in `theme/layouts/Header/TopBar`](https://gitlab.com/front-commerce/front-commerce/-/blob/11cda1367e693fc228cf2bf92b3f7cc54c260e2f/src/web/theme/layouts/Header/TopBar.js#L23).

### Regions/State in addresses for some countries

Front-Commerce will now display a region/state selector in address forms when required by Magento (both 1 & 2) configuration. Existing applications may have some migration steps to benefit from this feature.

#### Update your overridden Address components

While we've made several efforts to implement it in a backward compatible way (no fatal error), you will not see this additional selector if you overrode some key components. The selector will only appear if it receives the expected data!

Please check for overrides of the Address related components (and update them accordingly).

- **ToDo (with links to changelog && diffs)**

#### Ensure your Magento instance supports this feature

You must ensure that the Magento module is up-to-date, so the required configurations are made available through the API.

If that's not possible, for Magento2 you can manually expose configurations from the version `2.0.0` of the module. If you can't upgrade to `2.2.0` then add the configuration below ([as documented in "Using Magento Configuration"](/docs/magento2/using-magento-configuration.html#Fetch-configurations-from-frontcommerce-storeConfigs-Magento-endpoint)):

```
<item name="general/region/state_required" xsi:type="string">general/region/state_required</item>
<item name="general/region/display_all" xsi:type="string">general/region/display_all</item>
```

## `2.0.0` -> `2.1.0`

### Magento 2.3.5 and <abbr title="Multiple Source Inventory">MSI</abbr> Support

Front-Commerce is now fully compatible with MSI. In order to do so, please make sure that the Front-Commerce module installed on your Magento 2 (`front-commerce/magento2-module`) is >= 2.0.0.

### Magento configuration loader

While it was possible to fetch configurations from Magento2 by using the GraphQL module, it is now possible to fetch these options through a REST endpoint. This will improve performance and allow you to reuse these configurations directly in your resolvers.

Please refer to [Using Magento Configuration](/docs/magento2/using-magento-configuration.html) for further information.

### Magento Admin Detection

It is now possible to detect if the user connected on the shop is an admin that is connected in Magento. Only thing is you must setup the following environment variable: `FRONT_COMMERCE_MAGENTO_ADMIN_TOKEN`.

Please refer to [Detect admin users](/docs/magento2/detect-admin-users.html) for more details.

### Translation locales variants

<blockquote>
**Important:** Please remove your `.front-commerce/translations` folder after updating to 2.1.0. Otherwise your local build will fail.
</blockquote>

Previously, the translation mechanism only accepted a main language (`fr`, `en`, ...). It is now possible to set translation files using locales that includes the country (`fr-FR`, `en-US`, `en-GB`, ...).

In new projects, new locales in the `config/stores.js` will automatically create `translations/<new-locale>.json` files so you don't have to worry about it.

In existing projects that already have main language translation files (e.g. `translations/en.json`) new files won't be created automatically. This means that if you have a store using `en-US` and a store using `en-GB` while only having a `translations/en.json` file in your project, both stores will use `translations/en.json`. If you want to add specificities for each locale, please create manually the files with the correct filename (`translations/en-GB.json`, `translations/en-US.json`).

Please note that if some translations are shared across `en-GB` and `en-US`, you can put them in a `translations/en.json`. It will still be used even if you have created `translations/en-GB.json` or `translations/en-US.json`.

## `2.0.0-rc.2` -> `2.0.0`

Over the years, we've deprecated a lot of code and provided backwards-compatible adapters to cope with API changes in dependencies.
This release is about removing all this code, and upgrading all dependencies to their latest version.

All deprecated code has been removed. If your application relied on it (deprecation warnings in `2.0.0-rc.2` or earlier), please update your code.

We've done our best to document every changes so you could upgrade your application with confidence, however it should be handled with attention and care.

<blockquote class="important">
We highly recommend you to plan the `2.0.0` in two steps: first migrate to `2.0.0-rc.2` and ensure that no deprecation warnings are triggered, then migrate from `2.0.0-rc.2` to `2.0.0` and do a full round of testing to ensure your app works as expected.
</blockquote>

### Compatibility with Magento modules 1.x+ only

Feature flags were implemented in the core to support 3-years old Magento modules. We've dropped this support and recommend that you **ensure to have a Magento module version greater than 1.0.0!**

### Sharp and libvips minor update

[`sharp`](https://www.npmjs.com/package/sharp) has been updated from 0.23 to 0.25, which requires libvips v8.9.1 (instead of v8.8.1).
You may have to rebuild it by removing your `node_modules` folder or run `npm rebuild`.

Further details available on https://sharp.pixelplumbing.com/changelog.

### `date-fns` isn't a Front-Commerce dependency any more

[`date-fns`](https://www.npmjs.com/package/date-fns) has been removed from dependencies in favor of a native `winston` plugin that timestamps log entries, and custom functions elsewhere.

It allows developer to choose the version of `date-fns` they prefer and reduce the bundle size. Please ensure you are not using `date-fns` in your application, or install it in your project. The version in Front-Commerce was 1.30.1, and the latest available is 2.14.0.

For backwards compatibility, you can run:

```shell
npm install --save date-fns@1.30.1
```

> **Logging format update:** a timestamp is now automatically added to log messages as the `timestamp` field of each entry (in GMT time). `date` fields were removed. You can update your custom logs to do so too.

See [this commit](https://gitlab.com/front-commerce/front-commerce/-/commit/bf9f9ace04bc24a7391fe36c267dd94857663db0) and [this one](https://gitlab.com/front-commerce/front-commerce/-/commit/60c31720fe3f113961555c493417b8c8bd45509b) for an overview of those changes.

### Make linting pass again

Dependencies were updated, a first step would be to automatically update as much as your codebase as possible to ensure it matches the latest conventions and good practices.
You can run:

```shell
npm run lint -- --fix
```

Below are the main updates to be aware of.

#### Prettier updated to 2.x

We've updated Prettier to its latest version (1.x -> 2.x). It will not cause any issues to your application, but may break snapshot tests. Your code will have to be reformatted with the latest Prettier version.

It introduced trailing commas, parents for single param arrow functions and other changes. You can read [Prettier 2.0 "2020" blog post](https://prettier.io/blog/2020/03/21/2.0.0.html) for further details.

#### ESLint and rules updated to 7.x

ESLint (and related rules) have been updated to their latest version. Please ensure your code match the latest rules if your app uses Front-Commerce's default rules.

See [Migrating to v7.0.0](https://eslint.org/docs/user-guide/migrating-to-7.0.0) for further details.

### ElasticSearch related changes

#### `@elastic/elasticsearch` must be installed

Recent versions of the official [`@elastic/elasticsearch`](https://www.npmjs.com/package/@elastic/elasticsearch) client are versioned against the corresponding ElasticSearch version they are compatible with. We decided to make it a [peer-dependency](https://nodejs.org/es/blog/npm/peer-dependencies/) of `front-commerce`'s package instead of being a direct dependency to allow developers to choose the exact version they need.

You must install it in your application, with the version matching your server version. For now, only 6.x is supported.

```shell
npm install --save @elastic/elasticsearch@6
```

**This library had several breaking changes** that only applications with custom queries should care about. If your application is using the standard ElasticSearch integration (with configurations and no custom layers etc…) then **you won't be impacted.**

For applications with custom querying, the most important change to be aware of is that `client.search` now returns an object instead of the body. You will have to update your code as below:

```diff
- const body = await queryBuilder.products(request);
+ const { body } = await queryBuilder.products(request);
```

See [the official documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/breaking-changes.html#_talk_is_cheap_show_me_the_code) for further details.

#### Deprecations removed

The deprecations introduced in `2.0.0-rc.2` have been removed. Ensure that your `FRONT_COMMERCE_ES_ALIAS` only contains the index prefix for instance.

> You will very likely have to change `FRONT_COMMERCE_ES_ALIAS=magento2_default` to `FRONT_COMMERCE_ES_ALIAS=magento2` in your `.env` file (the `_default` will be appended from your `stores.js` configuration).

It is important to acknowledge [Elasticsearch related changes from our previous release](#Elasticsearch-related-changes) if you are upgrading from an earlier version.

### GraphQL Dataloaders: `loadMany()` change

The [`dataloader`](https://www.npmjs.com/package/dataloader) library has been updated to 2.0.0. There is only one important API change to be aware of.

The `loadMany()` method will now return an array that may contain Error instances along with valid results when a key failed instead of rejecting the promise. Please read [the release notes](https://github.com/graphql/dataloader/releases/tag/v2.0.0) for further information.

For a fully backward compatible change, you can refactor your code as below (or leverage this new feature for a more resilient app):

```diff
const ids = [1, 2, 3];

- return loader.loadMany(ids);
+ return Promise.all(ids.map(
+   (id) => loader.load(id)
+ ));
```

### `graphql-tools` now in 6.x: remote schema stitching need changes

`graphql-tools` has been migrated to its latest version (v6). This is a huge improvement for the library: after years of slow developments, the project has been taken over from Apollo by the Guild team. Front-Commerce now uses modules from the `@graphql-tools` monorepo, a new and fresh version of this library. See https://the-guild.dev/blog/graphql-tools-v6 for more context.

**You shouldn't worry if you are using Front-Commerce's GraphQL modules.** However, if you are using remote schema stitching features, you will have to update your code according to our latest documentation: see [GraphQL Remote schemas](/docs/advanced/graphql/remote-schemas.html) for an updated guide.

**<abbr title="Too Long; Didn't Read">TL;DR</abbr>:**

- GraphQL modules using remote schema must now provide a custom _executor_ (that will execute remote fetching queries), instead of the deprecated `apolloLinkHttpOptions` and `linkContextBuilders` options (we shipped helpers to help in this task)
- GraphQL transforms such as `FilterRootFields` must now be imported from `@graphql-tools/wrap` instead of `graphql-tools`.

Here is an example from [Front-Commerce's Magento 2 GraphQL remote schema module's migration](https://gitlab.com/front-commerce/front-commerce/-/commit/964cb0dee8b614053c9147997f26c07327e61a0a#e9c8fef58455edd870533da439f028dca7618e8c_1_1):

```diff
- import { FilterRootFields } from "graphql-tools";
- import authenticateRequest from "./authenticateRequest";
+ import { FilterRootFields } from "@graphql-tools/wrap";
+ import makeExecutor from "server/core/graphql/makeExecutor";
+ import withMagentoAuthorizationHeaders from "./withMagentoAuthorizationHeaders";
import log from "../../../../scripts/log";

// […]

    const uri = config.magento.endpoint + "/graphql";

    return {
      uri: uri,
      transforms: [
        new FilterRootFields(
          (operation, rootField) =>
            operation === "Query" && rootField === "storeConfig"
        ),
      ],
-      linkContextBuilders: [authenticateRequest()],
+      executor: makeExecutor(uri, {
+        fetchOptionsAdapter: withMagentoAuthorizationHeaders(),
+      }),
    };
  },
};
```

### `axios`: double-check custom interceptors

`axios` has been updated from 0.15.3 to 0.19.2. This change won't affect you if you are using the default Front-Commerce factories when using axios. If you did, here is what will impact you:

The most notable breaking change is related to how duplicate headers are handled (see https://github.com/axios/axios/pull/874 and [the whole changelog](https://github.com/axios/axios/blob/master/CHANGELOG.md) if interested). It should not impact your application though.

Another low-level change from 0.17 is that the base url is now prepended to the `config.url` [**AFTER** interceptors (and not _BEFORE_)](https://github.com/axios/axios/pull/950/files#diff-91dcec0516f33811ee5fa71297160b3bL40). **If your app relies on custom interceptors, please ensure they are still working correctly.**
You can use the `finalUrlFromConfig` helper function from a helper module added to mimic `axios` core feature. See [this commit](https://gitlab.com/front-commerce/front-commerce/-/commit/3fff1a398f7b33d56546b987e15c5f5dc6d43524#24dda67967f430db4a7fe8010764e27d5d7d01b6_63_67) for an example.

### `react-intl`: changes for strings containing HTML tags

`react-intl` was updated from 3.x to 4.x. The main breaking change is that missing tags will now throw errors if your i18n messages contain HTML tags. Please [pass additional rendering parameters for these tags](https://formatjs.io/docs/react-intl/upgrade-guide-4x#migrating-off-embedded-html-in-messages) in your `intl.formatMessage` calls.

Here is what to do:

1. search for HTML tags into your translation files
2. use the translation id to find its usages in your components
3. for each one, update your code as below

```diff
- intl.formatMessage("Hello <strong>Bob</strong>");
+ intl.formatMessage("Hello <strong>Bob</strong>", {
+   strong: (text) => <strong>{text}</strong>,
+ });
```

> Front-Commerce's core only had 1 usage (id: `modules.Checkout.CartRecap.titleCount`) that you may have to fix yourselves if you overrode the `theme/modules/Checkout/CartRecap/CartRecap.js` component.

You must also ensure that your app doesn't use `<FormattedHTMLMessage>` or `intl.formatHTMLMessage` that have been removed. See [the list of breaking changes](https://formatjs.io/docs/react-intl/upgrade-guide-4x/#breaking-api-changes).

### `formsy-react` updated to 2.x

`formsy-react` has been updated from 1.1.5 to 2.0.3. Some internal methods have been
renamed and subtle low-level behavior changes were introduced (required errors by default in errors
etc…).

**If you were using [Front-Commerce's wrappers introduced in 2.0.0-rc.0](/docs/appendices/migration-guides.html#Abstract-Formsy) you might not encounter any issues**.
Otherwise, we recommend to refactor your code to use them!

See [Formsy's upgrade guide](https://github.com/formsy/formsy-react#1x-to-2x-upgrade-guide) for exhaustive details about low-level changes.

### Stripe embedded payment updated

Stripe libraries were updated.

The [`stripe`](https://www.npmjs.com/package/stripe) Node.js library was updated from 7.15.0 to 8.60.0. See [the migration guide](https://github.com/stripe/stripe-node/wiki/Migration-guide-for-v8) in case your application relies on advanced features.

The react library has bigger changes. Front-Commerce is now using the official and rebranded [@stripe/react-stripe-js](https://www.npmjs.com/package/@stripe/react-stripe-js) instead of the deprecated [react-stripe-elements](https://github.com/stripe/react-stripe-elements) library. If you overrode Stripe components, please check [the "migrating from react-stripe-elements" guide](https://github.com/stripe/react-stripe-js/blob/master/docs/migrating.md) for migration instructions (imports etc…).

We rewrote default components to use new Stripe components:

- the `<StripeCheckoutElement>` has been simplified in FC, please reapply your changes to the latest version if you overrode it
- the `<StripeCheckout>` component was totally rewritten to use hooks. It is very unlikely that you overrode it, but if you did please update your override.

### Miscellaneous and unlikely impacting backwards incompatible changes

Some minor changes were introduced in dependencies or while removing deprecated code. They are unlikely impacting a standard application, but worth mentioning in case you relied on some low-level APIs.

- The `<ExistingAddress />` and `<NewAddress />` components used in the checkout were updated to use the `<Checkbox />` component as they were using a deprecated one. **Make sure it doesn't have an impact on your styles, or update your imports if you overrode them.**
- `i18n-iso-countries` has been updated to 6.x, if your application was using its `getNames()` helper function, please ensure it works with [the new API](https://github.com/michaelwittig/node-i18n-iso-countries/releases/tag/v6.0.0)
- webpack's `url-loader` updated from 3.x to 4.x. It may cause different mimetypes for rare types (see
  [their CHANGELOG](https://github.com/webpack-contrib/url-loader/blob/master/CHANGELOG.md#400-2020-03-17))
- `graphql` has been upgraded from 14.6.0 to 15.1.0. It is very likely backwards compatible for your app, even though backward incompatible changes were introduced for subtle use cases: see [v15.0.0 release notes](https://github.com/graphql/graphql-js/releases/tag/v15.0.0) if curious
- `SitemapLoader` (and `makeMagentoPaginationWalker` helper) were removed from `magento1` and `magento2` modules (file `magento(1|2)/store/loaders`). They were unused in the core. If your application used them, please refactor it to use the loader from Front-Commerce's core. See [our documentation about Sitemap](/docs/advanced/production-ready/sitemap.html#Add-dynamic-pages) to learn about the feature.
- The `ProductStockLoader` no longer takes the `FeatureFlag` loader as parameter. Please remove this parameter if you were instantiating it manually.
- `loaders.Url.matchBy` has been removed from Magento2's module. It was only used for the deprecated `Query.matchUrls` field and might not impact your codebase, but **it's worth mentioning in case your relied on it since it wasn't issuing deprecation warnings itself.**
- Convict has been upgraded to 6.0.0. You may have to install additional packages if your application uses custom configuration providers with one of the following format in their schema: `"email"`, `"ipaddress"`, `"url"`, `"duration"` or `"timestamp"`. See [their migration documentation](https://github.com/mozilla/node-convict/blob/master/packages/convict/MIGRATING_FROM_CONVICT_5_TO_6.md) for further information
- `FRONT_COMMERCE_USE_SERVER_DYNAMIC_ENV` can be removed from your `.env` file, it is not used any more
- The Wishlist feature is now always enabled for Magento 2
- The Sitemap generation script has been revamped to use the latest version of the underlying library that contained heavy changes (it would be safe to double check that no regression was introduced in your context and we'd appreciate an issue if you find something ;))

## `2.0.0-rc.1` -> `2.0.0-rc.2`

**IMPORTANT: this release should be the last one before `2.0.0`. It means that you MUST ensure that your application does not trigger any deprecation warnings so you could upgrade to future Front-Commerce releases.**

### Cache must be emptied upon first deployment

If your store was running on `2.0.0-rc.1`, you should empty the application cache (usually Redis) upon deployment. It is required to solve an issue with incorrect category urls being cached in Redis (see [#204](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/204)).

### More flexible store URLs

It is now possible to use a base url for your stores that contain a base path. This means that in `config/stores`, the url key can now contain a URL looking like `https://www.example.com/fr`. In previous versions you could only use subdomains like `https://fr.example.com`.

Please refer to [Configure multiple stores](/docs/advanced/production-ready/multistore.html) for more details.

With this change we now have an official alternative to `web/core/UNSAFE_createFullUrlFromPath`. If you were using it, please switch to `web/core/shop/useFullUrl`. We also removed `process.env.PUBLIC_URL` in favor of this `useFullUrl` hook. Please refer to [Configure multiple stores](/docs/advanced/production-ready/multistore.html) to learn about its usage.

### Improved manifest.json generation

The `manifest.json` used to declare your website as a PWA will now be configurable by store. This means that you can have both the french version and the english version of your website installed on your phone. This is still early stages but this is a first step that ensures that URLs are always correct. In the future you can expect further customizations based on the store in use.

### IntlDecorator in Storybook is now a ShopContext

In storybook you could change the language by using the `IntlDecorator`. This is no longer needed and will now be handled by using a `ShopContext` that is available in all your stories without any specific code on your side. This ensures that if there are additional configurations based on the selected store/shop, they are still handled properly.

Since `IntlDecorator` is no longer needed, it is now deprecated and you can remove it from your stories.

### New parameter for Magento2's `CustomerLoader`

If you were manually building a Magento2 `CustomerLoader` instance, be aware that it should now receive a `StoreLoader` instance [as its third parameter](https://gitlab.com/front-commerce/front-commerce/commit/806d823b22581b0b30b15d11b5cc71e4468b88d7#3a33198cb5af2c4610c273715db7e7760721223a_21_21).

### Elasticsearch related changes

#### Improved configuration

Elasticsearch configuration is now more robust and support multi-store configuration. You may have to update your environment variables to match the stricter constraints:

- `FRONT_COMMERCE_ES_DISABLE` MUST now be set to `true` if your application does not leverage Elasticsearch
- `FRONT_COMMERCE_ES_HOST` MUST otherwise be set and **not end with a trailing slash**
- `FRONT_COMMERCE_ES_ALIAS` SHOULD now be the index common prefix shared across stores. The store code is now appended by Front-Commerce. You will very likely have to change `FRONT_COMMERCE_ES_ALIAS=magento2_default` to `FRONT_COMMERCE_ES_ALIAS=magento2` in your `.env` file (the `_default` will be appended from your `stores.js` configuration).

#### Deprecated APIs

Some internal signatures have been updated for Elasticsearch-related factories. Front-Commerce is backward-compatible but will show you deprecation warnings so you could easily update your code accordingly.

If you've created custom Elasticsearch related features (sort orders, facets, pagination, loaders etc…) you may see them pop _a lot_!

We encourage you to read every deprecation warnings and [enable traces with the `TRACE_DEPRECATION=*` environment variable](/docs/reference/environment-variables.html#Deprecation-warnings) to find where your code has to be updated. It usually will be a matter of removing or adding parameters to a few function calls. Here are commits with similar changes [for Magento2](https://gitlab.com/front-commerce/front-commerce/-/commit/be41695d641b737b7cc2f5264e86f75bb8be06ac#d0457c5131ec744f37d2b22a05e5a2c74373fc27_24_24) and [Magento 1](https://gitlab.com/front-commerce/front-commerce/-/commit/b8334bbc0472e955f371566f42195fe4cd8f3bb1#b2e36e5bd4c8d1090c6a594713752185d0a2544b_38_38) modules in Front-Commerce's core.

_Please contact us if do not understand what change needs to be done._

## `2.0.0-rc.0` -> `2.0.0-rc.1`

### Magento 2.3.4

The 2.0.0-rc.1 supports Magento 2.3.4. If you upgrade to Magento 2.3.4 there shouldn't be any impact. However if you install a new 2.3.4, please make sure that in `config/website.js` the key `search.ignoredAttributeKeys` has `url_key`. Indeed the `url_key` is now searchable by default in Magento but shouldn't be displayed in the facets of a layered navigation.

### Dynamic URLs

Some URLs are too dynamic to easily predict what kind of pages we are to display. This is solved in Front-Commerce by using the `route` query in GraphQL and the `Dispatcher` component.

We have improved those in this release to avoid any duplicate content by forcing a redirection to the canonical page. However, to do so, we needed to change the `url` field in the `Routable` GraphQL interface.

Thus, if you've overridden the `theme/modules/Router/DispatcherQuery.gql`, please make sure to replace `url` by `path`. If you've changed the `Dispatcher.js` itself, please contact us.

### Removing LinearIcons in favor of SVG icons

LinearIcons was based on a font containing all the icons. It can behave weirdly when the users have a slow connection or specific font settings. We've removed it in favor of SVG based icons.

If you are using a font icon in your project, please make sure that everything still works as expected. If not, you can copy the content of the file `"~theme/components/atoms/Icon/UNSAFE_LinearIcons"` in your own CSS to get the old behavior back.

### All `<ResizedImage />` components removed in favor of `<Image />`

The `<Image />` component that is an improved version of the deprecated `<ResizedImage />` is now in place in all the components that need to display an image in Front-Commerce.

This also means that if you didn't override a component using `<ResizedImage />` but still relied on the class `.image` in your CSS, this could change how it is displayed. Please check for reference of `.image` in your CSS to make sure that everything still works as expected.

### Search now only returns relevant results

In previous versions, we displayed search results by sorting by relevance. However this means that if you typed "skirt" you could have some bags popping at the end of the search. To avoid any weird results, we are now only displaying relevant results. This also means that there are more scenarios where you can have no result.

If you need to get the old behavior back on your project, please contact us.

## `1.0.0-beta.3` -> `2.0.0-rc.0`

`1.0.0-beta.4` and `1.0.0-beta.5` versions were bugfixes releases which required to be done so that some projects could move forward. It was safe and seamless to update to these versions.

If you are migrating from a `1.0.0-beta.3` version to the `2.0.0-rc.0`, here is the guide.

### Linting

The previous linting was usually linting your code AND Front-Commerce's code which was a waste of time. This is no longer the case and you can lint your code however you want.

But if you don't want to have complicated eslint configurations, you can use Front-Commerce's by creating a `.eslintrc.js` file at the root of your project with the following code:

```
module.exports = require("front-commerce/.eslintrc.js");
```

You can now launch the linting by using `npx front-commerce lint`.

Please note that we no longer use prettier by default in the eslint configuration. It is instead executed when running `npx front-commerce lint`.

> You can still use `npx front-commerce lint --fix` if you want to fix prettier or eslint errors automatically.

This also means that you can now upgrade prettier to its latest version without breaking Front-Commerce's tooling.

### Avoid commonjs syntax

The linting will now prevent you from using commonjs syntax in your project. You should instead use the ES modules syntax (`import`/`export`).

This will allow better tree shaking and a better validation of your builds in the future. This is also what allows us to upgrade to the latest dependencies for the libraries used in Front-Commerce.

### Dependencies upgrade

We've been accumulating technical debt about upgrading the libraries Front-Commerce depends on for a bit of time because our server code mixed syntaxes between commonjs and ES modules. This means that we now have upgraded everything to their latest version and you will need to update your code accordingly.

Here the list of the main updates you need to be concerned about:

- react and react-dom: `16.8.6` -> `16.8.9`
  New deprecations have been put in place by React itself. We've fixed them in Front-Commerce, but you will most likely have them in your own codebase. Please update your code accordingly. [Details](https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#new-deprecations)
- [autoprefixer](https://github.com/postcss/autoprefixer): `6.7.6` -> `9.6.1`
  Please define your [browserslist](https://github.com/browserslist/browserslist) in package.json. For instance it could look like this:
  ```
  "browserslist": [
    "last 2 version",
    "> 0.25%",
    "not ie <= 9",
    "Firefox ESR"
  ]
  ```
- [formsy-react](https://github.com/formsy/formsy-react): `0.20.1` -> `1.1.5`
  It should be compatible. However you will have warnings if you use `formsy-react-2`. Simply rename it to `formsy-react`. Please have a look at the [Abstract Formsy section](#Abstract-Formsy) below to learn about broader changes regarding the form inputs.
- [react-helmet](https://github.com/nfl/react-helmet) -> [react-helmet-async](https://github.com/staylor/react-helmet-async)
  It should be compatible. However you will have warnings if you use `react-helmet`. Simply rename it to `react-helmet-async`. The goal is to have a better SSR support.
- [react-intl](https://github.com/formatjs/react-intl): `2.4.0` -> `3.2.3`
  It should be compatible for the use cases in FC. If you use specific features, please check them and fix them.
  FormattedMessage no longer insert spans around your messages. This might lead to some styling issues. Add manually a `span` around your message if this is the case.
- [react-paginate](https://github.com/AdeleD/react-paginate): `5.0.0` -> `6.3.0`
  It should be compatible [unless you were using `breakLabel`](https://github.com/AdeleD/react-paginate/blob/master/CHANGELOG.md#-600).
- [react-responsive](https://github.com/contra/react-responsive): `3.0.0` -> `8.0.1`
  Should be compatible since we are using a facade in FC `theme/components/helpers/MediaQuery`. If you are using something else, please make sure your code still works.
- [react-router](https://github.com/ReactTraining/react-router/): `4.3.1` -> `5.0.1`
  See [CHANGELOG](https://github.com/ReactTraining/react-router/releases/tag/v5.0.0) for more details.
  - Make sure that you always import your components from the `react-router` or `react-router-dom` and no longer use `react-router/XXX` or `react-router-dom/XXX`.
  - You no longer have access to the old context. Please use `withRouter` or `<Route />` instead.
- [recompose](https://github.com/acdlite/recompose): `0.26.0` -> `0.30.0`
  `mapPropsStream` works but triggers warnings because of `react@16.9.0`.
  Please use `web/core/utils/mapPropsStream.js` instead.
- migration of [loadable-components](https://github.com/smooth-code/loadable-components)@1.1.1 -> [@loadable/component](https://github.com/smooth-code/loadable-components)@5.10.2
  - Rename your imports to `@loadable/component`
  - Rename `LoadingComponent` to `fallback`
  - Use an ErrorBoundary rather than the `ErrorComponent`
  - Add `%%__HEAD__%%` and `%%__SPLIT__%%` to your `template/index.html` if you have one.

### Display error pages

Error pages now have their own template: `template/error.html`. Please override it in your module if you need to customize it.

This template is used for the following pages:

- Offline
- Maintenance (503)
- ServerError (500)

### Better SSR fallback

Previously, when the SSR failed, we displayed a "Loading..." string before trying to render the page client side. This is no longer the case. We instead display the `theme/pages/SsrFallback` component which is overridable. You could for instance replace it with a custom loader.

Please note that in dev mode, this page won't show and you will get an error message instead. The goal here is to catch the errors early and make sure that things keep running smoothly. If you happen to stumble upon these errors, please fix them by checking your server's console.

If you still want to display the `theme/pages/SsrFallback` in dev mode, add `FRONT_COMMERCE_DEV_SSR_FALLBACK_DISABLE=true` to your environment variables.

### Responsive images

Your previous images will still work. However we have added a new component in `theme/components/atoms/Image` that will always give the proper image size to your browser.

- Supports srcset and webp
- Improved lazy loading
- Same API as `<ResizedImage />`
- Improved DX by explicitly failing in dev mode and failing silently in production mode

We will migrate progressively the components in Front-Commerce's core, but feel free to start migrating your own code for improved performance and UX.

Only thing to consider: if you had some images in one of your `public/images/resized` folder, they will no longer work in dev mode because these images will be resized on the fly just like your images at the `/media` endpoint. However, in your production environment you will still see the image.

<blockquote class="note">
  This release also contain a utility library that makes [adding your own media proxy](/docs/advanced/production-ready/media-middleware.html#Add-your-own-media-proxy-endpoint) a breeze. Please read the related documentation to know more.
</blockquote>

### Abstract Formsy

The goal here is to allow an easier migration out of Formsy.

If you don't plan to move out of it, you don't need to change anything. However, if you want to keep your codebase up to date with Front-Commerce, please consider using `withFormHandlers` instead of `withFormsy`.

Please note that some improvements comes with `withFormHandlers`. The most notable change is that inputs won't display errors on first user's change, but on the first blur. This should make form completion less frustrating for the users. The second change is that you can decide to opt-out of `Formsy` any time by passing an `onChange` property directly.

For more information, please have a look at [how to create new input types](/docs/advanced/theme/form.html#New-input-types).

For existing projects, the goal would be to replace `formsy-react`'s HOC by `withFormHandlers`. The best way to migrate components you have overriden in your project is to look at the core's implementation of form inputs like [`Input`](https://gitlab.com/front-commerce/front-commerce/-/blob/720ac5e4c5dc28850b0fbdf1c02705b48d7610a1/src/web/theme/components/atoms/Form/Input/Input.js), [`Textarea`](https://gitlab.com/front-commerce/front-commerce/-/blob/720ac5e4c5dc28850b0fbdf1c02705b48d7610a1/src/web/theme/components/atoms/Form/Input/Textarea/Textarea.js), [`Checkbox`](https://gitlab.com/front-commerce/front-commerce/-/blob/720ac5e4c5dc28850b0fbdf1c02705b48d7610a1/src/web/theme/components/atoms/Form/Input/Checkbox/Checkbox.js) or [`Select`](https://gitlab.com/front-commerce/front-commerce/-/blob/720ac5e4c5dc28850b0fbdf1c02705b48d7610a1/src/web/theme/components/atoms/Form/Input/Select/Select.js).

### Move to a file first routing declaration

Previously, if you needed to use new routes or sub-routes, you needed to do one of the following:

- override the `web/Routes.js` file
- add the route using the `web/moduleRoutes.js` file
- or declare sub-routes in existing pages

This led to several issues:

- developers needed to handle code splitting themselves, which could led to bigger initial javascript load
- it was hard to have a global vision of the existing routes in a Front-Commerce application
- Front-Commerce couldn't optimize page loads by preloading components or data since nothing mapped a URL to a route

This is why we've decided to implement the solution available in many Javascript Frameworks: [Next.js](https://nextjs.org/docs#routing), [Gatsby](https://www.gatsbyjs.org/docs/routing/), [NuxtJS](https://nuxtjs.org/guide/routing/), [Sapper](https://sapper.svelte.dev/docs#Pages), etc.

The TL;DR of the new routing system is that you now have a `web/theme/routes` folder available in your modules which can contain 5 kind of files:

- normal routes files like `about.js` which will map the exported component to the `/about` url
- `index.js`: maps the exported component to the `/` url
- `_layout.js`: wraps the routes in the same folder with the exported component
- `_inner-layout.js`: wraps the routes in the same folder with the exported component but won't discard the parent's layout
- `_error.js`: exports the component that will displayed in case there's a 404 error or if one of the component does not manage to render

For more information, please have a look at the [Routes reference](/docs/reference/routing.html).

<details>
<summary>What should you do to implement this new routing system in your existing project? <strong>Click to expand.</strong></summary>

1. If you already have a `web/index.js` file in your module, rename it to `web/client.js`
2. Add Front-Commerce's web module to your project in `.front-commerce.js`
   ```diff
   module.exports = {
     name: "Front Commerce DEV",
     url: "http://www.front-commerce.test",
     modules: ["./src"],
     serverModules: [
       { name: "FrontCommerce", path: "server/modules/front-commerce" },
       { name: "Magento2", path: "server/modules/magento2" }
   -  ]
   +  ],
   +  webModules: [{ name: "FrontCommerce", path: "front-commerce/src/web" }]
   };
   ```
3. If you have some custom routes, declare your own routes by:
   - Creating an empty `web/index.js` file
   - Add your own web module to `.front-commerce.js`
     ```diff
     module.exports = {
       name: "Front Commerce DEV",
       url: "http://www.front-commerce.test",
       modules: ["./src"],
       serverModules: [
         { name: "FrontCommerce", path: "server/modules/front-commerce" },
         { name: "Magento2", path: "server/modules/magento2" }
       ],
     -  webModules: [{ name: "FrontCommerce", path: "./src/web" }]
     +  webModules: [
     +    { name: "FrontCommerce", path: "front-commerce/src/web" },
     +    { name: "MyModule", path: "./src/web" },
     +  ]
     };
     ```
4. Find any page that uses the `Route` component from `react-router`. Here are a few pointer about how to migrate those files. However, if you're not sure or if you have trouble making it work, feel free to reach our team. We will make sure to make this as painless as possible.
_ If it's `web/moduleRoutes.js`, it will continue to work, but is deprecated. Please create a route file per `<Route>` as described in [Add a page client side](/docs/essentials/add-a-page-client-side.html)
_ If it's a file that does not exist in Front-Commerce's core, this most likely means that the component should be a layout and the associated routes should be new files created in your `web/route` folder. \* If it's a file you've overridden from Front-Commerce's core, please check in the core how the file changed. If it's still used, the `<Route>` components have most likely been replaced with the children property. If it's not, it usually means that it is now replaced by a layout. If you're not sure, feel free to contact our team. We will make sure to make this as painless as possible.
</details>

### ID types in GraphQL definitions

In order to improve consistency of the GraphQL schema accross platforms, we have also made some changes to the GraphQL schema.

All ids now leverage the `ID` type instead of being `Int` or `String`. This will allow better compatibility across platforms since `ID` allow for `Int` or `String` values as identifiers. It shouldn't affect the final behavior of your components. If you had some in your own schemas, we suggest to also convert them to `ID`.

The only thing that you need to make sure of is to run `npm run lint` on your project. This should allow you to see errors on overridden GraphQL files.

Please note that if in your code, you relied on some int types, there might be cases where identifiers comparison won't work. All code within the core's module has been updated to avoid as much compatibility issues as possible. However keep in mind that if you rely on some strict equality (`===`) and static identifiers, this could lead to issues.

<details>
<summary>Exhaustive list of changes <code>ID</code> changes</summary>

- `src/web/theme/modules/Cart/CartItem/CartItemOptionsUpdater/UpdateCartItemMutation.gql`: `$item_id: ID!`
- `src/web/theme/modules/Cart/CartItem/CartItemQuantityForm/UpdateCartItemQtyMutation.gql`: `$item_id: ID!`
- `src/web/theme/modules/Cart/CartItem/CartItemRemoveForm/RemoveCartItemMutation.gql`: `$item_id: ID!`
- `src/web/theme/modules/Checkout/AddressRecap/CurrentColissimoPickupAddress.gql`: `$cartId: ID!`
- `src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/ColissimoForm/ColissimoQuery.gql`: `$addressId: ID!`
- `src/web/theme/modules/Checkout/ShippingMethod/SetShippingInformationMutation.gql`: `$cartId: ID!`
- `src/web/theme/modules/Checkout/withCheckoutTracking/CheckoutSuccessTrackingQuery.gql`: `$orderId: ID!`
- `src/web/theme/modules/ProductList/Featured/FeaturedProductsQuery.gql`: `$id: ID!`
- `src/web/theme/modules/User/Address/AddressForm/RemoveAddressForm/RemoveAddressMutation.gql`: `$addressId: ID!`
- `src/web/theme/modules/User/Order/OrderRenewButton/RenewOrderMutation.gql`: `$order_id: ID!`
- `src/web/theme/modules/Wishlist/AddProductToWishlist/RemoveProductFromWishlistMutation.gql`: `$itemId: ID!`
- `src/web/theme/pages/Account/Orders/Details/OrderDetailsQuery.gql`: `$orderId: ID!`
- `src/web/theme/pages/Category/CategoryQuery.gql`: `$id: ID!`

</details>

### Better sitemap declarations

First things first, if you didn't customize the sitemap, you can skip this section. If you did though, you will need to change the way you customized the Sitemap loader.

Previously, in order to change the sitemap loader, you had to override the default resolver for `Query.sitemap` and add your own nodes to the default ones. From now on, you will instead need to register nodes dynamically. Please follow the [Sitemap guide](/docs/advanced/production-ready/sitemap.html#Add-your-own-routes-in-the-sitemap) for more details.

### Caching update

The caching layer has been improved to enable a wide-range of possibilities.

You will have to update your [`caching.js` configuration file](/docs/reference/configurations.html#config-caching-js) to the new configuration format. Front-Commerce will display a warning if you use the previous format but is backward-compatible.

This refactoring allowed us to leverage strategies decorators to implement something that Magento store owners will appreciate: a [`PerMagentoCustomerGroup` caching implementation](/docs/advanced/graphql/dataloaders-and-cache-invalidation.html#PerMagentoCustomerGroup). We now recommend Magento 1 and Magento 2 users to cache all dataLoaders in a persistent cache (such as [Redis](/docs/advanced/graphql/dataloaders-and-cache-invalidation.html#Redis)), with the `PerMagentoCustomerGroup` strategy for the `CatalogPrice` dataLoader.

Here is how it would look:

```js
export default {
  strategies: [
    {
      implementation: "Redis",
      supports: "*",
      config: {
        host: "127.0.0.1",
      },
    },
    {
      implementation: "PerMagentoCustomerGroup",
      supports: ["CatalogPrice"],
      config: {
        defaultGroupId: 0,
      },
    },
  ],
};
```

With this configuration, your Front-Commerce will **not do any Magento API calls for guest users**… and they will notice the difference!

## `1.0.0-beta.0` -> `1.0.0-beta.3`

`1.0.0-beta.1` and `1.0.0-beta.2` versions were bugfixes releases which required to be done so that some projects could move forward. It was safe and seamless to update to these versions.

If you are migrating from a `1.0.0-beta` version to the `1.0.0-beta.3`, here is the guide.

### HTTPS

We wanted to explicitly prevent usage of Front-Commerce in production mode in a non secured environment. From now on, accessing an application in production mode using the `http` protocol will automatically redirect to `https`.

If you experience issues after the upgrade, here are the things to ensure:

- start the application with the [`FRONT_COMMERCE_UNSAFE_INSECURE_MODE`](/docs/reference/environment-variables.html#Front-Commerce-related-variables) set to `true` to see if that solves your issue
- if the above manipulation worked, ensure that your proxy (if any) forwards the protocol using the `X-Forwarded-Proto` HTTP header

If you still experience issues, please [contact us](mailto:support@front-commerce.com).

### Embedded Payments

Previously, when a payment needed to set custom information, there were two steps: one for validating the payment information, and one for placing the order.

This is no longer the case, which improves the Customer experience. But this means that AddtionalPaymentInformation components need to use the new behavior, which is to use `theme/modules/Checkout/Payment/SubmitPayment` when validating the additional payment information.

You will need to do so if you are using Stripe or Payzen and have customized how these forms are displayed in an existing project. If you need help, please feel free to [contact us](mailto:support@front-commerce.com).

Please note that if you made some changes to some payments only because you wanted to change the submit button, this will no longer be needed. You will be able to remove your override, and only override `theme/modules/Checkout/Payment/SubmitPayment`. The additional benefit is that it will let you have the exact same submit button across all your payment methods.

### Magento 2 Authenticated Remote schema stitching

If you had a custom remote schema stitching module with Magento 2, you could reuse the authentication middleware from Front-Commerce to access resources under the currently logged in user by leveraging the [new HTTP headers customization feature](/docs/advanced/graphql/remote-schemas.html#Customize-remote-HTTP-requests).

Here is how it might look:

```diff
const { FilterRootFields } = require("graphql-tools");
+const authenticateRequest = require("server/modules/magento2-graphql/authenticateRequest");

const m2GraphQLEndpoint =
  process.env.FRONT_COMMERCE_MAGENTO_ENDPOINT + "/graphql";

module.exports = {
  namespace: "Acme/Magento2GraphQL",
  dependencies: ["Magento2GraphQL"],
  remoteSchema: {
    uri: m2GraphQLEndpoint,
    transforms: [
      new FilterRootFields(
        (operation, rootField) =>
-          operation === "Query" && rootField === "myField"
+          operation === "Query" && rootField === "myField" ||
+          operation === "Query" && rootField === "customer"
      )
-    ]
+    ],
+    linkContextBuilders: [authenticateRequest()]
  }
};
```

## `1.0.0-alpha.2` -> `1.0.0-beta.0`

### Versions

We are now entering a `beta` phase.
Be sure to update your dependency as follow:

```
npm install --save git+ssh://git@gitlab.com/front-commerce/front-commerce.git#semver:^1.0.0-beta
```

Same goes for the Magento 2 module.
Please update your PHP dependencies by using the latest beta in your Magento project.

<blockquote class="important">
  **IMPORTANT:** please ensure to keep your [`FRONT_COMMERCE_MAGENTO_MODULE_VERSION`](/docs/reference/environment-variables.html#Magento-2) up-to-date in the `.env` file of your Front-commerce application.
  It should now be `1.0.0-beta`.
</blockquote>

### Translations

We have introduced the mechanism of [Translation Fallback](/docs/advanced/theme/translations.html#Translations-fallback). This is means that you will have fewer conflicts during next upgrades.

### Improved search experience

While working on our compatibility with Magento 2.3, we decided to use [ElasticSuite](https://elasticsuite.io/). Learn more about it in our [announcement](/blog/2019/05/13/release-1.0.0-beta.0/#Improved-search-experience).

During this change, we needed to update some parts of the GraphQL schema. If you don't use our implementation, this won't impact you. However, if you do, here is what changed in the schema:

- `AttributeBucket.swatch` was removed in favor of `AttributeBucket.productAttributeValue.swatch`. The reasoning behind this is that what's interesting is not the swatch itself but the whole attribute which is available at `AttributeBucket.productAttributeValue`.
- Layers related types are now interfaces (Bucket, DynamicFacet, FixedFacet) with concrete implementations (AttributeFacet...).
- `DynamicFacet.bucket` has been renamed in
  `DynamicFacet.buckets` (plural).
- `SearchResult.layer` was renamed to `SearchResult.products`

Please check your front-end queries to ensure to update them accordingly. If you need any help about these, feel free to <span class="intercom-launcher">[contact us](mailto:support@front-commerce.com)</span>.

### Wishlist

A basic wishlist is now available in Front-Commerce by default with the Magento2 module.
However, for existing shops, you need to check a few things in order to make sure that the wishlist is available for your customers. Indeed, the impacted components are likely to have been overridden.

1. Upgrade your `front-commerce/magento2-module` to version `1.0.0-beta.1` or higher.
   - make sure to update `FRONT_COMMERCE_MAGENTO_MODULE_VERSION` accordingly
2. Check that the wishlist is available in the customer's account
   - the route must exist (`node_modules/front-commerce/src/web/theme/pages/Account/Account.js`)
   - a link must in the account navigation (`node_modules/front-commerce/src/web/theme/modules/User/AccountNavigation/AccountNavigation.js`)
3. Check that the user can actually add the product to their wishlist
   - either on the product page itself (`node_modules/front-commerce/src/web/theme/modules/ProductView/Synthesis/Synthesis.js`)
   - or on the product item used for product listings (`src/web/theme/modules/ProductView/ProductItem/ProductItemActions/ProductItemActions.js`)

### Storybook 5

Your styleguide is now powered by Storybook 5. This might have an impact on the organization of your custom stories but they will still appear in your styleguide.

To move your stories in the correct sections, please set your story name like this: `section|path.of.your.story.Component`

### Payments

#### Stripe

We have added an initial implementation of Stripe's embedded payments. This is still in early stage but will let your customers pay your order successfully. See [Stripe](https://github.com/front-commerce/developers.front-commerce.com/issues/47#issuecomment-476633486).

#### Integrations

Previously, some payment React components were loaded by default in the Checkout even though those payment methods were not used. This resulted in a heavier js bundle. This, we have removed those components by default.

If you relied on them, you will now need to add them manually. We are still in the process of documenting it, but you can find the main informations in [this issue](https://github.com/front-commerce/developers.front-commerce.com/issues/47) at the moment.

### Deprecations

- Environment variables from your `.env` will in the future be loaded dynamically. You won't need to rebuild your server to update your server's environment variables. To ensure that you have the newest behavior, please set `FRONT_COMMERCE_USE_SERVER_DYNAMIC_ENV=true`. To keep the deprecated one, please use `FRONT_COMMERCE_USE_SERVER_DYNAMIC_ENV=false`. See [How to update environment variables](/docs/reference/environment-variables.html#How-to-update-environment-variables).
- While upgrading the search behavior, we have also changed deprecated the `search.blacklistKeys` configuration in `config/website.js`. This now should be `search.ignoredAttributeKeys` which is less offensive and more explicit. Moreover, `search.fixedFacets` and `search.categoriesField` are no longer used.
- While upgrading the search behavior, we have split the core's search definition from the Magento 2's implementation. This means that future integrations will let you use different backends while keeping your frontend intact. We've grouped the core's search functionality in `server/modules/front-commerce/search`. This means that we have also moved `server/modules/front-commerce-core` to `server/modules/front-commerce/core`. By default, `.front-commerce.js` should now use `server/modules/front-commerce`, in order to load both the core and the search.

## `1.0.0-alpha.1` -> `1.0.0-alpha.2`

### GraphQL

[`graphql-js`](https://github.com/graphql/graphql-js) has been updated to a new major version (0.13.2 -> 14.1.1) that includes several breaking changes.
There is only one breaking change that may impact your current application: scalar types are now checked more rigorously (see [the PR](https://github.com/graphql/graphql-js/pull/1382)), meaning you may have to convert strings to numbers (etc.) in your application.

The symptoms are errors of this type in your application:

> Expected type Int; Int cannot represent non-integer value: "1"

See [v14.0.0’s releases notes](https://github.com/graphql/graphql-js/releases/tag/v14.0.0) for an exhaustive list of breaking changes and other minor releases for new features.

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

You should also check that if you have overridden some of the other components.

### Variant properties

For style variants of a component we had several behaviors in place:

- `type` property which was an enumeration of the variants
- `variantName` properties (for instance `primary` and `warning` for `<Button>`)

To improve consistency, we've decided to change this by always using an `appearance` property which will be an enumeration like what was done with the `type` property.

The goal is to avoid variants collision and to make it explicit when a variant only affects the style of a component.

These changes are backward compatible. Deprecation warnings will appear if you keep using the old properties.

### Files loading in a Scss file

Until now, files used in a `.scss` file were to be loaded from the public directory or by using long and tedious file paths. This is no longer the case. You can now use relative imports.

For instance, if you have a `theme/components/atoms/Icon/_Icon.scss` file, you will be able to import the font file directly:

```diff
-src: url('../theme/components/atoms/Icon/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2') format('woff2'),
+src: url('./font-awesome-4.7.0/fonts/fontawesome-webfont.woff2') format('woff2'),
```

This is usually done for background-images and fonts. Please look for any `url` keyword in your scss files to make sure that you update your paths accordingly.

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
  <li>modules.Cart.MiniCart.MiniCartContent.discount</li>
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

If you have overridden the `theme/modules/_modules.scss` file and didn't import the `front-commerce/src/web/theme/modules/_modules.scss` file, you will need to add the new styles for the Cart:

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

If you have overridden the `theme/components/_components.scss` file and didn't import the `front-commerce/src/web/theme/components/_components.scss` file, you will need to add the new styles for the new components that have been added for the Cart's modules:

```diff
+@import "~theme/components/atoms/Typography/Sku/Sku";
+@import "~theme/components/atoms/Form/Input/NumberInput/NumberInput";
+@import "~theme/components/molecules/Form/FormTitle/FormTitle";
```

### Checkout refactoring

The checkout was already pretty clean. Since it is a crucial part of any e-commerce application, we invested in it to make it a good default.

However, the Address components were a bit confusing in the Checkout because these were used in the Account too. To make it clearer for integrators, we've moved the generic Address components to `theme/modules/User/Address`. This means that in this folder you will now find:

- Address components (previously in `theme/components/molecules/Address`) to display an address in different formats
- Forms components (previously in `theme/modules/Checkout/Address`) to create, edit or remove an address
- EditableAddress (previously in `theme/modules/Checkout/Address`) that lets you display an Address and lets the User edit and Address if they need to

<details>
<summary>List of the changed translations regarding the Address components</summary>
<ul>
  <li>modules.Checkout.Address.ExistingAddress.addNewAddress</li>
  <li>modules.Checkout.Address.ExistingAddress.editSuccess</li>
  <li>modules.Checkout.Address.NewAddress.shippingAddress</li>
  <li>modules.Checkout.AddressRecap.AddressRecapLine.cancelEditing</li>
  <li>modules.Checkout.AddressRecap.AddressRecapLine.editAddress</li>
  <li>modules.User.Address.AddressForm.CreateAddressForm.addressCreated</li>
  <li>modules.User.Address.AddressForm.CreateAddressForm.addressCreationFailed</li>
  <li>modules.User.Address.AddressForm.CreateAddressForm.cancel</li>
  <li>modules.User.Address.AddressForm.CreateAddressForm.saveAddress</li>
  <li>modules.User.Address.AddressForm.EditAddressForm.addressEdited</li>
  <li>modules.User.Address.AddressForm.EditAddressForm.addressEditionFailed</li>
  <li>modules.User.Address.AddressForm.EditAddressForm.cancel</li>
  <li>modules.User.Address.AddressForm.EditAddressForm.saveAddress</li>
  <li>modules.User.Address.AddressForm.RemoveAddressForm.addressRemoverTitle</li>
  <li>modules.User.Address.AddressForm.RemoveAddressForm.cancel</li>
  <li>modules.User.Address.AddressForm.RemoveAddressForm.confirm</li>
  <li>modules.User.Address.AddressForm.RemoveAddressForm.deleteButton</li>
  <li>modules.User.Address.AddressForm.RemoveAddressForm.modalTitle</li>
  <li>modules.User.Address.AddressForm.address.label</li>
  <li>modules.User.Address.AddressForm.address.length</li>
  <li>modules.User.Address.AddressForm.address.placeholder</li>
  <li>modules.User.Address.AddressForm.city.label</li>
  <li>modules.User.Address.AddressForm.city.placeholder</li>
  <li>modules.User.Address.AddressForm.company.label</li>
  <li>modules.User.Address.AddressForm.company.placeholder</li>
  <li>modules.User.Address.AddressForm.country.label</li>
  <li>modules.User.Address.AddressForm.firstname.label</li>
  <li>modules.User.Address.AddressForm.firstname.placeholder</li>
  <li>modules.User.Address.AddressForm.lastname.label</li>
  <li>modules.User.Address.AddressForm.lastname.placeholder</li>
  <li>modules.User.Address.AddressForm.phone.placeholder</li>
  <li>modules.User.Address.AddressForm.postcode.label</li>
  <li>modules.User.Address.AddressForm.postcode.placeholder</li>
  <li>modules.User.Address.AddressForm.telephone.label</li>
  <li>modules.User.Address.AddressForm.title.label</li>
  <li>modules.User.Address.AddressForm.useAsDefaultBilling.label</li>
  <li>modules.User.Address.AddressForm.useAsDefaultShipping.label</li>
  <li>modules.User.Address.EditableAddress.edit</li>
</ul>
</details>

#### Styles

If you have overriden the `theme/modules/_modules.scss` file and didn't import the `front-commerce/src/web/theme/modules/_modules.scss` file, you will need to add the new styles for the Cart:

```diff
-@import "~theme/modules/Checkout/Address/Address";
-@import "~theme/modules/User/Address/AddressRemover/AddressRemover";
+@import "~theme/modules/User/Address/AddressForm/RemoveAddressForm/RemoveAddressForm";
```
