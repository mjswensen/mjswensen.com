---
title: Key Takeaways to Common CSS Questions
date: 2015-06-12 08:42:13
tags: css
layout: post
---

One of my goals for Q2 2015 was to answer ten CSS-related questions on Stack Overflow. Below is an outline of some of the key concepts I came across while doing so.

## Preprocessor Compilation

[This question](http://stackoverflow.com/questions/29472923/sass-nesting-at-2-levels/29473205) regarded the relative "efficiency" of two comparable snippets of Sass code. What the original poster did not realize is that the differences were purely preferential, and that the two examples in fact compiled down to the exact same CSS code.

**Key takeaway:** Understanding how preprocessors behave is important for producing quality code. The best way to know what the compiled output of a preprocessor is to go back to [the basics of CSS selectors](http://mjswensen.com/css-power-ups/introduction-and-selectors/#/3), specifically compounding simple selectors (and sequences of simple selectors) together with [combinators](http://mjswensen.com/css-power-ups/introduction-and-selectors/#/7). Understanding combinators is the key to effectively using the popular preprocessors' nesting and `&` syntax.

## Parent Selector

In [this question](http://stackoverflow.com/questions/29528157/nested-div-css-selector/29528204), the original poster was on a wild goose chase that most CSS developers have found themselves on at one point or another: trying to select a parent element based on whether or not it contains a given descendant. For example, all `section`s that contain an element with the `metadata` class, but not those that do not (proposed syntax: `section < .metadata`).

**Key takeaway:** Unfortunately, the parent selector does not yet exist, but may someday in [a future CSS specification](http://www.w3.org/TR/selectors4/). There may be, however, alternate solutions to solving that problem, such as the [use of psuedo-classes like `:empty`](http://mjswensen.com/blog/2015/05/11/practical-use-cases-for-the-empty-pseudo-class/) or `:not()`.

## The Box Model

In [this question](http://stackoverflow.com/questions/29753912/figcaption-not-aligning-correctly-under-image/29753979), the original poster was tripped up on how an element's `padding` affects its position and size—a very common issue.

**Key takeaway:** A lack of understanding for [the CSS box model](http://mjswensen.com/css-power-ups/the-box-model-and-positioning/#/) is a common source of error for layout and alignment concerns. Also, the use of the `box-sizing` property can greatly simplify the reasoning behind an element's computed size.

## The `display` And `visibility` Properties

In [this question](http://stackoverflow.com/questions/30766049/css3-animations-being-triggered-on-display-change/30766624), the original poster discovered that changing an element's `display` property from `none` to `block` re-triggered any animations for that element. The solution was to toggle between the `hidden` and `visible` values of the `visibility` property instead.

**Key takeaway:** Animations do not play nicely with `display: none;` in general. The use of `visibility: hidden;` can sometimes help with this, but special care must be taken as there are differences in behavior and styling between these two property-value pairs. (e.g., `visibility: hidden;` maintains an element's space in the flow of the web page while `display: none;` removes it from the flow. For this reason, in certain circumstances there will be [performance gains from favoring `visibility`](http://csstriggers.com/#display).)

## SVG

SVG is an extremely powerful and open graphics format. It is closely related to HTML in that both are XML (SVG images are therefore quite compatible with web pages) and CSS in that SVG elements can be styled with CSS, just like HTML elements. The original poster of [this question](http://stackoverflow.com/questions/30784486/svg-mutiple-images-with-different-behaviors/30786215) was simply not familiar with some of the SVG features used in the code. In this case, adding a class to the SVG element (and therefore being able to make [specificity](http://mjswensen.com/css-power-ups/the-cascade-and-specificity/#/2) work to our advantage) was enough to accomplish the task.

**Key takeaway:** While there are plenty of graphical tools and libraries for manipulating SVG images, being comfortable in the source code of an SVG can be valuable. Some of the best references for SVG are found on the [Mozilla Developer Network site](https://developer.mozilla.org/en-US/docs/Web/SVG). [Sara Soueidan](http://sarasoueidan.com/) also has a lot of great content and research around SVG.
