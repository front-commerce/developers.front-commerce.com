---
id: faster-server-side-rendering
title: Faster Server Side Rendering
description: Front-Commerce starts delivering the server-side rendered pages to users as soon as every data needed on the page has been received. The way you implement GraphQL queries client side directly impacts the "Time To First Byte" of your application. This guide contains good practices to deliver pages as fast as possible.
---

By default Front-Commerce uses [`renderToStringWithData`](https://www.apollographql.com/docs/react/performance/server-side-rendering/#using-rendertostringwithdata) from Apollo Client. This allows making sure that every data is fetched [before rendering on the server](/docs/advanced/theme/server-side-rendering.html). But this can become slow depending on how you have implemented your queries client side. Here is what you can do to reduce the delay.

## Avoid Query Cascade

What we call Query Cascade, is when a component that needs data from GraphQL also renders a component that will trigger another GraphQL query.

For instance, let's say that we are rendering a Category page. The Category component needs the following data:

```graphql
{
  category(id: "10") {
    name
    description
  }
}
```

And as long as the data was not fetched, it will not render anything. But as soon as it is done, it will render a Layer component that will need the following data:

```graphql
{
  category(id: "10") {
    layer(params: { from: 0, size: 10 }) {
      products {
        sku
        title
      }
    }
  }
}
```

This can prove useful at times because your component definitions might be scattered across your project. However, this creates a Query Cascade: we have to wait for the first one to resolve in order to know that we need to do the next one.

Technically this is solved by `renderToStringWithData` by entering in the following loop:

1. renders the application
2. checks if there are any pending queries
3. resolve the pending queries
4. restart step 1.

As long as there will be pending queries at step 2., it will go back to step 1., delaying the Server Side Rendering even more. Thus, by avoiding the cascade, you will only need to run one iteration of the loop and be done with it.

To do so, you need to merge your queries and move them as early as possible in your React tree. For instance, in the above example, rather than giving the responsibility to fetch the layer to a child component, we could fuse the two queries into one:

```graphql
{
  category(id: "10") {
    name
    description
    layer(params: { from: 0, size: 10 }) {
      products {
        sku
        title
      }
    }
  }
}
```

## Send correct headers to leverage proxy or CDN caching

CDN and proxies allow to cache generated pages for the next users. By sending correct HTTP headers, you could allow them to cache pages generated during SSR and improve the performance and scalability of your application.

See [Cache control and CDN](/docs/advanced/performance/cache-control-and-cdn.html) for further information.
