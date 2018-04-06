---
id: create-a-business-component
title: Create a Business Component
---

In Front Commerce we have seperated our components in two categories: the **UI**
components available in the `ui` folders, and the **Business** components
available in the `modules` and `pages` folders.

> If you feel the need to understand why we went for this organization, feel
> free to refer to the [components history page](#TODO-lien-history) first.

In this section, we will build a Business Component. If you have already gone
through the [Create an UI component](#TODO-lien-create-ui-component), the core
concept is the same.

## What is a Business component

A **Business** component will reside in the `src/theme/modules` directory. Those
components are not meant to be reused a lot in your application, they are build
with a very specific use in mind. When creating a custom theme, they will
naturally emerge from your Pages components.

To illustrate this, Imagine that you are building the homepage for your store.
You add a big hero image on top, some products's listings for news and sales, a
reinsurance banner, etc.

Quickly, you will want to extract some components from your page to avoid a big
bloated file. Some of those components will be extracted as reusable **UI**
components but some are just very specific to your page and there is no much
sense to put them in the **ui** folder.

We put those components in the `src/theme/modules` directory. Generally, they
are linked to your **Business** and often needs backend data like CMS content or
store information. We refer to them as **Business components** or even
**modules**.

> Modules are oftem a mix between **UI** components and custom layout. They may
> be splitted in multiples components if they are big enough. Opposed to the
> Unlike **UI** components, **Business** ones are often _smart_ and contain
> logic. We try to extract this logic in **Enhancers**, more on that later.

## What are we going to build

To explain the concept and the emergeance of modules, we will now add a store
locator to our home page and see how to extract it properly as a module.

Before diving into the code, we have to introduce a new concept: **Enhancers**.
In this case, it will be responsible to fetch the data from our **GraphQL
schema**, transform the data and feed it to our component.

The **Enhancers** are not means to be only data fetchers, in Front-Commerce
contain most of the **Business logic** of our application, we use the
[Higher-Order Components pattern (HOC)](https://reactjs.org/docs/higher-order-components.html)
to create them.

> We use a react library: [Recompose](https://github.com/acdlite/recompose) to
> handle composition of **HOC**, it provides a lots of helpers which are really
> usefull to **enrich** our components.

In the following steps, we are going to build our store locator.

### Installing the dependencies

To create the map, we are going to use the `react-leaflet` package. It is a
simple component which will allow us to display OpenStreetMap easely.

This is one of the biggest advantage of using React to build our front-end, we
have access to this huge ecosystem.

So we just install the two required packages :

```sh
npm install react-leaflet leaflet`
```

### Our new Homepage

You don't need to anticipate every **UI** or **Business** components in your
application. When your component will begin to get bigger, the need to extract
some of them will come naturally.

To illustrate this point, we are going to first add a hardcoded version of our
map into the homepage. Then we will extract it into its own module and finally
we are going to fetch the required data from the **GraphQl schema**.

Our first working version will look like:

```js
// src/theme/pages/Home/Home.js;

//... Existing imports
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";

const Home = ({ store }) => (
  <div className="page page--home">
    //... The rest of the homepage
    <Map
      center={[43.584296, 1.44182]}
      zoom={14}
      style={{ height: "600px", width: "800px" }}
    >
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
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

With that, you should see the map appears in your homepage.

### Extracting our new component

Having the map in the Home component could be fine for a time, but we don't want
to maintain big bloated components, so we are going to extract it to its own
Module.

For it is exactly the same as before, we juste moved it to the
`src/theme/modules` directory.

```js
// src/theme/modules/StoreLocator/StoreLocator.js

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
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
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

To allow import on the folder directly, we use those index files as proxies.
There are not mandatory but your imports will be much cleaner with that.

```js
// src/theme/modules/StoreLocator/index.js;

import StoreLocator from "./StoreLocator";

export default StoreLocator;
```

### Enhancer

Now we have to fetch our data from graphQL. For this we are going to create an
**Enhancer**. it will be responsible to fetch and transform the store
information to match our needs.

```js
// src/theme/modules/StoreLocator/EnhanceStoreLocator.js;

import { graphql } from "react-apollo";

export default StoreLocatorQuery =>
  graphql(StoreLocatorQuery, {
    props: ({ data }) => ({
      loading: data.loading,
      store: data.loading ? null : data.store
    })
  });
```

Here, we are using the `graphql` function which allow us to fetch data in our
graphQL schema. It have two arguments, the first one is the **Query** we need to
fetch (we will handle this part soon), in the second, we use the `props`
property in the second parameter to compute the **Query** result `data` to a
`loading` and a `store` properties.

You can find all the available `graphql` options in the
[**React Apollo** documentation](https://www.apollographql.com/docs/react/api/react-apollo.html)

As you can see, our Enhancer need a **Query**, this a `.gql` (or `.graphql`)
file that use the **GraphQL** syntax. In our case, it will look like:

```gql
// src/theme/modules/StoreLocator/StoreLocatorQuery.gql

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

### Making it dynamic

Now that we have an Enhancer ready, we are going to use it in our StoreLocator.
The major change here is the use of the data from the available props.

When dealing with asynchronous resources like fetching data from the backend,
you have to handle the loading state. Here we just show a simple `Loading..` to
the user, but in a real life application, you would want to show placeholders or
spinners.

> You should also handle error cases, but it is not the purpose of this guide.
> Just know that you could use
> [Error Boundaries](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)
> for that.

```js
// src/theme/modules/StoreLocator/StoreLocator.js;

import React from "react";
import PropTypes from "prop-types";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import StoreLocatoreQuery from "./StoreLocatorQuery.gql";
import EnhanceStoreLocator from "./EnhanceStoreLocator";

const StoreLocator = props => {
  if (props.loading) {
    return <div>Loading...</div>;
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
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
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

export default EnhanceStoreLocator(StoreLocatoreQuery)(StoreLocator);
```

> A side note on **Protypes**. The Proptypes allow us to validate the props
> passed to a child component, this will avoid breaking your app passing invalid
> props. This will also serve as a props documentation for the other developers
> in your team. They may be a little verbose, but it is important to maintain
> them updated.

## Using it in our App

We now have all the required pieces, to finish, we just have to import our brand
new shiny module and use it in the home page.

```js
// src/theme/pages/Home/Home.js;
//...
import StoreLocator from "../../modules/StoreLocator";

const Home = ({ store }) => (
  <div className="page page--home">
    //...
    <StoreLocator />
  </div>
);
```
