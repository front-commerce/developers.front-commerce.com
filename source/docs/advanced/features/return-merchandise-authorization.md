---
id: return-merchandise-authorization
title: Return Merchandise Authorization
---

# Return Merchandise Authorization (RMA)

<blockquote class="feature--new">
_Since version 2.5_
</blockquote>

Return Merchandise Authorization (RMA) provides a customer with the means to request a return of an order or part of an order. In Front-Commerce we provide a base platform agnostic module to support RMA. We also ship some platform specific implementations for RMA (so far we have an implementation for Magento1 Enterprise). It is up to the integrator to either use one of our provided implementations that suits his platform or extend our base RMA module to add functionality to his specific platform.

## Front-Commerce base RMA module

The base RMA module is located at `src/server/modules/front-commerce/rma` it contains the basic GraphQL schema and empty resolver implementation. This module is all you need to know what is required to implement an RMA module that supports your platform.

## The frontend implementation

The frontend implementation of the RMA is shipped with the Front Commerce themes. You can have a look at its implementation in `src/web/theme/pages/Account/Orders/Details/ReturnForm` should you need to override its behaviour.

## Implementing an RMA that suits you

To implement an RMA for a new platfom, you have to provide the server implementation of the Graph. Having a look at Front-Commerce's implementation for Magento1 Enterprise RMA (`src/server/modules/magento1ee/rma`) should help give you some guidance. Here is a short summary of what is needed:

### Extending necessary GraphQL enums

1. Extend the `ReturnMerchandiseAuthorizationStatus` enum with all the possible statuses that an RMA could have.
2. Extend the `ReturnedItemStatus` enum with all the possible statuses a returned item can have.

### Providing necessary resolver functions

1. implement the `createReturnMerchandizeAuthorizationRequest` mutation. The `createReturnMerchandizeAuthorizationRequest` mutation will receive a variable called `input` of type `CreateReturnMerchandizeAuthorizationRequestInput` and returns a `CreateReturnMerchandizeAuthorizationOutput` which is a `MutationSuccessInterface` with an extra `order` field representing the current order.
1. implement the field `returns` of the type `Order`. This field should return all returned items belonging to this order. (please note that a `return` object has `items` fields this is due to the fact that some products have bundled items and it is sometimes possible to return some of those items).
1. implement `isReturnable` field of the type `Order`. This should return true in case the order has returnable items.
1. implement `isReturnable` field of the type `OrderItem`. This should return true in case the item is returnable.
1. implement `returnAttributes` field of the type `OrderItem`. Note: a `returnAttribute`'s type is the interface `ReturnAttribute` it is up to the integrator to resolve the `returnAttribute`'s type.
1. implement `returns` field of the type `Customer` this should return all returns belonging to the parent customer.

## The create RMA page

We ship a page that is used to create an RMA. The link to this page will show up in the order details page after you have implemented resolvers related to RMA.
