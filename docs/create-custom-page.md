---
id: create-custom-page
title: Create a custom page
---

When creating an online store, you often have to create whole new pages specific to your store.

Let's look at how it works by adding a "Hello World" page to Front Commerce Lite. This page will be accessible by accessing to `/greetings` and will display `Hello World`.

## TL;DR

In order to do so, we need to:

1. Create our component page in our theme
2. Define the associated route in our router

## 1. Create a new page component

First, let's create a new component in our theme. This component will be the one telling our application what to display on the `/greetings` page.

In order to keep our code clean, we will put this component into the `pages` folder of our theme: `src/web/theme/pages/<our-page>.js`.

> **Front Commerce Licensed:** If we're using the paid version, the page should be added at the same path but within our custom module rather than in core modules.

Once created, this component should render a basic "Hello World" message.

```js
// src/web/theme/pages/Greetings.js
import React, { Component } from "react";
import { H1 } from "theme/components/atoms/Typography/Heading";

class Greetings extends Component {
  render() {
    return <H1>Hello world</H1>;
  }
}

export default Greetings;
```

## 2. Define the associated route

Once the component is created, we must declare our new route. A route is React element that specifies what to display if a specific path is matched. In our case, we want it to render the `Greetings` component when the user is on `/greetings` URL. It uses [React Router](https://reacttraining.com/react-router/web/guides/philosophy), the most popular routing library in the React ecosystem.

It looks like this:

```js
import Route from "react-router/Route";
import Greetings from "theme/pages/Greetings";

<Route
  path="/greetings" // The URL that should display our page
  render={() => <Greetings />} // what page to render rendered
/>
```

But we can't just use it out of the blue. It must be included in our app. In Front Commerce Lite's case, it needs to be done in the file that defines the routes available in the application: `src/web/theme/Routes.js`.

```js
// ... imports
import Greetings from "theme/pages/Greetings";
import Route from "react-router/Route";

export default () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/greetings" // The URL that should display our page
        render={() => <Greetings />} // what page to render rendered
      />
      {/* Other routes here */}
    </Switch>
  </BrowserRouter>
);
```

You can now navigate to [http://localhost:8080/greetings](http://localhost:8080/greetings) and it should render your fantastic `Hello World` message!

> In case you are using Front Commerce's Licensed version, there is no such root file since routes need to be aggregated from different modules. To solve this, we need to create a `web/routes.js` file within our custom module and export a list of custom routes from it. It would look like this:
> 
> ```js
> import React from "react";
> import Route from "react-router/Route";
> import Greetings from "theme/pages/Greetings";
> 
> export default () => [
>   <Route
>     key="greetings"
>     path="/greetings" // The URL that should display our page
>     render={() => <Greetings />} // what page to render rendered
>   />
> ];
> ```

Once you have a custom page up and running, feel free to change the page component (`Greetings`) however you want. You can make it fetch data, render data, send a mutation… Afterall, it's a component. It will work exactly the same way as any other component in your application.