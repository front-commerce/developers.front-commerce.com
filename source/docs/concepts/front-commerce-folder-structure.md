---
id: front-commerce-folder-structure
title: Front-Commerce folder structure
---

This documentation is a quick overview of Front-Commerce's folder structure.

```
src/
├── config/
├── server/
|   ├── express/
|   └── modules/
└── web/
    └── theme/
    |   ├── components/
    |   |   ├── atoms/
    |   |   ├── molecules/
    |   |   ├── organisms/
    |   |   └── templates/
    |   ├── modules/
    |   └── pages/
    └── service-worker.js
```

## src/config/

The config contains all the files that allow you to configure the behavior of Front-Commerce.

See more details within the [Reference documentation](/docs/reference/configurations.html).

## src/server/

The server contains… the server code! There are two parts:

- `express/`: the node server definition that serves the responses to client
  requests. This includes Server Side Rendering, GraphQL endpoint, image proxy,
  session handlers, etc. (see [Add custom endpoints to your server](/docs/advanced/server/add-http-endpoint.html))
- `modules/`: the modules that compose your GraphQL schema. This includes type
  definitions, resolvers, etc. (see
  [Extend the GraphQL Schema](/docs/essentials/extend-the-graphql-schema.html))

## src/web/

the web contains the client part of the application. As a developer that uses
Front-Commerce, only one folder is interesting inside of `src/web/`. It is the
`theme` folder which defines what your site will look like. This folder is
composed of three subfolders:

- `components/`: contains all the code that defines the look & feel of your site. It
  follows the Atomic Design principles. (see
  [Create a UI Component](/docs/essentials/create-a-ui-component.html))
- `modules/`: contains all your components that are not related to the style of
  your application. (see
  [Create a Business Component](/docs/essentials/create-a-business-component.html))
- `pages/`: contains all the root components of your application that are mapped
  to a URL. (see [Add a new page](/docs/essentials/add-a-page-client-side.html))

In order to learn more about it, please refer to
[React components structure](react-components-structure.html).

## src/web/service-worker.js

A ready service worker to handle pre-caching. You can override this file to add more functionality to your service worker such as push notification. However please note that this file is not part of the build process (i.e. it would be copied as is). As such in order to import scripts using the [importScripts](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts) you need to make sure that the path given to `importScripts` is browseable. The easiest way to do so is to create a folder called `public` at the root of your module and add the files you want to import using `importScripts` directly in it. Now you can import them by using `import("/a_store_base_url/path_to_file_to_import")` e.g. `import("/en/service-worker-push-notifications.js")`. P.S. the `/a_store_base_url` is needed since the `public` folder is exposed on the store level. You can use any of your stores' base URLs as all will expose the same file.
