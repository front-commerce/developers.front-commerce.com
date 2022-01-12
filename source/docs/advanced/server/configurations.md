---
id: setup-configurations
title: Configurations
---

Configuration is a part of software development that can quickly become messy. Validation, detection, performance... There is a lot to take care of. In Front-Commerce we solved this by defining what we call **Configuration Providers**.

In this guide we will see how they work and how to create new configurations or override existing ones.

## What is a configuration provider?

The goal is to give access to a configuration object that contains all the configuration of the store. This configuration object can contain any kind of configuration. It can be flags about a feature activation, some credentials to connect to a remote service, etc.

However, not all applications will need every single configuration. For instance, a shop that chose to use [Algolia](https://www.algolia.com/) won't have the same configurations than a shop that chose [Elasticsearch](https://www.elastic.co/) for product search. The goal of the configuration providers is to define the configurations needed for the specific modules you use in your application.

On server start, the configuration providers will then be combined to create the global configuration object. This configuration object will then be available on each server request.

This can be illustrated by starting your Front-Commerce server with the environment variable `DEBUG=front-commerce:config`. If your server is running on `http://localhost:4000` and you open the URL [`/__front-commerce/debug`](http://localhost:4000/__front-commerce/debug), you will have a dump of the configuration for this specific request under the section `req.config`.

> **Note:** The section is called `req.config` in reference to the `req` object that contains the current user request. Whenever you need to have access to the configuration object, please look for a `req` object will have the key `config`. For instance, in GraphQL modules, [the `req` object is available in the `contextEnhancer`](/docs/reference/graphql-module-definition.html#contextEnhancer-optional).

```json
{
  "allShops": {
    "store:default": {
      "id": "default",
      "url": "http://localhost:4000",
      "locale": "en-GB",
      "magentoStoreCode": "default",
      "currency": "EUR"
    }
  },
  "currentShopId": "default",
  "cache": {
    "defaultMaxBatchSize": 100,
    "strategies": [
      {
        "implementation": "Redis",
        "supports": "*",
        "disabledFor": [],
        "config": {
          "host": "localhost"
        }
      }
    ]
  },
  "magento": {
    "endpoint": "http://magento23.test",
    "version": "2",
    "proxiedPaths": []
  }
}
```

> **Important:** Don't activate this on a public instance as it can expose sensitive data

## Configuration provider definition

In practice, a configuration provider is an object with five properties: a name, a schema, static values (available independently from the request), a function to resolve values depending on the request and a function to fetch values remotely.

```js
const serviceConfigurationProvider = {
  name,
  schema,
  values,
  slowValuesOnEachRequest,
  fetchRemoteConfiguration,
};
```

See the sections below to understand what each key stands for.

### Name (key `name`, mandatory)

The identifier of the configuration provider. This is needed for configuration providers' registration. See [Register a configuration provider](#Register-a-configuration-provider) for more details.

```js
const name = "serviceProvider"
```

### Schema (key `schema`, optional)

It's a function returning an object representing the definition of the fields that will appear in the global configuration object if the configuration provider is registered. It can define things like field formats, default values or environment variables.

The schema definition is based on [convict](https://github.com/mozilla/node-convict), a library developed by Mozilla to validate configurations. For a single field, the schema will have these keys:

- `doc` (string): A description of the field and pointers to learn how to get its value if it requires a manual operation
- `format` (string, array or function): The formatter used for this field's value. See [how validation works in convict](https://github.com/mozilla/node-convict#validation).
- `default` (any): A default value. If you don't have a default value, you still have to set one by using the `null`. If there is no default value, it won't be considered as a field definition.
- `env` (string, optional): The name of the environment variable that should be used as the value config. If none is given, the configuration won't be configurable by environment. Please keep in mind that environment variables should still match [Front-Commerce's naming convention](/docs/reference/environment-variables.html#Add-your-own-environment-variables).

Thus, if we want to define a config named `serviceKey` available in `req.config.serviceKey` that would take its value from the environment variable `FRONT_COMMERCE_SERVICE_KEY`, we would use this schema definition:

```js
const schema = () => ({
  serviceKey: {
    doc: "The key to get access to our remote service",
    format: String,
    default: null,
    env: "FRONT_COMMERCE_SERVICE_KEY"
  }
});
```

A configuration provider's schema is not limited to a single field though. You can set multiple configuration keys but also nest deeper objects. For instance, if we want to group a `key` and a `secret` into a single `service` key, we would write the following schema:

```js
const schema = () => ({
  service: {
    key: {
      doc: "The key to get access to our remote service",
      format: String,
      default: null,
      env: "FRONT_COMMERCE_SERVICE_KEY"
    },
    secret: {
      doc: "The secret to get access to our remote service",
      format: String,
      default: null,
      env: "FRONT_COMMERCE_SERVICE_SECRET"
    }
  }
});
```

You could then access the values with `req.config.service.key` or `req.config.service.secret`.

Please note that if another configuration provider's schema also defined a `service` key, it would merge the definitions and in your final `req.config.service` you would have both the keys from the other configuration provider's schema and from the above schema.

### Static values (key `values`, optional)

Most of the time `default` values in the schema is sufficient. However, in some cases you may need to fetch some values from an API, a dynamic file, etc. This is what `values` is for.

It is an optional promise that should return the missing values in your schema. It will override default values and env values from the schema with the new values. However only keys from the `values` result will take precedence, the default values and env values will be kept for other keys. For instance, if we implemented the following `values` promise, the `secret` would still be `process.env.FRONT_COMMERCE_SERVICE_SECRET` from the above schema.

```js
const values = fetch("https://api.example.com/my-service-key")
  .then(response => response.json())
  .then(key => ({
    service: {
      key: key
    }
  }));
```

Please note that this promise is launched only once on server bootstrap. If the configuration changes over time on your API, the `req.config.service.key` value will still be the same.

If it needs to change over time, please use `slowValuesOnEachRequest` or `fetchRemoteConfiguration` instead.

### Values depending on the request (key `slowValuesOnEachRequest`, optional)

> **Note:** `slowValuesOnEachRequest` is a low level API in Front-Commerce. You shouldn't need it in most cases.

`slowValuesOnEachRequest` is a function that extracts configuration values from the current request. For instance, depending on the URL, the configuration `currentShopId` will get a different id and thus display different information.

```js
const slowValuesOnEachRequest = req => {
  const url = req.originalUrl;
  const shopId = getShopIdFromUrl(url);
  return {
    currentShopId: shopId
  };
};
```

<blockquote class="warning">

**Warning:** This part is named `slowValuesOnEachRequest` because we want to stress the fact that it can have a huge impact on your website performance. Avoid its usage as much as you can and try to use `values` instead. If this is the only way to setup your configuration make sure to memoize its result to limit the performance impact as much as possible.

```js
import memoize from "lodash/memoize";

const getShopIdFromHostname = memoize(hostname => {
  /* The definition of the `currentShopId` variable should live here */
  return {
    currentShopId: currentShopId
  };
});

const slowValuesOnEachRequest = req => {
  const hostname = req.hostname;
  return getShopIdFromHostname(req.hostname);
};
```

</blockquote>

### Remotely fetched values (key `fetchRemoteConfiguration`, optional)

> **Note:** `fetchRemoteConfiguration` is a low level API in Front-Commerce. You
> shouldn't need it in most cases.

`fetchRemoteConfiguration` is a function that is called at a later stage in
Front-Commerce request handling cycle to receive a fully initialized `request`
object, so that, for instance, [you can instantiate a loader to retrieve some
configuration from Magento](https://gitlab.com/front-commerce/front-commerce/-/commit/f57ccabae32ebe6243fc213485078cb1f98f8a30#9e3c152a167c50222b152728db1b5946d409ba89_0_29).

<blockquote class="warning">
**Warning:** Like `slowValuesOnEachRequest`, `fetchRemoteConfiguration` can have
a huge impact on the performances. If you really need to implement it, please
make sure to memoize its result to limit the performance impact as much as
possible.
</blockquote>

## Register a configuration provider

Once you have defined a configuration provider, you will need to tell your application when it should be fused with the rest of the configurations. To do so, there is a `configService`, available at `server/core/config/configService` that lets you register new configuration providers.

```js
import configService from "server/core/config/configService";

configService.append(serviceConfigurationProvider);
```

But where should you add this code? It should live in the file where you are using the configuration. For instance, if I need the service's key and secret in a `contextEnhancer` of a GraphQL module, I'd add it at the top level of the file containing my `contextEnhancer`.

```diff
import ServiceLoader from "./loaders";
+import serviceConfigurationProvider from "./serviceConfigurationProvider";
+import configService from "server/core/config/configService";
+
+configService.append(serviceConfigurationProvider);

export default {
  name: "Service",
  typeDefs,
  resolvers,
  contextEnhancer: ({ req }) => {
    return {
-      Service: ServiceLoader({
-        key: "key",
-        secret: "secret"
-      })
+      Service: ServiceLoader(req.config.service)
    };
  }
};
```

### Override an existing configuration

If your configuration provider relies on another one, you should use the following method `configService.insertAfter(otherConfigurationProviderName, serviceConfigurationProvider)`.

Please note that your configuration provider does not need to be complete to work. It can for instance rely on an existing schema and only define `values` to override the default values. This can be useful if you want to override configuration already defined in Front-Commerce and fetch them with another method. In this case, your configuration provider would look like this:

```js
import configService from "server/core/config/configService";

const serviceOverrideProvider = {
  name: "serviceOverride",
  values: Promise.resolve({
    service: {
      key: "new value"
    }
  })
}

configService.insertAfter("serviceProvider", serviceOverrideProvider)
```

## Core configuration providers

Our goal is to use these configuration providers for any configuration that could exist in Front-Commerce. However, this is still a work in progress and there are still some configurations that are not associated with a schema yet. Most configurations are still based on files in the [`config` folder of your project's module](/docs/reference/configurations.html).
If you have specific needs, please [contact us](mailto:contact@front-commerce.com).