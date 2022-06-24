---
id: deactivating-unnecessary-features
title: Deactivating unnecessary features
description: Front-Commerce contains several features enabled by default to provide a good experience out-of-the box. Deactivating features you don't need can make your application faster.
---

Each production context is different: projects may not need some features or the infrastructure may have other components that provides the same feature in a more performant way. In these contexts, we recommend that you deactivate Front-Commerce built-in features to prevent unnecessary processing and improve your application's performance.

This page contains a list of features that can be deactivated when not relevant to your context.

## Deactivate response compression

You can deactivate response compression (e.g: `gzip`) from the Front-Commerce server. It allows to reduce your server CPU usage in contexts where a frontend CDN or proxy can handle compression more efficiently.

If your application is deployed in such context, you might consider deactivating it. There are two ways to achieve this:

- globally: set the `FRONT_COMMERCE_EXPRESS_COMPRESSION_ENABLED=false` environment variable and no response will be compressed
- per request: add the `x-no-compression` request header to prevent compressing specific requests
