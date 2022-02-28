---
id: improve-your-core-web-vitals
title: Improve your Core Web Vitals
---

Hi! You were fast…🏁 it means that you are interested in improving your application. Great!

> We will keep improving this page in the next few days.

## Some reading and links to keep you busy

- https://webperf.tools/
- [Web Vitals (official documentation page)](https://web.dev/vitals/)
- [Everything we know about Core Web Vitals and SEO](https://simonhearne.com/2021/core-web-vitals-seo)
- Understand what the [Chrome User Experience Report (CrUX)](https://developers.google.com/web/tools/chrome-user-experience-report/) is
- People analysed CrUX data for you: [What do Lighthouse Scores look like across the web?](https://www.tunetheweb.com/blog/what-do-lighthouse-scores-look-like-across-the-web/)
- [Three Techniques for Performant Custom Font Usage](https://css-tricks.com/three-techniques-performant-custom-font-usage/)
- LCP: [detect the element associated with LCP using the DevTools](https://web.dev/optimize-lcp/#developer-tools)
- Understand assets impact on different devices, to help you set budgets: [The Mobile Performance Inequality Gap, 2021](https://infrequently.org/2021/03/the-performance-inequality-gap/)

## Front-Commerce tips

### Mark above-the-fold images as priority

Using: `<Image src="xxxx" priority />`

### Improve your fonts performance

- [Self-host your custom (Google) fonts](https://www.zdnet.com/article/chromes-new-cache-partitioning-system-impacts-google-fonts-performance/)
- Use WOFF2 format
- Use `font-display: optional`
- Preload key fonts by naming them with the suffix: `*.priority.woff2`

### One query per route

You must aim at One GraphQL query per Front-Commerce route. Keep additional queries for secondary content.

Ensure that this query is preloadable (using the top level `graphqlWithPreload` HOC).
