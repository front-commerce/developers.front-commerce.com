---
id: return-merchandise-authorization
title: Return Merchandise Authorization
---

# Return Merchandise Authorization (RMA)

<blockquote class="feature--new">
_Since version 2.5_
</blockquote>

Return Merchandise Authorization (RMA) provides a customer with the means to request a return of an order or part of an order. In Front Commerce we provide a base platform agnostic module to support RMA. We also ship some platform specific implementations for RMA (so far we have an implementation for Magento1 Enterprise). It is up to the integrator to either use one of our provided implementations that suits his platform. Or extend our base RMA module to add functionality to his specific platform.

## Front Commerce base RMA module

The base RMA module is located at `src/server/modules/front-commerce/rma` it contains the basic GraphQL schema and empty resolver implementation. This module is all you need to know what is required to do to implement an RMA module that supports your platform.

## The frontend implementation

The frontend implementation of the RMA is shipped with the Front Commerce themes. You can have a look at its implementation in `src/web/theme/pages/Account/Orders/Details/ReturnForm` should you need to override its behaviour.

## Implementing an RMA that suits you

All you need to do to implement an RMA that suits you is provide the server implementation needed for your specific platform/case. Having a look at Front Commerce's implementation of the Magento1 Enterprise RMA (`src/server/modules/magento1ee/rma`) should help give you some guidance. Here is a short summary of what is needed:

### Extending necessary GraphQL enums

1. Extend the `ReturnMerchandiseAuthorizationStatus` enum with all the possible statuses that an RMA could have.
2. Extend the `ReturnedItemStatus` enum with all the possible statuses an returned item can have.

### Providing nessessary resolver functions

1. implement the `createReturnMerchandizeAuthorizationRequest` mutation. The `createReturnMerchandizeAuthorizationRequest` mutation will recieve and variable called `input` of type `CreateReturnMerchandizeAuthorizationRequestInput` and expects a `CreateReturnMerchandizeAuthorizationOutput` which is a `MutationSuccessInterface` with an extra `order` field representing the current order.
1. implement the field `returns` of the type `Order`. This field should return all returned items belonging to this order. (please note that a `return` object has `items` fields this is due to the fact that some products have bundled items and it is sometimes possible to return some of those items).
1. implement `isReturnable` field of the type `Order`. This should return true in case the order has returnable items.
1. implement `isReturnable` field of the type `OrderItem`. This should return true in case the item is  returnable.
1. implement `returnAttributes` field of the type `OrderItem`. Note: a `returnAttribute`'s type is the interface `ReturnAttribute` it is up to the integrator to resolve the `returnAttribute`'s type.
1. implement `returns` field of the type `Customer` this should return all returns belonging to the parent customer.

## The create RMA page

We ship a page that is used to create a RMA. This page is located on `/user/orders/{orderId}/returns/create` you can link to this page to make the user create an RMA for a specific order. This page its used by default by the order details page provided by Front Commerce themes. This means out of the box -after you have implemented the necessary requirements for an RMA- you should have a return action on orders that supports it.
