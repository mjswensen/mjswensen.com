---
title: What's new in TypeScript 4.2?
date: 2021-05-07 06:09:43 MDT
tags: software
layout: post
excerpt: Version 4.2 of TypeScript was released on 23 February, 2021, and with it a number of nice features, bug fixes, and performance improvements. Here are the most important ones you should be aware of.
canonical:
  name: blog.logrocket.com
  url: https://blog.logrocket.com/whats-new-in-typescript-4-2/
  date: 2021-04-20
---

Version 4.2 of TypeScript was released on 23 February, 2021, and with it a number of nice features, bug fixes, and performance improvements. Here are the most important ones you should be aware of.

# TypeScript 4.2's top enhancements

## More flexible rest elements in tuple types

Previous to 4.2, rest elements could only appear at the end of the tuple type. If we were modeling the state of a two-player game, for example, we might use this tuple type to hold our two `Player`s and a list of the `Move`s they've played:

{% highlight typescript %}
let gameState: [Player, Player, ...Move[]];
{% endhighlight %}

With 4.2, the `Move`s don't have to be at the end of the type; they could be in the middle or even at the beginning. If desired, we can now expand our type as follows, to include which player's turn it is. For additional clarity, we'll take advantage of TypeScript's support for labeled tuple elements (which is not new in 4.2):

{% highlight typescript %}
let gameState: [player1: Player, player2: Player, ...moves: Move[], currentTurn: number];
{% endhighlight %}

## Increased visibility into which files are included in your compiled program

TypeScript's compiler (`tsc`) now includes a new flag, `--explainFiles`, that outputs a list of files included in the compilation as well as basic reasoning behind why they're there, in a simple text format. This can be very helpful when developing or fine-tuning compiler configuration in `tsconfig.json`.

This feature is a nice first step toward debugging build time issues, and I expect to grow more robust and powerful in future releases (for example, a JSON output format for ingestion into other tools for more advanced analysis).

Given a default TypeScript config and an `index.ts` file with a simple `console.log('hello, world!');`, here is some example output from the `--explainFiles` flag:

{% highlight plain %}
node_modules/typescript/lib/lib.d.ts
  Default library
node_modules/typescript/lib/lib.es5.d.ts
  Library referenced via 'es5' from file 'node_modules/typescript/lib/lib.d.ts'
node_modules/typescript/lib/lib.dom.d.ts
  Library referenced via 'dom' from file 'node_modules/typescript/lib/lib.d.ts'
node_modules/typescript/lib/lib.webworker.importscripts.d.ts
  Library referenced via 'webworker.importscripts' from file 'node_modules/typescript/lib/lib.d.ts'
node_modules/typescript/lib/lib.scripthost.d.ts
  Library referenced via 'scripthost' from file 'node_modules/typescript/lib/lib.d.ts'
index.ts
  Root file specified for compilation
{% endhighlight %}

Try it yourself using [this example repository (complete with devcontainer.json) on GitHub.](https://github.com/mjswensen/typescript-4.2)

## Better support for unused destructured variables

When destructuring tuples or arrays, there are times when the elements you are interested in don't appear at the beginning of the list. In these cases, "throwaway" variable names such as `_` or `a`, `b`, `c`, etc., are used for the elements of no interest.

With the `noUnusedLocals` compiler option on, however, these unused local variables would cause TypeScript to throw an error until version 4.2.

Now, simply prepend the unused variable names with `_` and TypeScript will happily ignore these variables and will not throw an error if they are unused. As an example, this new feature would be particularly useful when extracting bits of data from the rows of a CSV spreadsheet:

{% highlight typescript %}
function* getCsvRows(): Generator<string[], void, void> { /* ... */ }

for (const row of getCsvRows()) {
  // Destructure row, utilizing only the 1st, 4th, and 6th columns.
  const [id, _1, _2, name, _3, country] = row;
  // ... do something with id, name, and country
}
{% endhighlight %}

Prefixing unused variable names with `_` is a common convention in situations like these; this is an example of tool authors building thoughtfully around and supporting the existing behavior of their users.

## Smarter type system and performance improvements

As with any TypeScript release, there were also a number of smaller enhancements that are not groundbreaking on their own but they make TypeScript incrementally better and more comfortable to use. To name just a few:

- A helpful error when trying to use the `in` operator on a primitive type. This is normally a runtime error (in JavaScript) but is now caught at compile time in TypeScript
- An internal limit on tuple size in conjunction with the spread syntax, to improve compilation performance
- Better parsing and interpretation of vanilla JavaScript files
- A new flag called `--noPropertyAccessFromIndexSignature` that can help reduce errors from object property name misspellings under certain situations

# More details and resources

A full list of all the enhancements can be seen on the [TypeScript project's releases page on GitHub](https://github.com/microsoft/TypeScript/releases), as well as the [release announcement on the TypeScript blog](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2). Those are the top highlights of the TypeScript 4.2 release. To dive deeper in to the changes or learn more about TypeScript generally, check out the following resources:

- [Release announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/)
- [4.2 release on GitHub](https://github.com/microsoft/TypeScript/releases/tag/v4.2.2)
- [TypeScript source code changes between versions 4.1.5 and 4.2.2](https://github.com/microsoft/TypeScript/compare/v4.1.5...v4.2.2)
- [TypeScript's in-browser playground with version 4.2.2 pre-loaded](https://www.typescriptlang.org/play?ts=4.2.2)
- [TypeScript's homepage, typescriptlang.org](https://www.typescriptlang.org/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/handbook)
