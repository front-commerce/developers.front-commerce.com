---
id: external-logins
title: External Logins
---

<blockquote class="feature--new">
_Since version 2.13_
</blockquote>

<blockquote class="feature--new">
_Beta feature (API may change)_
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

To enable external logins you need to add the `auth-external-login` and the external login handler for your platform (example below adds `Magento2ExternalLoginHandler`) to your modules in the `.front-commerce.js` file:

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

You need to configure the allowed redirect URIs on your [facebook developer console](https://developers.facebook.com/apps/). 
Note that the `Valid OAuth Redirect URIs` should contain all your stores URLs followed by `/external-login/facebook/callback`. 
 
For example if you have two stores `https://example.com/en` and `https://example.com/fr`, you need to put `https://example.com/en/external-login/facebook/callback` and `https://example.com/fr/external-login/facebook/callback` in the `Valid OAuth Redirect URIs` field.

### Working with the Facebook provider in development mode (localhost)

External login rely on redirections, and in devlopment your server is usally at `http://localhost` i.e. not reachable to Facebook. So to circumvent this in development mode you can use a proxying service such as [ngrok](https://ngrok.com/) to proxy requests to your local machine. A proxying service will provide a publically accessible URL to your local server. So to work with Facebook external logins on your local machine you need to set the `FRONT_COMMERCE_FACEBOOK_DEVELOPMENT_BASE_CALLBACK_URL` environment variable to the URL given to you by your proxying service. (p.s. use just the origin part of the url without any trailing slashes `/`).

_Note: do not forget to [reconfigure your app](#Configuring-Redirect-URIs) with this new URL_


## Configuring the Google provider

The `GoogleProvider` needs the `clientId` and the `clientSecret` to work. You can get these from your "OAuth2.0 Client" of your app on the [google developer console](https://console.developers.google.com/apis/credentials). P.S. you need to create one if you have not already.

To configure the `clientId` and the `clientSecret` you need to define the folowing environment variables:
* `FRONT_COMMERCE_GOOGLE_CLIENT_ID` for the `clientId`
* `FRONT_COMMERCE_GOOGLE_CLIENT_SECRET` for the `clientSecret`

### Configuring Redirect URIs

You need to configure the allowed redirect URIs under your "OAuth2.0 Client" of your app on the [Google developer console](https://console.developers.google.com/apis/credentials). Note that the `Authorized redirect URIs` should contain all your stores URLs followed by `/external-login/google/callback`.

For example if you have two stores `https://example.com/en` and `https://example.com/fr`, you need to put `https://example.com/en/external-login/google/callback` and `https://example.com/fr/external-login/google/callback` in the `Valid OAuth Redirect URIs` field.

### Working with the Google provider in development mode

Please refer to [Working with the Facebook provider in development mode](#Working-with-the-Facebook-provider-in-development-mode) above for more details. The only difference is that the environment variable you need to set its `FRONT_COMMERCE_GOOGLE_DEVELOPMENT_BASE_CALLBACK_URL`.

## Advanced Topics

For advanced topics such as implementing your own provider/login handler please refer to our [advanced external logins docs](/docs/advanced/features/advanced-external-logins)
