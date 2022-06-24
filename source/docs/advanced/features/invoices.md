---
id: invoices
title: Invoices
description: Customers can have access to their invoices from their account. By default, if the integration supports it, invoices can be accessed from order pages and have an online HTML version with a printable-friendly theme. This guide explains how to adapt the feature to your needs.
---

In a project, you may want to change the default source to retrieve invoices or prefer to provide a downloadable PDF document for them. This section documents how that could be achieved.

## Front-Commerce Invoice

The `front-commerce/invoice` GraphQL module defines shared interfaces to represent Invoices:

- `FcInvoice`: a generic invoice entity
- `FcDownloadableInvoice`: invoices that can be downloaded by the Customer (implements `FcInvoice`)
- `FcDisplayableInvoice`: invoices that can be displayed on the web by the Customer (implements `FcInvoice`)

## Replace default invoices with downloadable invoice files

We will illustrate how one can replace the default Front-Commerce implementation to provide PDF files for invoices. It will highlight the existing extension points that might be useful to implement any other specific use cases you may face.

Customizing how invoices are resolved in your application consists in 3 steps:

- adding a new Invoice type to the graphql schema
- overriding the `Order.invoices` resolver to fetch invoices from your endpoint
- making the file downloadable for the Customer

### Add your new Invoice type to the graphql schema

_This section assumes that you know how to [Extend the GraphQL schema](/docs/essentials/extend-the-graphql-schema.html)_

Since the invoice is aimed at being downloadable, the new invoice type will have to implement the `FcDownloadableInvoice` interface.

```
type AcmeInvoice implements FcDownloadableInvoice {
  id: ID
  download: DownloadLink
}
```

### Fetch invoices from your endpoint

Override the `Order.invoices` resolver by providing a list coming from your own API (there can be multiple invoices for each order). In this example, we consider that all invoices are `AcmeInvoice` but Front-Commerce supports heterogeneous types:

```
export default {
  Order: {
    invoices: ({ entity_id }, _, { loaders }) => {
      return loaders.AdminInvoice.loadByOrderId(entity_id);
    },
  },
  FcInvoice: {
    __resolveType: ({ __typename }) => {
      return "AcmeInvoice";
    },
  },
  AcmeInvoice: {
    download: ({ id, entity_id }, _, { loaders }) => {
      return loaders.AcmeInvoice.loadPdf(entity_id);
      // should return { name: "The downloaded file name.pdf", url: "/invoices/fileXXX.pdf" }
    },
  },
};
```

### Make invoice files downloadable for Customers

You must implement [a custom router](/docs/advanced/server/add-http-endpoint.html) to expose the PDF file on a URL. The implementation of this route is up to you and depends on your context.

It might be a simple proxy, but if your remote data source does not implement access control you may have to roll your own authorization checks to ensure that Customers cannot access invoices that don't belong to them.

Here is an example of a custom router that proxy a Magento remote url with additional checks:

```
import proxy from "express-http-proxy";
import config from "server/express/config";
import withMagentoProxyHeaders from "server/express/withMagentoProxyHeaders";
import makeProtectedProxyRouter from "server/core/makeProtectedProxyRouter";

router.get(
  "/invoices",
  withMagentoProxyHeaders(config), // To allow a Magento protected by .htpasswd
  makeProtectedProxyRouter(
    (req) => {
      // Am I allowed to view this proxy?
      const loaders = makeLoadersFromRequest(config, req);
      return loaders.CustomLoader.isAuthorized();
    },
    proxy((req) => req.config.magento.endpoint, {
      proxyReqPathResolver: (req) => "/invoices" + req.url,
      userResDecorator: (proxyRes, resBuffer, req, res) => {
        if (proxyRes.statusCode !== 200) {
          throw new Error("Invalid response");
        }
        return resBuffer;
      },
      proxyErrorHandler: (err, res, next) => {
        next();
      },
    })
  )
);
```

<blockquote class="info">
**Note:** when the user is not authorized or the final path does not work, it will display a 404 page instead. This is kind of for a security reason but mostly because we don't want to force people to style a new error page!
</blockquote>
