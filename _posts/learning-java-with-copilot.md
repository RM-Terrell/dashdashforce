---
title: "Learning Java with Co-Pilot"
excerpt: "The time saving and experimentation this tool allowed absolutely sped up how quickly I was able to get a PR up for the tests and saved a lot of googling through outdated Java docs."
coverImage: "/assets/blog/learning-java-with-co-pilot/DSCF0657b.jpg"
date: "2023-09-01"
tags: [java, co-pilot, ai, vscode]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/learning-java-with-co-pilot/DSCF0657b.jpg"
---

I’ve developed something of a habit now of starting jobs that require using programming languages I’ve never written a single line of. I know that’s not unusual in this industry but it’s becoming funny. This however is the first time I’ve had a tool like Co-Pilot and AI language models to help out with that process.

This time around it’s Java. My company has a thin data transfer API layer for their applications written in Java. As such this was something of an experiment in “how fast can I get up to speed on a new technology in the year 2023?”. The answer? Pretty darn fast. I won’t share specific code snippets here for the same reason I didn’t on my last Co-Pilot post, protected IP and also these models are improving so fast it’s hardly worth posting.

The main crux this time was the unit testing more than the actual production code which was only a whopping 4 line change. The function being tested was one that powered an API endpoint and it and the file it was in had no unit tests but was tested with some Postman calls. A coworker had recently put up a PR for some very similar tests in a different file so I wasn’t totally flying blind but there's nothing like a new language and all its quirks being thrown at you in the form of live production code to make you feel off balance. Time to shine my robot friend.

I approached the task like this. After getting the production code change working I started figuring out how to unit test it (look the other way TDD goat). At the start of the empty test file I added the comment

> Import junit and required dependencies to unit test APIFileBeingTested.java

and started hitting tab. I knew I needed junit from looking at other test files and I also knew I needed a ton of imports from looking at Java code in general. Man this language is verbose. Compared to the resulting imports in the final PR, this got me about 90% of the way there as long as I didn’t hit the “Save” key and have my editor auto delete all those hard won unused imports.

Next was building the class around the tests which I could have easily done myself based off of other files but Co-Pilot was on a roll so I wasn't about to stop it. When it came to the actual tests I had to take back manual control and build out the function name of the test I wanted. At this point Co-Pilot started to trip over itself.

There were a few functions / methods that needed to be mocked out in order for this test to work and Co-Pilot truly had no idea what to do and was auto generating nonsense mocks. Fortunately my coworkers PR had a good example on how to mock these out, and once I did the first mock, Co-Pilot correctly generated all the other mocks following the same pattern. It did it well enough actually that it generated one mock _I initially thought was incorrectly named_ but after I renamed it I got compilation errors. You win this round machine.

The final assertions based on the fully mocked and running method were a little rough. After many prompt attempts Co-Pilot regularly generated method calls on data types that didn’t exist. I truly had no idea where some of them were coming from and even my normal VS Code editor could tell they were incorrect method calls before compiling the code. Once again however after some manual fiddling, co-worker asking, and doc reading I got the assertions working and from that point on Co-Pilot could roll through assertions correctly far faster than I could type.

Another positive was that Co-Pilot correctly generated parameters for the API method call without any example in the test code itself. It was clearly reading the source code for that method and interpreting the parameters of the method signature, with correct types and reasonable values for the unit tests.

Overall I was actually pretty impressed with the results. These were the first lines of Java I had written. Ever. Although I did have previous experiences with static typed languages so I wasn’t totally clueless. A few times I wondered "Hey wait whats the syntax to initialize an array of strings in Java?" and by adding the comment

> Initialize an array of strings called ExpectedValues

and it generated one with the correct syntax. Its like Intellisense on steroids. But with Intellisense afterwards in the editor to do further checks.

The time saving and experimentation this tool allowed absolutely sped up how quickly I was able to get a PR up for the tests and saved a lot of googling through outdated Java docs. The process wasn’t fool proof and an observant reader will tell that the AI required direction. Lots of it. I didn’t just type up “unit test this” and get up to standards code. Boilerplate code was generated very well, but the real value of the code I merged was not generated by Co-Pilot.

Another important note is that Co-Pilot in its current form would not have been able to generate the solution unguided for the issue in the API endpoint. You can’t just type “add an error check to this URL” somewhere in the code and have it edit the needed endpoint to spec. It took some hunting and direction from a human to do so. But once I found that point in the API code I was able to add

> Check for <name_of_api_param> being empty, and if so return an error

and it sure enough generated pretty reasonable code for that. I said "pretty reasonable" because Co-Pilot used a method of empty checking a string that is now considered deprecated with a more elegant method available in newer versions of Java. Classic. I only found that out after searching the problem of checking strings in Stack Overflow.

This does however bring up another useful workflow potential in AI. I was using Co-Pilot for all of this. No Chat-GPT or wholesale code analysis tools. One even more “AI Accelerated” way of approaching this problem could have been to enter the entire file into one of these very new tools that let you enter thousands of characters and it will analyze and explain the whole thing. That might have been a good way to traverse the code with the AI acting as a guide, especially for explaining sections of code that involved more Java specific language features I didn’t yet understand and _especially_ because this endpoints method was pretty large. I may try this once my company has one of those systems working for our engineers, but in the meantime I really don’t feel like being “The guy who sent our source code to Google by accident”.

Happy robot assisted hacking.
