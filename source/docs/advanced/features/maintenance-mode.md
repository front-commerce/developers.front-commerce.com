---
id: maintenance-mode
title: Maintenance mode
---

# Maintenance Mode

<blockquote class="feature--new">
_Since version 2.16_
</blockquote>

You may want to put one or more of your stores in maintenance mode while you do some maintenance work/deployment tasks on your store(s).

Front-Commerce comes with an API that allows you to put/remove a store in maintenance mode. To enable the maintenance mode API the `FRONT_COMMERCE_MAINTENANCE_MODE_AUTHORIZATION_TOKEN` environment variable should be set.

```diff
// .env file
...
+FRONT_COMMERCE_MAINTENANCE_MODE_AUTHORIZATION_TOKEN=a-secret-token
```

Once you have setup the `FRONT_COMMERCE_MAINTENANCE_MODE_AUTHORIZATION_TOKEN` environment variable the maintenance mode API will be available after restarting the server

## The Maintenance Mode API

### Activating the maintenance mode

To activate the maintenance mode use the following rest request:

```sh
curl --location --request POST 'http(s)://www.example.com/:storeBaseUrl/maintenance-mode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "token": string,          // the value of the "FRONT_COMMERCE_MAINTENANCE_MODE_AUTHORIZATION_TOKEN" environment variable
    "duration": number | null // a number to timeout the maintenance mode in milliseconds or null to not reset maintenance mode after a timeout
}'
```

So if your store base url is `/en` the URL would be `http(s)://www.example.com/en/maintenance-mode`.

As noted above the `duration` is optional. If used it will reset the maintenance mode after the duration has passed. Use this if you have a rough idea of how much time the maintenance task would take. This would be to avert an issue where the user forgets to bring the site back on after the maintenance mode is done of if an automated CI that puts a site in maintenance would exit before putting the site back on.

### Deactivating the maintenance mode

To deactivate the maintenance mode use the following rest request:

```sh
curl --location --request DELETE 'http(s)://www.example.com/:storeBaseUrl/maintenance-mode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "token": string          // the value of the "FRONT_COMMERCE_MAINTENANCE_MODE_AUTHORIZATION_TOKEN" environment variable
}'
```

### To check the maintenance mode

To check the maintenance mode use the following rest request:

```sh
curl --location --request GET 'http(s)://www.example.com/:storeBaseUrl/maintenance-mode'
```

## Bypassing the maintenance mode

To bypass the maintenance mode for certain IPs you can configure the `FRONT_COMMERCE_MAINTENANCE_MODE_AUTHORIZED_IPS` environment variable. Please note that you can have multiple IPs separated by a comma like:

```diff
// .env file
...
FRONT_COMMERCE_MAINTENANCE_MODE_AUTHORIZATION_TOKEN=a-secret-token
FRONT_COMMERCE_MAINTENANCE_MODE_AUTHORIZED_IPS=127.0.0.1,83.65.12.111
```
