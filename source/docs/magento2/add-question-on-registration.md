---
id: add-question-on-registration
title: Add a question field when creating an account
---

Here you will learn how to add a `Question` form that the user can fill when creating an account. You may want to check [this](/docs/magento2/add-new-attribute.html) page first, if you don't know how to add an attribute and create a Front-Commerce module.

Here is what the form initially looks like:

![Alt: screenshot of the register form with a `Question` field](./assets/without-question-screenshot.png)

(We will assume you already have done the [first](/docs/magento2/add-new-attribute.html) part.)

## Create a server module

Create a server module, if you haven't already. In this example, ours we be called `acme`.

```bash
mkdir -p mymodule/server/modules/acme
```

(We will assume you already have done the first part. Click [here](/docs/magento2/add-new-attribute.html) if you haven't already.)

## Expose the attribute in your GraphQL schema

<blockquote class="info">
In the first part, we saw how to make a query in GraphQL: we were retrieving data from the backend via the GraphQL server. Now we want to do a mutation: we are uploading data to the backend.
</blockquote>

### Enhance the schema

Create/edit `mymodule/server/modules/acme/schema.gql` and add the following code. This adds a new mutation (with the question field) that we're going to use when the user wants to register.

```diff
# Probably more code here

+extend type Mutation {
+  "Register a new User with question"
+  registerUserWithQuestion(
+    "New user email"
+    email: String!
+    "New user title"
+    title: String
+    "New user firstname"
+    firstname: String!
+    "New user lastname"
+    lastname: String!
+    "New user password"
+    password: String!
+    "New user date of birth"
+    dob: Date
+    "New user newsletter subscription status"
+    is_subscribed_to_newsletter: Boolean
+    "A question that would be sent by email to the seller"
+    question: String
+  ): MutationSuccess
+}
```

### Create the resolver

Edit `mymodule/server/modules/acme/resolvers.js` as shown below. This tells the GraphQL server what to do to resolve the mutation.

```diff
// Code here
+import {
+  promiseToMutationSuccess
+} from "server/core/graphql/mutationResponseBuilders";

export default {
  Product: {
    // More code here
+  },
+  Mutation: {
+    registerUserWithQuestion: (parent, args, context) => {
+      return resolvers.Mutation.registerUser(parent, args, context).then(
+        ({ success, errorMessage }) => {
+          //console.log("User requested to register.");
+          if (success) {
+            //console.log("User successfully registered.");
+            if (args.question) {
+              //console.log("User asked a question");
+              return promiseToMutationSuccess(
+                context.loaders.Contact.sendContactEmail(
+                  "contact_email_template",
+                  [
+                    {
+                      key: "name",
+                      value: `${args.title || ""} ${args.firstname} ${
+                        args.lastname
+                      }`
+                    },
+                    {
+                      key: "email",
+                      value: args.email
+                    },
+                    {
+                      key: "comment",
+                      value: `The user had a question when signing up: ${
+                        args.question
+                      }`
+                    }
+                  ]
+                )
+              );
+            } else {
+              //console.log("User asked no question.");
+              return {
+                success: true
+              };
+            }
+          } else {
+            //console.log(
+            //  "User could not register (maybe the address is already used.)"
+            //);
+            return {
+              success,
+              errorMessage
+            };
+          }
+        }
+      );
+    }
  }
};
```

### Mutation is done

The mutation is done. You can test via the playground. We still have to make an interface usable by the user.

With the Playground, you can manually test your requests:

```graphql
# Write your query or mutation here
mutation registerUserWithQuestion(
  $email: String!
  $title: String
  $firstname: String!
  $lastname: String!
  $password: String!
  $is_subscribed_to_newsletter: Boolean!
  $question: String
) {
  registerUserWithQuestion(
    email: $email
    title: $title
    firstname: $firstname
    lastname: $lastname
    password: $password
    is_subscribed_to_newsletter: $is_subscribed_to_newsletter
    question: $question
  ) {
    success
    errorMessage
    __typename
  }
}

mutation contact {
  sendContactEmail(
    template: "toto"
    data: [
      { key: "name", value: "Test" }
      { key: "email", value: "Test" }
      { key: "comment", value: "Test" }
    ]
  ) {
    success
    errorMessage
  }
}
```

```json
# QUERY VARIABLES
{
  "email":"john.doe@example.com",
  "firstname":"John",
  "lastname":"Doe",
  "password":"azerty",
  "is_subscribed_to_newsletter":false,
  "toto": "toto"
}
```

## Add the form to the page

The source code for the account creation page is located at `node_modules/front-commerce/src/web/theme/modules/User/RegisterForm/`. Copy it into your module. (If you don't know how to locate the source code for a page, click [here](/docs/magento2/add-new-attribute.html#How-to-find-which-files-to-edit).)

```bash
mkdir -p mymodule/web/theme/modules/User/
cp -r node_modules/front-commerce/src/web/theme/modules/User/RegisterForm/ \
mymodule/web/theme/modules/User/
```

Edit `mymodule/web/theme/modules/User/RegisterForm/RegisterForm.js` as shown below. This adds the actual form field seen on the page.

```diff
// More code here
import FormActions from "theme/components/molecules/Form/FormActions";
-import { Text, Email, Password } from "theme/components/atoms/Form/Input";
+import {
+  Text,
+  Email,
+  Password,
+  Textarea
+} from "theme/components/atoms/Form/Input";
import TitleSelect from "theme/components/atoms/Form/Input/TitleSelect";
// More code here

const messages = defineMessages({
  // More code here
  titleLabel: {
    id: "modules.User.RegisterForm.title",
    defaultMessage: "Title"
+ },
+ questionLabel: {
+   id: "modules.User.RegisterForm.question",
+   defaultMessage: "Question"
  }
});

// More code here
      <FormItem
        label={props.intl.formatMessage(messages.passwordConfirmationLabel)}
      >
        <Password
            // More code here
        />
      </FormItem>
+     <FormItem label={props.intl.formatMessage(messages.questionLabel)}>
+       <Textarea name="question" id="question" />
+     </FormItem>
      <FormItem
        label={props.intl.formatMessage(messages.newsletterLabel)}
        inline
      >
        <Checkbox name="newsletter" id="newsletter" />
      </FormItem>
      // More code here
```

Edit `mymodule/web/theme/modules/User/RegisterForm/EnhanceRegisterForm.js` as shown below. This adds the user input from the field to what is passed to the mutation.

```diff
              password: user.password,
              dob: user.dob,
-             is_subscribed_to_newsletter: user.newsletter || false
+             is_subscribed_to_newsletter: user.newsletter || false,
+             question: user.question
            }
          },
          callback: ({ status, data }) => {
```

Edit `mymodule/web/theme/modules/User/RegisterForm/RegisterMutation.gql` as shown below.
We are replacing the default mutation with our own.

```diff
-mutation registerUser(
+mutation registerUserWithQuestion(
  $email: String!
  $title: String
  $firstname: String!
  $lastname: String!
  $password: String!
  $is_subscribed_to_newsletter: Boolean!
+ $question: String
) {
- registerUser(
+ registerUserWithQuestion(
    email: $email
    title: $title
    firstname: $firstname
    lastname: $lastname
    password: $password
    is_subscribed_to_newsletter: $is_subscribed_to_newsletter
+   question: $question
  ) {
    success
    errorMessage
  }
}
```

## Conclusion

Here is what the form looks like on the browser:

![Alt: screenshot of the register form with a `Question` field](./assets/with-question-screenshot.png)
