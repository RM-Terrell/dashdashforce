---
title: "Five Things VSCode Part 3"
excerpt: "Might need to bind this one to a big red button on my desk."
coverImage: "/assets/blog/five-things-vscode-3/mary_jane_base.jpg"
date: "2023-07-30"
tags: [vscode]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/five-things-vscode-3/mary_jane_base.jpg"
---

What it says on the tin, more VSCode tips! Once again this will be written primarily as Mac shortcuts but all of these exists with the equivalent keys on Windows.

## Next instance select

When you have any word / variable highlighted you can hit

<kbd>CTRL</kbd>+<kbd>D</kbd>

and the next instance of that thing down the page will also be selected in addition. Keep tapping to keep selecting. This can be a great way to setup multiline edits.

## Terminal search highlight color

The colors and styling used to highlight searched elements in the built in terminal can now be fully customized. Documentation can be found [here](https://github.com/microsoft/vscode-docs/blob/vnext/release-notes/v1_66.md#display-all-find-matches) but here's a quick example.

```json
"workbench.colorCustomizations": {
    "terminal.findMatchBackground": "#hex_code_here",
    "terminal.findMatchBorder": "#hex_code_here",
    "terminal.findMatchHighlightBackground": "#hex_code_here",
    "terminal.findMatchHighlightBorder": "#hex_code_here",
    "terminalOverviewRuler.findMatchForeground": "#hex_code_here"
}
```

## Custom shortcuts to switch tabs

In most web browsers and other software with the concept of tabs you can switch to first tab with the use of `CMD` or `CRTL` and a number key corresponding to the tab you want to switch to. VSCode doesn't have this by default but you can add it in with the following settings.

Go to Shortcut Settings and add the following

```json
    {
      "key": "cmd+1",
      "command": "workbench.action.openEditorAtIndex1"
    }
```

with versions for numbers 1 through 5 and you can now switch to specific tabs with a key stroke.

## Optional syntax for deleting a line of code

You can delete a line in a lot of ways but this one might be the fastest. Regardless of if anything is highlighted, or the placement of your cursor you can just hit

<kbd>CTRL</kbd>+<kbd>Shift</kbd>+<kbd>K</kbd>

and the whole line is gone. Might need to bind this one to a big red button on my desk.

## Moving a line of code

To move a line of code you can use the following on a Mac
<kbd>Option</kbd>+<kbd>Down Arrow</kbd>

or if you're on windows it's
<kbd>Alt</kbd>+<kbd>Down Arrow</kbd>

## Bonus: Copy and move a line of code

I mentioned this one in a previous "Five things VS Code but felt natural enough to mention again here give the theme of moving and manipulating large sections of code. To copy a line and paste it below in one key stroke you can us

<kbd>Option</kbd>+<kbd>Shift</kbd>+<kbd>Down Arrow</kbd>

or on windows
<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Down Arrow</kbd>

And the same works with an Up Arrow if you want it to land above the current line.

Now go five that keyboard of yours a workout.
