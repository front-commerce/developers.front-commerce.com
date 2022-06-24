---
id: adapt-theme-to-your-brand
title: Adapt the theme to your brand
description: When you start a new project, one of the first things you will need to do is adapt the look and feel of Front-Commerce to match your brand's style.
---

It is not something that you can do in just a few minutes because your identity shines in the details. However, you can do all the heavy lifting pretty quickly by customizing what is called **Design Tokens**.

And it's a great way to familiarize yourself with Front-Commerce!

## Get your Design Tokens

This concept is often closely related to Design Systems. Basically Design Tokens
are the _core styles_ of your design: colors, font families, font sizes,
borders, shadows, etc. Together they are what make your brand unique.

There even exist tools that extract those tokens from existing websites. In this
example, we will use [CSS Stats](https://cssstats.com/) to extract Design Tokens
from [Smashing Magazine](https://www.smashingmagazine.com/) and use them later.

<figure>
<img alt="CSS Stats lists all the 62 colors and 59 unique background colors of Smashing Magazine" src="assets/smashingmagazine-cssstats.png" />
<figcaption>Here is an example with the awesome Smashing Magazine website</figcaption>
</figure>

<blockquote class="resource">
If you want to learn more about it, you can have a look at
[Design tokens for dummies](https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71)
which is a very nice introduction.
</blockquote>

## Apply these tokens to your theme

Now that we've got our Design Tokens, let's apply them to Front-Commerce's base
theme.

Since we use the Atomic Design principles, the tokens are within atoms of
our base theme. From your application, you will find the base theme in the
[`node_modules/front-commerce/src/web/`](https://gitlab.com/front-commerce/front-commerce/tree/main/src/web) directory and atoms under its `theme/components/atoms` subdirectory.

In this guide,
we'll focus on the colors and the typography settings. But feel free to go
further and edit buttons, form inputs, etc.

### Colors

In order to style our HTML, we use [Sass](https://sass-lang.com/), the well-known CSS preprocessor. Thus,
the design tokens often translate to Sass variables.

For instance, if we want to edit the colors of our application, we need to
override the one defined in the core. To do so:

1.  override the `theme/components/atoms/Colors/_colors.scss` theme file in your
    theme:

```bash
mkdir -p my-module/web/theme/components/atoms/Colors/
cp node_modules/front-commerce/src/web/theme/components/atoms/Colors/_colors.scss \
  my-module/web/theme/components/atoms/Colors/_colors.scss
```

2. restart the application so the override is detected
3. edit the colors as needed

In Smashing Magazine's case it would be:

```diff
// my-module/web/theme/components/atoms/Colors/_colors.scss
-$brandPrimary: #666699;
-$brandSecondary: #818199;
+$brandPrimary: #d33a2c;
+$brandSecondary: #2da2c5;

-$fontColor: #131433;
+$fontColor: #333;
```

### Typography

We could change the fonts to match Smashing Magazine's in a similar way. Fonts
are defined in `theme/components/atoms/Typography/_typography.scss`. The difference
here is that we will also introduce a different font for headings and that we
will have to allow the remote font domain in the
<abbr title="Content Security Policy">CSP</abbr> headers.

Follow the same steps than for colors:

1. override the `theme/components/atoms/Typography/_typography.scss` and
   `theme/components/atoms/Typography/Heading/_Heading.scss` theme files in your
   theme:

```bash
mkdir -p my-module/web/theme/components/atoms/Typography/Heading
cp node_modules/front-commerce/src/web/theme/components/atoms/Typography/_typography.scss \
  my-module/web/theme/components/atoms/Typography/_typography.scss
cp node_modules/front-commerce/src/web/theme/components/atoms/Typography/Heading/_Heading.scss \
  my-module/web/theme/components/atoms/Typography/Heading/_Heading.scss
```

2. restart the application so the override is detected
3. edit the fonts as needed

```diff
// my-module/web/theme/components/atoms/Typography/_typography.scss
-$fontFamily: "Roboto", "Arial Helvetica", "Arial", sans-serif;
+@font-face {
+  font-family: "Elena";
+  font-display: swap;
+  src: url("https://d33wubrfki0l68.cloudfront.net/a978f759fa0230c1e590d1bdb5a1c03ceb538cec/fed6b/fonts/elenawebregular/elenawebregular.woff2")
+    format("woff2");
+}
+
+@font-face {
+  font-family: "Mija";
+  font-display: swap;
+  src: url("https://d33wubrfki0l68.cloudfront.net/b324ee03d5048d2d1831100e323b0b6336ffce68/0445e/fonts/mijaregular/mija_regular-webfont.woff2")
+    format("woff2");
+}
+
+$fontFamily: Elena, Georgia, serif;
+$titleFontFamily: Mija, Arial, sans-serif;

// my-module/web/theme/components/atoms/Typography/Heading/_Heading.scss
 @mixin heading($f-size) {
+  font-family: $titleFontFamily;
   font-size: $f-size;
   font-weight: bold;
 }
```

4. allow `d33wubrfki0l68.cloudfront.net` (the domain we have included fonts from) in your
   <abbr title="Content Security Policy">CSP</abbr> `font-src` header value
   configured in `src/config/website.js`

```diff
// my-module/config/website.js
       imgSrc: [],
-      fontSrc: [],
+      fontSrc: ["d33wubrfki0l68.cloudfront.net"],
       connectSrc: [],
```

## A new look

Front-Commerce would then now look like this:

<figure>
<img alt="A comparison between the original Front-Commerce base theme and with Smashing Magazine's tokens" src="assets/design-tokens-page.png" />
</figure>

Sure it still needs tweaking, but as you can see, it is already far better.
Furthermore, it is an easy first step to start convincing your team and clients
that using modern front-end technologies is for the best.

<blockquote class="more">
  You can experiment further by changing other tokens such as spacing, form inputs, buttons…
</blockquote>

## Expand your brand theme

Please note that all we've been talking about until now was to adapt the
existing to your convenience. However, that is not the only benefit of having a
Design System already in place. It is actually a perfect canvas to help you
creating new components and styles matching to your brand.

See the next section to learn more about this.
