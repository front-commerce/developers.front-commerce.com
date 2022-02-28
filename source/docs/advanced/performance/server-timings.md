---
id: server-timings
title: Server Timings
---

[Server Timings](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) are metrics that are sent via a header in the response of an HTTP request. They allow you to see how time is spent on the server from your browser DevTools, so you could optimize it if needed.

You can see a representation in your network panel of your devtools by clicking on request and opening the "Timings" tab. Follow these guides for [Firefox](https://developer.mozilla.org/en-US/docs/Tools/Network_Monitor/request_details#Timings)'s or [Google Chrome](https://www.smashingmagazine.com/2018/10/performance-server-timing/#the-server-timing-header)'s devtools.

The Server Timings are enabled when one of the following condition is satisfied:

- `FRONT_COMMERCE_ENV !== "production"`
- `DEBUG=front-commerce:performance`

## List of Server Timings registered in the core

The different timings available for an HTML page are:

- **Compute config for request**: how long it took to compute `req.config`
- **Resolve initial template**: how long it took to retrieve the `index.html` template needed for SSR
- **Initialize GraphQL loaders**: how long it took to initialize the GraphQL loaders needed for executing GraphQL queries during SSR
- **React App initialization**: how long it took to create the base React component that will be rendered during SSR
- **Resolve Apollo queries**: how long it took to retrieve all the data needed to render the page
- **Render final HTML**: how long it took to render the final HTML page

For further information about SSR, you can read [the Server Side Rendering documentation page](/docs/advanced/theme/server-side-rendering.html),

## Adding your own Server Timings

You can setup your own Server Timings by using `req.startTime`, `req.endTime` or `req.setMetric`.

These methods come from the [`server-timing`](https://www.npmjs.com/package/server-timing) package. Please refer to this package's documentation for detailed usage.
