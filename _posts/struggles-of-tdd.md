---
title: "Docstring Driven Development: For when TDD struggles under the weight of shifting design."
excerpt: "For me at least though, besides all the often talked about reasons for TDD, or at least heavy immediate testing, the mental focus it gives me is what I find to be the greatest benefit."
coverImage: "/assets/blog/tdd-struggles/red_mountain.jpg"
date: "2021-07-24"
tags: [tdd, process]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/tdd-struggles/red_mountain.jpg"
---

When I started my first full time programming position, my manager at time gave me my first assignment: working through the book "Obey the Testing Goat" by Harry Percival (link to that at the bottom). It was a rather perfect book for the tech stack I was to be working in, being that unit / integration testing was a recent big focus of the group, they used Python, they used Django, and would soon be adding end to end Selenium testing to the product, besides instilling a sense of the importance of testing in general in a young software engineer.

## The Goat

For those not familiar with the book the primary focus of it is around the concept of Test Driven Development or TDD. The idea that you should write your test assertions _before_ you write the code that actually implements the thing you are testing. The workflow looks something like this:

1. Know requirements of the function/ class/ database table generator / React component / whatever. Inputs, outputs, etc.
2. Write a test case that runs the code you haven't written yet, passes in need params or conditions, and then asserts on the expected results based on step 1.
3. Run that test and watch it fail since you haven't built anything yet.
4. Write the code for the feature until the test passes.
5. Rinse repeat for all requirements / parts of the code.

This seems rather obsessive at first, and many people opt for a lighter version where the tests are written immediately _after_ the code is written to spec before moving on to the next task. But even when working in the lightened version of TDD, the immediacy of writing tests as soon as possible has many benefits, especially when a feature has nuanced or subtle behavior that is easy to forget to check for. "Should that button really change colors when the other button is clicked, or is that a bug?" If you have tests in place for it then you know for sure. Bonus points if those tests have a link to design docs. People will argue that there are still benefits for the code design process in doing the test _first_ but I wont get too deep into that in this post. Plenty of arguments on forums to find if you want to fall down that rabbit hole.

For me at least though, besides all the often talked about reasons for TDD, or at least heavy immediate testing, the mental focus it gives me is what I find to be the greatest benefit. I have a bad tendency to jump around as I build a feature, fixing things and improving them as I see fit in that moment, to the point I'll sometimes lose sight of what I was even really trying to build in the first place. 2 hours of refactoring later and the feature is no closer to being done but its "better now" or so I claim. TDD gives focus. It gives purpose to every keystroke. One piece at a time, one subtle behavior at a time, the system is built, keeping a sense of direction to the work. At the end of the day I'm not really being paid to make code pretty, thats a part of my job for sure (or so I like to tell my boss) but in the end I need to build things that do things. And TDD helps keep me on that path, one test at a time.

But implied in step 1 of the TDD process is a good solid understanding of what exactly the thing being worked on needs to do and a suggestion that it won't change much in the immediate future. Writing tests, in a way, cements the project into a particular behavior, and if that behavior changes, then not only does the code need to be updated, so do the tests. This is a feature, not a bug of TDD (and aggressive testing in general), as it keeps the expected behavior of the project documented in the form of automate-able testing code, and makes changes to the system that much more willful. But at the end of the day, updating a lot of tests is a _lot_ of work and time. And we have deadlines. Hence why some developers still hold out on the whole ideas of unit testing. I had never thought this argument particularly convincing as I found the time sink worth it and that we can just deal with the timelines later. I'm a professional, I have standards.

## The Contrarian

Until recently, when a discussion with a few team mates about how much time it took to update Jest / React Testing Library (RTL) tests took when UI designs changed, and one brave dev had the courage to say

> "I don't know guys maybe we shouldn't write any tests until the feature is done to save time?"

GASP!! The _heresy_!!!!!

This comment took me aback initially and I had to restrain myself un-muting my mic and and going on a verbal crusade for The Goat against this heretic. But I paused. Because ya know what? He had a point. The last few months I had been very slow developing a very important feature for a beta coming up. And one of the main reasons for my slowness, was every time I put up a pull request with parts of this feature, and deployed it to test servers for people to poke at the UI, new insights appeared. Things I had forgotten to implement (clicking a drop down option a second time should _also_ uncheck it?? Crap.) subtleties in animations and HTML structure. Desired smart features around things auto-updating as users made selection. I had built the thing close to the spec from the static designs our UI/UX dev had made, but static images don't convey well how an app _feels_ in motion, and once you start really using the thing, you realize all the "between the lines" elements you overlooked. That or seeing it in motion gives ideas for some whole new behavior. These insights often had implications for the assertions in all my RTL tests. As a result I spent a _lot_ of time rewriting tests.

Now you may be thinking, "come on man just get early versions of your software in front of someone earlier." Right you are. And I will be doing more of that, but even still at the time I _was_ trying to make my PR's as small as possible just for that reason. Even so that leaves an issue for TDD. If you really want to TDD a UI feature, you will by design be writing tests _before_ anyone but you has seen it. Before your UI/UX person has seen it or other devs. And sadly not all work places have the ability to put early builds in front of people on a daily / weekly basis and they certainly don't always have clear reqs. Sometimes resource are more scarce and / or more improvised. So what do you do then? What do you do when you want to document the behavior of your app via testing, keep the focus and benefits of TDD, but you are working on a feature that you know may be subject to some shifting requirements and those deadlines are bearing down on you, meaning you don't have the luxury of rewriting you tests eight times.

## The Goat on a diet

The idea of not writing tests until the feature is "done" is something I'm not a fan of. At all. And in said discussion others pointed out that some subtleties of the UI in question would be too easy to lose track of to risk that, and that fixing regressions would probably waste more time than rewriting tests. So is there a way to get both?

My current proposal I will be testing out to solve this problem is what I'm going to call "Docstring Driven Development". I must state up front that I don't advocate this for all tests in a system. It's often easy to point out things likely to change and things that aren't. Try to divide and conquer as best you can.

So heres how this Docstring Driven Development (Triple D) workflow would go:

1. Same as the first step in TDD. Get your reqs as best you can. Know thy enemy.
2. Write a boiler plate scaffolded out test, but don't fill out the actually executing body code of the test. Instead fill out a very descriptive doc string for the test in question. "If X happens, verify that Y happens". Maybe put a `console.log("TODO")` or something in the test itself.
3. Write the feature
4. Rinse repeat

Why is this good? Well the act of writing out the test doc string gives a similar level of focus and attention to the end goal as before. It puts the reqs for the feature in source control. If you have some system that lints for `TODO`s, it'll yell at you about the TODO statement. Or in the case of Jest if you leave the test body blank, when Jest runs the test, it will fail as it contains no assertions, which you will add later. If you are doing test coverage reports, the coverage will still drop in the meantime, but the tests are ready and waiting. All this keeps eyes on the fact that the work is not done yet, and the doc string tells what work needs to be done. No "hey what was this thing supposed to do again? I can't think of tests to write..."

A test in Jest/ RTL would look something like this"

```javascript
test(`Given the filtering dropdowns are rendered with no items to filter, verify that every filter is
deactivated on load.`, async () => {
    // TODO
    console.log('UNFINISHED TEST');
});
```

Write out a full feature with tests like this, then put it in front of someone. If nothing changes, great, fill in the body of all your tests you have and PR it. But if something needs to be changed, added, removed, etc, you now find yourself in a bit more agile position. You can update your doc strings to match the new intent, right then and there before you forget it (not that I've ever done that...), update your code and check again. Once things are more stable, fully write out the tests and cement it. No deleting / changing a bunch of intricate test assertions for a functionality that no longer exists.

## Diet Goats favorite foods

I think there are certain situation in development that the Triple D technique can work well. As I've already implied, RTL / UI testing is a big one. The sheer amount of subtle changes and shifts that occur in this sub domain of software can be mind boggling and very difficult to keep track of. Any system that may go through similar flux, but require significant verification of its behavior is a potential time to use this.

Selenium / Cypress testing is another one that comes to mind as I have also spent some significant time reworking Selenium tests for similar reasons. The sheer time it takes to actually _run_ the Selenium tests is another good reason to not waste unneeded time writing them.

## Times to make The Goat fat

REST API systems tend to _not_ benefit from this as much in my opinion, as the input / output clarity is often good enough that any changes are (hopefully) small, and the test code itself easy to change. Changing a few characters in a REST API response assertion is a lot easier than changing the whole order of click events in an RTL test. They also tend to be fast.

A similar story is often present in many backend function unit tests. A change in a single utility function that converts URL paths is unlikely to cause significant time sink in testing code if it changes a bit. A function that does mathematics? TDD the hell out of it.

## Closing thoughts

I'm going to try this out in earnest with the next major React based feature I build and see how it goes, as my initial experimentation with it on the tail end of my last feature went well. Not writing tests feels sloppy to me, and I don't trust my own mind to remember to manually verify everything some bit of code is supposed to do, but this seems like a good middle ground. I don't advocate this as any sort of replacement of TDD and its like, just as an extra tool in your tool kit for when the going gets choppy. May you never need it.

## Resources

Online version of Obey the Testing Goat can be found [here](https://www.obeythetestinggoat.com/) which also contains links to buy a print or digital version.
