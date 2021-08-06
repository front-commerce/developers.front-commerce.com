---
id: prismic-installation
title: Installation
---

Here are the steps to install and configure the Front-Commerce Prismic module. This guide assumes that you are working in [a Front-Commerce skeleton environment](https://gitlab.com/front-commerce/front-commerce-skeleton/) and you have access to a Prismic repository.

## Install the module with npm:

First, make sure you have access to [the Front-Commerce Prismic module repository](https://gitlab.com/front-commerce/front-commerce-prismic/). Then you can run the following command:

```sh
npm install git+ssh://git@gitlab.com/front-commerce/front-commerce-prismic.git
```

## Configure the environment for Prismic

In the `.env` file, you have to define the following environment variables:

```sh
FRONT_COMMERCE_PRISMIC_URL=https://your-repository.prismic.io
FRONT_COMMERCE_PRISMIC_ACCESS_TOKEN=the-very-long-access-token-from-prismic
FRONT_COMMERCE_PRISMIC_WEBHOOK_SECRET=a-secret-defined-in-webhook-configuration
#FRONT_COMMERCE_PRISMIC_API_CACHE_TTL_IN_SECONDS=60
```

* `FRONT_COMMERCE_PRISMIC_URL` is the URL of your Prismic repository
* `FRONT_COMMERCE_PRISMIC_ACCESS_TOKEN` is the access token for the repository, go to _Settings > API & Security_ and create an application and copy the _Permanent access token_ generated for this application
* `FRONT_COMMERCE_PRISMIC_WEBHOOK_SECRET` is a secret key used to clear caches in Front-Commerce and to secure [Integration Fields API endpoints](/docs/prismic/integration-fields.html). To define it, go to _Settings > Webhook_ and create a webhook pointing to your Front-Commerce URL `https://my-shop.example.com/prismic/webhook`. In the webhook form, you can configure a _Secret_. This is the one you should use in this environment variable.
* `FRONT_COMMERCE_PRISMIC_API_CACHE_TTL_IN_SECONDS` is an optional configuration that allows to customize the TTL of Prismic API cache. Shortening it allows to prioritize data freshness in environments not targeted by a Prismic webhook over performance. **It defaults to 23h in production environments and 1min in staging and dev environments.**

<blockquote class="tip">
In case of trouble, `front-commerce:prismic` (or `front-commerce:prismic*` to include more specific namespaces) can be added to the `DEBUG` environment variable value, this value turns the debug on for Prismic module and make it verbose.
</blockquote>

### Simulate the webhook in a development environment

Configuring a webhook is required so that Front-Commerce fetches the last version of the Prismic content. In a development environment, you might skip this step. Data will get refreshed regularly depending on your `FRONT_COMMERCE_PRISMIC_API_CACHE_TTL_IN_SECONDS` configuration. In some situations, you may want to simulate Prismic webhooks to ensure your data uses the latest Prismic version without restarting the application.

You can simulate the webhook by issuing a `POST` request to `http://dev-fc-url/prismic/webhook` with the HTTP client of your choice. The body of this request must be a JSON object similar to `{"secret": "the value of FRONT_COMMERCE_PRISMIC_WEBHOOK_SECRET", "type": "api-update", "masterRef": true}`.

For instance, you can use the following curl command:

```sh
curl --request POST 'http://dev-fc-url/prismic/webhook' \
--header 'Content-Type: application/json' \
--data-raw '{
    "secret": "the value of FRONT_COMMERCE_PRISMIC_WEBHOOK_SECRET", "type": "api-update", "masterRef": true
}'
```

<blockquote class="tip">
From the root of your Front-Commerce project, you can use the following _oneliner_, it will build and execute the command from the .env file content:
```sh
source .env ; PAYLOAD=`printf '{"secret": "%s", "type": "api-update", "masterRef": true}' $FRONT_COMMERCE_PRISMIC_WEBHOOK_SECRET` ; curl -H "Content-Type: application/json" -d "$PAYLOAD" $FRONT_COMMERCE_URL/prismic/webhook
```
</blockquote>

## Configure Front-Commerce to use the Prismic module

For that, you have to apply some changes to your `.front-commerce.js`.

```diff
 modules: [
   "./node_modules/front-commerce/modules/datasource-elasticsearch",
   "./node_modules/front-commerce/theme-chocolatine",
+  "./node_modules/front-commerce-prismic/prismic",
   "./src",
 ],
 serverModules: [
@@ -13,6 +14,7 @@ module.exports = {
     path: "datasource-elasticsearch/server/modules/magento2-elasticsearch",
   },
   { name: "Magento2", path: "server/modules/magento2" },
+  { name: "Prismic", path: "prismic/server/modules/prismic" },
 ],
 webModules: [
   { name: "FrontCommerce", path: "front-commerce/src/web" },
```

The module is ready!

**You can now use the `Prismic` loader to [Expose Prismic Content in your project](/docs/prismic/expose-content.html).**

## Optional: update your CSP

If you plan to directly include images in your content, don't forget to add the domain `images.prismic.io` to `imgSrc` in [the `contentSecurityPolicy` configuration](/docs/reference/configurations.html#config-website-js).
