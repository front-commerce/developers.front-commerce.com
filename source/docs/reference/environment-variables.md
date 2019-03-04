---
id: environment-variables
title: Environment variables
---

The environment variables available in Front-Commerce are the configurations that are likely to change depending on the current environment of your application. For instance, you could have three different environments: production, staging and local.

These environment variables can be defined in two different ways:
* on your server (See [How To Read and Set Environmental and Shell Variables on a Linux VPS](https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps))
* in the `.env` file in your root folder

You can then access them by using the `process.env` object in your javascript files no matter if it is a server-side or client-side file.
However, not all variables are exposed in your client code. Client code only have access to variables such as `FRONT_COMMERCE_WEB_*`. See [Add your own environment variables](http://localhost:4444/docs/reference/environment-variables.html#Add-your-own-environment-variables) for more details.

## How to update environment variables

<blockquote class="wip">
    **Work In Progress:** we plan to add a more exhaustive flowchart to cover all edge cases. By then, if you have any issues to understand why/when a build or restart is necessary, please [contact us](mailto:contact@front-commerce.com). We will make sure to answer you in a timely manner.
</blockquote>

However, in some cases you can't update these variables only by updating your server's variable.

* 🚫 You can't update the variable if:
    * the variable is used on the client side (`FRONT_COMMERCE_WEB_*`)
    * the variable was defined in the `.env` file
* ✅ You can update the variable if:
    * the variable is only used on the server side (`FRONT_COMMERCE_*` but not `FRONT_COMMERCE_WEB_*`)
    * the variable didn't exist or was defined in on your server and not in the `.env` file

The reason behind these rules is because some variables are defined and bundled within your code during the `build` of your application. For this reason, if you are are in a case where you can't update the variable, you will need to trigger a new build with the new environment variables defined and restart your server.

## Front-Commerce related variables

### Host

Configure the execution environment of the Front-Commerce's application:

- `FRONT_COMMERCE_PORT` (default: `4000`): The port of the launched server
- `FRONT_COMMERCE_HOST` (default: `0.0.0.0`): The host of the launched server. It might be useful to set it to `127.0.0.1` if you want to only listen local requests.
- `FRONT_COMMERCE_URL`: The URL available to access to your Front-Commerce application (http://localhost:4000 in your local environment, and your website URL on the production environment)
- `FRONT_COMMERCE_ENV`: `dev` or `production` in order to remove debugging options on the server side (ex: we disable GraphQL playground in production mode)
- `FRONT_COMMERCE_COOKIE_DOMAIN`: the domain of your cookie, most likely the same one used in `FRONT_COMMERCE_URL` (ex: localhost or the your domain name)
- `FRONT_COMMERCE_COOKIE_PASS`: a secret to secure the cookies exchanged with the client

### Cache

- `FRONT_COMMERCE_CACHE_API_TOKEN`: a token that will let external applications invalidate parts of Front-Commerce cache. <!-- TODO link to dataloaders and cache invalidation documentation -->

### Sitemap

- `FRONT_COMMERCE_SITEMAP_TOKEN`: a token that secures the sitemap query in your GraphQL Schema

### PWA

- `FRONT_COMMERCE_DISABLE_OFFLINE_MODE`: in case you don't want to load the offline page when the user is offline

## Remote services configuration

Your Front-Commerce application is an empty shell if it's not connected to remote services. These following sections document which variables are needed for each one of these.

### Magento 2

- `FRONT_COMMERCE_MAGENTO_MODULE_VERSION`: the version of the Front-Commerce module installed on your Magento
- `FRONT_COMMERCE_MAGENTO_ENDPOINT`: the URL of the magento (ex: http://magento2.local)
- Integration tokens configured in Magento’s « System > Extensions > Integrations » admin page:
    - `FRONT_COMMERCE_MAGENTO_CONSUMER_KEY`
    - `FRONT_COMMERCE_MAGENTO_CONSUMER_SECRET`
    - `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN`
    - `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN_SECRET`

### Elasticsearch

When your products are indexed in an Elasticsearch, you should put these variables:

- `FRONT_COMMERCE_ES_HOST`: the host of your elasticsearch instance (ex: es.front-commerce.local:9200)
- `FRONT_COMMERCE_ES_ALIAS`: the alias of the index containing your products

### Paypal

<blockquote class="wip">
More documentation about this module will be available soon. Please [contact us](mailto:contact@front-commerce.com) directly if you need this information quickly.
</blockquote>

- `FRONT_COMMERCE_WEB_PAYPAL_ENV`: `production` or `sandbox`
- Paypal credentials (See [How do I request API Signature or Certificate credentials for my PayPal account?](https://www.paypal.com/uk/smarthelp/article/how-do-i-request-api-signature-or-certificate-credentials-for-my-paypal-account-faq3196))
    - `FRONT_COMMERCE_PAYPAL_USERNAME`
    - `FRONT_COMMERCE_PAYPAL_PASSWORD`

### Ogone

<blockquote class="wip">
More documentation about this module will be available soon. Please [contact us](mailto:contact@front-commerce.com) directly if you need this information quickly.
</blockquote>

- `FRONT_COMMERCE_OGONE_ENV`
- `FRONT_COMMERCE_OGONE_PSPID`
- `FRONT_COMMERCE_OGONE_SECRET`
- `FRONT_COMMERCE_OGONE_ALGO`
- `FRONT_COMMERCE_OGONE_USERNAME`
- `FRONT_COMMERCE_OGONE_PASSWORD`
- `FRONT_COMMERCE_OGONE_ACCEPT_URL`
- `FRONT_COMMERCE_OGONE_EXCEPTION_UR`

### Payzen

<blockquote class="wip">
More documentation about this module will be available soon. Please [contact us](mailto:contact@front-commerce.com) directly if you need this information quickly.
</blockquote>

[Payzen documentation](https://payzen.io/fr-FR/rest/V4.0/api/get_my_keys.html)

- `FRONT_COMMERCE_PAYZEN_PUBLIC_KEY`
- `FRONT_COMMERCE_PAYZEN_PRIVATE_KEY`
- `FRONT_COMMERCE_PAYZEN_SHA256`

## Build related variables

- `NODE_ENV`: `"developpment"` or `"production"` a variable heavily used in the javascript ecosystem to let you add checks only on the development environment (warnings, guards, etc.)
- `SERVER`: `true` if your code is executed server side, `false` if it is client side
- `PUBLIC_URL`: the current URL of your Front-Commerce application
- `WEBPACK`: `true` if the javascript code you are executing is bundled with webpack or `false` if it is server code not within your webpack environment

## Add your own environment variables

Depending on the amount of customization you add to your Front-Commerce application, you may need to add new environment variables. This is possible and don't need any particular steps. However, please keep in mind that the ones that are safely available in your bundles are:

* in your client bundle: all the variables starting with `FRONT_COMMERCE_WEB_`
* in your server bundle: all the variables starting with `FRONT_COMMERCE_`, including `FRONT_COMMERCE_WEB_`
