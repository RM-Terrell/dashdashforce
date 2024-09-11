---
title: "Pragmatic Programmer Code Navigation Challenges in VS Code"
excerpt: "When in doubt, open the command palette and search for it."
coverImage: "/assets/blog/prag-prog-navigation/ptarmigan.JPG"
date: "2023-10-23"
tags: [vscode, pragmatic_programmer]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/prag-prog-navigation/ptarmigan.JPG"
---

Years ago I read Pragmatic Programmer by Andy Hunt and David Thomas. Because I was pretty new in my career, a lot of it didn't sink in well or have a ton of meaning to me although it was still a very valuable read. Like watching that movie when you're 9 years old that in adulthood takes on a whole new meaning. Well I've been re-reading it and thoroughly enjoying my second go through.

One section throws a gauntlet of sorts that I'm finally taking seriously. In "Topic 18: Power Editing" the authors present the idea of being fluent in your editor of choice and give the following challenges to be able to do without touching the mouse:

> - When editing text, move and make selections by character, word, line, and paragraph.
> - When editing code, move by various syntactic units (matching delimiters, functions, modules, …).
> - Re-indent code following changes.
> - Comment and uncomment blocks of code with a single command. Undo and redo changes.
> - Split the editor window into multiple panels, and navigate between them.
> - Navigate to a particular line number.
> - Sort selected lines.
> - Search for both strings and regular expressions, and repeat previous searches.
> - Display compilation errors in the current project.
> - Run the current project’s tests.

Upon reading this section again I was happy to be able to do about 70% of these in VS Code. My mom was actually a medical transcriptionist for a time and as a result when she taught me to use a computer she was already far more fluent than most in text editing shortcuts than most due to the value of speed when dictating doctors and the fact she started that job before mice were common. What a blessed upraising for a future software engineer as most of those shortcuts still work in modern text editors.

In this post I'm going to walk through the Pragmatic Programmer fluency challenges and how to do them along with as many different solutions to those tasks as I can find, as a few of them have multiple solutions depending on your keyboard, OS, and project. I will specify when commands differ between operating systems or frequently with Windows/Mac I'll just say

> <kbd>CTRL/CMD</kbd> + ...

To represent the Windows / Mac control and command keys respectively as they are most commonly just swapped with the rest of the command staying the same.

## Fluency Challenge Solutions

### When editing text, move and make selections by character, word, line, and paragraph

To move by a single character use the <kbd>Arrow</kbd> keys. To select by one character use <kbd>Shift</kbd> + <kbd>Right/Left Arrow</kbd>. Bonus, use <kbd>Shift</kbd> + <kbd>Down Arrow</kbd> to highlight the rest of a line to the right down to the next line (with the cursor in the middle somewhere), and <kbd>Shift</kbd> + <kbd>Up Arrow</kbd> to highlight the rest of the line to the left.

To move by one word on Windows use <kbd>Ctrl</kbd> + <kbd>Right/Left Arrow</kbd>. On Mac it's a little different with <kbd>OPT</kbd> + <kbd>Right/Left Arrow</kbd>. To highlight by one word use <kbd>Shift</kbd> + <kbd>Ctrl</kbd> + <kbd>Right/Left Arrow</kbd> with Mac being the same command but swap <kbd>Ctrl</kbd> for <kbd>OPT</kbd>.

A optional trick that helps with the next one is moving to the start and end of a line which can be done a few ways. To move to the beginning of the line you can use the <kbd>HOME</kbd> key if you have one, or on Mac you can use <kbd>CMD</kbd> + <kbd>Right/Left Arrow</kbd>. <kbd>END</kbd> key for jumping to the end if you have one.

To select a whole line theres a few ways you can do it with different results. If you are at the start or end of the line and do <kbd>Shift</kbd> + <kbd>HOME/END</kbd> and the whole line (as displayed in your VS Code UI but not necessarily the whole line if its long and has a line break in the UI) will be highlighted. On Mac you can also use <kbd>CMD</kbd> + <kbd>Shift</kbd> + <kbd>Right/Left Arrow</kbd> to get the same effect. VS Code on Windows also has the command <kbd>CTRL</kbd> + <kbd>L</kbd> which will select the whole line even if it is broken into multiple visual lines via the VS Code UI. Here's two screenshots that shot the different results.

Via <kbd>Shift</kbd> + <kbd>HOME/END</kbd>
![Shift End](/assets/blog/prag-prog-navigation/shift_end.png)

and via <kbd>CTRL</kbd> + <kbd>L</kbd>
![Ctrl L](/assets/blog/prag-prog-navigation/control_l.png)

That last one fulfills the "select by paragraph" challenge too.

### When editing code, move by various syntactic units (matching delimiters, functions, modules, …)

This was one I didn't know how to do before starting this challenge and I'm very glad I did. There's a few solutions to these.

To jump delimiters: To go from one end of a parenthesis or bracket pair you can use: <kbd>CTRL</kbd> + <kbd>Shift</kbd> + <kbd>\</kbd> on Windows, and on Mac you can use <kbd>CMD</kbd> + <kbd>Shift</kbd> + <kbd>\</kbd>. I for one had no idea this existed and feel very dumb for not using it all these years especially in massive functions or nested data structures.

To jump functions/methods: When you're in a file that has many functions, methods etc you can use what VS Code calls "go to symbol" via <kbd>CTRL</kbd> + <kbd>Shift</kbd> + <kbd>O</kbd> on Windows, and on Mac its <kbd>CMD</kbd> + <kbd>Shift</kbd> + <kbd>O</kbd>. This creates a drop down like this

![Go to symbol](/assets/blog/prag-prog-navigation/go_to_symbol.png)

which you can then navigate either via arrows or typing a search. It even works in Markdown documents but lets you jump between headers. This one I knew about being in the UI via clicking the current method name in the bar above the file, but the shortcut is wonderful.

### Re-indent code following changes

Two solutions here. If you have some sort of auto formatting tool like Auto Pep8 or ESLINT configured and the indent you desire follows a formatting standard you can run <kbd>CTRL</kbd> + <kbd>K</kbd> (this invokes a special two part command unique to VS Code and Visual Studio) followed by <kbd>CTRL</kbd> + <kbd>F</kbd> and the whole document will be auto formatted. On Mac its <kbd>CMD</kbd> + <kbd>K</kbd> followed by <kbd>CMD</kbd> + <kbd>F</kbd>. This is a rather nuclear solution though and not specific to the line question.

To indent just one line use <kbd>CTRL</kbd> + <kbd>`]`</kbd> or <kbd>CTRL</kbd> + <kbd>`[`</kbd> on Windows, or Mac use <kbd>CMD</kbd> + <kbd>`]`</kbd> or <kbd>CMD</kbd> + <kbd>`[`</kbd> to indent / out-dent the line your cursor is on.

### Comment and uncomment blocks of code with a single command. Undo and redo changes

Two solutions to this one in VS Code. The simplest on Windows is <kbd>CTRL</kbd> + <kbd>`/`</kbd> or on Mac <kbd>CMD</kbd> + <kbd>`/`</kbd> which comments the current line. You can also use <kbd>CTRL/CMD</kbd> + <kbd>K</kbd> followed by <kbd>CTRL/CMD</kbd> + <kbd>C</kbd>.

### Split the editor window into multiple panels, and navigate between them.

To split the editor into two panels on Windows you can use <kbd>CTRL</kbd> + <kbd>\</kbd> and on Mac its <kbd>CMD</kbd> + <kbd>\</kbd>. This opens your current file into another split panel.

There are two different sets of shortcuts for navigating the tabs and groups of tabs created by this. One Windows, to navigate to the first editor group use <kbd>CTRL</kbd> + <kbd>1</kbd> and use <kbd>ALT</kbd> + <kbd>1</kbd> for going to a specific tab within that group. You can sub out `1` for any other number depending where you want to go.

Same features on Mac but it's <kbd>CMD</kbd> + <kbd>1</kbd> for editor groups and <kbd>CTRL</kbd> + <kbd>1</kbd> for individual tabs. That one hurts the brain a bit to switch between.

### Navigate to a particular line number

On Windows hit <kbd>CTRL</kbd> + <kbd>G</kbd> and then type your desired line number. On Mac it's the same story but with <kbd>CMD</kbd> + <kbd>G</kbd> instead.

### Sort selected lines

This one blew my mind a bit. Select some lines and then open the command palette with <kbd>CTRL/CMD</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>, and search "sort". Turns out VS Code can sort ascending or descending just like that.

### Search for both strings and regular expressions, and repeat previous searches

VS Code supports regex and text searching in it's two different search locations. One via <kbd>CTRL/CMD</kbd> + <kbd>F</kbd> which will search your current file. The shortcut to get into regex mode gives me issues though on Windows as it collides with Nvidia software.<kbd>ALT</kbd> + <kbd>R</kbd> opens up an Nvidia overlay for my GPU. Can't say I use regex search enough to fix that on my Windows machine. Heck I'll probably use this overlay for GPU usage more...

Using <kbd>CTRL/CMD</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> will open up the left side panel for searching your entire project. From here you can also search both text and regex, along with open up other inputs for including/excluding file types and directories.

### Display compilation errors in the current project

This one lives in the integrated terminal which you can open with <kbd>CTRL/CMD</kbd> + <kbd>`</kbd> and then click over into the "Problems" tab, or even faster you can use <kbd>CTRL/CMD</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd> to jump straight into the "Problems" tab.

### Run the current project’s tests

For this you might have a few different solutions depending on how your project is setup and what tools you're using. One project I work in we use VS Code's "Tasks" concept to control building and testing the application, so I used the command palette to open "Tasks" and then select the one I want.

A very frequently used command however for compiling a project is <kbd>CTRL/CMD</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> but as I said it depends on your project, how it's configured, and what extensions you have running. If I run that command right now I get both the Golang _and_ Rust extensions trying to build my project even though my blog is currently a Ruby project. Not really what I want. You might get similar weirdness with command "Run Tests" shortcuts as it might run tests in one language but not another. Consult with your project and it's extensions to find the shortcut for running tests and use VS Code's "Tasks" concept if you can't find something default that works.

## Lesson learned: The most import keyboard shortcut in VS Code is

<kbd>CTRL/CMD</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>

When in doubt, open the command palette and search for it.

Happy typing. Hope you have a good keyboard.
