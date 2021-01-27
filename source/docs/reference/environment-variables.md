---
id: environment-variables
title: Environment variables
---

The environment variables available in Front-Commerce are the configurations that are likely to change depending on the current environment of your application. For instance, you could have three different environments: production, staging and local.

These environment variables can be defined in two different ways:
* on your server (See [How To Read and Set Environmental and Shell Variables on a Linux VPS](https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps))
* in the `.env` file in your root folder

You can then access them by using the `process.env` object in your javascript files no matter if it is a server-side or client-side file.
However, not all variables are exposed in your client code. Client code only have access to variables such as `FRONT_COMMERCE_WEB_*` which were defined during `front-commerce build`. See [Add your own environment variables](/docs/reference/environment-variables.html#Add-your-own-environment-variables) for more details.

## How to update environment variables

<blockquote class="wip">
    **Work In Progress:** we plan to add a more exhaustive flowchart to cover all edge cases. By then, if you have any issues to understand why/when a build or restart is necessary, please [contact us](mailto:contact@front-commerce.com). We will make sure to answer you in a timely manner.
</blockquote>

You can't update these variables only by updating your server's variable. This comes from how node works. But there are also some specificities due to Front-Commerce.

* If `FRONT_COMMERCE_USE_SERVER_DYNAMIC_ENV=true` during build time:
    * 🚫 if the variable is used on the client side (`FRONT_COMMERCE_WEB_*`) you need to make a new `front-commerce build`
    * ✅ if the variable is only used on the server side (`FRONT_COMMERCE_*` but not `FRONT_COMMERCE_WEB_*`) you only need to restart your server
* If `FRONT_COMMERCE_USE_SERVER_DYNAMIC_ENV=false` during build time (default behavior until 1.0.0):
    * 🚫 You need to make a new `front-commerce build` and restart your server

The reason behind these rules is because some variables are defined and bundled within your code during the `build` of your application. For this reason, if you are are in a case where you can't update the variable, you will need to trigger a new build with the new environment variables defined and restart your server.

## Front-Commerce related variables

### Host

Configure the execution environment of the Front-Commerce's application:

- `FRONT_COMMERCE_PORT` (default: `4000`): The port of the launched server
- `FRONT_COMMERCE_HOST` (default: `0.0.0.0`): The host of the launched server. It might be useful to set it to `127.0.0.1` if you want to only listen local requests.
- `FRONT_COMMERCE_URL`: The URL available to access to your Front-Commerce application (http://localhost:4000 in your local environment, and your website URL on the production environment)
- `FRONT_COMMERCE_ENV`: `dev` or `production` in order to remove debugging options on the server side (ex: we disable GraphQL playground in production mode)
- `FRONT_COMMERCE_COOKIE_DOMAIN` *(deprecated)*: the domain of your cookie, most likely the same one used in `FRONT_COMMERCE_URL` (ex: localhost or the your domain name). Deprecation reason: the cookie domain will now be defined automatically by the browser.
- `FRONT_COMMERCE_COOKIE_PASS`: a secret to secure the cookies exchanged with the client
- `FRONT_COMMERCE_UNSAFE_INSECURE_MODE`: you set this environment variable to `true` to disable Front-Commerce behaviors restricting HTTP usage in production, even though we strongly recommend you to expose your application through HTTPS.

<blockquote class="note" id="note-https-cookies">
   In production, Front-Commerce will use the [`secure` mode for setting cookies](https://www.npmjs.com/package/express-session#cookiesecure) to force running the application in HTTPS.
   If your production instance is not in HTTPS, you will encounter issues when logging in. That is why Front-Commerce redirects user to the HTTPS version of a page in this case.
   Use the `FRONT_COMMERCE_UNSAFE_INSECURE_MODE` documented above sparingly.
</blockquote>

### Cache

- `FRONT_COMMERCE_CACHE_API_TOKEN`: a token that will let external applications invalidate parts of Front-Commerce cache. See [Invalidating the cache](/docs/advanced/graphql/dataloaders-and-cache-invalidation.html#Invalidating-the-cache) for more details.

### Performance

- `FRONT_COMMERCE_FAST`: by setting it to `true`, there will be only one render to fetch data server side. cf. [Faster Server Side Rendering](/docs/advanced/performance/faster-server-side-rendering.html) for more details.
- `ENGINE_API_KEY`: set it to enable [Metrics & Logging](https://www.apollographql.com/docs/apollo-server/monitoring/metrics/#sending-metrics-to-apollo-graph-manager) on your GraphQL schema, using Apollo Engine

### Server

- `FRONT_COMMERCE_EXPRESS_LOG_ACCESS_ENABLED`: in some contexts, the proxy already has access logs and it is not useful to have a duplication. Logs grow unnecessarily and it adds an overhead. You can set `FRONT_COMMERCE_EXPRESS_LOG_ACCESS_ENABLED=false` to disable Front-Commerce access logs (in logs/access.log).
- `FRONT_COMMERCE_EXPERIMENTAL_NEW_RELIC_INSTRUMENT_GRAPHQL_SERVER`: set it to `true` to turn on an experimental logging of GraphQL resolvers metrics in New Relic. It uses the [New Relic Apollo Server plugin](https://www.npmjs.com/package/@newrelic/apollo-server-plugin)

### Sitemap

- `FRONT_COMMERCE_SITEMAP_TOKEN`: a token that secures the sitemap query in your GraphQL Schema

### PWA

- `FRONT_COMMERCE_DISABLE_OFFLINE_MODE`: in case you don't want to load the offline page when the user is offline

### DX

- `FRONT_COMMERCE_DEV_SSR_FALLBACK_DISABLE`: disables [the SSR warning page](/docs/advanced/theme/server-side-rendering.html#SSR-Fallback-when-things-go-wrong) before loading. This allows you to see what happens in production.
- `FRONT_COMMERCE_DEV_IMAGE_ERROR_DISABLE`: disables the image resizing errors in case you've passed malformed requests to the server. This allows you to see what happens in production.

## Remote services configuration

Your Front-Commerce application is an empty shell if it's not connected to remote services. These following sections document which variables are needed for each one of these.

### Magento 2

- `FRONT_COMMERCE_MAGENTO_MODULE_VERSION`: the version of the Front-Commerce module installed on your Magento
- `FRONT_COMMERCE_MAGENTO_ENDPOINT`: the URL of the magento (ex: http://magento2.local)
<blockquote class="warning">
**WARNING:** due to the way [token based authentication is implemented in Magento2 Web API](https://github.com/magento/magento2/blob/75cf82651deefef6c38b052ce40e771475607d7c/app/code/Magento/Webapi/Model/Authorization/TokenUserContext.php#L158), using an URL containing basic authentication credentials (such as http://user:password@magento2.local) is not possible yet. It would prevent users to login.
</blockquote>
- Integration tokens configured in Magento’s « System > Extensions > Integrations » admin page:
    - `FRONT_COMMERCE_MAGENTO_CONSUMER_KEY`
    - `FRONT_COMMERCE_MAGENTO_CONSUMER_SECRET`
    - `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN`
    - `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN_SECRET`
- `FRONT_COMMERCE_MAGENTO_ADMIN_TOKEN`: Admin role token to [detect admin users](/docs/magento2/detect-admin-users.html) in Front-Commerce configured in « Stores > Configurations > General > General > Front-Commerce > Magento Admin Token »

### Elasticsearch

When your products are indexed in an Elasticsearch, you should put these variables:

- `FRONT_COMMERCE_ES_HOST`: the host of your Elasticsearch instance, without trailing slash (ex: `http://es.front-commerce.local:9200`)
- `FRONT_COMMERCE_ES_ALIAS`: the alias prefix shared for your stores Elasticsearch indexes (ex: `magento2`). The store code will be appended.
- `FRONT_COMMERCE_ES_ELASTICSUITE_VERSION`: the version of the ElasticSuite module installed. By default, Front-Commerce considers a version < 2.9.
- ~~FRONT_COMMERCE_ES_VERSION: Elasticsearch server version (ex: 6.7)~~ deprecated in `2.0.0-rc.0` and removed in `2.0.0`

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

### BuyBox

See [our dedicated documentation page](/docs/advanced/payments/buybox.html#Configure-your-environment).

## Build related variables

- `NODE_ENV`: `"development"` or `"production"` a variable heavily used in the javascript ecosystem to let you add checks only on the development environment (warnings, guards, etc.)
- `SERVER`: `true` if your code is executed server side, `false` if it is client side
- `WEBPACK`: `true` if the javascript code you are executing is bundled with webpack or `false` if it is server code not within your webpack environment
- `FRONT_COMMERCE_ENABLE_SOURCE_MAP`: `true` if your code needs to expose source maps in production. By default it's `false` unless you've set `FRONT_COMMERCE_ENV=dev`.

## Current experiments

- `FRONT_COMMERCE_EXPERIMENTAL_NEW_RELIC_INSTRUMENT_GRAPHQL_SERVER`: enable Apollo Server experimental NewRelic instrumentation
- `FRONT_COMMERCE_EXPRESS_SHOP_FALLBACK_REDIRECT_HTTP_CODE`: allow to change the default store fallback HTTP code

## Debugging

<blockquote class="feature--new">
_Since version 1.0.0-beta.0_
</blockquote>

Front-Commerce leverages the [debug](https://www.npmjs.com/package/debug) package to show useful debugging information in the console.\
The `DEBUG` environment variable can be used to enable logging for different part of Front-Commerce, and some of the used libraries.

Front-Commerce debugs are in the `front-commerce` namespace.\
One can enable all of them using the following definition: `DEBUG="front-commerce:*"`

The core also allows you to debug API calls to remote services made in the server.\
To do so, define `DEBUG=axios`.

Both examples above can be combined as follow: `DEBUG="front-commerce:*,axios"`.\
Learn more in [the `debug` package documentation](https://www.npmjs.com/package/debug).

Here is a list of available debug namespaces:

- `axios`: debugs axios requests and responses (using [`axios-debug-log](https://www.npmjs.com/package/axios-debug-log))
- `express-http-proxy`: debugs media requests proxied by the media middleware (see [express-http-proxy](https://www.npmjs.com/package/express-http-proxy#trace-debugging))
- `express-session`: debugs cookies and how sessions are stored for each request (see [express-session](https://github.com/expressjs/session))
- `front-commerce:admin-bar`: debugs calls and role injection mechanisms for logging as a customer and other actions
- `front-commerce:authorization`: debugs proxy authorization for remote sources (see `makeProtectedProxyRouter.js`)
- `front-commerce:cache`: debugs cache invalidation calls and strategies information
- `front-commerce:cart`: debugs cart corrupted data received from remote sources
- `front-commerce:cluster`: debugs the node process id and other information to help configuring cluster mode
- `front-commerce:config`: dumps the configuration for a typical request at the `/__front-commerce/debug` URL
- `front-commerce:dispatcher`: debugs information about routes dispatching for registered page types
- `front-commerce:elasticsearch`: debugs all elasticsearch queries (**VERY VERBOSE!**)
- `front-commerce:image`: debugs image proxy actions (useful to troubleshoot interactions with remote media servers)
- `front-commerce:payment`: debugs payment interactions to help troubleshooting a payment workflow
- `front-commerce:payment:adyen`: debugs advanced Adyen information (several information are also logged in `server.log` no matter this flag)
- `front-commerce:payment:buybox`:  debugs HTTP interactions with BuyBox API (several information are also logged in `server.log` no matter this flag)
- `front-commerce:performance`: allow to debug server performance in production by enabling server timings
- `front-commerce:scripts`: debugs all scripts and tooling related commands (webpack…)
- `front-commerce:scripts:routes`: debugs routing generation during the `prepare` command
- `front-commerce:remote-schemas`: debugs [remote schema stitching](/docs/advanced/graphql/remote-schemas.html) related internals
- `front-commerce:httpauth`: debugs how [basic authorization](/docs/reference/configurations.html#config-httpAuth-js) is enabled
- `front-commerce:webpack`: enables `webpack-bundle-analyzer` on webpack client's bundle
- `front-commerce:performance`: forces activation of [server timings](/docs/advanced/performance/server-timings.html)

**Note:** one can run the `rg -iF '"front-commerce:'` to find these values.

<blockquote class="note">
In `development` environment, the source maps for both the server and the client sides are generated.
That means you can easily use the step by step debugging for both, see:

<ul>
  <li>[Node.js debugging guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)</li>
  <li>[The Firefox JavaScript Debugger](https://developer.mozilla.org/en-US/docs/Tools/Debugger) or [Debugging JavaScript in Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/javascript/)</li>
</ul>
</blockquote>

## Deprecation warnings

Front-Commerce leverages the [depd](https://www.npmjs.com/package/depd) package to show deprecation warnings so you can upgrade your codebase for compatibility with the next major version.

A meaningful module name is used to scope `depd` messages, and appears at the beginning of every output line.

One can leverage [`depd`'s `TRACE_DEPRECATION` environment variable](https://www.npmjs.com/package/depd#processenvtrace_deprecation) to display a stack trace for each deprecation. It will help you to find the line of code in your codebase that calls deprecated code.

Example:
```shell
TRACE_DEPRECATION=*
```

## Add your own environment variables

Depending on the amount of customization you add to your Front-Commerce application, you may need to add new environment variables. This is possible and don't need any particular steps. However, please keep in mind that the ones that are safely available in your bundles are:

* in your client bundle: all the variables starting with `FRONT_COMMERCE_WEB_`
* in your server bundle: all the variables starting with `FRONT_COMMERCE_`, including `FRONT_COMMERCE_WEB_`
