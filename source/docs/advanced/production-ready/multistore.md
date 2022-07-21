---
id: multistore
title: Configure multiple stores
description: A same instance of Front-Commerce can handle several stores at the same time. This guide explains how to configure a multi-store application.
---

A store in Front-Commerce has the same meaning as [in Magento](https://devdocs.magento.com/guides/v2.3/config-guide/multi-site/ms_over.html). Usually, the goal of a store is to display your catalog in multiple languages. If you want to adapt the prices depending on your language, you'd rather use the websites feature.

Serving several stores in the same Front-Commerce application is configurable in `my-module/config/stores.js`.

<blockquote class="note">
However, if you need multiple websites, you will need to deploy as many Front-Commerce instances as there are websites. Feel free to <span class="intercom-launcher">[contact us](mailto:support@front-commerce.com)</span> if you need more information about this.
</blockquote>

# How to define the different stores

The configuration file will look like this:

```js
module.exports = {
  // the key is the code of your store
  default_en: {
    // language used in the store (useful for react-intl)
    locale: "en-GB",
    // currency code ISO 4217
    currency: "EUR",
    // country code ISO 3166-1 (used for preselecting the country in an address input for instance
    default_country_id: "FR",
    // The url used for this store
    url: process.env.FRONT_COMMERCE_EN_URL,
    // an optional URL that will be used to serve static assets, if not defined assets are served from the url above.
    //assetsBaseUrl: http://a.cdn.mybrand.com
    // data to load for this language
    countries: (IsoCountries) =>
      IsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json")),
    // the magento store code associated with this store
    // this field is optional and it will use the store code key directly if it is not specified
    magentoStoreCode: "en",
  },
  default_fr: {
    locale: "fr-FR",
    currency: "EUR",
    default_country_id: "FR",
    url: process.env.FRONT_COMMERCE_FR_URL,
    countries: (IsoCountries) =>
      IsoCountries.registerLocale(require("i18n-iso-countries/langs/fr.json")),
  },
};
```

Its main goal is to tell your application how to fetch the correct translations and languages.

## A few pointers about URLs

A store is always associated with a single URL. Store is not based on cookies or session but on the fetched URL. This means that you can have either a set of subdomains (`fr.example.com`, `en.example.com`, etc.) or base paths per stores (`www.example.com/fr`, `www.example.com/en`, etc.).

These URLs should be defined in the `url` key of the store object specified above. Since you will most likely have a local environment, a staging environment and a production environment, we encourage you to use environment variables.

In addition, it's possible to [configure Front-Commerce to serve static assets from a different domain](/docs/advanced/performance/assets-cdn-domain.html) and to optimize caching, all stores can share the same.

### Why are my URLs in GraphQL not using the basePath of my store?

If you are using a base path to define your stores URLs (`www.example.com/fr`, `www.example.com/en`, etc.), you will notice that no URLs available in your GraphQL have the basePath (`/fr` or `/en`). This is not a problem in practice because the `<Link>` component in Front-Commerce will add the basePath automatically. Moreover this enables you to switch easily between subdomains or base paths.

However in some cases you may still need to get the full URL, including the `basePath`. This is the case if you want to display the URL to the user, or if you create a share button that sends a URL to social media.

You can get the full URL by using the React hook `web/core/shop/useFullUrl`. It will preprend the passed URL with the base URL of the current store. For instance, if you are on the `default_en` store using the URL `https://www.example.com/en` and you write the following component, it will display the URL `https://www.example.com/en/shirts.html`.

```js
import React from "react";
import useFullUrl from "web/core/shop/useFullUrl";

const FullUrl = () => {
  const fullUrl = useFullUrl("/shirts.html"); // "https://www.example.com/en/shirts.html"
  return <span>{fullUrl}</span>;
};
```

In case you are not in a React context and you can't use the `useFullUrl` hook, please note that you can execute the following GraphQL query to fetch the current store information:

```graphql
query ShopQuery {
  shop {
    id
    url
    baseUrl
    ...IntlProviderFragment
  }
}
```

### How should I get the URL in another store?

URLs may change between stores. This is the case for the base url of your store but also for the actual path of your page. For instance a `/shirts.html` URL would be changed in `/chemises.html` in french. This can be done by executing the following GraphQL query:

```graphql
query StoreViewUrlQuery($url: String!, $otherShop: StoreView!) {
  shop {
    id
    translatedUrl(url: $url, otherShop: $otherShop)
  }
}
```

It will return in `translatedUrl` the correct URL in the other store.

<blockquote class="warning">

**Warning:** Front-Commerce will currently only return the root URL of the targeted shop. We will provide the exact URL translation as part of each platform module (Magento1, Magento2, …) in future versions.

</blockquote>

## Multiple currencies

<blockquote class="feature--new">
This feature has been added in version 2.2.0 for Magento 1. Please contact us if you need it for another platform.
</blockquote>

With **Magento1** it is possible to handle multiple currencies for a single store. To do so, you need to define the `availableCurrencies` key for the stores using multiple currencies. This will add a button in your shop's header that let's the user choose which currency to use. By default, a user will be using the currency specified in the `currency` key.

```diff
module.exports = {
  // the key is the code of your store
  default_en: {
    // ...
    currency: "EUR",
+    availableCurrencies: ["EUR", "USD"]
    // ...
  },
}
```
