---
id: front-commerce-folder-structure
title: Front-Commerce folder structure
---

This documentation is a quick overview of Front-Commerce's folder structure.
If you don't have [access to the code](license.html) yet, you will notice
that
[Front-Commerce Lite](https://github.com/front-commerce/front-commerce-lite)
structure is the same. Installing it and browsing through some actual code
may help you better understand our choices.

```
src/
├── config/
├── server/
|   ├── express/
|   └── modules/
└── web/
    └── theme/
        ├── components/
        |   ├── atoms/
        |   ├── molecules/
        |   ├── organisms/
        |   └── templates/
        ├── modules/
        └── pages/
```

## src/config/

It contains all the files that allow you to configure the behavior of Front-Commerce.

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

It contains the client part of the application. As a developer that uses
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
