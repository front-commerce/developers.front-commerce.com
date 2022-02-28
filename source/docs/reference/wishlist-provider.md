---
id: wishlist-provider-reference
title: Wishlist provider
---

<blockquote class="feature--new">
  _This feature has been added in version `2.6.0`_
</blockquote>

# The WishlistProvider

The wishlist provider was introduced in Front-Commerce in version 2.6.0 to unify, simplify and optimise wishlist related queries. To enable the wishlist provider please refer to the [migration guide](/docs/appendices/migration-guides). The wishlist provider supports the following functionalities:

## Check if wishlist is enabled

This is achieved by the use of the `useIsWishlistEnabled` hook. The hook will return a boolean indicating if the wishlist feature is enabled or not. A common usage example:

```jsx
const MyComponent = () => {
  const isWishlistEnabled = useIsWishlistEnabled();
  if (isWishlistEnabled) {
    return <div>Wishlist is enabled!</div>;
  }
  return <div>Wishlist is NOT enabled :(</div>;
};
```

## Load wishlist

This is achieved by the use of the `useLoadWishlist` hook. The hook will return an Object with the attributes `loading` or `error` or `wishlist` depending on the query status. A common usage example:

```jsx
const MyComponent = () => {
  const { loading, error, wishlist } = useLoadWishlist();
  if (loading) {
    return <div>Loading Wishlist...</div>;
  }
  if (error) {
    return <div>Error Loading Wishlist :(</div>;
  }
  if (!wishlist) {
    return <div>Wishlist feature is disabled</div>;
  }
  return <div>you have {wishlist.items.length} items in your wishlist</div>;
};
```

## Load wishlist item by sku

This is achieved by the use of the `useLoadWishlistItem` hook. The hook will return an Object with the attributes `loading` or `error` or `isInWishlist`, `wishlistItem` depending on the query status. A common usage example:

```jsx
const MyComponent = ({ sku }) => {
  const { loading, error, isInWishlist, wishlistItem } =
    useLoadWishlistItem(sku);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error Loading Wishlist :(</div>;
  }
  if (!isInWishlist) {
    return <div>Product is NOT in your wishlist</div>;
  }
  return <div>Product is in your wishlist</div>;
};
```

# The WishlistDecorator

When developing stories for components using the `WishlistProvider`'s hooks you need to add the `WishlistDecorator` above the `ApolloDecorator` in your story as follows:

```jsx
  ...
  .addDecorator(WishlistDecorator)
  .addDecorator(ApolloDecorator(mocks))
  ...
```

## Providing fake values for your story

The `WishlistDecorator` also exports a named export called `wishlistMeFakeValues`. You should use `wishlistMeFakeValues` to provide a mock for the `me` field in the `ApolloDecorator` mocks as follows:

```
  ...
  .addDecorator(WishlistDecorator)
  .addDecorator(
    ApolloDecorator({
      Query: () => ({
        isFeatureActive: () => true,
        me: wishlistMeFakeValues("sku1", "sku2", ...),
      }),
    })
  )
  ...
```

`wishlistMeFakeValues` takes skus as input and will generate a wishlist with items corresponding to the skus sent. For example the following call `wishlistMeFakeValues("sku1", "sku2")` will generate:

```json5
{
  id: 12, // user id
  wishlist: {
    id: "10",
    items: [
      {
        id: 1, // item ids start at 1 and auto increment
        product: {
          sku: "sku1"
        }
        __typename: "WishlistItem",
      },
      {
        id: 2,
        product: {
          sku: "sku2"
        }
        __typename: "WishlistItem",
      }
    ]
    itemsQuantity: 2,
    isShareable: false,
  }
}
```
