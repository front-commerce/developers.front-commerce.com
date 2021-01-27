---
id: detect-admin-users
title: Detect admin users
---

_This feature has been added in version `2.1.0`_

In some specific use cases you may want to adapt the application when the e-merchant is navigating your Front-Commerce application. For instance some pages may be protected and only accessible to the e-merchants of your shop. The rest of the users won't be able to read its content.

In Front-Commerce, we've achieved this by injecting something in the user's session when they are navigating Magento's backend. This documentation page details how it works and how you can use it.

## Configuring your environment

First, you need to make sure that you've configured the tokens that will enable the communication between Magento and Front-Commerce:

- In Magento's store configuration, under the "General > General > Front-Commerce" section, fill in the "Magento Admin Token" field. It should be a random string of 32+ characters.
- In your `.env` in Front-Commerce's folder, add `FRONT_COMMERCE_MAGENTO_ADMIN_TOKEN=<token>` where `<token>` should be replaced by the string you used in Magento.

You can then restart your environment and the admin role should now be enabled for all the users that have logged into Magento's administration panel in the previous 30 minutes.

*If you think it didn't work correctly, you can **manually force a new authentication from the "Reload storefront session" link** in the admin footer. It is added by the Front-Commerce Magento module:*

![Reload storefront session link in Magento admin area footer](./assets/admin-reload-storefront-session.png)

## Detecting the admin role in Front-Commerce

Now that the session has the admin role, you will need to use the `MagentoAdmin` loader in Front-Commerce. For instance, let's create a loader that checks the admin status before sending a request to Magento.

### Your initial GraphQL module

To do so, we will start with a custom GraphQL module that does the request but has no verifications. Please follow [Extend the GraphQL schema](/docs/essentials/extend-the-graphql-schema.html) if you are ensure how to do so.

If you want to customize an existing module instead, you can skip this section.

```js
// server/modules/admin-data/index.js
import typeDefs from "./schema.gql";
import resolvers from "./resolvers.js";
import { makeUserClientFromRequest } from "server/modules/magento1/core/factories";
import { AdminDataLoader } from "./loaders";

export default {
  namespace: "Acme/AdminData",
  typeDefs: typeDefs,
  resolvers: resolvers,
  contextEnhancer: ({ req }) => {
    const axiosInstance = makeUserClientFromRequest(req);

    return {
      AdminData: AdminDataLoader(axiosInstance),
    };
  },
};
```

```js
// server/modules/admin-data/loaders.js
import { makeUserClientFromRequest } from "server/modules/magento1/core/factories";
import { AdminDataLoader } from "./loaders";

export const AdminDataLoader = (axiosInstance) => {
  return {
    loadData: async () => {
      const response = await axiosInstance.get("/admin-custom-endpoint");
      return response.data;
    },
  };
};
```

```graphql
# server/modules/admin-data/schema.gql
extend type Query {
    adminData: String
}
```

```js
// server/modules/admin-data/resolvers.js
export default {
    Query: {
        adminData: (parent, params, { loaders }) => {
            return loaders.AdminData.loadData()
        }
    }
}
```

### Change your loader's request with admin role

First we need to inject the loader that allows to detect the admin role into the loader that will need that information. The loader is `MagentoAdmin` and is made available by the module `Magento2/Admin`. So we must make sure that the dependencies have been updated accordingly.

```diff
// server/modules/admin-data/index.js

// ...

export default {
  namespace: "Acme/AdminData",
+  dependencies: [
+    "Magento2/Admin", // ensures that loaders.MagentoAdmin exists
+  ],
-  contextEnhancer: ({ req }) => {
+  contextEnhancer: ({ req, loaders }) => {
    const axiosInstance = makeUserClientFromRequest(req);

    return {
-      AdminData: AdminDataLoader(axiosInstance),
+      AdminData: AdminDataLoader(axiosInstance, loaders.MagentoAdmin),
    };
  },
};
```

We can then use the `MagentoAdmin` loader to only return data when the admin is connected and use this information to authenticate the request. Please note that this example illustrates how to add a header using a specific token (`x-custom-header`). But this is an imaginary header for now and depends on how you have implemented `/admin-custom-endpoint` in your Magento. However the goal is to always have a protection on your Magento endpoint to make sure that only a request coming from Front-Commerce and with the correct information will be able to use this endpoint. Otherwise, if your Magento URL is compromised, any user could request sensitive admin data.

```diff
// server/modules/admin-data/loaders.js
import { makeUserClientFromRequest } from "server/modules/magento1/core/factories";
import { AdminDataLoader } from "./loaders";

-export const AdminDataLoader = (axiosInstance) => {
+export const AdminDataLoader = (axiosInstance, MagentoAdmin) => {
  return {
    loadData: async () => {
+     if (await MagentoAdmin.isAdmin()) {
-       const response = await axiosInstance.get("/admin-custom-endpoint")
+       const response = await axiosInstance.get("/admin-custom-endpoint", {
+         headers: {
+           // We pass a header here considering that the `/admin-custom-endpoint`
+           // now only accepts requests with this header
+           "x-custom-header": "your custom header matching a custom configuration in your Magento"
+         }
+       })
        return response.data;
+     } else {
+       return null;
+     }
    },
  };
};
```

<blockquote class="important">
**Important:** In case you rely on [Front-Commerce's caching mechanism](/docs/advanced/graphql/dataloaders-and-cache-invalidation.html) you will need to make sure that data fetched by admins are not cached in the same namespace as your normal users.
For this reason, please make sure to update your [Caching strategies](/docs/advanced/graphql/dataloaders-and-cache-invalidation.html#PerMagentoAdminRole) with the relevant `PerMagentoAdminRole` configuration.
</blockquote>

## Change the behavior depending on the admin connected

In some case you may need more granularity in your authentication process. In the above section, all admins are considered equals. But in practice, there might be some roles or custom authentication process.

This can be done in Front-Commerce by customizing the data available in `loaders.MagentoAdmin.getAdminData()`. By default it is an empty object when the admin is connected. But this object can be configured by injecting a custom `AuthenticatedAdminDataInterface` in your Magento DI.

To do so, in a custom Magento module, you must:

* Add a new preference in your `etc/di.xml`:
```xml
<preference for="FrontCommerce\AdminBar\Api\AuthenticatedAdminDataInterface" type="Acme\ModuleName\Model\AuthenticatedAdminData" />
```
* Create the new class that will implement `AuthenticatedAdminDataInterface` and fetch the addition admin data. Since you are in a Magento context, feel free to inject any class you may need to fetch the relevant data. To keep it simple here, we've just set a hardcoded id.
```php
<?php
namespace Acme\ModuleName\Model;

use FrontCommerce\AdminBar\Api\AuthenticatedAdminDataInterface;

class AuthenticatedAdminData implements AuthenticatedAdminDataInterface
{
    public function getAdminData()
    {
        return [
            'adminId' => '13'
        ];
    }
}
```
* If you are not in `developer` mode in magento, please make sure to rerun `bin/magento setup:di:compile` command.
* You will then be able to use the following in Front-Commerce's server code for any authenticated admin users.
```js
const adminData = await loaders.MagentoAdmin.getAdminData();
console.log(adminData.adminId);
```

## Simulating different admin data

In **development mode**, one can call the `/__front-commerce/UNSAFE_injectRole` url with a `data` query parameter to inject custom JSON serialized data in the admin session. It is useful to **simulate different admin information locally** without worrying about session cookies issues.

Here is a sample `curl` request to achieve this:

```
curl -v 'http://localhost:4000/__front-commerce/UNSAFE_injectRole?data={"foo":"bar"}'
```

Please note that this featured is only enabled if [the environment is configured](#Configuring-your-environment) and `NODE_ENV` is `development`.