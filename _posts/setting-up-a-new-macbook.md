---
title: "Setting up a new macOS machine for development"
excerpt: "Please don't break any of these things in the future Apple I beg you."
coverImage: "/assets/blog/setting-up-a-new-macbook/krem-mountains.JPG"
date: "2023-04-13"
tags: [macos, git, vscode]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/setting-up-a-new-macbook/krem-mountains.JPG"
---

I recently started a new position at Yes Energy and with a new job comes a new laptop. This being one of the tasks done so infrequently that it never really gets memorized properly, I'm writing down how I got the thing working the way I want to save future me a lot of annoyance. And maybe you if you are similarly obsessive around mouse controls on a Mac. I have a slight preference towards macOS machines for software work but that doesn't mean they're perfect out of the box.

## The absolute essentials

### Homebrew

Homebrew is going to power many of the installs ran below so start with that. Install info and docs can be found [here](https://brew.sh/) or just run

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### VSCode

```bash
brew install --cask visual-studio-code
```

Once VSCode is running there's one more step to make it so it can be launched from the command line and also used to edit files that VIM would usually be used for, docs on this found [here](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line).

### Git

```bash
brew install git
```

To set user name and email run the following with the email and name values swapped in

```bash
git config --global user.email "email-here"
git config --global user.name "name-here"
```

To set VSCode as the default git text editor run

```bash
git config --global core.editor "code --wait"
```

### Docker

```bash
brew install docker
```

### Firefox

```bash
brew install --cask firefox
```

### Spotify

```bash
brew install --cask spotify
```

## The small things

### Control customizations

I'm weird when it comes to touchpads and mice. I find the normal behavior of a touchpad on a Mac very intuitive and don't need it changed at all BUT the default scroll direction and accelerated cursor when using a mouse drives me insane. Luckily there are two useful utilities that allow for eliminating mouse acceleration and allowing really detailed scroll control for multiple devices. Some of this used to be doable via terminal commands but those no longer seem to stick on Ventura. Thanks for that Apple.

### Linear Mouse

```bash
brew install --cask linearmouse
```

Then once its running, set its options to "run on login".

### Scroll Reverser

```bash
brew install --cask scroll-reverser
```

Then once its running, also set its options to "run on login". Sure would be nice if the OS just had these options built in.

### ZSA firmware flasher

I'm currently using a ZSA Moonlander keyboard which can be flashed with customized firmware. The customization tool can be found [here](https://www.zsa.io/oryx/) and the flasher [here](https://www.zsa.io/wally).

### Preventing F11 from doing that silly nonsense with your desktop

By default in Ventura when you hit F11 it shows your desktop and will do so overriding any local applications use of F11. If you use an editor or software that makes use of this key that is profoundly annoying. To prevent this go to

> Preferences -> Desktop and Dock -> Shortcuts -> Show Desktop

and then select the option for

> Set to "-"

and then your F11 key will return to its usual functionality.

### Preventing network disconnects on screen lock

This "feature" of macOS drives me insane. Most work I've ever done requires a VPN connection (currently working with VSCode Dev Containers so literally all of it now) and whenever you screen lock on a Mac your VPN will disconnect. This is understandable for sleep mode but not lock screens in my opinion. Here's how to fix it.

In a terminal run:

```bash
ifconfig | grep -B 7 'status: active' | head -n 1 | cut -d : -f 1
```

This will give a port number for your current network connection we're going to use in a later step. Its the thing we want to keep open.

Then run

```bash
cd /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources
```

This path was correct for macOS 13 Ventura but may obviously change a bit in the future. Some Google-foo required if thats the case. Then run

```bash
sudo ./airport NETWORK-EN-NUMBER prefs DisconnectOnLogout=NO
sudo pmset -a sleep 0  
```

With `NETWORK-EN-NUMBER` being that port number we got at the beginning. After that you should be set although a system restart may be required to make it stick.

Please don't break any of these things in the future Apple I beg you.

Happy hacking.
