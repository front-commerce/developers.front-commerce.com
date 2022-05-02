---
id: embed-fields
title: Embed Fields
---

Embed fields allows you to add a valid oEmbed URL, like YouTube, Vimeo, or Spotify, to generate embed html content, or add your own custom embed content. You can read more about the oEmbed format, view a list of supported providers on the [oEmbed website](https://oembed.com/).

In Front-Commerce we expose the embed fields in two ways;

- Standalone Embed fields with an EmbedTransformer
- Embed Fields in [`WysiwygV2`](/docs/advanced/theme/wysiwyg.html#lt-WysiwygV2-gt-usage) with [`PrismicWysiwyg`](/docs/advanced/theme/wysiwyg-platform.html#PrismicWysiwyg)

In this section we will cover how to implement both of these methods, and how to implement your own custom embed fields.

## Standalone Embed Fields

You can learn how to [configure an embed field](https://prismic.io/docs/core-concepts/embed) in the prismic documentation.

For these example let's say we want to create an album cover from an embed field.

### Adding an Embed Field in your server-side

First add an embed field in your schema using the [`oEmbedContent`](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/schema.gql) type, for example:

```graphql
type MyAlbum {
  title: String
  artist: String
  releaseDate: Date
  cover: oEmbedContent
}
```

Then you can implement the [`EmbedTransformer`](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/loaders/transformers/Embed.js) in your loader which will parse the embed response from Prismic to a rich [`oEmbedContent`](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/schema.gql) type.

```js
const AlbumLoader = (PrismicLoader) => {
  const { EmbedTransformer } = PrismicLoader.transformers;

  const contentTransformOptions = {
    fieldTransformers: {
      // ... other transformers
      cover: new EmbedTransformer(),
    },
  };

  return {
    loadByUID: (uid) => {
      return PrismicLoader.loadByUID("album", uid, contentTransformOptions);
    },
  };
};
```

### Adding an Embed Field in your client-side

We have added a `PrismicEmbed` component to handle the embed response in you client side.

To simplify the usage between the component and the backend data we created a `PrismicEmbedFragment` which contains the minimum required data for the component, for example:

```graphql
#import "theme/modules/prismic/PrismicEmbed/PrismicEmbedFragment"

fragment AlbumFragment on Album {
  title
  cover {
    ...PrismicEmbedFragment
  }
}
```

The fragment will expose the `html`, `provider` and `type` fields in the [`oEmbedContent`](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/schema.gql) type.

```jsx
import PrismicEmbed from "theme/modules/prismic/PrismicEmbed";

const Album = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <PrismicEmbed
        html={props.cover.html}
        type={props.cover.type}
        provider={props.cover.provider}
      />
    </div>
  );
};
```

You can override the default components for each embed type in your own theme

| Type    | Component                                                |
| ------- | -------------------------------------------------------- |
| `photo` | `theme/modules/prismic/PrismicEmbed/Components/Photo.js` |
| `video` | `theme/modules/prismic/PrismicEmbed/Components/Video.js` |
| `link`  | `theme/modules/prismic/PrismicEmbed/Components/Link.js`  |
| `rich`  | `theme/modules/prismic/PrismicEmbed/Components/Rich.js`  |

As mentioned above, the fragment only exposes the minimum required fields for the PrismicEmbed component, if you would like to create your own custom embed component you can refer to all the available fields on the [`oEmbedContent`](https://gitlab.com/front-commerce/front-commerce-prismic/-/blob/main/prismic/server/modules/prismic/core/schema.gql) type.

## Wysiwyg Embed Fields

The [PrismicWysiwyg](/docs/advanced/theme/wysiwyg-platform.html#PrismicWysiwyg) type allows you to add embed fields to your Wysiwyg.

### Prerequisites

To get started with the PrismicWysiwyg, please ensure that you have applied the override to `theme/modules/WysiwygV2/getWysiwygComponent.js`, you can follow the documentation from [Wysiwyg](/docs/advanced/theme/wysiwyg.html), to understand how implement Wysiwyg.

If you are using Magento your override would look something like this:

```js
// theme/modules/WysiwygV2/getWysiwygComponent.js

const typenameMap = {
  MagentoWysiwyg: loadable(() => import("./MagentoWysiwyg"))
  PrismicWysiwyg: loadable(() => import("./PrismicWysiwyg"))
};

```

### Example with PrismicWysiwyg

Update your schema to use the [`PrismicWysiwyg`](/docs/advanced/theme/wysiwyg-platform.html#PrismicWysiwyg) type instead of the [`DefaultWysiwyg`](/docs/advanced/theme/wysiwyg-platform.html#DefaultWysiwyg).

```diff
type MyAlbum {
  title: String
  artist: String
  releaseDate: Date
  cover: oEmbedContent
-  content: DefaultWysiwyg
+  content: PrismicWysiwyg
}
```

Then use the `RichtextToWysiwygTransformer` which will transform the Prismic Richtext to the Wysiwyg format.

```js
// server/modules/album/AlbumLoader.js
const AlbumLoader = (PrismicLoader, WysiwygLoader) => {
  const { RichtextToWysiwygTransformer } = PrismicLoader.transformers;

  const contentTransformOptions = {
    fieldTransformers: {
      // ... other transformers
      content: new RichtextToWysiwygTransformer(WysiwygLoader),
    },
  };

  return {
    loadByUID: (uid) => {
      return PrismicLoader.loadByUID("album", uid, contentTransformOptions);
    },
  };
};
```

You should then be able to follow the same steps form [`<WysiwygV2 /> usage`](/docs/advanced/theme/wysiwyg.html#lt-WysiwygV2-gt-usage) to implement the Wysiwyg in your client-side.

### Adding additional Embed loading scripts

We have added loader functions for the following embed scripts

- `Twitter`
- `Facebook`
- `Instagram`

You can update these loading functions or add your own by overriding the `theme/modules/WysiwygV2/PrismicWysiwyg/Components/EmbedScript/appEmbeds.js` file.

This file accepts a Record with the key as the embed [`Provider`](https://oembed.com/providers.json) (case sensitive), and the value containing the load function, the `src` is optional if you would like to use a custom script.

```js
const appEmbeds = {
  // Add you custom embed script here eg:
  Facebook: {
    // this will override the `Facebook` script included by Front-Commerce
    src: "https://example.com/my-custom-facebook-script.js", // optional src (it's not recommended to change this)
    load: (ref) => {
      // this is only triggered once the script load event is fired
      if (typeof window !== "undefined" && window.FB) {
        window.FB.XFBML.parse(ref);
      }
    },
  },
};

export default appEmbeds;
```

### Custom or raw HTML embeds in Wysiwyg

To add custom or raw HTML as for EmbedFields you would need to make some customization to the PrismicWysiwyg.

First setup your Prismic Rich Text field to allow the `pre` Tag

<div style="text-align:left;">
  <img src="./assets/embed-fields/rich-text-pre-tags.png" alt="Enable pre tags in Rich Text" style="border-radius:5px;">
</div>

Then you can create a custom component for the pre tag, which will be used to inject the html into the dom.

```jsx
// theme/modules/Wysiwygv2/PrismicWysiwyg/Components/Pre/index.js
import React from "react";

const Pre = (props) => {
  const html = props.children[0].props.children || "";
  return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
};

export default Pre;
```

Then you will need to register this component by overriding the `theme/modules/WysiwygV2/PrismicWysiwyg/appComponentsMap.js` file.

```js
import Pre from "./Components/Pre";

const appComponentsMap = {
  pre: Pre,
};

export default appComponentsMap;
```

To improve the loading of scripts you can implement your own `useEffect` to lazy load the specific script by detecting the provider in the HTML raw text, you might also be interested in implementing a helper like [`dangerously-set-html-content`](https://github.com/christo-pr/dangerously-set-html-content) which can better handle to loading if injected scripts.

<blockquote class="info">
This can also be done in slices, see the [Add Custom Embed or HTML code](https://community.prismic.io/t/add-custom-embed-or-html-code/5455) article for more information.
</blockquote>
