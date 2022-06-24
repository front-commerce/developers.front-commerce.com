---
id: resolver-cache
title: Cache Prismic Resolvers
---

The `PrismicCachedResolver` is a decorator for a resolver that returns Prismic Content, the resolver allows us to serialize and deserialize the cached data with the [defineContentTransformers](/docs/prismic/expose-content.html#defineContentTransformers-typeIdentifier-options).

In order to create references from prismic to the cached documents, we need to ensure that the `PrismicCachedResolver` receives a [Content](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/loaders/Content.js) type from your resolver. The resolver can either cache a `singleton` Content, or a `list` of Content.

## Resolver Cache API

#### `PrismicCachedResolver(resolver[, options])`

Returns a resolver that caches the result of the given resolver.

**Arguments:**

- `resolver`: A [custom resolver](/docs/advanced/graphql/change-resolver-behavior.html#Implement-your-custom-resolver-logic) that returns a `Content` or an array of `Content`,
- `options` : An object with the following properties:
  - `mapParamsToId` A function that maps the resolver parameters to a unique id.
  - `contentProperty` The name of the property that contains the [Content](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/loaders/Content.js).

## Usage

To use the `PrismicCachedResolver` you need to import it into your `resolvers.js` and wrap your resolver with decorator.

```js
// my-module/resolvers.js
import PrismicCachedResolver from "prismic/server/modules/prismic/core/cache/PrismicCachedResolver";

export default {
  Query: {
    resolver: PrismicCachedResolver((_, __, { loaders }) =>
      loaders.MyModule.loadAll()
    ),
  },
};
```

### Singleton Content

This is the most simple usecase. The `PrismicCachedResolver` will cache a singleton Content.

So let's say we want to cache a resolver that loads a single Faq entry, we can simply decorate our original resolver

```js
import PrismicCachedResolver from "prismic/server/modules/prismic/core/cache/PrismicCachedResolver";

export default {
  Query: {
    faqEntry: PrismicCachedResolver((source, { slug }, { loaders }) => {
      return loaders.FaqLoader.loadBySlug(slug); // returns Promise<Content>
    }),
  },
};
```

Now the **faqEntry** resolver will always load the same cached faq entry.

To avoid this issue, map the `slug` parameter to the cache key, by passing the `mapParamsToId` option to the `PrismicCachedResolver`.

```diff
import PrismicCachedResolver from "prismic/server/modules/prismic/core/cache/PrismicCachedResolver";

export default {
  Query: {
-    faqEntry: PrismicCachedResolver((source, {slug}, {loaders}) =>{
-      return loaders.FaqLoader.loadBySlug(slug);
-    }),
+    faqEntry: PrismicCachedResolver((source, {slug}, {loaders}) =>{
+      return loaders.FaqLoader.loadBySlug(slug);
+    }, {
+      mapParamsToId: (_, { slug }) => slug,
+    }),
  },
};
```

### List Content

When caching a list of Content we expect to receive an Array containing the Content.

```js
import PrismicCachedResolver from "prismic/server/modules/prismic/core/cache/PrismicCachedResolver";

export default {
  Query: {
    faqList: PrismicCachedResolver((_, __, { loaders }) => {
      return ctx.loaders.FaqLoader.loadAll(); // returns Promise<Content[]>
    }),
  },
};
```

You can also define a `contentProperty`, this is for a more advanced usecase, where you want to return an object with a property containing the Content array, for example with pagination

```js
import PrismicCachedResolver from "prismic/server/modules/prismic/core/cache/PrismicCachedResolver";

export default {
  Query: {
    faqList: PrismicCachedResolver(
      (_, __, { loaders }) => {
        // returns Promise<{
        //    list: [Content, Content],
        //    total: 10
        // }>
        return ctx.loaders.FaqLoader.loadAll();
      },
      {
        contentProperty: "list",
      }
    ),
  },
};
```

<blockquote class="info">
  **ProTip:** `contentProperty` can also be used with `singleton` Content.
</blockquote>

### Advanced Usecase

What if we want to manipulate the data after it is retrieved either from the cache or the resolver?

In the end the `PrismicCachedResolver` is a resolver like any other, so you can call it at any time within a resolver, but it is important though that the resolver parameters are propogated to the `PrismicCachedResolver`.

```js
import PrismicCachedResolver from "prismic/server/modules/prismic/core/cache/PrismicCachedResolver";

export default {
  Query: {
    faqList: async (...params) => {
      const list = await PrismicCachedResolver((_, __, { loaders }) => {
        return ctx.loaders.FaqLoader.loadAll(); // returns Promise<Content[]>
      })(...params); // propogate the params to `PrismicCachedResolver`

      if (!list) {
        return null;
      }

      return {
        list,
        total: list.length,
      };
    },
    faqEntry: async (...params) => {
      const [source, { slug }, { loaders }] = params; // we can also reuse the params from the current resolver
      const entry = await PrismicCachedResolver(
        () => {
          return loaders.FaqLoader.loadBySlug(slug); // returns Promise<Content>
        },
        {
          mapParamsToId: () => slug,
        }
      )(...params);

      if (!entry) {
        return null;
      }

      return entry;
    },
  },
};
```
