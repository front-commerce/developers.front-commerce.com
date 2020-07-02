---
id: remote-schema-helpers
title: Remote schema helpers
---

This page references the helpers available when creating a [Remote GraphQL module](/docs/reference/graphql-module-definition.html#executor-optional).

## `makeExecutor`

While one can create their own executors from scratch by following [Creating an executor](https://www.graphql-tools.com/docs/remote-schemas/#creating-an-executor), we have created a `makeExecutor` with sane defaults.

It will create an executor that will:

* prepare the fetcher to query a GraphQL schema using the POST method
* log errors coming from the remote schema using winston
* forward the client IP to ensure better logging on the remote service

The `makeExecutor` takes two parameters:

* `uri` (`string | (fetchOptions, graphQLExecutionInfo) => string`): The URI where the Remote GraphQL schema lives. It can either be a string or a function if the URI can change based on the user's request (ex: language, store id, etc.) 
* `options` (`object`): An optional object containing the following keys:
    * `fetcher` optional: The fetcher used to execute the request. By default it is `isomorphic-fetch`
    * `fetchOptionsAdapter` optional (`(fetchOptions) => fetchOptions`): transforms the options passed to the `fetcher` when executing the request
    * `logger` optional: The logger used to display fetch warnings (DX messages meant to catch errors early). This is not likely to be used in your case. By default it's the common logger used in Front-Commerce.

The result should be used in a GraphQL module in [`remoteSchema.executor`](/docs/reference/graphql-module-definition.html#executor-optional).