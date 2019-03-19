---
id: media-middleware
title: Optimize your media
---

One of the tough things to do when doing responsive websites is to have images that match your user's screen. Especially when content is contributed by a wide range of people that aren't fully aware of the impact their actions can have on the user's experience.

To solve this issue, Front-Commerce has what we call a media middleware. It is a proxy that will fetch your media from your upload server (Magento, Wordpress, etc.) resize it to the requested size, cache it, and send it back to the user request. This is kind of like the service of [Cloudinary](https://cloudinary.com/documentation/responsive_images).

<blockquote class="note">
This method has two advantages:
<ul>
<li>you no longer need to expose your backend since it will be the Front-Commerce server that will fetch the image on your backend server</li>
<li>you have better performance with correctly cached and sized images</li>
</ul>
</blockquote>

## How to configure it?

First you need to decide where the proxy can fetch the original images. There are two env variables to set:
* `FRONT_COMMERCE_MAGENTO_ENDPOINT`: the url of your magento endpoint (`http://magento2.local/`)
  This will be updated in the future to support media that are uploaded on a different server. Please [contact us](mailto:contact@front-commerce.com) if you need this feature.
* `FRONT_COMMERCE_BACKEND_IMAGES_PATH`: the base path of your media on the backend (`/media`)
  For instance, if you want to retrieve the media `http://magento2.local/upload/toto.jpg` when querying `http://localhost:4000/media/toto.jpg`, you need to use `FRONT_COMMERCE_BACKEND_IMAGES_PATH=/upload`.
    <blockquote class="note">
    Note that you don't need to set `FRONT_COMMERCE_BACKEND_IMAGES_PATH` if you are using Magento as a backend for the API and the images because the default is already `/media`.
    </blockquote>

Once that's done, you need to configure the different formats that your server is willing to accept. This is in the `my-module/config/images.js` file.

```js
module.exports = {
  // background of your images if they are not in the correct ratio
  defaultBgColor: "FFFFFF",
  // different formats available
  presets: {
    thumbnail: {
      width: 50, // size of the resized image
      height: 50, // size of the resized image
      bgColors: [] // allowed background colors
    },
    small: { width: 200, height: 200, bgColors: [] },
    medium: { width: 474, height: 474, bgColors: [] },
    large: { width: 1100, height: 1100, bgColors: [] }
  },
  // allowed medias
  extensions: [".jpg", ".jpeg", ".png"]
};
```

## How to query an image?

Once you have configured your media middleware, you will be able to actually request a proxied image.
To do so, you need to build your URL as follow:

```
http://localhost:4000/media/<pathToMyImage>?format=<presetName>&bgColor=<colorValue>&cover=<coverBoolean>&dpi=x2
```

With actual values, it would look like this:

```
http://localhost:4000/media/path/to/my/image.jpg?format=small&bgColor=FFFFFF&cover=true
```

* `format`: must be one of the keys available in your `presets` configuration
* `bgColor` (optional): must have one of the values in the array `bgColors` of your preset. If you don't set it, it will be the the `defaultBgColor`
* `cover` (optional): crops the image so that both dimensions are covered, making parts of the image hidden if necessary. If this option is not set, the image will fit in the dimensions without hidding any of its content. The space left in your image will be filled with the `bgColor` attribute.

### `<ResizedImage>` component

However, this can be troublesome to setup manually for you. This is why in Front-Commerce you should rather use the `<ResizedImage>` React component.

```jsx
import ResizedImage from "theme/components/atoms/ResizedImage";

<ResizedImage
  src="/media/path/to/my/image.jpg"
  alt="a suited description of the image"
  format="small"
  cover={true}
/>
```

<blockquote class="important">
The path of the image here is the path of the image on the proxy.
</blockquote>

This component will automatically fetch the image through the proxy with the correct settings. Moreover, it will display a spinner while the image is loading and a fallback image if it breaks.

It will also lazyload the image. However, in some cases you might not want this to happen. For instance, you don't want this to happen on the main image of your product page. Thus, to disable lazyloading, you should use the option `dangerouslyDisableLazyLoad`.

## Image caching

While this feature is super handy, it comes with a cost: images are resized on the fly. To minimize this issue, we've added some guards.

The first one as you might have noticed in the previous section is limiting the available formats by using presets. But that is not enough.

This is why we have added caching: if an image is proxied once, the resized image will be put directly in your server's file system to avoid a resize upon each request of the image. This folder is in `.front-commerce/cache/images/`.

But this is still not ideal because it means that on the first launch of your server, many images will need to be resized during your users' requests.

To answer this, we have created a script that fetches all the image URLs used in your catalog and put them in cache. It launchs a warmup of your image caches that you could use before a deployment or with a cron every night.

Documentation about this script is available in the [`scripts/imageWarmUp.js` reference page](/docs/reference/scripts.html#imageWarmUp-js).