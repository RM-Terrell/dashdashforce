---
title: "Finding a changed string in Git history"
excerpt: "Down the Git documentation rabbit hole..."
coverImage: "/assets/blog/changed-strings-in-git/flatirons.jpg"
date: "2020-05-20"
tags: [git, scss, css, html]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/changed-strings-in-git/flatirons.jpg"
---

"I swear this css rule must have been used for something. Where did its HTML code go?" A question that lead me to a cool Git feature I didn't know existed. `git log -S`.

While investigating some styling issues on one of my companies webpages I came across some CSS code that contained _exactly the rules to fix the problem I was trying to solve_ but yet were tied to a div id that simply didn't exist in the code base at that moment. Suspicious.

The page in question contained a fairly complex input form. It was dynamic and SPA like in nature and contained a table that would list out files to be uploaded. And its commit history in just the last month was significant as it contained a feature being actively developed, making just scrolling through the commits a bit of a slog. The HTML code looked something like this:

```HTML
<form id="input-form">
  <div id="outer-wrapper-form">
    <div id="form-inputs">
    ... Lots of inputs and checkboxes
    </div>
    <div id="input-files">
      <table id="misbehaving-table">
      ... table contents
      </table>
    </div>
  </div>
</form>
```

And sure enough in our SCSS code there were a set of rules for `misbehaving-table` that looked like they should fix the problem...but weren't applying. These rules were nested in a larger specifier rule for a div that didn't exist, kind of like this:

```scss
#div-that-didnt-exist {
    //some other rules
    #misbehaving-table {
        // rules that would fix it
    }
}
```

So what happened to `#div-that-didnt-exist`? Besides inferring that it was a wrapper around `#misbehaving-table` how else was it set up? Any other children? When did it get deleted / changed? How long has this been broken?

Down the Git documentation rabbit hole I went.

What I found was this really cool command `log -S` that allows you to search for a particular string of characters that changed somewhere between commits in the history of a repo.

```bash
git log -S<string>
```

So in my case I ran:

```bash
git log -Sdiv_that_didnt_exist
```

And up came a list of commits that involved changes with that exact div id in them and no other commits. Right away I was able to find the commit hash where it was deleted. From there I could see what the HTML code looked like before and was able to reconstruct the page to a working state.

A working example of its output can be seen here where I am running a search for changes involving the string "nav_bar" in one of my old side projects:

![git](/assets/blog/changed-strings-in-git/git_log_s.png)

Happy Git history searching!
