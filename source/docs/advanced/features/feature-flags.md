---
id: feature-flags
title: Feature Flags
---

Some modules in front-commerce have feature flags that are used to enable/disable set module.

### Enabling/Disabling a feature

Typically the feature flag is defined inside the folder of the module in a loader called `featureFlagLoader.js`. So for example the feature flag for the wishlist module on magento1 is located at `src/server/modules/magento1/wishlist/featureFlagLoader.js`.

To enable/disable a feature it is sufficient to update/override the `featureFlagLoader.js` file to return `true` (to enable the feature) or `false` (to disable the feature) when the name matches the module's name. For example setting the below in `src/server/modules/magento1/wishlist/featureFlagLoader.js` will disable the wishlist feature

```js
const WishlistFeatureFlagLoader = (loader) => {
  return {
    ...loader,
    isActive: (name) => {
      if (name === "wishlist") { // only for wishlist
        return Promise.resolve(false);
      } else { // check other modules
        return loader.isActive(name);
      }
    },
  };
};

export default WishlistFeatureFlagLoader;
```

P.S. the `if (name === "wishlist")` above is needed as the feature flag query is queried by module name. And the `return loader.isActive(name);` is needed to propagate the query to other modules.
