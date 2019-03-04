---
id: front-commerce-js
title: .front-commerce.js
---

The `.front-commerce.js` configuration file at the root of a Front-Commerce project is the main entrypoint defining the application.
From

## `modules`

A module is declared using the `module` entry from the [`.front-commerce.js`](#TODO) file. Each module can contain client code (See [Extend the theme](/docs/essentials/extend-the-theme.html)), and server code (current guide).

Once the module is declared, Front-Commerce will automatically add your custom server entrypoints following your module configuration in `my-module/server/module.config.js`.

## `styleguidePaths`

-> Display only the relevant stories to your Design System

If you run the styleguide for your own project, you may notice that
Front-Commerce comes with a lot of stories. This is what serves as
documentation Front-Commerce base theme's core components.

However, you might not use each one of them in your final theme, and some
stories might become irrelevant in your design system. To chose which one to
display, you need to update the `.frontcommerce.js` configuration file, and
add the key `styleguidePaths`.

## `name`
## `url`
## `serverModules`


Front-Commerce allows you to manage your modules in the `serverModules` key of
the [`.frontcommerce.js`](#TODO) file located in your project’s root.

Let’s add a `ClicksCounters` GraphQL module by adding it to the existing list:



The `name` key must be unique across your server modules. It is a temporary name
that is used during a code generation step and has no other usage in the
application. _Do not worry about it, it will be deprecated in a near future: see
[#179](https://gitlab.com/front-commerce/front-commerce/issues/179) for further
information._

The `path` must be a path to your module definition file (created above).