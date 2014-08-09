---
title: Configurations for a Friendlier tmux Status Bar
date: 2014-08-09 17:22:00
tags: productivity
layout: post
excerpt: I recently added a few configuration options to my local tmux configuration file to make the status bar easier to read.
---

At work, the engineering team uses [tmux](http://tmux.sourceforge.net) to manage the several instances of the services we run to develop the Lucid suite locally. It is a phenomenal terminal management system and the best part is that it is highly configurable. If you enjoy working in the command-line and haven't checked it out yet, you need to!

This is what the default status bar looks like with a few windows open:

![tmux status bar before configurations](/blog/images/tmux-status-bar-before.png)

I added a few config options to my `~/.tmux.conf` file to make the status bar easier to read:

{% include script.html src="https://gist.github.com/mjswensen/a8dd60823f5f05484190.js" %}

This is what the status bar looks like now:

![tmux status bar after configurations](/blog/images/tmux-status-bar-after.png)

(Terminal theme is the beautiful [Tomorrow Theme](https://github.com/chriskempson/tomorrow-theme) by [Chris Kempson](http://chriskempson.com).)
