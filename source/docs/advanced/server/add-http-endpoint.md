---
id: add-http-endpoint
title: Add custom endpoints to your server
---

The main entrypoints of a Front-Commerce application are frontend URLs displaying your actual website and the GraphQL schema. But in some specific cases, you may want to extend your Node.js server (BFF) with additional endpoints.

For instance, this can be the case when you send a link within an email to one of your customers. If an action should be triggered when the user clicks on it, you don't want to add failure opportunities by displaying a webpage which will then trigger a GraphQL mutation. You want to trigger the action directly, and then redirect the user to an actual page.

This can also be useful if you want to add new pages that are used in an administration interface. For instance, you may want to provide an iframe that will let you preview how your WYSIWYG component will be displayed in Front-Commerce. This is what we are going to explain in this documentation.

Technically, Front-Commerce’s server is based on [Express](http://expressjs.com/). To add your [custom route](https://expressjs.com/en/guide/routing.html) which will add your custom endpoint, you need to register it from your own module.

## What is a module?

A module is declared using the `module` entry from the [`.front-commerce.js`](#TODO) file. Each module can contain client code (See [Extend the theme](/docs/essentials/extend-the-theme.html)), and server code (current guide).

Once the module is declared, Front-Commerce will automatically add your custom server entrypoints following your module configuration in `my-module/server/module.config.js`.

<blockquote class="note">
**Important:** GraphQL modules, are modules related to the server, but they won't let you extend anything else but your GraphQL Schema. See [Extend the GraphQL Schema](/docs/essentials/extend-the-graphql-schema.html) for more information.
</blockquote>

## Register additional routes

In the case of the WYSIWYG preview, let's say that when a user visits the `wysiwyg-preview` URL, we want to display static files that will let anyone preview how an html string will be transformed by [Front-Commerce's Wysiwyg component](https://gitlab.com/front-commerce/front-commerce/tree/develop/src/web/theme/modules/Wysiwyg).

To do so, we need to declare create our server config file `my-module/server/module.config.js`, and configure its `entrypoint` key.

```js
module.exports = {
  endpoint: {
    // The path added to your Front-Commerce server
    path: "/wysiwyg-preview",
    // The router used for this path
    router: require("./express")
  }
};
```

If we translated this in a standard express application, it would look like this:

```js
app.use("/wysiwyg-preview", require("./express")())
```

<blockquote class="note">
See our express middleware to understand how the magic works: [`withCustomRouters`](https://gitlab.com/front-commerce/front-commerce/blob/85f1a8ef55a351f0feb9309c666992bbbb153993/src/server/express/withCustomRouters.js#L23).
</blockquote>

Thus, the `my-module/server/express.js` file within your module should be a function returning either a standard express route (`(req, res, next) => { /* ... */ }`) or [an express router](https://expressjs.com/en/api.html#router).

Now, if we want to display our WYSIWYG preview iframe, it could look like this:

```js
const path = require("path");
const cors = require("cors");
const express = require("express");
const Router = express.Router;
const config = require("config/website");

const ONE_HOUR = 60 * 60;

module.exports = () => {
  const router = new Router();

  // We make sure that the resources are only available for
  // our administration interface
  router.use(
    cors({
      origin: config.admin
    })
  );

  // And then, we render a static page that let's you
  // preview some wysiwyg content
  router.use(
    express.static(path.join(process.cwd(), "build/wysiwyg"), {
      setHeaders: function(res, url, stat) {
        res.setHeader("Cache-Control", `public, max-age=${ONE_HOUR}`);
      }
    })
  );

  return router;
};
```

## Add a global server middleware

We've added our middleware that is now available under the `/wysiwyg-preview` path. But what if we want to add a middleware that should be used before any requests to your application?

To do so, you will need to add the option `__dangerouslyOverrideBasePathChecks` to your endpoint configuration.

```js
module.exports = {
  endpoint: {
    __dangerouslyOverrideBasePathChecks: true,
    path: "/",
    router: require("./express")
  }
};
```

Indeed, if you don't set this key to `true`, Front-Commerce will check that you don't setup an invalid path.

For instance, you don't want Front-Commerce to check this if your application is a migration from an older website. Indeed, in this case, you will want to dome some SEO by keeping your old URLs, at least by setting redirections for the ones that don't make sense in your new website. The middleware will let you add this redirection before rendering any page of your website.