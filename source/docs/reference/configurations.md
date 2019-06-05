---
id: configurations
title: Configurations
---

<blockquote class="note">
This documentation is the current state of the configurations available in Front-Commerce. However, our goal is to clean it up to make sure that it is still easily customizable, but also easier to check if your configurations are correct. We will provide a clear migration path and will integrate this change within our 1.0.0 release.

Please refer to the [related gitlab issue (#106)](https://gitlab.com/front-commerce/front-commerce/issues/106) to follow its advancement.
</blockquote>

## How to set your configurations

Each file described below exist in [`node_modules/front-commerce/src/config`](https://gitlab.com/front-commerce/front-commerce/tree/develop/src/config) in Front-Commerce. If you want to override some, duplicate those in `my-module/config`.

<blockquote class="feature--new">
_New in version `1.0.0-beta.3`:_ configurations are inherited across themes declared in your `.front-commerce.js` in a similar fashion than [theme overrides](/docs/essentials/extend-the-theme.html#Understanding-theme-overrides).
</blockquote>

<blockquote class="warning">
**Security Notice:** Please keep in mind that most of these configurations are imported and bundled into your client application. Thus it is important to not include private configurations in them, and to use [environment variables](/docs/reference/environment-variables.html#Add-your-own-environment-variables) instead.
</blockquote>

## `config/website.js`

This configuration file should contain any thing that impacts the content of your website. The term website refers to what a [`website` is in Magento's ecosystem](https://devdocs.magento.com/guides/v2.3/config-guide/multi-site/ms_over.html).

* `root_categories_path` (ex: `1/517/`): which category to use for the main navigation menu. It will then be the children of this category that will be displayed.
* `default_image_url` (ex: an absolute URL of an image): which image to use when no image path has been given to [`<ResizedImage>`](/docs/advanced/production-ready/media-middleware.html#lt-ResizedImage-gt-component)
* `defaultTitle`: the default meta title of your application
* `defaultDescription`: the default meta description of your application
* `available_page_sizes`: which page sizes to display in a product list page (or any page with a pagination)
* `website_id`: which website is used within magento (needed for customer related mutations)
* `tax` (ex: `1.2` for 20% VAT): Used to correctly filter products within layer queries (this configuration should soon be deprecated with search updates in Front-Commerce — see [#102](https://gitlab.com/front-commerce/front-commerce/issues/102))
* `contentSecurityPolicy`: For security reasons only URLs from the store's domain are authorized through CSPs. However, for tracking and external dependencies, we may authorize more domains. Use the following config and add your custom domain in each:<!-- TODO Add a CSP dedicated page -->
```
{
  directives: {
    scriptSrc: [],
    frameSrc: [],
    styleSrc: [],
    imgSrc: [],
    fontSrc: [],
    connectSrc: [],
    baseUri: []
  }
}
```
  When a CSP is missing, your browser will let you know in its console.
* `search`: an object that defines how the Elasticsearch queries should be made.
  * `dynamicFacetSize`: number of filters to fetch from Elasticsearch
  * `ignoredAttributeKeys`: filters that are returned by Elasticsearch but we don't need to display
  * `authorizedCategoriesFacet`: array of ids of the categories that should be displayed in the filters. The string `"*"` can be used to allow all categories. Default value: `[]`.
* `phoneNumber`: support/contact number of the website
* `email`: support/contact email of the website
* `maxAddressLength`: max length for one line of address ([default is 35](https://webarchive.nationalarchives.gov.uk/+/http://www.cabinetoffice.gov.uk/media/254290/GDS%20Catalogue%20Vol%202.pdf))
* `rewrittenToRoot`: array of the URLs that should be redirected to `/`

You could find many other configurations in such a file because some configurations could come from optional modules. Some of these are:
* `color_attribute_id`: allows to display the colors swatches for the color attribute (swatches should be detected automatically in the future)
* `mapsKey`: Google maps key for Colissimo shipping method

### `config/licences.js`

This makes it possible to configure the GSC text.

This file should export an object where the keys are the store's code (see [Configure multiple stores](/docs/advanced/production-ready/multistore.html)) and the value is a string (with some html content if needed).

### `config/httpAuth.js`

Configure a [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) on your server (usually for dev environments).

```js
module.exports = {
  // enable basic authentication
  enable: true,
  // allow these IPs to bypass the basic authentication
  whitelist: [
    "x.x.x.x",
  ]

  // Headers where it's most likely to find the client IP
  // Useful for logging the client's ip in the client logger (cf. https://gitlab.com/front-commerce/front-commerce/issues/23)
  headers: ["x-real-ip", "x-forwarded-for"],
};
```

To configure which login/password to use with the Basic Authentication, setup the file `.htpasswd` at the root of your project.

### `config/hardcodedSitemap.js`

Allows to define static routes within your application that aren't already fetched dynamically from your backend. Each object should match the Sitemapable interface of `src/server/model/store/schema.gql`

```js
module.exports = [
  {
    path: "/",
    priority: 1,
    changefreq: "daily",
    lastmod: new Date("2017-06-01").toISOString()
  }
];
```

### `config/autocomplete.js`

Allows to define which kind of entities should be returned within the search bar.

Available values are : "products", "categories" and "pages".

```js
module.exports = ["products", "categories", "pages"];
```
