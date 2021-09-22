---
title: Should you drop support for IE 11?
date: 2021-03-02 09:02:44 MST
tags: software
layout: post
excerpt: Each app, business, and project will have a different answer and timeline for dropping legacy browser support. Here are some different aspects of this question as you consider dropping IE 11 for your app or web site.
canonical:
  name: blog.logrocket.com
  url: https://blog.logrocket.com/should-you-drop-support-for-internet-explorer-11/
  date: 2021-01-18
---

Celebration. Joy. Relief.

These are some of the words used to describe a web developer's reaction to [Microsoft's announcement that some of their own apps and services will end support for Internet Explorer 11 in August 2021](https://techcommunity.microsoft.com/t5/microsoft-365-blog/microsoft-365-apps-say-farewell-to-internet-explorer-11-and/ba-p/1591666#ftag=MSF278e2c0). While IE 11 is [not officially sunsetted](https://docs.microsoft.com/en-us/lifecycle/faq/internet-explorer-microsoft-edge#what-is-the-lifecycle-policy-for-internet-explorer) (it follows the same support cycle as the platforms with which it is included), it has taken a back seat to its replacement, Microsoft Edge, and is definitively on its way out.

And though precise measurement of browser usage is difficult, IE 11 [likely represents approximately just 1% of the internet's browsing traffic](https://gs.statcounter.com/) at the time of writing.

So, should your app or service continue to invest time in IE 11 support? The answer is every software engineer's favorite: *it depends.*

Each app, business, and project will have a different answer and timeline for dropping legacy browser support. Below are some different aspects of this question as you consider dropping IE 11 for your app or web site.

## Should you drop IE 11 support?

### Who are your customers?

Identifying who your users are and how they interact with your web property is paramount to making decisions regarding browser support. Are your users primarily from large corporations whose IT departments have strict policies in place that limit choice for web browsing software, or are your customers from small businesses where the latest tools and technologies are the norm?

How many of your current users interact with your app using IE 11? What job(s) does your software get done for your users? Answering these fundamental questions will lay the groundwork for a productive internal discussion on whether or not to drop IE 11 support.

### How much do your customers pay for your app or site?

Do you build a B2B SaaS offering with large but infrequent contracts, or are you building a hobby app in your free time outside of a regular job?

Is the technology itself the core value proposition of your app or does it simply enable your underlying business model?

In each of these cases, a shift in legacy technology support will have dramatic differences in how the project or business will be impacted. You need to involve all key stakeholders of the app and carefully weigh the benefits of developer experience against any potential reductions in revenue or other business implications.

### Does your company have a service level agreement in place that outlines which technologies you are obligated to support?

Some large contracts include stipulations about legacy support timelines and service level agreements for bug fixes, among other things. If applicable, be sure to check with your company's legal department to be sure that dropping IE 11 support would not constitute a breach of any contract.

### Do the benefits outweigh the costs for dropping IE 11 support?

Ultimately, all of the above exploratory questions lead to a final cost-benefit analysis on dropping vs. maintaining IE 11 support for your site or app. Answers to the above questions will help you rank, compare, and add to the following lists of example costs and benefits:

**Costs of dropping IE 11 support**

- Some users may no longer be able to use your site or app. This could decrease revenue or increase support ticket volume, etc

**Benefits of dropping IE 11 support**

- Your site may be able to take better advantage of modern APIs or browser features
- You may be able to simplify your testing and quality assurance processes
- Your development cycle may be faster due to decreased compatibility requirements
- You may be able to reduce the amount of code that is downloaded for your site/app if polyfills for older browsers can be removed
- If you were already shipping different bundles for different levels of browser support, your deployed assets may be able to be simplified or consolidated

### How to pragmatically drop support for IE 11

OK, so you've carefully considered all the possibilities and potential implications of dropping IE 11 support and have decided that the benefits outweigh the costs. What's next?

There are a few different approaches that can help minimize any friction users might encounter.

At my company, Rivet, we supported IE 11 for the first year or so of the company's life, and later decided to limit browser support to the latest two versions of the evergreen browsers (such as Chrome, Safari, Firefox, and Edge).

Rather than pull the plug completely, we carefully crafted a fallback experience for users who try to access our application with a legacy browser. To do this, we ship a separate bundle — a mini-app — that supports all browsers and shows an instructional message to the user prompting them to download a modern browser if they wish to access our application.

This added a little bit of complexity to our build and deploy processes, but has proven worth it; to simply show a blank page with a console full of errors would leave the user stranded and without a clear path on how to get unstuck.

Our CTO even visited the office of one of our largest customers. Upon arrival, he witnessed one of our users open up our app in IE 11, see the message, and then promptly switch over to Chrome to continue using the app. It was certainly a relatively smooth experience compared to the alternative, which perhaps would have been an awkward moment of confusion followed by "Yeah... you'll want to try that again in Chrome or Firefox."

If an automatic in-app message is not an option, there are other ways to ensure your users are as taken care of as possible:

- An email marketing campaign informing and preparing users of the change
- Custom error pages that direct to a help center or provide a way to get in contact with you when something goes wrong
- A message that is pushed to users proactively using a chat widget like [Intercom](https://www.intercom.com/) or similar

### Alternative option: progressive enhancement

Legacy browser support also doesn't have to be an all-or-nothing endeavor. The spirit of backward compatibility and [progressive enhancement](https://resilientwebdesign.com/) runs deep into the web's DNA.

Responsive web design is the practice of offering a different design for your site or app depending on the size or type of device your user is using to interact with it. This idea is extended beyond aesthetic considerations to include behaviors and functionality.

The idea of offering a different experience based on the capabilities of the user's browser is as old as the web itself. You might, therefore, consider offering basic functionality to IE 11 users along with a prompt to upgrade to a modern, standards-based browser for more advanced features.

### Conclusion

Ultimately, software is for humans, by humans, and is a way that we communicate with each other and make each other's lives better.

There is a delicate balance between pursuing a comfortable developer experience — therefore shortening the release cycle and allowing for more or higher quality software to be shipped more quickly — and enabling as many types of users as possible to gain value from an app.

Dropping support for legacy browsers like IE 11 should be considered carefully and approached pragmatically and empathetically.
