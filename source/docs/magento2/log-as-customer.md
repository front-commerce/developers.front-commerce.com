---
id: log-as-customer
title: Log as Customer
---

_This feature has been added in version `2.3.0`_

Magento administrators can login as a Customer on their Front-Commerce storefront. It is a **highly requested feature from merchants and customer support teams**.

This feature is part of [our Magento Admin detection feature](/docs/magento2/detect-admin-users.html) to empower store owners in their day to day activities. You must ensure the Admin detection feature is correctly configured before enabling this one.

## How does it work?

The "Log as Customer" feature starts from a button from the Magento Customer page in admin. Clicking on this button will generate an authentication token and redirects the admin user to the customers default storefront.

Admins can then log out from the customer account and log as another customer if needed.

## Configuring your environment

**Prerequisites:** the 2.2.x version of the Front-Commerce Magento module is installed and [the admin user detection is properly configured](/docs/magento2/detect-admin-users.html#Configuring-your-environment).

Then, you must configure the related ACL for Administrators who must be allowed to log as Customers:

![Log as customer ACL](./assets/admin-log-as-customer-acl.png)

## Log as Customer

From the Customer page, you must now view a "Login as Customer" button. Click on it, and if everything is properly configured you might be authenticated on the storefront as this Customer.

![Log as customer button](./assets/admin-log-as-customer-button.png)