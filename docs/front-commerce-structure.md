---
id: front-commerce-folder-structure
title: Front-Commerce folder structure
---

Whether you are using Front Commerce or its Lite version, we use the same file
structure.

```
src/
├── server/
|   ├── express/
|   └── modules/
└── web/
    └── theme/
        ├── ui/
        |   ├── atoms/
        |   ├── molecules/
        |   ├── organisms/
        |   └── templates/
        ├── modules/
        └── pages/
```

## src/server/

The server contains… the server code! It is splitted in two parts:

* `express/` : the node server definition that serves the responses to client
  requests. This includes Server Side Rendering, GraphQL endpoint, image proxy,
  session handlers, etc.
* `modules/` : the modules that compose your GraphQL schema. This includes type
  definitions, resolvers, etc.

In order to learn more about it, please refer to [TODO Section](#).

## src/web/

It contains the client part of the application. As a developer that uses
Front-Commerce, only one folder is interesting inside of `src/web/`. It is the
`theme` folder which defines what your site will look like. This folder is
composed of three subfolders:

* `ui/` : contains all the code that defines the look & feel of your site. It
  follows the Atomic Design principles.
* `modules/` : contains all your components that are not related to the style of
  your application.
* `pages/` : contains all the root components of your application that are
  mapped to a URL.

In order to learn more about it, please refer to
[React components structure](react-components-structure.md).
