---
id: wysiwyg-platform
title: WYSIWYG customization
---

In this guide you will learn the different kind of WYSIWYG that is available on Front-Commerce and how to customize them. If you want to learn how the core WYSIWYG component works instead, please refer to [Display WYSIWYG content](./wysiwyg.html).

Each platform has a specific type of WYSIWYG. This allows to render your content differently depending of its origin. For instance a content from WordPress might have some specific media shortcodes while Magento will have some widgets to display a category name. In the following section you will learn about the one implemented in Front-Commerce:

* [`DefaultWysiwyg`](#DefaultWysiwyg)
* [`MagentoWysiwyg`](#MagentoWysiwyg)

Definitions:
* a *shortcode* is a specific string structure that is meant to be transformed into actual content
* a *transform* is function that replaces an HTML tag with a React Component

## `DefaultWysiwyg`

The goal of this Wysiwyg type is to remain as simple as possible. It is not meant to fetch data from additional services.

**No shortcodes**

**Default transforms**

* `<a>` tags are transformed into `theme/components/atoms/Typography/Link` components when the `href` attribute does not contain a domain.

## `MagentoWysiwyg`

The MagentoWyswiyg's goal is to support all the default features in Magento 1 & 2. If you notice that some features are missing, please contact us and we'll look into implementing it.

**Supported shortcodes**

* `{% raw %}{{media url="*"}}{% endraw %}`
* `{% raw %}{{store url="*"}}{% endraw %}`
* `{% raw %}{{widget type="*" attribute="value"}}{% endraw %}`

**Default transforms**

* `<a>` tags are transformed into `theme/components/atoms/Typography/Link` components when the `href` attribute does not contain a domain.
* `<widget>` tags are transformed into `theme/modules/WysiwygV2/MagentoWysiwyg/Widget/Widget.js` components. However, you shouldn't write a `<widget>` tag manually. It comes from the `{% raw %}{{widget}}{% endraw %}` shortcode.
* `<style>` tags are transformed to support [Magento's Page Builder](/docs/magento2/page-builder.html) format. The `#html-body` selector is replaced with the `<WysiwygV2>` root selector. See [WYSIWYG dynamic styles](/docs/advanced/theme/wysiwyg.html#Dynamic-styles) for details.

### Add a custom Magento Widget

Custom widgets will be automatically parsed. However, you will still need to map the widget's `type` to custom React Components. If you don't, they will be ignored and nothing will be rendered in the final page.

To do so, please override `theme/modules/WysiwygV2/MagentoWysiwyg/Widget/getWidgetComponent.js` in your own theme.

Now, within your newly created `getWidgetComponent.js` file, you will be able to add your own behavior. For instance, if you've created a widget in Magento that uses the type `acme/product-preview`, you will need to update the `Widget.js` file likewise:

```diff
-const defaultWidgetsMap = {};
+import React from "react";
+import Spinner from "theme/components/atoms/Spinner";
+import loadable from "@loadable/component";
+
+const defaultWidgetsMap = {
+  "acme/product-preview": loadable(() => import("./path/to/ProductPreview.js"), {
+    fallback: <Spinner />
+  })
+};

// ... rest of the file is intact
```

If you restart your application, you will notice that the new widget component is displayed. Hurray!

However, in most cases, you will need to fetch data to display all the needed information in your widget. For instance, if the widget is `{% raw %}{{ widget type="acme/product-preview" sku="VSK12" }}{% endraw %}` you will want to fetch the product associated with the given SKU.

1. (Server side) Register your widget type at the GraphQL level
    1. Make sure that your dependencies are up to date in your GraphQL module
```diff
// my-module/server/modules/wysiwyg/index.js
export default {
  namespace: "Magento1/Cms",
+  dependencies: [
+    "Magento2/Wysiwyg", // to make sure that Widget related features are available
+    "Magento2/Catalog/Product" // to make sure that you can fetch a product in your Wysiwyg data
+  ],
```
    2. Register a new WidgetData type in your schema
```graphql
# my-module/server/modules/wysiwyg/schema.gql
type WidgetProductPreviewData implements WidgetData {
  dataId: ID
  product: Product
}
```
    3. Setup the resolvers to tell GraphQL how to fetch the `product` field
```diff
// my-module/server/modules/wysiwyg/resolvers.js
export default {
+  WidgetProductPreviewData: {
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
    4. Register the widget type coming from Magento and associate it with the GraphQL type
```diff
// my-module/server/modules/wysiwyg/index.js
contextEnhancer: ({ loaders }) => {
+  loaders.MagentoWidget.registerWidgetType(
+    // the tag name in your HTML
+    "acme/product-preview",
+    // The associated GraphQL type name
+    "WidgetProductPreviewData"
+  );
}
```
2. (Client side) Get the data in your component
    1. Override the `theme/modules/WysiwygV2/MagentoWysiwyg/MagentoWysiwygFragment.gql` to fetch the new data needed for your widget
```diff
fragment MagentoWysiwygFragment on MagentoWysiwyg {
  childNodes
  data {
    dataId
    ... on WysiwygWidgetData {
      data {
        ... on WidgetInvalidData {
          dataId
        }
+       ... on WidgetProductPreviewData {
+         product {
+           sku
+           name
+         }
+       }
      }
    }
  }
}
```
    2. Use the fetched data in the `data` props in your final widget component (the `./path/to/ProductPreview.js` mentioned above)
