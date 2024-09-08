---
title: "Quickly switching from Powershell to Bash using WSL"
excerpt: "This is such a silly, small command that you would think it would be obvious, but I had never seen it documented..."
coverImage: "/assets/blog/powershell-to-bash/utah_rocks.jpg"
date: "2020-05-06"
tags: [windows,bash,powershell,linux]
photo_credit: "Sam Kahsnitz"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/powershell-to-bash/utah_rocks.jpg"
---

Although I was born and raised using Windows machines, the majority of my software development has been done on MacOs and Linux. As such for a while now I've been searching for ways to maximize all my Linux command line muscle memory, but within a Windows environment. I've tried a few things over the years. Git Bash was one of the first tools I found that allowed the use of Bash commands within Windows, granted with a few quirks and problems of its own. The introduction of Windows Subsystem Linux however put an end to my need for Git Bash, now that I can access a (mostly) full fledged Linux OS right there inside my Windows machine.

Up until very recently though I had been using the WSL side of my computer one of two ways. One was by running the Ubuntu launcher as a separate terminal window which landed me in the root of the WSL machine. I then needed to furiously `cd` my way into whatever directory I needed to work in (or bashrc alias it). The other was by switching shells within Visual Studio Code which automatically took care of the directory changes. But what if I wanted to work outside of VScode? Or blend magics that were never meant to blend and run a powershell command, _followed by_ a bash command right after it in the same terminal window?? Well I found a way to do it.

Within any Command Prompt or Powershell window you can simply run the command

```powershell
bash
```

and the Linux subsystem you have installed is activated and switched too, right there in whatever directory you are sitting in. This is such a silly, small command that you would think it would be obvious, but I had never seen it documented clearly until I stumbled upon it another article deep in the net somewhere. Here's a running example:

Sitting in the users root of my Windows machine in Powershell:

![powersh](/assets/blog/powershell-to-bash/powersh.png)

Running

```powershell
bash
```

results in

![powersh](/assets/blog/powershell-to-bash/bash.png)

And VOILA! I'm now running Ubuntu bash in the same directory inside a Powershell terminal. I have not yet found a way to switch _back_ to Powershell or CMD from bash but will update this post if I do.

Happy bashing on Windows!

May 7th 2020 Update: Running the `exit` command is one way to drop back into Powershell or CMD from bash.
