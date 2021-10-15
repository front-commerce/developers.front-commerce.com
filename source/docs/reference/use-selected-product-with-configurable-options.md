---
id: use-selected-product-with-configurable-options
title: useSelectedProductWithConfigurableOptions
---

In the 2.10.0 release we refactored product configurable options and homogeneized their use by creating `useSelectedProductWithConfigurableOptions`.

`useSelectedProductWithConfigurableOptions` accepts multiple formats for initial selected options and returns -among other things- an options update function that automatically handles relevant images selection and auto disabling. We believe this hook will be helpful when dealing with configurable product options so here is a small rundown on of it:

### Inputs

`useSelectedProductWithConfigurableOptions` takes the following inputs:

- The product
- The initial selected options (with one of the following formats `{ [optionId]: valueId }` or `{ [attribute or label], [value or optionValue] }`)

### Output

`useSelectedProductWithConfigurableOptions` returns an `Object` with the following properties:

- `selectedProduct`: The selected product (does not change the sku of the input product)
- `setOption`: A function to set an option
- `selectedOptions`: The current selected options in the format `{ [optionId]: valueId }`
- `baseProduct`: The base product (that the selected product is part of)
- `selectedSku`: The sku of the selected product
