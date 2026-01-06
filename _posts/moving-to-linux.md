---
title: "Escaping Windows 11: A guide for those who don't know what journalctl is."
excerpt: "Linux as a cathartic window smashing brick for the soul."
coverImage: "/assets/blog/go-memory-logarithm/hidden_valley.JPG"
date: "2026-01-05"
tags: [linux, windows]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/moving-to-linux/bird.JPG"
---

I've had enough of Windows and I suspect you have too.

I won't retell all the silliness that [Microslop](https://www.windowscentral.com/artificial-intelligence/microslop-trends-on-social-media-backlash-to-microsofts-on-going-ai-obsession-continues) has been up to but instead dive straight into a solution: Installing some flavor of Linux and finally taking back control of your own PC. This post will be a little different than my usual fair which is very programming heavy, but being that most of the software I write runs on Linux systems, using one as my home machine has been a great chance to refine my skills _and_ make my personal machines more usable. I hope this post helps you make sense of it all in some way.

If you want to jump straight into the install steps [go to this section](#the-actual-install-steps) to skip all the extra context below. You'll need a running full desktop computer of some kind (Windows, MacOS, Linux, even Android are all fine) for running the ISO flashing software, a 32gb drive (you can go smaller but 32gb is about the smallest you can buy now a days, it needs to be as big as the ISO file you'll download), a spare drive to install Linux onto (or your main SSD if you're ready to irreversibly upgrade), and spare hour or two.

## The goal here

This guide will cover an actual full system install aimed at beginners and as such won't get under the hood of how Linux works and how to really mess with it. I am going to focus on what you need to get rolling fast and with minimal buzzwords being thrown at you. There are MANY more detailed guides written by far smarter people than me if you want more details so treat this post as a spring board. This guide was largely inspired by friends and colleagues considering making this leap and needing a general sense of direction.

An alternative is to use a software like VirtualBox to install Linux as a Virtual Machine (VM) inside your original system. If you don't know what a VM is go [checkout this article by Google](https://cloud.google.com/learn/what-is-a-virtual-machine). It sounds complicated at first but in practice it's a pretty simple thing that will unlock a whole new world for you. If you just want a quick preview of what it's' like to navigate a given distro of Linux and not do things like gaming on it (VMs are pretty resource intensive and bit restrictive for stuff like gaming), then _this is a great choice_. You can blow it away easily (or blow it up) and not effect your underlying system at all.

## Some brief history on me so you know I know what I'm talking about

In an effort to show this advice comes from a real person and not just the Microslop garbage we're trying to escape, I think its worth having a quick context on how I got here and my previous experience with OS installs and custom systems. I've been building custom PCs for gaming for myself and others since I was about 16, a mildly alarming 20 years ago. Importantly I'm NOT coming from a background of 20 years of Linux experience and have largely used Linux in a manner professionally that amounted to "run this command when things go bad" or "just take a VM snapshot and revert if you get an error" without learning much else until recently. As a result you won't get the usual dumps of information from Linux experts that unconsciously assume significant pre-existing knowledge, nor the RTFM style condescension. Its hard to know how to read the manual when you don't kow there is one or how to find it (Linux it turns out has a great manual but we'll get there). I'm probably only a year removed from being as confused as you are and have been using Linux (in a few different forms) as my main gaming machine OS for about 6 months now. Far from an expert, but enough to helpful I hope.

### A split childhood (Windows 95 and The Bubble Mac)

I grew up on both major operating systems of the era. My earliest memories with a computer were both a Windows 95 machine (and vague memories of an MS DOS one) that my mom used for work over a dial up connection as she was literally one of the first internet remote workers, and the original "bubble" iMacs G3s at my elementary school, which came from Steve Jobs push to integrate with educational institutions during his NeXT days. As a result I've always been comfortable with both, and that continued for many years using Windows machines for gaming and school work (and many a terrible powershell script) and MacBooks for professional software development work (and many a terrible bash script).

This split brain was so strong that at once point I even built Hackintosh machines back in the day when you could still do that (pre Apple Silicon). Here's a machine I built in 2015 for my girlfriend at the time who wanted to play League of Legends on MacOS without spending thousands on a Mac Pro.

![a-really-terrible-idea](assets/blog/moving-to-linux/hackintosh.jpeg)

## Linux, distros, FOSS, and you

### What is Linux anyways?

In its simplest definition, Linux is a kernel used to send instructions to underlying hardware, routed from some input by a user or other software. One could imagine the kernel as the first layer that sits right above the BIOS, below the "user space" of application. The Linux kernel itself was first developed by Linus Torvalds who admired the way the Unix kernel at NeXT/Apple Computer worked, but disliked the licensing and restrictions around it. So he built his own version. The kernel alone isn't super useful to you as a normal person, and to have a full operating system as you know them (even a pure text based one with no graphical UI) there's a lot of extra software that has to get bolted on around it. This is the source of all the different flavors of Linux, sometimes known as distributions or "distros". Fedora, Ubuntu, CentOS, Bazzite, SteamOS, Arch, and others all share some form of the Linux kernel at the core (and all benefit from kernel improvements), but with different configurations of other software around it to make a system for a specific purpose. SOme versions of Linux are meant to just run server applications for example and aren't very nice to use as a human. This diversity is a strength, as there [really](https://moebuntu.web.fc2.com/home_eng.html) [is](https://github.com/Amog-OS/AmogOS) [a](https://www.kali.org) [distro](https://templeos.org) [for](https://www.xda-developers.com/tested-fedora-linux-distribution-north-korea/) [anyone](https://github.com/tiagoad/suicide-linux), but it can also be paralyzing as one wonders what "the best" choice is.

This "kernel plus other software" concept is the source of a lot of snarky comments you might have seen about "I don't get why linux noobs want SteamOS, you can just make it yourself". "Just make it yourself", were it so easy. This comment is technically correct, but in practice it's useless for people who've never even used Linux before. What they are referring to is starting with some base OS install (in the case of SteamOS its based on Arch, a notoriously difficult version of Linux to even install), and then add on Steam and any other gaming software you might need. This is a more than valid way to start but is certainly more difficult. Granted [if PewDiePie can do it](https://www.youtube.com/watch?v=pVI_smLgTY0), I think we all should be inspired to be a little more adventurous with our OS installs. Be warned if you follow this path you may wind up building all your own replacements for other software from Google, Microsoft, and Apple and hosting them yourself, [just like Pewds](https://www.youtube.com/watch?v=u_Lxkt50xOg).

### Atomic / immutable systems

A term you'll see thrown around a lot nowadays is "immutable" or "atomic" operating system, and we are going to be installing one. What this word means, is that the core files that make up the OS are integrated in such a way that they cannot be modified by you the user or another program. It lacks the ability to be mutated. This is a stark contrast from traditional Linux systems that allowed programs to update core configs, and all it took was one or two janky programmed applications (or just unfortunately programmed for a given system) to modify a core file in some incompatible way that took down the whole system.

This mutability was the source of many issues people have had with Linux over the years, and to be fair also Windows and MacOS occasionally. Just because an OS is made by a mega corp doesn't make it immune to mistakes in the core files. But this new wave of Linux systems treats the OS differently, and as a result creates a system that lacks some of the previous Linux hackery, for the better. A Linux expert who knows how to navigate such issues won't be reading this article anyways, and you can always give one of these a go on a spare drive at some point.

Instead, each application on the machine is "layered" into the system in its own sandbox, and as a result doesn't rely on shared libraries of code. This is built on a concept called [The Open Container Initiative](https://opencontainers.org) which was originally aimed at building individual software applications as "containers" with code layers that have defined methods of interaction. Immutable operating systems is the result of taking that same concept and applying it to _the whole OS_. This does increase the total storage cost of the system as there are duplicated dependencies and layer overhead (each in their own sandbox) but the cost is minimal given how cheap storage is. It's also offset by not having a ton of shovelware like Teams pre installed.

This creates limitations to what you as the user can do, which experts will chafe against, but results in stability and a safer, more secure platform to learn on. It is my opinion that that is what most computer users want anyways, and when they want to swim out into more dangerous waters they can do so on their own terms vs being thrown straight into them off the side of the mega corp yacht. A few examples are [Bazzite](https://bazzite.gg), [Fedora Silverblue](https://fedoraproject.org/atomic-desktops/silverblue/), [Fedora Kinoite](https://fedoraproject.org/atomic-desktops/kinoite/), and [SteamOS](https://store.steampowered.com/steamos).

You can see here from the Fedora homepage there are quite a few unique flavors of the OS. All free for you to download and try via their ISOs. Kinoite and Silverblue for example are essentially the same core with a different UI wrapper.

![atomic-systems](assets/blog/moving-to-linux/atomic-systems.png)

### Why Bazzite?

Bazzite is immutable Fedora meant for gaming. It benefits from all future improvements to the Linux kernel and Fedora itself. For you as the gaming user, the main advantage of Bazzite is that it has Steam pre installed as a core application (not as a flatpak) and has a few other tweaks under the hood for gaming in other launchers too. That said, you'll have a great experience gaming on any version of Fedora nowadays too so feel free to branch off from this guide if you'd like and just install the needed gaming launchers yourself. Bazzite has a [great FAQ page here](https://docs.bazzite.gg/General/FAQ/) if you're curious about more.

### KDE and GNOME

KDE and GNOME are two words you're going to see thrown around a lot. They are two different software libraries that create the UI you see when you load the system. [KDE](https://kde.org/linux/) will feel very familiar to any Windows user, and GNOME is more similar to MacOS but both can be customized and expanded. I have a personal preference towards KDE as I like its more detailed menus and included software like Dolphin (folder / file explorer), Kate (lightweight text editor), and Haruna (video player). If you've ever been pissed off about Microsoft making the right click menus objectively worse, you're going to love KDE.

### Wayland

Wayland is a "desktop compositor" or a [tool used to draw UI elements](https://www.reddit.com/r/linuxquestions/comments/1089ctd/so_what_exactly_is_wayland/) and allow them to communicate with each other. Its another layer of Free Open Source Software (FOSS) used to build your final usable desktop and both KDE and GNOME use it. I mention this as you'll soon see references to Wayland in discussions about KDE and GNOME features and how they interact with other software. You don't need to know how it works, but knowing what it is will make sense of a lot of discussions you'll run into.

### Why not SteamOS?

As of this writing SteamOS is only built for AMD hardware, and primarily their mobile hardware at that. This makes sense given the Steam Deck and upcoming Steam Machine / Gabe Cube are built on AMD mobile chips. I tried getting it to install on my system but it failed for reasons I decided weren't worth diving into before going back to Bazzite. In the future this is very likely to change though and it's worth keeping on eye on what Valve is up to on this front as they seem to be gunning for the Windows throne.

### Why not that one distro I heard about?

I don't know man theres more Linux distros out there than I have time to research. One thing about diving into this world is it _does_ require you to be able to do some reading and homework and thats a good thing. My own reading and homework have landed me on Bazzite KDE having the best set of trade offs for someone coming from a lot of Windows previously, who plays games, occasionally writes some custom software, and does some light media editing.

Windows by default nowadays treats you like an idiot, Linux by default treats you like an expert. I find one of those insulting and one of them freeing, but it does come with the responsibility to make your own choices and deal with them, with the trade off being _it's really your computer to do with as you want now_.

## Problems you can expect

### Kernel access Anti-cheat games

If you play League of Legends every day and aren't interested in changing that, this isn't for you right now. Certain games like League, Battlefield, and Valorant require something "kernel level anti-cheat" software which literally can't run on Linux as Linux doesn't allow it. Anti-cheat software makers will have to change their methods for this to ever be resolved as the Linux community is unlikely to ever allow it, especially in the wake of the Crowdstrike outage that was caused by poor coding around Windows kernel access.

### Microsoft Office

Or as they now want to call it ["365 Copilot App"](https://support.microsoft.com/en-us/office/the-microsoft-365-app-transition-to-the-microsoft-365-copilot-app-22eac811-08d6-4df3-92dd-77f193e354a5). This could be considered a hard blocker that might require time to prep before switching if you're running a local instance of Office like its 2011. Granted if you're here trying to get away from Microslop, you probably want away from Office too. There is no native version of Office on Linux and there never will be given Microsoft's reluctance to even make a Mac version of their software. Tools like Wine, Bottles, and running Windows in a VM are all an option but have varying levels of jank and brokenness. Other options include running Office in its web browser version, Google Docs, LibreOffice, and replacing it all with markdown docs / Python scripts / and a PostgresQL database if you're feeling spicy.

### Excel

I mentioned Office above, but Excel deserves its own callout due to its main use as a local application and overlap with software engineering and data engineering (my usual specialties). I used to use Excel full time as an analyst and Eve: Online player (yes I'm saying that with a straight face you should have seen my market trading docs), but I've been out of it for a few years so my opinions will be less helpful here.

That said, the Libre Office suite of software (`flatpak install flathub org.libreoffice.LibreOffice`) has LibreOffice Calc which is meant as an open source Excel replacement. I would advise you install LibreOffice on your current native system first (it's open source and free and has Windows and MacOS versions) to see if it meets your needs before proceeding. The experience should be the same on Linux. It handles Excel docs natively and has similar feature parity of Excel, but given the vast set of features and use cases of Excel a full assessment is far beyond my skills. I was able to find [this nifty feature comparison](https://wiki.documentfoundation.org/Feature_Comparison%3A_LibreOffice_-_Microsoft_Office) of the twp though that might come in handy.

### Non flatpak linux software

In order to install a flatpak software from Flathub, someone has to have taken the time to build a flatpak of it containing the application code with all its dependencies so it can run properly in its own sandbox and then pushed it to the hub. It is a community project. Many of the most popular applications have already had this done like LibreOffice, Firefox, ProtonVPN, Steam (if you're not using Bazzite that already has it layered in natively), etc. But if say you need some niche piece of old Linux software that no one has made a flatpak for yet...while I guess you better get on that and contribute eh?

Bazzite comes with a set of software packages designed for building your own flatpaks, so you will already be equipped to make your own right away. How to do that is beyond the scope of this article, but is well within the skills of a typical software tinkerer, as the flatpaks are defined via config files that are very readable to a normal person with enough curiosity to run some internet searches.

### Dual booting on a single drive

Immutable OS's like Bazzite, SteamOS, and Fedora Silverblue don't like sharing drives. If you're making this leap I'd advise NOT trying to dual boot off of one drive with split partitions but instead install other OS's on their own separate drives. Part of what makes the magic of immutable OS's work is a system where new partitions are created and destroyed to deploy new "trees" of the total operating system. When you run an update of the OS for example, a whole new stack of operating system code is built in one partition, and your old tree is kept in place for some amount of time. If the new tree is busted, you can jump back to the old one. This is part of what it means to not mutate the OS. But this dynamic partition allocation can wreak havoc on dual booted systems. So for the typical audience of this guide, don't do it.

### Nvidia stuff

Nvidia drivers have improved a lot in the last year in Linux. So much so I'd say you're unlikely to encounter an Nvidia specific issue as of this writing, save the screensharing issues I ran into [documented below](#screensharing--streaming-on-discord). If you just game, you're probably fine. Nvidia seems to be taking Linux more seriously so the future looks bright here. That said AMD has had open sourced drivers for ages now, so they come pre baked into Linux distros and as a result of being open sourced are better understood and optimized. If you have an all AMD system, Linux is 100% or you.

## Issues that I have hit (listed in order of annoyance)

### Screensharing / streaming on Discord

Related to [the section about Nvidia GPUs](#nvidia-stuff), screensharing and audio sharing over Discord were basically non functional with my RTX 3070. The was caused by a lack of implementation of a hardware encoding library that Nvidia uses on the part of Discord. Screenshares "worked" but the quality was abysmal and audio flaky. This is a fixable issue though, and one that is on the roadmap for Discord, so keep an eye on updates about Discord, Linux, and Nvidia software as the next year will likely show large improvements on that front. Some recent improvements are documented in [this video](https://www.youtube.com/watch?v=AV3OXSDGQP8), though the creator calls out that flatpak versions still have limitations around permissions, but these are fixable issues.

When I jumped to an AMD GPU things got instantly better but still a little flaky. The best combo I've found for now is to _not_ use the official Discord flatpak, but instead use the Vesktop flatpak. This is a third party client that has a bunch of cool customizations and features, one of them being improved screensharing options. Video and audio work great now and the main limiter on my video quality is now my crappy upload speed thanks. Thanks Comcast.

### OpenRGB

I have a few RGB accessories and light strips in my PC and I have not yet been able to control all of them with OpenRGB in Linux. This is interesting because OpenRGB had no issue on Windows so the problem is truly OS / Linux version specific. The application hangs part way through scanning all my RGB devices, seemingly because one of them doesn't send a response back that the software expects. The devices it _does_ scan work great though in terms of color control. If I solve this I'll make a whole post on it as I suspect it might actually require me to make code changes to OpenRGB in a different distro or possibly install some hardware control software for the components in question.

### Overclocking confusion

Im going to make a whole post on this next as it was a bit of a funny misadventure mostly caused by user error and some slightly unintuitive software UI (a classic open source problem). The short version is: use LACT, turn on "manual" clock speed control and make sure to click into the "Curve" tab in the "Thermals" window to turn on a real fan curve, as the default AMD drivers run the GPU in a very conservative state that doesn't fully use the GPU to its potential. Once you do that you should see full clock speeds and fan usage.

### Logitech mouse custom keymappings

I have a Logitech G502 mouse and one thing I immediately missed was application made by Logitech for managing shortcuts and settings on their hardware. AS of this writing there is no Linux version. I've been using Piper for now, and it works pretty well for my needs of controlling DPI and customizing some buttons but lacks media control shortcuts like pausing music or skipping tracks on clicking on of the extra keys on the G502. I'll keep exploring on this one and update this section if I find a better solution.

## The actual install steps

### ISO Flashing

This part at least is the same as installing Windows or MacOS on a system. Just like installing a fresh version of Windows, you'll need to create a bootable USB drive. I like to use either [Balena Etcher](https://etcher.balena.io) or [Rufus](https://rufus.ie/en/) for this. I previously did this with the built in feature in Windows Recovery but I'm unsure if it will let you create bootable USB drives of anything other than Windows ISOs.

To get your ISO go to the official [Bazzite page here](https://bazzite.gg) and click "Download" in the top right corner. For a KDE Bazzite experience that mimics Windows you'll want these options.

![alt text](assets/blog/moving-to-linux/bazzite-download.png)

If you want to boot straight into Steam Big Picture, select "Yes" on the last option about Steam Gaming Mode. If you hate it, you can always rebase to the tradition desktop experience. For me on AMD hardware I would run this command

```bash
rpm-ostree rebase ostree-unverified-registry:ghcr.io/ublue-os/bazzite:stable
```

to jump to the traditional desktop version. That download page will create example rebase commands for you, or you can follow [these docs](https://docs.bazzite.gg/Installing_and_Managing_Software/Updates_Rollbacks_and_Rebasing/rebase_guide/).

Once you've decided on a version, download the ISO, flash it to a drive with your chosen ISO flasher, then plug it into your computer and boot into your BIOS. Once there you'll select the USB drive to boot off of.

I would add instructions of what options to select when installing but they were so straight forward and quick I literally don't remember what they were. The experience is as easy or easier than Windows, so if you've installed Windows off an ISO I believe in you. This isn't Arch and doesn't require deep hardware / software knowledge to get it bootable.

Eventually you will land in your fresh new desktop after logging in as the default admin user. My one piece of advice here is to create a new user for yourself with admin level permissions via "System Settings" -> "Users", log in as that one, and then delete the default admin user. Welcome to Linux!

## Installing software in Bazzite

Installing software in immutable Linux is much more consistent and predictable than Windows once you know where to look. There's no `.exe` files to find on a plethora of websites, some more reputable than the next. Your main source of software until you venture out more will be a website called [Flathub](https://flathub.org/en). From here you can find software like LACT, and either download it via the web UI right there, or copy the command in the upper right corner here to get a command you will run in the terminal. Speaking of which...

### The terminal

Control C in the terminal

### Flatpaks



```bash
flatpak install flathub
```

```bash
flatpak run
```



### rpmostree

An alternative to using `flatpak` is to layer it in yourself using `rpmostree`.

### ujust



### `man` pages



## Controllers and bluethooth

Xbox Elite controller.



## Things I have LOVED


### Games just work

Cyberpunk 2077, Helldivers 2, Factorio, Expedition 33, Nier: Automata, the various S.T.A.L.K.E.R games, have all literally just worked and have been more stable than they were on Windows for me. This is largely the result of the [Proton](https://www.protondb.com) compatibility layer built up by the open source software community and integrated into Steam by Valve, more than studios actually making Linux versions of their games.

### KDE in general

I mentioned this above, but KDE feels like Windows should have become. The search bar actually functions. It's customizable. It's clean. A love letter to good right click menus. It doesn't hold you files hostage in the cloud via OneDrive. Wonderful.

### ytDownload

https://flathub.org/en/apps/io.github.aandrew_me.ytdn

### image upsaler

### It actually stays asleep

I've never had a Windows install that stays asleep. It's either my mouse, microphone, some software, ghosts, or something else that wakes the system to the point where I no longer trust sleep mode on Windows. Not so on Linux. It works.

### All the things I don't have to disable or futz with

Not having to make registry edits to rip out OneDrive and Co Pilot is therapeutic.

## More reading, resources, and articles I recommend

"Year of the Linux Desktop" has been a running meme in the same way that "fusion power has been 20 years away for 60 years", but we may finally be there according [this PC Gamer article](https://www.pcgamer.com/software/linux/im-brave-enough-to-say-it-linux-is-good-now-and-if-you-want-to-feel-like-you-actually-own-your-pc-make-2026-the-year-of-linux-on-your-desktop/) and I think I agree.

### Linux Basics for Hacker

[This book](https://nostarch.com/linux-basics-hackers-2nd-edition) can be a little cringey in a "l33t master hacker" sort of way, but it's none the less a fantastic intro to Linux. I love the mentality of learning a thing by breaking it, and if that describes your learning style this might be for you too. It teaches using Kali Linux, which is a rather unique distro aimed at cyber sec experts.

### How Linux Works

[A deeper and more thorough dive](https://nostarch.com/howlinuxworks3) into all things Linux. I've not read this book fully front to back, but jumped to sections of interest as I needed them and found it incredibly helpful.

### Google Gemini

As much as I dislike "I asked ChatGPT" style problem solving, there are times when you don't even know enough to know what questions to ask to solve your problem. A sort of "learning cliff of ignorance" thats very hard to get over. Gemini is a great tool in this situation, especially when you request it to provide additional links and documentation. Asking it to break down cryptic error messages and stack traces can be very helpful as it can teach you how to work through these problems so you don't need it in the future.

### Reddit

There are some [great Linux communities](https://www.reddit.com/r/linux/wiki/index/) on Reddit, and I've generally found users on Reddit to be _less_ prickly to basic questions than those on the various Exchange forums.
