---
id: translations
title: Translate your application
---

International e-commerce websites often need to translate their UI in several languages to make sure that they reach a broader range of customers.

In this documentation, we will see how this works for static content in your application.

<blockquote class="note">
If you want to configure your application to support multiple languages, please refer to [Configure multiple stores](/docs/advanced/production-ready/multistore.html).
</blockquote>

Front-Commerce manages your translations by using [`react-intl`](https://github.com/yahoo/react-intl), a standard library in the React ecosystem. This library works by transforming your static values in React Components. These components will then fetch your translations and display them in your application.

## Declare translations in your application

For instance, let's see how to transform your values in react-intl Components.

* Strings
```diff
- Default translation
+ import { FormattedMessage } from "react-intl";
+ <FormattedMessage
+   id="My.Component.Id.messageId"
+   defaultMessage="Default translation"
+ />
```
* Dates
```diff
- import moment from "moment";
- moment(date).format("DD/MM/YYYY");
+ import { FormattedDate } from "react-intl";
+ <FormattedDate
+   value={date}
+   year="numeric"
+   month="long"
+   day="2-digit"
+ />
```
* Prices
```diff
- <span>{value.amount} €</span>
+ import { FormattedNumber } from "react-intl";
+ <FormattedNumber
+   value={value.amount}
+   style="currency"
+   currency={value.currency}
+ />
```
    <blockquote class="note">
    However, for this particular use case we have abstracted this in Front-Commerce with the [`theme/components/atoms/Price`](https://gitlab.com/front-commerce/front-commerce/tree/develop/src/web/theme/components/atoms/Typography/Price) component (and its variants: `ProductPrice`, `PriceOrFree`). We recommend you to use it instead, so you could benefit from better integration with its related GraphQL Type.
    </blockquote>
* [and many more](https://github.com/yahoo/react-intl/wiki/Components)

### Without React Component

These components will be enough in most cases. However, the issue with these is that it wraps your string within a React Element, which may be troublesome when you actually need to handle the string itself.

For instance, this is the case when you want to add some label attributes to your <abbr title="Document Object Model">DOM</abbr> elements.

```jsx
<span class="icon" aria-label="Icon title displayed for screen readers" />
```

Fortunately, this is correctly handled by react-intl if you use [`defineMessages`](https://github.com/yahoo/react-intl/wiki/API#definemessages) combined with [`injectIntl`](https://github.com/yahoo/react-intl/wiki/API#injection-api).

<blockquote class="wip">
Please refer to [react-intl documentation](https://github.com/yahoo/react-intl/wiki/API#injection-api) for more information about these two methods. We plan to add an example here in the future but didn't have time to document it yet.
</blockquote>

## Translate what's in your components

Now that you have defined what should be translated in your application, you actually need to translate your application. This is a two-step process:

1. Run the following script that will fetch all your translatable strings in your application and gather them in a JSON file located in `translations/[lang].json`
```sh
npm run translate
```
2. Translate the strings available in those files, and you are good to go :)

Note that for some translations you won't need to change anything. This usually happens for the default language and for business phrases such as "SKU", etc.

However, `react-intl` will warn you against those cases because it might be an actual translation that is missing. Luckily, you can opt-out of this warning for specific translations ids by adding it to the `translations/whitelist_[lang].json` file.

This task can be daunting at first, but it will make your life easier in the future when you will need to know which string was not translated in a recent update.

### Translations fallback

With `react-intl` translations are usually grouped into a single file. In our case, we would expect them to be in `translations/whitelist_[lang].json`. But in Front-Commerce's case, we don't want you to be troubled by translations that are handled by the core.

That's why Front-Commerce uses a mechanism called **translations fallbacks**. Instead of relying on a single file for translations, Front-Commerce will look out for translations in the following locations and pick the ones that exist:

* Front-Commerce core: `node_modules/front-commerce/translations/[lang].json`
* from [your modules declared in `.front-commerce.js`](/docs/reference/front-commerce-js.html#modules): `<my-module>/translations/[lang].json`
* from your project: `translations/[lang].json`

If a translation key is defined in multiple files, the last one (according to the above list) will be be used. This is especially useful if you want to change the core's translations.

> You can see exactly which translation files are used by opening the files located in `.front-commerce/translations/`.

Please keep in mind that when you run `npm run translate`, new keys will be added to `translations/[lang].json`. However, if you are developing a module it can make sense to manually create the files in `<my-module>/translations/[lang].json` and relocate the translations there.

## About dynamic content

`react-intl` lets you translate your static content. But what about dynamic content? Things like product title and description, CMS pages, etc.

This is done on the GraphQL side. The principle is that when a user is connected to Front-Commerce, they will be assigned a `storeViewCode` in their session (see [Configure multiple stores](/docs/advanced/production-ready/multistore.html) for more details).

This code will then be used by your GraphQL loaders to retrieve the correct content from your backend. Learn more about [GraphQL loaders](/docs/advanced/graphql/slim-down-resolvers-with-loaders.html).
