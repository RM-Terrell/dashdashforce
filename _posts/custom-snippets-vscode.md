---
title: "Custom snippets in VS Code"
excerpt: "The one tricky bit here was those pesky newline characters."
coverImage: "/assets/blog/custom-vscode-snippets/skin_track.jpg"
date: "2021-03-10"
tags: [vscode, javascript]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/custom-vscode-snippets/skin_track.jpg"
---

A few snippet extensions I've installed have inspired me to venture into creating my own custom ones. Turns out VS Code has a great system for doing this and can be a huge time saver for boilerplate code.

### The Initial Annoyance

A snippet I've gotten a lot of use out of is `testa` which comes from the Jest Snippets extension (I think, I have a lot of extensions and its hard to tell at this point). This snippet scaffolds out an async
jest test like this

![before](/assets/blog/custom-vscode-snippets/before_snippet.png)

This is very useful but each time I do it I need to go back, add a semi colon, and make the test description a template literal instead of single quotes. This comes from the ESLINT rules I'm using (the semi colon) and personal preference for easy, long, indented test names (the template literal). Sure would be nice if I didn't have to make that edit every time right?

### Creating the snippet

With <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd> (assuming Windows, use <kbd>CMND</kbd> instead if on Mac) open up the command pallet and search for "Configure User snippets"

![first_setting](/assets/blog/custom-vscode-snippets/snippet_setting_1.png)

Click that option at the top then click the javascript option

![second_setting](/assets/blog/custom-vscode-snippets/snippet_setting.png)

Once you're in there you have a whole file to create your own custom snippets. I created the slightly modified version of the `testa` snippet like so

![final](/assets/blog/custom-vscode-snippets/final_snippet.png)

The one tricky bit here was those pesky `\n` characters. Those are to create new lines in the resulting snippet automatically. Now when I type `testa` I get a second option (mine with my custom description) that scaffolds out an async test as per the standards in the repo I'm working in.

![result](/assets/blog/custom-vscode-snippets/final_result.png)

### Syncing

The other great thing about this solution, is that the file for custom snippets is tracked as part of VS Code's setting sync feature. So when you create custom snippets on one machine, you will have these on any other.

Happy snipping.
