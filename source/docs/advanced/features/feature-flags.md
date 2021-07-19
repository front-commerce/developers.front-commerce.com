---
id: feature-flags
title: Feature Flags
---

Some modules in Front-Commerce use feature flags to enable or disable its features.

## Enabling or Disabling a feature

Feature flags are resolved by the [FeatureFlagLoader](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/server/modules/front-commerce/core/loaders.js#L7) which is typically overrided in the [`contextEnhancer`](/docs/reference/graphql-module-definition.html#contextEnhancer-optional) of each module supporting a feature flag (e.g. [wishlist](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/server/modules/magento2/wishlist/index.js#L21), [search](https://gitlab.com/front-commerce/front-commerce/-/blob/main/src/server/modules/front-commerce/search/index.js#L41)).

To enable or disable a feature one must update the overriden `FeatureFlag` loader in the `contexEnhancer` of the module and ensure `isActive` returns `true` (to enable the feature) or `false` (to disable the feature) ONLY when the name matches the feature flag's name. For example setting the below in `src/server/modules/magento1/wishlist/featureFlagLoader.js` (used in the wishlist context enhancer) will disable the wishlist feature.

```js
const WishlistFeatureFlagLoader = (loader) => {
  return {
    ...loader,
    isActive: (name) => {
      if (name === "wishlist") {
        // only for wishlist
        return Promise.resolve(false);
      } else {
        // check other modules
        return loader.isActive(name);
      }
    },
  };
};

export default WishlistFeatureFlagLoader;
```

P.S. the `if (name === "wishlist")` above is needed as the feature flag query is queried by module name. And the `return loader.isActive(name);` is needed to propagate the query to other modules.
