---
id: front-commerce-and-pm2
title: Front-Commerce and PM2
---

Front-Commerce is a node.js application. You may want to run it in production with the [PM2 Process Manager](https://pm2.keymetrics.io/). This page explains how you could achieve this, and benefit from PM2 features such as: zero-downtime deployment, cluster mode, autoreload, logs aggregation…

<blockquote class="note">
  PM2 is not the only way to deploy Front-Commerce in production, however we often get asked about how PM2 should be configured for Front-Commerce. This page is here to get you started but we recommend that you discuss it with your system administrator.
</blockquote>

## `ecosystem.config.js`

We recommend to use an `ecosystem.config.js` file so you could track changes to your deployment configuration, however these settings can also be passed to PM2 CLI.

Below is an annotated example of configuration:

```js
module.exports = {
  apps: [
    {
      name: `frontcommerce-app`,
      cwd: `/path/to/your/frontcommerce/app`,

      // This is how you could start Front-Commerce in a cluster-mode compatible way
      script: `./node_modules/front-commerce/src/server/index.js`,

      // Running the script as shown above will prevent Front-Commerce
      // to find the `.env` file usually located at your project's root.
      // Using this node argument is the recommended way to load those variables
      node_args: "-r dotenv/config",

      // collocate PM2 logs with default Front-Commerce logs
      error_file: "./logs/pm2-err.log",
      out_file: "./logs/pm2-out.log",
      log_file: "./logs/pm2-combined.log",

      // It is safe to let PM2 restart your processes in case of
      // an unexpected failure, or if they consume too much memory.
      // Memory leaks on long-running processes such as node servers
      // are common, and it is safe to have a watchdog for them
      autorestart: true,
      max_memory_restart: "2G", // adapt this value to your environment
      restart_delay: 1000, // prevents flooding the server with restarts
      kill_timeout: 15000, // allows Front-Commerce to end existing connections properly
      wait_ready: true, // allows to wait for server start to prevent 502 errors

      // PM2's cluster mode allows your application to leverage all
      // the CPUs available on your server. It is a good way to make
      // your app faster.
      instances: "max",
      exec_mode: "cluster",

      env: {
        // You may also prefer to use this configuration file
        // to define environment variables
      },
    },
  ],
};
```

<blockquote class="note">
  Please note that this page only focuses on Front-Commerce related configurations. You should look into additional PM2 configuration keys and ensure they are adapted to your deployment environment for an optimal configuration.
</blockquote>

## Start your application

If an `ecosystem.config.js` file is versioned at the root of your project, you could then start or replace your Front-Commerce app in production with a new version using the command below:

```
pm2 reload ecosystem.config.js
```

It might allow to deploy the new version of your application with zero downtime!

For other questions about using PM2, we recommend that you read [their official documentation](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).