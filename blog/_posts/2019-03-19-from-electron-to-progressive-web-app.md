---
title: From Electron to Progressive Web App
date: 2019-03-23 20:29 MDT
layout: post
excerpt: In this post I'd like to review my reasoning behind sunsetting an Electron-based application in favor of a Progressive Web App (PWA).
links:
  dev.to: https://dev.to/mjswensen/from-electron-to-progressive-web-app-lhd
---

In this post I'd like to review my reasoning behind sunsetting an [Electron](https://electronjs.org)-based application in favor of a [Progressive Web App (PWA)](https://developers.google.com/web/progressive-web-apps/).

<div class="cards tldr">
  <div class="card">
    <span class="card-title">tl;dr</span>
    <div class="card-body">
      <ul>
        <li>Choose your platform wisely—you are at the mercy of its maintainers</li>
        <li>URLs are amazing</li>
        <li>You really can't beat the distribution model of the Web</li>
      </ul>
    </div>
  </div>
</div>

# themer

First a little context. My application, [themer](https://github.com/mjswensen/themer), started off as a command-line tool built on Node.js. It uses a set of colors as input and produces matching themes for various text editors, terminal emulators, and other tools. However, actually _choosing_ the colors for your personalized theme was tedious and cumbersome. A friend suggested to me that I build a GUI to help ease this process and provide a tighter feedback loop when creating a personalized theme. Given that Electron bundles a Node.js runtime, and that I could therefore easily wrap my CLI in a "native" GUI for all platforms, an Electron app seemed like a perfect fit. themer's GUI was born:

![themer's electron GUI](/blog/images/themer-gui.png)

# The bug

After spending a good amount of time building the GUI and wiring it up to my CLI running in Electron's Node process, I was able to bundle up the application installers and make them available for download on the [GitHub releases](https://github.com/mjswensen/themer-gui/releases) page. It wasn't until after the application was downloaded about 10k times that I discovered [a really nasty bug](https://github.com/electron/electron/issues/13596) that caused Electron-based applications to crash when using the macOS native color picker:

<video controls autoplay loop>
  <source src="/blog/videos/themer-gui-crash.webm" type="video/webm">
  <source src="/blog/videos/themer-gui-crash.mp4" type="video/mp4">
</video>

It took nearly eight months to fix that issue, during which the utility of themer's GUI was drastically reduced.

## The takeaway

When building for a particular platform or framework, **you are at the mercy of its maintainers** (of course, if the project is open-source, you can attempt to fix problems yourself, but this isn't always tenable). Even though Electron is popular, a bug like this wouldn't have lasted a week in a mainstream Web browser (or likely occurred at all).

# Shared/persisted state

One requirement for themer's GUI was that users should be able to save (and ideally share) their themes. Short of some sort of cloud-based service that integrated with the GUI, the best solution was to simply allow themer's GUI to read and write JSON from the filesystem. One neat thing about Electron is that you can register a custom icon with the operating system for files that match your custom extension:

![themer GUI's custom .thmr file extension and icon](/blog/images/themer-file.png)

I went the whole nine yards and implemented `Open`, `Save`, `Save As...`, friendly prompts to prevent accidental discarding of unsaved changes, etc.... basically everything you'd expect from a traditional desktop program. This worked well enough for persisting theme data, but didn't allow for easily sharing themes with others.

On the Web, there's a better way to share application state: the URL. themer's new PWA stores all of the theme-relevant state in the URL's query string, so sharing your theme is as easy as sending a link (like [this one](https://themer.dev/?colors.dark.accent0=%23CA3E5A&colors.dark.accent1=%23D8843E&colors.dark.accent2=%23EBB062&colors.dark.accent3=%2381A559&colors.dark.accent4=%2342ABAB&colors.dark.accent5=%234496CD&colors.dark.accent6=%239770B2&colors.dark.accent7=%23B35D8D&colors.dark.shade0=%2313222E&colors.dark.shade7=%23ACBECC&activeColorSet=dark&calculateIntermediaryShades.dark=true&calculateIntermediaryShades.light=true)), and saving is as easy as bookmarking (or just using your browser's history).

## The takeaway

The URL is one of **the Web's most wonderful and distinguishing features.** This simple and powerful state/location sharing mechanism is one of my favorite parts about the Web, and is glaringly missing from other platforms.

# Distribution model

There is a great open-source package available called [`electron-builder`](https://www.electron.build/) that adds support for pushing updates that your app can automatically download in the background. In all, it was relatively easy to configure and get working, but there was always a voice in the back of my mind that said: "I hope the updater code in this version works; if it doesn't, no one will be able to install updates beyond this point."

While it's still possible to shoot yourself in the foot with a PWA's `ServiceWorker`, more of the cacheing and network code lives in the browser itself, leaving less room for error in user-land.

## The takeaway

**The distribution model for the Web is unparalleled.** If you ship a version of your application that is broken, all you have to do is fix it and re-deploy. The platform itself takes care of the rest.

# Conclusion

There are, of course, applications that require the use of Electron (like VS Code for filesystem access, etc.), in which case the choice to build a purely Web-based application is not so simple as it was for my small pet project.

Electron is a wonderful piece of software, and building an Electron app was an enjoyable experience filled with learning. After having spent some time with it, though, I am more committed than ever to building for my platform of choice: the Web. I can't wait to see what the future holds for PWAs and Web technologies in general.

Check out [themer's new PWA](https://themer.dev) and let me know what you think.
