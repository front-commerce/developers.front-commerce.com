---
id: wysiwyg
title: Display WYSIWYG content
---
WYSIWYG stands for **W**hat **Y**ou **S**ee **I**s **W**hat **Y**ou **G**et. It means that your back office users write their content without needing any HTML or React knowledge. This is the case in most CMS tools nowadays. The output though is usually HTML which does not necessarly match the React components you've built in your Front-Commerce application.

This is why we've built a `theme/modules/WysiwygV2` component in Front-Commerce. In this guide you will learn how to use it and how to customize its display.

<blockquote class="note">
It is named <code>WysiwygV2</code> because it has performance improvements over the legacy <code>theme/modules/Wysiwyg</code>. Please refer to [the legacy documentation page](/docs/advanced/theme/wysiwyg-legacy.html) for more information about the old behavior.
</blockquote>

<blockquote class="important">
**Note:** The WysiwygV2 is not used in the default theme yet because of backward compatibility issues. It will come in next releases, but you can already use it today in your own theme by overriding the components that should use it.
</blockquote>

## `<WysiwygV2 />` usage

You can use this component by using the following code:

```jsx
import React from "react";
import WysiwygV2 from "theme/modules/WysiwygV2";

export default props => (
  <WysiwygV2 content={props.contentWysiwyg} />
);
```

The `contentWysiwyg` property must come from a GraphQL field of type `Wysiwyg`. This means that if you had the following GraphQL query, you should add the `WysiwygFragment` available at `theme/modules/WysiwygV2/WysiwygFragment.gql`.

```diff
+#import "theme/modules/WysiwygV2/WysiwygFragment.gql"

query CmsPageQuery(identifiers: [String]!) {
    cmsPageList(identifiers: $identifiers) {
    identifier
    title
-    content
+    contentWysiwyg {
+      ...WysiwygFragment
+    }
  }
}
```

### What if the `Wysiwyg` field does not exist in your schema?

In some cases, you won't have an already parsed Wysiwyg field in your GraphQL schema. You will need to add it yourself. First, you will need to create your own GraphQL module in which you will **add a new GraphQL field and the associated resolver**. Please refer to [Extend the GraphQL schema](/docs/essentials/extend-the-graphql-schema.html) for detailed instruction.

How does this translate to our Wysiwyg case? Let's imagine that we are adding a `contentWysiwyg` to a `CmsPage` GraphQL type. Then this means that we will have to do the three following steps:

* Add `Front-Commerce/Wysiwyg` as a dependency to your GraphQL module
```diff
// my-module/server/modules/wysiwyg/index.js
export default {
  namespace: "Magento2/Cms",
+  dependencies: [
+    "Front-Commerce/Wysiwyg"
+  ],
```
* Add the new Wysiwyg field to the type you want to extend
```graphql
# my-module/server/modules/wysiwyg/schema.gql
extend type CmsPage {
  contentWysiwyg: Wysiwyg
}
```
* Set the resolver for the newly created field to parse the Wysiwyg content
```diff
// my-module/server/modules/wysiwyg/resolvers.js
export default {
+  CmsPage: {
+    contentWysiwyg: (cmsPage, _, { loaders }) => {
+      // The content is the raw HTML string returned by your remote service
+      const rawContent = cmsPage.content;
+
+      // The type specifies how to transform the content
+      // For instance Magento has a specifc {{ widget }} syntax
+      // By using the `MagentoWysiwyg` type, we tell the loader
+      // to apply the correct transformations for Magento related
+      // strings
+      const contentType = "MagentoWysiwyg"
+
+      // We then parse it and fetch the data needed to display it
+      return loaders.Wysiwyg.parse(content, "MagentoWysiwyg");
+    }
+  }
}
```

## WysiwygV2 customization

**Prerequisite:** Please note that the following sections use advanced techniques in Front-Commerce. You especially need to be familiar with the GraphQL extension mechanisms before being able to fully apprehend what is explained. If some areas are still unclear, please feel free to reach out!

### Create a new Wysiwyg Type

Each service is likely to have their own set of rules and constraints when it comes to Wysiwyg. For instance, in Magento you have shortcodes that are defined by using the <code>{% raw %}{{ }}{% endraw %}</code> syntax. In WordPress, you will have `[]` instead. Despite this syntax difference you will have also some functionality difference. For instance, Magento allows you to display a link to a product while WordPress have media galleries. This means that each service will have its own set of transformations for WYSIWYG data.

We are solving this by creating a new Wysiwyg Type for each service. In the previous section, we've mentioned the type `MagentoWysiwyg`. It uses the exact same mechanisms as the one we will describe below.

If you want to customize `MagentoWysiwyg` instead, please refer to [the next section](#MagentoWysiwyg).

**Steps to create a new Wysiwyg Type (`CustomWysiwyg`)**

1. (Server side) Represent this new type of Wysiwyg in the GraphQL schema
    1. Add `Front-Commerce/Wysiwyg` as a dependency of your GraphQL module (for instance at `my-module/server/modules/wysiwyg/`)
    2. Define a new GraphQL type that should implement the `Wysiwyg` interface
```graphql
# my-module/server/modules/wysiwyg/schema.gql
type CustomWysiwyg implements Wysiwyg {
  raw: String
  childNodes: JSON
  data: [WysiwygNodeData]
}
```
    3. Register this new type as a Wysiwyg type in your GraphQL module
```diff
// my-module/server/modules/wysiwyg/index.js
contextEnhancer: ({ loaders }) => {
+  loaders.Wysiwyg.registerWysiwygType(
+    // the name of the GraphQL type you have just created
+    "CustomWysiwyg",
+    // The list of shortcodes that are parsed and replaced in your wysiwyg content
+    [
+      {
+        // regex to identify the shortcode within your HTML code
+        regex: /\{\{media url="(.*?)"\}\}/gi,
+        // How to replace the given shortcode
+        replacement: (match, url) => `/media/${url}`
+      }
+    ]
+  );
}
```
2. (Client side) Map this new type to a specific React component that will apply the needed transformations before displaying the content
    1. Duplicate `theme/modules/WysiwygV2/DefaultWysiwyg` to `theme/modules/WysiwygV2/CustomWysiwyg`.
    1. Override `theme/modules/WysiwygV2/getWysiwygComponent.js` and map your new `CustomWysiwyg` typename (the one used in your GraphQL schema) to `theme/modules/WysiwygV2/CustomWysiwyg` (the file that tells React how to display the content)
```diff
const typenameMap = {
-  MagentoWysiwyg: loadable(() => import("./MagentoWysiwyg/MagentoWysiwyg"))
+  MagentoWysiwyg: loadable(() => import("./MagentoWysiwyg/MagentoWysiwyg")),
+  CustomWysiwyg: loadable(() => import("./CustomWysiwyg"))
};
```

This is it, you have a new `CustomWysiwyg` type. However, the components rendered are still simple HTML tags. If you want to add interactivity, you will need to refer to the `theme/modules/WysiwygV2/CustomWysiwyg` you have created.

In this file you will notice that there is a `defaultComponentsMap` constant. This object is used to reference how to render each html tag in your Wysiwyg component. We call these **transforms**: they transform an html tag into a React component. This is what will allow you to finely tune how your Wysiwyg is displayed and add interactivity to your content.

For instance, if you want your `h2` tags to have some additional classes, you could use the following `defaultComponentsMap` instead:

```js
const defaultComponentsMap = {
  h2: (props) => <h2 {...props} className="wysiwyg-h2" />
}
```

The props available represent the HTML attributes coming from your Wysiwyg content. The only difference compared to traditional HTML is that `class` is renamed to `className` to better support React patterns and the `props.children` is an already constructed React element.

<blockquote class="important">
<b>Note:</b> If the component is complex, please think about code splitting them to avoid too large bundles on pages that don't need them.
</blockquote>

#### Fetching data to render Wysiwyg components

You can now transform HTML tags into React components. However, in some cases the data provided in the raw HTML you've received from your remote service won't be enough to display your component. For instance, you may have a `<product-name sku="VSK12" />` that is supposed to display the product's name. But all you have in the attributes is the SKU. This can be done by associating a `WysiwygNodeData` with your HTML node.

Indeed, when you've created your GraphQL `CustomWysiwyg` type, you have declared: `childNodes` (`JSON`) and `data` (`[WysiwygNodeData]`). By default, `data` will always be empty. But you can tell the Wysiwyg loader to fetch data for some specific `childNodes` (that each represent an HTML tag). This means that for `product-name`, you will associate a new `data` element that will contain the whole product data needed to display the component. To do so, you need to follow these steps:

1. (Server side) Add the product data to your GraphQL schema
    1. Make sure that your dependencies are up to date in your GraphQL module
```diff
// my-module/server/modules/wysiwyg/index.js
export default {
  namespace: "Magento1/Cms",
+  dependencies: [
+    "Front-Commerce/Wysiwyg", // to make sure that Wysiwyg related features are available
+    "Magento2/Catalog/Product" // to make sure that you can fetch a product in your Wysiwyg data
+  ],
```
    2. Define a new `WysiwygProductNameData` type that implements `WysiwygNodeData` and expose all the data you need to display your component
```graphql
# my-module/server/modules/wysiwyg/schema.gql
type WysiwygProductNameData implements WysiwygNodeData {
  dataId: ID
  product: Product
}
```
    3. Setup the resolvers to tell GraphQL how to fetch the `product` field in your new `WysiwygProductNameData` type
```diff
// my-module/server/modules/wysiwyg/resolvers.js
export default {
+  WysiwygProductNameData: {
+    product: ({ node }, _, { loaders }) => {
+      const productSkuAttribute = node.attrs.find(({ name }) => name === "sku")
+      if (!productSkuAttribute) {
+        return null;
+      }
+      return loaders.Product.load(productSkuAttribute.value)
+    }
+  },
}
```
    4. Register the HTML tag and associate it with the GraphQL type
```diff
// my-module/server/modules/wysiwyg/index.js
contextEnhancer: ({ loaders }) => {
+  loaders.Wysiwyg.registerNodeType(
+    // the tag name in your HTML
+    "product-name",
+    // The associated GraphQL type name
+    "WysiwygProductNameData"
+  );
}
```
2. (Client side) Fetch the data to make it available in your custom Product Name component
    1. Override the `theme/modules/WysiwygV2/WysiwygFragment.gql` to fetch the new `WysiwygProductNameData`
```diff
#import "./MagentoWysiwyg/MagentoWysiwygFragment.gql"

fragment WysiwygFragment on Wysiwyg {
  childNodes
  data {
    dataId
+   ... on WysiwygProductNameData {
+     product {
+       sku
+       name
+     }
+   }
  }
  ... on MagentoWysiwyg {
    ...MagentoWysiwygFragment
  }
}
```
    Feel free to split this in a Fragment dedicated to your `CustomWysiwyg` just like it is done in the core for `MagentoWysiwyg`.
    2. Reference the `product-name` tag in your componentMap and use the new `data` prop available in the mapped component.
```diff
const defaultComponentsMap = {
+  product-name: (props) => <span>{props.data.product.name}</span>
}
```
    <blockquote className="important">
    <b>Note:</b> Please keep in mind that for simplicity's sake, the product name component is not code split, but if it grows in complexity, please make sure to code split it using <code>@loadable/component</code> to avoid too large bundles.
    </blockquote>

### Nested Wysiwyg components

In some cases, you will need to render a Wysiwyg component inside another Wysiwyg component. For instance, this can be the case if you implement a Product Preview feature in your Wysiwyg and want to display the description of the product. It is likely to have formatted text that can be defined directly in the administration panel.

Please be advised that we won't support infinite nested Wysiwyg component since it represents a huge performance risk for both you and your users. The goal would be instead to use only simplified Wysiwyg for nested data. In our Product Preview case, this means that instead of rendering a `MagentoWysiwyg` you would only render a `DefaultWysiwyg` that won't fetch additional data but only transform the basic HTML.

If you need more information about implementing this, please contact us.

### Dynamic styles

<blockquote class="feature--new">
_Since version 2.11_
</blockquote>

You may want to render inline styles dynamically when displaying WYSIWYG components. It can be required if content managers customizes how a given element is displayed for instance (e.g: alignment, border color etc…).

Each `<WysiwygV2>` component is wrapped into a unique id. The Front-Commerce WYSIWYG mechanism provides a `<Style>` component that allows you to render styles that could be restricted to the current WYSIWYG context only (and prevent side effects on other parts of the page)

Here is how you could use it from a WYSIWYG component:

```diff
import React from "react";
+ import Style from "theme/modules/WysiwygV2/Style";

const MyComponent = ({ children, data }) => {
  const { id, align, content } = data;
  return <>
+    <Style rootSelector="#html-body">{`
+       #html-body [data-my-component-id=${id}] .my-component__content {
+         text-align: "${align}";
+       }
+    `}</Style>;
    <div class="my-component" data-my-component-id={id}>
      <p class="my-component__introduction">Lorem ipsum…</p>
      <p class="my-component__content">{content}</p>
    </div>
  </>;
};

export default MyComponent;
```

It will generate an inline `<style>` HTML tag with the following content (`#html-body` being replaced with the automatically generated wysiwyg element id):

```html
<style>
  #wysiwyg-styles-xxxxxxxx-yyyy [data-my-component-id=42] .my-component__content {
    text-align: "center";
  }
</style>
```

## That's it!

Everything explained previously is the core behavior of the Wysiwyg implemented in Front-Commerce. It is *very* flexible as it was implemented over a lot of iterations and feedbacks from our integrators. However, with this flexibility comes a bit of a complexity. Please keep in mind that you don't need to fully understand all of it to get started. However, if you've understood most of it, you will be able to dive into our code and understand how we have implemented platform specific Wysiwyg components. You could even use those components as an inspiration to develop your own specific behaviors.
