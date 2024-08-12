---
title: "Clean + Format: a UX pattern for high-quality user input fields"
date: 2024-08-06 21:42:50 MDT
tags: software
layout: post
excerpt: "Forms are at the core of how users get data into web applications. At Rivet, we've spent some time crafting what we believe is a nice balance between user-friendly, forgiving input fields and real-time validation and formatting."
sitemap:
  lastmod: 2024-08-12 10:21:07 MDT
---

Forms are at the core of how users get data into web applications. And there are so, so many ways to get the UX of text input fields wrong. At Rivet, we've spent some time crafting what we believe is a nice balance between user-friendly, forgiving input fields and real-time validation and formatting.

The secret is simple on the surface but represents a novel insight: typically, the value of a text input is tied to a single piece of state, and all operations like formatting and validation are run against that state. Depending on the implementation, this can lead to user frustration as forms are validated prematurely or input formatted while the user is still trying to type. The answer to an improved experience lies in a two-step approach that separates the *cleaning* and the *formatting* of typed input, allowing users to type freely while ensuring data integrity *and* (later) prettified display of the inputted data.

This approach works for any type of field expecting a particular type of input data, for example:

- Currency input fields
- Integer-only fields
- Number fields with rounding to some maximum number of fractional digits
- Fields with a maximum or minimum allowed value
- Text fields where a particular case is enforced (uppercase-only, lowercase-only)
- Phone number or email fields
- etc.

Let's dive into how it works.

## Secret sauce

The core tenets of the approach are as follows:

1. In real time as the user types input, clean and convert the input into the desired computer-friendly value type on a best-effort basis. It's important that this cleaning algorithm be deterministic and idempotent.
    1. Emit this cleaned up value from the component immediately for use in the application.
    2. In the case of two-way binding, this cleaned value might be immediately sent back into the component from the outer application—pass it through the `clean()` function again, and if the resulting value is the same as the result of `clean()` on the user's current raw input, do nothing (so as not to interrupt the user's work in progress).
2. Once the user leaves the field (on the `blur` event), pass the cleaned value to a `format()` function that produces a human-friendly stringified version of the cleaned value.
    1. Overwrite the user's raw input with this formatted value.

That's a lot to grok—let's break it down step by step as the user flows through a typical input experience.

### Example: currency field

Suppose we want to implement a user-friendly currency field for inputting USD values. Yes, a simple `<input type="number">` might suffice in some situations, but it leaves a lot to be desired in terms of user experience, particularly with the visual formatting of user input. So we use an `<input type="text">` as the core of our custom component and plug in our approach as follows:

1. The user types in their currency value, but makes an error or two on the way, typing `12,34.567a`.
2. We don't get in the user's way and try to format or validate their input. Instead, we make a best guess effort at what they were intending. This is our `clean()` function:
    1. We'll use an algorithm that filters out non-digit characters except `.`, leaving us with `1234.567`.
    2. We'll parse this new string as a number and use a rounding function to coerce our number into a maximum of two fractional digits, leaving us with `1234.57`.
    3. This is our best guess at the user's intention. We'll emit this cleaned numeric value to the application.
3. The application may send this value back to us, or it may send us a different value. This is how we'll react to values coming in programmatically:
    1. We'll run the value coming in through our `clean()` function, and we'll also run the user's current raw input through the `clean()` function. If the two results are an exact match, we'll assume the application is just sending us back the value we just emitted, and do nothing. This is because if we format it and update the `<input>`, the user's work will be interrupted and their cursor position will change. If it's different, however, we can assume that the application state has changed in some way—perhaps we loaded some data from the server and need to update the state of this field—so we'll go ahead and run this value through our `format()` function (more on this below) and overwrite the user's text in the `<input>`.
4. Once the user leaves the input field (on the `blur` event), we'll take our most recent result of `clean()` and pass it through `format()`, and update the value of the `<input>`. This is what the `format()` function will do:
    1. Our cleaned, computer-friendly value is `1234.57`. We want to turn this into something more human-friendly with some typical currency formatting. We can use the `Intl` API or any number formatting library to stringify this value into `$1,234.57`.
    2. We write the formatted value to the `<input>` for display.

Here's what it looks like in action. Note the `clean()`ed value echoed back to the UI under the field for demonstration purposes.

![Currency field demonstration](/blog/images/currency-field.gif)

## Precise semantics of `clean()` + `format()`

So how do you determine how to implement your `clean()` and `format()` functions, and which bits of processing should belong in each one?

<div class="table-wrapper">
    <table>
        <thead>
            <tr>
                <th>Function</th>
                <th><code>clean()</code></th>
                <th><code>format()</code></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Purpose</td>
                <td>Takes raw user input and converts it into a computer-friendly value for use by the application.</td>
                <td>Takes the cleaned value from `clean()` and formats it into a human-friendly string.</td>
            </tr>
            <tr>
                <td>Implementation responsibility</td>
                <td>Likely to be bespoke but could be delegated to a library depending on the needs of the input.</td>
                <td>Unless very specific formatting is needed, likely to be delegated to a formatting library or language/platform API.</td>
            </tr>
            <tr>
                <td>Idempotent?</td>
                <td>Yes</td>
                <td>No</td>
            </tr>
            <tr>
                <td>Deterministic?</td>
                <td>Yes</td>
                <td>Yes</td>
            </tr>
        </tbody>
    </table>
</div>

## Conclusion

Creating user-friendly input fields is a delicate balancing act. By separating the cleaned computer-friendly value from the user's raw input state, we ensure that they can type freely without interruptions, while also maintaining data integrity and sending the correct data type to the outer application for immediate use. After the user is done working we can present neatly formatted results. This approach can be applied to various types of input fields; wherever some additional structure is needed on top of the raw input text.
