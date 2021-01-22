---
id: migration-guides
title: Migration Guides
---

This area will contain the Migration steps to follow for upgrading your store to new Front-Commerce versions.

Our goal is to make migrations as smooth as possible. This is why we try to make many changes backward compatible by using deprecation warnings. The deprecation warnings are usually removed in the next breaking release.

## `2.3.x` -> `2.4.0`

<blockquote class="important">
  **We recommend that you first follow the [`2.2.x` -> `2.3.0` migration guide](#2-2-x-gt-2-3-0).**
  This release was mostly focused on a new optional base theme, and there are not many upgrade instructions.
</blockquote>

## `2.2.x` -> `2.3.0`

<blockquote class="important">
  **We recommend that you use these upgrade instructions while upgrading your application to Front-Commerce 2.4 directly.**
  It was released a few days after 2.3 and will not be a big upgrade (it was mostly focused on a new optional base theme).
</blockquote>

### Virtual products for Magento 2

In release 2.2.0 we've added support for Virtual Products in Magento 1. It is now possible to use them in Magento 2.

### Street lines

Previously, the address form could hold two lines for the street input. It is now using the number of lines configured in the Magento backend (Magento 1 & Magento 2). In order to use this feature, please make sure that:

- your FC module in Magento is up to date (front-commerce/magento1-module >= 1.3.0 & front-commerce/magento2-module >= 2.3.0)
- you didn't override the `<AddressForm />` component or apply the updates to your own version. You can have a look at these two commits ([807fa0a8](https://gitlab.com/front-commerce/front-commerce/-/commit/807fa0a81669067b9e78ebe412de1c71ced35a90) & [49be4da9](https://gitlab.com/front-commerce/front-commerce/-/commit/49be4da9d0efa47eaac8d06dad80a689f4260dc6)) to learn how to update your own component.

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

### Optional zip codes (Magento 2 & Magento 1)

Some countries don't need zipcodes for their addresses. This is now possible in both Magento 1 & Magento 2. In order to support this feature, you will need to update the Front-Commerce modules in Magento (2.2.0 for Magento 2 & 1.3.0 for Magento 1).

If you have updated the `Form`, `AddressForm` or `CountryFieldWithRegion` components, please consider backporting the changes from Front-Commerce. Details can be found [in this merge request](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/272/diffs). If you have any trouble upgrading, feel free to contact us.

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

### `date-fns` isn't a Front-Commerce dependency anymore

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

**You shouldn't worry if you are using Front-Commerce's GraphQL modules.** However, if you are using remote schema stitching features, you will have to update your code according to our latest documentation: see [GraphQL Remote schemas](https://developers.front-commerce.com/docs/advanced/graphql/remote-schemas.html) for an updated guide.

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

**If you were using [Front-Commerce's wrappers introduced in 2.0.0-rc.0](https://developers.front-commerce.com/docs/appendices/migration-guides.html#Abstract-Formsy) you might not encounter any issues**.
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
- `SitemapLoader` (and `makeMagentoPaginationWalker` helper) were removed from `magento1` and `magento2` modules (file `magento(1|2)/store/loaders`). They were unused in the core. If your application used them, please refactor it to use the loader from Front-Commerce's core. See [our documentation about Sitemap](https://developers.front-commerce.com/docs/advanced/production-ready/sitemap.html#Add-dynamic-pages) to learn about the feature.
- The `ProductStockLoader` no longer takes the `FeatureFlag` loader as parameter. Please remove this parameter if you were instantiating it manually.
- `loaders.Url.matchBy` has been removed from Magento2's module. It was only used for the deprecated `Query.matchUrls` field and might not impact your codebase, but **it's worth mentioning in case your relied on it since it wasn't issuing deprecation warnings itself.**
- Convict has been upgraded to 6.0.0. You may have to install additional packages if your application uses custom configuration providers with one of the following format in their schema: `"email"`, `"ipaddress"`, `"url"`, `"duration"` or `"timestamp"`. See [their migration documentation](https://github.com/mozilla/node-convict/blob/master/packages/convict/MIGRATING_FROM_CONVICT_5_TO_6.md) for further information
- `FRONT_COMMERCE_USE_SERVER_DYNAMIC_ENV` can be removed from your `.env` file, it is not used anymore
- The Wishlist feature is now always enabled for Magento 2
- The Sitemap generation script has been revamped to use the latest version of the underlying library that contained heavy changes (it would be safe to double check that no regression was introduced in your context and we'd appreciate an issue if you find something ;))


## `2.0.0-rc.1` -> `2.0.0-rc.2`

**IMPORTANT: this release should be the last one before `2.0.0`. It means that you MUST ensure that your application does not trigger any deprecation warnings so you could upgrade to future Front-Commerce releases.**

### Cache must be emptied upon first deployment

If your store was running on `2.0.0-rc.1`, you should empty the application cache (usually Redis) upon deployment. It is required to solve an issue with incorrect category urls being cached in Redis (see [#204](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/204)).

### More flexible store URLs

It is now possible to use a base url for your stores that contain a base path. This means that in `config/stores`, the url key can now contain an URL looking like `https://www.example.com/fr`. In previous versions you could only use subdomains like `https://fr.example.com`.

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

* `FRONT_COMMERCE_ES_DISABLE` MUST now be set to `true` if your application does not leverage Elasticsearch
* `FRONT_COMMERCE_ES_HOST` MUST otherwise be set and **not end with a trailing slash**
* `FRONT_COMMERCE_ES_ALIAS` SHOULD now be the index common prefix shared across stores. The store code is now appended by Front-Commerce. You will very likely have to change `FRONT_COMMERCE_ES_ALIAS=magento2_default` to `FRONT_COMMERCE_ES_ALIAS=magento2` in your `.env` file (the `_default` will be appended from your `stores.js` configuration).

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
* react and react-dom: `16.8.6` -> `16.8.9`
  New deprecations have been put in place by React itself. We've fixed them in Front-Commerce, but you will most likely have them in your own codebase. Please update your code accordingly. [Details](https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#new-deprecations)
* [autoprefixer](https://github.com/postcss/autoprefixer): `6.7.6` -> `9.6.1`
  Please define your [browserslist](https://github.com/browserslist/browserslist) in package.json. For instance it could look like this:
  ```
  "browserslist": [
    "last 2 version",
    "> 0.25%",
    "not ie <= 9",
    "Firefox ESR"
  ]
  ```
* [formsy-react](https://github.com/formsy/formsy-react): `0.20.1` -> `1.1.5`
  It should be compatible. However you will have warnings if you use `formsy-react-2`. Simply rename it to `formsy-react`. Please have a look at the [Abstract Formsy section](#Abstract-Formsy) below to learn about broader changes regarding the form inputs.
* [react-helmet](https://github.com/nfl/react-helmet) -> [react-helmet-async](https://github.com/staylor/react-helmet-async)
  It should be compatible. However you will have warnings if you use `react-helmet`. Simply rename it to `react-helmet-async`. The goal is to have a better SSR support.
* [react-intl](https://github.com/formatjs/react-intl): `2.4.0` -> `3.2.3`
  It should be compatible for the use cases in FC. If you use specific features, please check them and fix them.
  FormattedMessage no longer insert spans around your messages. This might lead to some styling issues. Add manually a `span` around your message if this is the case.
* [react-paginate](https://github.com/AdeleD/react-paginate): `5.0.0` -> `6.3.0`
  It should be compatible [unless you were using `breakLabel`](https://github.com/AdeleD/react-paginate/blob/master/HISTORY.md#-600).
* [react-responsive](https://github.com/contra/react-responsive): `3.0.0` -> `8.0.1`
  Should be compatible since we are using a facade in FC `theme/components/helpers/MediaQuery`. If you are using something else, please make sure your code still works.
* [react-router](https://github.com/ReactTraining/react-router/): `4.3.1` -> `5.0.1`
  See [CHANGELOG](https://github.com/ReactTraining/react-router/releases/tag/v5.0.0) for more details.
  * Make sure that you always import your components from the `react-router` or `react-router-dom` and no longer use `react-router/XXX` or `react-router-dom/XXX`.
  * You no longer have access to the old context. Please use `withRouter` or `<Route />` instead.
* [recompose](https://github.com/acdlite/recompose): `0.26.0` -> `0.30.0`
  `mapPropsStream` works but triggers warnings because of `react@16.9.0`.
  Please use `web/core/utils/mapPropsStream.js` instead.
* migration of [loadable-components](https://github.com/smooth-code/loadable-components)@1.1.1 -> [@loadable/component](https://github.com/smooth-code/loadable-components)@5.10.2
  * Rename your imports to `@loadable/component`
  * Rename `LoadingComponent` to `fallback`
  * Use an ErrorBoundary rather than the `ErrorComponent`
  * Add `%%__HEAD__%%` and `%%__SPLIT__%%` to your `template/index.html` if you have one.

### Display error pages

Error pages now have their own template: `template/error.html`. Please override it in your module if you need to customize it.

This template is used for the following pages:

* Offline
* Maintenance (503)
* ServerError (500)

### Better SSR fallback

Previously, when the SSR failed, we displayed a "Loading..." string before trying to render the page client side. This is no longer the case. We instead display the `theme/pages/SsrFallback` component which is overridable. You could for instance replace it with a custom loader.

Please note that in dev mode, this page won't show and you will get an error message instead. The goal here is to catch the errors early and make sure that things keep running smoothly. If you happen to stumble upon these errors, please fix them by checking your server's console.

If you still want to display the `theme/pages/SsrFallback` in dev mode, add `FRONT_COMMERCE_DEV_SSR_FALLBACK_DISABLE=true` to your environment variables.

### Responsive images

Your previous images will still work. However we have added a new component in `theme/components/atoms/Image` that will always give the proper image size to your browser.
* Supports srcset and webp
* Improved lazy loading
* Same API as `<ResizedImage />`
* Improved DX by explicitly failing in dev mode and failing silently in production mode

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

* override the `web/Routes.js` file
* add the route using the `web/moduleRoutes.js` file
* or declare sub-routes in existing pages

This led to several issues:

* developers needed to handle code splitting themselves, which could led to bigger initial javascript load
* it was hard to have a global vision of the existing routes in a Front-Commerce application
* Front-Commerce couldn't optimize page loads by preloading components or data since nothing mapped an URL to a route

This is why we've decided to implement the solution available in many Javascript Frameworks: [Next.js](https://nextjs.org/docs#routing), [Gatsby](https://www.gatsbyjs.org/docs/routing/), [NuxtJS](https://nuxtjs.org/guide/routing/), [Sapper](https://sapper.svelte.dev/docs#Pages), etc.

The TL;DR of the new routing system is that you now have a `web/theme/routes` folder available in your modules which can contain 5 kind of files:
* normal routes files like `about.js` which will map the exported component to the `/about` url
* `index.js`: maps the exported component to the `/` url
* `_layout.js`: wraps the routes in the same folder with the exported component
* `_inner-layout.js`: wraps the routes in the same folder with the exported component but won't discard the parent's layout
* `_error.js`: exports the component that will displayed in case there's a 404 error or if one of the component does not manage to render

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
    * Creating an empty `web/index.js` file
    * Add your own web module to `.front-commerce.js`
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
    * If it's `web/moduleRoutes.js`, it will continue to work, but is deprecated. Please create a route file per `<Route>` as described in [Add a page client side](/docs/essentials/add-a-page-client-side.html)
    * If it's a file that does not exist in Front-Commerce's core, this most likely means that the component should be a layout and the associated routes should be new files created in your `web/route` folder.
    * If it's a file you've overridden from Front-Commerce's core, please check in the core how the file changed. If it's still used, the `<Route>` components have most likely been replaced with the children property. If it's not, it usually means that it is now replaced by a layout. If you're not sure, feel free to contact our team. We will make sure to make this as painless as possible.
</details>

### ID types in GraphQL definitions

In order to improve consistency of the GraphQL schema accross platforms, we have also made some changes to the GraphQL schema.

All ids now leverage the `ID` type instead of being `Int` or `String`. This will allow better compatibility across platforms since `ID` allow for `Int` or `String` values as identifiers. It shouldn't affect the final behavior of your components. If you had some in your own schemas, we suggest to also convert them to `ID`.

The only thing that you need to make sure of is to run `npm run lint` on your project. This should allow you to see errors on overridden GraphQL files.

Please note that if in your code, you relied on some int types, there might be cases where identifiers comparison won't work. All code within the core's module has been updated to avoid as much compatibility issues as possible. However keep in mind that if you rely on some strict equality (`===`) and static identifiers, this could lead to issues.

<details>
<summary>Exhaustive list of changes <code>ID</code> changes</summary>

* `src/web/theme/modules/Cart/CartItem/CartItemOptionsUpdater/UpdateCartItemMutation.gql`: `$item_id: ID!`
* `src/web/theme/modules/Cart/CartItem/CartItemQuantityForm/UpdateCartItemQtyMutation.gql`: `$item_id: ID!`
* `src/web/theme/modules/Cart/CartItem/CartItemRemoveForm/RemoveCartItemMutation.gql`: `$item_id: ID!`
* `src/web/theme/modules/Checkout/AddressRecap/CurrentColissimoPickupAddress.gql`: `$cartId: ID!`
* `src/web/theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/ColissimoForm/ColissimoQuery.gql`: `$addressId: ID!`
* `src/web/theme/modules/Checkout/ShippingMethod/SetShippingInformationMutation.gql`: `$cartId: ID!`
* `src/web/theme/modules/Checkout/withCheckoutTracking/CheckoutSuccessTrackingQuery.gql`: `$orderId: ID!`
* `src/web/theme/modules/ProductList/Featured/FeaturedProductsQuery.gql`: `$id: ID!`
* `src/web/theme/modules/User/Address/AddressForm/RemoveAddressForm/RemoveAddressMutation.gql`: `$addressId: ID!`
* `src/web/theme/modules/User/Order/OrderRenewButton/RenewOrderMutation.gql`: `$order_id: ID!`
* `src/web/theme/modules/Wishlist/AddProductToWishlist/RemoveProductFromWishlistMutation.gql`: `$itemId: ID!`
* `src/web/theme/pages/Account/Orders/Details/OrderDetailsQuery.gql`: `$orderId: ID!`
* `src/web/theme/pages/Category/CategoryQuery.gql`: `$id: ID!`

</details>

### Better sitemap declarations

First things first, if you didn't customize the sitemap, you can skip this section. If you did though, you will need to change the way you customized the Sitemap loader.

Previously, in order to change the sitemap loader, you had to override the default resolver for `Query.sitemap` and add your own nodes to the default ones. From now on, you will instead need to register nodes dynamically. Please follow the [Sitemap guide](/docs/advanced/theme/sitemap.html#Add-your-own-routes-in-the-sitemap) for more details.

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
        host: "127.0.0.1"
      }
    },
    {
      implementation: "PerMagentoCustomerGroup",
      supports: ["CatalogPrice"],
      config: {
        defaultGroupId: 0
      }
    }
  ]
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

We have introduced the mechanism of [Translation Fallback](https://developers.front-commerce.com/docs/advanced/theme/translations.html#Translations-fallback). This is means that you will have fewer conflicts during next upgrades.

### Improved search experience

While working on our compatibility with Magento 2.3, we decided to use [ElasticSuite](https://elasticsuite.io/). Learn more about it in our [announcement](/blog/2019/05/07/release-1.0.0-beta.0/#Improved-search-experience).

During this change, we needed to update some parts of the GraphQL schema. If you don't use our implementation, this won't impact you. However, if you do, here is what changed in the schema:

* `AttributeBucket.swatch` was removed in favor of `AttributeBucket.productAttributeValue.swatch`. The reasoning behind this is that what's interesting is not the swatch itself but the whole attribute which is available at `AttributeBucket.productAttributeValue`.
* Layers related types are now interfaces (Bucket, DynamicFacet, FixedFacet) with concrete implementations (AttributeFacet...).
* `DynamicFacet.bucket` has been renamed in
`DynamicFacet.buckets` (plural).
* `SearchResult.layer` was renamed to `SearchResult.products`

Please check your front-end queries to ensure to update them accordingly. If you need any help about these, feel free to [contact us](mailto:contact@front-commerce.com).

### Wishlist

A basic wishlist is now available in Front-Commerce by default with the Magento2 module.
However, for existing shops, you need to check a few things in order to make sure that the wishlist is available for your customers. Indeed, the impacted components are likely to have been overridden.

1. Upgrade your `front-commerce/magento2-module` to version `1.0.0-beta.1` or higher.
    * make sure to update `FRONT_COMMERCE_MAGENTO_MODULE_VERSION` accordingly
2. Check that the wishlist is available in the customer's account
    * the route must exist (`node_modules/front-commerce/src/web/theme/pages/Account/Account.js`)
    * a link must in the account navigation (`node_modules/front-commerce/src/web/theme/modules/User/AccountNavigation/AccountNavigation.js`)
3. Check that the user can actually add the product to their wishlist
    * either on the product page itself (`node_modules/front-commerce/src/web/theme/modules/ProductView/Synthesis/Synthesis.js`)
    * or on the product item used for product listings (`src/web/theme/modules/ProductView/ProductItem/ProductItemActions/ProductItemActions.js`)

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

* Environment variables from your `.env` will in the future be loaded dynamically. You won't need to rebuild your server to update your server's environment variables. To ensure that you have the newest behavior, please set `FRONT_COMMERCE_USE_SERVER_DYNAMIC_ENV=true`. To keep the deprecated one, please use `FRONT_COMMERCE_USE_SERVER_DYNAMIC_ENV=false`. See [How to update environment variables](/docs/reference/environment-variables.html#How-to-update-environment-variables).
* While upgrading the search behavior, we have also changed deprecated the `search.blacklistKeys` configuration in `config/website.js`. This now should be `search.ignoredAttributeKeys` which is less offensive and more explicit. Moreover, `search.fixedFacets` and `search.categoriesField` are no longer used.
* While upgrading the search behavior, we have split the core's search definition from the Magento 2's implementation. This means that future integrations will let you use different backends while keeping your frontend intact. We've grouped the core's search functionality in `server/modules/front-commerce/search`. This  means that we have also moved `server/modules/front-commerce-core` to `server/modules/front-commerce/core`. By default, `.front-commerce.js` should now use `server/modules/front-commerce`, in order to load both the core and the search.

## Branching model

Please note that from now on, all developments will happen on the main `master` branch.
If you want to be on the edge you must now use the `master` branch instead of the `develop` (now removed).

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

* Address components (previously in `theme/components/molecules/Address`) to display an address in different formats
* Forms components (previously in `theme/modules/Checkout/Address`) to create, edit or remove an address
* EditableAddress  (previously in `theme/modules/Checkout/Address`) that lets you display an Address and lets the User edit and Address if they need to

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
