---
id: extend-graphql-schema
title: Extend the GraphQL Schema
---

How to extend the existing GraphQL Schema?

You might at some point need to expose new data in your GraphQL endpoint, to
support new features. Front-Commerce allows you to extend and override any part
of the initial schema by leveraging features from the GraphQL Schema Definition
Language (<abbr title="Schema Definition Language">SDL</abbr>).

This can be achieved by creating and registering your own custom « modules » on
the server. Front-Commerce Lite uses [GrAMPS](https://gramps.js.org/)
datasources, and Front-Commerce uses a similar approach with additional
features.

## Adding a custom module

Let’s say that we would like to expose a list of physical stores in our GraphQL
schema. We first have to create a `PhysicalStores` module.

To do so, create its definition as follow in the
`src/server/modules/physical-stores/index.js` file:

```js
export default {
  namespace: "PhysicalStores"
};
```

The module does nothing yet, but you can now register it in the application by
updating `src/server/modules.js` as follow:

```diff
import StoreInformation from "./modules/store-information";
+import PhysicalStores from "./modules/physical-stores";

export default [
  // In a real Front-Commerce application you could load core modules
  // on demand right here, and select the parts you need for your current
  // project.
  // This is where you could combine several core datasources to build
  // the project that match your needs and run away from a monolithic
  // architecture when it is not relevant

-  StoreInformation
+  StoreInformation,
+  PhysicalStores
];
```

Congratulations! You now have a new custom module ready to enhance the data
exposed in the GraphQL middleware.

## Extend the GraphQL schema

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
      "Foot locker, Rue de Rivoli, Quartier des Halles, Quartier Les Halles, 1st Arrondissement, Paris, Ile-de-France, Metropolitan France, 75001, France",
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

### Refactor to context and loaders

We have not analyzed yet the `generalOpeningHours` constant and `findAllStores`
function called by resolvers, for a simple reason: it is not really relevant to
understand how Front-Commerce works.

This part of the code is pure EcmaScript and is agnostic to the
library/framework/otherTrendyThing used. It means that if you have a legacy node
codebase you may be able to reuse some of your code, and if you want to abandon
GraphQL or Front-Commerce you could still use this code.

For this reason **we recommend to keep as much as your code in pure EcmaScript
and reduce dependencies to external libraries there.**

Front-Commerce leverages GraphQL’s context to allow a module to initialize what
we call « loaders » and make them available for resolvers.

> In this example the loader is very simple, but this pattern can scale well
> with more complex use cases (remote authentication, several remote sources…).
> We recommend you to experiment with them by trying to prototype interactions
> with your current systems

Let’s start the refactoring by extracting the « pure EcmaScript » code from
`src/server/modules/physical-stores/resolvers.js` to a separate
`src/server/modules/physical-stores/loader.js` file:

```diff
- import axios from "axios";
-
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
-
- const findAllStores = () =>
-   axios
-     .get("https://nominatim.openstreetmap.org/", {
-       params: {
-         format: "json",
-         countrycodes: "fr",
-         addressdetails: 1,
-         q: "foot locker", // for instance…
-         limit: 10
-       }
-     })
-     .then(response => response.data);
-
- const generalOpeningHours = [
-   "TUESDAY",
-   "WEDNESDAY",
-   "THURSDAY",
-   "FRIDAY",
-   "SATURDAY"
- ].map(dayOfWeek => ({
-   day: dayOfWeek,
-   openingTimes: [{ from: "9:00", to: "12:30" }, { from: "14:00", to: "20:00" }]
- }));
```

```js
// src/server/modules/physical-stores/loader.js
import axios from "axios";

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

export default {
  findAllStores: findAllStores,
  getGeneralOpeningHours: () => generalOpeningHours
};
```

Then, update the module definition to register this new loader as part of your
module resolver’s context:

```diff
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";
+import loader from "./loader";

export default {
  namespace: "PhysicalStores",
  typeDefs: typeDefs,
-  resolvers: resolvers
+  resolvers: resolvers,
+  context: loader
};
```

Finally, update the resolvers to use the loader instance injected using
GraphQL’s context:

```diff
export default {
  Query: {
-    physicalStores: () => findAllStores()
+    physicalStores: (_, __, context) => context.findAllStores()
  },

  PhysicalStore: {
    coordinates: store => ({
      latitude: store.lat,
      longitude: store.lon
    }),
-    openingHours: () => generalOpeningHours
+    openingHours: (_, __, context) => context.getGeneralOpeningHours()
  },
```

> **Front-Commerce:** if we were to use the paid version, loaders would have a
> slightly different ways to be build in order to leverage advanced features
> useful in production: dependency management / injection, configuration,
> caching / cache invalidation…
>
> _An advanced documentation is coming soon to cover this topic in depth._

## Conclusion

Congratulations! By understanding this simple example you now have all the
knowledge needed to create your own GraphQL modules.

This is the reason why developers love Front-Commerce: **the GraphQL modular
middleware makes it very easy to extend and customize Front-Commerce default
features.** One can write an integration for existing remote services and makes
it available for frontend developers in a fraction of the time it took them with
other solutions.

We now recommend you to start experimenting with your existing services! Then,
you could learn how to display these new GraphQL data in Front-Commerce by
[creating business components](create-a-business-component.md).
