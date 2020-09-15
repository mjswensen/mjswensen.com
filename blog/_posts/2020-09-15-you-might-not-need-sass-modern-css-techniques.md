---
title: "You Might Not Need Sass: Modern CSS Techniques"
date: 2020-09-15 06:46:12 MDT
layout: post
excerpt: Sass and other CSS preprocessors have some great features and have been widely used for years. CSS is rapidly evolving, though, and some of the features that were previously only possible through preprocessors are now achievable in plain CSS.
---

[Sass](https://sass-lang.com/) and other CSS preprocessors have some great features and have been widely used for years. CSS is rapidly evolving, though, and some of the features that were previously only possible through preprocessors are now achievable in plain CSS. While updating the styles for [mjswensen.com](https://mjswensen.com), I found plain CSS to be powerful enough on its own and completely migrated away from Sass. Depending on the size and needs of your project (and target browser support), you may be able to simplify your CSS tool chain as well by using these techniques.

The Sass features we will be re-creating in vanilla CSS in this article:

* [Parameterized Mixins](#parameterized-mixins)
* [Color Manipulation](#color-manipulation)
* [Variables](#variables)

## Parameterized Mixins

In Sass, you can define a collection of reusable styles, and then include the styles in multiple places throughout your stylesheet.

{% highlight sass %}
@mixin alert ($color: yellow) {
  color: $color;
  border: 1px solid currentColor;
  padding: 1em;
}

.error {
  @include alert(red);
}

.success {
  @include alert(green);
}
{% endhighlight %}

{% highlight html %}
<div role="alert" class="success">Submitted successfully.</div>
{% endhighlight %}

We can achieve this same functionality in vanilla CSS using [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) and some changes to our markup:

{% highlight css %}
.alert {
  color: var(--color, yellow);
  border: 1px solid currentColor;
  padding: 1em;
}

.error {
  --color: red;
}

.success {
  --color: green;
}
{% endhighlight %}

{% highlight html %}
<div role="alert" class="alert success">Submitted successfully.</div>
{% endhighlight %}

### Tradeoffs

Though we can achieve something similar to Sass's `@mixin`/`@include` with vanilla CSS, there are some tradeoffs to this approach:

* There is less clarity around how to use the `alert` class since it's `--color` "parameter" is implicit; you have to reference the HTML to see how it is being used and what the value of `--color` might be, whereas with Sass the parameters are explicit.
* Sass can catch incorrect usages of mixins at compile time and surface errors to the developer, whereas the CSS approach will silently fail if used incorrectly.
* Since the CSS approach involves both the stylesheet and the markup, there is more room for mistakes in refactoring a "mixin," especially in large projects.

## Color Manipulation

Sass has long provided a powerful library for manipulating colors. Similar functionality has been proposed for CSS in the [CSS Color Module Level 4 specification](https://drafts.csswg.org/css-color/#modifying-colors) but is not available for widespread use at the time of writing. However, using the widely available CSS `calc()` function, we can achieve some simple color manipulations without any tooling on top of our CSS.

In Sass, we can use the `rgba()` and `desaturate()` functions to get semi-transparent and desaturated versions of a given color, respectively:

{% highlight sass %}
$main-color: hsl(14, 75%, 58%);
$semi-transparent-main: rgba($main-color, 0.1);
$desaturated-main: desaturate($main-color, 20%);
{% endhighlight %}

We can achieve the same effect in CSS by splitting the color components into their own custom properties and operating on them individually:

{% highlight css %}
:root {
  --main-color-h: 14;
  --main-color-s: 75%;
  --main-color-l: 58%;
  --semi-transparent-main: hsla(
    var(--main-color-h),
    var(--main-color-s),
    var(--main-color-l),
    0.1
  );
  --desaturated-main: hsl(
    var(--main-color-h),
    calc(var(--main-color-s) - 20%),
    var(--main-color-l)
  );
}
{% endhighlight %}

### Tradeoffs

The Sass syntax for color manipulation is more compact, easier to use, and easier to read. There are also limitations to the CSS-only approach, at least until the `color()` function becomes a W3C recommendation and gains browser adoption.

## Variables

One of the most then-groundbreaking features of CSS preprocessors was the ability to define and reuse values via variables. As seen in the examples above, we can now do the same thing in vanilla CSS using custom properties. But there are some nuances in the difference between Sass variables and custom properties that are worth mentioning.

Since Sass is a compiled language (compiles down to CSS), variable values are evaluated at compile time rather than at runtime. This comes with a couple of tradeoffs to consider:

- Sass variables' values can't change in response to browser context changes (like media queries), while custom properties can.
- Sass can warn you if you try to use a variable that hasn't been initiated (if the name is misspelled, for example), while CSS will fall silently when using an undefined variable.
- Both Sass variables and custom properties are "global," but "global" has different meanings. For Sass, "global" means in scope for the current compilation target and any dependency stylesheets (and their dependencies). In CSS, "global" means really global: the values are visible to all stylesheets, markup, and scripts loaded on the page.

## Conclusion

Modern vanilla CSS can cover some of the preprocessors' flagship features, but at a cost of readability and maintainability. The overhead of a CSS build process may be worth it for larger projects or teams. For smaller or solo projects, though, CSS is powerful enough to stand on its own.