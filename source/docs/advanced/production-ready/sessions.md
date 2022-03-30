---
id: sessions
title: Setup sessions
---

By default the user sessions are stored on disk. It can be a limitation if you want to scale the application horizontally by adding more Front-Commerce nodes or machines to serve users. This page will explain how to configure alternative session storages through the [`config/sessions.js`](/docs/reference/configurations.html#config-sessions-js) configuration file.

# Configure sessions via redis

You can handle user session using redis by configuring it in `my-module/config/sessions.js`.

```js
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const { createClient } = require("redis");

const redisClient = createClient({
  // see https://www.npmjs.com/package/redis#options-object-properties
  host:
    process.env.FRONT_COMMERCE_CLOUD_REDIS_SESSIONS_HOST ||
    process.env.FRONT_COMMERCE_REDIS_SESSIONS_HOST ||
    "127.0.0.1",
  port:
    process.env.FRONT_COMMERCE_CLOUD_REDIS_SESSIONS_PORT ||
    process.env.FRONT_COMMERCE_REDIS_SESSIONS_PORT ||
    6379,
  db: process.env.FRONT_COMMERCE_REDIS_SESSIONS_DB || 2,
});

module.exports = {
  // see https://developers.front-commerce.com/docs/advanced/production-ready/sessions.html
  store: () => {
    return new RedisStore({ client: redisClient });
  },
};
```

You will also need to execute `npm install connect-redis` to install the dependency.
