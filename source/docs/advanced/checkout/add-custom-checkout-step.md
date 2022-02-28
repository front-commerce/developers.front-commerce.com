---
id: add-custom-checkout-step
title: Add a custom checkout step
---

The checkout is one of the most complex parts of any e-commerce website. It is full of rules and easy to be in an invalid step. If you use a relatively standard checkout (shipping/billing address, shipment methods, payment methods and place order), you hopefully won't have to change anything more than a few components to adapt them to your look and feel.

However, if you need to add a custom step, you'll need to change a few things.

## Add a new step to the checkout

The steps available in the checkout are defined in the file `theme/pages/Checkout/stepsDefinition.js`. Each step is defined by the following values:

```jsx
{
  // what should be displayed when showing the user the list of steps in a checkout
  renderProgressItem: (stepStatus, checkoutState) => ReactElement,
  // what should be displayed inside a step (mostly some forms relevant to your step)
  renderStep: props => ReactElement,
  // is the step finished (has the user defined all the data mandatory in your step ?)
  isValid: checkoutState => Boolean
  // is the step useful for this checkout state (should we display this step ?)
  isRelevant: () => Boolean,
  // unclear what the difference is between isRelevant/isDisplayable, should be cleaned in future releases
  isDisplayable: () => Boolean
}
```

The checkoutState variable is all the data gathered from the user's input. It'll grow from step to step by adding addresses, shipping methods and payment methods. The best way to understand what has been set in a checkoutState is to look at the handlers set in `EnhanceCheckout.js` (setShippingAddress, setBillingAddress, etc.).

Thus, if we want to add our own step, we need to duplicate the `stepsDefinitions.js` and add our step following the above documentation.

### Add a comment step to your Checkout

In order to illustrate this concept, we will add a new step which will enable the user to leave a comment with their command.

<blockquote class="wip">
**Work In Progress:** we didn't add the example yet. If you need it right away, please <span class="intercom-launcher">[contact us](mailto:support@front-commerce.com)</span>. We will make sure to answer you in a timely manner.
</blockquote>

## Changing the whole checkout system

In some cases, you may not need to use the default steps available in Front-Commerce. However, it might still be interesting to reuse the mechanisms used by Front-Commerce's checkout. Indeed, any checkout will have this concept of steps. And since the steps definition is not coupled to our Enhancer, you can reuse it for your own project.

To do so, you will need to reuse the `theme/modules/Checkout/withMultiStep` enhancer file defined in [`node_modules/front-commerce/src/web/theme/modules/Checkout/withMultiStep/`](https://gitlab.com/front-commerce/front-commerce/tree/85f1a8ef55a351f0feb9309c666992bbbb153993/src/web/theme/modules/Checkout/withMultiStep).

This enhance takes 4 arguments:

- `steps`: the steps definition as explained in the first part
- `handlers`: the methods that should update the checkoutState. The goal is to have predictable methods to update the checkoutState
- `initCheckoutState={}`: the initial checkoutState when the user opens the Checkout
- `hasPersistantState=false`: defines if the state should be stored in the url state of the browser. This allows the user to refresh the page without losing the whole page, but depending on the data you store inside your checkoutState, that might not be possible

We also advise you to look at [`theme/components/templates/MultiStep`](https://gitlab.com/front-commerce/front-commerce/tree/85f1a8ef55a351f0feb9309c666992bbbb153993/src/web/theme/components/templates/MultiStep) template that will let you reuse the props created by `withMultiStep` and display them in a React Component with a progress bar and the current step.
