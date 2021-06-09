---
id: smart-forms
title: Smart Forms
---

Front-Commerce has a built-in implementation agnostic smart form fields/hooks. The smart form fields/hooks help the user while he is filling the form by providing smart suggestions based on his input or by validating/properly formatting his input. The smart form fields can be used as a drop in replacements for their non smart counterparts, While the hooks are to be installed on the `<Form>` level. We have also shipped a capency implementation for these smart form elements that you can opt-in to.

Note: Smart form fields are required to be inside a `<Form>` component as they rely heavily on the Form API and in some cases on other values in the `Form` (e.g. city suggestions rely on selected country).

### Default

Please note that by default the smart forms comes with no backend impementaion. To make them work you should provide an impementaion to load suggestions/format/validate set form fields, or configure your site to use our capency implementation.

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

The smart postcode field is located at `src/web/theme/modules/SmartForms/Field/Postcode` it can be used as a replacement to the `<Text/>` atom. It will help the user autocomplete the postcode field by providing him with suggestions based on the country he has selected. The suggestions when seleced by the user will also set the city field. (e.g. if the user selects 75001 as the postcode while having France as a country the city will be set to Paris).

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

The smart street field is located at `src/web/theme/modules/SmartForms/Field/Street` it can be used as a replacement to the `<Textarea/>` atom. It will help the user autocomplete the street address field by providing him with suggestions based on the country, city and postcode he has selected. The suggestions when seleced by the user will also set the country, city and postcode fields (e.g. if postcode was 75000 and user selects Quai Branly as street the postcode will be set to 75007 a more precise postcode).

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

## usePhoneNumberValidation

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
