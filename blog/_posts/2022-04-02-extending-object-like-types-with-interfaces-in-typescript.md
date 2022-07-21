---
title: Extending object-like types with interfaces in TypeScript
date: 2022-04-02 18:09:22 MDT
tags: software
layout: post
excerpt: Interfaces are one of TypeScript's core features, allowing developers to flexibly and expressively enforce constraints on their code to reduce bugs and improve code readability.
canonical:
  name: blog.logrocket.com
  url: https://blog.logrocket.com/extending-object-like-types-interfaces-typescript/
  date: 2022-03-02
---

Interfaces are one of TypeScript's core features, allowing developers to flexibly and expressively enforce constraints on their code to reduce bugs and improve code readability. Let's dive into exploring interfaces' characteristics and how we might better leverage them in our programs.

## What are interfaces?

First, a little background. Interfaces are a way for developers to name a type for later reference in their programs. For example, a public library's management software might have a `Book` interface for data representing books in the library's collection:

{% highlight typescript %}
interface Book {
  title: string;
  author: string;
  isbn: string;
}
{% endhighlight %}

With it, we can ensure that book data in the program contains the essential information of title, author, and ISBN. If it doesn't, the TypeScript compiler will throw an error:

{% highlight typescript %}
const tale: Book = {
  title: 'A Tale of Two Cities',
  author: 'Charles Dickens',
  // Error: Property 'isbn' is missing in type '{ title: string; author: string; }' but required in type 'Book'.
};
{% endhighlight %}

### Interfaces vs. types

If you've written TypeScript code before, you might be familiar with type aliases, another common way to name a type, and you might be asking, "Why use interfaces over types or vice versa?" 

The primary difference is that interfaces can be reopened for adding additional properties (via [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)) in different parts of your program, while type aliases cannot. Let's look at how to take advantage of declaration merging, as well as some cases of when you might want to.

## Expanding interfaces in TypeScript

### Option 1: Declaration merging

As noted above, interfaces can be reopened to add new properties and expand the definition of the type. Here is a nonsensical example to illustrate this capability:

{% highlight typescript %}
interface Stock {
  value: number;
}

interface Stock {
  tickerSymbol: string;
}
{% endhighlight %}

Of course, it's not likely that the same interface would be reopened nearby like this. It would be clearer to simply define it in a single statement:

{% highlight typescript %}
interface Stock {
  value: number;
  tickerSymbol: string;
}
{% endhighlight %}

So, when would you want to expand an interface in different parts of your program? Let's take a look at a real-world use case.

#### Declaration merging to wrangle disparate user preferences

Suppose you are writing a React application, and you need some pages that will allow the user to configure information such as their profile, notification preferences, and accessibility settings. 

For clarity and user experience, you've split up these three concerns into three separate pages where the source code will be in three files: `Profile.tsx`, `Notifications.tsx`, and `Accessibility.tsx`.

From an application architecture perspective, it would be nice if all of the user's preferences were contained in a single object that adheres to an interface we'll call `Preferences`. This way, you can easily load and save the preferences object with your backend API with just one or two endpoints rather than several.

The next question is: "Where should the `Preferences` interface be defined?" You could put the interface in its own file, `preferences.ts`, and `import` it into the three pages — or, you could take advantage of declaration merging and have each page define only the properties of `Preferences` that it cares about, like so:

{% highlight typescript %}
// Profile.tsx

interface Preferences {
  avatarUrl: string;
  username: string;
}

const Profile = (props) => {
  // ... UI for managing the user's profile ...
}
{% endhighlight %}

{% highlight typescript %}
// Notifications.tsx

interface Preferences {
  smsEnabled: boolean;
  emailEnabled: boolean;
}

const Notification = (props) => {
  // ... UI for managing the user's notification preferences ...
}
{% endhighlight %}

{% highlight typescript %}
// Accessibility.tsx

interface Preferences {
  highContrastMode: boolean;
}

const Accessibility = (props) => {
  // ... UI for managing the user's accessibility settings ...
}
{% endhighlight %}

In the end, the `Preferences` interface will resolve to fully contain all the properties, as desired:

{% highlight typescript %}
interface Preferences {
  avatarUrl: string;
  username: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  highContrastMode: boolean;
}
{% endhighlight %}

And the UI code is now co-located with only the properties of `Preferences` it is responsible for managing, making the program easier to understand and maintain. Nice!

### Option 2: Extending interfaces in TypeScript

Another way to expand interfaces in TypeScript is to mix one or more of them into a new interface.

{% highlight typescript %}
interface Pet {
  name: string;
  age: number;
}

interface Dog extends Pet {
  breed: string;
}

interface Fish extends Pet {
  finColor: string;
}

const betta: Fish = {
  name: 'Sophie',
  age: 2,
  finColor: 'black',
};
{% endhighlight %}

This probably looks familiar to object-oriented programmers. However, interfaces offer a key feature that is not typically found in traditional object-oriented programming: multiple inheritance. 

Multiple inheritance allows us to combine behaviors and properties of multiple interfaces into a single interface. Let's look at a use case for when you might want to do this.

#### Extending interfaces to form a type-safe global state store

Suppose that you're building an application that enables users to keep track of their to-do lists and their daily schedules in one place. You'll have some different UI components for tracking each of those tasks:

{% highlight typescript %}
// todo-list.ts

interface ToDoListItem {
  title: string;
  completedDate: Date | null;
}

interface ToDoList {
  todos: ToDoListItem[];
}

// ... application code for managing to-do lists ...
{% endhighlight %}


{% highlight typescript %}
// calendar.ts

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

interface Calendar {
  events: CalendarEvent[];
}

// ... application code for managing the calendar ...
{% endhighlight %}

Now that you've created the basic interfaces for keeping track of your two pieces of state, you would like a single interface that represents the state of the entire application. We can use the `extends` keyword to create such an interface. We'll also add a `modified` field so that we know when our state was last updated:

{% highlight typescript %}
interface AppState extends ToDoList, Calendar {
  modified: Date;
}
{% endhighlight %}

Now you can use the `AppState` interface to ensure that the application is properly handling the state.

{% highlight typescript %}
function persist(state: AppState) {
  // ... save the state to a storage layer ...
}

persist({
  todos: [
    { title: 'Text Marcy', completedDate: new Date('2022-02-05') },
    { title: 'Buy groceries', completedDate: null },
  ],
  events: [
    {
      title: 'Study',
      start: new Date('2022-02-11 08:00:00'),
      end: new Date('2022-02-11 10:00:00'),
    },
  ],
  modified: new Date('2022-02-06'),
});
{% endhighlight %}

#### Extending types

While re-opening interfaces is not possible with type aliases, this approach of extending types is, but with some subtle differences in syntax. Here's the equivalent example adapted to use `type` instead of `interface`:

{% highlight typescript %}
type ToDoListItem = {
  title: string;
  completedDate: Date | null;
}
type ToDoList = {
  todos: ToDoListItem[];
}
type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
}
type Calendar = {
  events: CalendarEvent[];
}
type AppState = ToDoList & Calendar & {
  modified: Date;
}
function persist(state: AppState) {
  // ... save the state to a storage layer ...
}
persist({
  todos: [
    { title: 'Text Marcy', completedDate: new Date('2022-02-05') },
    { title: 'Buy groceries', completedDate: null },
  ],
  events: [
    {
      title: 'Study',
      start: new Date('2022-02-11 08:00:00'),
      end: new Date('2022-02-11 10:00:00'),
    },
  ],
  modified: new Date('2022-02-06'),
});
{% endhighlight %}

## Conclusion

There are a few different ways to extend object-like types with interfaces in TypeScript, and, in some cases, you may be able to use type aliases. In those cases, even the [official docs say they are mostly interchangeable](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces), at which point it's down to style, preference, organization, habit, etc. But if you'd like to declare different properties on the same type in different parts of your program, use interfaces.
