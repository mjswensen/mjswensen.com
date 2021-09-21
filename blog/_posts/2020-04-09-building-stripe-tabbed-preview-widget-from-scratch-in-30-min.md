---
title: "Building Stripe.com's Tabbed Preview Widget From Scratch in 30 Minutes"
date: 2020-04-09 06:39 MDT
layout: post
excerpt: In this video I try to build a fully functional tabbed preview widget in HTML and CSS from scratch in 30 minutes—without looking at the original code. After the time's up, I peek under the hood to see the approach of the original author and compare and contrast it to my approach.
links:
  dev.to: https://dev.to/mjswensen/building-stripe-com-s-tabbed-preview-widget-from-scratch-in-30-minutes-53fi
---

{% include video.html videoUrl="//www.youtube.com/embed/NFOidUvke0k" %}

In this video I try to build a fully functional tabbed preview widget in HTML and CSS from scratch in 30 minutes—without looking at the original code. After the time's up, I peek under the hood to see the approach of the original author and compare and contrast it to my approach.

# The build process

## Setting up a development environment

For this short project I used a very simple setup: an `index.html` file served by [`browser-sync`](https://npmjs.com/package/browser-sync) for automatic reloads on save. It can be run without previous download or install via [`npx`](https://www.npmjs.com/package/npx), which is included by default in node/npm installations.

{% highlight shell %}
npx browser-sync --server --files index.html
{% endhighlight %}

## Configuring the widget's container

Since this widget doesn't appear to respond to the window size, I used the macOS screenshot tool (`command`-`shift`-`4`) to measure the dimensions and simply hard-code them into the CSS.

## Managing the active tab state

The original Stripe implementation uses JavaScript to maintain the state of the currently active tab, which is a perfectly reasonable approach. I thought it might be fun to see if we could do it without JavaScript. I landed on using radio-type HTML inputs and some CSS selector tricks to achieve the same effect. In a professional setting, I would have likely used JavaScript—one could argue that this is an inappropriate use of radio inputs since this is an informational widget and not part of a form with user-provided data.

The book I referenced in the video is called [_Resilient Web Design_ by Jeremy Keith](https://resilientwebdesign.com/) and is freely available to read online.

## Sliding the content left and right based on the active tab

I wrapped the code snippets in a container and positioned it absolutely, altering the `left` property based on the active tab. We discuss a better approach to this later on when we inspect Stripe's solution.

## Giving the widget a 3D appearance

To give the widget a 3D appearance, I rotated the widget around the X and Y axes, but it didn't quite have the right effect. I should have used the `rotate3d()` function instead.

## Adding a shine effect

For the shine effect, I added an `::after` pseudo-element, positioned absolutely to stretch the width and height of the container, and added a background gradient. To keep the text beneath it selectable (and tabs clickable), `pointer-events: none` was required so that mouse events would fall through it.

## My final code

Here is what I ended up with at the end of the session.

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Preview Widget</title>
  <style>
    .container {
      --width: 490px;
      --bg: #31335B;
      --radius: 8px;
      --border-active: #596481;
      width: var(--width);
      height: 380px;
      background-color: var(--bg);
      border-radius: var(--radius);
      color: white;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: auto 1fr;
      transform: rotateX(-10deg) rotateY(10deg);
      position: relative;
    }

    .container::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: linear-gradient(to bottom right, hsla(0, 0%, 100%, 0.15), transparent);
      pointer-events: none;
    }

    .content {
      grid-column-start: 1;
      grid-column-end: 6;
      position: relative;
    }

    .slide-wrapper {
      display: flex;
      overflow-x: hidden;
      position: absolute;
      transition: left 400ms ease-in-out;
    }

    #js:checked ~ .content .slide-wrapper {
      left: 0;
    }

    #rb:checked ~ .content .slide-wrapper {
      left: calc(var(--width) * -1);
    }

    #py:checked ~ .content .slide-wrapper {
      left: calc(var(--width) * -2);
    }

    #go:checked ~ .content .slide-wrapper {
      left: calc(var(--width) * -3);
    }

    #other:checked ~ .content .slide-wrapper {
      left: calc(var(--width) * -4);
    }

    .content pre {
      width: var(--width);
      overflow: hidden;
    }

    input[type="radio"] {
      display: none;
    }

    #js:checked ~ label[for="js"],
    #rb:checked ~ label[for="rb"],
    #py:checked ~ label[for="py"],
    #go:checked ~ label[for="go"],
    #other:checked ~ label[for="other"] {
      background-color: var(--bg);
      border-left: 1px solid var(--border-active);
      border-right: 1px solid var(--border-active);
      border-bottom: 1px solid var(--bg);
    }

    label {
      background-color: #2D2F4A;
      border-top-left-radius: var(--radius);
      border-top-right-radius: var(--radius);
      text-align: center;
      padding: 0.25em;
      border-bottom: 1px solid var(--border-active);
    }
  </style>
</head>
<body>
  <div class="container">
    <input type="radio" name="tab" id="js" checked>
    <input type="radio" name="tab" id="rb">
    <input type="radio" name="tab" id="py">
    <input type="radio" name="tab" id="go">
    <input type="radio" name="tab" id="other">
    <label for="js">
      Node.js
    </label>
    <label for="rb">
      Ruby
    </label>
    <label for="py">
      Python
    </label>
    <label for="go">
      Go
    </label>
    <label for="other">
      ...
    </label>
    <section class="content">
      <div class="slide-wrapper">
        <pre><code>// Set your secret key
  const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');
  
  // Get the payment token ID submitted by the form:
  const token = request.body.stripeToken;
  
  (async () => {
    const charge = await stripe.charges.create({
      amount: 999,
      currency: 'usd',
      description: 'Example charge',
      source: token,
    });
  })();</code></pre>
        <pre><code># Set your secret key
  Stripe.api_key = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
  
  # Get the payment token ID submitted by the form:
  token = params[:stripeToken]
  
  charge = Stripe::Charge.create({
    amount: 999,
    currency: 'usd',
    description: 'Example charge',
    source: token,
  })</code></pre>
        <pre><code> Set your secret key
  stripe.api_key = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
  
  # Get the payment token ID submitted by the form:
  token = request.form['stripeToken']
  
  charge = stripe.Charge.create(
    amount=999,
    currency='usd',
    description='Example charge',
    source=token,
  )</code></pre>
        <pre><code>// Set your secret key
  stripe.Key = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
  
  // Get the payment token ID submitted by the form:
  token := r.FormValue('stripeToken')
  
  params := &stripe.ChargeParams{
    Amount: 999,
    Currency: 'usd',
    Description: 'Example charge',
  }
  params.SetSource(token)
  ch, _ := charge.New(params)</code></pre>
        <pre><code>TODO</code></pre>
      </div>
    </section>
  </div>
</body>
</html>
{% endhighlight %}

# Inspecting the original Stripe code

## Differences with my approach

Aside from the fact that the Stripe code was much more polished (with additional borders, typography, syntax highlighting, etc.), there were a number things about the original code that were much improved to my version. Here are a couple:

* Rather than transitioning the `left` property to slide the code back and forth, the original author used `translateX()`, which is more performant.
* The original author used the `<figure>` element to wrap this widget, which is much more semantically correct than the `div` I used.

## Nice touches

Stripe is known for adding a level of polish and detail that most engineering teams can only dream of. Here are just a couple that I noticed:

* Using `::before` and `::after` pseudo-elements with transparent-to-opaque background gradients, the text had an appearance of sliding "under" the edges of the widget as it moved back and forth.
* A tasteful `box-shadow` was added to augment the 3D effect of the widget.

# Conclusion

Any questions or suggestions about my tooling, approach, development style? What would you have done differently? I'd love to hear from you. [Find me on Twitter](https://twitter.com/mjswensen) or [leave a comment on the video](https://youtu.be/NFOidUvke0k).

# Tools

Here are the tools I used in this video:

* Text editor: [Visual Studio Code](https://code.visualstudio.com/) with theme [_Right in the Teals_](https://themer.dev/?colors.dark.shade0=%23171D1D&colors.dark.shade7=%23CDDEDE&colors.dark.accent0=%23F18CB1&colors.dark.accent1=%23B86675&colors.dark.accent2=%23C57B67&colors.dark.accent3=%2300ACBD&colors.dark.accent4=%23208490&colors.dark.accent5=%231A9BA6&colors.dark.accent6=%2332A0AC&colors.dark.accent7=%23FCA188&colors.light.shade0=%23F8FDFE&colors.light.shade7=%2305262D&colors.light.accent0=%23D75971&colors.light.accent1=%23CD2455&colors.light.accent2=%23AA582D&colors.light.accent3=%231D7E66&colors.light.accent4=%2314808C&colors.light.accent5=%230E7481&colors.light.accent6=%234797A7&colors.light.accent7=%23C87D4F&activeColorSet=light&calculateIntermediaryShades.dark=true&calculateIntermediaryShades.light=true) by [themer](https://github.com/themerdev/themer), and [Fira Code](https://github.com/tonsky/FiraCode) font
* Browser: [Brave](https://brave.com/mjs324)
* Development server: [Browsersync](https://browsersync.io/) launched under [npx](https://www.npmjs.com/package/npx)
* Application launcher: [Alfred](https://www.alfredapp.com/)
* Color picker: [Sip](https://sipapp.io/)
