---
id: routing
title: Routing
description: 'In Front-Commerce, the routing relies on two concepts: web modules and files in the "web/theme/routes" directory of your web module. This reference explains how to customize the routes of your application.'
---

## Which routes are loaded?

Routes are loaded depending on the web modules declared in `.front-commerce.js`. See [`.front-commerce.js::webModules`](/docs/reference/front-commerce-js.html#webModules).

## How routes are loaded?

Routes are detected from the `theme/routes/` folder within the folder indicated in `.front-commerce.js::webModules`. For instance, if the resolved path is `src/web/index.js`, the loaded routes will be `src/web/theme/routes`. If it's `src/web`, it will still be `src/web/theme/routes`.

Within the `web/theme/routes` folder, the following file structures will be transformed to the following URLs used in [React Router](https://reacttraining.com/react-router/web/guides/quick-start):

| file path                              | url                |                                           |
| -------------------------------------- | ------------------ | ----------------------------------------- |
| `web/theme/routes/index.js`            | `/`                |                                           |
| `web/theme/routes/file.js`             | `/file`            |                                           |
| `web/theme/routes/[slug].js`           | `/:slug`           |                                           |
| `web/theme/routes/id-[id].js`          | `/id-:id`          |                                           |
| `web/theme/routes/[id]id.js`           | `/:idid`           | Be careful with this unexpected behaviour |
| `web/theme/routes/deep/path/index.js`  | `/deep/path`       |                                           |
| `web/theme/routes/deep/path/file.js`   | `/deep/path/file`  |                                           |
| `web/theme/routes/deep/path/[slug].js` | `/deep/path/:slug` |                                           |

## How routes are overridden?

The following rules define which route wins in case the same URL matches several files:

- If the same file is defined in two web modules, the latest web module from `.front-commerce.js` wins.
- If there is `web/theme/routes/path/index.js` and `/web/theme/routes/path.js`, `/web/theme/routes/path/index.js` wins even across multiple web modules.

These rules also applies to special files listed below.

## What kind of special files can we define in routes?

Special files are always prefixed with `_`.

- [Layouts (see docs)](/docs/advanced/theme/layouts.html): which wraps the components in the sub folders. The exported component receives the properties [`match`, `location` and `history`](https://reacttraining.com/react-router/web/api/Route/route-props) available in React Router and the `basePath` which is the path of the parent element.
  - `_layout.js`: Replace any layout used in the parent folders
  - `_inner-layout.js`: Adds a new wrapper around all the routes in the current folder
- `_error.js`: Customize how to render errors (rendering errors with Error Boundaries or 404 Errors) in the current folder. The exported component receives the properties `codeStatus` and `error` (`error` is only available in the case of error boundaries).

## Debugging

When the routes are loaded in Front-Commerce, they are transformed into a file located at `.front-commerce/routes.js`. This can give you a better vision about which URL loads which route.

However, do **not** edit this file as it will be recreated on each application start/build.

You can also see debugging information by enabling `DEBUG=front-commerce:scripts:routing`.
