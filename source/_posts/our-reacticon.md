---
title: Our Reacticon
author: Adrien, Julien and Pierre
authorURL: https://twitter.com/Front_Commerce
date: 2018-03-20 12:00:00
---

A few days ago we attended [Reacticon](http://reacticon.org/), the first
conference about <abbr title="Progressive Web Apps">PWA</abbr> in the Magento
ecosystem.

It was composed of one day of conferences and another one of code! Here are our
key takeaways.

<!--truncate-->

## A friendly community

First of all, we want to thank every attendees, speakers and of course
organizers. It was a wonderful event thanks to you.

Everyone was keen to share insights and answer questions, which led to very
interesting discussions.

## <abbr title="Progressive Web App">PWA</abbr> as a buzzword

<abbr title="Progressive Web App">PWA</abbr> was the keyword of this event.
Everyone is excited that they will soon be able to create wonderful eCommerce
experiences with Magento. But, it seems that there is still a lot a confusion
around it.

One feel that they need to use React and create a
<abbr title="Single Page Application">SPA</abbr> to create a
<abbr title="Progressive Web App">PWA</abbr>. Another say that you need to offer
a full offline experience. Some claim that you only need a shortcut to your
homescreen.

Fortunately, [Shane Osbourne](https://twitter.com/shaneOsbourne) was here to
remind everyone to improve their user and developer experience step by step.
Focus on one feature at a time, and in the long run, you'll deliver awesome
shopping experiences to your customers.

## Magento Research is promising

[James Zetlen](https://twitter.com/jameszetlen) gave more information about
<abbr title="Progressive Web App">PWA</abbr> Studio, and the processes behind
it. He introduced the
[Magento Research Github organization](https://github.com/magento-research), a
new way for Magento to innovate and interact from the community. We could
expect:

- open source code shared early with the community to get feedback
- more flexible tools (reusable outside Magento)
- shorter release cycles, since it does not follow Magento’s versioning scheme

This is something new in the Magento ecosystem, and — in our opinion — one of
the best things that happened to Magento these past few years. Anyone who saw
James and Andrew in the same room at the same time will understand immediately!

<abbr title="Progressive Web App">PWA</abbr> Studio is the first playground for
Magento Research and feels as promising in its approach.
[Andrew Levine](https://twitter.com/drewml) emphasized that they wish to empower
the community rather than to provide an one-size-fits-all solution. Few things
are yet public and they are focusing on internal experimentation. We will follow
up with a blog post to have a deeper look on how can it play with the ecosystem.

Spoiler Alert: Front-Commerce will play nicely with what is planned!

## The community has concerns too

Reacticon was also an interactive event where attendees could ask questions and
share their thoughts. Here is what concerned them the most.

### Developers would like a stable implementation ASAP

While speakers were discussing offline, bundle size and performance, attendees
were asking to get rid of UI Components. **They just want to escape the frontend
hell they face every day.** Developers understand that there is no future for
the current Magento frontend. But there are no alternatives yet!

Offline or push notifications don’t matter much to them. They need a solution
allowing them to build stores in a more productive way, **right now**. Webperfs
are important too, but from our discussions it seems that any non-Magento
solution will be a great improvement by default.

Let’s support the most important Magento features, and **work on
<abbr title="Progressive Web App">PWA</abbr> related awesomeness as soon as
checkout customization is fun again!**

### Extension Developers are worried

They made an open request to us — <abbr title="Progressive Web App">PWA</abbr>
solutions maintainers — asking for consistency across solutions. It would be
very tedious to maintain different components and codebase for each frontend.
**We started to discuss with some extension developers, and are available to
work more on this** by giving our input when needed. A clean, stateless WebAPI
and some well designed React Components might be enough.

## Front-Commerce is part of this ecosystem

Even though we were not speakers, it was great to be mentioned many times during
the event.

As one of the first solution available, we’ve already solved in our way a lot of
the things that were discussed. **We presented some of our implementation
details and gave advices from our experience to attendees and speakers**.
Meeting with the teams behind Vue Storefront and Deity led to constructive
discussions about our respective visions and choices. We are now even more
motivated for the remaining tasks before releasing 1.0.

On the second day, Pierre improvised a **15 minutes live coding session about
our GraphQL middleware**. He illustrated how to extend the base GraphQL schema
by creating a new module. Adding new fields to existing types or integrating
custom features from any API is straightforward!

We also contributed to the <abbr title="Progressive Web App">PWA</abbr> Studio
by
[experimenting the Layout loader](https://github.com/magento-research/pwa-buildpack/pull/14#issuecomment-373914226)
and
[opening a PR against an issue](https://github.com/magento-research/pwa-buildpack/pull/21).
It’s not like if we had a 6 month old promise to keep!

<blockquote class="twitter-tweet" data-lang="fr"><p lang="en" dir="ltr">React, Jest, Storybook, CSS Modules coming to <a href="https://twitter.com/hashtag/Magento?src=hash&amp;ref_src=twsrc%5Etfw">#Magento</a>...<br>Our promise to developers using Front Commerce: you&#39;ll be at home with <abbr title="Progressive Web App">PWA</abbr> Studio! <a href="https://t.co/2TIrJbXNvJ">https://t.co/2TIrJbXNvJ</a></p>&mdash; Front-Commerce (@Front_Commerce) <a href="https://twitter.com/Front_Commerce/status/905644984577048577?ref_src=twsrc%5Etfw">7 septembre 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

How could we make a good use of all the smart developers attending Reacticon?
**User testing!**

Developer experience is a core feature of Front-Commerce, so we ran user tests
for this website (documentation is critical) and our living styleguide to help
us prioritize our backlog. Thanks everyone for your time and honest feedback!

**Front-Commerce 1.0 is on its way and — trust us — you’ll like it.**

## Reacticon v2

Last but not least, Reacticon v2 has been anounced! See you there!

<blockquote class="twitter-tweet" data-lang="fr"><p lang="en" dir="ltr">Let&#39;s say September 28th, 2018? Who&#39;s in?</p>&mdash; Reacticon (@reacticon) <a href="https://twitter.com/reacticon/status/975672173816840193?ref_src=twsrc%5Etfw">19 mars 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
