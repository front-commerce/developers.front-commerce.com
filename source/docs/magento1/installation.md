---
id: magento1-installation
title: Installation
---

## Module compatibility

- `php` (>= 5.4)
- `Magento CE` (>=1.7.x)
- `Magento EE` (>=1.12.x)

### Recommendation

- [Magento LTS](https://github.com/OpenMage/magento-lts) (1.9.4.x)
- `php` 7.3 with OpenSSL
- `MySQL` 8.0+

## Installation

You can use 2 ways for installation, we recommend to use composer.
### Install with composer

#### Prerequisites

The following section supposes that you have a working install of [composer](https://getcomposer.org/download/).

1. Retrieve Gitlab Token

First, you need to create (or retrieve existing) token from your Gitlab account and replace `$FC_GITLAB_TOKEN` by your token on the next step.

2. Configuration and required

```
composer config minimum-stability dev
composer config repositories.front-commerce git https://gitlab.com/front-commerce/magento1-module-front-commerce.git
composer config repositories.front-commerce-restful git https://github.com/PH2M/Magento-Extra-RESTful
composer config http-basic.gitlab.com token $FC_GITLAB_TOKEN
composer require front-commerce/magento1-module:"dev-master"
```

For the main module `front-commerce/magento1-module` require, is strongly recommend to using a fixed version ([see available release](https://gitlab.com/front-commerce/magento1-module-front-commerce/-/releases))

### Install directly in your Magento app folder

1. Clone or download https://gitlab.com/front-commerce/magento1-module-front-commerce.git
2. Copy `app` directory and paste it in your Magento's root directory
3. Clone or download https://github.com/PH2M/Magento-Extra-RESTful
4. Copy `modules/Clockworkgeek_Extrarestful.xml` file and paste it in your Magento's `app/etc/modules` directory
5. Create `app/code/community/Clockworkgeek/Extrarestful` directory in your Magento's
6. Copy all directories inside `code` in your Magento's `app/code/community/Clockworkgeek/Extrarestful` directory

## Configuration
<blockquote class="note">
If the installation is successful, in Magento's administration panel, you will have a new entry "Front-Commerce" in the top menu and a new tab "Front-Commerce" in System > Configuration.
</blockquote>

### **Check install**

Go to the `Front-Commerce > Configuration` admin menu entry. You should see an "Installer checker" that will ensure that everything is configured correctly in your shop.

Right after your first installation, most of the checks should be invalid. Please refer to the next steps to validate them.

### **REST roles**

Front-Commerce requires you to define 3 roles.

Here are the main steps:

  - Go to admin menu entry `System > Web services > REST Roles`
  - You need to have 3 roles, `Guest`, `Customer`, and `Admin`. If you don't, create them.
  - Set all roles access to all resources (Role API Resources tab > Resource Access "All").

See the [official documentation](https://docs.magento.com/m1/ce/user_guide/system-operations/web-services-activate.html) for detailed information about how to achieve this with Magento.

### **REST attributes**

Front-Commerce roles must have access to several data on each entities, so it can expose them in GraphQL. You must allow each role to read these information.

  - Go to admin menu entry `System > Web services > REST Attributes`
  - You can see 3 user types `Guest`, `Customer`, and `Admin`.
  - Set all ACL attributes rules to all resource access (ACL Attribute Rules tab > Resource Access "All").

### **REST OAuth Consumer**

Front-Commerce must be able to create tokens for users when they log-in. You should ensure there is a `Front-Commerce` consumer configured in your install.

  - Go to admin menu entry `System > Web services > REST OAuth Consumers`
  - Add New OAuth Consumer:
    - Name: `Front-Commerce`
    - Callback URL: `http://local.host` <- is useless but can't be empty

The Key/Secret values should be used to configure your Front-Commerce, with the `FRONT_COMMERCE_MAGENTO_CONSUMER_KEY` and `FRONT_COMMERCE_MAGENTO_CONSUMER_SECRET` environment variables in your `.env` file.

### **Admin user**

Advanced features such as Embedded Payments have to use an admin user with REST access. You must ensure it exists, by doing the following steps.

  - Go to admin menu entry `System > Permissions > User`
  - Create a new user (only used for Front-Commerce's embedded payments feature, users will never interact with your shop using this account)
    - User Name: `Front-Commerce`
    - First Name: `Front-Commerce`
    - Last Name `Front-Commerce`
    - Email: enter an administrator email
    - Password: enter a password
    - REST Role: Admin

### **REST admin token**

You must generate admin tokens to configure Front-Commerce.

  - Go to admin menu entry Front-Commerce > Configuration
  - Click on "Generate Token" link in installer checker section (This should be the same key as `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN` and `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN_SECRET` in your Front-Commerce `.env`)

### **Magento core patch**

  If the OAuth Zend Patch is not valid in the installer checker, please follow these steps:
  - Copy the [`fix-sort-params-core.patch`](https://gitlab.com/front-commerce/magento1-module-front-commerce/blob/master/fix-sort-params-core.patch) file in your root directory
  - Past it on your root Magento directory
  - Apply them
    - Whit GIT: `git apply fix-sort-params-core.patch`
    - Without GIT: `patch -p1 < fix-sort-params-core.patch`
  
### **URLs settings**

  - Go to System > Configuration > Front-Commerce General > URLs Settings
  - Add your Front-Commerce Front URL. In development environment, it should be `http://localhost:4000/`. In production environment, it is the URL of your main store.
  - Go to System > Configuration > General > Web
  - Set your base URL (secure + unsecure) with your Front-Commerce front URL (`http://localhost:4000/` in development environment) for each store view value. You can keep your admin URL for the default value.

### **Cache settings**

  - Go to System > Configuration > Front-Commerce General > Cache Settings
  - Add random Key (This should be the same key as `FRONT_COMMERCE_CACHE_API_TOKEN` in your Front-Commerce `.env`)

### **Front-Commerce secret key**

  For more security add a random key on `frontcommerce_secret_key` in your `app/etc/local.xml`

  ```
  <config>
    <global>
  +    <frontcommerce_secret_key>{REPLACE_ME_BY_STRING_VALUE}</frontcommerce_secret_key>
      // ...
  ```
### **Clean Magento cache**

## Ensure it works
Once this is done, all the checks should be green in your installer checker and you should be good to go. You can check that the guest permissions are correctly configured by accessing this URL:

`{MAGENTO_BASE_URL}/api/rest/frontcommerce/urls/match?urls[0]=/about-magento-demo-store`

## Frequent errors
- URL Rewrite: the entry point of the API is the file `api.php`. In order to work, you need to have the following rules:
    - for Apache in an `.htaccess`: `RewriteRule ^api/rest api.php?type=rest [QSA,L]`
    - for Nginx in server config:
    ```
    location /api {
        rewrite ^/api/rest /api.php?type=rest last;
        rewrite ^/api/v2_soap /api.php?type=v2_soap last;
        rewrite ^/api/soap /api.php?type=soap last;
    }
    ```