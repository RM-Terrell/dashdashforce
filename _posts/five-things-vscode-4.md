---
title: "Five Things VSCode Part 4"
excerpt: "Someone once complimented me on my VS Code shortcut skills and I've been craving that high again ever since."
coverImage: "/assets/blog/five-things-vscode-4/DSCF0940.JPG"
date: "2025-02-12"
tags: [vscode, docker, devcontainer, shell]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/five-things-vscode-4/DSCF0940.JPG"
---

I've been setting up a lot of new devcontainers as part of some new projects at work as we use VS Code as our standard editor so I've been experimenting a bit with devcontainer settings and VS Codes shortcuts more. Someone once complimented me on my VS Code shortcut skills and I've been craving that high again ever since. Hopefully these come in handy for you, or at least for me in a few months when I inevitably forget how to do these things.

## ZSH themes in a devcontainer

One thing that has previously irked me with devcontainers have been just having a normal bash shell without the features I'm used to like `git` information in the terminal cursor. Turns out thats an easily fixable problem, and [can be customized far deeper](https://medium.com/@jamiekt/vscode-devcontainer-with-zsh-oh-my-zsh-and-agnoster-theme-8adf884ad9f6) than I show here.

To get a basic z-shell with the robbyrussel theme you can add the following to your `devcontainer.json` file.

```json
    ....
    "features": {
        "ghcr.io/nils-geistmann/devcontainers-features/zsh:0": {
            "setLocale": true,
            "theme": "robbyrussell",
            "plugins": "git docker",
            "desiredLocale": "en_US.UTF-8 UTF-8"
        }
    }
    ....
    "customizations": {
        "vscode": {
            ....
            "settings": {
                "terminal.integrated.defaultProfile.linux": "zsh",
                "terminal.integrated.profiles.linux": {
                    "bash": {
                        "path": "/bin/bash",
                        "icon": "terminal-bash"
                    },
                    "zsh": {
                        "path": "zsh"
                    }
                },
                ....
            }
        }
    }
```

And then on reloading the devcontainer you should be dropped into a z-shell right away, with a `bash` option in the caret drop down too. You can add as many different shells as you want this way. Go ahead drive your team mates nuts with a crazy over engineered `zsh` theme by default.

## "unminimize" and man pages in a devcontainer

I've been learning a lot about linux lately as part of reading "Linux Basics for Hackers" by OccupyTheWeb and one thing that surprised me was when I tried to run a `man name-of-library` and I got a message about `man` pages not being included by default. Turns out this is easy to fix in two steps.

1: run

```bash
unminimize
```

and your container will begin to install tooling that was left out to keep container size down. You'll then need to run

```bash
apt install man-db
```

and you should then have all the missing `man` pages. In my case I also needed to manually install the one for the third party library after setting up the `man` binary and db via the last two steps. Most of the time this cut down feature set is probably for the best for the sake of performance, but if you need extended tool this is an easy way to turn your devcontainer into something closer to a full Linux install.

## Panel toggle shortcuts

A while back I realized you could toggle the console in VS Code with <kbd>CTRL</kbd>+<kbd>`</kbd>, but that strictly toggles the console, and if you're not inside the console but one of the other tabs in the bottom panel it will jump you into it first and you have to hit the shortcut again to then close the terminal and bottom panel.

Turns out you can toggle the whole bottom panel with <kbd>CMD</kbd>+<kbd>j</kbd>. <kbd>CMD</kbd>+<kbd>b</kbd> for the left side panel (also known as the Primary Side Bar), <kbd>CMD</kbd>+<kbd>OPTION</kbd>+<kbd>b</kbd> for the right side panel with Co Pilot (also known as the Secondary Side Bar).

## Toggle word wrap

In many file types "word wrap" will happen by default, causing long lines of text to be broken up into multiple lines in the GUI of VS Code. I find this is often the case with `.md` files, but not always code. If you want to toggle this behavior though you can run <kbd>OPTION</kbd>+<kbd>z</kbd>. I've found this to be incredibly helpful when I have two files open side by side in the split view and one is overrunning the window bounds causing me to need to scroll sideways, but with word wrap thats no longer needed.

You can also access this via the Command Palette by opening that and searching for "word wrap".

## Transform to upper case

Another one in the Command Palette is the ability to transform words into different cases with a single command. Next time you need to change a words casing (lower, upper, camel, snake, etc), run open up the Command Palette with <kbd>CMD</kbd>+<kbd>SHIFT</kbd>+<kbd>p</kbd> and search "transform case". You'll be greeted with these options.

![case-transform](/assets/blog/five-things-vscode-4/case-transform.png)

You can even vaporize a few gallons of water and a concerning amount of fossil fuels by transforming it with Co-Pilot too! Who needs regex and such when you have an LLM.

Happy Editing!
