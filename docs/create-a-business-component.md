---
id: create-a-business-component
title: Create a Business Component
---

In Front Commerce we have separated our components in two categories: the **UI**
components available in the `ui` folder, and the **Business** components
available in the `modules` and `pages` folders.

> If you feel the need to understand why we went for this organization, feel
> free to refer to [React components structure](react-components-structure.md)
> first.

In this section, we will build a **Business Component**. If you have already
gone through the [Create an UI component](create-a-ui-component.md), the core
concept is the same.

## What is a Business component

A Business component will be located in the `src/theme/modules` directory. Those
components are not meant to be reused a lot in your application, they are built
with a **very specific use in mind**. When creating a custom theme, they will
naturally emerge from your Pages components.

To illustrate this, imagine that you are building the homepage for your store.
You add a big hero image on top, some products' listings for news and sales, a
reinsurance banner, etc.

Quickly, you will want to **extract** some components from your page to avoid a
_big bloated file_. Some of those components will be extracted as **reusable UI
components** but some are very specific to your page and there is no reason to
put them in the ui folder.

> They are often a mix between UI components and custom layout. They may be
> split in multiples components if they are big enough.

Generally, they are related to **your business** and often need backend data
like CMS content or store information. We refer to them as **Business
components** or even **modules**.

> Unlike UI components, Business ones are often _smart_ and contain logic. We
> try to extract this logic in **Enhancers**, more on that later.

## What are we going to build

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
position of our store within OpenStreetMap.

This is one of the biggest advantages of using React to build our front-end, we
have access to this huge ecosystem.

So we just install the two required packages:

```sh
npm install react-leaflet leaflet`
```

### Our new Homepage

We don't need to anticipate every **UI** or **Business** component in your
application. When your component will begin to get bigger, the need to extract
some of them will come naturally.

To illustrate this point, we are going to create the first version of our map
into the homepage with hardcoded values for the store coordinates, we will fetch
them later from the backend.

Then we will extract it into its own module and finally we are going to fetch
the required data from the **GraphQL schema**.

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

With that, you should see the map appear in your homepage.

### Extracting our new component

Having the map in the Home component could be fine for a time, but we don't want
to maintain big bloated components, so we are going to extract it to its own
Module.

To do so, we will reuse the exact same component but move it into its own module
in `src/theme/modules`.

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
These are not mandatory but our imports will be much cleaner with that. For
example, we can do `import StoreLocator from "theme/modules/StoreLocator`
instead of `import StoreLocator from "theme/modules/StoreLocator/StoreLocator`

```js
// src/theme/modules/StoreLocator/index.js;

import StoreLocator from "./StoreLocator";

export default StoreLocator;
```

### Fetching our data

Here, we have to introduce a new concept we use in Front-Commerce:
**Enhancers**. In this specific case, the Enhancer will be responsible for
fetching the data from our **GraphQL schema**, transform the data and feed it to
our component.

But the **Enhancers** are not meant to only be _data fetchers_, they contain
most of the **Business logic** of our application, we use the
[Higher-Order Components pattern (HOC)](https://reactjs.org/docs/higher-order-components.html)
to create them.

> In Front-Commerce, we use a react library:
> [Recompose](https://github.com/acdlite/recompose) to handle composition of
> **HOC**, it provides a lot of helpers which are really useful to _enrich_ our
> components.

Thus, to fetch our data from GraphQL, we are going to create an **Enhancer** for
our store locator. it will be responsible of fetching and transforming the store
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

Here, we are using the `graphql` function which allows us to fetch data in our
graphQL schema.

You can find all the available `graphql` options in the
[**React Apollo** documentation](https://www.apollographql.com/docs/react/api/react-apollo.html)

In our case, it takes two arguments:

- the first one is the **Query** we need to fetch (we will handle this part
  soon)
- we use the `props` property in the second parameter to compute the **Query**
  result `data` to a `loading` and a `store` properties.

As you can see, our Enhancer needs a **Query**, this a `.gql` (or `.graphql`)
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

To better understand and test your schema, you can use **GraphiQL**, it is a
GraphQL web interface for GraphQL, similar to what PhpMyAdmin is for MySQL. In
Front-Commerce Lite, we can access it at
[http://0.0.0.0:4000/graphiql](http://0.0.0.0:4000/graphiql).

> You may think that some of those data are already fetched in our `EnhanceHome`
> and thus, this is inefficient. But `react-apollo` will handle that for you and
> will group the requests to only make the necessary ones.  
> This allows us to only think about what a component needs. The responsibility for
> the retrieval of its data lies with it.

### Making it dynamic

Now that we have our Enhancer ready, we are going to use it in our store
locator. The major change here is the use of the data from the available props.

When dealing with asynchronous resources like fetching data from the backend,
you have to handle the loading state. Here we we will show a simple "Loading..."
message to the user, but in a real life application, you would want to show
placeholders or spinners.

> You should also handle error cases, but it is not the purpose of this guide.
> However if you want to learn more about it, you could look at
> [Error Boundaries](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html).

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

> A side note on **PropTypes**. The PropTypes allow us to validate the props
> passed to a child component, this will avoid breaking your app by passing
> invalid props.  
> This will also serve as documentation for other developers in your team. They may
> be a little verbose, but it is important to maintain them.

## Using it in our App

We now have extracted all the store locator logic. Now, we only have to use our
brand new and shiny module within the homepage.

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

> The store locator we just created is very simple and it has a very limited
> Business impact. The store locator module does not need to know the
> implementation of the map itself (like the fact of using `react-leaflet`). So
> a map component could be extracted in a **UI** component. But for the sake of
> this guide, we kept it simple.

Splitting code is a difficult task, it needs practice and refinement. But it is
also a pretty personnal point of view, thus one team could split code
differently.

We advice you to not overcomplicate things and find a method that match your
needs.
