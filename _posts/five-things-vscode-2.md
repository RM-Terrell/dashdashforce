---
title: "Five Things VSCode Part 2"
excerpt: "...it really comes in handy when you want to go back to something you searched 5 minutes ago and already forgot what it was."
coverImage: "/assets/blog/vscode-2/norway_lake.jpg"
date: "2021-11-03"
tags: [vscode, kubernetes]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/vscode-2/norway_lake.jpg"
---

So far VSCode has survived the transition to a Go / Kubernetes focused job, and in learning new things has came learning about some features of the editor I was previously unaware of. Quick note, the keyboard commands below are all using a Mac, though all of these commands exist on Windows too, you'll just need to translate them over.

## Setting VSCode as your default editor for Kubernetes files on Mac

First off, I am terrible at Vim. Embarrassingly terrible. So I take steps to avoid it. Imagine my dismay when I ran an `kubectl edit deploy/name_of_my_service` and up popped my old nemesis. If you too are Vim impaired there is a solution.

In your terminal, simply run the command:

```shell
export KUBE_EDITOR='code --wait`
```

And then when you run `kubectl` commands that would otherwise open a Vim editor in your terminal, VSCode will open the file instead. This does require VSCode to be on your PATH, so if it fails that may be why. Also one wrinkle in this is that when you save the file after editing it, you aren't really done. You have to _close_ the file to finish the edit process, hence the `--wait` part. Like Vim its waiting for the editor to close out before moving on.

Even better than running the `export` command for each terminal session, add it to your `.zshrc` file so every terminal behaves this way. I am using ZSH as my terminal for my work Mac, but if you are using a different shell this should still work, just plop the same command in whatever config file your terminal runs at startup. I also imagine this solution would work other editors too, you'll just need the command used to launch that editor via command line instead of `code`.

## Search History

When in the global search tool (left side tool bar, or <kbd>CMD</kbd>+<kbd>SHIFT</kbd>+<kbd>F</kbd>) you can use the up and down arrows on the keyboard to scrub through your history of searches. Really comes in handy when you want to go back to something you searched 5 minutes ago and already forgot what it was. On a related note.....

## Previous Cursor Location Shortcut

Typing <kbd>CTRL</kbd>+<kbd>-</kbd> will take you back to the previous place you had your cursor, no matter what file it was in. I can't believe I've been using this editor for 5-6 years now and only just found this. My recent work has had me bouncing through function definitions spread across a _lot_ of files and keeping mental track of the trail of breadcrumbs like a nerdy Hansel and Gretel just became too much and I had to find a solution.

## Kubernetes Extension Remote Cluster Management

The official Microsoft Kubernetes extension for VSCode (link [here](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)) is a godsend. It has a ton of features but the one that has been of most use to me lately has been that you can set the extension to have its own Kubeconfig file, including those for managing remote clusters. This has been lovely because it allows me to keep all my terminal tabs managing my local clusters, and any inspection of the remote ones done via the UI which keeps them nicely organized. Even better it keeps a history of which kubeconfigs you've used so switching between clusters is just two clicks.

![kubeconfig_extension](/assets/blog/vscode-2/kubeconfig.PNG)

And then from the UI drop downs for that cluster you can view running pods, PVs, PVCs, delete, describe, get logs, etc.

## Copy a line in one command

<kbd>CMD</kbd>+<kbd>C</kbd> <kbd>CMD</kbd>+<kbd>V</kbd> BE GONE!!! If you have a line you want to copy down or up a line within your code, while your cursor is on that line simply do

<kbd>option</kbd>+<kbd>Shift</kbd>+<kbd>Down Arrow</kbd>

 to copy the line down, up arrow instead to copy up.

 Happy coding!
