---
title: "How to write Python on an iPad"
excerpt: "Jeff Goldblum might want a word with the engineers over at Github."
coverImage: "/assets/blog/python-on-ipad/leaves.JPG"
date: "2023-01-28"
tags: [python, ipad, vscode, github]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/python-on-ipad/leaves.JPG"
---

You read that right. I've been writing code on an iPad recently and in 2023 it actually works pretty well thanks to Github Code Spaces. The set up was pretty darn easy but once again my old nemesis PYTHONPATH came back to bite me. As such I'm going to document how I got it all working for those of you who want hyper mobile code writing without compromising much in terms of editor experience. Note I said "much" as there is a few small issues with this setup but nothing that's a total show stopper.

## The problem and initial disclaimer

You can't _actually_ run Python code on an iPad. Or any custom code for that matter. iPadOS doesn't let you just execute custom code in its environment. As such this solution involves actually running the code on a remote machine and making use of the fact that VSCode runs in a web browser pretty well now. If you can't have a stable (though not necessarily fast) internet connection then this solution won't work for you. I initially wanted to figure out how to write Python (along with other languages) on an iPad as an on the go solution to working through Code Wars problems while at coffee shops and such so constant internet connection isn't an issue in my case.

## First attempt using the Github code editor

Something magic happens if you go to any Github repo and hit `.`. This command opens up a web browser version of VSCode in the repository you had open, and even better if you are using your Github login to save your VSCode settings it will automatically import all of your custom settings and even your themes into the browser version. Be patient though it takes a minute to configure itself. It allows _most_ of the functionality of an actual install of VSCode with one major exception.

You can't actually run any code and you don't have a shell.

If you hit the command to open up a terminal session in VSCode you're greeted with this.

![dead_shell](/assets/blog/python-on-ipad/dead_shell.PNG)

This limits some extensions too, at least ones that require actually running or compiling the code you are editing in the background. Some extensions may require a "reinstall" too, which you can tell by looking at the extensions side bar view and scrolling through for ones that have a button push to install the web version of them. None the less being able to traverse code with most of a functional IDE all in a web browser is super useful for code reviews on the go or quickly exploring a repo with more tooling than the tradition Github interface gets you. The message in the terminal gives a clue of how to get a more full experience in the web via Code Spaces.

## Code Spaces

Code Spaces is a pretty new feature in Github and to use it extensively might require you to shell out some cash, but more casual users like me will probably never hit the actual pay wall limits, especially when all you need is 1 core for a python script. It basically creates a remote server for you where code can be executed and remotes into it automatically. This enables all of VSCodes more powerful features like its built in shell, code execution, debugging, unit test running, etc. Official docs on Code Spaces can be found [here](https://github.com/features/codespaces) for when the price models or setup inevitably changes from the posting of this article. As such I'm not going to document the actual steps of creating a code space with your desired repo, but the steps are quite literally 3 clicks of creating a new code space, picking a repo, and clicking create. Go nuts.

After setting up the Code Space and giving it a minute to configure everything you'll be greeted with a UI that is pretty much just like if the app was running local with all your extensions and themes (again if you are using Github to sync them). You can open up a terminal and are greeted by bash and by god you can run things!

## Shortcut Collisions

Because all this is running in a browser I have experienced some shortcut collisions. Hitting <kbd>COMMAND</kbd>+<kbd>D</kbd> for example causes my browser to try to bookmark the webpage instead of highlighting the instance of a variable. Switching tabs within the Code Space editor can cause similar issues as it may try to switch _browser_ tabs instead. A real annoying one is hitting <kbd>COMMAND</kbd>+<kbd>W</kbd> to close the code file tab closes the whole Code Space tab in the browser. These collisions have caused some annoyance compared to the full local experience but all the major stuff still works. I will post a new article if I find effective ways around these collisions short of changing the shortcuts themselves.

Amazingly even on pretty slow coffee shop wifi this whole system works well. Intellisense highlighting has similar speed and accuracy to a local install, debugging starts and steps as expected. The whole thing comes crashing down though if you lose connection, as I sometimes do when working at a shop that requires logging back into the network every 2 hours. Stability over speed seems to be the key here.

## PYTHONPATH strikes again

The main goal I had for this project was to be able to have a `.py` file containing a function for a problem for Code Wars and then be able to have unit tests for that function sitting in another `*_test.py` file right next to it. However on trying to import the function (called anvil in this case) in question into the `_test.py` file I got my favorite error

```bash
Unable to import 'anvil'
```

Along with a failure in the unit testing extension about how it couldn't find any tests.

The fix is luckily easy and basically the same as my previous post where I was setting up a repo in my Ubuntu subsystem. In the root of the project just create a file named `.env` and in it place the following:

```.env
PYTHONPATH=.:${PYTHONPATH}
```

You may need to add an additional path specifier on the end there if you have your code sitting in a subdirectory. After doing that though importing works and the unit test extension can discover and run tests, and even debug them! Modern web browsers are truly an amazing thing. Here it is stepping through a dumb one liner function via the debugger to prove it works. In a browser. On an iPad.

![ipad_debugging](/assets/blog/python-on-ipad/ipad_debugging.jpg)

Jeff Goldblum might want a word with the engineers over at Github.

![science](/assets/blog/python-on-ipad/science.jpg)

May your code editing be light and mobile.
