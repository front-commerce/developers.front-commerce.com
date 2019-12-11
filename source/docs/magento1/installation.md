---
id: installation
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

[composer](https://getcomposer.org/download/)

1. Configure your composer permission

   `export FC_GITLAB_TOKEN=token`

2. Configuration and required

    ```
    composer config minimum-stability dev
    composer config repositories.front-commerce git https://gitlab.com/front-commerce/magento1-module-front-commerce.git
    composer config repositories.front-commerce-restful git https://github.com/PH2M/Magento-Extra-RESTful
    composer config http-basic.gitlab.com token $FC_GITLAB_TOKEN
    composer require front-commerce/magento1-module:"dev-master"
    ```

### Install directly in your magento app folder

1. Clone or download https://gitlab.com/front-commerce/magento1-module-front-commerce.git
2. Copy `app` directory and past it on your Magento root directory

## Configuration
<blockquote class="note">
If installation is successful, in Magento's administration panel, you will have a new entry "Front-Commerce" in the top menu and a new tab "Front-Commerce" in System > Configuration.
</blockquote>

1. **Check install:**

     Go to admin menu entry Front-Commerce > Configuration. You should see an "Installer checker" that will ensure that everything is configured correctly in your shop. If it is the first time installing the module, most of the checks should be invalid. Please refer to the next steps to validate them.

2. **Rest roles:**

  - Go to admin menu entry System > Web services > REST Roles
  - You need to have 3 roles, `Guest`, `Customer` and `Admin`. If you don't, create them.
  - Set all roles access to all resources (Role API Resources tab > Resource Access "All").

3. **Rest Attribtes:**

  - Go to admin menu entry System > Web services > Rest Attributes
  - You can see 3 user type `Guest`, `Customer` and `Admin`. 
  - Set all ACL attributes rules to all resource access (ACL Attribute Rules tab > Resource Access "All").

4. **Rest OAuth Consumer:**

  - Go to admin menu entry System > Web services > Rest OAuth Consumers
  - Add New OAuth Consumer:
    - Name : `Front-Commerce`
    - Callback URL : `http://local.host` <- is useless but can't be empty

5. **Admin user:**

  - Go to admin menu entry System > Persmissions > User
  - Create new user (Only use for Front-Commerce, you never need to login with this account)
    - User Name: `Front-Commerce`
    - First Name: `Front-Commerce`
    - Last Name `Front-Commerce`
    - Email: enter an administrator email
    - Password: enter a password
    - REST Role: Admin

6. **Rest admin token:**

  - Go to admin menu entry Front-Commerce > Configuration
  - Click on "Generate Token" link in installer checker section (This should be the same key as `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN` and `FRONT_COMMERCE_MAGENTO_ACCESS_TOKEN_SECRET` in your Front-Commerce `.env`)

7. **Magento core patch:**

  If the OAuth Zend Patch is valid in the installer checker, please follow these steps:
  - Copy `fix-sort-params-core.patch` in root directory from module gitlab repo https://gitlab.com/front-commerce/magento1-module-front-commerce.git
  - Past it on your root Magento directory
  - Apply them `git apply fix-sort-params-core.patch`
  
8. **URLs Settings:**

  - Go to System > Configuration > Front-Commerce General > URLs Settings
  - Add your Front-Commerce Front URL. In development environment, it should be `http://localhost:4000`. In production environment, it is the URL of your main store.

9. **Cache Settings:**

  - Go to System > Configuration > Front-Commerce General > Cache Settings
  - Add random Key (This should be the same key as `FRONT_COMMERCE_CACHE_API_TOKEN` in your Front-Commerce `.env`)

10. **Front-Commerce secret key:**

  For more security add random key on `frontcommerce_secret_key` in your `app/etc/local.xml`

  ```
  <config>
    <global>
  +    <frontcommerce_secret_key>{REPLACE_ME_BY_STRING_VALUE}</frontcommerce_secret_key>
      // ...
  ```
11. **Clean Magento cache**

## Ensure it works
Once this is done, all the checks should be green in your installer checker and you should be good to go. You can check that the guest permissions are correctly configured by accessing this URL:

`{MAGENTO_BASE_URL}/api/rest/frontcommerce/urls/match?urls[0]=/about-magento-demo-store`

## Frequent errors
- URL Rewrite: the entry point of the API is the file `api.php`. In order to work, you need to have the following rules :
    - for Apache in an `.htaccess`: `RewriteRule ^api/rest api.php?type=rest [QSA,L]`
    - for Nginx in config server:
    ```
    location /api {
        rewrite ^/api/rest /api.php?type=rest last;
        rewrite ^/api/v2_soap /api.php?type=v2_soap last;
        rewrite ^/api/soap /api.php?type=soap last;
    }
    ```