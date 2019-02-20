---
id: create-a-ui-component
title: Create a UI Component
---

In Front Commerce we split our components in two categories: the **UI**
components available in the `theme/components` folder, and the business
components available in the `theme/modules` and `theme/pages` folders.

<blockquote class="info">
If you feel the need to understand why we went for this organization, feel
free to refer to [React components structure](#TODO)
first.
</blockquote>

In this documentation, you will learn how to build a UI Component. We will do so by
creating our own. Front-Commerce’s core UI components follow the same principles
and you could dive into the `node_modules/front-commerce/src/web/theme/components`
folder to find examples into our source code.

But first, let's define what is an ideal UI Component.

## The ideal UI Component

In Front-Commerce we call UI component any component that is:

- **Reusable in many contexts** If a component is used only once in the whole
  application, it might be the sign that it does not exist purely for UI
  purpose. The component most likely needs to be moved to the `theme/modules` folder.
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

![The reinsurance banner that we will implement](assets/reinsurance.jpg)

### Step 1: Defining the components

First, let's split the mockup in several UI components.

![The various components that will make up our banner](assets/reinsurance-with-areas.jpg)

- **`theme/components/atoms/typography/Heading`:** enforces consistent font sizes in our theme
  for any title
- **`theme/components/atoms/Icon`:** enforces icon sizes and accessibility guidelines
- **`theme/components/molecules/IllustratedContent`:** displays some content illustrated by an
  image and aligns images consistently across the whole theme
- **`theme/components/organisms/InlineCards`:** manages a list of cards and inlines them,
  regardless of the device size.

<blockquote class="note">
If you have trouble splitting your mockups, you can refer to
[Thinking in React](https://reactjs.org/docs/thinking-in-react.html) in the
official React documentation or to
[Brad Frost's book about Atomic Design](http://atomicdesign.bradfrost.com/).
You may want to organize your code differently and that's perfectly fine. The
way we splitted things here is one of many possible solutions. Such choices
will depend on your project and your team. It may be a better idea to keep
things simple. It's often easier to wait and see how it can be reused later.
</blockquote>

We won't be able to detail each component here. We will focus on
`theme/components/molecules/IllustratedContent` instead. But keep in mind that
any UI component in Front-Commerce will look similar to what we are going to
build here.

### Step 2: Setup your dev environment

Before doing the actual work let's bootstrap our dev environment. To do so,
once you've [registered your module](extend-the-theme.html#Configure-your-custom-theme-and-use-it-in-your-application) you will need to create three files:

- `my-module/web/theme/components/molecules/IllustratedContent/IllustratedContent.js`: will be
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

- `my-module/web/theme/components/molecules/IllustratedContent/index.js`: will proxy the
  IllustratedContent.js file in order to be able to do imports on the folder
  directly.

  ```jsx
  import IllustratedContent from "./IllustratedContent.js";

  export default IllustratedContent;
  ```

- `my-module/web/theme/components/molecules/IllustratedContent/IllustratedContent.story.js`:
  will add a story to the [Storybook](https://storybook.js.org/) of your
  application. This will serve as living documentation and will allow anyone to
  understand what is `IllustratedContent` used for and how to use it.

  ```jsx
  import IllustratedContent from "./IllustratedContent.js";
  import { storiesOf } from "@storybook/react";

  storiesOf("components.molecules.IllustratedContent", module).add("default", () => {
    return <IllustratedContent />;
  });
  ```
  <blockquote class="note">
    For a more detailed explanation of how Storybook works in the context of Front-Commerce, please refer to [Add a component to Storybook](#TODO).
  </blockquote>

Once you've added your component, you must restart the styleguide (`npm run styleguide`). And once it is up and running, you can view your new story in `components > molecules > IllustratedContent`.

Now that you've done that, you can edit the `IllustratedContent` component, save,
and view changes live in your browser.

<figure style="margin: 1em 0; max-width: 50rem;">
<img src="https://raw.githubusercontent.com/storybooks/storybook/69b91f6e53d62c73cc76fff00443fe5eb3a9a8b9/app/react/docs/demo.gif" alt="Demo of Storybook hot reloading" />
<figcaption style="margin: 0.5em; text-align: center">Take a look at this magical development playground!</figcaption>
</figure>

> Learn more:
>
> - about Storybook itself by reading the
>   [official Storybook documentation](https://storybook.js.org/basics/introduction/)
> - about [our Storybook usage](#TODO) by reading our documentation

### Step 3: Implement your component

Now that everything is ready to go, you can do the actual work and implement the
component. In the case of the `IllustratedContent`, it would look like this:

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

If you need to style things with CSS, you have to import the new CSS file in
the file listing every style used in the UI components: `theme/components/_components.scss`.
This will allow you to manage the import order of your stylesheets. Some more stylesheet
entries can be found in `theme/modules/_modules.scss`, `theme/pages/_pages.scss` and
`theme/main.scss`. Depending on the component you are styling, it might make more sense
to use these stylesheets instead.

<blockquote class="note">
Please note here that we are using [Sass](https://sass-lang.com/) (hence the
`.scss` extension). We believe that it is easier for developers new to the
React Ecosystem to remain with this well-known CSS preprocessor.
</blockquote>

To import your own stylesheet in `theme/components/_components.scss`, you will need
to override it from the base theme, like we did in [Extend the theme](extend-the-theme.html).

```bash
mkdir -p my-module/web/theme/components/
cp node_modules/front-commerce/src/web/theme/components/_components.scss my-module/web/theme/components/_components.scss
```

Once it is done, you can add your stylesheet to the existing list.

```scss
// my-module/web/theme/components/_components.scss

// ... import your IllustratedContent.scss at the end of this file
import "./molecules/IllustratedContent/IllustratedContent";
```

```scss
// my-module/web/theme/components/molecules/IllustratedContent/_IllustratedContent.scss
.illustrated-content {
  display: flex;
  flex-direction: column;
}
.illustrated-content__media {
  width: 30%;
  max-width: 10em;
}
```

If it didn't reload properly, it is because you need to restart the application
every time you override a component in order to let the application know that the
file location it should load has changed. But note that there is an upcoming
improvement [#63](https://gitlab.com/front-commerce/front-commerce/issues/63) that
should make things for you in the future.

As a side note, we also use [BEM convention](http://getbem.com/naming/) for our
CSS code base. It makes it easier to avoid naming conflicts by adding a tiny bit
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

- document edge cases
- provide a test suite thanks to snapshot testing
  ([Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots))
- create a common discussion base for designers, product managers, marketers,
  etc.

[Learn more about Storybook.](#TODO)

### Step 4: Use the component

Once you are satisfied with your component, you can use it anywhere. In this case,
the `IllustratedContent` was to be used in the Reinsurance Banner. Thus, this
module's component would look like this:

```jsx
import React from "react";
import InlineCards from "theme/components/organisms/InlineCards";
import IllustratedContent from "theme/components/molecules/IllustratedContent";
import Icon from "theme/components/atoms/Icon";
import { H3 } from "theme/components/atoms/Typography/Heading";

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

