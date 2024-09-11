---
title: "A bobblehead and a dev walk into a unit testing bar."
excerpt: "This is the story of how a previous manager solved a persistent testing failure issue by making devs stare at a horse butt on their desk."
coverImage: "/assets/blog/bobblehead/black_mountain_lodge.jpg"
date: "2022-06-08"
tags: [testing]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/bobblehead/black_mountain_lodge.jpg"
---

So it turns out that comical shaming can be an excellent motivator. This is the story of how a previous manager solved a persistent testing failure issue by making devs stare at a horse butt on their desk.

## Zombie Tests

The system being developed had a pretty extensive suite of unit / integration tests that ran on a varying set of schedules. The quick ones could be easily ran by devs with a few commands, many were ran when a pull request was created and gated its merging. But other tests required significantly more resources and setup and as such were ran on nightly / weekly schedules with dedicated hardware and an in house built test runner. The results of these tests were then dumped out into a Slack channel by Jenkins for all to see with a list of passes and failures. The data and complexity involved in some of these tests were hard to understate as the app processed genetic data and parsed it with some rather complex algorithms.

Many times when a test began to fail it was resolved by developers as it came up, with some layers of automation even creating tickets and assigning them when it was clear who broke what. But of the hundreds and hundreds of tests being ran there was a set of about a dozen of them that failed regularly and due to the nature of them were hard to pin point just who should fix them and how. So they languished. The failures became normal and eventually became noise in the system. I distinctly remember one developer just blatantly asking "can we just delete them?"

Worst of all the pile of persistent failures seemed to be growing with each incredibly complex test that proved finicky but yet at least hypothetically useful.

## The Blame Horse

That is until one day the manager of the software department uttered possibly my favorite phrase I've ever heard from a manager.

> What I need is a GIANT BUTT I can put on peoples desks who break tests until they're fixed. Break a test, you get the butt.

So off he went to find a giant butt.

What he found wound up being something of the company mascot until the pandemic took away our in-office desks that were his home. Meet Testy The Testing Horse.

![testy](/assets/blog/bobblehead/testy.jpg)

Testy came from the lands of Amazon and was a bobblehead statue, but instead of the head bobbling it was his butt.

When a test running in automation broke, or the application build itself broke, when the culprit was identified who merged in the code that caused the failure, Testy was plopped in all his bobbling butt-headed glory onto that persons desk. Adding to the hilarity was that most of us worked in an semi-open office plan so it was easy to spot him being dropped on someones desk with some ceremony. And there he would stay until the next test broke, even if the original offending failing test had been fixed. We even made things professional and had a Confluence page called "Where is Testy?" that kept track of his location around the office for when he needed to migrate.

## The Fallout

The persistently failing tests stopped failing within a week. And turn around time on repairing a newly broken test dropped notably along with it.

It's important to note that all this was done in good humor. It was never mean or personal and everyone got a good laugh out of Testy finding a new home. My direct supervisor told this story to his girlfriend at the time and she thought that shaming someone with a trophy for making a mistake sounded like a great way to land in the hotseat with HR. Quite possible. Testy was liked so much though that the plan had a slight backfire. One developer in particular started joking that they wanted to break tests _on purpose_ so that they could have Testy living on their desk as much as possible. Other potential shame trophies was the use of an actual durian fruit with the threat of cutting it open hanging over us like a smelly Sword of Damocles. Things never got that desperate luckily.

If there is one thing I've missed working remote the last two years its been goofy stuff like this and I have yet to come up with a remote work version of Testy. Maybe that can be my next side project...
