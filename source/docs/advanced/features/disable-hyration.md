---
id: disable-hyration
title: Disable Hydration
---

# What is Hydration?

<blockquote class="feature--new">
_Since version 2.16_
</blockquote>

> Hydration or rehydration is a technique in which client-side JavaScript converts a static HTML web page, delivered either through static hosting or server-side rendering, into a dynamic web page by attaching event handlers to the HTML elements. Because the HTML is pre-rendered on a server, this allows for a fast "first contentful paint" (when useful data is first displayed to the user), but there is a period of time afterward where the page appears to be fully loaded and interactive, but is not until the client-side JavaScript is executed and event handlers have been attached.

## Disabling Hydration

While it is not recommended to disable hydration in some senarios one might want to do that. For example to disable the render cycle of the Google crawler bot.

To disable hydration in Front-Commerce you need to set a variable called `__HYDRATE__` to true on the global `window` object. To do so you can add the following snippet to your template HTML file (`src/template/index.html`):

```
<script>
  window.__HYDRATE__ = location.host !== "webcache.googleusercontent.com";
</script>
```

## A Strong Warning

Please ensure your condition is well architected as disabling hydration for a user will render the site in an unusable state.
