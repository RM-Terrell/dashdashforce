---
title: "Kagi, Orion, and reflections on learning things with AI"
excerpt: "Rediscovering the web and roasting some LLMs with benchmark data"
coverImage: "/assets/blog/kagi_orion_ai/rock_grass.JPG"
date: "2025-10-19"
tags: [ai, kagi, orion, gemini, go]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/kagi_orion_ai/rock_grass.JPG"
---

This post will be a bit of rambling hodge-podge of thoughts on related new tech, followed by documenting my [first bad AI hallucination](#lies) when benchmarking some Go code. The main feature will be [Kagi](#kagi) and [Kagi Assistant](#kagi-assistant). It has also been a while since I wrote about my thoughts on using AI as a software engineer and the act of writing it out has helped me clarify them for myself, as my experiences lately have been _mixed_ to say the least.

This post may almost read as a crappy paid advertisement for Kagi and Orion because for me, these two software systems have resulted in me rediscovering the web in a way that I haven't felt since when I first discovered Ask Jeeves and early Google while using an original bubble iMac. Alas I'm a small fry without sponsorships, but a fanboy of things that Just Work. So what's the buzz about?

For me it all started [with this article](https://arstechnica.com/gadgets/2025/08/enough-is-enough-i-dumped-googles-worsening-search-for-kagi/)

In short, [Kagi Search](https://kagi.com) is a paid search service (you pay for it, with money, unlike with your data and privacy like every other search engine) that is ran by a [public benefit corporation](https://www.britannica.com/money/what-is-a-public-benefit-corporation). Most practically for me, it gives the ability to do things like

- Increase the priority of certain sites and de-prioritize others, and do so with "lenses" of search that you can control. Example: a programming lense that comes included by default that prioritizes programming related forums and sites above others. Searching "Java beans" will bring back rather different results with this lens than without.
- Not be buried under sponsored product ads when trying to find information on a product, not just be sold it.
- Decouple AI summaries and interactions from web searching (Search and Assistant are two distinct features), as they are two different methods of producing needed knowledge, and mixing them often results in unless AI slop as well demonstrated by the Gemini integration in Google Search.
- Ban Facebook, Quora, and Fox News links from all my search results.

The fact that in 2025 I didn't only consider paying for a search engine but _actually now recommend it_ is still astounding to the author. It only takes one use of Google without an ad blocker (and even with doesn't fully save you) to see that Google has become the very thing it toppled in the early days of the internet, an ad infested wasteland of bad search results and bad corporate incentives that milk users for all they're worth instead of being an actual useful tool to the end user. It's little wonder people use LLMs to find information now, it's not that LLMs are all that good at getting you a recipe, it's that search engines are _dreadful_ at it now.

## Orion

The most optional part of all this is the Orion browser made by Kagi. It is a web browser built on Apple Web Kit and as such looks and feels very similar to Safari, but with some extra bells and whistles like a built ad blockers and tracking protection. A bit like Brave without Chromium or the blockchain shenanigans. It also supports both Chrome and Firefox extensions through an optional setting you need to manually enable. Being able to run the Firefox version of uBlock Origin on an iOS Web Kit based browser feels like dark magic and works incredibly well. You can optionally opt to "buy" the browser which gives you access to early builds and new icons.

The other astounding thing about this is that all these features come out of the box with no additional config or modification needed, and yet integrate seamlessly with Apples Password manager, keychain, cloud sync, and other OS level features since it's built on Web Kit. So the experience is the same whether you're on MacOS, iOS, or iPadOS, all of which I have used it on and loved equally. No more heavily modded Firefox installs that don't work on iOS.

The real star of the show which doesn't require the browser however is Kagi Search.

## Kagi

I won't spend time trying to create a bunch of comparisons of search results when other sites like Ars Technica (linked above) have done a far better job than I ever could, and changes to its search system are likely to update them as soon as I post this. So I'll instead focus on my own anecdotal experience and how the overall experience has _felt_, both for programming related searching and otherwise.

### A built in manual

From the start Kagi does a great job of explaining how it works by showing you a shortcut menu right on the homepage.

![shortcuts](/assets/blog/kagi_orion_ai/kagi-shortcuts.png)

It drives insane when a search bar in a website doesn't readily document how it works and you need to go digging or experimenting to figure out if/how filters work. No such problem here.

Like any good piece of technology it also has a Cute Little Guy as the mascot.

![little_guy](/assets/blog/kagi_orion_ai/little_guy.png)

### Searching

Google admittedly still does a good job with technical searches in my opinion, surfacing pages on websites like Stack Overflow, Reddit, various other Exchange forums, etc with minimal fuss. It's a similar story with historical or raw factual information like weather. Where things go off the rails is _the moment you want to search for anything that people try to sell you_. Searching for specs on a phone case will BOMBARD you with ads for other phone cases you don't want, websites that sell unrelated phone cases but who ~~bribed~~ paid Google to have their results be at the top, and then of course offload the fact that you want a phone case to every advertiser on the planet to the point you'll see ads for them in other applications. Not so with Kagi. No ads, no promotions, no nonsense. Just straight to any existing discussions or reviews you're looking for.

Want forums discussions prioritized higher than official site reviews or the reverse? You can do that within the settings and with Lenses. The Lens mode focuses search with the ability to focus the searches down to specific topics, along with location, time, etc. All the things you _would think_ would be obvious features for an internet searching software to do, you can finally do here.

![Lens_and_filter](/assets/blog/kagi_orion_ai/lens.png)

The density of results and layout is appreciated too although that is more personal opinion than objective improvement.

![go-array](/assets/blog/kagi_orion_ai/go-arrays-results.png)

## Hidden gems on the net

This isn't a Kagi Search specific feature you need to pay for, but more a service they run called "Best of the Small Web". I have no idea what you'll get when you load up [small web](https://kagi.com/smallweb) but it's sure to not be your usual fare. I got [this page](https://xn--gckvb8fzb.com/thoughts-on-cloudflare/) someone wrote about Cloudflare and in doing so found some of their really cool Go projects on their GitHub. It feels a bit like taking the back alleys and side roads of the net instead of the tourist route.

## Kagi Assistant

Another feature you get as part of your Kagi plan (details depending on what tier you pay for) is Assistant, which interacts with all major LLM models through their APIs in a single web ui. This allows you to abstract your LLM usage from your identity with the companies that run them, and be able to seamlessly switch models or contexts of the models mid conversation. By default your conversation threads are temporary and disappear after a few days (this is controllable via a setting), though you can manually hose threads to save and even tag them for easy searching later, all in one place. You can also customize how the model traverses the internet, using your existing Lenses to focus it.

![assistant](/assets/blog/kagi_orion_ai/assistant.png)

The green arrow is the tagging system, the red is the model switcher, and the blue is the context switcher. I love how clean and effective this layout is.

You are limited in how much you can interact with these models, and their costs vary. Kagi thankfully has an easy to access Billing page where you can see your total expense for the month / year to see if you're going to run over your allocation. I've been using Gemini 2.5 Pro mostly which is considered an expensive model, and after about 8 weeks of using it a few times a day I'm at a whopping $6.05 out of my $270.00 yearly allocation.

## Further LLM reflections

The below are the ramblings of one engineer and what has annoyed and excited me, and isn't meant as a kind of Path to follow or gospel. Depending what kind of technical work you do you'll have different results with these systems, but I hope my reflections are useful if you experiment. As an example, the usefulness of LLMs as a programming tool is significantly different for my friend who is a silicon validation engineer and works "close to the metal", than my friend who does Google Workspace administration and finds himself scripting out workloads on APIs with Python all day. Guessing who is a fan and who is not is an exercise I'll leave to the reader.

### Banished

I was an early adopter of Github Co-Pilot way back when all it was a line by line auto complete system, and even in that limited form [I found it](https://www.dashdashforce.dev/posts/learning-java-with-copilot) rather useful, if a bit chaotic. As the main focus of LLMs has moved from such a narrow focus to more "agent" like approaches, my feelings on using AI as an engineer have changed significantly.

First off, at work and on my personal machine I no longer have Co Pilot licenses and no longer use it in my editor at all, having taken steps to strip it out of VS Code completely as best I can. I do this because I've come to prefer my code editor as a "pure" experience where I work with deterministic systems and their (hopefully) reliable features. I do NOT want Co Pilot obscuring Intellisense and similar systems that show methods available on a variable for example, something that the line by line version of Co Pilot completely ruins while wasting huge amounts of electricity generating unneeded outputs that I just destroy with an escape key stroke.

The "Chat" window experience is better, but now I have two side panels to juggle and generally clutter my editor and focus. As a result I've come to prefer to have LLMs only in the web browser (or a similar separate window) away from direct access to my code. I want it to be a tool I reach for with intent. Beyond editor configuration annoyances though, I've simply found most code results lately from models to be too unreliable and need too much massaging for my purposes to be of use "straight out of the oven", despite efforts to "give it better parameters" or whatever term is being used nowadays for _describing the problem_. The time wasted and annoyance are such that beyond creating unit test setup code (they're great at this when they're not trying to have you use 20 year old Java methods) or scaffolding out some getter and setter methods, I may as well have typed it myself from scratch using VS Code macros and snippets.

Issues with writing code directly aside, the thing that I've come to love using LLMs for is as a form of interactive rubber duck debugger and prototype creator. It's a long standing joke in programming that talking out a problem to an inanimate object, or even typing out the problem in a Slack message you're about to send to a coworker often helps you work through the problem enough to solve it on your own. LLM's are now that to me, but they can talk back and provide mostly useful alternate suggestions, that even if I don't use them get me thinking in different directions. It's a wonderful tool for riffing on prototypes and sketching out problems, some literally given that Gemini (and other models I'm sure) can actually "see" images pretty well. Is it perfect? No. But its available and not a human coworker I'm distracting or being selfish of their time, and for me there's a real magic to working out a problem with a partner versus alone. Even if that partner is a bit more like Bender from Futurama than Shodan from System Shock.

### Knowing the right questions to ask

LLMs have also been an astoundingly useful tool for getting over what I call "the learning cliff of ignorance" when learning something sufficiently complicated. As a personal example, I've been doing some amateur 3D modeling with Blender to produce `.stl` files for 3D printing. If you haven't used Blender before, it's a bear of a program in the same way that programs like Photoshop, Final Cut, and Solidwerks are intimidating and difficult to get started in. The depth and breadth of features and technical terminology is paralyzing.

Gemini has been a great partner to learn Blender with as I've hit situations where the UI changes in a way that I don't even have the right technical words to describe it, and I'm able to upload a screenshot along with a hand waving description of what I'm doing or trying to do. Sure enough, it produces some output like "Ah you've stumbled into X Feature, its useful for Y but you probably want Z, here's a link to the official docs for those" and sure enough it's correct and has found me a nugget of knowledge I didn't have before. Could I have figured that out reading forum posts, scrolling through docs with less direction, or bothering a flesh and blood person? Sure. But it would have taken a lot more time and effort, and we're not all so luck as to have personal mentors when learning new and complicated things.

I suspect this sort of AI assisted learning is useful up until you hit somewhere near the average of typical user skill, and /or you start hitting new features that haven't been well documented or discussed yet. At which point the usefulness likely falls off outside of automation and prototyping.

### Lies

On the topic of new features and hitting the limits of LLM usefulness, for the first time I actually saw a significant "hallucination" personally so it felt worth documenting.

For context: I've been working on a side project that does stock price modeling with Go as a console application. There's some hefty math, and I wanted to learn how to benchmark Go code to do some performance tuning and make sure I wasn't making use of unneeded memory allocations. Props to Gemini, it pointed me towards `testing.B` which, intuitively, is the benchmark library that had been hiding in plain sight right next to `testing.T` which I had been using to write unit tests. I dived in but immediately found some really interesting code examples online that showed that the library had undergone significant improvements. In older version of the library, there was an issue where the compiler would optimize away your function call being benchmarked, resulting in sub nano second benchmark times. When testing one simple function in isolation this is usually obvious, but in more complex code this could cause insidiously optimistic results without the programmer realizing.

Because of this, Go benchmark code would use a "sink" variable where you would assign results to, that variable being declared at the package level. As a contrived example to get a basic benchmark working I made a few versions of a whitespace removal function and wanted to benchmark all three to compare results. It looked a bit like this:

```go

package main

import (
    "strings"
    "testing"
)

func RemoveWhitespaceThrasher(s string) string {
   var result string
   for _, r := range s {
       if !unicode.IsSpace(r) {
           result += string(r)
       }
   }
   return result
}

var result string

func BenchmarkWhiteSpaceRemoveThrasher(b *testing.B) {
    input := "  hello   world  from   the   Go   benchmark  "
    var r string

    for i := 0; i < b.N; i++ {
        r = RemoveWhitespaceThrasher(input)
    }

    result = r
}

```

Note the `var result string` line acting as a "sink". Benchmarking pitfalls like this are well documented [by this blog post](https://eli.thegreenplace.net/2023/common-pitfalls-in-go-benchmarking/) in 2023 by Eli Bendersky, where he even shows assembly code created by the compiler running on an empty loop without using a technique like a sink.

However, as of Go 1.24 (which came out only a few months before this writing) there was a new method introduced for creating the benchmark loop via `b.Loop` instead of `b.N`. This new method allows devs to no longer need sinks or timing reset calls in their loops and gives more stable results, [as documented here](https://go.dev/blog/testing-b-loop) in the official docs.

The new code looked like this:

```go
package profile_example

import (
   "testing"
)

var testString = "   \tThis is a string \n with \r many \t spaces and \n newlines.   "

func BenchmarkNaive(b *testing.B) {
   b.ReportAllocs()

   for b.Loop() {
       RemoveWhitespaceThrasher(testString)
   }
}

func BenchmarkBuilderLoop(b *testing.B) {
   b.ReportAllocs()

   for b.Loop() {
       RemoveWhitespaceStringBuilder(testString)
   }
}

func BenchmarkInPlace(b *testing.B) {
   b.ReportAllocs()

   for b.Loop() {
       RemoveWhitespaceInPlace(testString)
   }
}
```

The first warning sign was that Gemini told me I needed at least version 1.20 of Go to use `b.Loop`. Wrong it needs 1.24 and the compiler yelling at me about `.Loop` being undefined proved it. No big deal I thought. However, after bumping my project to 1.24 from 1.23 which resolved the compiler errors, I asked Gemini to expand the tests to benchmark another set of functions using the existing ones as an example (it was 3pm on a Friday, my finger were tired okay?) Gemini _confidently_ told me:

> The compiler will look at this and see a function that returns a string, which is never read or assigned. It is dead code. The compiler will delete it. You are benchmarking an empty loop.

Bold words. The benchmark results however do _not_ lie:

Three runs with sink assignment in a `b.N`:

```console
BenchmarkThrasher-12      956178      1327 ns/op    1104 B/op      77 allocs/op
BenchmarkThrasher-12      891433      1262 ns/op    1104 B/op      77 allocs/op
BenchmarkThrasher-12      888454      1303 ns/op    1104 B/op      77 allocs/op
```

Three runs without sink assignment in a `b.Loop`:

```console
BenchmarkThrasher-12      971413      1316 ns/op    1104 B/op      77 allocs/op
BenchmarkThrasher-12      927628      1273 ns/op    1104 B/op      77 allocs/op
BenchmarkThrasher-12      894690      1270 ns/op    1104 B/op      77 allocs/op
```

Just for fun I then tried to "confront" this overgrown Clippy, and after linking the docs from above (Gemini seems to usually be able to read webpages pretty well) and pasting in my benchmark results it began to quote code snippets that didn't exist on the page, and claimed my results clearly came from code "in a different state" and that I misunderstood them. The level of confidence to which it tried to mislead me about my own system was honestly a little stunning. Admittedly this is a very niche example using a new feature that probably isn't in its training data, and for every situation like this there's probably a thousand perfect generated Python scripts, but still without real skepticism this sort of confident "lying" can cause real problems. One way to determine if an is "intelligent" is if it can consume new information and make useful choices from it, including realizing that new information needs to supersede its previous training data. In this case Gemini 2.5 Pro failed that test spectacularly.

With that victory notched for the meat brains I need to go remember how to declare a function in Java for work tomorrow morning...

Happy riffing.
