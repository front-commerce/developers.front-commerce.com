---
id: logging
title: Setup and use logging
---

When you need to log something in a javascript environment, the first thing that comes to mind is obviously `console.log`. But the issue with it is that you won't be able access it in the long term. Especially since some Node.js server environments don't keep a trace of the stdout/stderr of your application.

To avoid this, we're using a custom logging interface based on [`winston`](https://github.com/winstonjs/winston) (a well-known logging solution in the Node.js ecosystem). It allows you to create a logger and configure it in your `my-module/config/logging.js` file to send your logs to different systems.

# Use the base loggers

There are three default loggers coming with Front-Commerce:
* **the `server` logger**  
  Reports any message sent through the default `winston` import in express routes
```js
winston.info({
    message: `Customer returned from ${methodCode} (${actionName})`,
    date: format(new Date())
});
```
* **the `client` logger**  
  reports any log message from the client side
```js
import logHandler from "utils/logHandler";

logHandler.getLogger().error(e);
```
* **the `access` logger**  
  Logs automatically any request incoming on your server

# Configure the loggers

Without configuration, a logger does nothing. You need to configure what to do with the message reported by the different loggers. This is done in to the `my-module/config/logging.js` file.

```js
// my-module/config/logging.js
module.exports = {
  server: [
    {
      type: "file",
      filename: "server.log"
    }
  ],
  client: [
    {
      type: "file",
      filename: "client.log"
    }
  ],
  access: [
    {
      type: "file",
      filename: "access.log"
    }
  ]
};
```

In this example, we've told the logging system to output every message in three files `server.log`, `client.log`, `access.log` that will be accessible in the `logs/` folder of your application.

But how does this work?

In fact, the object that we exports tells the logging system that for each logger (identified by the keys of the object), we will add an array of [transports](https://github.com/winstonjs/winston#transports).

This means that for each logger, each message will be sent using these transports. Currently, there are two types of logger transports implemented in Front-Commerce:
* `type: "file"`: it will append the message to a file in your server's filesystem.  
  The only option available is `filename` which is the name of the file that will be put in the `logs` folder of your project.
* `type: "sentry"`: it will send the message to a sentry instance. Sentry is a tool that will make it easier to triage errors and assign some of your team members to their resolution.  
  The only option available is `options` which is the object given to the transport lib [winston-sentry-log](https://github.com/franciscofsales/winston-sentry-log#readme)
* `type: "console"`: it will send the message to stdout/stderr. This is intended for customers that already have a log collection system (centralized logging for kubernetes or a cloud platform).

There will be most likely more transport configurations in the future, but more likely [we will add a feature to add your own custom transport (#104)](https://gitlab.com/front-commerce/front-commerce/issues/104).

# Add a new logger

Splitting your messages in the three default loggers (`access`, `client`, `server`) might be enough. But in some cases, you may want to move the messages into another logger to make it either to follow what happens for a specific feature.

<blockquote class="important">
**Important:** The new loggers you will create are only available server side. If you need to use this logger from the client side, you will need to either create a GraphQL mutation or a custom HTTP endpoint. This will allow the client to send a message to the server which will then be able to log it. <!-- TODO links to GraphQL Mutation + HTTP Endpoint -->
</blockquote>

To do so, you can create new custom loggers that will be configured through the same `config/logging.js` file.

```diff
// my-module/config/logging.js
module.exports = {
  // ... the rest of your logger configuration
+  myLoggerName: [
+    {
+      type: "file",
+      filename: "server.log"
+    }
+  ],
};
```

By doing this, you've configured your logger. But you still need to use it by importing the `loggingService` that will let you create the logger.

```js
import loggingService from "server/express/loggingService";

const logger = loggingService.createLogger("myLoggerName");
```

This will then be used just like the [`winston` API](https://github.com/winstonjs/winston#using-logging-levels): `logger.log(type, message, data)`.
