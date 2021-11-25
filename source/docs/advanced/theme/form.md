---
id: form
title: Managing forms
---

Forms are always a tricky part in React applications. In Front-Commerce we have implemented default Form inputs that try to make things easier in your daily life as a developer.

## Form declaration

In order to learn about Form components in Front-Commerce, let's build a contact form. When building standard HTML forms, a form would look like this:

```html
<form>
  <div>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" />
  </div>

  <div>
    <label for="content">Content</label>
    <textarea id="content" name="content"></textarea>
  </div>

  <button type="submit">Send</button>
</form>
```

If we were to transform this with React components, it would instead look like this:

```js
import Form from "theme/components/atoms/Form/Form";
import FormItem from "theme/components/molecules/Form/Item";
import Input from "theme/components/atoms/Form/Input/Input";
import { Email, Textarea } from "theme/components/atoms/Form/Input";
import SubmitButton from "theme/components/atoms/Button/SubmitButton";

<Form>
  <FormItem label="Email">
    <Email id="email" name="email" />
  </FormItem>

  <FormItem label="Content">
    <Textarea id="content" name="content" />
  </FormItem>

  <SubmitButton>Send</SubmitButton>
</Form>
```

By using Front-Commerce's components you will ensure that all fields look the same way across your application. They will also add validations and accessibility features by default.

You can for instance use features like `required` or `disabled` just like in HTML, but have relevant error messages.

> Here is a list of default form components that might prove to be useful in your project:
>
> - Form (`theme/components/atoms/Form/Form`): the form element itself
> - Form inputs (`theme/components/atoms/Form/Input`): exports the different type of inputs available (Checkbox, CountrySelect, Email, Hidden, NumberInput, Password, Radio, RadioGroup, Select, Tel, Text, Textarea)
> - Form item (`theme/components/molecules/Form/Item`): states how to display a label next to a field.
> - Fieldset (`theme/components/atoms/Form/Fieldset`): A fieldset tag with style applied
> - Form Actions (`theme/components/molecules/Form/FormActions`): organizes buttons at the end of a form (centered, vertical, etc.)
>
> The exhaustive list can be found in your Design System by running the [`npm run styleguide` command](/docs/reference/cli.html#front-commerce-styleguide) in your project.

However the form we've just created is static. If you want to act on form submission, you will need to add handlers.

## Form submission

To act upon form submission, you need to add a `onValidSubmit` handler on your root `Form` component.

```diff
-<Form>
+<Form onValidSubmit={(data) => {
+  console.log("form data", data);
+}}>
```

This handler will be triggered with the latest data filled by the user.

For more detailed information, please refer to [formsy-react's documentation](https://github.com/formsy/formsy-react/blob/master/API.md#formsy). It also contains more methods like `onChange`, `onInvalidSubmit`, etc.

> **Note:** In React Forms you may be used to pass values and onChange handlers directly to inputs. The goal of Front-Commerce's Form components is to focus on field declarations rather than data flow. This is the reason why you should try to pass handlers only to the `Form` component.

## Form advanced use cases

You will most likely need to develop behaviors that are not explained by the above sections. Here is the list of the most common use cases and pointers to learn about how to implement them.

### Default values

To define a default value on an input you need to pass the `value` property.

For instance, if you already know the email address of the user, you can prefill the email field like this:

```js
<Email id="email" name="email" value={user.email} />
```

Please note that if the value changes during the rendering of the component, this will reset the value displayed in the input. However it won't reset the input state. Please refer to [Reset a form after its submission](#Reset-a-form-after-its-submission) for a detailed explanation.

### Nested inputs

Forms don't always represent flat data. For instance you could imagine a form that have an address field which is represented by multiple inputs (streets, city, zipcode, etc.). The final object could look like this:

```js
{
    saveAsDefault: true,
    address: {
        streets: ["18 John Street"],
        city: "Toulouse",
        zipcode: "31000",
        country: "FR"
    }
}
```

To represent these complex structures you can use form input names separated with `.`. For instance, for the city input, you would use the following React element:

```js
<Text name="address.city" value="Toulouse" />
```

You could also imagine create your own input components that would nest those inputs automatically. That's what we have done for the `AddressForm` in Front-Commerce. The idea is to leverage the composition capabilities of React with your form inputs.

```js
const AddressForm = ({ name, value }) => {
  return (
    <Fragment>
      <Textarea name={`${name}.streets`} value={value.streets} />
      <Text name={`${name}.city`} value={value.city} />
      <Text name={`${name}.zipcode`} value={value.zipcode} />
      <CountrySelect name={`${name}.country`} value={value.country} />
    </Fragment>
  );
};
```

If the nested data structure is an array instead of an object, one should use the same structure available for standard form fields: `arrayName[0]`, `arrayName[1]`, `arrayName[2]`...

### Custom validations

Validations are handled by the underlying library used in Front-Commerce: [`formsy-react`](https://github.com/formsy/formsy-react).

Please refer to [the documentation section of Formsy](https://github.com/formsy/formsy-react/blob/master/API.md#validations) for more information.

### Use an input outside of a form

By default inputs from Front-Commerce will need to be in a form. This is a good practice and improves accessibility. However, in some cases you may not have a choice and will need to opt out from a `<Form>` component.

To do so, you will need to pass an `onChange` property to your input. This works for any input that uses the `withFormHandlers` HOC. By doing this, you won't have anything in your root `Form` component but will be able to observe the input's changes directly.

```js
<Email
  id="email"
  name="email"
  value={currentValue}
  onChange={newValue => {
    console.log("new value", newValue);
  }}
/>
```

You can see this as going back to the standard way of handling form inputs in React. However you will keep the same appearance and behaviors than the rest of the inputs in your website.

Be careful though when you are using this method. Advanced features of Formsy may not be available if you manage the `onChange` manually. For instance, if Formsy is not aware of an input's value, it won't manage the validations. It can also decrease accessibility if not handled carefully.

### Reset a form after its submission

The best way to reset a form is to change its React key. You may not know this, but the `key` attribute you need to pass when rendering an array of React element is actually useful to unmount and remount a component even if it is outside of an array.

For instance, if you first render `<Form key="0" />` and then change the key to `1`, the original Form will unmount and remount instead of update. This allows to discard any state that was previously stored in the Form and start from a blank slate.

Thus, to reset a form after its submission and avoid issues with form states and validations, you would need to store a `key` state that you would update on form submission success.

```jsx
const MyResettableForm = () => {
  const [formKey, setFormKey] = useState(new Date().valueOf())

  const handleResetForm = (e) => {
    e?.preventDefault()
    setFormKey(new Date().valueOf());
  }

  return (
    <Form key={formKey}>
      <FormItem label="Email">
        <Email id="email" name="email" />
      </FormItem>

      <FormItem label="Content">
        <Textarea id="content" name="content" />
      </FormItem>
      <Button onClick={handleResetForm}>Reset</Button>
      <SubmitButton>Send</SubmitButton>
    </Form>
  )
}

export default MyResettableForm
```

### New input types

The available inputs in Front-Commerce should cover most of your use cases. However, this might not be sufficient and you may need to implement your own form field from scratch.

To do so, we recommend to use the `withFormHandlers` HOC available in Front-Commerce. It allows to use the same prop API for input type but still allow to render your input however you want.

If your input is a basic input, you can use directly `withFormHandlers` like this:

```js
import withFormHandlers from "theme/components/atoms/Form/Input/withFormHandlers";

const Input = ({ name, id, value, onChange, onBlur }) => {
  return (
    <input
      name={name}
      id={id}
      value={value}
      onBlur={event => onBlur(event)}
      onChange={event => onChange(event)}
    />
  );
};

export default withFormHandlers()(Input);
```

This will also provide you some props that will let you better display the current state of your input:

- `getErrors`: lists the errors to display in your component. This also includes `required` errors
- `isPristine`: states if the input was never changed
- `isDirty`: states if the input was changed at least once
- `isValid`: states if the current value of the component is valid

You can configure these behaviors by passing options to `withFormHandlers(options)(Input)`. The options should be an object with the following keys:

- `dirtyOnChange` (boolean, optional): states if the errors should appear on the first `onChange` or if we should wait for an `onBlur` event
- `getValueFromEvent` (function, optional): will transform the event received when calling `onChange` into the value that should be stored in the form value
- `getValueFromProps` (function, optional): will transform the props passed by the parent into the `value` that will be available in the child's props
- `getPropsFromValue` (function, optional): will transform the value stored in the form into props passed to the child
- `requiredMessage` (string, optional): the required message that should be used if the input is required but the user didn't fill it

With those configurations, this allows you to potentially transform the input's display into anything you seem fit. For instance, a DateInput could be created and transformed into either a datepicker or multiple input fields without impacting the external API.

You can look at [`node_modules/front-commerce/src/web/theme/components/atoms/Form/Input/Checkbox/Checkbox.js`](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/web/theme/components/atoms/Form/Input/Checkbox/Checkbox.js) to better understand how the form input api works.

### Use another form library than Formsy

This is possible thanks to `withFormHandlers` and the `Form` component. In today's Front-Commerce code this is the only places where we are using [`formsy-react`](https://github.com/formsy/formsy-react) we even have a <abbr title="Proof of Concept">PoC</abbr> implementation of a replacement with [`react-final-form`](https://github.com/final-form/react-final-form).

The only thing to keep in mind is that there are most likely features in your forms that use implicit parts of Formsy. Make sure to support them or migrate your code in case you want to use another form library. This is most likely the case for with validations.
