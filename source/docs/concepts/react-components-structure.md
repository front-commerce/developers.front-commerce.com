---
id: react-components-structure
title: React components structure
---

In Front Commerce we split our components in two categories: the **UI**
components available in the `components` folder, and the **Business** components
available in the `modules` and `pages` folders.

```
src/
├── ...
└── web/
    └── theme/
        ├── components/
        |   ├── atoms/
        |   ├── molecules/
        |   ├── organisms/
        |   └── templates/
        ├── modules/
        └── pages/
```

But what does that mean? Where should we put our components?

## TL;DR

- UI components should be highly reusable and only have theming concerns. They
  are in `src/web/theme/components/` and organized according the
  [Atomic Design principles](http://bradfrost.com/blog/post/atomic-web-design/)
- Business components are components that are used once which contain complex
  [business logic](https://en.wikipedia.org/wiki/Business_logic). They are
  splitted in two: the pages entry point and the modules which can be reused in
  multiple pages.

In order to understand why, let's go through the history of Front-Commerce.

## Step 1: Atomic Design

Back in early 2016, we started with the will to apply the
[Atomic Design principles](http://bradfrost.com/blog/post/atomic-web-design/).
Indeed, it is a really good canvas for those who want to put their feet in the
Design System world. It gave us guidelines that should help to keep our theme
nice, clean and consistent. We only needed to split our components in 5 folders
: atoms, molecules, organisms, templates and pages.

![Overview of the concept behind Atomic Design](assets/atomic-design.jpg)

And overall, it seemed like a perfect fit with React which embraced the ideas of
components. We believed that splitting our components in tiny pieces would help
us applying those principles. By assembling them together we could create whole
pages easily. Thus, we ended with this kind of structure:

```
src/
├── ...
└── web/
    └── theme/
        ├── atoms/
        ├── molecules/
        ├── organisms/
        ├── templates/
        └── pages/
```

## Step 2: Fuse templates and pages

And we built our first components eagerly! Everything went well until we built
our first templates/pages components. Indeed, since there was no distinction
between UI and business logic, templates were already full grown pages.

So we just considered that the difference didn't stand in our case and got rid
of `pages` folder and moved the components to the `templates` folder.

```
src/
├── ...
└── web/
    └── theme/
        ├── atoms/
        ├── molecules/
        ├── organisms/
        └── templates/
```

## Step 3: Split business and UI logic

The core product continued to grow, we had more and more components and the sun
was shiny. But after a while we felt that the theme was inconsistent. Even
though it was the whole point of Atomic Design, we failed at building a
homogeneous theme.

So we stopped and looked back for a bit. What was wrong here?

The root cause was that it was really hard to find existing components. It led
to many duplicates. The theme components were actually drowned in the middle of
the business logic components.

That's why we brought the `pages` components back. They would be the React
Components containing specific business logic, fetching data from the outside
and giving life to UI components. In order to emphasize this decision, we
created a new folder called `components` which would contain all the UI
components (`atoms`, `molecules`, `organisms` and `templates`).

```
src/
├── ...
└── web/
    └── theme/
        ├── components/
        |   ├── atoms/
        |   ├── molecules/
        |   ├── organisms/
        |   └── templates/
        └── pages/
```

And everything seemed perfect here. The theme got its consistency back and it
was easy to create new pages only by using the existing building blocks.

## Step 4: Split pages and modules

However, there was still one last thing that felt off. In `pages`, there would
be components that would refer to only a small part of the page. It wasn't that
annoying, but it made things fuzzier for external users. How would they know
which component was the root page component and which one would only be a small
module?

That's why we decided to split the `pages` folder in two:

- `pages` for the root components
- `modules` for the smaller components that still contained business logic

```
src/
├── ...
└── web/
    └── theme/
        ├── components/
        |   ├── atoms/
        |   ├── molecules/
        |   ├── organisms/
        |   └── templates/
        ├── modules/
        └── pages/
```

Learn more about:

* [/src/web/theme/components](/docs/essentials/create-a-ui-component.html): the UI Components
* [/src/web/theme/modules](/docs/essentials/create-a-business-component.html): the Business Components
* [/src/web/theme/pages](/docs/essentials/add-a-page-client-side.html): the Pages Components

## What's next?

We are now pretty confident that this structure is stable enough and will help
you through the creation of brand new themes. We have already built oursleves
two custom themes for production stores based on this structure, and it was a
breeze.

Additionally, if things were to change in the future, **rest assured that we
will provide a smooth migration path** by adding deprecation warnings, codemods
and such things. We want you to stay focused on the value you provide to your
clients rather than on technical maintenance.
