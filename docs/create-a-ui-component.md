---
id: create-a-ui-component
title: Create a UI Component
---

In Front Commerce we split our components in two categories: the **UI**
components available in the `ui` folder, and the business components available
in the `modules` and `pages` folders.

> If you feel the need to understand why we went for this organization, feel
> free to refer to [React components structure](react-components-structure.md)
> first.

In this guide, we will learn how to build a UI Component. We will do so by
creating our own. Front-Commerce’s core UI components follow the same principles
and you could dive into the `src/web/theme/ui` folder to find examples by
reading our source code.

But first, let's define what is an ideal UI Component.

## The ideal UI Component

In Front-Commerce we call UI component any component that is:

- **Reusable in many contexts** If a component is used only once in the whole
  application, it might be the sign that it does not exist purely for UI
  purpose. The component most likely needs to be moved to the `modules` folder.
  That's also the reason why we avoid to give names too close to its business
  use. For instance, we don't want to have a UI component that would be called
  `ProductDescription`. It would be better to go for a `Description` that would
  thus be reusable by a Category.
- **Focused on abstracting away UI concerns** The goal of UI components is to
  hide styles or DOM concerns from their parents. It may be hard to achieve
  sometimes, but it will greatly improve the parent component's readability. For
  instance, a UI component should not give the opportunity to pass a `className`
  in its props as it may lead to many styles inconsistencies across the theme.

## How to build a UI Component?

Alright, that's nice in theory, but how does it translate in practice? We'll try
to get a bit more tangible by creating a UI component needed for adding a
Reinsurance Banner in a page.

![The reinsurance banner that we will implement](/docs/assets/reinsurance.jpg)

### Step 1: Defining the components

First, let's split the mockup in several UI components.

![The various components that will make up our banner](/docs/assets/reinsurance-with-areas.jpg)

- **`atoms/typography/Heading`:** enforces consistent font sizes in our theme
  for any title
- **`atoms/Icon`:** enforces icon sizes and accessibility guidelines
- **`molecules/IllustratedContent`:** displays a some content illustrated by an
  image and aligns images properly across the whole theme
- **`organisms/InlineCards`:** manages a list of cards and inlines them,
  regardless of the device size.

> If you have trouble splitting your mockups, you can refer to
> [Thinking in React](https://reactjs.org/docs/thinking-in-react.html) in the
> official React documentation or to
> [Brad Frost's book about Atomic Design](http://atomicdesign.bradfrost.com/).
> You may want to organize your code differently and that's perfectly fine. The
> way we splitted things here is one of many possible solutions. Such choices
> will depend on your project and your team. It may be a better idea to keep
> things simple. It's often easier to wait and see how it can be reused later.

We won't be able to detail each component here. We will focus on
`molecules/IllustratedContent` instead. But keep in mind that any UI component
in Front-Commerce will look similar to what we are going to build here.

### Step 2: Setup your dev environment

Before doing the actual work let's bootstrap our dev environment. To do so, we
will need to create three files:

- `src/web/theme/ui/molecules/IllustratedContent/IllustratedContent.js`: will be
  your actual component

  ```jsx
  import React from "react";

  const IllustratedContent = () => <div>Illustrated Content</div>;

  IllustratedContent.propTypes = {
    // Don't forget to setup your PropTypes
    // here since this component will be heavily
    // used through your application
  };

  export default IllustratedContent;
  ```

- `src/web/theme/ui/molecules/IllustratedContent/index.js`: will only proxy the
  IllustratedContent.js file in order to be able to do imports on the folder
  directly.

  ```jsx
  import IllustratedContent from "./IllustratedContent.js";

  export default IllustratedContent;
  ```

- `src/web/theme/ui/molecules/IllustratedContent/IllustratedContent.story.js`:
  will add a story to the [Storybook](https://storybook.js.org/) of your
  application. This will serve as living documentation and will allow anyone to
  easily understand what is `IllustratedContent` used for and how to use it.

  ```jsx
  import IllustratedContent from "./IllustratedContent.js";
  import { storiesOf } from "@storybook/react";

  storiesOf("ui.molecules.IllustratedContent", module).add("default", () => {
    return <IllustratedContent />;
  });
  ```

Once you've added your component, you must restart the styleguide. Once it is up
and running, you can view your new story in `molecules > IllustratedContent`.

Now that you've done that, you can edit the IllustratedContent component, save,
and view changes live in your browser.

<figure style="margin: 1em 0; max-width: 50rem;">
<img src="https://storybook.js.org/static/demo.f13d28a7.gif" alt="Demo of Storybook hot reloading" />
<figcaption style="margin: 0.5em; text-align: center">Take a look at this magical development playground!</figcaption>
</figure>

> Learn more:
>
> - about Storybook itself, by reading the
>   [official Storybook documentation](https://storybook.js.org/basics/introduction/)
> - about our Storybook usage by reading the stories we wrote for of our
>   existing components

### Step 3: Implement your component

Now that everything is ready to go, you can do the actual work and implement the
component. In the case of the IllustratedContent, it would look like this:

```jsx
// src/web/theme/ui/molecules/IllustratedContent/IllustratedContent.js
import React from "react";
import PropTypes from "prop-types";

const IllustratedContent ({ media, children }) => (
  <div className="illustrated-content">
    <div className="illustrated-content__media">{media}</div>
    <div className="illustrated-content__content">{children}</div>
  </div>
);

IllustratedContent.propTypes = {
  media: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
}

export default IllustratedContent
```

#### Styling

If you need to style things with CSS, you have to import the CSS file directly
in your component file.

> Please note here that we are using [Sass](https://sass-lang.com/) (hence the
> `.scss` extension). We believe that it is easier for developers new to the
> React Ecosystem to remain with this well-known CSS preprocessor.

```jsx
// src/web/theme/ui/molecules/IllustratedContent/IllustratedContent.js
import "./IllustratedContent.scss";

// ... with the rest of your code here
```

```scss
// src/web/theme/ui/molecules/IllustratedContent/IllustratedContent.scss
.illustrated-content {
  display: flex;
  flex-direction: column;
}
.illustrated-content__media {
  width: 30%;
  max-width: 10em;
}
```

Additionally, in each Sass files, we will be able to use a list of variables
that will allow us to keep our styles consistent across the whole theme. These
are available at `src/web/theme/globals.scss`.

As a side note, we also use [BEM convention](http://getbem.com/naming/) for our
CSS code base. It makes it easy to avoid naming conflicts by adding a tiny bit
of code convention. However, for your custom components, feel free to code
however you like. There is no obligation here.

#### Document usage of our component

If our component can have different usages, we should also add new stories along
the default one.

```jsx
// src/web/theme/ui/molecules/IllustratedContent/IllustratedContent.story.js
import IllustratedContent from "./IllustratedContent.js";
import { storiesOf } from "@storybook/react";
import Icon from "theme/ui/atoms/Icon";
import { H3 } from "theme/ui/atoms/Typography/Heading";
import Paragraph from "theme/ui/atoms/Typography/Paragraph";

storiesOf("molecules.IllustratedContent", module)
  .add("default", () => {
    return (
      <IllustratedContent media={<Icon icon="truck" />}>
        <H3>Shipping within 48h</H3>
      </IllustratedContent>
    );
  })
  .add("with a lot of content", () => {
    return (
      <IllustratedContent media={<Icon icon="truck" />}>
        <H3>Shipping within 48h</H3>
        <Paragraph>
          We are using many delivery services to let you choose what is best for
          you!
        </Paragraph>
      </IllustratedContent>
    );
  })
  .add("with an image", () => {
    return (
      <IllustratedContent
        media={
          <Image src="http://via.placeholder.com/350x150" alt="Placeholder" />
        }
      >
        <H3>Shipping within 48h</H3>
      </IllustratedContent>
    );
  });
```

It has many major benefits such as:

- easily document edge cases
- provide a test suite thanks to snapshot testing
  ([Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots))
- create a common discussion base for designers, product managers, marketers,
  etc.

[Learn more about Storybook.](https://storybook.js.org/)

> Many more steps can be taken to make a better documentation from your stories.
> For instance we use extensively the
> [Knobs addon](https://github.com/storybooks/storybook/tree/be4796bc0bd82886013bab29f91b692f8b773856/addons/knobs)
> and the [README addon](https://github.com/tuchk4/storybook-readme) in
> Front-Commerce.

### Step 4: Use the component

Once we are satisfied with our component, we can use it anywhere. In this case,
the `IllustratedContent` was to be used in the Reinsurance Banner. Thus, this
module's component would look like this:

```jsx
import React from "react";
// Imports can be absolute from `theme`
// or relative to the current file
import InlineCards from "theme/ui/organisms/InlineCards";
import IllustratedContent from "theme/ui/molecules/IllustratedContent";
import Icon from "theme/ui/atoms/Icon";
import { H3 } from "theme/ui/atoms/Typography/Heading";

// The components can then be used the usual React way

export default () => (
  <InlineCards>
    <IllustratedContent media={<Icon icon="truck" />}>
      <H3>Shipping within 48h</H3>
    </IllustratedContent>
    <IllustratedContent media={<Icon icon="thumbsup" />}>
      <H3>Money back guarantee</H3>
    </IllustratedContent>
    <IllustratedContent media={<Icon icon="creditcard" />}>
      <H3>Secured Payment</H3>
    </IllustratedContent>
  </InlineCards>
);
```
