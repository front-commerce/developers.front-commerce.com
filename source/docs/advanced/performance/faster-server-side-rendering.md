---
id: faster-server-side-rendering
title: Faster Server Side Rendering
---

By default Front-Commerce uses [`renderToStringWithData`](https://www.apollographql.com/docs/react/performance/server-side-rendering/#using-rendertostringwithdata) from Apollo Client. This allows to make sure that every data is fetched before rendering the server. But this can become slow depending on how you have implemented your queries client side. We will see in this documentation what are the best practices about this.

## Avoid Query Cascade

What we call Query Cascade is when a component that needs data from GraphQL also renders a component that will trigger another GraphQL query.

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
    layer({ params: { from: 0, size: 10 } }) {
      products {
        sku
        title
      }
    }
  }
}
```

This can prove useful at times because your component definitions might be scattered accross your project. However, this creates a Query Cascade: we have to wait for the first one to resolve in order to know that we need to do the next one.

Technically this is solved by `renderToStringWithData` by entering in the following loop:

1. renders the application
2. checks if there are any pending queries
3. resolve the pending queries
4. restart step 1.

As long as there will be pending queries at step 2., it will go back to step 1., delaying even more the Server Side Rendering. Thus, by avoiding the cascade, you will only need to run one iteration of the loop and be done with it.

To do so, you need to merge your queries and move them as early as possible in your React tree. For instance, in the above example, rather than giving the responsibility to fetch the layer to a child component, we could fuse the two queries into one:

```graphql
{
  category(id: "10") {
    name
    description
    layer({ params: { from: 0, size: 10 } }) {
      products {
        sku
        title
      }
    }
  }
}
```

## Limit the number of render iteration

But there is also in Front-Commerce the possibility to force only one iteration of the loop mentioned above. This can be enabled by setting the `FRONT_COMMERCE_FAST` environment variable to `true`.

This can improve your SSR times drastically. However the risk is that you may have some data that are not rendered properly at the top level of your page. This is a tradeoff between safety and speed.

In a default Front-Commerce theme, rest assured that you can enable `FRONT_COMMERCE_FAST=true` without a second thought. However, as you customize your shop, you may notice some data that are not rendered properly server side. This might be the cause and you will have two options:

* set back `FRONT_COMMERCE_FAST=false`
* fuse your GraphQL queries to ensure that there is no unwanted cascade

