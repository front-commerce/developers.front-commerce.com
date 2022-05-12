---
id: troubleshooting
title: Troubleshooting
---

Over the years, many developers have used Front-Commerce. A learning curve for such a solution exist, and we have detected recurring errors that may be difficult to troubleshoot for developers new to Front-Commerce or starting a new project.

This page contains the most common errors you may encounter, along with information that will help to solve them quickly.

## My server is not starting

> I cannot prepare the application or make it start

1. check the stdout/stderr of your server and the `/logs` folder, there may be useful information
2. try to prefix your command with `DEBUG="front-commerce:scripts"` to enter verbose mode (e.g: `DEBUG="front-commerce:scripts" npm run start`)
3. try to remove your `.front-commerce` and `node_modules` directories, run `npm install` and try again… `¯\_(ツ)_/¯`

## Authentication issue

> I am not logged in after entering valid credential information in the login form

1. check the stdout/stderr of your server and the `/logs` folder, there may be useful information
2. have you cleared your cookies?
3. does the response send you a cookie with a valid domain?
4. are secrets for your backend correctly set?
5. is the session store correctly set? (see `config/sessions.js`)
   - for Filesystem storage: ensure you have the permissions to write session files (the default location is `.front-commerce/sessions`)
   - using another storage: is its configuration valid?
   - having multiple Front-Commerce processes: ensure that you are using a session store that's compatible with a distributed architecture (ex: redis, memcached, etc.).

## Redirection loop

> When visiting any page, I get redirected infinitely

1. check the stdout/stderr of your server and the `/logs` folder, there may be useful information
2. what is the output of a `curl -I http://example.com` (replace with the url causing issues)
3. it could be a redirection from the shop detection mechanism that redirects to the default one because it cannot find one matching the current url
   1. turn on the configuration debug mode using `DEBUG="front-commerce:config"`
   2. is the list of `validUrls` correct? Are urls from `config/stores.js` valid?
   3. is the `url` logged the one you used in your browser? If it has the port in it, it's likely because your server proxy/load balancer is not well configured. Please configure it so it adds `X-Forwarded-Proto`, `X-Forwarded-Port` and `X-Forwarded-For` headers ([classic headers for proxies and load balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/x-forwarded-headers.html)). [Example configuration for nginx proxy](https://calvin.me/forward-ip-addresses-when-using-nginx-proxy/).
4. it is redirecting to HTTPS although I don't have HTTPS on my server
   1. if it is your production server, please fix this! This is a severe security issue for your website and your users. It can also negatively impact your SEO and the trust of your users.
   2. if you know what you are doing, please make sure that your proxy sets `X-Forwarded-Proto` with `https` ([Example configuration for nginx proxy](https://calvin.me/forward-ip-addresses-when-using-nginx-proxy/))

## JavaScript is not loading on my site

1. which browser are you using? You can use https://www.whatismybrowser.com/ to get detailed information from the browser.
2. is this browser supported by the list defined in the `browserslist` key of your `package.json` file?
3. do you see any fatal error in your browser console (DevTools) or in `logs/client.log`?

## SSR is broken

> In Dev mode, I see [the SSR Fallback page](/docs/advanced/theme/server-side-rendering.html#SSR-Fallback-when-things-go-wrong)

1. check the stdout/stderr of your server and the `/logs` folder, there may be useful information
2. are all pages broken or only some of them?
3. ensure that there is [no code using browser APIs loaded server side](/docs/advanced/theme/server-side-rendering.html#There-is-no-window-on-the-server)(e.g: Google Maps)

## My JS bundle too big

> When I look at the total size of JS assets on a single page, it is over my budget (> 500Ko for instance)

Build your application locally with the appropriate debug flag: `DEBUG=front-commerce:webpack npm run build`

- look for big libraries and try to avoid their usage client side if possible, or find smaller alternatives (e.g: [date-fns](https://date-fns.org/) over [moment.js](https://momentjs.com/))
- look for libraries achieving the same task, and see if you couldn't adapt your code to only use one of them
- ensure that there is no import of server side code in your client bundle
- look for libraries duplicated across different chunks, they may be candidates to code splitting using loadable components

See https://developers.google.com/web/fundamentals/performance/webpack/monitor-and-analyze for further information

## The data returned by my GraphQL server is wrong

> I expected GraphQL to return me some data but got something different

1. ensure that the data is also incorrect if you execute the same query in your `/playground` (only available if `FRONT_COMMERCE_ENV !== "production"`)
2. start your server with `DEBUG=axios npm run start`. It will show you HTTP calls to remote systems, so you could reproduce them to ensure that the remote API returns valid data
3. if data comes from ElasticSearch, start your server with `DEBUG="front-commerce:elasticsearch" npm run start` to view all ElasticSearch query. Try to run them manually to ensure they are correct and that indexed data are too
4. ensure your cache is up to date. If using redis, run [`redis-cli flushall`](https://redis.io/commands/flushall) to empty all keys
5. check for the resulting data in your GraphQL resolvers by adding `console.log()`s so you can follow where data are incorrectly transformed

## I cannot `POST` a big payload to the server

<blockquote class="feature--new">
    _This value is configurable since version `2.2.0`_
</blockquote>

Front-Commerce's server contains 2 configurations defining a maximum size for `POST` payloads to prevent abuses.

The `express.graphQLBodyParserConfig.limit` (for GraphQL payloads size) and `express.jsonParserConfig.limit` configurations (for `POST` to server endoints, such as cache invalidation) can be overridden using a [configuration provider](/docs/advanced/server/configurations.html).

<blockquote class="tip">
  **Tip:** in DEV mode, you can view the current value for these configurations by opening the [/__front-commerce/debug](http://localhost:4000/__front-commerce/debug) URL.
</blockquote>

Here is an example of such config provider:

```js
export default {
  name: "express-configuration-overrides",
  values: Promise.resolve({
    express: {
      graphQLBodyParserConfig: {
        limit: "10mb", // default 1mb
      },
      jsonParserConfig: {
        limit: "10mb", // default 1mb
      },
    },
  }),
};
```

The provider must then be [registered in your application](/docs/advanced/server/configurations.html#Register-a-configuration-provider) as any other one.

## The signature is invalid. Verify and try again.

> **Magento2** returns a 401 HTTP Code with the following error message:
> `The signature is invalid. Verify and try again.`

It is very likely an OAuth error, for a feature using an **Admin loader** in Front-Commerce.

1. ensure your OAuth configuration is correct. If it is correct, you might be able to view orders from a Customer account.
2. ensure your Magento application [is patched with this fix for ZF1 OAuth Signature class](https://github.com/magento/zf1/pull/34)

If the problem persists, please contact us.

## My images are not loading properly

> There is an error when I try to display an image through Front-Commerce's proxy.

1. Is your Magento endpoint correctly configured? A common error is having a URL with `http` instead of `https`.
2. Is your image size properly defined? There is a validation step that should trigger some logs in your server if it is not defined properly.
3. Is the size of your image preset (in `src/config/images.js`) an odd number? Since by default the images are resized in a 0.5 size, **odd numbers can't be used** in `width` or `height`. Please change it to an adjacent pair number.

## I cannot view information when my product SKU contains a slash (`/`)

> You experience 404 pages or errors when accessing a product containing a `/` in its SKU

This is because the SKU is used (for Magento 2 and Magento 1 at least) as a parameter in a REST API. Such API calls can be incorrectly routed to the platform due to server configuration.

First, enable `DEBUG=axios` to view the failing API calls so you can reproduce it outside of Front-Commerce.

Then check your server documentation to see how to configure it accordingly:

- in Apache, you will have to add `AllowEncodedSlashes On` to your VirtualHost.
- in Nginx, `proxy_pass`.

Sources:

- https://github.com/magento/magento2/issues/13343#issuecomment-362783825 (and https://github.com/magento/magento2/issues?q=is%3Aissue+sort%3Aupdated-desc+slash+sku+api+is%3Aclosed)
- https://stackoverflow.com/a/4443129

## I'm using ElasticSearch for Magento 2 and categories are empty

> No products appear in your categories or search results

It is very likely due to a mismatch between Front-Commerce ElasticSearch queries and the way data are indexed in ElasticSearch. Different versions of ElasticSuite index data differently.

For ElasticSuite versions < 2.9, there is nothing special to do. For ElasticSuite versions 2.9+ you have to define the `FRONT_COMMERCE_ES_ELASTICSUITE_VERSION` environment variable with your ElasticSuite version. Front-Commerce will detect it and run queries that match the way data are indexed.

_Note: this setting was [introduced in Front-Commerce 2.3](/docs/appendices/migration-guides.html#ElasticSearch-7-x-and-ElasticSuite-2-9)_

## I have an error when using Magento 2's GraphQL

```
Class Magento\\GraphQl\\Model\\Query\\ContextExtensionInterfaceFactory does not exist
```

This can happen when running the following GraphQL query directly in Magento.

```graphql
{
  productsBySkus(skus: ["24-UB02"]) {
    sku
  }
}
```

However, this only happens if you've run `setup:di:compile` in `developer` environment. In developer mode you don't need to compile Magento's code. You can do so by deleting the files in the `generated` folder.

```
rm -rf generated/{code,metadata}
```

In `production` mode, the error won't occur.

## I have an error `Cannot read property 'label' of null` with Magento 2 native categories listing

If you're using Magento2 without [an external Search Engine](/docs/magento2/search-engine.html), and with [the ElasticSuite module](https://github.com/Smile-SA/elasticsuite) is installed in Magento you can face the following GraphQL error when browsing a category:

```
[
  TypeError: Cannot read property 'label' of null
      at /front-commerce/build/server/webpack:/src/server/modules/magento2/catalog/layers/resolvers.js:136:1
      at processTicksAndRejections (internal/process/task_queues.js:95:5)
      at async Promise.all (index 1)
      at async Promise.all (index 2)
      at async Promise.all (index 3)
      at async Promise.all (index 9)
      at async Promise.all (index 0) {
    path: [ 'route', 'layer', 'dynamicFacets', 2, 'label' ]
  },
  TypeError: Cannot read property 'values' of null
      at /front-commerce/build/server/webpack:/src/server/modules/magento2/catalog/layers/resolvers.js:149:1
      at processTicksAndRejections (internal/process/task_queues.js:95:5)
      at async Promise.all (index 2)
      at async Promise.all (index 2)
      at async Promise.all (index 3)
      at async Promise.all (index 9)
      at async Promise.all (index 0) {
    path: [ 'route', 'layer', 'dynamicFacets', 2, 'buckets' ]
  }
]
```

This is due to a known issue in ElasticSuite that [has been fixed](https://github.com/Smile-SA/elasticsuite/pull/2197) in [version 2.10.6](https://github.com/Smile-SA/elasticsuite/releases/tag/2.10.6).

**The solution is to update ElasticSuite to its latest version.** For a workaround in FC (not recommended!), see [this diff](https://gitlab.com/front-commerce/front-commerce/-/merge_requests/1264/diffs).

## Another issue?

Please contact our support or open an issue describing the encountered problem along with your environment using `npx envinfo --system --binaries`
