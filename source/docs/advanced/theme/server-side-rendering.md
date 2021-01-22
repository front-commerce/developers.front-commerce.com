---
id: server-side-rendering
title: Server Side Rendering (SSR)
---

Front-Commerce uses <abbr title="Server Side Rendering">SSR</abbr> (opposed to <abbr title="Client Side Rendering">CSR</abbr>) to improve <abbr title="Search Engine Optimization">SEO</abbr> and <abbr title="User experience">UX</abbr> by serving <abbr title="Hypertext Markup Language">HTML</abbr> pages to users on their first hit to the server. You can read [A typical request in Front-Commerce](/docs/concepts/architecture-overview.html#A-typical-request-in-Front-Commerce) to get a better understanding of this process.

To generate this HTML page, Front-Commerce will render the React application as a string. During this process, your React components will trigger Apollo queries that will "fetch" data from the GraphQL layer. It may hit remote APIs and finally generate the HTML content of your page from these data.

**While we try to make this process as smooth as possible for developers so you don't have to worry about the technical details, there are some things that you should be aware of while creating your theme.**

This section details everything frontend developers must keep in mind when authoring components in a <abbr title="Server Side Rendering">SSR</abbr> context

## There is no `window` on the server!

Even though it may seem obvious, **you are very likely to come across this problem at some point!** Browser APIs are not available during <abbr title="Server Side Rendering">SSR</abbr>. Keep it in mind when using them, and provide a graceful fallback.

Sometimes, it could be as simple as a default value or returning earlier from your function without any side effect.

Examples:

```js
const doSomethingWithIntersectionObserver = () => {
  if (typeof window === "undefined" || !window.IntersectionObserver) {
    return;
  }
  // …
}
```

```js
const initializePosition = setPosition => {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    setPosition(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      setPosition(position.coords.latitude, position.coords.longitude);
    });
  }
}
```

## `branchServerClient` at the rescue!

There may be situations were displaying a totally different component during the server rendering might be relevant.

For instance, instead of displaying a map centered on the user geolocation it might be better to render a placeholder (page skeleton) on the server and load the map with additional data during <abbr title="Client Side Rendering">CSR</abbr>. Another use case would be to avoid an unnecessary overhead by not rendering some components during <abbr title="Server Side Rendering">SSR</abbr>: a social media feed may not make sense on the server.

Front-Commerce provides a `branchServerClient` <abbr title="Higher Order Component">HOC</abbr> that allow you to conditionally render a component or another one on server and client side.

Example:

```js
import branchServerClient from "web/core/branchServerClient";

const MyClientSideComponent => props => <div>Hi!</div>;

export default branchServerClient(
  () => () => null, // do not render anything during SSR
  BaseComponent => BaseComponent // render the base component on the client
)(MyClientSideComponent);
```

Please keep in mind that by default the server version will always be displayed first. This means that if you are on a category page and navigate to a product page, it will first display the server version of the product page. When it's done loading, it will then display the client version. The goal here is to enable faster navigation and display only critical information on page mount.

If you want to change this behavior and display the client version of the branch, you can use **`branchServerClient`'s third parameter** to pass the `{ preferClientSide: true }` option.

<blockquote class="tip">
  **Tip:** the function name (branch**Server**_Client_) is a good way to remember that the first parameter is what is rendered on the **server**, and the second on the _client_.
</blockquote>

If you only need to know the rendering context, you can use Front-Commerce's `withIsServer` HOC to have an `isServer` prop injected in your component.

Example:

```js
import { withIsServer } from "web/core/branchServerClient";

const MyIsomorphicComponent => props => <div>
  My latest render occured on the {props.isServer ? "server" : "client" }.
</div>;

export default withIsServer()(MyIsomorphicComponent);
```

<blockquote class="note">
  **ProTip™:** in order to reduce the amount of Javascript sent to users, we've found that code using `branchServerClient()` are often good candidates to code splitting. You may consider using a `loadable()` component here. You can use [`DEBUG="front-commerce:webpack"`](/docs/reference/environment-variables.html#Debugging) to analyze your bundles and decide wether it would improve your application or not.
</blockquote>

## A viewport as consistent as possible

<blockquote class="feature--new">
  _This feature has been added in version `2.0.0-rc.0`_
</blockquote>

When using the `<MediaQuery>` component (a thin wrapper around [`react-responsive`'s component](https://github.com/contra/react-responsive#with-components), available in `"theme/components/helpers/MediaQuery"`), Front-Commerce has to decide which viewport width to use during <abbr title="Server Side Rendering">SSR</abbr>.

We decided to use [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) based detection in order to choose a width. Even though it might not be perfect (the best solution still is to use CSS media queries as much as possible over render-time media queries with the above component) we think it brings a good user experience.

This behavior is leveraging [Front-Commerce's configuration system](/docs/advanced/server/configurations.html) to provide information about the device. Each `req.config` will contain a `device` key with the following information that you can use to if needed:

```js
// req.config.device
{
  // User-Agent detection is memoized for each header value for this amount of time
  memoizationMaxAge: ONE_MINUTE_IN_MS,
  type: "phone", //  ["phone", "tablet", "pc", "tv", "bot"]
  viewportWidthInPx: 360
}
```

If you want to tweak this behavior, we invite you to browse the [`deviceConfigProvider`](https://gitlab.com/front-commerce/front-commerce/-/blob/master/src/server/express/ssr/deviceConfigProvider.js) for implementation details and [contact us](mailto:contact@front-commerce.com) if you think of improvements.

## SSR Fallback when things go wrong

<blockquote class="feature--new">
  _This feature has been added in version `2.0.0-rc.0`_
</blockquote>

During <abbr title="Server Side Rendering">SSR</abbr> you might face some errors (syntax errors, [browser API usage](/docs/advanced/theme/server-side-rendering.html#There-is-no-window-on-the-server), render errors, etc.). By default in dev mode, Front-Commerce provides an error page that makes the mistake obvious to allow you to fix it as early as possible.

Hopefully the previous screen will prevent such errors to occur in production, but development is not an exact science and things can go wrong! In such situations, the `theme/pages/SsrFallback` component will be rendered instead of the page. **It displays a clean loading area, but you can override it to provide another visual waiting page to users while the application is being rendered client side.**

If you still want to display the `theme/pages/SsrFallback` page in dev mode, [add `FRONT_COMMERCE_DEV_SSR_FALLBACK_DISABLE=true` to your environment variables](/docs/reference/environment-variables.html#DX).

## Learn more

If you want to learn more about <abbr title="Server Side Rendering">SSR</abbr> in Front-Commerce, we recommend you to understand how [Server timings](/docs/advanced/performance/server-timings.html) could help you to spot performance issues and read the [Faster Server Side Rendering](/docs/advanced/performance/faster-server-side-rendering.html) documentation page.
