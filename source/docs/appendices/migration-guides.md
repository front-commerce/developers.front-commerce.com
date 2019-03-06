---
id: migration-guides
title: Migration Guides
---

This area will contain the Migration steps to follow for upgrading your store to new Front-Commerce versions.

Our goal is to make migrations as smooth as possible. This is why we try to make many changes backword compatible by using deprecation warnings. The deprecation warnings are usually removed in the next breaking release.

## `1.0.0-alpha.1` -> `1.0.0-alpha.2`

### Atoms refactoring ([#178](https://gitlab.com/front-commerce/front-commerce/issues/178))

One of the goals of `1.0.0` is to rewrite our CSS classes to make it easier for new external contributors to dive into Front-Commerce. However, this is a lot of work because of the many features already implemented in Front-Commerce. Thus, we've splitted this in 5 smaller iterations (see ([#97](https://gitlab.com/front-commerce/front-commerce/issues/97)) for more details). This release is the first step towards this goal.

This means that:

* CSS classes of atoms are no longer used directly in other components
* CSS classes of atoms now respect the BEM convention. However we are not too rigid about this convention because avoiding dependencies between components is our first priority. (Currently in the process of writing a documentation page explaining the whys behind this decision.)

On your part, the changes that will affect you the most are about the following components:

* `<Button>`: changed the classes and gathered the styles properties under an `appearance` property
* `<Link>`: changed the classes and use the classes of the `<Button>` if you use the `buttonAppearance` property.
    This is relevant because for UI reasons you might want to render a Button, but it should still redirect to a new page under the hood.
* `<ResizedImage>`: added a surrounding div and changed classes to better handle fluid vs fixed images.
    Moreover, you can now update only the components that handle the markup of a ResizedImage without overriding the core component. Please refer to `Image`, `ImageLoading` and `ImageNotFound` in `theme/components/atoms/ResizedImage` folder.
* `<Input>`: changed input classes

You should also check that if you have overriden some of the other components.

### Variant properties

For style variants of a component we had several behaviors in place:
* `type` property which was an enumeration of the variants
* `variantName` properties (for instance `primary` and `warning` for `<Button>`)

To improve consistency, we've decided to change this by always using an `appearance` property which will be an enumeration like what was done with the `type` property.

The goal is to avoid variants collision and to make it explicit when a variant only affects the style of a component.

These changes are backward compatible. Deprecation warnings will appear if you keep using the old properties.
