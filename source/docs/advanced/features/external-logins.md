---
id: external-logins
title: External Logins
---

<blockquote class="feature--new">
_Since version 2.13_
</blockquote>

<blockquote class="feature--new">
_Beta feature (api may change)_
</blockquote>

# External Logins

Front Commerce supports external logins. The API for supporting external logins comes in 2 parts:
* The `LoginProvider` which implements the login with the external systems (such as Facebook or Google)
* The `ExternalLoginHandler` which implements the login with your platform (such as Magento1, Magento2, Proximis or BigCommerce).

Out of the box we ship two `LoginProvider`s -the `FacebookProvider` and the `GoogleProvider`- and two `ExternalLoginHandler`s -the `Magento1ExternalLoginHandler` and the `Magento2ExternalLoginHandler`.

## The User

The user object in the context of external logins is an object with the following signature:

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com"
}
```

We recommend the use of the class `./modules/auth-external-login/server/domain/ExternalLoginUser.js` while customizing external logins. 

## Adding the necessary modules

To enable external logins you need to add the `auth-external-login` module to your modules in the `.front-commerce.js` file:

```diff
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: [
    "./node_modules/front-commerce/theme-chocolatine",
+    "./node_modules/front-commerce/modules/auth-external-login",
  ],
...
```

and you need to add the external login handler for your platform (example below adds `Magento2ExternalLoginHandler`):

```diff
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: [
    "./node_modules/front-commerce/theme-chocolatine",
+    "./node_modules/front-commerce/modules/auth-external-login",
+    "./node_modules/front-commerce/modules/auth-external-login-magento2",
  ],
...
```

## Magento1 Requirements

For the external logins to work with the Magento1 module in addition to [Adding the necessary modules](#Adding-the-necessary-modules) you need to ensure you are have the magento1 connector on 1.4.2 or later. 

## Magento2 Requirements

For the external logins to work with the Magento2 module in addition to [Adding the necessary modules](#Adding-the-necessary-modules) you need to ensure you are have the magento1 connector on 2.5.2 or later. 

## Ensuring the login buttons show

The `auth-external-login` registered above added two components to the `LoginForm` component :  `AdditionalLoginFormActions` and `FlashMessages` in 2.13.0. 

If you overrode `LoginForm` please refer to the [migration guides](/docs/appendices/migration-guides#Login-Form-Update) for more details 

After ensuring that `AdditionalLoginFormActions` and `FlashMessages` are in your `LoginForm` the "Sign in with Facebook" and "Sign in with Google" buttons should now appear in your login page/modal.

## Adding the stylesheet

For the out of the box login buttons you can include the following stylesheet in your `main.scss` file:

```diff
...
@import "~theme/modules/modules";
@import "~theme/pages/pages";
+@import "~theme/external-login.scss";
...
```

## Configuring the buttons

To configure the buttons shown for external logins you can override the `theme/modules/User/LoginForm/AdditionalLoginFormActions/AdditionalLoginFormActions.js` file and add or remove the buttons you want.

## Configuring the Facebook provider

The `FacebookProvider` needs the `clientId` and the `clientSecret` to work. You can get these from your app on the [facebook developer console](https://developers.facebook.com/apps/).

To configure the `clientId` and the `clientSecret` you need to define the folowing environment variables:
* `FRONT_COMMERCE_FACEBOOK_CLIENT_ID` for the `clientId`
* `FRONT_COMMERCE_FACEBOOK_CLIENT_SECRET` for the `clientSecret`

### Configuring Redirect URIs

You need to configure the allowed redirect URIs on your [facebook developer console](https://developers.facebook.com/apps/). To do so go you need to select your app and then go to `Facebook Login > Settings` section on the left menu. There you will find a field called `Valid OAuth Redirect URIs`. You need to fill this field with your stores URLs folowed by `/external-login/facebook/callback`. For example if you have 2 stores `https://example.com/en` and `https://example.com/fr`, you need to put `https://example.com/en/external-login/facebook/callback` and `https://example.com/fr/external-login/facebook/callback` in the `Valid OAuth Redirect URIs` field.

### Working with the Facebook provider in development mode (localhost)

External login rely on redirections, and in devlopment your server is usally at `http://localhost` i.e. not reachable to Facebook. So to circumvent this in development mode you can use a proxying service such as [ngrok](https://ngrok.com/) to proxy requests to your local machine. A proxying service will provide a publically accessible URL to your local server. So to work with Facebook external logins on your local machine you need to set the `FRONT_COMMERCE_FACEBOOK_DEVELOPMENT_BASE_CALLBACK_URL` environment variable to the URL given to you by your proxying service. (p.s. use just the origin part of the url without any trailing slashes `/`).

_Note: do not forget to [reconfigure your app](#Configuring-Redirect-URIs) with this new URL_


## Configuring the Google provider

The `GoogleProvider` needs the `clientId` and the `clientSecret` to work. You can get these from your "OAuth2.0 Client" of your app on the [google developer console](https://console.developers.google.com/apis/credentials). P.S. you need to create one if you have not already.

To configure the `clientId` and the `clientSecret` you need to define the folowing environment variables:
* `FRONT_COMMERCE_GOOGLE_CLIENT_ID` for the `clientId`
* `FRONT_COMMERCE_GOOGLE_CLIENT_SECRET` for the `clientSecret`

### Configuring Redirect URIs

You need to configure the allowed redirect URIs under your "OAuth2.0 Client" of your app on the [google developer console](https://console.developers.google.com/apis/credentials). Fill the `Authorized redirect URIs` field with your stores URLs folowed by `/external-login/google/callback`. For example if you have 2 stores `https://example.com/en` and `https://example.com/fr`, you need to put `https://example.com/en/external-login/google/callback` and `https://example.com/fr/external-login/google/callback` in the `Authorized redirect URIs` field. Also set the `Authorized JavaScript origins` on the same page (in our example above that would be just `https://example.com`).

### Configuring Authorized domains

You need to add all authorized domains on the [google developer console OAuth Consent Screen](https://console.developers.google.com/apis/credentials/consent/edit). Fill the `Authorized domains` field with your domains (in our example [above](#Configuring-Redirect-URIs) that would be just `example.com`).

### Working with the Google provider in development mode

Please refer to [Working with the Facebook provider in development mode](#Working-with-the-Facebook-provider-in-development-mode) above for more details. The only difference is that the environment variable you need to set its `FRONT_COMMERCE_GOOGLE_DEVELOPMENT_BASE_CALLBACK_URL`.

## Customizing external logins

The external logins is made of three parts:
* The login providers. Responsible for handling authenticating the user with the external systems.
* The external login handlers responsible to logging authorized user into our platform (Magento, Proximis, BigCommerce...).
* A module to link the providers and the external login handler.

### Creating your own provider

Front-Commerce uses passport internally for the Facebook and Google providers though this makes things easier it is neither a requirement nor a recommendation. 

To create a provider you need to register a key and a function with the `auth-external-login` module.

The key will be used in the redirect url (like "google" in `/external-login/google` and `/external-login/google/callback`) and the function will be called to create the provider.

The function will be called with 3 arguments:
* The current request
* The externalLoginHandler
* The redirectUrl

The provider returned by the registered function should have 2 middlewares `requestLoginMiddleware` and `loginCallbackMiddleware`.

The `requestLoginMiddleware` will be called both when the user clicks on the "Login with Provider" button and when the provider redirects back to the site. The role of `requestLoginMiddleware` is to first redirect the user to the external site to authenticate and later when the user is redirected back to the site (from the external system) to extract the user information.

The `loginCallbackMiddleware` is called after the user is redirected back to the site (from the external system) and also after `requestLoginMiddleware`'s second call by this time `requestLoginMiddleware` would have hopefully extracted all needed user fields and made them available for `loginCallbackMiddleware`. (We/passort does it by exposing a field called `user` on the request object itself). Here is where the external login handler is used to log the the user in.

```js
import configService from "server/core/config/configService";
import { getCurrentShopConfig } from "server/core/config/getShopConfig";
import { getCurrentShopConfig } from "server/core/config/getShopConfig";
import customConfigProvider from "path_to_your_customConfigProvider";
import { registerExternalLoginProvider } from "auth-external-login/server/providers";

configService.append(customConfigProvider);

const makeCustomProvider = (request, externalLoginHandler, callbackUrl) => {
  const providerConfig = request.config.customProviderConfig;
  if(!providerConfig.clientId || !providerConfig.clientSecret) {
    throw new Error(`Custom provider is not properly configured. clientId and clientSecret are required!`);
  }
  const shopUrl = getCurrentShopConfig(req.config).url; // frequently needed to keep current store selected upon redirection
  return new CustomProvider(externalLoginHandler, providerConfig, {
    shopUrl,
    callbackUrl,
  });
};

registerExternalLoginProvider("custom", makeCustomProvider);
```

#### The LoginProviderInterface

To make creating a provider easier, `LoginProviderInerface` can be implemented. By implementing `LoginProviderInerface` you have to implement the 2 aforementioned middleware and you can pick what inputs your constructor takes. You will then register the maker function mentioned above to extract the data needed by your provider and return an instance of it.

#### The LoginProviderBase

By implementing the Google and Facebook providers using passport these patterns emerged:
* The `loginCallbackMiddleware` is just a call to the external login handler's `login` function.
* The provider commonly needs:
  * The login handler
  * The provider's own config
  * The shop and the callback URLs

`LoginProviderBase` is a simple implementation of the `LoginProviderInerface` that has the constructor (see below for signature) and the `loginCallbackMiddleware` implemented.

```
  constructor(externalLoginHandler, providerConfig, { shopUrl, callbackUrl }) {
    ...
  }
```

What is left is implementing `requestLoginMiddleware` which is easily doable using passport:

```
requestLoginMiddleware(req, res, next) {

  const passportAuthenticator = new Passport();

  passportAuthenticator.use(
    new FacebookStrategy(
      {
        clientID: this.providerConfig.clientId,
        clientSecret: this.providerConfig.clientSecret,
        callbackURL: `${this.shopUrl}${this.callbackUrl}`,
        profileFields: ["email", "name"],
      },
      (_, __, profile, cb) => {
        const {
          email,
          first_name: firstname,
          last_name: lastname,
        } = profile._json;

        if (!(email && firstname && lastname)) {
          cb(new MissingInformationError());
        } else {
          cb(null, new ExternalLoginUser(email, firstname, lastname));
        }
      }
    )
  );

  passportAuthenticator.authenticate("facebook", {
    failureRedirect: `${this.shopUrl}/login`,
    session: false,
    scope: ["email"],
  })(req, res, next);
}
```

### Creating your own ExternalLoginHandler

The `ExternalLoginHandler` is responsible of actually logging the user into your platform. It should first create the user if he does not exist. Next it should log in the user (old or new) into the system.

The external loging handler should have a method called `login` (see signature below) that when called will ensure the user exist or otherwise create him and finally log him/her in.

```js
class CustomExternalLoginHander extends ExternalLoginHandlerInterface {
  async login(request, user) {
    // ensure/create then login user
  }
}
```

We also provide a `ExternalLoginHandlerBase` class that implements the `ExternalLoginHandlerInterface`. It only implements a `constructor` with the folowing signature:

```js
constructor(globalConfig, staticConfigFromProviders) {
}
```

`globalConfig`, `staticConfigFromProviders` are used since they are what is sent to the `makeExternalLoginEndpoint` (see below), and for the `globalConfig` you can use it as follows:

```js
import ExternalLoginHandlerBase from "auth-external-login/server/ExternalLoginHandlerBase";
import makeLoadersFromRequest from "server/core/graphql/makeLoadersFromRequest";

export default class CustomLoginHandler extends ExternalLoginHandlerBase {
  async login(req, user) {
    const loaders = makeLoadersFromRequest(this.globalConfig, req);
    // you have access to all your loaders!!! like loaders.Product, loaders.Customer...
  }
}

```

### Putting it all together

As discussed previously the providers provide the middleware to handle the login with the external system, and the external login handler handles actually logging they user in. Now we are going to link the providers with the external login handler in module that we can register into `.front-commerce.js`

A Front-Commerce module is basically a directory that follows certain conventions. It can be placed any where in your folder structure but is commonly placed either under `./modules/your_custom_module_name` or `./src/modules/your_custom_module_name`.

For our purposes we are only interensted in the server part of the module so we need to create `your_custom_module_name/server/module.config.js` file.

The `your_custom_module_name/server/module.config.js` file should export an object with the providers middleware as follows:

```js
import makeExternalLoginEndpoint from "auth-external-login/server/makeExternalLoginEndpoint";
import CustomExternalLoginHandler from "you_external_login_handler/CustomExternalLoginHandler";

export default {
  endpoint: makeExternalLoginEndpoint((config, staticConfigFromProviders) => new CustomExternalLoginHandler(/** some parameters you extract from the configs */)),
};
```

This is pretty much all that is needed. Typically the `ExternalLoginHandler` in placed inside the same module but this is just a recomendation and not a requirement.

Now you can register the new custom module in your `.front-commerce.js` file and do not forget to also register the base `auth-external-login` module.

```diff
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: [
    "./node_modules/front-commerce/theme-chocolatine",
+    "./node_modules/front-commerce/modules/auth-external-login",
+    "./modules/my-custom-external-login",
  ],
...
```
