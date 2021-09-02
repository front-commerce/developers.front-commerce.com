---
id: display-a-map
title: Display a map
---

Front-Commerce has a generic map component that can be used by modules to display maps. Since we are well aware that different shops come with different needs, we provide several implementations out of the box:

- [Open Street Map with Leaflet](#Open-Street-Map-OSM-with-Leaflet)
- [Google Maps](#Google-Maps)

The goal is to choose one to make sure that all maps accross the website look the same.

### Open Street Map (OSM) with Leaflet

<blockquote class="important">
  <strong>Known issue:</strong>
  using `react-leaflet` v3.2.0 is known for generating an issue in Front-Commerce because of Webpack4 usage. This issue [has been identified in the library](https://github.com/PaulLeCam/react-leaflet/issues/883) and a [Pull Request is awaiting approval](https://github.com/PaulLeCam/react-leaflet/pull/885). Until it is fixed, or Front-Commerce has migrated to Webpack5 please use `react-leaflet` v3.1.0.
</blockquote>

If you want to use Open Street Map, you will need to follow these steps:

- install the required libraries

```shell
npm install leaflet@^1.7 react-leaflet@3.1.0 @react-leaflet/core@1.0.2
```

- register the module in your application. Edit your `.front-commerce.js` as below:

```diff
// .front-commerce.js
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: [
+    "./node_modules/front-commerce/modules/map-leaflet",
    "./node_modules/front-commerce/theme-chocolatine",
    "./src"
  ],
  serverModules: [
```

- Allow images coming from openstreetmap.org in `src/config/website.js::contentSecurityPolicy`

```diff
// src/config/website.js
module.exports = {
  // ...
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [],
      frameSrc: [],
      styleSrc: [],
-      imgSrc: [],
+      imgSrc: ["*.openstreetmap.org"],
      connectSrc: [],
      baseUri: [],
    },
  },
  // ...
}
```

- restart the application

This should be it. You should be able to use the Map component. See [Map.story.js](https://gitlab.com/front-commerce/front-commerce/-/blob/main/modules/map-leaflet/web/theme/components/organisms/Map/Map.story.js) for details. _Please keep in mind, that the Map component should be used in an element with a fixed height._

### Google Maps

> Before choosing Google Maps, please ensure that you have an API key available. If you don't, you can create one by following [this documentation](https://developers.google.com/maps/documentation/javascript/get-api-key#creating-api-keys).

- install the required libraries

```shell
npm install @react-google-maps/api@2
```

- register the module in your application. Edit your `.front-commerce.js` as below:

```diff
// .front-commerce.js
module.exports = {
  name: "Front Commerce DEV",
  url: "http://www.front-commerce.test",
  modules: [
+    "./node_modules/front-commerce/modules/map-googlemap"
    "node_modules/front-commerce/theme-chocolatine",
    "./src"
  ],
  serverModules: [
```

- Configure your [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) in the `mapsKey` of your applications `config/website.js`.
  If you don't do this step, you will see an error overlay as shown below and the map will be for development use only:
  ![The interface of Google Maps with an alert explaining Google Maps couldn't load properly](/images/google-maps-no-api-key.png)

- restart the application

This should be it. You should be able to use the Map component. See [Map.story.js](https://gitlab.com/front-commerce/front-commerce/-/blob/main/modules/map-googlemap/web/theme/components/organisms/Map/Map.story.js) for details. _Please keep in mind, that the Map component should be used in an element with a fixed height._
