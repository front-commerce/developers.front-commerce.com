---
id: content-slices
title: Content Slices
description: Content Slices allows developers to design autonomous and reusable UI elements that Content managers can use to build dynamic pages. Front-Commerce has first-class support for Prismic Slices. This page explains how developers can use the tool we provide to create content-driven dynamic pages.
---

With [Content Slices](https://prismic.io/feature/dynamic-layout-content-components), Front-Commerce embraces the **"Don't Ship Pages, Ship a Page Builder"** vision brought by Prismic. See how to make slices a part of your authoring strategy.

## How to use Slices?

Integrating a Prismic Slice Zone and its Slices into your project is a 3 steps process:

<!-- Workaround for https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one#table-of-contents -->
<!-- no toc -->

- [How to use Slices?](#how-to-use-slices)
- [Expose data in GraphQL](#expose-data-in-graphql)
- [Create a Slice library](#create-a-slice-library)
  - [Independent components for each Slice type](#independent-components-for-each-slice-type)
  - [Define the Slice library](#define-the-slice-library)
- [Retrieve and display content](#retrieve-and-display-content)

## Expose data in GraphQL

In this example, we will add a Slice Zone with 3 types of Slices to an existing home page.

First, **update your GraphQL Schema** to reflect the Slice Zone definition. A Slice Zone will be designed as a [GraphQL union type](https://graphql.org/learn/schema/#union-types).

```diff
type Homepage {
  title: String
+  mainContent: [HomePageSlice]
}
+
+ union HomePageSlice = Carousel | Push | FeaturedProducts
+
+ type FeaturedProducts {
+   sectionTitle: String
+   category: Category
+ }
+ type Carousel {
+   slides: [CarouselSlide]
+ }
+ type Push {
+   blocks: [PushBlock]
+ }
+ type PushBlock {
+   title: String
+   image: String
+   cta: CallToAction
+   format: String
+   cellSize: String
+ }
+
+ #[…]
+
+ type CallToAction {
+   url: String
+   text: String
+ }
```

In your resolvers, load your content as usual [with the Prismic loader](/docs/prismic/expose-content.html#Methods-to-query-content).

In addition to [the `fieldTransformers` parameter](/docs/prismic/expose-content.html#Field-Transformers), the loader methods accept a `supportedSlices` key. It allows to define to a data structure for the Slices available in the Custom Type.

For a Custom type containing a title and a Slice Zone with only one type of Slice (`featured_products` exposed under the GraphQL `FeaturedProducts` type), the change would look like this:

```diff
{
  fieldTransformers: {
    title: new TitleTransformer(),
  },
+  supportedSlices: [
+    new Slice("featured_products", { // Slice type as defined in Prismic
+      graphQLType: "FeaturedProducts", // type name as defined in your Schema
+      fieldTransformers: {
+        section_title: new TitleTransformer(),
+      },
+    }),
+    // ... add other Slice definitions here
+  ],
};
```

The resolved content will now contain Slices contributed for the Slice Zone in the `content.body` field. Repeatable fields in a Slice are always made available under the `content.items` field of the Slice content.

Here is an example showcasing how resolvers could allow to adapt Prismic content to the schema you've designed (and overcome the technical naming constraint brought by Prismic):

```js
// resolvers.js
export default {
  // […]
  Homepage: {
    mainContent: (content) => content.body,
  },

  Carousel: {
    slides: (content) => content.items,
  },

  Push: {
    blocks: (content) => content.items,
  },
  PushBlock: {
    cta: (content) => ({
      url: content.push_url,
      text: content.push_link_text,
    }),
  },

  FeaturedProducts: {
    sectionTitle: (content) => content.section_title,
    category: (content) => {
      // A Category Integration Field as documented in examples
      // see https://developers.front-commerce.com/docs/prismic/integration-fields.html#Create-resolvers-for-these-fields
      return content.category?.loadValue();
    },
  },
  // […]
};
```

That's it! You must now be able to view data from Prismic when requesting your application's GraphQL server:

```graphql
{
  homepage {
    title
    mainContent {
      __typename
      ... on FeaturedProducts {
        sectionTitle
        category {
          name
        }
      }
      ... on Carousel {
        slides {
          title
        }
      }
    }
  }
}
```

Let's now see how to map these data to frontend components.

## Create a Slice library

To ease the creation of a Slice Zone, Front-Commerce provides the `makeSliceLibrary` function. It allows developers to create a library of Slices for the GraphQL types declared earlier.

### Independent components for each Slice type

First, ensure that you have created one or more components for each Slice type to display. Each one of them must have a GraphQL fragment defining the data they require.

A component **must accept** data of the fragment attached to it in `props.data`. Here is an example for a `Push` slice to be used the `Home` Slice library:

```js
// theme/modules/Slices/Home/Push/Push.js
import React from "react";
//[…]

const Push = ({ data }) => {
  return (
    <div className="container">
      <Grid>
        {data.blocks.map((block, index) => (
          <Cell size={block.cellSize} key={index}>
            <PushBlock imageSrc={block.image} format={block.format}>
              <H2>{block.title}</H2>
              <Link buttonAppearance="default" to={block.cta.url}>
                {block.cta.text}
              </Link>
            </PushBlock>
          </Cell>
        ))}
      </Grid>
    </div>
  );
};

export default Push;
```

and the related GraphQL fragment describing data dependencies:

```graphql
# theme/modules/Slices/Home/Push/PushFragment.gql
fragment PushFragment on Push {
  blocks {
    title
    image
    cta {
      url
      text
    }
    format
    cellSize
  }
}
```

### Define the Slice library

Several components and their fragments can now be assembled together in a Slice library. Here is how to achieve this with the `makeSliceLibrary` factory:

```js
// theme/modules/Slices/Home/index.js
import makeSliceLibrary from "theme/modules/Prismic/Slices/makeSliceLibrary";

// "HomePageSlice" is the name of the GraphQL union type exposing the Slice Zone
const sliceLibrary = makeSliceLibrary("HomePageSlice", [
  { component: Push, fragment: PushFragment },
  { component: FeaturedProducts, fragment: FeaturedProductsFragment },
  { component: Carousel, fragment: CarouselFragment },
]);

// This export must be left unchanged. It allows the file to be imported
// as a Fragment in a `*.gql` file.
// The generated fragment will have the GraphQL type name, suffixed with "Fragment".
// In this example, it will be: HomePageSliceFragment
const definitions = sliceLibrary.fragmentDefinitions;
export { definitions };

// This SliceZone component is the one that will display data correctly
export default sliceLibrary.SliceZone;
```

Please note that the `export { definitions };` is required to allow importing this file as a GraphQL fragment (see below).

## Retrieve and display content

Now that you have defined a Slice library, you could use it wherever you need to display a SliceZone with these Slices.

Let's continue our example and update our hypothetical `<Home>` component to display the Slice zone.

First, update the GraphQL query to add the Slice zone field (`mainContent` in our example):

```diff
+ # Path to the Slice Library:
+ #import "theme/modules/Slices/Home"

query HomeQuery {
  homepage {
    title
+    mainContent {
+      # Fragment name = {GraphQL Type}Fragment
+      ...HomePageSliceFragment
+    }
  }
}
```

Then, pass these data to the Slice Zone component exported by the Slice library created in the previous section:

```diff
import React from "react";
+ import HomeSliceZone from "theme/modules/Slices/Home";
// […]

const Home = (props) => {
  const homepageData = props.data.homepage;
  return <div>
    <h1>{homepageData.title}</h1>
+    <HomeSliceZone
+      content={homepageData.mainContent}
+      renderSlices={(slices) => <Stack size="8">{slices}</Stack>}
+    />
  </div>
}
```

<blockquote class="note">
**Note:** field data must be passed as the `content` prop. The `renderSlices` prop is optional (by default, slices are displayed without wrapper).
</blockquote>

**This is it!** You can now try to create new Slices in Prismic or reorder them, and your page should reflect these changes after publication.
