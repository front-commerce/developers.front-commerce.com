---
id: adapt-theme-to-brand
title: Adapt the theme to your brand
---

When you start a new project, one of the first things that you will need to do
is to adapt the look and feel of Front Commerce to match your brand's style.

Obviously, it is not something that can be done in just a few minutes because
your identity shines in the details. However, you can do all the heavylifting
pretty quickly by customizing what is called **Design Tokens**.

And it's a great way to familiarize yourself with Front Commerce Lite!

## Get your Design Tokens

This concept is often closely related to Design Systems. Basically Design Tokens
are the _core styles_ of your design: colors, font families, font sizes,
borders, shadows, etc. Together they are what make your brand unique.

There even exist tools that extract those tokens from existing websites. In this
example, we will use [CSS Stats](https://cssstats.com/) to extract our Design
Tokens.

https://cssstats.com/stats?url=https%3A%2F%2Fwww.smashingmagazine.com&ua=Browser%20Default
Example with Smashing Magazine's website but feel free to use your brand's
website

If you want to learn more about it, you can have a look at
[Design tokens for dummies](https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71)
which is a very nice introduction.

## Apply these tokens to your theme

Now that we've got our Design Tokens, let's apply them to Front Commerce's
theme.

Since we use the Atomic Design principles, the tokens are within the atoms in
`/web/theme/ui/atoms`. In this guide, we'll focus on the colors and the
typography settings. But feel free to go further and edit buttons, form inputs,
etc.

> Be it with Front Commerce or with Front Commerce Lite, it works the same way.
> The only difference is that before editing the files, you should copy them
> from the core and add them to your custom module.

In order to style our HTML, we use Sass, the well-known CSS preprocessor. Thus,
the design tokens often translate to Sass variables.

For instance, if we want to edit the colors of our application, we need to go to
`src/web/theme/ui/atoms/Colors/Colors.scss` and edit the colors we want to. In
Smashing Magazine's case it would be:

```
/* Adapt the variables that needs to change */
$brandPrimary: #D33A2D;
$brandSecondary: #2da2c5;
$fontColor: #333333;
```

In the same spirit, we could change the main typography to Elena which is
Smashing Magazine's main font in
`src/web/theme/ui/atoms/Typography/Typography.scss`.

```
// First define the custom font
@font-face {
  font-family: 'Elena';
  font-display: optional;
  src: url('https://d33wubrfki0l68.cloudfront.net/a978f759fa0230c1e590d1bdb5a1c03ceb538cec/fed6b/fonts/elenawebregular/elenawebregular.woff2') format('woff2');
}

/* And change the existing variables */
$mainFontFamily: Elena, Georgia, serif;
```

Front Commerce Lite would then now look like this:

TODO IMAGE

Sure it still needs tweaking, but as you can see, it is already far better.
Furthermore, it is an easy first step to convince your clients that using modern
front-end technologies is for the best.

## Expand your brand theme

Please note that all we've been talking about until now was to adapt the
existing to your convenience. However, that is not the only benefit of having a
Design System already in place. It is actually a perfect canvas to help you
creating new components and styles matching to your brand.

You can learn more about it in our guide talking about creating new UI
Components. TODO link
