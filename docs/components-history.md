---
id: components-history
title: React Components Structure
---

In Front Commerce we have seperated our components in two categories: the **UI** components available in the `ui` folders, and the business components available in the `modules` and `pages` folders.

In order to understand why, let's go through the history of Front-Commerce.

## Step 1: Atomic Design

Back in early 2016, we started with the will to apply the [Atomic Design principles](http://bradfrost.com/blog/post/atomic-web-design/). Indeed, it is a really good canevas for those who want to put their feet in the Design System world. It gave us guidelines that should help to keep our theme nice, clean and consistent. We only needed to split our components in 5 folders : atoms, molecules, organisms, templates and pages.

http://bradfrost.com/wp-content/uploads/2013/06/atomic-design.png

And overall, it seemed like a perfect fit with React which embraced the ideas of components. We believed that by splitting our components in tiny little pieces that would assemble together to create whole pages, it would be easy to apply those principles. Thus, we ended with this kind of structure:

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

And we built our first components eagerly! Everything went well until we built our first templates/pages components. Indeed, since there was no distinction between UI and business logic, templates were already full grown pages.

So we just considered that the difference didn't stand in our case and got rid of `pages` folder and move the components to the `templates` folder.

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

The core product continued to grow, we had more and more componetns and the sun was shiny. But after a while we felt that the theme felt inconsistent. Even though it was the whole point of Atomic Design, we failed at building a theme that felt the same everywhere.

So we stopped and looked back for a bit. What was wrong here?

Maybe the fact that we removed the difference between templates and pages was actually a [_design system smell_](https://en.wikipedia.org/wiki/Code_smell). But something felt worse than this: whenever we wanted to create a new component, we had a really hard time to find if it already existed or not.

And that was because the theme components were drowned in the middle of the business logic components. Thus, it only made sense to have the `pages` components back. They would be the React Components containing specific business logic, fetching data from the outside and giving life to UI components. In order to emphasize this decision, we created a new folder called `components` which would contain all the UI components (`atoms`, `molecules`, `organisms` and `templates`).

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

And everything seemed pretty perfect here. The theme took back its consistency and it was easy to create new pages only by using the existing building blocks.

## Step 4: Split pages and modules

However, there was still one last thing that felt off. In `pages`, there would be components that would refer to only a small part of the page. It wasn't that annoying, but it made things fuzzier for external users. How would they know which component was the root page component and which one would be only a small module?

That's why decided to split the `pages` folder in two:

* `pages` for the root components
* `modules` for the smaller components that still contained business logic

Additionnally, since everything is a component in React, we renamed the `components` folder into `ui`.

```
src/
├── ...
└── web/
    └── theme/
        ├── ui/
        |   ├── atoms/
        |   ├── molecules/
        |   ├── organisms/
        |   └── templates/
        ├── modules/
        └── pages/
```

## What's next?

We are now pretty confident that this structure is stable enough and will help you through the creation of brand new themes. We have already built oursleves two custom theme for production stores based on this structure, and it was a breeze.

Additionally, if things were to change in the future, rest assured that we will provide a smooth migration path by adding deprecation warnings, codemods and such things. We want you to stay focused on the value you provide to your clients rather than on technical maintenance.
