---
title: "How to see hidden files and folders in the MacOS popup Finder"
excerpt: "Oh come on you silly Mac, the folder is right here."
coverImage: "/assets/blog/macos-hidden-files/path.jpg"
date: "2021-10-21"
tags: [MacOS, Kubernetes]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/macos-hidden-files/path.jpg"
---

"Oh come on you silly Mac, the folder is right here."

A quick MacOS usage tip here. The other day I was setting up VSCode to view my local Kubernetes cluster for use with the official K8s extension, and by default minikube puts the config in a location like `Users/user_name/.kube/config`. Note the `.` in `.kube`. When you setup that extension and point it at a kubeconfig file of some sort, it opens a little popup version of the Finder tool, and when I navigated into the `Users/user_name/` directory of course VSCode couldn't see the `/kube` directory.

Now normally MacOS actually has a setting in the Finder preferences to make hidden folders and files visible, however being on a new Macbook I hadn't set that up yet. Also having that on all the time can make the Finder tool a little....cluttered, when just using it to hunt down that custom emoji you want to upload to Slack. Turns out theres a slick shortcut to quickly toggle on seeing hidden items that works really well for this pop up view.

While clicked into the Finder window, just type

<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd>

and BAM hidden files. Super slick for when you just want to quickly see that one pesky `.config` file or something.

Happy hunting.
