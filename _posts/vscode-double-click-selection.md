---
title: "Changing VSCode's highlighting behavior"
excerpt: "You know you're in deep with a particular editor when you start trying to modify what the double click does."
coverImage: "/assets/blog/vscode-double-click/bryggen.jpg"
date: "2020-07-17"
tags: [vscode]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/vscode-double-click/bryggen.jpg"
---

You know you're in deep with a particular editor when you start trying to modify what the double click does.

A small thing in VSCode that has always irked me a little bit has been how double clicking a variable like `i_am_an_underscored_variable` or `iAmACamelCasedVariable` immediately highlights the whole variable, but if you double click on `i-am-a-dashed-variable` only the word within that that you happened to click on is selected. Like this:

![bad](/assets/blog/vscode-double-click/you_stop_that.png)

Very annoying when you do web development and are frequently working with HTML / CSS classes which are dashed, and maybe even working with them along side camel or snake cased variables. You can always use <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<KBD>RIGHT ARROW</KBD> (on MacOS, use Alt on Windows) to then highlight the whole thing, but thats just annoying compared to a simple double click. Sure would be nice if they all acted the same right?

Turns out, its something you can modify. Within VSCodes absurdly large compliment of settings there exists a setting called `editor.wordSeparators`. By default, the value of it is the following:

```json
    "editor.wordSeparators": "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?"
```

See the dash after the `()`? This tells vscode to treat anything at that character as another word, and thus it doesn't highlight past it on double click. Notice there is no underscore in the set of characters? So if we just go ahead and remove the `-` we get the following final setting:

```json
    "editor.wordSeparators": "`~!@#$%^&*()=+[{]}\\|;:'\",.<>/?"
```

And now double clicking dashed variables highlights the whole thing, assuming none of those other characters are present. This is a great setting to know about in general, as you can edit it to your liking to tweak the highlight behavior depending what languages / technologies you work with.

May your highlights be swift and true.
