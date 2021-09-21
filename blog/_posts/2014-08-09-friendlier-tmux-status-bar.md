---
title: Configurations for a Friendlier tmux Status Bar
date: 2014-08-09 17:22:00 MDT
tags: productivity
layout: post
excerpt: I recently added a few configuration options to my local tmux configuration file to make the status bar easier to read.
sitemap:
  lastmod: 2021-09-21 06:05:25 MDT
links:
  dev.to: https://dev.to/mjswensen/configurations-for-a-friendlier-tmux-status-bar-32n3
---

At work, the engineering team uses [tmux](https://tmux.github.io/) to manage the several instances of the services we run to develop the Lucid suite locally. It is a phenomenal terminal management system and the best part is that it is highly configurable. If you enjoy working in the command-line and haven't checked it out yet, you need to!

This is what the default status bar looks like with a few windows open:

![tmux status bar before configurations](/blog/images/tmux-status-bar-before.png)

I added a few config options to my `~/.tmux.conf` file to make the status bar easier to read:

{% highlight shell %}
set-window-option -g status-left " #S "
set-window-option -g status-left-fg black
set-window-option -g status-left-bg white

set-window-option -g status-right " %H:%M %d-%b-%y "
set-window-option -g status-right-fg black
set-window-option -g status-right-bg white

set-window-option -g window-status-format " #I: #W "

set-window-option -g window-status-current-format " #I: #W "
set-window-option -g window-status-current-fg green
set-window-option -g window-status-current-bg black
{% endhighlight %}

This is what the status bar looks like now:

![tmux status bar after configurations](/blog/images/tmux-status-bar-after.png) (Terminal theme is the beautiful [Tomorrow Theme](https://github.com/chriskempson/tomorrow-theme) by [Chris Kempson](http://chriskempson.com).)

<div class="cards updates">
  <div class="card">
    <span class="card-title">Update 5/16/2015</span>
    <div class="card-body">
      <p>I still love and use tmux every day. I have recently moved from the default Terminal.app to the fantastic <a href="http://iterm2.com/">iTerm2.app</a>, in part because it has wonderful tmux integrations. In a nutshell, it is possible to attach to a tmux session with a special command-line flag that uses native iTerm panes/tabs/windows in place of the tmux panes and windows. This allows for easier scrolling, better copy/pasting, and better mouse integrations (i.e., switching between panes). It has loads of other features as well. I can't recommend it enough.</p>
    </div>
  </div>
  <div class="card">
    <span class="card-title">Update 8/26/2017</span>
    <div class="card-body">
      <p>It's been just over three years since I wrote this post, and I still use tmux every day. My custom tmux status bar theme has largely remained the same as outlined above, too. For the rest of my development environment, I recently built a tool called <a href="https://github.com/themerdev/themer"><code>themer</code></a> that greatly simplifies keeping a consistent theme between editors, terminals, other apps, and even desktop wallpaper. <a href="https://themer.dev">Check out <code>themer</code> here.</a></p>
    </div>
  </div>
</div>
