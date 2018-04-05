---
id: create-a-ui-component
title: Create a UI Component
---

In Front Commerce we have seperated our components in two categories: the **UI**
components available in the `ui` folders, and the business components available
in the `modules` and `pages` folders.

> If you feel the need to understand why we went for this organization, feel
> free to refer to [React components structure](react-components-structure.md)
> first.

In this guide, we will learn how to build a UI Component. We will do so by
creating our own. However, if you dive into the `src/web/theme/ui` folder of
your Front-Commerce application, you will find out that those components are
built this way too.

But first, let's define what is an ideal UI Component.

## The ideal UI Component

In Front-Commerce we call UI component any component that is:

* **Reusable in many contexts**  
  If a component is used only once in the whole application, it might be the sign
  that it does not exist purely for UI purpose. The component most likely needs to
  be moved to the `modules` folder.  
  That's also the reason why we avoid to give names too close to its business
  use. For instance, we don't want to have a UI component that would be called
  `ProductDescription`. It would be better to go for a `Description` that would
  thus be reusable by a Category.
* **Focused on abstracting away UI concerns**  
  The goal of UI components is not to leak styles or DOM concerns to their parents.
  It may be hard to achieve sometimes, but it will greatly improve the parent component's
  readability. For instance, a UI component should not give the opporunity to pass
  a `className` in its props as it would lead to too many styles inconsistency accross
  the theme.

## How to build a UI Component?

Alright, that's nice in theory, but how does it translate in practice? We'll try
to get a bit more tangible by creating a UI component that we would need in a
Reinsurance Banner.

Image de ce qu'on va construire.  
Mockup of the reinsurance banner that we will implement

### Step 1: Defining the components

First, let's split the mockup in several UI components.

Image avec les zones

* **`atoms/Heading`:** enforce consistent font-sizes in our theme for any title
* **`atoms/Icon`:** enforces icon sizes and accessibility guidelines
* **`molecules/MediaCard`:** displays a Card described by an image and aligns
  images properly accross the whole theme
* **`organisms/InlineCardList`:** manages a list of cards and inlines them,
  regardeless of the device size.

> If you have troubles splitting your mockups, you can refer to
> [Thinking in React](https://reactjs.org/docs/thinking-in-react.html) in the
> official React documentation or to
> [Brad Frost's book about Atomic Design](http://atomicdesign.bradfrost.com/).  
> Additionnally, the way we splitted things here depends on what you've already built,
> you may organize your code differently and that's perfectly fine. Especially since,
> we've splitted the components **a lot** here. It may be a better idea not to go
> overboard. It's often easier to wait and see how it can be reused later.

We won't be able to detail each component here. We will focus on
`molecules/MediaCard` instead. But keep in mind that any UI component in
Front-Commerce will look similar to what we are going to build here.

### Step 2: Setup your dev environment

Before doing the actual work let's bootstrap our dev environment. To do so, we
will need to create three files:

* `src/web/theme/ui/molecules/MediaCard/MediaCard.js`: will be your actual
  component

  ```jsx
  import React from "react";

  const MediaCard () => <div>Media Card</div>;

  MediaCard.propTypes = {
      // Don't forget to setup your PropTypes
      // here since this component will be heavily
      // used through your application
  }

  export default MediaCard
  ```

* `src/web/theme/ui/molecules/MediaCard/index.js`: will only proxy the
  MediaCard.js file in order to be able to do imports on the folder directly.

  ```jsx
  import MediaCard from "./MediaCard.js";

  export default MediaCard;
  ```

* `src/web/theme/ui/molecules/MediaCard/MediaCard.story.js`: will add a story to
  the [Storybook](https://storybook.js.org/) of your application. This will
  serve as living documentation and will allow anyone to easily understand what
  is MediaCard used for and how to use it. Learn more about our Storybook usage
  in (#TODO-documentation).

  ```jsx
  import MediaCard from "./MediaCard.js";
  import { storiesOf } from "@storybook/react";

  storiesOf("molecules.MediaCard", module).add("default", () => {
    return <MediaCard />;
  });
  ```

Once you've added your component, you must restart the styleguide. Once it is up
and running, you can view your new story in `molecules > MediaCard`.

Now that you've done that, you can edit the MediaCard component, save, and view
the changes live in your browser.

<figure style="margin: 1em 0; max-width: 50rem;">
<img src="https://storybook.js.org/static/demo.f13d28a7.gif" alt="Demo of Storybook hot reloading" />
<figcaption style="margin: 0.5em; text-align: center">Take a look at this magical development playground!</figcaption>
</figure>

> In order to learn more about storybook, please refer to TODO Storybook
> documentation

### Step 3: Implement your component

Now that everything is ready to go, you can do the actual work and implement the
component. In the case of the MediaCard, it would look like this:

```jsx
// src/web/theme/ui/molecules/MediaCard/MediaCard.js
import React from "react";
import PropTypes from "prop-types";

const MediaCard ({media, children}) => (
  <div className="media-card">
    <div className="media-card__media">{media}</div>
    <div className="media-card__content">{children}</div>
  </div>
);

MediaCard.propTypes = {
  media: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
}

export default MediaCard
```

#### Styling

If you need to style things with CSS, you have to import the CSS file directly
in your component file.

```jsx
// src/web/theme/ui/molecules/MediaCard/MediaCard.js
import "./MediaCard.scss";

// ... with the rest of your code here
```

```scss
// src/web/theme/ui/molecules/MediaCard/MediaCard.scss
.media-card {
  display: flex;
}
.media-card__media {
  width: 30%;
  max-width: 10em;
}
```

Please note here, that we are using [Sass](https://sass-lang.com/) (hence the
`.scss` extension). We believe that it is easier for developers new to the React
Ecosystem to remain with this well-known CSS preprocessor.

Additionnally, in each Sass files, we will be able to use a list of variables
that will allow you to keep our theme consitent accross the whole theme. These
are available at `src/web/theme/globals.scss`.

As a side note, we also use [BEM convention](http://getbem.com/naming/) for our
CSS code base. It makes it easy to avoid naming conflicts by adding a tiny bit
of code ceremony. However, for you custom components, feel free to code however
you like. There is no obligation here.

#### Document usage of our component

If our component can have different usages, we should also add new stories along
the default one.

```jsx
// src/web/theme/ui/molecules/MediaCard/MediaCard.story.js
import MediaCard from "./MediaCard.js";
import { storiesOf } from "@storybook/react";
import Icon from "theme/ui/atoms/Icon";
import Heading from "theme/ui/atoms/Heading";
import Description from "theme/ui/atoms/Description";

storiesOf("molecules.MediaCard", module)
  .add("default", () => {
    return (
      <MediaCard media={<Icon icon="truck" />}>
        <Heading>Shipping within 48h</Heading>
      </MediaCard>
    );
  })
  .add("with a lot of content", () => {
    return (
      <MediaCard media={<Icon icon="truck" />}>
        <Heading>Shipping within 48h</Heading>
        <Description>
          We are using many delivery services to let you choose what is best for
          you!
        </Description>
      </MediaCard>
    );
  })
  .add("with an image", () => {
    return (
      <MediaCard
        media={
          <Image src="http://via.placeholder.com/350x150" alt="Placeholder" />
        }
      >
        <Heading>Shipping within 48h</Heading>
      </MediaCard>
    );
  });
```

It has many major benefits such as:

* easily document edge cases
* provide a test suite thanks to snapshot testing
  ([Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots))
* create a common discussion base for designers, product managers, marketers,
  etc.

[Learn more about Storybook.](https://storybook.js.org/)

### Step 4: Use the component

Once we are satisfied with our component, we can use it anywhere. In this case,
the MediaCard was to be used in the Reinsurance Banner. Thus, this module's
component would look like this:

```jsx
import React from "react";
// Imports can be absolute from `theme`
// or relative to the current file
import InlineCards from "theme/ui/organisms/InlineCards"
import MediaCard from "theme/ui/molecules/MediaCard"
import Icon from "theme/ui/atoms/Icon"
import Heading from "theme/ui/atoms/Heading"

// The components can then be used the usual React way

export default () => (
  <InlineCards>
    <MediaCard media={<Icon icon="truck" />}>
      <Heading>Shipping within 48h</Heading>
    </MediaCard>
    <MediaCard media={<Icon icon="thumbsup" />}>
      <Heading>Money back guarantee</Heading>
    </MediaCard>
    <MediaCard media={<Icon icon="creditcard" />}>
      <Heading>Secured Payment</Heading>
    </MediaCard>
  </InlineCards>
```
