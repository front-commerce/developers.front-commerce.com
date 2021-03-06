---
id: custom-shipping-information
title: Custom Shipping Information
---

Most of the time, shipping methods don't need any additional information. The user only need to select them and proceed with their order. However, some methods need more information in order to succeed. This is mostly the case for methods relying on pickup points. The user have to choose a pickup before proceeding.

This documentation will show you the different step involved to add such a method on your own. Before tackling this documentation, please make sure that you've understood the [Essentials](/docs/essentials/installation.html) of Front-Commerce and that you've registered a method in your backend (Magento2…).

All the code that will be created in this page should live in your own module. You can either put it in your client code or create a specific module for the shipping method. If you create a specific one, please keep in mind that you need to register it in `.front-commerce.js`.

## Identify your shipping method

If your shipping method is correctly registered in your backend, the following GraphQL query should return your method's codes.

```graphql
{
  checkout {
    availableShippingMethodList(
      address: { country_id: "FR", postcode: "31400" }
    ) {
      data {
        carrier_code
        method_code
      }
    }
  }
}
```

> Make sure to set an address that can be elected by your shipping method.

## Display a custom input in your shipping method

Once you've done this request, you will be able to get the `carrier_code` and the `method_code` of your shipping method. You should use those to register a new component in `theme/modules/Checkout/ShippingMethod/AdditionalShippingInformation/getAdditionalDataComponent.js` by following this template:

```js
import CustomMethod from "theme/modules/CustomMethod/CustomMethod";

const ComponentMap = {
  "<carrier_code>": {
    "<method_code>": CustomMethod,
  },
};

// ... the rest of the code should be kept intact
```

The Custom component referenced here should be created in your own module, and display the additional information of your shipping method to the user.

```js
// theme/modules/CustomMethod/CustomMethod.js
import React from "react";
import { compose, branch } from "recompose";
import SubmitShippingMethod from "theme/modules/Checkout/ShippingMethod/SubmitShippingMethod/SubmitShippingMethod";

const CustomMethod = ({ pending, error }) => {
  const [customValue, setCustomValue] = useState();

  return (
    <div className="colissimo">
      <input
        onChange={(event) => setCustomValue(event.target.value)}
        value={customValue}
        name="customValue"
        type="text"
      />
      <SubmitShippingMethod
        key="submit"
        state={pending ? "pending" : error ? "disabled" : undefined}
        error={error}
        onSubmit={() => {
          submitAdditionalData([{ key: "customValue", value: customValue }]);
        }}
      />
    </div>
  );
};

CustomMethod.handlesNextStepButton = () => true;
CustomMethod.AddressRecapLine = (props) => (
  <div>
    You can change how the address is displayed in the Address Recap of the
    checkout by declaring this component.
  </div>
);

export default CustomMethod;
```

Things to understand here:

- The `SubmitShippingMethod` component is a common component accross all shipping methods to ensure consistency in how methods are managed.
- `CustomMethod.handlesNextStepButton = () => true;` means that you are indeed using `SubmitShippingMethod` in your component. This should always be `true` as `false` is the legacy behavior.
- `CustomMethod.AddressRecapLine` (optional) is used to change how the shipping address is displayed in the checkout recap once you've selected your custom shipping method. For instance this is what you will use to display a pickup address instead of the shipping address filled by the user.
- `submitAdditionalData` sends and array of objects with a `key` and `value` to your backend. This means that when the shipping method will be set, the additional data will be sent to your backend at the same time. We'll see in the next section how to act on them.

In this example we're only setting a text input, but you can do fancier things like fetching a list of pickup points from GraphQL and displaying them here. To do so, you need to use `<PostalAddressSelector />` component that allows to select a pickup. See [Add a shipping method with pickup points](/docs/advanced/shipping/add-new-shipping-data-in-graphql.html) documentation for more information.

## Send the additional data to your backend

Once you've registered a shipping method with additional data, the `setCheckoutShippingInformation` mutation will be sent to Front-Commerce. Front-Commerce will then send the additional data provided in this mutation to your backend.

For instance, in Magento1, it'll be passed to the API at `/api/rest/frontcommerce/cart/mine/shipping-information` by sending a JSON looking like this:

```
{
  "shipping_carrier_code": "mondialrelaypickup",
  "shipping_method_code": "24R",
  "additional_data": [
    {
      "key": "customValue",
      "value": "custom"
    }
  ]
}
```

This means that you have two solutions to act upon these values in your backend:

- you can either override the API in your backend (recommended way) by registering an observer (`frontcommerce_api_set_shipping_information_before_save` in Magento1's case)
- or you can trigger a function in your GraphQL module before calling the backend's API by using the following method:

  ```js
  loaders.ShippingMethod.registerShipmentMethodsHandler({
    method: "<carrier_code>_<method_code>",
    updateShippingInformation: (shippingMethod, data) => {
      // By registering this method, this means that you can transform the data or send a different request before calling the backend's API.
      // The resolved data here will be the data sent to your backend in the base API
      return Promise.resolve(data);
    },
  });
  ```
