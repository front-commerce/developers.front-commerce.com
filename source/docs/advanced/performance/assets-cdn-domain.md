---
id: assets-cdn-domain
title: Serving assets from a CDN/custom domain
---

<blockquote class="feature--new">
  _This feature has been added in version `2.7.0`_
</blockquote>

## Configuration

Serving assets from a custom domain can be done with a configuration change:

1. for each store in `config/stores`, you can add a `assetsBaseUrl` entry so that static assets and images are served from it. For instance:
  ```js
    module.exports = {
      default: {
        url: process.env.FRONT_COMMERCE_URL,
        assetsBaseUrl: "http://a.cdn.example.com",
        locale: "en-US",
        currency: "EUR",
        default_country_id: "GB",
        countries: (IsoCountries) =>
          IsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json")),
      },
  };
  ```
  In a multiple store setup, it's possible to use the same `assetsBaseUrl` for all stores.
1. [Configure the Content Security Policy](/docs/reference/configurations.html#config-website-js) so that assets can be loaded from this external URL

After restarting Front-Commerce, your assets should be loaded from this custom domain.

<blockquote class="note">
The `assetsBaseUrl` configuration only effects your `production` environment. In the `development` environment, your assets will still be served from the root of your application.
</blockquote>
