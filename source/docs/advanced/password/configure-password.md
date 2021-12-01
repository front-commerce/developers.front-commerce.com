---
id: configure-password
title: Configure password validity
---

<blockquote class="feature--new">
_Since version 2.12.0
</blockquote>

By default, Front-Commerce expects a certain level of complexity from the password set by a user (8 characters and at least three character types between lowercase letters, uppercase letters, digits and special characters).

You can customize those default rules by overriding `src/web/theme/components/atoms/Form/Input/Password/passwordConfig.js`

The configuration expects rules to be followed and status to be shown as follows.

```javascript
import { defineMessages } from "react-intl";

const messages = defineMessages({
    ...
});

export default {
  rules: [
    {
      // technical ID, must be unique
      id: "", 
       // optionnal, enforces this status if isValid returns false
      invalidStatus: "",
      // optionnal, label to display for this rule in the hinter, if not set : the rule is not shown
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
