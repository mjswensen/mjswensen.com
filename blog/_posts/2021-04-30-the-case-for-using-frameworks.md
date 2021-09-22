---
title: The case for using frameworks
date: 2021-04-30 05:58:08 MDT
tags: software
layout: post
excerpt: Like any other tool, the stackless approach can be useful philosophy when approaching a problem. But when working on a team, or on a project with even moderate complexity, leveraging modern frameworks will likely yield dividends throughout the life of the project.
canonical:
  name: blog.logrocket.com
  url: https://blog.logrocket.com/the-case-for-using-frameworks/
  date: 2021-04-07
---

Complaints against the complexity of modern web development tooling setups have been ever increasing in recent years as the web platform continues to evolve and innovate. A recent iteration of this movement toward simplicity is called the "stackless" (or "framework-less") approach, coined by [Daniel Keyhoe of yax.com](https://tutorials.yax.com/).

The core tenets of the stackless approach are:

- Lean into natively supported features and standards of the web platform
- Avoid build tooling and frameworks by using CDN-served npm packages instead
- Use web components

The core sentiment of utilizing standards is an admirable one, and indeed it may suffice for very small projects or prototypes, but here are some reasons why this approach is infeasible in practice for professional web development or projects of material size.

# Frameworks will never go away

Frameworks play a critical role in the frontend ecosystem. As the web platform advances, so do the frameworks that build on top of it. They serve as a critical space to innovate and inform the future direction of the web standards.

Frameworks are built to overcome the deficiencies of the standard features until new standard features are introduced to fill the gaps. They can move faster than standards do, and can experiment with features to fine-tune and validate them before they get proposed and adopted by the platform. An example of this was the revolutionary `jQuery` function (commonly called `$`) in the 2000s and 2010s that directly informed what we know today as `document.querySelectorAll`.

# Stackless has too many limitations

To Keyhoe's credit, the limitations of the stackless approach are clearly acknowledged in [the introductory tutorials](https://tutorials.yax.com/articles/the-yax-way/index.html). Unfortunately, they are prohibitively severe for many types of modern web development projects.

## Data persistence is ignored

Perhaps the largest omission in the stackless approach is that it doesn't account for data persistence. The approach talks about abandoning Rails for standards-based JavaScript, HTML, and CSS, but Rails solves a different problem than the frontend browser technologies.

What about an API to hide sensitive or proprietary business logic from the frontend? What about centralized state persistence? What about user authentication? There are so many common problems and paradigms that the stackless approach simply doesn't account for.

Using "functions" (meaning serverless or Lambda functions) is mentioned in passing, but if you are using serverless functions backed by a database or other storage, all of a sudden you have a "stack" again.

## CSS is too low-level to author maintainability without a framework

CSS is powerful and chock full of features, but in favor of flexibility, it lacks adequate constraints to guide engineers toward solutions that are maintainable or easy for team members to contribute to.

Even with powerful tools like CSS preprocessors, the topic of keeping CSS under control and well-documented is a common point of discussion for software teams. Even the stackless approach [recommends using a CSS framework in the fine print.](https://tutorials.yax.com/articles/the-yax-way/2.html) This is akin to titling an article "How to tour America on foot," and then in the body paragraph write, "Until we figure out a way to walk faster, just use a car."

## State management is unaccounted for

Web components are ill-equipped to manage the complex state required to build an advanced frontend application. The stackless approach can work for simple informational sites, but for applications with complex user interfaces, the state management becomes unwieldy without the help of a framework or state management library.

This is the second time the answer to "how to build an app without a framework" is "actually, just use a framework." There are very few classes of applications that are both useful and don't require the management of complex state.

## Complexity is not addressed

The core problem with the stackless approach is that it tries to abandon complexity without a proposal on where that complexity should go. Complexity, in general, cannot be eliminated — it can only be pushed around to different parts of the system. Here are a few examples:

### Hypermedia APIs vs bespoke RESTful APIs

Hypermedia APIs return the relevant data for the resource, along with links to related API resources that the client must subsequently request. The complexity of assembling the full picture is pushed to the client.

A bespoke API, on the other hand, may handle the complexity of gathering all of the relevant data before returning it to the client in a single, neat package. The complexity of assembling the requisite data can be moved around but not eliminated.

### `create-react-app` and `react-scripts`

The Facebook team behind [React](https://reactjs.org/) has tried to abstract away the complexity of maintaining [webpack](https://webpack.js.org/) and other configuration to bootstrap a React application as quickly as possible. This allows engineers to create fully functional React application without having to worry about installing and configuring all the tooling; they only have to install the `react-scripts`  package.

The build tool complexity didn't go away, its burden just moved into the application's dependencies rather than on the shoulders of the engineer building the application.

# Redeeming qualities of the stackless way

Though using the stackless approach may not be feasible for projects larger than hobbies or prototypes, there are some excellent points in its philosophy that can benefit software projects regardless of which approach they use.

1. "Users are the users." The focus on users' needs, where the definition of users is literally the end users of the software, is a critical point that developers should stay as close to as possible. It is only by keeping the users in mind that applications can be designed empathetically and with critical attributes such as performance and progressive enhancement at the forefront.
2. "Stick to standards." One of the best features of the web is that it moves forward on open standards and an unfailing spirit of backward compatibility. Framework authors and framework users alike should embrace and utilize standard features as much as possible (without being afraid to use non-standard technology such as frameworks when it enables them to build better software more quickly).
3. "Embrace simplicity where possible." The idea of using the best and simplest tool for the job is pervasive in the stackless approach, and indeed, is part of the core DNA of the web. It's easy for engineers to fall into the trap of "over-engineering" solutions to problems that end up just creating more problems themselves; it takes discipline and the wisdom of experience to avoid this trap.

# Use stackless where it makes sense

Like any other tool, the stackless approach can be useful philosophy when approaching a problem. If you need to build a simple app where the features of the raw web platform will suffice, go for it.

Using the least powerful technology capable of accomplishing the task or solving the problem is an excellent way to build solutions.

But when working on a team, or on a project with even moderate complexity, leveraging modern frameworks will likely yield dividends throughout the life of the project.
