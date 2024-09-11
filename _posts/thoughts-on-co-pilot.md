---
title: "Initial thoughts on Github Co-Pilot"
excerpt: "You’re not coding with Shodan here, it’s more like coding with Bender. Just keep your expectations in line with that."
coverImage: "/assets/blog/thoughts-on-co-pilot/mountain_side_fog.jpg"
date: "2023-07-02"
tags: [co-pilot, ai, vscode]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/thoughts-on-co-pilot/mountain_side_fog.jpg"
---

This is a post that will probably age poorly with the constantly improving technologies around language models, AI, ML, and their various implementations. It nonetheless feels worth writing down at least as a piece to reflect back on when that robot really does put me out of a job after seeing me talking smack about it on my personal blog.

## The current situation

Not all software jobs will be affected the same by this technology so context is worth its weight in gold. I work in primarily front end technologies currently on a data intensive web application using React, React Testing Library, Cypress, and Webpack with a Java middle tier. I spend a lot of time writing JavaScript unit tests as part of this. I’m using VSCode with a full enterprise version of Co-Pilot running in a dev container.

Due to the fact that all the code I’m writing is part of a closed source NDA’d project I will not share exact code samples, but with improvements to the models happening constantly those would probably be made obsolete even faster than my own current thoughts on the matter so I don't think they're needed.

## The Good

Using Co-Pilot is a lot like having a chattery optimistic intern giving you code suggestions with every keystroke. I mean this in the most positive way possible (and not as an insult to interns) as the system acts like an incredibly fast brainstorming tool that though not always correct, will often come up with assertions in unit tests I may not have thought of, or solutions I normally wouldn’t have. Not all of these suggestions are good but about 70% of them are, or at least act as a way to explore a method I haven't used previously. The rest are easily washed away with a tap of the “Escape” key. At a minimum its ability to quickly and contextually generate boilerplate code for things like unit tests and React components is great and saves a lot of typing. I've seen ChatGPT also used to great effect when building React components both class based and functional which is really like using VSCode snippets on AI steroids.

### Unit tests

Testing code has probably been the single most useful area for Co-Pilot for me so far. Especially when the unit test doc string is well written, and _especially_ if the code being tested is in a language with type casts or types in doc strings the resulting generated code for the function being tested is often exactly what I wanted. If a particular function returns an object with multiple keys, Co-Pilot will usually generate an assertion for each key with a reasonable value. Clearly its doing some reading of the source code being tested which is pretty impressive.

One cool thing I noticed was after writing a few tests with the doc string style “Given that…., assert that…” when I went to write my next unit test I got about 3 words into the doc string and the system auto generated the doc strings in the format I had been using, hitting the next branch of the function exactly as I wanted. Pretty amazing honestly.

### Stack Overflow gone plaid

Co-Pilot is also great for generating standard solutions to standard problems, _usually_ faster and more effectively than copy pasting them from the internet. An example of this would be the following situation. Lets say you get a large JSON object back from a data response, and you want to pull all the values from the key “target_key”. I’ve had very good luck doing something like writing a comment in my code that says

> Get the values of “target_key” from the variable “data”

And then hitting enter on to the next line and waiting a second. Usually like magic it creates a ghostly suggestion accessing the “data” variable as I wanted. This comes with some caveats though that I mention below.

### Well documented APIs

A similar example is when the code being generated is working with an API that has really good documentation and importantly _hasn't gone through recent major changes_. I've seen Co-Pilot generate Python `get` calls to the Slack API and transform the resulting data exactly as desired per a comment in the code. If you need to do python API scripting this is the tool for you. It has a massive amount of examples from existing Python code to work with and the results land darn near what I'd consider "best practices".

## The Bad

Using Co-Pilot is a lot like having a chattery optimistic intern giving you code suggestions with every keystroke. There are a lot of times that it has _no idea_ what I’m trying to do and its generated code does nothing but get in my way. I’ve even had odd instances where the suggestion, though still in its ghostly form, screws up existing quotation marks and forces me to delete code and try again. As such I need to figure out the keyboard shortcut to disable Co-Pilot on the fly when it starts getting in my way.

### “Actually X solution is deprecated”

More insidious is that I’ve seen multiple instances of Co-Pilot writing code that is blunt, dangerous, or outdated or a mix of all three. A good example was in a place where it was previously helpful, unit test writing. Generated code will sometimes manually index into a data structure instead of making use of existing methods from the testing library like Jest or RTL. I’ve also seen generated code that will throw exceptions without also generating a needed catch block. Changes to APIs and languages in general cause it issues too as of this writing, with it being blind to very new language features. The same will be true if an API undergoes major changes, though you face the same issue with any code posted to forums. The older that post the greater the odds you'll need to do some manual work to get it functional.

As such, much like copy pasting code from Stackoverflow, or blindly approving PR’s, every bit of code generated by Co-Pilot needs to be scrutinized and thought about. Language models don't _know_ anything. They are built on datasets generated and cleaned by fallible humans and without context, and done so at certain points in time that mean they _will_ age and become less useful if not updated by the engineers maintaining them. You’re not coding with Shodan here, it’s more like coding with Bender. Just keep your expectations in line with that.

The biggest failing of Co-Pilot then is the biggest strength of forums like Stack Overflow and Reddit. People can comment years later and improve upon them in an open discussion, thus giving you years of context and history that makes you a better engineer. At its best SO is glorious with languages like JavaScript and C++ as you get to see the whole history of best practices shifting and maybe even contribute yourself thus building the shoulders of those giants a little higher. This of course _requires_ people to be engaged and without that said forums become not very useful. However I like to think browsing a forum is an invitation to think and scrutinize while magically generated stuff in your editor is not. Maybe I'm just old. Either way, no such context or opportunity for distributed refinement exist with these AI tools. You get some stuff magically dumped in your code editor, and you're all on your own at the mercy of the skills of whatever organization built it. I worry about the impacts of this on future engineers who take a very passive approach to problem solving though the same could be said for chronic copy pasters.

### Code Comments

I don’t like literal descriptive comments. At all. I think comments should be reserved for situations where you need to explain WHY you are doing a certain thing. Convey intent, context, or history. Don't just rewrite what you just did in code, back in human speak. The one exception being doc strings that document types in languages that don't have them like JavaScript as these often power editor features, as doc strings of that type aren't actually duplicating data but are instead _adding on_ to the existing code but through a sneaky functional comment block and in a way also conveying intent beyond what is read in the code.

Because of this, I don't like that Co-Pilot encourages the use of code comments that are literal descriptors, as that is how you get it to actually generate code from scratch. As long as you delete those comments that's fine but given my above caveats about how the resulting generated code often needs some massaging to work as desired, if you don't delete these comments you now instantly have comments that might be incorrect descriptors of code below it which is worse than no comment at all. This puts a lot of new key strokes being required by fallible humans which is less than optimal. I don't trust me to remember to do manual things.

This becomes doubly problematic in the case of tools like ChatGPT which by design _comment every single line of code it generates_ (as of this writing) or darn close to it. Now you need to go in and manually delete all that garbage. Some adjustments to both tools to auto delete comments of course would fix this. I would actually love to have these tools setup with a voice command that would generate code in another window instead of via writing inline comments as it would fix many of the above struggles. Maybe my voice wouldn't fail after an hour of talking if I had to talk more regularly for usual workflows...

## Takeaways

Co-Pilot is a darn useful tool already but in a narrow and repetitive scope. It enables you to very quickly build out standard solutions and boiler plate code as if someone had already setup your code editor with a massive and easy to use library of code snippets. You can iterate on solutions very quickly with it and maybe even be surprised every now and then by a solution you wouldn't have thought of. That in and of itself is very valuable and if your company can pay for a commercial license of Co-Pilot for you, they should.

But it "knows" nothing. It's not smart and doesn't magically search out recent changes to libraries, APIs, or best practices. Yet. Treat it like the slightly silly side kick it is and use it as an opportunity to scrutinize and learn from code and maybe solve problems in new ways. Most importantly though is to keep an eye on what's coming next for these tools, as all the problems mentioned above are solvable making the future bright.

We may very soon feel like we've got our own personal Data sitting by our side each day when working. Maybe they'll make Co-Pilot be able to have philosophical debates and take notes for us that start with "Captains Log. Star Date....."

One can only dream.
