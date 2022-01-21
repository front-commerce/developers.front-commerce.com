---
id: social-login
title: Social login
---

<blockquote class="feature--new">
_Since version 2.13.0_
</blockquote>

The social login feature allow the user to connect to its account using some external website.

The following social media are supported by Front-Commerce :
- [Facebook](#facebook)

# Install the social media module

To install the module, you need to add the  module and the connector with your backend application to your `.front-commerce.json`.

The following example is for the magento2 module :

```diff
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: [
    ...
+   "./modules/auth-social-media",
+   "./modules/auth-social-media-magento2",
  ],
```

Add the following line to your application's `main.scss`
```diff
+@import "~theme/social-media";
```

# Configure a social login

## Facebook

See [this article](https://magefan.com/blog/create-facebook-application) on how to setup Facebook Login for your application

The facebook action will be available as soon as the following environment variables are configured.
```diff
+FRONT_COMMERCE_FACEBOOK_CLIENT_ID=<APP ID from facebook>
+FRONT_COMMERCE_FACEBOOK_CLIENT_SECRET=<APP Secret from facebook>
```