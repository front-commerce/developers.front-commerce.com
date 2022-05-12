---
id: customize-response-http-headers
title: Customize response HTTP headers
---

Front-Commerce leverages [helmet](https://www.npmjs.com/package/helmet) to send security related HTTP headers. As mentioned in its README file, _It's not a silver bullet, but it can help_ preventing security issues. This guide explains how to customize those HTTP headers.

## `Content-Security-Policy` (_aka_ CSP)

According to [Content Security Policy (CSP) MDN article](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP):

> Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement to distribute malware.

In a nutshell, the `Content-Security-Policy` header instructs the browser on how it should handle resources such as JavaScript, CSS, images, … or anything it can load on a page.

In Front-Commerce, the content of this header can be controlled by tweaking [`contentSecurityPolicy` configuration into `config/website.js`](/docs/reference/configurations.html#config-website-js). This is where you will be able to let the browser know that for instance it can safely load a JavaScript file from a given origin.

## Other headers

To customize other headers send by default, you have to write a custom express middleware.

For instance, here is how you can to set [the `Referer-Policy` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) to `origin-when-cross-origin`:

1. [create module and add a `server/module.config.js` to declare a global server middleware](/docs/advanced/server/add-http-endpoint.html#Add-a-global-server-middleware). This file would look like:

```js
// server/module.config.js into one of your module
import setReferrerPolicy from "./express/setReferrerPolicy";

export default {
  endpoint: {
    __dangerouslyOverrideBasePathChecks: true,
    path: "/",
    router: setReferrerPolicy,
  },
};
```

1. write the middleware that will set the header. In this middleware, you can use any of the function [exposed by helmet](https://helmetjs.github.io/#reference).

```js
// server/express/setReferrerPolicy.js imported in the previous snippet
import { Router } from "express";
import { referrerPolicy } from "helmet";

const setReferrerPolicy = () => {
  const router = new Router();

  router.use(referrerPolicy({ policy: "origin-when-cross-origin" }));

  return router;
};

export default setReferrerPolicy;
```

And that's it. When the module having the `server/module.config.js` and `server/express/setReferrerPolicy.js` files will be enabled in `.front-commerce.js`, Front-Commerce will set the `Referrer-Policy` header to `origin-when-cross-origin`.
