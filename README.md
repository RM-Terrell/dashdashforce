# dashdashforce

## Common commands

### dev build

```bash
npm run dev
```

More commands stored in "scripts" section of the `package.json` file.

## Usage tips

### Starting a post

Blank post header meta data template:

```markdown
---
title: "<>"
excerpt: "<>"
coverImage: "/assets/blog/<>"
date: "<>"
tags: [<>]
photo_credit: "<>"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/<>"
---
```

### Image links

Example:

```markdown
![powersh](/assets/blog/powershell-to-bash/bash.png)
```

Notice the lack of "public" at the start of the path. Not needed for images to work in the final app build, but sadly md previews in vscode are broken because of that so its expected when those don't work.

### Footer

I deleted the footer because I didn't want it, but if that changes look at the initial commit and implementation of `footer.tsx` for how to set one up easily.

### Date Times

Full date time example format (the z indicates UTC)

```markdown
2021-05-16T05:35:07.322Z
```

## To build

- [ ] Fix bottom spacing on about page
- [ ] Fix code formatting on mobile and add syntax highlighting
- [ ] > Quote blocks are rendered a bit too subtle. make it more distinct
- [ ] Make use of post "tags" data to show a few related posts at the end of an individual post that has those same matching tags
