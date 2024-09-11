---
title: "Dividing a Git branch after opening a PR"
excerpt: "Maybe you forgot to create a new branch for the new features (not like I would ever do such a thing, no sir)..."
coverImage: "/assets/blog/dividing-git-branch/pct.jpg"
date: "2020-11-09"
tags: [git, github]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/dividing-git-branch/pct.jpg"
---

Lets say you're working on a new feature on a branch called `new_search_system` and you pull request (PR) the work you've done so far. The PR takes some time to be reviewed and in the mean time you get started on some other related features on the same branch locally. Maybe you forgot to create a new branch for the new features (not like I would ever do such a thing, no sir) or thought it would just be a quick small bit of work. Many commits later you have a significant amount of work done local on "new_search_system" that you don't want to include in the current PR, but your coworkers have reviewed your PR and theres some changes to be made. How do you cleanly save the work you've done local for later but also make the changes to the `new_search_system` branch? Stash changes and hope you don't forget they're stashed? Cherry pick commits? Rebase? (shudders). I've found the best way to handle this is with a quick branch rename and re-fetching your original.

Here's how it works.

With your code in review in a PR on `new_search_system`, and lots of further commits locally on the same branch, we save the work we've done with a branch rename. What actually happens here is that Git creates a new branch with the name you want and deletes the old one. Lets move the new work to `new_search_system_styling` (or whatever you want).

```bash
git branch -m new_search_system new_search_system_styling
```

This will take all your local work and put it in `new_search_system_styling`. If you do a `git branch` all your local branches will be listed and you will see `new_search_system` is missing, renamed to `new_search_system_styling`.

Now lets say the branch you PR'd is sitting on your Origin remote. To just fetch all your remote branches you can run:

```bash
git fetch --all
```

And all your remotes will be fetched. This is also safe for your new local branch because Git only updates local copies that also exist on the remote. It wont delete you new local branch or perform some other horror on it. You can also list all your remote branches with:

```bash
git branch -r
```

Or if you're a VSCode user just click on the Git symbol in the very bottom left of the UI and all your branches will be shown via a dropdown.

If you have an absurd number of remotes you don't want brought down, you can narrow it down with:

```bash
git fetch origin/new_search_system
```

and then run a `git branch` once again to confirm `new_search_system` is now sitting local on your system. You can now switch to `new_search_system` with:

```bash
git checkout new_search_system
```

or the previously mentioned VSCode UI button, and you should see `new_search_system`'s changes locally in the state they are in in your PR. Now changes can be made as usual and pushed back up to the PR with a `git push` as before. Once all that is done make sure to pull those changes into `new_search_system_styling` (or whatever your new branch is called) and your off!

Happy merging!
