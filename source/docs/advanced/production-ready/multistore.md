---
id: multistore
title: Configure multiple stores
wip: https://gitlab.com/front-commerce/front-commerce/issues/22
---

A store in Front-Commerce has the same meaning as [in Magento](https://devdocs.magento.com/guides/v2.3/config-guide/multi-site/ms_over.html). Usually, the goal of a store is to display your catalog in multiple languages. If you want to adapt the prices depending on your language, you'd rather use the websites feature.

A same instance of Front-Commerce can handle several stores at the same time. This is configurable in `my-module/config/stores.js`.

<blockquote class="note">
However, if you need multiple websites, you will need to deploy as many Front-Commerce instances as there are websites. Feel free to [contact us](mailto:contact@front-commerce.com) if you need more informations about this.
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
    // data to load for this language
    countries: IsoCountries =>
      IsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"))
  },
  default_fr: {
    locale: "fr-FR",
    currency: "EUR",
    default_country_id: "FR",
    url: process.env.FRONT_COMMERCE_FR_URL,
    countries: IsoCountries =>
      IsoCountries.registerLocale(require("i18n-iso-countries/langs/fr.json"))
  }
};
```

Its main goal is to tell your application how to fetch the correct translations and languages.