---
title: "Fixing Kali UEFI boot"
excerpt: "Tales of the obvious, from a VM noob"
coverImage: "/assets/blog/kali-boot-fix/DSCF0709.JPG"
date: "2025-01-17"
tags: [linux, kali, virtual_machine]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/kali-boot-fix/DSCF0709.JPG"
---

I recently picked up a copy of [Linux Basics for Hackers by OccupyTheWeb](https://nostarch.com/linuxbasicsforhackers) in an attempt to learn more about Linux but do so with a bit more of a practical direction than "learn linux". The first part of the book however involves setting up Kali Linux in a VM and it immediately brought me back to using VMs at a previous job....and fighting them endlessly. I'm on MacOS with an M3 chip using Virtual Box and if you my friend also encounter issues where you can't boot past the UEFI Interactive Shell, this post is for you. Turns out it's an easy fix.

## The issue

After getting Virtual Box installed and loading an ISO of Kali Linux, upon trying to boot the VM I was left with just this UEFI screen:

![uefi-shell](/assets/blog/kali-boot-fix/uefi.png)

....well that't not Kali.

After some googling around and confusion as to what this screen even was I found out that this UEFI is very similar to the one I'm used to on my Windows gaming computer, and I just needed to manually call the UEFI file for Kali much like assigning a boot drive on my desktop which was supposed to be installed...somewhere. How to find it? In my case, I eventually found that the file lives in `FS0:\EFI\kali\` (note the slashes `\` not `/`) and can be navigated to by typing `FS0:` followed by `Enter` and then `cd EFI` and then `cd kali`.

![file-location](/assets/blog/kali-boot-fix/uefi-file-location.png)

And there's an `.efi`!

If you're content with manually booting Kali by calling this file (and maybe if you plan to have other EFI files in this VM) you can now boot Kali just by typing `grubaa64.efi` and hitting enter, and it should boot. I however wanted to make this automatic so I didn't have to do this every time.

## Auto booting Kali

To auto boot a particular `.efi` you need to edit the `startup.nsh` file in the root of the `FS0:` EFI partition. This file can hold file paths to `.efi` files like the one we just found. To edit this file, go back to the root of the UEFI shell by typing `FS0:` and hitting enter (or `cd`ing), then type `edit startup.nsh` and hit enter.

![budget-vim](/assets/blog/kali-boot-fix/budget-vim.png)

This will open the file in a text editor where you can add the path to the `.efi` file you want to boot. In my case, I added `FS0:\EFI\kali\grubaa64.efi` (again note the slash direction here) to the file and saved it by hitting Enter, followed by Control + S and Enter again. Then Control + Q to exit the editor. Man that's worse than vim.

At this point enter `reset` and hit enter to restart the VM and it should boot into Kali Linux automatically! Happy Hacking.

## Useful links I found while figuring this out

<https://medium.com/nerd-for-tech/troubleshoot-fixing-the-virtualbox-uefi-interactive-shell-problem-d7b3c9e76415>

<https://www.youtube.com/watch?v=A3z64QUTJsM>

And saved for posterity is this screen shot from the above youtube video that helped me figure out how to edit the startup file. The path was different in my case but the process the same.

![perma-fix-steps](/assets/blog/kali-boot-fix/perma-fix-steps.png)
