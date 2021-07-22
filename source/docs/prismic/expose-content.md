---
id: expose-content
title: Expose Prismic Content
---

The Prismic Front-Commerce module provides a loader and the infrastructure to expose Prismic based Content in Front-Commerce's GraphQL API.

## Prerequisites

To benefit from this API, you first need to [install the Prismic module](/docs/prismic/installation.html). You will also need [a custom GraphQL module](/docs/essentials/extend-the-graphql-schema.html) to define a GraphQL schema matching the content you want to expose and implement the corresponding resolver. It also recommended to have read [the Prismic Core Concepts documentation](https://prismic.io/docs/core-concepts).

## Prismic loader API

### Methods to query content

The Prismic loader has the following API to request Content from Prismic:

* `loadSingle(typeIdentifier[, options])` returns [an object of type `Content`](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/loaders/Content.js) or throws an error if no such Content exists.
* `loadByUID(typeIdentifier, uid[, options])` returns a `Content` representing a Prismic Content of [the corresponding type](https://prismic.io/docs/core-concepts/custom-types) and having [an UID field](https://prismic.io/docs/core-concepts/uid) with the given value. If such Content does not exist, it throws an error.
* `loadList(query[, options])` returns [a `ContentList`](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/loaders/ContentList.js) matching the query. `query` must be an instance of [`ListQuery`](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/loaders/ListQuery.js), it provides a way to filter, sort and paginate Prismic Content.

### Field Transformers

By default, the `Content` objects returned by those methods directly expose the fields defined in the corresponding Prismic Custom Type. For instance if you are retrieving a Content of type `homepage` and [this Custom Type is single](https://prismic.io/docs/core-concepts/custom-types#difference-between-single-and-repeatable) and defines a `lastUpdate` field, you can write something like:

```js
const homepage = await loaders.Prismic.loadSingle("homepage");
// homepage is an instance of Content
// the lastUpdate field can be used directly,
// it's value is the field value returned by the Prismic API
console.log("Last update of my homepage", homepage.lastUpdate);
```

For most Field Types, the field value can directly be used. However for some of them, the field value is not very handy to expose the data in the Graph or even requires a deep transformation. To make that operation easier, the Prismic loader also exposes some Field Transformers to transform field values. Instances of the transformers can be passed to `loadSingle`, `loadByUID` and `loadList` to transform the loaded Prismic Content. In the previous example, if the `lastUpdate` field is [a Date Field](https://prismic.io/docs/core-concepts/date), `homepage.lastUpdate` will be a string. If instead you want to have a JavaScript `Date` instance as the field value, you can configure `loadSingle` to transform it:

```js
const { DateTransformer } = loaders.Prismic.transformers;
const homepage = await loaders.Prismic.loadSingle("homepage", {
  fieldTransformers: {
    lastUpdate: new DateTransformer(),
  }
});
// homepage.lastUpdate is now a Date object
console.log("Last update of my homepage", homepage.lastUpdate);
```

The complete list of available Transformers can be found under [the `transformers` directory in Prismic module](https://gitlab.com/front-commerce/front-commerce-prismic/-/tree/main/prismic/server/modules/prismic/core/loaders/transformers). We will use some of them in the following examples.

## Implementation examples

Those examples assume that you have created [a GraphQL module](https://developers.front-commerce.com/docs/essentials/extend-the-graphql-schema.html#Create-a-new-GraphQL-module) and that it is already registered. Before being able to use the Prismic module API, you have to make sure `Prismic/Core` is a dependency of your module. In addition, we will use the Wysiwyg feature provided by `Front-Commerce/Wysiwyg`, so this one also needs to be in the dependencies:

```diff
import typeDefs from "./schema.gql";
import resolvers from "./resolvers";

export default {
  namespace: "MyModule",
-  dependencies: [],
+  dependencies: ["Prismic/Core", "Front-Commerce/Wysiwyg"],
  typeDefs,
  resolvers,
}
```

### Expose a Homepage in the Graph

#### Define the schema

Let's assume you have created a Single Custom Type _Homepage_ whose identifier is `homepage`. This Custom Type has three fields:

* `title` of type Title
* `image` of type Image
* `text` of type Rich Text

While not mandatory, the best way to expose the Homepage in the Graph is to model the GraphQL type after the Custom Type. So in `schema.gql`, you can add:

```graphql
type Homepage {
  title: String
  image: String
  text: DefaultWysiwyg
}

extend type Query {
  homepage: Homepage
}
```

#### Implement the resolver

Once you have defined the type in the Graph, you need to implement the corresponding resolver in `resolvers.js` to retrieve the homepage Content from Prismic:

```js
export default {
  Query: {
    homepage: async (root, args, { loaders }) => {
      const { TitleTransformer, RichtextToWysiwygTransformer, ImageTransformer } = loaders.Prismic.transformers;
      const homepage = await loaders.Prismic.loadSingle("homepage", {
        fieldTransformers: {
          title: new TitleTransformer(),
          image: new ImageTransformer(),
          text: new RichtextToWysiwygTransformer(loaders.Wysiwyg),
        },
      });
      return homepage;
    },
  },
};
```

#### Image field handling

In this example, without a dedicated resolver, the `image` field of the `Homepage` type is the path to the image of [the `main` view](https://prismic.io/docs/technologies/templating-image-field-javascript#get-an-image-view). In Prismic, while configuring an Image field in the Custom Type editor, it is possible to define several views to get the same image under a different format. Those views can also be exposed in the Graph. For instance, if you have defined a `thumbnail` view, it can be exposed in the graph by applying the following changes. In `schema.gql`:

```diff
type Homepage {
  image: String
+ thumbnail: String
  text: DefaultWysiwyg
}

extend type Query {
  homepage: Homepage
}
```

And in the resolver:

```diff
export default {
  Query: {
    homepage: async (root, args, { loaders }) => {
      const { TitleTransformer, RichtextToWysiwygTransformer, ImageTransformer } = loaders.Prismic.transformers;
      const homepage = await loaders.Prismic.loadSingle("homepage", {
        fieldTransformers: {
          title: new TitleTransformer(),
          image: new ImageTransformer(),
          text: new RichtextToWysiwygTransformer(loaders.Wysiwyg),
        },
      });
      return homepage;
    },
  },
+ Homepage: {
+   thumbnail: (homepageContent) => {
+     return homepageContent.image.thumbnail;
+   }
+ }
};
```

> The `ImageTransformer` also rewrites the image path provided by the Prismic API to use a custom image proxy defined by the module. This path rewrite makes those image path directly usable by [Front-Commerce's `<Image />` component](https://developers.front-commerce.com/docs/advanced/production-ready/media-middleware.html#lt-Image-gt-component).

In addition, each view carries some metadata like the alternative text or the image dimensions. The following changes allow to expose the alternative text of both the `tumbnail` and the `main` views:

```diff
type Homepage {
  image: String
+ imageAlt: String
  thumbnail: String
+ thumbnailAlt: String
  text: DefaultWysiwyg
}

extend type Query {
  homepage: Homepage
}
```

In the resolver:

```diff
export default {
  Query: {
    homepage: async (root, args, { loaders }) => {
      const { TitleTransformer, RichtextToWysiwygTransformer, ImageTransformer } = loaders.Prismic.transformers;
      const homepage = await loaders.Prismic.loadSingle("homepage", {
        fieldTransformers: {
          title: new TitleTransformer(),
          image: new ImageTransformer(),
          text: new RichtextToWysiwygTransformer(loaders.Wysiwyg),
        },
      });
      return homepage;
    },
  },
  Homepage: {
+   imageAlt: (homepageContent) => {
+     return homepageContent.image.main.alt;
+   },
    thumbnail: (homepageContent) => {
      return homepageContent.image.thumbnail;
    },
+   thumbnailAlt: (homepageContent) => {
+     return homepageContent.image.thumbnail.alt;
+   },
  }
};
```

#### Title field handling

In this example, the title is exposed as a plain string in the graph. However, the `TitleTransformer` also generates an HTML representation of the field. So if you need to retrieve the HTML code instead, you can define a custom resolver on the `title` field of the `Homepage` type:

```diff
export default {
  Query: {
    homepage: async (root, args, { loaders }) => {
      const { TitleTransformer, RichtextToWysiwygTransformer, ImageTransformer } = loaders.Prismic.transformers;
      const homepage = await loaders.Prismic.loadSingle("homepage", {
        fieldTransformers: {
          title: new TitleTransformer(),
          image: new ImageTransformer(),
          text: new RichtextToWysiwygTransformer(loaders.Wysiwyg),
        },
      });
      return homepage;
    },
  },
+ Homepage: {
+   title: (homepageContent) => homepageContent.title.html;
+ }
};
```

In addition, Title and Rich Text fields are very similar; a Title field can be seen as a restricted Rich Text field. As a result, the Transformers dedicated to Rich Text fields can also be used on Title fields. So if you want to expose the title as a `DefaultWysiwyg`, you can do the following changes instead. In the `schema.gql`:

```diff
type Homepage {
- title: String
+ title: DefaultWysiwyg
  image: String
  text: DefaultWysiwyg
}

extend type Query {
  homepage: Homepage
}
```

And in the resolver:

```diff
export default {
  Query: {
    homepage: async (root, args, { loaders }) => {
-     const { TitleTransformer, RichtextToWysiwygTransformer, ImageTransformer } = loaders.Prismic.transformers;
+     const { RichtextToWysiwygTransformer, ImageTransformer } = loaders.Prismic.transformers;
      const homepage = await loaders.Prismic.loadSingle("homepage", {
        fieldTransformers: {
-         title: new TitleTransformer(),
+         title: new RichtextToWysiwygTransformer(loaders.Wysiwyg),
          image: new ImageTransformer(),
          text: new RichtextToWysiwygTransformer(loaders.Wysiwyg),
        },
      });
      return homepage;
    },
  },
};
```

### Expose a list of FAQs

#### Define the schema

Let's assume you have created a Custom Type _FAQ_ which identifier is `faq`. This Custom Type has three fields:

* `question` of type Key Text
* `answer` of type Rich Text
* `link` of type Link

Like in the previous example, we can model the corresponding GraphQL type after the Custom Type and in this case we add a root query to retrieve a list of FAQ with a basic pagination and search capabilities:

```graphql
type Faq {
  question: String
  answer: DefaultWysiwyg
  link: String
}

input FaqQueryInput {
  page: Int
  search: String
}

extend type Query {
  faqList(params: FaqQueryInput): [Faq]
}
```

#### Implement the resolver

Again, we have to implement the corresponding resolver by using `loadList` and `ListQuery` described above:

```js
const pageSize = 10;

export default {
  Query: {
    faqList: (root, { params }, { loaders }) => {
      const { search, page } = params;
      const { LinkTransformer, RichtextToWysiwygTransformer } = loaders.Prismic.transformers;
      const ListQuery = loaders.Prismic.queries.ListQuery;
      const query = new ListQuery(pageSize, page ? page : 1);

      query.type("faq").sortBy("document.last_publication_date", "asc");
      if (search) {
        query.search(search);
      }

      const faqList loaders.Prismic.loadList(query, {
        fieldTransformers: {
          // no transformer needed for `question` field as it's a key text field
          answer: new RichtextToWysiwygTransformer(loaders.Wysiwyg),
          link: new LinkTransformer(),
        },
      });

      return faqList.list;
    },
  },
};
```

#### Handling links

Both the `LinkTransformer` and `RichtextToWysiwygTransformer` can be configured to recognize local URLs and rewrite them as site relative links. That way, those links won't break the SPA navigation and contributors don't have to worry about the environment when adding a link.

To benefit from that feature, the following changes have to be applied to the resolver:

```diff
const pageSize = 10;

export default {
  Query: {
    faqList: (root, { params }, { loaders }) => {
      const { search, page } = params;
      const { LinkTransformer, RichtextToWysiwygTransformer } = loaders.Prismic.transformers;
      const ListQuery = loaders.Prismic.queries.ListQuery;
      const query = new ListQuery(pageSize, page ? page : 1);

      query.type("faq").sortBy("document.last_publication_date", "asc");
      if (search) {
        query.search(search);
      }

+     const linkTransformer = new LinkTransformer([
+       "localhost",
+       "staging.example.com",
+       "production.example.com"
+     ]);
      const faqList loaders.Prismic.loadList(query, {
        fieldTransformers: {
          // no transformer needed for `question` field as it's a key text field
-         answer: new RichtextToWysiwygTransformer(loaders.Wysiwyg),
-         link: new LinkTransformer(),
+         answer: new RichtextToWysiwygTransformer(loaders.Wysiwyg, linkTransformer),
+         link: linkTransformer,
        },
      });

      return faqList.list;
    },
  },
};
```
