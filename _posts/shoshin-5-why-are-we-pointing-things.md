---
title: "Shoshin 5: Why are we 'pointing' things?"
excerpt: "A beginner once asked: why don't we do less?"
coverImage: "assets/blog/shoshin-5/DSCF0588.JPG"
date: "2024-10-05"
tags: [shoshin, process]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "assets/blog/shoshin-5/DSCF0588.JPG"
---

## Fundamental questions are my favorites

Times have been genuinely exciting at my current company, with old systems getting upgrades, new companies joining us, and new systems under development using new technologies. Also [people are out there restarting old nuclear reactors](https://arstechnica.com/ai/2024/09/re-opened-three-mile-island-will-power-ai-data-centers-under-new-deal/) which has everyone in the energy industry abuzz. With these new things have came interesting opportunities to revaluate old truths and processes and refine what is useful. One meeting in particular became unexpectedly philosophical when a director who was new to working with my team and was sitting in on a "backlog grooming" call asked:

> What is this 'pointing' thing and why are you doing it?

I rather love her for asking such ground truth questions, as every now and then someone needs to cut through the "because we've always done it that way" and make everyone question their assumed expert knowledge. Beginners minds are a powerful thing.

_So why do we point tickets?_

## Some quick background knowledge

Work in software engineering is often broken down in a "ticket" / "story" / "task" / "bug" whatever buzzword is popular at the time for the concept of a "unit of work" If people start discussing which of the words needs to be used for a certain software change for longer than it takes for you to center a `div`, you're already wasting time on process. Pick one and move on.

But obviously not every task is created the same. Some are small and can be done in the time it takes to write the ticket, most take a few days, some make you question your career choice, others spawn entirely new products or companies. So how do you capture that? That's where the concept of "pointing" or "sizing" a ticket comes in and it takes a few forms. One method is using numbers of the Fibonacci sequence to represent the "difficulty" of the job at hand with a `1` being something like a minor CSS color change, a `5` being a "significant" code feature or testing suite that might take a few days, and an `8` or `13` being big enough to maybe justify breaking it up more. Other techniques include things like T-Shirt sizes, or just straight up 1-5 number ratings.

"Backlog grooming" is a fancy name for a meeting where we all look at the tickets we haven't done and decide how much they're going to suck to do, AKA "pointing tickets". "Pointing" is the process of asking all engineers in the meeting to give their take on how hard one of those tickets is, using one of these numerical / size systems. Using the Fibonacci example, three engineers might weigh in a bug fix with their votes, two of them saying its a 3, and one saying its a 5. Discussion happens, and the person running the backlog grooming session enters that its a 5 on the ticket. Next.

## Why and what's the value?

Most of the time during this process a given group of engineers pointing will give the same or close to the same values for a given task which might lead one to wonder why even spend the time doing it? Wouldn't one engineer doing all the pointing be more efficient instead of having everyone on a call? Much of the time, yes. If your goal is just to get tickets pointed. The main value of pointing however is not the final point values. It's for those interesting situations when one engineer says 2 and the other says 8.

<strong>Pointing acts as a mechanism to find situations of misunderstanding or unevenly distributed knowledge between engineers.</strong>

When situations of significant disagreement popup seize on those as a chance for everyone to learn new things about your system and possibly fill out some further detail in the task. If it is indeed much more difficult jot down why, and if not make it clear also to avoid someone doing excessive work.

With this in mind chose a sizing method that will most effectively surface disagreements in understanding the task. Many like the Fibonacci numbers because it models how many tasks in software engineering don't seem to scale in a linear fashion which systems like t-shirt sizing imply. That allows for the pointing system to better model big tasks vs small ones. Whatever pointing system you choose, the most important thing is that the team understands it and that it seems to represent the work at hand well.

There is also value in considering the mechanism by which you assign sizes to tasks in order to try to tease out disagreements or misunderstandings. Many teams "point blind" where the team members use a software to assign values without others seeing, and then those values are only revealed at the end all at once. This has the advantage of dodging any peer pressure that might come from one individual seeing a different value from the one they initially thought. Whether this step is needed is up to the team (and I've personally been on ones that did asynchronous pointing well) but it's probably a good default method to use blind pointing especially if new members might be joining the team.

## But don't fall for the trap

The problem with assigning numbers to things though is that then there's the temptation to do things with those numbers beyond what they were originally intended for. One of the fundamental issues with software like Jira is that it gives you plethora of tools and features especially around task sizes of questionable usefulness, but because it puts them in your face under the illusion of being useful you are tempted to use them. You're paying for the darn thing so shouldn't you use it? It's a lot like having a car that [opens its charging port by saying "open butthole"](https://gizmodo.com/tesla-owners-say-open-butthole-and-get-a-little-surp-1846666529), which might work as a lame party trick but if you started opening the charging port that way every time you go to charge the car people would call you deranged.

But using a tool has unintended side effects and what you measure will often subtly become the thing that everyone targets. If your Big Success Number is "velocity" (how fast a task is opened and then closed) expect people to start adjusting their workflows to make the numbers look good even if it means closing out a task before its really done in favor of making a new task, thus wasting time on pointless Jira ticket paperwork instead of doing real work. If your Big Success Number is the number of bug tickets, expect hostility towards anyone who opens a bug ticket and a culture that sweeps problems under the rug, which is the exact opposite of quality engineering. Chose your metrics wisely, especially around pointing values and consider the knock on effects on your culture as you presumably have a lot of smart people working for you. They will game it.

### Predictions

Worst of all, using ticket points to predict future completion dates with unjustified precision with something like a burn down chart is a lot like "technical analysis" in the stock market. It falls into similar traps of over fitting trends on data with too many assumptions while failing to model real world concerns, thus diverging from reality and into the land of hopeful fantasies. Does your prediction system factor in PTO? New features being added or discovered in testing that are needed? Does it inadvertently discourage fixing technical debt because it "will effect the numbers"? Does it consider and factor in company events or holidays it might overlap? Or whether the project is falling at the end of a goals cycle where devs have other work they need to do to wrap the quarter for performance reviews? Are your baseline expectations being set by one person working too many hours in an unsustainable fashion? Is the team composition even the same since the project started? Every one of these concerns (and others not listed) adds error bars onto your predictions. That's not to say such predictions aren't useful (much like technical analysis on stocks it _does_ have its uses), but as the old adage goes _all models are wrong but some are useful_ and you should be up front with how useful your prediction model is to everyone involved. Don't give exact dates of completion when you know for a fact that external factors are effecting your definition of done, lest you're okay with the knock on effects of burnout, moral drag, and quality failures that come with contrived deadlines that everyone knows aren't realistic.


Summarized in a few less words: A given management process should do something useful for your job, and if it doesn't you should stop doing it. You need to have the discipline to do less.
