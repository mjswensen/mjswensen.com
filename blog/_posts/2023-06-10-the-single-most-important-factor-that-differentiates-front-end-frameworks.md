---
title: "The single most important factor that differentiates front-end frameworks"
date: 2023-06-10 23:14:49 MDT
tags: software
layout: post
excerpt: "There are tons of blog posts on the internet about how frameworks differ and which one to pick for your next web project. Usually they cover a few aspects of the framework like syntax, development setup, and community size. This isn't one of those posts."
sitemap:
  lastmod: 2023-07-18 22:14:31 MDT
links:
  Hacker News: https://news.ycombinator.com/item?id=36791506
---

There are tons of blog posts on the internet about how frameworks differ and which one to pick for your next web project. Usually they cover a few aspects of the framework like syntax, development setup, and community size.

This isn't one of those posts.

Instead, we'll go directly to the crux of the main problem front-end frameworks set out to solve: _change detection_, meaning _detecting changes to application state so that the UI can be updated accordingly._ Change detection is the fundamental feature of front-end frameworks, and the framework authors' solution to this one problem determines everything else about it: developer experience, user experience, API surface area, community satisfaction and involvement, etc., etc.

And it turns out that examining various frameworks from this perspective will give you all of the information you need to determine the best choice for you and for your users. So let's dive deep into how each framework tackles change detection.

## Major frameworks compared

We'll look at each of the major players and how they have tackled change detection, but the same critical eye can apply to any front-end JavaScript framework you may come across.

### React

> "I'll manage state so that I know when it changes." —React

True to its de-facto tagline, change detection in React is "just JavaScript." Developers simply update state by calling directly into the React runtime through its API; since React is notified to make the state change, it also knows that it needs to re-render the component.

Over the years, the default style for writing components has changed (from [class components](https://react.dev/reference/react/Component#defining-a-class-component) and [pure components](https://react.dev/reference/react/PureComponent#purecomponent) to [function components](https://react.dev/reference/react/Component#migrating-a-simple-component-from-a-class-to-a-function) to [hooks](https://react.dev/reference/react#state-hooks)) but the core principle has remained the same. Here's an example component that implements a button counter, written in the hooks style:

{% highlight jsx %}
export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count - 1)}>decrement</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>increment</button>
      <button onClick={() => setTimeout(() => setCount(count + 1), 1000)}>increment later</button>
    </div>
  );
}
{% endhighlight %}

The key piece here is the `setCount` function returned to us by React's `useState` hook. When this function is called, React can use its internal virtual DOM diffing algorithm to determine which pieces of the page to re-render. Note that this means the React runtime has to be included in the application bundle downloaded by the user.

<div class="cards tldr">
  <div class="card">
    <div class="card-title">Conclusion</div>
    <div class="card-body">
      <p>React's change detection paradigm is straightforward: the application state is maintained inside the framework (with APIs exposed to the developer for updating it) so that React knows when to re-render.</p>
    </div>
  </div>
</div>

### Angular

> "I'll make the developer do all the work." —Angular

When you scaffold a new Angular application, it appears that change detection happens automagically:

{% highlight typescript %}
@Component({
  selector: 'counter',
  template: `
    <div>
      <button (click)="count = count - 1">decrement</button>
      <span>{{"{{"}} count }}</span>
      <button (click)="count = count + 1">increment</button>
      <button (click)="incrementLater()">increment later</button>
    </div>
  `
})
export class Counter {
  count = 0;

  incrementLater() {
    setTimeout(() => {
      this.count++;
    }, 1000);
  }
}
{% endhighlight %}

What's really happening, is that Angular uses [`NgZone`](https://angular.io/guide/zone) to observe user actions, and is checking _your entire component tree on every event._

For applications of any reasonable size, this causes performance issues, since checking the entire tree quickly becomes too costly. So Angular provides an escape hatch from this behavior by allowing the developer to choose a different change detection strategy: `OnPush`. `OnPush` means that the onus is on the developer to inform Angular when state changes so that Angular can re-render the component. Aside from the default naive strategy, [`OnPush` is the only other change detection strategy Angular offers](https://angular.io/api/core/ChangeDetectionStrategy). With `OnPush` enabled, we must manually tell Angular's change detector to check the new state if it ever gets updated asynchronously:

{% highlight typescript %}
@Component({
  selector: 'counter',
  template: `
    <div>
      <button (click)="count = count - 1">decrement</button>
      <span>{{"{{"}} count }}</span>
      <button (click)="count = count + 1">increment</button>
      <button (click)="incrementLater()">increment later</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Counter {
  constructor(private readonly cdr: ChangeDetectorRef) {}

  count = 0;

  incrementLater() {
    setTimeout(() => {
      this.count++;
      this.cdr.markForCheck();
    }, 1000);
  }
}
{% endhighlight %}

For applications of any reasonable complexity, this approach quickly becomes untenable.

Alternative solutions are introduced to wrangle this problem. The primary one that the Angular docs suggest is to use RxJS observables in conjunction with the [`AsyncPipe`](https://angular.io/api/common/AsyncPipe):

{% highlight typescript %}
enum Action {
  INCREMENT,
  DECREMENT,
  INCREMENT_LATER
}

@Component({
  selector: 'counter',
  template: `
    <div>
      <button (click)="update.next(Action.DECREMENT)">decrement</button>
      <span>{{"{{"}} count | async }}</span>
      <button (click)="update.next(Action.INCREMENT)">increment</button>
      <button (click)="update.next(Action.INCREMENT_LATER)">increment later</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Counter {
  readonly update = new Subject<Action>();

  readonly count = this.update.pipe(
    switchScan((prev, action) => {
      switch (action) {
        case Action.INCREMENT:
          return of(prev + 1);
        case Action.DECREMENT:
          return of(prev - 1);
        case Action.INCREMENT_LATER:
          return of(prev + 1).pipe(delay(1000));
      }
    }, 0),
    startWith(0)
  );

  readonly Action = Action;
}
{% endhighlight %}

Under the hood, `AsyncPipe` takes care of subscribing to the observable, informing the change detector when the observable emits a new value, and unsubscribing when the component is destroyed. Observables are a powerful way to model state changes over time, but they come with some serious drawbacks:

- They are difficult to debug.
- They have a very steep learning curve.
- They are great for modeling streams of values (think: mouse movements), but they are overkill for the more common use cases (simple state changes like the on/off state of a checkbox).

To overcome the shortcomings of the default change detection paradigm, the Angular team is working on a new approach called [Signals](https://angular.io/guide/signals). Conceptually, signals are similar to Svelte stores (which we'll get to later), and fundamentally, they solve the change detection problem the same way as React; the framework is taking control over the application's state so that changes can be easily monitored and re-renders can be as efficient as possible.

From the Angular docs:

> Angular Signals is a system that granularly tracks how and where your state is used throughout an application, allowing the framework to optimize rendering updates.

This is a large paradigm shift, making Angular applications more similar to the other frameworks.

<div class="cards tldr">
  <div class="card">
    <div class="card-title">Conclusion</div>
    <div class="card-body">
      <p>Angular's change detection is a disaster. The developer gets two suboptimal choices: (1) the slow and naive default implementation, or the complexity of managing change detection manually. Signals will make it much better, though nearly a decade too late.</p>
    </div>
  </div>
</div>

### Vue

> "I'll track changes to state and react accordingly." —Vue

Vue's approach to change detection is subtly different than both React and Angular. Rather than calling a framework function to change state (React) or changing state and then informing the framework that it has been changed (Angular), you work with state objects that have been specially instrumented by the framework to intercept and detect changes.

Confusingly, Vue has two different APIs that wrap the same underlying change detection engine differently. Under the "Options API," you define an object that contains your state, and Vue assigns a proxied version of that object as a member of `this` for use in the component's functions:

{% highlight html %}
<template>
  <div>
    <button @click="decrement">decrement</button>
    <span>{{"{{"}} count }}</span>
    <button @click="increment">increment</button>
    <button @click="incrementLater">increment later</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        count: 0
      };
    },
    methods: {
      decrement() {
        this.count--;
      },
      increment() {
        this.count++;
      },
      incrementLater() {
        setTimeout(() => {
          this.count++;
        }, 1000);
      }
    }
  };
</script>
{% endhighlight %}

Alternatively, the "Composition API" is somewhat similar to React's hooks: a framework function is called to retrieve a state object that Vue can monitor for changes:

{% highlight html %}
<script setup>
  import { ref } from 'vue';

  const count = ref(0);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function incrementLater() {
    setTimeout(() => {
      count.value++;
    }, 1000);
  }
</script>

<template>
  <div>
    <button @click="decrement">decrement</button>
    <span>{{"{{"}} count }}</span>
    <button @click="increment">increment</button>
    <button @click="incrementLater">increment later</button>
  </div>
</template>
{% endhighlight %}

[Conceptually, the object returned from `ref()` has a getter and a setter for `value`](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#why-refs), which allows Vue to track changes to it.

<div class="cards tldr">
  <div class="card">
    <div class="card-title">Conclusion</div>
    <div class="card-body">
      <p>Vue utilizes JavaScript language features to allow developers to work with stateful variables without thinking about change detection.</p>
    </div>
  </div>
</div>

### Svelte

> "I'll figure it out for you at compile time." —Svelte

On the surface, Svelte's version of our counter component looks pretty similar to the other frameworks:

{% highlight html %}
<script>
  let count = 0;
  function decrement() {
    count--;
  }
  function increment() {
    count++;
  }
  function incrementLater() {
    setTimeout(() => {
      count++;
    }, 1000);
  }
</script>

<div>
  <button on:click="{decrement}">decrement</button>
  <span>{count}</span>
  <button on:click="{increment}">increment</button>
  <button on:click="{incrementLater}">increment later</button>
</div>
{% endhighlight %}

But Svelte's approach to change detection is completely novel in comparison. At compile time, Svelte analyzes an AST (Abstract Syntax Tree) of the component's code and _injects some code into the compiled output_ that surgically updates the DOM when necessary. For example, here is what the compiled `decrement()` function looks like:

{% highlight javascript %}
function decrement() {
  $$invalidate(0, count--, count);
}
{% endhighlight %}

Where `$$invalidate` is a call to Svelte's internals to instruct the compiled component to update the DOM.

This compile-time approach means that Svelte applications don't need to bundle a large runtime along with the application itself.

<div class="cards tldr">
  <div class="card">
    <div class="card-title">Conclusion</div>
    <div class="card-body">
      <p>Svelte strikes a rare win-win balance: developers don't have to think about change detection at all, and can interact with stateful variables intuitively; yet the end user's experience is improved through better performance because a bare-minimum application (with change detection baked in) is shipped to the browser.</p>
    </div>
  </div>
</div>

## So, what?

The nuances of how various frameworks choose to tame this beast is not limited to how things work at the component level; it ripples out to _everything else_ about the framework. To name just a few examples: the concepts used to [create custom React hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) composed of the basic hooks provided by React out of the box are not relevant to generalizing component behavior in Vue; the challenge of working with observables for state management in Angular has led folks to [try and find ways to convert component input props to observables](https://github.com/futhark/ngx-observable-input); the framework's API, dictated by its change detection management paradigm, affects how well it integrates with productivity and quality tools like typechecking, testing, and linting. And so on, and so forth.

And those are just examples from the developer's point of view. Each approach has implications on the performance of the application for the end user. React, Vue, and Angular each ship a runtime to the user's browser that needs to be parsed and executed. Svelte's choice to be a compile-time framework obviates this need in most cases, so the user gets a faster loading experience. Each framework has subtleties that make it more susceptible to particular classes of bugs (often around state management or change detection) that the end user will experience.

Find a change detection paradigm that fits the needs of your application, and everything else will fall into place. Pick one that doesn't work, and you'll be fighting against it for the life of the project.
