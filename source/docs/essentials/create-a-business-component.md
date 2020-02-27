---
id: create-a-business-component
title: Create a Business Component
---

In Front Commerce we have separated our components in two categories: the **UI**
components available in the `web/theme/components` folder, and the **Business**
components available in the `web/theme/modules` and `web/theme/pages` folders.

<blockquote class="note">
If you feel the need to understand why we went for this organization, feel
free to refer to [React components structure](/docs/concepts/react-components-structure.html)
first.
</blockquote>

In this section, we will build a **Business Component**. If you have already
gone through the [Create an UI component](create-a-ui-component.html), the core
concept is the same.

## What is a Business component

A Business component will be located in the `my-module/theme/modules` folder. Those
components are not meant to be reused a lot in your application, they are built
with a **very specific use in mind**. When creating a custom theme, they should
emerge from [your Pages components](add-a-page-client-side.html).

To illustrate this, imagine that you are building the homepage for your store.
You add a big hero image on top, some product listings for news and sales, a
reinsurance banner, etc.

Quickly, you will want to **extract** some components from your page to avoid a
_big bloated file_. Some of these components will be extracted as **reusable UI
components** but some are very specific to your page and there is no reason to
put them in the [`components`](create-a-ui-component.html) folder.

<blockquote class="note">
They are often a mix between UI components and custom layout. They may be
split in multiples components if they are big enough.
</blockquote>

Generally, they are related to **your business** and often need backend data
like CMS content or store information. We refer to them as **Business
components** or even **modules**.

<blockquote class="note">
Unlike UI components, Business ones are often _smart_ and contain logic. We
try to extract this logic in **Enhancers**, more on that later.
</blockquote>

## Creating a store locator

To explain the concept and the emergence of modules, we will add a **store
locator** to our home page and see how to extract it properly as a module.

In the following steps, we are going to build our store locator. We will go
through:

1.  Displaying a map on the homepage
2.  Fetching the position of the store from the backend
3.  Link both to have an actual module

### Installing the dependencies

To create the map, we are going to use the
[**react-leaflet**](https://react-leaflet.js.org/en/) package. It provides a
component that uses leaflet under the hood. It will allow us to display the
position of our store within [OpenStreetMap](https://www.openstreetmap.org/search?query=Toulouse#map=12/43.6007/1.4329).

This is one of the biggest advantages of using React to build our front-end, we
have access to this huge ecosystem.

Let's install the two required packages:

```sh
npm install react-leaflet leaflet
```

### Our new Homepage

#### Override the default Home page

Before starting to edit the Home page, you first need to extend the theme.
If you don't have any module yet, please refer to
[Extend the theme](./extend-the-theme.html#Configure-your-custom-theme-and-use-it-in-your-application).
Once you have one, the goal will be to override the Home component from [`node_modules/front-commerce/src/web/theme/pages/Home/Home.js`](https://gitlab.com/front-commerce/front-commerce/blob/master/src/web/theme/pages/Home/Home.js)
to `my-module/web/theme/pages/Home/Home.js`.

<blockquote class="warning">
Do not forget to restart your application (`npm run start`) in case the override
do not work. There is an upcoming improvement that should make things easier in
the future (see [#63](https://gitlab.com/front-commerce/front-commerce/issues/63)).
</blockquote>

#### Customize it

Once you have your own `Home` component in your module, it is time to customize
it and add your store locator.

You don't need to anticipate every **UI** or **Business** component in your
application. Only extract them when your component gets bigger or if you feel the
need to extract some of them.

To illustrate this point, we are going to create the first version of our map
into the homepage directly. We will start with hardcoded values for the store
coordinates. Then we will extract the store locator feature in its own module
component. And finally, we will fetch the actual coordinates from the
**GraphQL schema**.

The first working version will look like:

```jsx
// my-module/theme/pages/Home/Home.js;

// ... Existing imports
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";

const Home = ({ store }) => (
  <div className="page page--home">
    {/* ... The rest of the homepage */}
    <Map
      center={[43.584296, 1.44182]}
      zoom={14}
      style={{ height: "600px", width: "800px" }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[43.584296, 1.44182]}>
        <Popup>
          <span>My awesome store is HERE!</span>
        </Popup>
      </Marker>
    </Map>
  </div>
);
// ...
```

With that, you should see the map appear in your homepage.

<blockquote class="important">
  **Important:** if you detect issues with remote assets (images, CSS…) not being loaded, you may have to update your <abbr title="Content Security Policy">CSP</abbr> headers to allow new domains. You could achieve this by modifying your [`config/website.js`'s `contentSecurityPolicy` key](/docs/reference/configurations.html#config-website-js).
</blockquote>

### Extracting our new component

Having the map in the Home component could be fine for a time, but if there are many
other features in the `Home`, it becomes hard to maintain. So when the Home becomes
big enough, we extract the Store Locator into its own module component.

To do so, we will reuse the exact same component but move it into its own module
in `my-module/theme/modules`.

```js
// my-module/theme/modules/StoreLocator/StoreLocator.js

import React from "react";
import PropTypes from "prop-types";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";

const StoreLocator = props => {
  return (
    <Map
      center={[43.584296, 1.44182]}
      zoom={14}
      style={{ height: "600px", width: "800px" }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[43.584296, 1.44182]}>
        <Popup>
          <span>My awesome store is HERE!</span>
        </Popup>
      </Marker>
    </Map>
  );
};

StoreLocator.propTypes = {};

export default StoreLocator;
```

In order to make it consistent with other components in the application, we
will add two more files:

- `my-module/web/theme/modules/StoreLocator/index.js`: will proxy the `StoreLocator.js`
  file in order to be able to do imports on the folder directly. See [this blog post](http://bradfrost.com/blog/post/this-or-that-component-names-index-js-or-component-js/)
  for more context about this pattern.

```js
// my-module/web/theme/modules/StoreLocator/index.js

import StoreLocator from "./StoreLocator";

export default StoreLocator;
```

- `my-module/web/theme/modules/StoreLocator/StoreLocator.story.js`:
  will add a story to the Storybook of your application. This will serve as living
  documentation and will allow anyone to understand what is StoreLocator used for and how
  to use it.

```jsx
// my-module/web/theme/modules/StoreLocator/StoreLocator.story.js

import StoreLocator from "./StoreLocator.js";
import { storiesOf } from "@storybook/react";

storiesOf("modules.StoreLocator", module).add("default", () => {
  return <StoreLocator />;
});
```

<blockquote class="note">
  We won't focus on the story in this guide. But you can refer to the
  [Storybook guide](/docs/essentials/add-component-to-storybook.html) to learn how to add any kind of stories
  to your Storybook.
</blockquote>

### Fetching our data

Hardcoded values are perfectly fine. But if the coordinates change overtime,
it might be a good idea to fetch them dynamically. This is what we will do
in this example.

Here, we have to introduce a new concept we use in Front-Commerce:
**Enhancers**. In this specific case, the Enhancer will be responsible for
fetching the data from our **GraphQL schema**, transform the data and feed it to
the StoreLocator component.

But the **Enhancers** are not meant to only be _data fetchers_, they contain
most of the **Business logic** of our application, we use the
[Higher-Order Components pattern (HOC)](https://reactjs.org/docs/higher-order-components.html)
to create them.

<blockquote class="note">
In Front-Commerce, we use a react library:
[Recompose](https://github.com/acdlite/recompose) to handle composition of
**HOC**, it provides a lot of helpers which are really useful to _enrich_ our
components.
</blockquote>

Thus, to fetch our data from GraphQL, we are going to create an **Enhancer** for
our store locator. it will be responsible of fetching and transforming the store
information to match our needs.

```js
// my-module/theme/modules/StoreLocator/EnhanceStoreLocator.js;

import { graphql } from "react-apollo";

export default ({ StoreLocatorQuery }) =>
  graphql(StoreLocatorQuery, {
    props: ({ data }) => ({
      loading: data.loading,
      error: data.error,
      store: data.loading ? null : data.store
    })
  });
```

Here, we are using the `graphql` function which allows us to fetch data in our
graphQL schema.

You can find all the available `graphql` options in the
[**React Apollo** documentation](https://www.apollographql.com/docs/react/api/react-apollo.html)

In our case, it takes two arguments:

- the first one is the **Query** we need to fetch (we will handle this part
  soon)
- the `props` property in the second parameter to compute the **Query**
  result `data` to `loading`, `error` and `store` properties that will
  be used in the enhanced component.

As you can see, our Enhancer needs a **Query** (`StoreLocatorQuery`). This is
a `.gql` file that use the **GraphQL** syntax. In our case, it will look like:

```graphql
// my-module/theme/modules/StoreLocator/StoreLocatorQuery.gql

query StoreLocator {
  store {
    name
    phone
    owner {
      email
    }
    coordinates {
      longitude
      latitude
    }
  }
}
```

To better understand and test your schema, you can use **GraphQL Playground**.
It is a web interface for GraphQL, similar to what PhpMyAdmin is for MySQL.

<blockquote class="note">
<p>You may think that some queries are already launched in our `EnhanceHome`
and that splitting the StoreLocatorQuery from them is inefficient. But
`react-apollo` will handle that for you. It will batch the requests to avoid too
many network rountrips. This allows us to only think about what a component needs.
The responsibility for the retrieval of its data lies with it and it allows us
to use it anywhere.</p>

<p>However, if it is important in your case to fuse your queries, you may be
interested by the concept of
[`Fragments` in GraphQL](https://www.apollographql.com/docs/react/advanced/fragments.html).
It allows you to split part of your queries without splitting the end query.</p>
</blockquote>

### Making it dynamic

Now that we have our Enhancer ready, we are going to use it in our store
locator. The major change here is that your data come from your Enhancer and
is passed down to your component by `props`.

But when dealing with asynchronous resources like fetching data from the backend,
you have to handle the loading state and error state. Here we we will show
a simple message such as "Loading..." or "Oops, an error occurred." to the
user. But in a real life application, you would want to show better messages
depending on your context.

<blockquote class="note">
For error handling, you could take a look at
[Error Boundaries](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html).
<!-- TODO link to our own error boundary component -->
</blockquote>

```js
// my-module/theme/modules/StoreLocator/StoreLocator.js;

import React from "react";
import PropTypes from "prop-types";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import StoreLocatorQuery from "./StoreLocatorQuery.gql";
import EnhanceStoreLocator from "./EnhanceStoreLocator";

const StoreLocator = props => {
  if (props.loading) {
    return <div>Loading...</div>;
  }
  if (props.error) {
    return <div>Oops, an error occurred.</div>;
  }

  const coordinates = [
    props.store.coordinates.longitude,
    props.store.coordinates.latitude
  ];
  const defaultZoom = 14;

  return (
    <div>
      <Map
        center={coordinates}
        zoom={defaultZoom}
        style={{ height: "600px", width: "800px" }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <div>
              My awesome store ─ {props.store.name}
              Email: {props.store.owner.email}
              Phone: {props.store.phone}
            </div>
          </Popup>
        </Marker>
      </Map>
    </div>
  );
};

StoreLocator.propTypes = {
  loading: PropTypes.bool.isRequired,
  store: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      email: PropTypes.string.isRequired
    }).isRequired,
    coordinates: PropTypes.shape({
      longitude: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired
    }).isRequired
  })
};

// Let's not forget to use the Enhancer
export default EnhanceStoreLocator({ StoreLocatorQuery })(StoreLocator);
```

<blockquote class="note">
About **PropTypes**: they allow us to validate the props passed to a child
component, this will log explicit errors if you pass invalid props in dev mode.
This will also serve as documentation for other developers in your team. They may
be a little verbose, but maintaining them will help you in the long run.
</blockquote>

## Using it in our App

We now have extracted all the store locator logic. We can now use our
brand new and shiny module component within the homepage.

```js
// my-module/theme/pages/Home/Home.js;
// ...
import StoreLocator from "theme/modules/StoreLocator";

const Home = ({ store }) => (
  <div className="page page--home">
    {/* ... */}
    <StoreLocator />
  </div>
);
```

As you can see, we did not use a relative import. This is because in
Front-Commerce we have a few aliases that will let you import files without
worrying about your current position in the folder structure.

In our case, the `Home` component being in
`my-module/web/theme/pages/Home/Home.js`, we do not have to import the
`StoreLocator` by using relative paths `../../modules/StoreLocator` but we
can remain with `theme/modules/StoreLocator` which is more explicit. This
is possible for any file located in the folder `web/theme` of a module.

And it works! You now have a clean `Home` page component that uses a Business
component which could be used anywhere in your application (About us,
Contact, etc.).

<blockquote class="note">
**Going further:** The store locator we just created is very simple and it
has a very limited Business impact. The store locator module does not need
to know the implementation of the map itself (like the fact of using
`react-leaflet`). So a map component could be extracted in a **UI** component.
But for the sake of this guide, we kept it simple.
</blockquote>

As a final note, please keep in mind that splitting code is a difficult task.
It needs practice and refinement. But it is also a pretty personal point of
view. Thus one team could split code differently. In this guide we have made a
choice but feel free to make yours.

In any case, we advice you to not overcomplicate things and find a method
that matches your needs.
