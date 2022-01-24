---
title: Using tsm as a shebang interpreter in TypeScript
date: 2022-01-24 07:52:48 MST
tags: software
layout: post
excerpt: Executing TypeScript code typically involves transpiling it down to vanilla JavaScript for use in common environments like Node.js or the browser. tsm is a TypeScript module loader for Node.js, providing native TypeScript support without the need to transpile it to JavaScript first.
canonical:
  name: blog.logrocket.com
  url: https://blog.logrocket.com/using-tsm-shebang-interpreter-typescript/
  date: 2021-11-30
---

## Using tsm as a shebang interpreter in TypeScript

TypeScript has taken the web development world by storm, becoming increasingly popular for enterprise projects and solo developers alike.

Executing TypeScript code typically involves transpiling it down to vanilla JavaScript for use in common environments like Node.js or the browser. This approach still represents the vast majority of how TypeScript programs are run, but a few projects have emerged that allow developers to run their TypeScript code directly.

[tsm](https://github.com/lukeed/tsm/blob/master/docs/usage.md) is a brand new player in this category and represents a step forward in the broader TypeScript/JavaScript ecosystem.

### What is tsm?

tsm is a TypeScript module loader for Node.js, created by [Luke Edwards](https://twitter.com/lukeed05). It expands Node.js to provide native TypeScript support without the need to transpile it to JavaScript first. 

Rather, tsm uses [esbuild](https://esbuild.github.io/) under the hood to quickly transpile TypeScript sources into JavaScript on the fly before passing it to the Node.js runtime. This approach essentially abstracts away the typical transpilation step, making it transparent to the user.

### Should you use tsm?

The primary and most obvious advantage to using tsm is that developers don’t need to worry about TypeScript transpilation. This means that development feedback loops are shorter, build tooling is simpler, and deployment is more straightforward. This is particularly convenient for small projects like one-off scripts.

Because tsm runs on top of Node.js, developers familiar with Node will find using tsm natural and easy to incorporate TypeScript into their projects with a simple step. 

For example, esbuild has built-in source map support, which means that TypeScript programs that run under tsm can be debugged with the standard V8 debugging protocol (included with Node.js) and popular [debugging tools like VS Code](https://blog.logrocket.com/how-to-debug-node-js-apps-in-visual-studio-code/).

Additionally, the vast ecosystem of npm packages and Node built-in APIs are available to TypeScript running with tsm.

### The disadvantages to tsm

One relatively small trade-off of using tsm is that it must be installed, in addition to Node.js itself, on the system that needs to run the TypeScript code. 

This can be an inconvenience if distributing scripts meant to be run directly from the shell (like when using tsm as the interpreter for a script via shebang interpreter directive), but not a problem for fully packaged Node.js modules.

Other than that, there aren’t too many downsides to giving tsm a try, assuming there’s an appetite for new and emerging (and therefore, potentially changing) tech. 

Unlike other elements of a project’s technology stack (such as databases, programming languages, frameworks, etc.), the nice thing about JavaScript build tools is that they can be swapped out later with minimal impact on the application’s source code itself.

### Using tsm

There are a few different ways to hook tsm into a Node.js project.

#### 1. As a replacement for the `node` executable

Assuming you have tsm installed globally (via `npm --global install tsm` or `yarn global add tsm`), you can run TypeScript files using the `tsm` executable, like so:

{% highlight shell %}
tsm index.ts
{% endhighlight %}

For local installations, the `tsm` executable can be found at `./node_modules/.bin/tsm`.

Note that any command-line flags will be passed through to `node`, which is convenient for experimental features, debugging configuration, and the like.

#### 2. With a shebang interpreter directive

Because tsm includes an executable, it can be used in a shebang directive like any other script interpreter. Shebang directives are formatted as such: `!#<path/to/interpreter> [arguments]`. 

They appear at the first line of the file and tell the operating system which program to use to parse and execute the rest of the file.

For example:

{% highlight typescript %}
#!/usr/local/bin/tsm

function print(message: string): void {
  console.log(message);
}

print('hello from TypeScript!');
{% endhighlight %}

#### 3. Using the `--require` or `--loader` hooks

If you still need to use `node` directly rather than the `tsm` executable, you can use the `--require` or `--loader` hooks to instruct `node` to use `tsm` to load TypeScript files. tsm needs to be installed as a local dependency (rather than globally) for this to work.

{% highlight shell %}
node --require tsm index.ts
{% endhighlight %}

{% highlight shell %}
node --loader tsm index.ts
{% endhighlight %}

![Demo: using tsm with require hook](/blog/images/using-tsm-with-require-hook.gif)

## Deno: An alternative to tsm

tsm isn’t the only way to achieve transpilation-less executable TypeScript. Ryan Dahl, the creator of Node.js, has released a project called [Deno](https://deno.land/) that ships with TypeScript support out of the box.

Like Node.js, Deno is built on top of the V8 JavaScript engine and seeks to overcome some of Node.js’s design flaws.

Like Node.js and tsm, Deno can be used directly as an executable:

{% highlight shell %}
deno index.ts
{% endhighlight %}

It can also be used in a shebang directive:

{% highlight typescript %}
!#/usr/local/bin/deno

...
{% endhighlight %}

However, code written for Node.js in TypeScript may not be portable to Deno, as Deno provides its own standard library as a replacement for the Node.js APIs. It also has its own paradigm for distributing modules rather than utilizing npm. Check out [Deno’s standard library](https://deno.land/std) and [API docs](https://doc.deno.land/builtin/stable) for more details.

## Conclusion

tsm is a great way to integrate TypeScript into a Node.js project quickly and seamlessly. Because it’s built upon Node.js, tsm users can leverage the vast ecosystem of packages in npm and the powerful Node.js APIs, all from within TypeScript without needing to set up a complicated build process.

Check out tsm’s [GitHub repo](https://github.com/lukeed/tsm) and [its dependents list](https://github.com/lukeed/tsm/network/dependents?package_id=UGFja2FnZS00OTM3NTU4MzY%3D) to see what people are using it for. Some notable examples include:

- [create-figma-plugin](https://github.com/yuanqing/create-figma-plugin): a comprehensive toolkit for developing plugins and widgets for Figma and FigJam. It is written in TypeScript and uses tsm for its development process
- [tinyhttp](https://github.com/tinyhttp/tinyhttp): a modern web framework written in TypeScript. It uses tsm in its documentation examples as a simple way to get users up and running quickly
- [nanostores](https://github.com/nanostores/nanostores): a tiny state manager for JavaScript projects. tsm is used in the development cycle for this module

In short, use tsm when you want to leverage Node.js’ vast ecosystem from within TypeScript or integrate TypeScript into an existing Node codebase. If you don’t have many npm-only dependencies and want to enjoy the benefits of Deno’s security model, consider using Deno for your next server-side TypeScript project.

Happy coding!
