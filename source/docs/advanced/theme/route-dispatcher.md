---
id: route-dispatcher
title: Handle dynamic URLs with the Dispatcher
---

In some cases, you will need a deeper customization of URLs than what you can do in the [Add a new page guide](../../essentials/add-a-page-client-side). For instance, for some SEO reasons, you may prefer to have `/my-product` instead of `/product/my-product-slug`.

That is what the Dispatcher is for in Front-Commerce, and what we will cover in this documentation.

## What is the goal of the Dispatcher?

The dispatcher is actually a component within Front-Commerce that will be displayed in case no other route was found. Its goal will be to ask the server (by using the `matchUrls` query in your GraphQL Schema) what kind of page is associated with the current URL and will display the page's component accordingly.

<figure>
![Diagram explaining how an URL is displayed](./assets/dispatcher.svg)
</figure>

If you come from a Magento background, this is the concept behind [URL Rewrites](https://docs.magento.com/m2/ce/user_guide/marketing/url-rewrite.html).

In the core of Front-Commerce, the association between an URL and a page is already done for things like Products, Categories, CMS pages… But depending on your own site, you might need to add new ones.

To do so, you will need to proceed in two steps:
* Support the new URLs in the `matchUrls` query in your GraphQL Schema
* Add the mapping between the type returned by `matchUrls` and the page component that should be displayed

## Support the new URLs in the `matchUrls`

<blockquote class="info">
**Magento:** If the url you are trying to add are managed by Magento, you don't need any of this. You should instead [add an url rewrite directly in your backend](https://devdocs.magento.com/guides/v2.2/cloud/configure/import-url-rewrites.html), since the mechanism already exists in the Magento module of Front-Commerce.
</blockquote>

The goal here will be [to override the resolver](/docs/reference/graphql-module-definition.html#resolvers-optional) of `matchUrls` in order to add your own URLs.

1. Create a custom GraphQL module that will add new `resolvers` to your GraphQL Schema See [Create a new GraphQL module](/docs/essentials/extend-the-graphql-schema.html) for more details.
2. Create a loader that will match a URL string with an Entity (the object returned below):
```js
const MyModuleUrlLoader = makeDataLoader => () => {
  return {
    load: url => {
      if (url === "my-dynamic-custom-url") {
        return {
          // The url that you are currently matching
          url: "my-dynamic-custom-url",
          // The type of entity you are willing to
          // display for this URL
          type: "pageType",
          // The id that will let you load the
          // correct entity within your page component
          identifier: "identifier",
          // The path that will let you know what's
          // the supposed URL before the URL rewrite
          target_path: "catalog/product/view/id/17",
          // A type that will let you know if its the
          // correct URL or if you should redirect
          // it. If it is a redirection, it should have
          // the value `301`.
          redirect_type: 0
        }
      }
    }
  }
}
```
    <blockquote class="note">
    See [Loaders](/docs/advanced/graphql/slim-down-resolvers-with-loaders.html) documentation to learn how to instantiate your loader and add it to your GraphQL context.
    </blockquote>

    Here, we only handle `my-dynamic-custom-url` URL. However, you will most likely need to fetch the result from one of your backend instead. If you do so, the final result should still match the structure of an Entity as presented above.

3. Override the `matchUrls` query in order to use your brand new Loader.
```js
const resolvers = {
  Query: {
    matchUrls: (_, { url }, { loaders }) => {
      return loaders.MyModuleUrl.matchBy(url)
        .then((result) => {
          if (result) {
            return result;
          } else {
            return loaders.Url.matchBy(url);
          }
        })
    },
  }
};
```
    Note that we don't want to forget to call the initial `loaders.Url.matchBy` here. If we don't, we will break the base functionalities of Front-Commerce.
    
    Additionally, since we are using an existing loader, we must make sure that our dependencies are correctly configured in our module. In case of a store using Magento, we should add the dependency on `Magento2/Url` module. See [Graphql module definition Reference](/docs/reference/graphql-module-definition.html#dependencies-optional) for more details.

Once you've done these three steps, you should be able to test that everything works as expected by using the GraphQL Playground at http://localhost:4000/playground and executing the following query:

```gql
{
  matchUrls(url: "my-dynamic-custom-url") {
    url
    type
    identifier
    target_path
    redirect_type
  }
}
```

## Add the mapping between the `type` and the page component

Once your server is correctly configured, you need to map the `type` that is returned in your `matchUrls` query to an actual component.

To do so, you need to create the `my-module/web/moduleRoutes.js` file in your module that will contain the mapping. You might have already created if you followed the [Add a new page](/docs/essentials/add-a-page-client-side.html#Map-the-URL-to-the-page-component) guide. But instead of using the default export, you will need to export a named object `dispatchedRoutes`.

This object has page types as keys (in our case `pageType`), and a render function as values that will tell the application what to render for a specific key (in our case, it renders `MyCustomPage`). This will give you something like this:

```js
//` my-module/web/moduleRoutes.js`
import React from "react";
import MyCustomPage from "theme/pages/MyCustomPage";

export const dispatchedRoutes = {
  pageType: props => <MyCustomPage id={props.matched.identifier} />
};

// you can still export your static routes here
// export default () => [
//   <Route ... />
// ];
```

In the props passed to a render function (L6), you will have access to a `matched` property that is in fact the object returned by your `matchUrls` GraphQL query.

Once you've created your file, you can refresh your application
(`npm run start`), and you should see your new route if you go
to the `/my-dynamic-custom-url` URL. It will display `MyCustomPage` component.

And this is it! From now on, any URL that is matched to a particular `type` in your `matchUrls` query, will now be displayed with the render function you defined in your `dispatchedRoutes` export.