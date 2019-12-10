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
<blockquote class="note">
Last update : 2019-12-10 (module version 1.1.0)
</blockquote>

You can use 2 ways for installation, we recommend to use composer.
**After installation, don't forget to clean cache.**

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

### Install copy / past

1. Clone or download https://gitlab.com/front-commerce/magento1-module-front-commerce.git
2. Copy `app` directory and past it on your Magento root directory

## Configuration
<blockquote class="note">
If installation is successfully, you have new menu entry "Front-Commerce" and new Système > Configuration tab "Front-Commerce".
If not, try to clear cache and reload ACL (logout / login)
</blockquote>

1. **Check install:**

    Go to admin menu entry Front-Commerce > Configuration. For help us to make all module configuration, you have an "Installer checker"  
    for check if all steps is OK.

2. **Rest roles:**

  - Go to admin menu entry System > Web services > REST Roles
  - You need to have 3 roles, `Guest`, `Customer` and `Admin`. If don't, create it.
  - Set all roles to access to all resources (Role API Resources tab > Resource Access "All"). For more security, you can
    use Custom resource access and manually allow resource.

3. **Rest Attribtes:**

  - Go to admin menu entry System > Web services > Rest Attributes
  - You can see 3 user type `Guest`, `Customer` and `Admin`.
  - Set all ACL attributes rules to all resource access (ACL Attribute Rules tab > Resource Access "All"). For more security, you can
    use Custom resource access and manually allow resource.

4. **Rest OAuth Consumer:**

  - Go to admin menu entry System > Web services > Rest OAuth Consumers
  - Add New Oauth Consumers :
    - Name : `Front-Commerce`
    - Callback URL : `http://local.host` <- is useless but can't be empty

5. **Admin user:**

  - Go to admin menu entry System > Persmissions > User
  - Create new user
    - User Name `Front-Commerce`
    - First Name `Front-Commerce`
    - Last Name `Front-Commerce`
    - Email : you choose
    - Password : you choose
    - REST Role : Admin

6. **Rest admin token:**

  - Go to admin menu entry Front-Commerce > Configuration
  - Click on "Generate Token" link in installer checker section

7. **Magento core patch:**

  Be sure Oauth Zend Patch is apply, for know that, this step need to be green on installer checker section.
  If not :
  - Copy `fix-sort-params-core.patch` in root directory from module gitlab repo https://gitlab.com/front-commerce/magento1-module-front-commerce.git
  - Past it on your root Magento directory
  - Apply them `git apply fix-sort-params-core.patch`
8. **URLS Settings:**

  - Go to System > Configuration > Front-Commerce General > URLS Settings
  - Add your Front-Commerce Front URL

9. **Cache Settings:**

  - Go to System > Configuration > Front-Commerce General > Cache Settings
  - Add random Key (Same key then `FRONT_COMMERCE_CACHE_API_TOKEN` in your Front-Commerce `.env`)

10. **Front-Commerce secret key:**

  For more security add random key on `frontcommerce_secret_key` in your `app/etc/local.xml`

  ```
  <config>
    <global>
  +    <frontcommerce_secret_key>{REPLACE_ME_BY_STRING_VALUE}</frontcommerce_secret_key>
      // ...
  ```

## Ensure it works
Once this is done, your should be good to go.
You can check that the guest permissions are correctly configured by accessing this URL:

`{MAGENTO_BASE_URL}/api/rest/frontcommerce/urls/match?urls[0]=/about-magento-demo-store`

## Frequent errors
- URL Rewrite : Entry point of API is file `api.php` for work, you need to have the next rules :
    `RewriteRule ^api/rest api.php?type=rest [QSA,L]`
    by default is it on your `.htaccess` file. If you use `Nginx` you can add following rule :
    ```
    location /api {
            rewrite ^/api/rest /api.php?type=rest last;
            rewrite ^/api/v2_soap /api.php?type=v2_soap last;
            rewrite ^/api/soap /api.php?type=soap last;
        }
    ```