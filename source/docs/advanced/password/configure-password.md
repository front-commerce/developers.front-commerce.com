---
id: configure-password
title: Configure password validity
---

<blockquote class="feature--new">
_Since version 2.12.0
</blockquote>

By default, Front-Commerce expects a certain level of complexity from the password set by a user (8 characters and at least three character types between lowercase letters, uppercase letters, digits and special characters).

You can customize those default rules by overriding `theme/components/atoms/Form/Input/Password/passwordConfig.js`

The configuration expects a list of rules to be satisfied and status to be displayed to users. It should follow the format below:

```javascript
// theme/components/atoms/Form/Input/Password/passwordConfig.js
import { defineMessages } from "react-intl";

const messages = defineMessages({
    ...
});

export default {
  rules: [
    {
      // technical ID, must be unique
      id: "", 
       // optional, enforces this status if isValid returns false
      invalidStatus: "",
      // optional, label to display for this rule in the hinter. If it is not defined, the rule is not displayed.
      label: messages.?, 
      // validation method for this rule
      isValid: (password) => true, 
    },
  ],
  status: {
    // status key, used by rule.invalidStatus
    TOO_SHORT: { 
      // message to display for this status
      label: messages.?,
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
