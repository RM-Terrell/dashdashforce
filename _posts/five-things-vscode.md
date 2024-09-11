---
title: "Five things I use a lot in Visual Studio Code Part 1"
excerpt: "The fact is I'm a fanboy of anything that just works..."
coverImage: "/assets/blog/five-things-vscode/finse.jpg"
date: "2020-06-26"
tags: [vscode]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/five-things-vscode/finse.jpg"
---

I'm a bit of a fanboy of Visual Studio Code. My coworkers are probably sick of me talking about it. The fact is I'm a fanboy of anything _that just works_ and VSCode fits that description well. It's lightweight, fast, customizable, extendable, and does all the text editing, debugging, and source control management that I as a developer need to do on a daily basis. I don't currently need the heavy weight tools of a full IDE like Visual Studio or Pycharm, so for the past few years I've been striving to make VSCode the best editor I can for me. To that end I feel its worth jotting down some of what I've learned and came to appreciate about it. This will be a series of posts on all the things I use _a lot_ in VSCode, from settings, to shortcuts, to extensions. Lets roll.

## Number 1: The Integrated Console and Command Pallette

This one may seem obvious to some but on the list of "things I use a lot" its right at the top and deserves some mention and exploration.

To quickly access the integrated terminal in VSCode on Windows you can use the following shortcut: <kbd>CTRL</kbd>+<kbd>`</kbd> (same command on MacOS). Note that I will be using the default VSCode keymap shortcuts for all commands. You'll need to translate if you use a different keymap (more on that later).

This will simply toggle the console without clearing its contents or canceling any running tasks. Here is the terminal open and running ZSH.

![console](/assets/blog/five-things-vscode/console_zsh.png)

One small win here right away is that the terminal will always open in the root of your current VSCode folder or project (this is also customizable if you don't like it). No `cd`'ing around to get into your project like when using an external terminal. Nice.

If you wish to fully kill the console window there is a little trashcan icon that will kill it and all processing running in it. You can also split the terminal in multiple parts, or create multiple whole terminal windows tha can be toggled between using that dropdown option to the right. Heres my VSCode editor running split PowerShell terminals in different directories

![split](/assets/blog/five-things-vscode/split_powershell.png)

Speaking of PowerShell and ZSH, you can customize which terminal shell is used by default. To do this you use something called the Command Pallette. To get to it use:

<kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd>

(command instead of control for Mac) and an overlay will appear. This overlay should be your go to solution when you're wondering "wait how do I get to that again?" as many things VSCode can do can be found via this search bar. Here I am searching for the command to switch default shells, to do things like switch from ZSH to bash, or CMD to PowerShell.

![shell_switch](/assets/blog/five-things-vscode/shell_switch.png)

One thing to note here is it won't switch your current shell, just the default of the next shell opened.

Want to be a total loon and use VIM while using VSCode? You can do that. Here's the VSCode terminal running VIM against one the files in my current project.

![vim](/assets/blog/five-things-vscode/vim.png)

## Number 2: Other Editor Keymaps

Speaking of VIM, if you've got other editors like VIM, EMACS, Eclipse, Sublime, etc under your fingers you can load custom keymaps into VSCode to make it feel more familiar. I want you to guess where to go to find them first. That's right. The Command Pallette.

<kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd>

And then search "keymaps" and an option will come up for "Preference: Keymaps" where you can load a number of keymaps from other editors.

## Number 3: The Extensions Marketplace

The extensions market place is pretty self explanatory and worth browsing. You can find extensions to editor functionality, like ESLint which adds linting messages for JavaScript code to the UI, keymap extensions, themes, and other add ons.

My current favorite extensions are the following:

### Python

This extension provides language support for Python in VSCode. It provides features like interpreter / virtual environment switching, syntax highlighting, debugging, Jupyter Notebook support, and countless other features. A must have if you write Python. Its official page is [here](https://marketplace.visualstudio.com/items?itemName=ms-python.python).

### ESLint

Syntax checking, style enforcement, and code suggestions for JavaScript all right in the UI. Or viewable via a pane in the integrated console. Info [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

### Rainbow CSV

I have to read and work with CSV's a fair amount at my job and they are terrible to stare at for too long. This extension colorizes the "columns" of data separated by commas. I've found this massively improves CSV readability and helps avoid editing incorrect data. Info [here](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv).

### Docker

Docker things. Be able to manage and view running containers and images all from the VSCode UI. Also provides Dockerfile syntax highlighting among other things. Info [here](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker).

### Code Spell Checker

I suck at spelling. I fully admit that and I'm working on it. This extension has saved me from myself countless times via a very simple underline of misspelled words. Info [here](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker).

### Live Server

A very good extension if you find yourself editing simple HTML/CSS/JS and want to quickly load the result into the browser. It supports live reload on editing too. Fantastic extension, and as of this writing it looks like the author is looking for new maintainers. Info [here](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

### Live Share

Want to pair program with another VSCode user? Like Google Docs gone hacker. [Here ya go](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare).

### Better Comments

This one is very personal preference but I love it. Highlights `TODO` comments, and comments with special characters like

```python
# ! this is an important comment
```

in a unique way that makes them stand out in your editor. Info [here](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments).

### Bookmarks

I frequently find myself wanting to remember specific spots in code and jump back and forth between them quickly. I haven't yet found a great way to do that native in VSCode besides remembering line numbers and using <kbd>CTRL</kbd>+<kbd>G</kbd> to jump to that line, but this extension handles it great with a series of keyboard shortcuts for jumping between lines you bookmark, and viewing bookmarks in other files all through the side panel UI. Info [here](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks).

## Number 4: Integrated Git Source Control

This may be my favorite aspect of VSCode. I could write multiple blog posts on this topic alone so I'm going to just point you in the right direction for now so you know it exists and can learn more. VSCode comes with Git source control management integrated into it by default, and it has so much functionality that you could do basically anything via the UI if you want. Or mix and match via the integrated terminal. Heres a few killer features.

Accessing the source control options is done via this icon on the left side:

![source](/assets/blog/five-things-vscode/source_icon.png)

Which brings up the pane for managing your projects source code. Or if you have VSCode open one directory up from multiple repos sitting side by side, you can manage all of the different repos branch states via one UI. From here you can add, stage, unstage, commit, and revert code. Right click the files and sections of this panel for more options (theres a joke about Microsoft UI design in there somewhere). left clicking on one of the files presented in this left hand view before its committed brings up a diff view right there in your editor like so:

![diff](/assets/blog/five-things-vscode/diff_example.png)

Also note the little button in the top of the source control panel to the left of the checkmark that looks like four horizontal lines. That lets you toggle between showing the folder structure of the files changed or just showing files names. Very useful depending on your project and / or what files you're working on.

Expanded folder view

![expanded](/assets/blog/five-things-vscode/expanded.png)

Condensed file name view

![condensed](/assets/blog/five-things-vscode/condensed.png)

You can also easily switch branches via the UI. In the bottom left corner of the editor you will see something like this:

![branch_master](/assets/blog/five-things-vscode/branch_master.png)

Clicking on the branch name brings up a menu where you can create new branches and switch to existing ones. Really going for the "visual" in Visual Studio Code here.

## Number 5: Smart Expanded Text Selection

One final thing is a shortcut that has saved me a huge amount of time and helped me avoid clumsy mouse based highlighting. Smart expanding text selection. Lets say you have some code that is sitting in quotes, and you want to highlight everything inside the quotes, like a key name in a dictionary accessor or even a whole sentence. You can use smart expanded text selection to highlight up to (and beyond) the things in quotes.

For Windows use: <kbd>ALT</kbd>+<kbd>SHIFT</kbd>+<KBD>RIGHT ARROW</KBD>

And for MacOS use: <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<KBD>RIGHT ARROW</KBD>

And every time you hit the right arrow the selection will keep expanding in a "smart" way that ends at quotes and other major symmetrical divisions. Use the left arrow to narrow the selection.

## Other Resources

If you enjoyed this info the website <https://www.vscodecandothat.com/> has a great selection of even more cool features of the editor.

Scott Tolinski at LevelUpTuts also has an excellent series on VSCode. His Youtube channel is [here](https://www.youtube.com/channel/UCyU5wkjgQYGRB0hIHMwm2Sg)

For the MacOS reference on keyboard shortcuts you can look [here](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf) and the Windows version is [here](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf).

Until next time, happy hacking with VSCode!
