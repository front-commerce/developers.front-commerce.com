---
id: smart-forms
title: Smart Forms
---

Front-Commerce has a built-in implementation agnostic smart form fields. The smart form fields help the user while he is filling the form by providing smart suggestions based on his input. These smart form fields can be used as a drop in replacements for their non smart counterparts. We have aslo shipped a capency implementation for these smart form elements that you can opt-in to.

### Default

Please note that by default the smart forms components have not impementaion. To make them work you should provide an impementaion to load suggestions/format/validate set form fields.

We have shipped a capency implementation with front-commerce 2.7. You can check it out in the [smart-forms-capency module](https://gitlab.com/front-commerce/front-commerce/-/tree/2.7.0/modules/smart-forms-capency/server/modules/capency). To enable the capency smart form module you need to:

1. Register for a capency account (check [capency solutions](https://www.capency.com/en/our-solutions/) for mor details).
1. Add the following environment variables to your `.env` file:

```diff
+FRONT_COMMERCE_CAPENCY_AUTH_USERNAME=user_name_from_step_1
+FRONT_COMMERCE_CAPENCY_AUTH_PASSWORD=password_from_step_1
+FRONT_COMMERCE_CAPENCY_URL_CAP_EMAIL=url_from_step_1
```

1. Add the capency module to your .front-commerce.js file:

```diff
module.exports = {
  name: "project_name",
  url: "http://project.url",
  modules: [
    // "./theme-chocolatine"
+    "./modules/smart-forms-capency",
  ],
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },
    { name: "Magento2", path: "server/modules/magento2" },
+    {
+      name: "Capency",
+      path: "smart-forms-capency/server/modules/capency",
+    },
  ],
  webModules: [
    { name: "FrontCommerce", path: "./src/web" },
    // { name: "theme-chocolatine", path: "./theme-chocolatine/web" },
  ],
};
```

### Smart Email Field

The smart email field is located at `src/web/theme/modules/SmartForms/Field/Email` it can be used as a replacement to the `<Email/>` atom. It will help the user autocomplete the email field by providing him wiht suggestion to the name part of the email (preceding the @), and the domain part of the email (after the @ e.g. @gmail.com, @hotmail.com etc...).

### Smart First Name

The smart first name field is located at `src/web/theme/modules/SmartForms/Field/FirstName` it can be used as a replacement to the `<Text/>` atom. It will help the user autocomplete the first name field by providing him with suggestions based on the country and title(Mr/Mrs) he have selected.
