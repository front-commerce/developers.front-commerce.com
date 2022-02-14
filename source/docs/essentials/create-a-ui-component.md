---
id: create-a-ui-component
title: Create a UI Component
---

In Front-Commerce components are classified under two categories: the **UI**
components available in the `theme/components` folder, and the business
components available in the `theme/modules` and `theme/pages` folders.

<blockquote class="info">
If you feel the need to understand why we went for this organization, feel
free to refer to [React components structure](/docs/concepts/react-components-structure.html)
first.
</blockquote>

In this documentation, you will learn how to build a UI Component. We will do so by
creating our own. We will use [Storybook](add-component-to-storybook.html) in the process because it is our
usual workflow when creating a UI Component. But if you don't need it or prefer to
add your stories later, feel free to leave the parts mentioning Storybook for later.

Front-Commerce’s core UI components follow the same principles
and you could dive into the [`node_modules/front-commerce/src/web/theme/components`](https://gitlab.com/front-commerce/front-commerce/tree/main/src/web/theme/components)
folder to find examples into our source code.

But first, let's define what is an ideal UI Component.

## The ideal UI Component

In Front-Commerce we call UI component any component that is:

- **Reusable in many contexts**: if a component is used only once in the whole
  application, it might feel like it doesn't exist purely for UI
  purposes. The component most likely needs to be moved to the `web/theme/modules` folder (see [Create a Business Component](./create-a-business-component.html)).
  That's also the reason why we avoid to give names too close to its business
  use. For instance, we don't want to have a UI component that would be called
  `ProductDescription`. It would be better to go for a `Description` that would
  thus be reusable by a Category.
- **Focused on abstracting away UI concerns**: the goal of UI components is to
  hide styles or [<abbr title="Document Object Model">DOM</abbr>](https://fr.wikipedia.org/wiki/Document_Object_Model) concerns from their parents. It may be hard to achieve
  sometimes, but it will greatly improve the parent component's readability. For
  instance, a UI component should not give the opportunity to pass a `className`
  in its props as it may lead to many style inconsistencies across the theme.

## How to build a UI Component?

Alright, that's nice in theory, but how does it translate in practice? First,
we’ll try to get a bit more tangible by creating a UI component for adding
a Reinsurance Banner on a page similar to the following mockup.

![The reinsurance banner that we will implement](assets/reinsurance.jpg)

### Defining the components

First, let's split the mockup in several UI components following the [Atomic Design Principles](http://atomicdesign.bradfrost.com/).

![The various components that will make up our banner](assets/reinsurance-with-areas.jpg)

- **`web/theme/components/atoms/typography/Heading` (green):** enforces consistent font sizes in our theme
  for any title
- **`web/theme/components/atoms/Icon` (purple):** enforces icon sizes and accessibility guidelines
- **`web/theme/components/molecules/IllustratedContent` (red):** displays some content illustrated by an
  image and aligns images consistently across the whole theme
- **`web/theme/components/organisms/InlineCards` (orange):** manages a list of cards and inlines them,
  regardless of the device size.

As you can see, each UI component will take place in the `web/theme/components` folder.
To better understand why, please refer to our [React components structure](/docs/concepts/react-components-structure.html) documentation.

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

### Setup your dev environment

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
  directly. See [this blog post](http://bradfrost.com/blog/post/this-or-that-component-names-index-js-or-component-js/) for more context about this pattern.

  ```jsx
  import IllustratedContent from "./IllustratedContent.js";

  export default IllustratedContent;
  ```

- `my-module/web/theme/components/molecules/IllustratedContent/IllustratedContent.story.js`:
  will add a story to the [Storybook](https://storybook.js.org/) of your
  application. This will serve as living documentation and will allow anyone to
  understand what is `IllustratedContent` used for and how to use it.

  ```jsx
  import React from "react";
  import IllustratedContent from "./IllustratedContent.js";
  import { storiesOf } from "@storybook/react";

  storiesOf("components.molecules.IllustratedContent", module).add(
    "default",
    () => {
      return <IllustratedContent />;
    }
  );
  ```

  <blockquote class="note">
    For a more detailed explanation of how Storybook works in the context of Front-Commerce, please refer to [Add a component to Storybook](./add-component-to-storybook.html).
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
> - about [our Storybook usage](./add-component-to-storybook.html) by reading our documentation

### Implement your component

Now that everything is ready to go, you can do the actual work and implement the
component. In the case of the `IllustratedContent`, it would look like this:

```jsx
// src/web/theme/ui/molecules/IllustratedContent/IllustratedContent.js
import React from "react";
import PropTypes from "prop-types";

const IllustratedContent = ({ media, children }) => (
  <div className="illustrated-content">
    <div className="illustrated-content__media">{media}</div>
    <div className="illustrated-content__content">{children}</div>
  </div>
);

IllustratedContent.propTypes = {
  media: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default IllustratedContent;
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
  align-items: center;
}
.illustrated-content__media {
  width: 30%;
  max-width: 10em;
  text-align: center;
}
```

If it didn't reload properly, it is because you need to restart the application
every time you override a component in order to let the application know that the
file location it should load has changed. But note that there is an upcoming
improvement [#63](https://gitlab.com/front-commerce/front-commerce/issues/63) that
should remove the need for a restart in the future.

<!-- TODO: add a link to our Advanced/Theme/BEM article when it's done. -->
<blockquote class="note">
As a side note, we also use [BEM convention](http://getbem.com/naming/) for our
CSS code base. It makes it easier to avoid naming conflicts by adding a tiny bit
of code convention. However, for your custom components, feel free to code
however you like. There is no obligation here.
</blockquote>

#### Document usage of our component

If our component can have different usages, we should also add new stories along
the default one.

```jsx
// src/web/theme/ui/molecules/IllustratedContent/IllustratedContent.story.js
import React from "react";
import IllustratedContent from "./IllustratedContent.js";
import { storiesOf } from "@storybook/react";
import Icon from "theme/components/atoms/Icon";
import { H3 } from "theme/components/atoms/Typography/Heading";
import { BodyParagraph } from "theme/components/atoms/Typography/Body";
import Image from "theme/components/atoms/Image";


storiesOf("molecules.IllustratedContent", module)
  .add("default", () => {
    return (
      <IllustratedContent media={<Icon icon="calendar-full" />}>
        <H3>Shipping within 48h</H3>
      </IllustratedContent>
    );
  })
  .add("with a lot of content", () => {
    return (
      <IllustratedContent media={<Icon icon="calendar-full" />}>
        <H3>Shipping within 48h</H3>
        <BodyParagraph>
          We are using many delivery services to let you choose what is best for
          you!
        </BodyParagraph>
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

[Learn more about Storybook.](./add-component-to-storybook.html)

### Use the component

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

const ReinsuranceBanner = () => (
  <InlineCards>
    <IllustratedContent media={<Icon icon="calendar-full" />}>
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

export default ReinsuranceBanner;
```

As you can see, we did not use a relative import. This is because in Front-Commerce
we have a few aliases that will let you import files without worrying about your
current position in the folder structure.

In our case, if the `ReinsuranceBanner` was in
`my-module/web/theme/modules/ReinsuranceBanner`, we don't have to import the
`IllustratedContent` by using relative paths
`../../components/molecules/IllustratedContent` but we can remain with
`theme/components/molecules/IllustratedContent` which is more explicit. This is
possible for any file located in the folder `web/theme` of a module. <!-- TODO Add a link to the aliases documentation page -->
