---
id: password-fields
title: Password fields
description: Your application will require customers to enter their password on several pages (registration, login, password forgotten…). This page contains all information about how to adapt the default Front-Commerce behaviors.
---

Front-Commerce contains some default components and mechanisms for providing a good user experience while ensuring passwords match the security criteria you may have. Here is how to adapt them to your needs.

## Configure password validity

<blockquote class="feature--new">
_Since version 2.12.0_
</blockquote>

Front-Commerce expects a certain level of complexity for the password entered by a user.
The default is:

- 8 characters minimum
- at least 3 types of characters among: lowercase letters, uppercase letters, digits and special characters

You can customize those default rules by overriding `theme/components/atoms/Form/Input/Password/passwordConfig.js`

The configuration expects a list of rules to be satisfied and status to be displayed to users. It should follow the format below:

```javascript
// theme/components/atoms/Form/Input/Password/passwordConfig.js
import { defineMessages } from "react-intl";

const messages = defineMessages({
  invalid: {
    id: "components.atoms.Form.Input.PasswordStrengthHint.Status.invalid",
    defaultMessage: "This is an invalid password",
  },
  tooShort: {
    id: "components.atoms.Form.Input.PasswordStrengthHint.Status.tooShort",
    defaultMessage: "Too short",
  },
});

export default {
  rules: [
    {
      // technical ID, must be unique
      id: "a-unique-technical-id",
      // optional, enforces this status if isValid returns false
      invalidStatus: "TOO_SHORT",
      // optional, label to display for this rule in the hinter. If it is not defined, the rule is not displayed.
      label: messages.invalid,
      // validation method for this rule
      isValid: (password) => true,
    },
  ],
  status: {
    // status key, used by rule.invalidStatus
    TOO_SHORT: {
      // message to display for this status
      label: messages.tooShort,
      // the status to be used from the ProgressStatus component
      status: "error",
      // minimum number of valid criterias for this status to be display, only the first valid status sorted by minCriterias will be shown
      minCriterias: 0,
      // is this status sufficient to validate the password
      isValid: false,
    },
  },
};
```

## Disable password strength hints

Front-Commerce provides a `<PasswordStrengthHint>` to provide a detailed feedback to users about the expected password complexity.

You can deactivate this feature by adding the variable `FRONT_COMMERCE_WEB_PASSWORD_HINT_DISABLE=true` to your environment file.
