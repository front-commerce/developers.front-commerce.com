---
id: installation
title: Installation
---

## Requirements

Front-Commerce is a [closed source product](/license.html). This documentation
supposes that you have access to our private repositories.

Access is granted to teams that have signed the relevant legal contracts, either
as a **Partner** or a **Customer**. Please
[contact us](mailto:contact@front-commerce.com) if you need help or further
information. An alternative would be to use
[Front-Commerce Lite](https://github.com/front-commerce/front-commerce-lite).

Front-Commerce is a Node.js server that will serve a GraphQL endpoint and a
React application to your customers. In order to run it, you need to make sure
you have `npm` (>= 5.x) and `node` (>= 8.x) installed on your machine.

You can check your versions by running these commands:

```bash
npm -v
node -v
```

If you don't have the minimum requirements,
[please follow the instructions on Node.js website](https://nodejs.org/).

<blockquote class="info">
[**Front-Commerce Lite**](https://github.com/front-commerce/front-commerce-lite)
is an alternate open-source project we created to let you start without any
further requirements.

**We don't want you to trust us blindly!** Because of this, we created a lighter
version of Front-Commerce. It should make you feel how it is like to work with
our product.

While it isn't
[fully featured](https://github.com/front-commerce/front-commerce-lite#what-it-is-not),
we believe that if you enjoy working with it, you will enjoy working with
Front-Commerce since we use the same concepts and the same file structure. You
could even reuse most of your code within Front-Commerce if you want to upgrade
to the licensed version. Please visit
[Front-Commerce Lite project page on Github](https://github.com/front-commerce/front-commerce-lite)
to get started with it.

</blockquote>

## Installation using the skeleton

**This is the recommended way to start a new Front-Commerce project.**

[Front-Commerce’s skeleton repository](https://gitlab.com/front-commerce/front-commerce-skeleton) provides a quick way to get started with
Front-Commerce with sane default configurations.

### Get the code

In order to install the skeleton, you need to follow these instructions:

```bash
git clone --depth=1 git@gitlab.com:front-commerce/front-commerce-skeleton.git
cd front-commerce-skeleton
npm install
```

Depending on your internet connexion, feel free to grab some tea and a cookie…

### Configure the project

This skeleton comes with default values for most of the configuration. Below are
the configurations you will most likely have to change/create.

#### Configure the instance

Front-Commerce uses environment variables for runtime configurations depending
on the instance that runs (local, staging, production).

Copy the `.env.dist` sample file to a local `.env` and adapt uncommented configurations.
See the next paragraph to uncomment other configurations depending on your context.

#### Configure remote services

Front-Commerce can interact with remote headless services. But for security
reasons, most services use some tokens to ensure that you are the only one to
access to their data. It also is a way to allow remote services to invalidate
Front-Commerce’s cache securely.

These kind of tokens are configured as environment variables
(according to [one of the 12-factor app principles](https://12factor.net/config)).

You will find an exhaustive list of available variables commented in the `.env` file,
with links to relevant documentation pages.

For instance, to interact with Magento2 you will need to configure a few things:

- Magento2 keys (available in the `System > Extensions > Integrations` page of
  Magento admin area) should be defined in:
  - `FRONT_COMMERCE_MAGENTO_CONSUMER_KEY`
  - `FRONT_COMMERCE_MAGENTO_CONSUMER_SECRET`
  - `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN`
  - `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN_SECRET`
- `FRONT_COMMERCE_CACHE_API_TOKEN`: you will need to ensure that the key
  configured here is identical to Magento’s `fc_cache_api_token` custom variable
  to enable cache invalidation from Magento2

We invite you to dig into the other configurations and tweak them if you wish.
See [our documentation](/docs/reference/environment-variables.html#Remote-services-configuration) for further information.

#### Configure stores

Configure the project by creating a `src/config/stores.js` file. It should be an
object with store codes as keys and configurations as values.

Here is an example:

```js
module.exports = {
  default: {
    locale: "en-GB",
    currency: "EUR",
    default_country_id: "GB",
    localeData: require("react-intl/locale-data/en"),
    countries: IsoCountries =>
      IsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"))
  }
};
```

See [Configure multiple stores](/docs/advanced/production-ready/multistore.html) for further information.

<blockquote class="info">
**Magento:** when using Front-Commerce with Magento, store codes
must match [Magento store view code](https://docs.magento.com/m2/ee/user_guide/stores/stores-all-create-view.html).
</blockquote>

#### Optionally configure the caching strategy

To enable caching locally, you can configure it in `src/config/caching.js`. For now
only redis is supported, which requires to have a redis instance to connect to.

<!-- TODO See [our caching section](#TODO) to know more about caching in the GraphQL middleware. -->

### Launch the application

Launch your Front-Commerce project in development mode by running:

```sh
npm run start
```

Open [http://localhost:4000](http://localhost:4000) to view it in the browser.
You can also open
[http://localhost:4000/playground](http://localhost:4000/playground) to explore
the GraphQL schema and interact with its data.

<blockquote class="info">
The project will reload automatically in most cases upon a source code change. However, when you are
trying to override a file that already exists in one of your modules, remember
to restart this script.
</blockquote>

### Bonus: launch Storybook, our UI Development Environment

Front-Commerce is component based, and uses
[Storybook](https://storybook.js.org/) to allow developers to focus on building
components in isolation.

Storybook is a separate application that will render all
[the _stories_ written in your codebase](https://storybook.js.org/basics/writing-stories/)
so you can browse them. To launch it run the following command:

```bash
npm run styleguide
```

You can now open [http://localhost:9001/](http://localhost:9001/) and explore
the existing components.

<blockquote class="tip">
You can configure which stories to display in your styleguide by setting the
[`styleguidePaths` key in your `.front-commerce.js` file](/docs/reference/front-commerce-js.html#styleguidePaths). Its value should be a list of regexes (e.g: `[/.*.story.js$/];`) that will be matched against your stories paths.
</blockquote>
