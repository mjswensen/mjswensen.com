---
title: Mastering mapped types in TypeScript
date: 2022-02-18 13:17:28 MST
tags: software
layout: post
excerpt: Mapped types are a handy TypeScript feature that allow for types to be automatically derived from other types.
canonical:
  name: blog.logrocket.com
  url: https://blog.logrocket.com/mastering-mapped-types-typescript/
  date: 2022-01-18
---

Mapped types are a handy TypeScript feature that allow authors to keep their types [DRY ("Don't Repeat Yourself")](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). However, because they tow the line between programming and [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming), they can be difficult to understand at first. 

In this post, we'll cover some foundational concepts that enable mapped types, then walk through an advanced, real-world example.

## Why use mapped types in TypeScript?

Using mapped types in a program is especially useful when there is a need for a type to be derived from (and remain in sync with) another type.

{% highlight typescript %}
// Configuration values for the current user
type AppConfig = {
  username: string;
  layout: string;
};

// Whether or not the user has permission to change configuration values
type AppPermissions = {
  changeUsername: boolean;
  changeLayout: boolean;
};
{% endhighlight %}

This example is problematic because there is an implicit relationship between `AppConfig` and `AppPermissions`. Whenever a new configuration value is added to `AppConfig`, there must also be a corresponding `boolean` value in `AppPermissions`.

It is better to have the type system manage this relationship than to rely on the discipline of future program editors to make the appropriate updates to both types simultaneously. 

We'll delve into the specifics of the mapped types syntax later on, but here is a preview of the same example using mapped types instead of explicit types:

{% highlight typescript %}
// Configuration values for the current user
type AppConfig = {
  username: string;
  layout: string;
};

// Whether or not the user has permission to change configuration values
type AppPermissions = {
  [Property in keyof AppConfig as `change${Capitalize<Property>}`]: boolean
};
{% endhighlight %}

## Foundational concepts of mapped types

Mapped types build upon each of these concepts and TypeScript features. 

### What is a mapped type?

In a computer science context, the term "map" means to transform one thing into another, or, more commonly, refers to turning similar items into a different list of transformed items. Likely the most familiar application of this idea is `Array.prototype.map()`, which is used in everyday TypeScript and JavaScript programming:

{% highlight typescript %}
[1, 2, 3].map(value => value.toString()); // Yields ["1", "2", "3"]
{% endhighlight %}

Here we've mapped each number in the array to its string representation. So a mapped type in TypeScript means we're taking one type and transforming it into another type by applying a transformation to each of its properties.

### Indexed access types in TypeScript

TypeScript authors can access the type of a property by looking it up by name:

{% highlight typescript %}
type AppConfig = {
  username: string;
  layout: string;
};

type Username = AppConfig["username"];
{% endhighlight %}

In this case, the resolved type of `Username` is `string`. For more information on indexed access types, see the [official docs](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html).

### Index signatures

Index signatures are handy for cases when the actual names of the type's properties are not known, but the type of data they will reference is known.

{% highlight typescript %}
type User = {
  name: string;
  preferences: {
    [key: string]: string;
  }
};

const currentUser: User = {
  name: 'Foo Bar',
  preferences: {
    lang: 'en',
  },
};
const currentLang = currentUser.preferences.lang;
{% endhighlight %}

In this example, the TypeScript compiler reports that the type of `currentLang` is `string` rather than `any`. This functionality, in conjunction with the `keyof` operator detailed below, is one of the core components that make mapped types possible. For more information on index signatures, see the official documentation on [object types](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures).

### Using union types in TypeScript

A union type is a combination of two or more types. It signals to the TypeScript compiler that the type of the underlying value could be any one of the types included in the union. This is a valid TypeScript program:

{% highlight typescript %}
type StringOrNumberUnion = string | number;

let value: StringOrNumberUnion = 'hello, world!';
value = 100;
{% endhighlight %}

Here is a more complicated example that shows some of the advanced protection the compiler can offer with union types:

{% highlight typescript %}
type Animal = {
  name: string;
  species: string;
};

type Person = {
  name: string;
  age: number;
};

type AnimalOrPerson = Animal | Person;

const value: AnimalOrPerson = loadFromSomewhereElse();

console.log(value.name); // No problem, both Animal and Person have the name property.
console.log(value.age); // Compilation error; value might not have the age property if it is an Animal.

if ('age' in value) {
  console.log(value.age); // No problem, TS knows that value has the age property, and therefore it must be a Person if we're inside this if block.
}
{% endhighlight %}

See the docs on [everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) for more information on union types.

### Using the `keyof` type operator

The `keyof` type operator returns a union of the keys of the type passed to it. For example:

{% highlight typescript %}
type AppConfig = {
  username: string;
  layout: string;
};

type AppConfigKey = keyof AppConfig;
{% endhighlight %}

The `AppConfigKey` type resolves to `"username" | "layout"`. Note that this also works in tandem with index signatures:

{% highlight typescript %}
type User = {
  name: string;
  preferences: {
    [key: string]: string;
  }
};

type UserPreferenceKey = keyof User["preferences"];
{% endhighlight %}

The `UserPreferenceKey` type resolves to `string | number` (`number` because accessing JavaScript object properties by number is valid syntax). Read about the [`keyof` type operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) here.

## Mapped types: a real-world example

Now that we've covered the foundations upon which TypeScript's mapped types feature is built, let's walk through a detailed real-world example. Suppose our program keeps track of electronic devices and their manufacturers and prices. We might have a type like this to represent each device:

{% highlight typescript %}
type Device = {
  manufacturer: string;
  price: number;
};
{% endhighlight %}

Now, we'd like to ensure that we have a way to display those devices to the user in a human-readable format, so we'll add a new type for an object that can format each property of a `Device` with an appropriate formatting function:

{% highlight typescript %}
type DeviceFormatter = {
  [Key in keyof Device as `format${Capitalize<Key>}`]: (value: Device[Key]) => string;
};
{% endhighlight %}

Let's pull this code block apart, piece by piece.

`Key in keyof Device` uses the `keyof` type operator to generate a union of all keys in `Device`. Putting it inside of an index signature essentially iterates through all properties of `Device` and maps them to properties of `DeviceFormatter`.

`format${Capitalize<Key>}` is the transformation part of the mapping and uses [key remapping](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as) and [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to change the property name from `x` to `formatX`.

`(value: Device[Key]) => string;` is where we utilize the indexed access type `Device[Key]` to indicate that the format function's `value` parameter is of the type of the property we are formatting. So, `formatManufacturer` takes a `string` (the manufacturer) while `formatPrice` takes a `number` (the price).

Here's what the `DeviceFormatter` type looks like:

{% highlight typescript %}
type DeviceFormatter = {
  formatManufacturer: (value: string) => string;
  formatPrice: (value: number) => string;
};
{% endhighlight %}

Now, let's suppose we add a third property, `releaseYear`, to our `Device` type:

{% highlight typescript %}
type Device = {
  manufacturer: string;
  price: number;
  releaseYear: number;
}
{% endhighlight %}

Thanks to the power of mapped types, the `DeviceFormatter` type is automatically expanded to look like this without any additional work on our part:

{% highlight typescript %}
type DeviceFormatter = {
  formatManufacturer: (value: string) => string;
  formatPrice: (value: number) => string;
  formatReleaseYear: (value: number) => string;
};
{% endhighlight %}

Any implementations of `DeviceFormatter` must add the new function or compilation will fail. Voilà!

## Bonus: a reusable formatter type with generics

Suppose now that our program not only needs to keep track of electronic devices but also accessories for those devices:

{% highlight typescript %}
type Accessory = {
  color: string;
  size: number;
};
{% endhighlight %}

Again, we want a type for an object that can provide string formatting functions for all the properties of `Accessory`. We could implement an `AccessoryFormatter` type, similar to how we implemented `DeviceFormatter`, but we end up with mostly duplicate code:

{% highlight typescript %}
type AccessoryFormatter = {
  [Key in keyof Accessory as `format${Capitalize<Key>}`]: (value: Accessory[Key]) => string;
};
{% endhighlight %}

The only difference is that we've replaced references to the `Device` type with `Accessory`. Instead, we can create a generic type that takes `Device` or `Accessory` as a type argument and produces the desired mapped type. Traditionally, `T` is used to represent the type argument.

{% highlight typescript %}
type Formatter<T> = {
  [Key in keyof T as `format${Capitalize<Key & string>}`]: (value: T[Key]) => string;
}
{% endhighlight %}

Note that we have to make one slight change to our property name transformation. Because `T` could be any type, we don't know for sure that `Key` is a `string` (for example, arrays have `number` properties), so we take the [intersection](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types) of the property name and `string` to satisfy the constraint imposed by `Capitalize`. 

See the [TypeScript documentation on generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) for more detail on how they work. Now we can replace our bespoke implementations of `DeviceFormatter` and `AccessoryFormatter` to use the generic type instead:

{% highlight typescript %}
type DeviceFormatter = Formatter<Device>;
type AccessoryFormatter = Formatter<Accessory>;
{% endhighlight %}

Here is the full final code:

{% highlight typescript %}
type Device = {
  manufacturer: string;
  price: number;
  releaseYear: number;
};

type Accessory = {
  color: string;
  size: number;
};

type Formatter<T> = {
  [Key in keyof T as `format${Capitalize<Key & string>}`]: (value: T[Key]) => string;
};

type DeviceFormatter = Formatter<Device>;
type AccessoryFormatter = Formatter<Accessory>;

const deviceFormatter: DeviceFormatter = {
  formatManufacturer: (manufacturer) => manufacturer,
  formatPrice: (price) => `$${price.toFixed(2)}`,
  formatReleaseYear: (year) => year.toString(),
};

const accessoryFormatter: AccessoryFormatter = {
  formatColor: (color) => color,
  formatSize: (size) => `${size} inches`,
};
{% endhighlight %}

[Try this code in the TypeScript playground on typescriptlang.org.](https://www.typescriptlang.org/play?ssl=29&ssc=1&pln=1&pc=1#code/C4TwDgpgBAIhBuBLAxtAvFA3gKClAtgIYB2ArgGaHLAQBOdAXFAM7C2LEDmA3LlGO1RMy+AEZ1eeegBsIhZhACac2sNJiJ2AL69soSFACCyVM2YB7WiCgYceZOemWmrdl0ktEALwhqNtXh1sPXBoADFLImAaWgAeABUAPhssPgBtAGkIaw4oAGts83IoeKh5KAADckjCYAASTABhQjBEYEJpbwhYrOsAMhY2Dk5ErQqAXSYACngO0l8SzOzxgEobZNdhwN19aDgkVAjaKJiUo5O6WP2UCETeXaMTCDNLEHPa04x36MvjUwsrHdgg5iKwoAATBA3b4xJjXQ41H60FJ2KDVY61ACyJAoVBijCgUyIZEo1FI9FoazQyWJuLJFIANHx0VEAAqCBZTAQ3KnJCp1Brc1AAOmA5jCiAAHhBwVMAEwrMZMvAs2oAJQgsnkShU0xAKl5UH1hFoovMAGUhlwpismUFsCCwVR-q8YQS-s8AW9EZ9UirEY1HM5CQ4nJT1lBQ5ZlWjEeautNmF1DfzMEmfFooBxkAALZ4VO28IA)

## Conclusion

Mapped types provide a powerful way to keep related types in sync automatically. They can also help prevent bugs by keeping types DRY and obviating the need to repetitively type (or copy and paste) similar property names.

Happy typing!
