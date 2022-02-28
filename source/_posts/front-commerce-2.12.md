---
title: "2.12: Magento’s Page Builder out of beta, Requisition Lists and Teams management for Adobe Commerce B2B and CDN availability for all Front-Commerce Cloud projects"
date: 2022-01-06
---

**Happy New Year everybody! All the best for your professional and personal projects!**

At Front-Commerce, we start the year by providing you with new features available in B2B for Adobe Commerce. Requisition Lists are now available, allowing you to save items in a way that is far more efficient than with wishlists, and you can now manage your teams and users using a nice drag and drop tool!

We’ve stepped up our cloud game with our brand new partner Akamai!

You’ll also discover the password strength display feature, to enhance the password experience of your user, as well as new components available for the Page Builder for Front-Commerce.

We have also included various changes and bug corrections, to always improve **your Front-Commerce experience!**

The beginning of 2022 will come with a lot of new things at Front-Commerce: should you have any requests regarding the product roadmap, do not hesitate to contact Josquin 👋

<p class="center">
  <a class="link primary button" href="https://calendly.com/josquin-front-commerce/30min">Schedule a 30min meeting in Josquin's agenda: coffee is on us ☕</a>
</p>

<!-- more -->

## B2B for Adobe Commerce: allow your clients to manage their company from Front-Commerce

### Requisition lists

By using requisition lists, customers can save time when ordering products that are frequently required, as the items can be added to the shopping cart directly from the list. Users can handle multiple lists that focus on products from various suppliers, buyers, teams ...

The requisition list feature is similar to wish lists but they can be used multiple times and the user interface is more adapted to a large number of items

<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/1ec2c4e2fc6b4f7d944400f6a0b29e8f" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

### Company Structure

With the company structure page, account management remains easy for big company administrators: starting from the Company Administrator, the tree structure can be expanded to include teams of users. The users can be associated with teams or organised within a hierarchy of divisions and subdivisions within the company!

<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/26c6591245a84bd1a512c45e0b3bf42f" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

### Quick add to cart

To help B2B users purchase items more efficiently, we have imagined a Quick Add To Cart Component that can be added pretty much anywhere on a website, allowing to search items by SKU and product name and quickly add them to the cart, rather than browsing the categories pages (especially when you already know what you want!)

The component leverages Front-Commerce search modules to offer the same search experience as the main search bar.

## UI new feature: Password Strength display

We’ve improved password inputs in several screens of our default themes. Password inputs now allow a user to view the entered password, and its strength is hinted as the user types. This new component works as an indicator to display the strength of the password used by the customer during registration. It helps the user know if the password is strong enough, as well as the level of difficulty to crack it in case of a security breach.

<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/e63e74e3f5b74ee88500891f0ea543ae" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Milliseconds matter: Akamai’s CDN brings Front-Commerce Cloud projects closer to their visitors

At Front-Commerce, we do everything we can to help you scale your e-commerce without limits. Our mission is to help you build best-of-breed and fast front-end experiences for your customers.

Edge computing is opening many opportunities in the way websites are delivered. Having a CDN as part of our Front-Commerce Cloud default offer is a huge step forward for your storefront.

We’ve partnered with Akamai, [the 6th most performant CDN](https://www.cdnperf.com/) provider in the world to make your storefront globally available in [more than 135 countries](https://www.akamai.com/visualizations/media-delivery-network-map), a few milliseconds away from your visitors.

We’re stepping up to the next level, helping you cherish your [Core Web Vitals](https://web.dev/defining-core-web-vitals-thresholds/) while being able to follow your growth and handle peak loads seamlessly!

<p class="center">
  ℹ️ Want to know more?<br />
  <a class="link primary button" href="https://www.front-commerce.com/contact/">Contact our sales team!</a>
</p>
## Page Builder upgraded

In Front-Commerce 2.11 version, we released a first basic version of the [Adobe Page Builder for Front-Commerce](/docs/magento2/page-builder.html): our strategy runs its course with first improvements!

You now can use the following components end content types, from the Page Builder and rendered in Front-Commerce:

- HTML content type
- Slider
- Image
- Row Background images and styles
- Map content type

We have also improved the way existing content types work, adding some new parameters from the Page Builder (as a reminder, text, heading, divider and row were already handled)

Your feedback is precious, do not hesitate to contact us to share your needs and identified axis of improvement

## Other changes

- **Dependencies**: we’re continuing to upgrade dependencies to their latest versions, see [the 28 Merge Requests of 2.12](https://gitlab.com/front-commerce/front-commerce/-/merge_requests?scope=all&state=merged&label_name[]=depfu&milestone_title=2.12)
- **DX:** `reorderForIds` related messages are now displayed as `DEBUG=axios` messages. Your logs will ❤️ it!
- **Analytics:** the consent cookie is now valid for 12 months by default
- **Adyen:** we’ve improved how payments including an embedded challenge are handled for Magento1
- **Wysiwyg:** document hierarchy is now kept unchanged (no intermediary DOM level added anymore)
- **Server:** the protocol (http/https) is now displayed in the server start log
- **UI:** custom components are now supported for `<Heading>` `as` prop
- **Image proxy**: several improvements and fixes were brought during this release
  - the image proxy now always send the remote response content in case of error
  - images with decimal dimensions are now always resized properly
  - sharp was updated to better support some recent source formats
  - binary file content-types are now used instead of file extensions to validate supported images
  - improved DX by logging an error when image resizing fails
- **Bug fixes:**
  - **a11y:** the autocomplete now has a correct `aria-owns` attribute usage
  - **address:** the country field is now correctly initialized in an empty state so users see the placeholder
  - **analytics:** the “Product View List” event is now triggered properly when revisiting a category page within the same navigation scenario
  - **graphql:** fixed GraphQL directives so that `@magentoConfig` works with recent `graphql` dependencies versions
  - **types:** we’ve fixed several propTypes and JSDoc types across the codebase
  - **ui:** disabled buttons are now consistent no matter their status (i.e: active)

Fixes from the 2.12 version have also been backported into previous minor versions. The following patch versions were released:
[2.4.10](https://gitlab.com/front-commerce/front-commerce/-/releases/2.4.10),
[2.5.6](https://gitlab.com/front-commerce/front-commerce/-/releases/2.5.6),
[2.6.4](https://gitlab.com/front-commerce/front-commerce/-/releases/2.6.4),
[2.7.5](https://gitlab.com/front-commerce/front-commerce/-/releases/2.7.5),
[2.8.6](https://gitlab.com/front-commerce/front-commerce/-/releases/2.8.6),
[2.9.5](https://gitlab.com/front-commerce/front-commerce/-/releases/2.9.5)
[2.10.3](https://gitlab.com/front-commerce/front-commerce/-/releases/2.10.3).
and [2.11.1](https://gitlab.com/front-commerce/front-commerce/-/releases/2.11.1).

<hr />
<div class="center">
  <p>
    <a class="link primary button" href="https://www.front-commerce.com/contact/">💌 Ask your questions about Front-Commerce</a>
  </p>
  <p>
    [Upgrade to Front-Commerce 2.12.0](/docs/appendices/migration-guides.html#2-11-0-gt-2-12-0) or [read the full changelog (Customers only)](https://gitlab.com/front-commerce/front-commerce/-/releases/2.12.0)
  </p>
</div>
