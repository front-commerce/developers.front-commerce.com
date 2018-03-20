---
title: Our Reacticon
---

A few days ago we attended [Reacticon](http://reacticon.org/), the first conference
about PWAs in the Magento ecosystem.

It was composed of one day of conferences and another one of code! Here are our key
takeaways.

<!--truncate-->

## A friendly community

First of all, we wanted to thank every attendees, speakers and of course organizers
for the atmosphere during the conference.

Everyone was keen to share insights and answer questions, which led to very interesting
discussions.

## PWA is the term used for different things (J)

PWA was the keyword for this event. What quickly came out is that everyone talks about it, nobody really knows how to do it efficiently, everyone thinks everyone else is doing it, so everyone claims they are doing it!

As you may have already heard before, for now there are very few uses of PWAs in
this ecosystem yet.

Magento’s PWA Studio is still being built so there is not much to see yet, Deity
has only « demo features » (such as Add to home screen), Vue Storefront more offline
usage but will need tweaking depending on the store requirements

In discussions what came out was the urgency of getting rid of the current Magento
frontend stack (UI components, Knockout, requireJS).

Big up to Shane.

## Magento Research is promising

[James Zetlen](https://twitter.com/jameszetlen) gave more information about
PWA Studio, and the processes behind it. He introduced the [Magento Research
Github organization](https://github.com/magento-research), a new way for
Magento to innovate and interact from the community. We could expect:

* open source code shared early with the community to get feedbacks
* more focused tools (reusable outside Magento)
* shorter release cycles, since it does not follow Magento’s versioning scheme

This is something new in the Magento ecosystem, and — in our opinion — one
of the best thing that happened to Magento these past few years.
Anyone who saw James and Andrew in the same room at the same time will understand
immediately!

---

PWA Studio has just started

Few things public for now, internal experimentations so stay tuned.
We will write future blog posts to help you understand what it is all
about and what to expect.

Spoiler Alert: Front-Commerce will play nicely with what is planned!

See tweet

## The community has concerns too

Reacticon was also an interactive event where attendees could ask questions
and share their thoughts. Here are the feedbacks we found the most important.

### Extension Developers are worried

They made an open request to us — PWA solutions maintainers — asking for consistence
across solutions. It would be very tedious to maintain different components and
codebase for each frontend.

**We started to discuss with some extension developers, and are available to
work more on this** by giving our input when needed. A clean, stateless WebAPI
and some well designed React Components might be enough.

### Developers would like a stable implementation ASAP

While speakers where discussing offline, bundle size and performance, **attendees
were asking to get rid of UI Components and escaping the frontend hell they
face every day.** Developers understand that there is no future for the current
Magento frontend… but there are no alternatives yet!

Offline or push notification don’t matter much to them, compared to a
solution allowing them to build stores in a more productive way…
**right now**.
Webperfs are important too, but from our discussions it seems that any
non-Magento — and its killer RequireJS cascading loading — will be a great
improvement by default.

Let’s support the most important Magento features, and **work on PWA related
awesomeness as soon as checkout process customization is fun again!**

## Front-Commerce is part of this ecosystem

Even though we were not speakers, it was great to be mentioned many times
during the event.

As one of the first solution available, we’ve already solved in our way a lot
of the things that were discussed. **We presented some of our implementation
details and gave advices from our experience to attendees and speakers**.
It led to interesting feedbacks, and motivated us even more for the remaining
tasks before releasing 1.0.

On the second day, Pierre improvised a **15 minutes live coding session about
our GraphQL middleware**. He illustrated how to extend the base GraphQL schema
by creating a new module. Adding new fields to existing types or integrating
custom features from any API is straightforward!

We also contributed to the PWA Studio by [experimenting the Layout loader](https://github.com/magento-research/pwa-buildpack/pull/14#issuecomment-373914226)
and [opening a PR against an issue](https://github.com/magento-research/pwa-buildpack/pull/21).
It’s not like if we had a 6 month old promise to keep!

<blockquote class="twitter-tweet" data-lang="fr"><p lang="en" dir="ltr">React, Jest, Storybook, CSS Modules coming to <a href="https://twitter.com/hashtag/Magento?src=hash&amp;ref_src=twsrc%5Etfw">#Magento</a>...<br>Our promise to developers using Front Commerce: you&#39;ll be at home with PWA Studio! <a href="https://t.co/2TIrJbXNvJ">https://t.co/2TIrJbXNvJ</a></p>&mdash; Front-Commerce (@Front_Commerce) <a href="https://twitter.com/Front_Commerce/status/905644984577048577?ref_src=twsrc%5Etfw">7 septembre 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

How could we make a good use of all the smart developers attending Reacticon? **User testing!**

Developer experience is a core feature of Front-Commerce, so we ran user tests
for this website (documentation is critical) and our living styleguide
to help us prioritize our backlog.
Thanks everyone for your time and honest feedbacks!

**Front-Commerce 1.0 is on its way and — trust us — you’ll like it.**

## … Reacticon II

See you there, save the date…

<blockquote class="twitter-tweet" data-lang="fr"><p lang="en" dir="ltr">Let&#39;s say September 28th, 2018? Who&#39;s in?</p>&mdash; Reacticon (@reacticon) <a href="https://twitter.com/reacticon/status/975672173816840193?ref_src=twsrc%5Etfw">19 mars 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
