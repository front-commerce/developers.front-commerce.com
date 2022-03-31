---
id: metrics
title: Server's metrics
---

# Expose metrics for prometheus

Front-Commerce provides a `/metrics` endpoint with data about the node process and response times.

## Configure it

You need two steps to enable this endpoint

- `npm install express-prom-bundle prom-client`
- define the environment variable `FRONT_COMMERCE_CLOUD_METRICS_KEY` with a basic authentication token (base64 encoded, e.g. `dXNlcjpwYXNzd29yZA==` for `user:password`)

## Access it

Call `https://<your_website>/metrics` with the defined header `Authorization: Basic <FRONT_COMMERCE_CLOUD_METRICS_KEY>`
