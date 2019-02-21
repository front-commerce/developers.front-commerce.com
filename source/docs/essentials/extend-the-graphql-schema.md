---
id: extend-the-graphql-schema
title: Extend the GraphQL schema
---

When developing an e-commerce store, you might at some point need to expose new data in
your [unified GraphQL schema](https://principledgraphql.com/integrity#1-one-graph) to support new features and allow frontend developers to use them.


**Front-Commerce’s GraphQL modules** is the mechanism allowing to extend and override any part of the
schema defined by other modules. It leverages features from the GraphQL Schema Definition Language (<abbr title="Schema Definition Language">SDL</abbr>).

Front-Commerce’s core and platforms integrations (such as Magento2) are implemented as GraphQL modules too.

<blockquote class="info">
The concepts documented below have been adopted by many actors in the GraphQL ecosystem
since our initial implementation years ago.
On our road to 1.0.0, we have opened a <abbr title="Request For Comments">RFC</abbr> in [#44](https://gitlab.com/front-commerce/front-commerce/issues/44)
to discuss using an external library sharing the same principles instead of maintaining our
own implementation. **The migration path would be seamless if we chose to migrate to this library.**
Please do not hesitate to share your thoughts with us there.
</blockquote>

In order to extend the schema, you will have to:
1. create a new GraphQL module
2. register the GraphQL module in the Front-Commerce application
3. implement the GraphQL module itself using the API provided

## Create a new GraphQL module

Let’s say that we would like to expose a list of physical stores in our GraphQL
schema. We first have to create a `PhysicalStores` module.

To do so, create its definition as follow in the
`src/server/modules/physical-stores/index.js` file:

```js
export default {
  namespace: "PhysicalStores"
};
```

The module does nothing yet, but you can now register it in the application

## Register the module in the application

Front-Commerce allows you to manage your modules in the `serverModules` key of the [`.frontcommerce.js`](#TODO) file located in your project’s root.

Let’s add a `HelloWorld` module!

To add a new GraphQL module, add it to the existing list:

```diff
module.exports = {
  name: "Front-Commerce",
  url: "https://www.front-commerce.test",
  modules: ["./src"],
  serverModules: [
    { name: "FrontCommerceCore", path: "server/modules/front-commerce-core" },
-    { name: "Magento2", path: "server/modules/magento2" }
+    { name: "Magento2", path: "server/modules/magento2" },
+    { name: "HelloWorld", path: "./src/server/modules/hello-world" }
  ]
};
```

The `name` key must be unique across your server modules. It is a temporary name that is used during a code generation step and has no other usage in the application.

The `path` must be a path to your module definition file (see below).

<blockquote class="info">
**In depth:** under the hood, Front-Commerce is generating a `.front-commerce/modules.js` file from this configuration which is loaded very early in the server bootstrapping process. The name is used to import the correct module and export it in an homogeneous list, used by the `withGraphQLApi` express middleware.
</blockquote>


Congratulations! You now have a new custom module ready to enhance the data
exposed in the GraphQL middleware.

## Implement module’s features

A Front-Commerce GraphQL module has to export an object containing the different services it provides.

In the previous GraphQL module registration example, the module definition file would be located at
`src/server/modules/hello-world/index.js` with other module files in the same directory.

All the wiring is now done and it is time to develop the features of this
module. In GraphQL, a good practice is to start thinking about the schema first
from a business domain standpoint.

It is important to name things with a language shared by the team and prevent
exposing implementation details (ids, different names…) as much as possible. We
recommend the reading of the Graphql documentation page
[Thinking in Graphs](https://graphql.github.io/learn/thinking-in-graphs/).

Let’s add the code to expose physical stores in our graph.

### Define the schema

Front-Commerce contains all the tooling to allow you to describe your schema
using the expressive
[GraphQL Schema Definition Language (SDL)](https://www.prisma.io/blog/graphql-sdl-schema-definition-language-6755bcb9ce51/).

Create a `src/server/modules/physical-stores/schema.gql` file to contain the
schema matching our use case. It could look like so:

```gql
type Query {
  "Our physical stores"
  physicalStores: [PhysicalStore]
}

"General information about a physical store"
type PhysicalStore {
  address: PostalAddress
  openingHours: [OpeningHours]
}

"Postal address of a physical location"
type PostalAddress {
  street: String
  city: String
  postcode: String
  country: String
}

"Opening hours for a given day"
type OpeningHours {
  day: DayOfWeek
  openingTimes: [TimePeriod]
}

"Period of time within a day"
type TimePeriod {
  from: Time!
  to: Time!
}

"24h time definition"
type Time {
  h: Int!
  m: Int!
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}
```

Then expose the schema using the `typeDefs` key of the module definition. Update
the `src/server/modules/physical-stores/index.js` entrypoint:

```diff
+import typeDefs from "./schema.gql";
+
export default {
-  namespace: "PhysicalStores"
+  namespace: "PhysicalStores",
+  typeDefs: typeDefs
};
```

> Webpack is in fact taking care of converting SDL into a Javascript object
> using an appropriate loader.

**Congratulations again!** You should now be able to see these new types and
query them in GraphQL.

Try to execute the query below in Graph*i*QL:

```
{
  physicalStores {
    address {
      street
      city
      country
      postcode
    }
    coordinates {
      latitude
      longitude
    }
    openingHours {
      day
      openingTimes {
        from {
          h
          m
        }
        to {
          h
          m
        }
      }
    }
  }
}
```

Our GraphQL module does not yet have any code for sending content, so you must
see the following response:

```json
{
  "data": {
    "physicalStores": null
  }
}
```

Let’s now add some executable logic to our module.

### Implement resolvers

The GraphQL middleware relies on resolver functions to determine the data to
return for a given field. This is where most of the « real work » is done, for
instance by fetching remote datasources or transforming data.

Resolvers are exposed using the `resolvers` key of the module definition. It
should be a « resolver map »: an object where each key is a GraphQL type name,
and values are mapping between field names and resolver function. Resolver
functions may return a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
for asynchronous operations.

> To know more about resolvers and their internals, we recommend the reading of
> [GraphQL Tools documentation](https://www.apollographql.com/docs/graphql-tools/resolvers).

First, update the `src/server/modules/physical-stores/index.js` module
definition as follow:

```diff
import typeDefs from "./schema.gql";
+import resolvers from "./resolvers";

export default {
  namespace: "PhysicalStores",
-  typeDefs: typeDefs
+  typeDefs: typeDefs,
+  resolvers: resolvers
};
```

And then create the `src/server/modules/physical-stores/resolvers.js` file with
a resolver map as below (we are going to analyze it in details in a few
seconds):

```js
import axios from "axios";

export default {
  Query: {
    physicalStores: () => findAllStores()
  },

  PhysicalStore: {
    coordinates: store => ({
      latitude: store.lat,
      longitude: store.lon
    }),
    openingHours: () => generalOpeningHours
  },

  Time: {
    h: time => time.split(":")[0],
    m: time => time.split(":")[1]
  },

  PostalAddress: {
    street: address => address.road
  }
};

const findAllStores = () =>
  axios
    .get("https://nominatim.openstreetmap.org/", {
      params: {
        format: "json",
        countrycodes: "fr",
        addressdetails: 1,
        q: "foot locker", // for instance…
        limit: 10
      }
    })
    .then(response => response.data);

const generalOpeningHours = [
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
].map(dayOfWeek => ({
  day: dayOfWeek,
  openingTimes: [{ from: "9:00", to: "12:30" }, { from: "14:00", to: "20:00" }]
}));
```

Let’s analyze this code part by part to understand what is possible to achieve
in a module.

First of all, the exported resolver map contains a top-level query named
`physicalStores`. This is not necessary (a module might as well extend existing
types) and we recommend to try limiting as much as possible the number of
top-level queries in your projects.

```js
export default {
  Query: {
    physicalStores: () => findAllStores()
  }
  // …
};
```

The resolver function is pretty straightforward and needs no parameters: it will
fetch all stores from a remote service (do not worry about the implementation
yet) and return the data asynchronously using a Promise.

The promise will resolve to a list of results matching the following format
([view in your browser](https://nominatim.openstreetmap.org/?format=json&countrycodes=fr&addressdetails=1&q=foot%20locker&limit=10)):

```json
[
  {
    "place_id": "17302207",
    "licence":
      "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "node",
    "osm_id": "1528672001",
    "boundingbox": ["48.858632", "48.858732", "2.347088", "2.347188"],
    "lat": "48.858682",
    "lon": "2.347138",
    "display_name":
      "Foot locker, Rue de Rivoli, 1st Arrondissement, Paris, 75001, France",
    "class": "shop",
    "type": "shoes",
    "importance": 0.20025,
    "address": {
      "shoes": "Foot locker",
      "road": "Rue de Rivoli",
      "neighbourhood": "Quartier des Halles",
      "suburb": "Quartier Les Halles",
      "city_district": "1st Arrondissement",
      "city": "Paris",
      "county": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "postcode": "75001",
      "country_code": "fr"
    }
  }
  // …
]
```

The schema defined earlier specified that `physicalStores` will return a list of
`PhysicalStore` objects, which do not match the format returned by the remote
service so far.

```
type Query {
  "Our physical stores"
  physicalStores: [PhysicalStore]
}
```

In this implementation, we chose to use resolvers for converting data from the
remote service into an object matching the `PhysicalStore` type definition. This
time, by adding a resolver for each of its two fields:

```js
export default {
  // …
  PhysicalStore: {
    coordinates: store => ({
      latitude: store.lat,
      longitude: store.lon
    }),
    openingHours: () => generalOpeningHours
  }
  // …
};
```

The `coordinates` field is resolved by using the initial `store` information
(first argument) and converting them into a structure matching our Schema. With
simplification in mind, we implemented `openingHours` field resolution in a
naive way: by supposing that all stores shared the same established opening
hours (defined in the `generalOpeningHours` constant).

> One may combine these two approaches to fetch openingHours from another
> service, using for instance the `place_id` to access a REST detail endpoint.
> It could be a good thing to try if you want to experiment and start grasping
> the power behind a GraphQL middleware in your architecture!

You might now be able to understand the rest of this resolver map, which consist
of data transformation for the `PostalAddress.street` field (data returned by
the remote service match the `PostalAddress` type definition for the other
fields) and `Time` representations.

```js
export default {
  // …
  Time: {
    h: time => time.split(":")[0],
    m: time => time.split(":")[1]
  },

  PostalAddress: {
    street: address => address.road
  }
};
```

> ProTip™: you can debug the data passed in a resolver using `console.log` to
> view its shape in your server console shell output. To do so, a convenient
> thing to know is that `console.log` returns a falsy value. Hence, in the
> resolver above you could debug the `time` param by updating the resolver as
> below:
>
> `h: time => console.log(time) || time.split(":")[0],`

### Make it scale!

See ………