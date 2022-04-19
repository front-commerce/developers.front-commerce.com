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

# Other metrics

## Measure external services call times

Once the `/metrics` endpoint is enabled, you can count the time spent calling external services by installing additional modules

- `npm i @opentelemetry/instrumentation-http @opentelemetry/instrumentation @opentelemetry/api`

This will append the following metrics to the `/metrics` endpoint

```
outbound_requests_duration_bucket{le="<duration>",target="<targeted_service>"} <number_of_queries>
```

Example with a magento backend service

```
# TYPE outbound_requests_duration histogram
outbound_requests_duration_bucket{le="0.1",target="magento.location.net"} 0
outbound_requests_duration_bucket{le="0.25",target="magento.location.net"} 51
outbound_requests_duration_bucket{le="0.5",target="magento.location.net"} 58
outbound_requests_duration_bucket{le="1",target="magento.location.net"} 59
outbound_requests_duration_bucket{le="2",target="magento.location.net"} 74
outbound_requests_duration_bucket{le="+Inf",target="magento.location.net"} 75
outbound_requests_duration_sum{target="magento.location.net"} 31.227999999999998
outbound_requests_duration_count{target="magento.location.net"} 75
```
