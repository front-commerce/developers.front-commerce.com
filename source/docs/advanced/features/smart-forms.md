---
id: smart-forms
title: Smart Forms
description: Front-Commerce has a built-in implementation agnostic Smart Form fields/hooks feature. Smart Form help users while they are filling a form. They provide smart suggestions based on their input and can validate or homogeneously format the data. This guide explains how to use the feature in your application.
---

The Smart Form fields can be used as a drop in replacements for their non smart counterparts, while the hooks are to be installed on the `<Form>` level.

Notes:

1. Smart form fields are required to be inside a `<Form>` component as they rely heavily on the Form API and in some cases on other values in the `Form` (e.g. city suggestions rely on selected country).
2. The Smart Form functionality shipped first in 2.7.0. If you are using a previous version of Front-Commerce you need to update to at least version 2.7.0 to be able to leverage the Smart Form functionality. Please have a look at the [2.7.0 migration guide](/docs/appendices/migration-guides.html#2-6-0-gt-2-7-0) to help you update to Front-Commerce version 2.7.0.

## Configuring an integration

By default, the Smart Forms comes with no backend implementation in production. In development mode (i.e. `FRONT_COMMERCE_ENV=dev`), naive implementations exists so that you can work on integrating and testing Smart Forms components. Before adding Smart Forms to your application, you will have to configure an existing backend implementation (or write a specific one).

<blockquote class="info">
  We aim at supporting other services in the future. If you want to use a specific service to provide SmartForms feature, please let us know!
</blockquote>

### Capency (CapAddress, CapPhone, CapEmail)

We have shipped a Capency implementation with Front-Commerce 2.7. You can check it out in the [smart-forms-capency module](https://gitlab.com/front-commerce/front-commerce/-/tree/2.7.0/modules/smart-forms-capency/server/modules/capency).

To enable the Capency Smart Form module you need to:

1. Register for a Capency account (check [Capency solutions](https://www.capency.com/en/our-solutions/) for more details).
2. Add the following environment variables to your `.env` file:

```diff
+FRONT_COMMERCE_CAPENCY_AUTH_USERNAME=user_name_from_step_1
+FRONT_COMMERCE_CAPENCY_AUTH_PASSWORD=password_from_step_1
+FRONT_COMMERCE_CAPENCY_URL_CAP_EMAIL=url_from_step_1
+FRONT_COMMERCE_CAPENCY_URL_CAP_ADDRESS=url_from_step_1
+FRONT_COMMERCE_CAPENCY_URL_CAP_PHONE=url_from_step_1
```

The different services URL may be identical or different depending on your Capency setup. Please follow instructions received by the Capency support team.

3. Add the Capency module to your .front-commerce.js file:

```diff
module.exports = {
  name: "project_name",
  url: "http://project.url",
  modules: [
    // "./theme-chocolatine"
+   "./modules/smart-forms-capency",
  ],
  serverModules: [
    { name: "FrontCommerce", path: "server/modules/front-commerce" },
    { name: "Magento2", path: "server/modules/magento2" },
+   {
+     name: "Capency",
+     path: "smart-forms-capency/server/modules/capency",
+   },
  ],
  webModules: [
    { name: "FrontCommerce", path: "./src/web" },
    // { name: "theme-chocolatine", path: "./theme-chocolatine/web" },
  ],
};
```

Restart the project, and your existing fields should now use Capency webservices to provide suggestions and validate data.

<blockquote class="info">
  **ProTip:** you can use the `front-commerce:smart-forms:capency` value in your `DEBUG` environment variable to view more details about API interactions with Capency services.
</blockquote>

## Smart Forms Fields

### Smart Email Field

The smart email field is located at `src/web/theme/modules/SmartForms/Field/Email` it can be used as a replacement to the `<Email/>` atom. It will help the user autocomplete the email field by providing him with suggestion to the name part of the email (preceding the @), and the domain part of the email (after the @ e.g. @gmail.com, @hotmail.com etc...).

### Smart First Name

The smart first name field is located at `src/web/theme/modules/SmartForms/Field/FirstName` it can be used as a replacement to the `<Text/>` atom. It will help the user autocomplete the first name field by providing him with suggestions based on the country and title(Mr/Mrs) he has selected.

You can customize the fields that represent the country and the title in your form by providing the following props to your component:

```diff
<FirstName
  name="firstname"
  id="firstname"
  required
  value={initialValues?.firstname}
  aria-label={props.intl.formatMessage(messages.firstnameLabel)}
  placeholder={props.intl.formatMessage(messages.firstnameLabel)}
  validationError={props.intl.formatMessage(
    messages.firstnameError
  )}
+ titleFieldName={addPrefix(prefix, "title")}
+ countryFieldName={addPrefix(prefix, "country")}
/>
```

P.S. the default for `countryFieldName` is "country" and the `titleFieldName` has no default

### Smart City Name

The smart city field is located at `src/web/theme/modules/SmartForms/Field/City` it can be used as a replacement to the `<Text/>` atom. It will help the user autocomplete the city field by providing him with suggestions based on the country he has selected. The suggestions when selected by the user will also set the postcode field. (e.g. if the user selects Paris as the city the postcode will be set to 75000).

You can customize the fields that represent the country and the postcode in your form by providing the following props to your component:

```diff
<City
  name={addPrefix(prefix, "city")}
  id={addPrefix(idPrefix, "city")}
  value={address ? address.city : ""}
  placeholder={intl.formatMessage(
    messages.cityPlaceholder
  )}
  required
+ countryFieldName={addPrefix(prefix, "country")}
+ postcodeFieldName={addPrefix(prefix, "postcode")}
/>
```

P.S. the default for `countryFieldName` is "country" and for `postcodeFieldName` is "postcode"

### Smart Postcode

The smart postcode field is located at `src/web/theme/modules/SmartForms/Field/Postcode` it can be used as a replacement to the `<Text/>` atom. It will help the user autocomplete the postcode field by providing him with suggestions based on the country he has selected. The suggestions when selected by the user will also set the city field. (e.g. if the user selects 75001 as the postcode while having France as a country the city will be set to Paris).

You can customize the fields that represent the country and the city in your form by providing the following props to your component:

```diff
<Postcode
  name={addPrefix(prefix, "postcode")}
  id={addPrefix(idPrefix, "postcode")}
  value={address ? address.postcode : ""}
  placeholder={intl.formatMessage(
    messages.postcodePlaceholder
  )}
  required={isZipCodeRequired}
+ countryFieldName={addPrefix(prefix, "country")}
+ cityFieldName={addPrefix(prefix, "city")}
/>
```

P.S. the default for `countryFieldName` is "country" and for `cityFieldName` is "city"

### Smart Street

The smart street field is located at `src/web/theme/modules/SmartForms/Field/Street` it can be used as a replacement to the `<Textarea/>` atom. It will help the user autocomplete the street address field by providing him with suggestions based on the country, city and postcode he has selected. The suggestions when selected by the user will also set the country, city and postcode fields (e.g. if postcode was 75000 and user selects Quai Branly as street the postcode will be set to 75007 a more precise postcode).

You can customize the fields that represent the country, the city and the postcode in your form by providing the following props to your component:

```diff
<Street
  name={addPrefix(prefix, "street")}
  id={addPrefix(idPrefix, "street")}
  value={address ? address.street : ""}
  placeholder={intl.formatMessage(
    messages.addressPlaceholder
  )}
  validations={{
    streetValidation: streetValidation,
  }}
  validationErrors={{
    streetValidation: intl.formatMessage(
      messages.addressLength,
      {
        maxLength: maxAddressLength,
        numberOfLines: numberOfStreetLines,
      }
    ),
  }}
  rows={numberOfStreetLines}
  toArray
  required
+ countryFieldName={addPrefix(prefix, "country")}
+ cityFieldName={addPrefix(prefix, "city")}
+ postcodeFieldName={addPrefix(prefix, "postcode")}
/>
```

P.S. the default for `countryFieldName` is "country", for `cityFieldName` is "city" and for `postcodeFieldName` is "postcode"

### Smart PhoneNumber

The smart phone number field is located at `src/web/theme/modules/SmartForms/Field/PhoneNumber` it can be used as a replacement to the `<Text/>` atom. It will help the user by automatically formatting the phone number based on the country he has selected.

You can customize the fields that represent the country in your form by providing the following props to your component:

```diff
<PhoneNumber
  name={addPrefix(prefix, "telephone")}
  id={addPrefix(idPrefix, "telephone")}
  value={address ? address.telephone : ""}
  placeholder={intl.formatMessage(
    messages.phonePlaceholder
  )}
  required
+ countryFieldName={addPrefix(prefix, "country")}
/>
```

P.S. the default for `countryFieldName` is "country"

## Smart Forms Hooks

Smart forms also provide some hooks to help validate form fields. These hooks needs to be setup at the `<Form>` level.

## `usePhoneNumberValidation`

`usePhoneNumberValidation` is used to validate the phone number on form submit. To properly setup phone number validation using the `usePhoneNumberValidation` hook you need to update your `<Form>` as noted below:

```diff
import Form from "theme/components/atoms/Form/Form";

const MyAwesomeForm = ({
  onSubmit
}) => {
+ const [
+   onSubmitWrapper,
+   { validating, validationError }, // you can choose what you want to be done by those two fields below we displayed a message when validating and the valiation error if the validation failed. You can also use the `validating` variable to disable submit button for example
+ ] = usePhoneNumberValidation({
+   fieldName: "telephone",
+   countryFieldName: "country",
+ });

  return (
-   <Form onValidSubmit={onSubmit}>
+   <Form onValidSubmit={onSubmitWrapper(onSubmit)}>
+     {validating ? 'Validating Phone Number...' : null}
+     {validationError ? validationError : null}
      ...your form fields
    </Form>
  );
};
```

After implementing the above changes, when the user submits the form it will validate the phone number first. Then if the phone number is valid the form will be submitted. Otherwise the form will not be submitted and the `validationError` variable above will be set to a translated message of `"Invalid phone number"`. (P.S. if the form validation fails for reasons other than the phone number being invalid, the form will be submitted to not block the user).

## `useEmailServerValidation`

As its name suggests, `useEmailServerValidation` can be used to validate an email with the help of a server GraphQL API.

### Basic usage

When calling this hook, you have to pass three parameters:

1. the name of the field where the user is suppose to enter an email
1. a loading handling function. It will receive a boolean indicating when the server validation starts or ends
1. a submit function. It will receive a hash with the field values. Typically, this function would call the GraphQL API to store the entity the form is about

So on an existing form, you would do the following changes:

```diff
import Form from "theme/components/atoms/Form/Form";
import { Email } from "theme/components/atoms/Form/Input";
+import { useEmailServerValidation } from "theme/modules/SmartForms/Field/Email";

 const MyAwesomeForm = ({ email }) => {
   const submit = (data) => {
     // your submit implementation
   };
+  const setLoading = (isLoading) => {
+    // do something when the server validation starts or ends
+  };
+  const onSubmit = useEmailServerValidation("email", setLoading, submit);

   return (
-    <Form onValidSubmit={submit}>
+    <Form onValidSubmit={onSubmit}>
        <Email name="email" id="email" value={email} required />
        <!-- probably some other fields -->
     </Form>
```

With this code, when the user submits the form, the hook will call the GraphQL API to validate the email. The GraphQL email validation API is designed [to return different validation statuses](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/server/modules/front-commerce/smart-forms/schema.gql#L22) (not only valid/invalid) and by default, the `onSubmit` handler returned by `useEmailServerValidation` has the following behaviour:

- with a `disabled` validation status, the `submit` function is directly called
- with a `valid` validation status, the `submit` function is directly called
- with a `warn` validation status, the `submit` function is not called, instead the email field is updated with the warning message returned by the server
- with a `error` validation status, the `submit` function is not called, instead the email field is updated with the error message returned by the server.

In addition, the `onSubmit` handler will directly call the `submit` function if the application was unable to reach the validation API (network error, server error,…).

### Advanced usage

It's possible to implement a different behaviour for one or several statuses. For that, you can pass an additional object to define custom status handlers. For instance, if you want to ignore `warn` status and display the server error message somewhere else, you can write something like:

```diff
import Form from "theme/components/atoms/Form/Form";
import { Email } from "theme/components/atoms/Form/Input";
+import { useEmailServerValidation } from "theme/modules/SmartForms/Field/Email";

 const MyAwesomeForm = ({ email }) => {
   const submit = (data) => {
     // your submit implementation
   };
+  const [errorMessage, setErrorMessage] = useState("");
+  const setLoading = (isLoading) => {
+    // do something when the server validation starts or ends
+  };
+  const onSubmit = useEmailServerValidation("email", setLoading, submit, {
+    valid: (context) => {
+      setErrorMessage("");
+      context.defaultImplementation(context);
+    },
+    disabled: (context) => {
+      setErrorMessage("");
+      context.defaultImplementation(context);
+    },
+    warn: (context) => {
+      setErrorMessage("");
+      context.submit(context.formModel);
+    },
+    error: (context) => {
+      setLoading(false);
+      setErrorMessage(context.validationResult.message);
+    },
+  });

   return (
-    <Form onValidSubmit={submit}>
+    <Form onValidSubmit={onSubmit}>
        <Email name="email" id="email" value={email} required />
        <!-- probably some other fields -->
+       {errorMessage ? <p>{errorMessage}</p> : null}
     </Form>
```

As shown in the previous example, custom status handlers are indexed by validation status (`disabled`, `valid`, `warn` or `error`). They all receive a context object that contains the following properties:

- `formModel`: an object with the value of fields in the form
- `emailField`: the name of the email field passed to `useEmailServerValidation`
- `validationResult`: [the validation result](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/server/modules/front-commerce/smart-forms/schema.gql#L29) returned by the server
- `updateInputsWithError`: a function to [update a field with an error message](https://github.com/formsy/formsy-react/blob/master/API.md#updateInputsWithError)
- `submit`: the submit handler passed to `useEmailServerValidation`
- `defaultImplementation`: the default status handler implementation.
