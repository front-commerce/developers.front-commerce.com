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
FRONT_COMMERCE_PRISMIC_LOCALE=en-us
FRONT_COMMERCE_PRISMIC_ACCESS_TOKEN=the-very-long-access-token-from-prismic
FRONT_COMMERCE_PRISMIC_WEBHOOK_SECRET=a-secret-defined-in-webhook-configuration
```

* `FRONT_COMMERCE_PRISMIC_URL` is the URL of your Prismic repository
* `FRONT_COMMERCE_PRISMIC_LOCALE`: your Prismic repository's locale (available at `https://your-repository.prismic.io/settings/multi-languages/`)
* `FRONT_COMMERCE_PRISMIC_ACCESS_TOKEN` is the access token for the repository, go to _Settings > API & Security_ and create an application and copy the _Permanent access token_ generated for this application
* `FRONT_COMMERCE_PRISMIC_WEBHOOK_SECRET` is a secret key used to clear caches in Front-Commerce and to secure [Integration Fields API endpoints](/docs/prismic/integration-fields.html). To define it, go to _Settings > Webhook_ and create a webhook pointing to your Front-Commerce URL `https://my-shop.example.com/prismic/webhook`. In the webhook form, you can configure a _Secret_. This is the one you should use in this environment variable.

<blockquote class="tip">
In case of trouble, `front-commerce:prismic` can be added to the `DEBUG` environment variable value, this value turns the debug on for Prismic module and make it verbose.
</blockquote>

<blockquote class="tip">
Configuring a webhook is required so that Front-Commerce fetches the last version of the Prismic content. In a development environment, you might skip this step. To make sure your running Front-Commerce uses the last version of the Prismic content without restarting it, you can use the following _oneliner_ from the skeleton directory to simulate a webhook call:

```sh
source .env ; PAYLOAD=`printf '{"secret": "%s", "type": "api-update", "masterRef": true}' $FRONT_COMMERCE_PRISMIC_WEBHOOK_SECRET` ; curl -H "Content-Type: application/json" -d "$PAYLOAD" $FRONT_COMMERCE_URL/prismic/webhook
```
</blockquote>

## Configure Front-Commerce to use the Prismic module

For that, you have to apply some changes to your `.front-commerce.js`.

### Magento2

In a Magento2 based setup:

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

### Magento1

In a Magento1 based setup:

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
+  { name: "Prismic", path: "prismic/server/modules/prismic/index.magento1.js" },
 ],
 webModules: [
   { name: "FrontCommerce", path: "front-commerce/src/web" },
```

## Configure required types in your Prismic repository

The Front-Commerce Prismic module needs 2 custom types to be created, one for the pages and one the blocks.

### CMS Page

On `http://your-repository.prismic.io/masks/`, click on _Create new_ and create a _Repeatable Type_ named `CMS Page` which _API ID_ is `cms-page`, then in the _JSON editor_ tab in the right pane, paste the following code:

```json
{
  "Main" : {
    "uid" : {
      "type" : "UID",
      "config" : {
        "label" : "UID",
        "placeholder" : "URL used by FC to access the CMS content"
      }
    },
    "meta_title" : {
      "type" : "Text",
      "config" : {
        "label" : "Meta title",
        "placeholder" : "Meta title for SEO purposes"
      }
    },
    "meta_description" : {
      "type" : "Text",
      "config" : {
        "label" : "Meta description",
        "placeholder" : "Meta description for SEO purposes"
      }
    },
    "title" : {
      "type" : "Text",
      "config" : {
        "label" : "Title",
        "placeholder" : "title"
      }
    },
    "content_heading" : {
      "type" : "StructuredText",
      "config" : {
        "single" : "heading1",
        "label" : "Content heading",
        "placeholder" : "Title of the page"
      }
    },
    "content" : {
      "type" : "StructuredText",
      "config" : {
        "multi" : "paragraph, preformatted, heading1, heading2, heading3, heading4, heading5, heading6, strong, em, hyperlink, image, embed, list-item, o-list-item, o-list-item",
        "label" : "Content",
        "placeholder" : "Content of the page"
      }
    }
  }
}
```

And finally, save the type.

### CMS Block

On `http://your-repository.prismic.io/masks/`, click on _Create new_ and create a _Repeatable Type_ named `CMS Block`which _API ID_ is `cms-block`, then in the _JSON editor_ tab in the right pane, paste the following code:

```json
{
  "Main": {
    "uid": {
      "type": "UID",
      "config": {
        "label": "UID",
        "placeholder": "URL used by FC to access the CMS content"
      }
    },
    "title": {
      "type": "Text",
      "config": {
        "label": "Title",
        "placeholder": "Title of the page"
      }
    },
    "content": {
      "type": "StructuredText",
      "config": {
        "multi": "paragraph, preformatted, heading1, heading2, heading3, heading4, heading5, heading6, strong, em, hyperlink, image, embed, list-item, o-list-item, o-list-item",
        "label": "Content",
        "placeholder": "Content of the page"
      }
    }
  }
}
```

And finally, save the type.

## Test it

You can now (re)start Front-Commerce to take your configuration changes into account.

To test it, on Prismic side, you can now create a new `CMS Page` content. When creating the page, take note of the `UID` you set, it will be used as the page identifier so the page will be accessible in Front-Commerce at the URL `http://your-fc-url/the-uid-you-defined`.

<blockquote class="tip">
If you include images in your content, don't forget to add the domain `images.prismic.io` to `imgSrc` in [the `contentSecurityPolicy` configuration](/docs/reference/configurations.html#config-website-js).
</blockquote>
