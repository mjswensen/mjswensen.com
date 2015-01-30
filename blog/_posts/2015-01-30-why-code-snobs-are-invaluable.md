---
title: Why Code Snobs Are Invaluable
date: 2015-01-30 13:50:44
tags: software
layout: post
---

Some argue that "code snobs" waste time on trivia. While I am sure this can be the case, I submit that their ideas and comments offer more benefit than cost in the long run.

I recently pushed a change at work that involved refactoring a few of our JavaScript classes and adding a couple of new ones. Nothing too out of the ordinary. Our development workflow requires a different engineer to code review any commits before they go on to the master branch (and eventually out to production). I felt good about the solution that I had come up with for the particular task I was working on.

The engineer that I had requested for the code review—who had recently reworked our [Selenium](http://www.seleniumhq.org/) testing framework and is an active proponent of code quality for our team—left a comment on our pull request system for a particular area of the code I was submitting. He suggested a slight change, merely that some of the classes I had implemented were not using the singleton pattern, while some of their analogous counterparts were, and that I should adjust them to better mirror that structure.

I was halfway through replying to the comment with reasons to just move forward and approve my pull request anyway when I realized that he was right. The classes really *would* be more semantic if they were singletons. I decided to take the additional 15 minutes to make the change.

I realize that whether or not my two small JavaScript classes were implemented as singletons probably has no real bearing on the reliability and performance of our large codebase. **But small decisions like that add up, especially when they are made every day.** Imagine how different your codebase would be if every programmer on your team pushed out the best quality code they could, every single commit, with unfaltering snobbery! Over the course of even a year, the difference would be significant.

**Perhaps a "code snob" is simply the term lazy programmers use to describe their more disciplined peers.** If that's the case, I want to be one.
