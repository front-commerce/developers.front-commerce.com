---
id: flash-messages
title: Flash Messages
---

Your server actions may need to display information to the User after a redirection. It can be useful on a confirmation URL or for return endpoints (for instance when a Customer comes back on your website from a third-party service).

For these use cases, **Front-Commerce 2.3 introduced a "flash message" mechanism to allow developers to implement ephemeral messages without boilerplate**. This section documents how you could use them.

## Add flash messages server side

A `req.addFlashMessage()` method is available on the Express request object. It allows you to add a flash message that will be server rendered and displayed wherever the new <FlashMessages /> component (see below) is used.

Messages can be either a string or an object with the following attributes:

- `message` text
- `type` key: allows to display a specific component ([see below](#Create-custom-flash-message-components))
- `data` object: additional data to be passed to the component displayed

<blockquote class="advanced">
**Advanced:** if you want to consume flash messages server side, you can use the `req.useFlashMessages()` method. It will return the currently registered flash messages and remove them from the session. This is what Front-Commerce SSR mechanism uses internally.
</blockquote>

## Display flash messages

Flash messages are displayed using the `<FlashMessages />` component. By default, flash messages are used on the **Cart and Checkout success pages**.

You can include them in your page with the following lines:

```diff
import React from "react";
+ import FlashMessages from "theme/modules/FlashMessages";

const MyPage = () => {
  return <div>
+    <FlashMessages />
    <p>Hello</p>
    <p>World</p>
  </div>
}
```

## Create custom flash message components

The previous `type` key allows you to render flash messages in custom ways. It is useful to display a specific user message by presenting different structured information.

Out of the box, Front-Commerce supports the following types:

- `default`
- `info`
- `error`
- `success`

To override this mechanism and add your own types, you must override the `theme/modules/FlashMessages/getFlashMessageComponent.js` module. Here is an example (from the [Adyen payment module documentation](/docs/advanced/payments/adyen.html#Register-your-Adyen-payment-components)):

```shell
mkdir -p my-module/web/theme/modules/FlashMessages
cp -u node_modules/front-commerce/src/web/theme/modules/FlashMessages/getFlashMessageComponent.js my-module/web/theme/modules/FlashMessages/getFlashMessageComponent.js
```

```diff
import React from "react";
import {
  InfoAlert,
  ErrorAlert,
  SuccessAlert,
} from "theme/components/molecules/Alert";
import { BodyParagraph } from "theme/components/atoms/Typography/Body";
+ import {
+   AdyenPaymentSuccess,
+   AdyenPaymentError,
+ } from "theme/modules/Adyen/FlashMessage";

// […]
const ComponentMap = {
  default: makeAlertMessageComponent(InfoAlert),
  info: makeAlertMessageComponent(InfoAlert),
  error: makeAlertMessageComponent(ErrorAlert),
  success: makeAlertMessageComponent(SuccessAlert),
+  adyenSuccess: AdyenPaymentSuccess,
+  adyenError: AdyenPaymentError,
};
```
