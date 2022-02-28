---
id: cli
title: CLI
---

With Front-Commerce comes a CLI tool (`front-commerce`) that helps you launch the tasks needed to develop, build and launch your application.

These commands should be launched from your project's root directory. This can be done by:

- Using npm scripts (just like [front-commerce-skeleton/package.json](https://gitlab.com/front-commerce/front-commerce-skeleton/blob/main/package.json#L7))
- Prefixing the commands with `npx` which will call the `front-commerce` bin in your project

## `front-commerce help`

Displays a message referencing the different commands available.

## `front-commerce lint`

This command ensures that your project is correctly linted. This means that it will:

- format your code with prettier
- prevent errors by using eslint rules

In order to configure the rules, please refer to the `eslintConfig` key in your `package.json`.

A basic config could be :

```
{
  "extends": [
    "eslint:recommended",
    "react-app"
  ],
  "plugins": [
    "prettier",
    "security"
  ],
  "rules": {
    "no-console": [
      "warn",
      {
        "allow": [
          "warn",
          "error"
        ]
      }
    ],
    "prettier/prettier": "warn"
  }
}
```

The files linted are the files within the modules you have defined in [`.front-commerce.js`](/docs/reference/front-commerce-js.html). However, the modules that are in `node_modules` won't be linted.

> Please note that the errors and warnings that this tool will log are also displayed when using `front-commerce start` in development mode. The `front-commerce lint` command is mainly useful when you want to ensure that your code is correctly linted before committing it to your repository.

## `front-commerce prepare`

This command will generate all the files needed to launch a Front-Commerce application. It will use the [`.front-commerce.js`](/docs/reference/front-commerce-js.html) configuration file to know what to generate.

The generated files will be located in the `.front-commerce` folder in the root of your project.

## `front-commerce build`

Before running this command, please make sure to run `front-commerce prepare`.

This command will generate all the compiled files needed to launch your application in a production environment. The generated files will be located in the `build` folder in the root of your project.

Once it is generated, you can launch the application by using `NODE_ENV=production front-commerce start`.

## `front-commerce start`

This command will launch the Front-Commerce application. There are two modes available:

- `NODE_ENV=development front-commerce start`: launches Front-Commerce application in development mode (hot reloading, linting, etc.).  
  Please make sure to have launched `front-commerce prepare` beforehand.
- `NODE_ENV=production front-commerce start`: launches Front-Commerce application in production mode (using precompiled code).  
  Please make sure to have launched `front-commerce build` beforehand.

## `front-commerce styleguide`

This command lets you view your Front-Commerce's components in [Storybook](https://storybook.js.org/).

There are two modes available:

- `NODE_ENV=development front-commerce styleguide`: launches Storybook in development mode (hot reloading, linting, etc.).
- `NODE_ENV=production front-commerce styleguide`: builds the assets of Storybook in `build/styleguide`. The generated files could then be served on any hosting solution supporting static websites.

## `front-commerce translate`

This command checks your translations and adds the missing one to `translations/[lang].json` in the root of your application. See [Translate what's in your components](/docs/advanced/theme/translations.html#Translate-what’s-in-your-components) for more information.

If some translations are missing, the script will throw an error. This lets you ensure that everything is correctly translated in your CI.

### Options

- `--ignore-build`: By default, this command will build your application to make sure that no translation is forgotten. However, if you've just run `front-commerce build`, this step is not necessary. `--ignore-build` option is what makes it possible not to build the application during the translation.
- `--module` (`-m`): scope translations to a specific module registered in your `.front-commerce.js` configuration file. Translation files will be written in the `/path/to/module/translations` directory instead of your application's one.

## `front-commerce test`

This command allows to launch tests using [Jest](https://jestjs.io/) already configured to work properly with a Front-Commerce codebase.

By default this command will launch all the tests available. These tests can be categorized in three scopes (which are jest projects internally):

- `server`: it runs all the unit tests in `server/**/__tests__` folders.
- `pact`: it runs all the [Pact](https://docs.pact.io/) tests in `server/**/__pacts__` folders. Its specificity is that it boots a pact server that will allow you to mock interactions with external APIs. Its main usage is for testing loaders in GraphQL modules.
- `client`: it runs all the tests in `web/**/__tests__` folders. Its specificity is that it boots under a jsdom environment allowing you to use a mocked DOM environment. It is necessary to use when testing React components.

You can only parts of the tests by setting the scope when executing the command: `front-commerce test <scope>`. If no scope is defined all the scopes will be executed.

After the scope, you can use any Jest option. For instance if you want to run the tests in watch mode, you should add `--watch` at the end of your command.

<blockquote class="note">

**Tip:** If you are abstracting the `front-commerce` CLI with [npm scripts](https://docs.npmjs.com/misc/scripts), please note that you can pass any option(s) to your npm script by using this syntax: `npm run test -- <option1> <option2>`.

</blockquote>
