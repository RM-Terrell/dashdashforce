---
title: "Git diff to AI tools workflow for change review"
excerpt: "Bender helps with a PR review"
coverImage: "/assets/blog/diff_to_ai/DSCF0671.JPG"
date: "2024-11-06"
tags: [git, ai, co-pilot]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/diff_to_ai/DSCF0671.JPG"
---

Inspired by some coworkers troubles with `git` (SQL / DBA wizards who are seeing it for the first time with new dev processes at my company) I've been writing an entire intro course to source control targeted towards engineers who need to dive into doing practical work right away using `git` and need to know enough fundamentals to not be totally lost but also not buried under all options that your average `git` command has tha they'll never use. Unsurprisingly, teaching is once again proving to be the most effective way for me to REALLY learn something. The new found power of the `diff` command has crossed over into new AI tools in a useful way via generating diff outputs and feeding them to a local LLM as part of code review that I feel every engineer show know about.

**Automating your entire code review process with LLMs seems like a bad idea so please don't do that.** Machines based on the average open source programmer that can't be held responsible shouldn't be the sole decision maker for changes coming into your code base. That said, I've found it useful to treat current AI systems as a sort of "second pair of eyes" when doing change reviews, especially for really complex diffs around SQL queries and functions with a lot of logic gates. I see these tools as a natural extension of things like performance profilers, Intellisense, static analysis, compiler warnings, and other tools that offload knowledge and process from an engineers brain but need to be understood as a whole by said engineer brain. Each on their down doesn't _quite_ tell the whole story of an application or system, but combined they are truly powerful tools.

## Change summaries

Assuming you're using an LLM of some kind that you're fine with running against your source code (something like paid Co-Pilot or a local LLM) here's how you can lean on `git` to feed data into said system. Calling it now that Atlassian and GitHub will soon charge money for doing this right in PR's if they haven't started doing it already.

Lets say a coworker puts up a PR on a branch `FEATURE-3387` and there's a file in there called `scr/complicated.py` with a disastrously complex diff as part of their PR. An SQL query change, data parsing algorithm work, etc and you'd like to double check for any unexpected behavior. Hopefully you have a unit test suite on it, but for extra scrutiny do the following:

1. In your local repo `checkout` branch `FEATURE-3387`.

2. Run

    ```bash
    git diff master...HEAD -- scr/complicated.py > diff.txt
    ```

    Or if you want to work in a detached head state use:

    ```bash
    git diff master...$(git branch --show-current) -- scr/complicated.py > diff.txt
    ```

3. Take the `diff.txt` file and either copy-paste its contents into a chat window or attach it (VS Code Co-Pilot Chat has an option to attach many files into a chat context for analysis) and ask for a summary of changes. I find a simple summary request with no red herring assumptions like "find bad things in this file" yields the most useful results and I've seen Co-Pilot reliably pick up redundant blocks or possibly missed error handling in code. It caught my failure to update a comment after a variable rename once.

You can modify the `diff` command to generate a diff for all files by removing the path specification, or provide a branch name other than `HEAD` if you don't want to use the currently checked out branch as your relative comparison to `master`. Or you can even target the changes between two commit hashes on the same branch instead should a change introduce a bug that is mysterious in its origins and you want to explore it using this workflow.

## TDD gone plaid

I've also found this `diff` to LLM flow to be useful for quickly developing either unit test changes based on code changes, or code changes based on unit test changes. Using the TDD approach the workflow is something like this:

1. Develop new unit tests / unit test changes that meet some new desired code spec.

2. Generate a diff file for those changes.

3. Attach the diff file and the targeted source code that the tests assert against into a chat context and request an updated version of the code per the specs of the unit tests.

4. Move the code suggestion into the file and run the tests against it. If you have confidence in your own test suite and a full compilation / run time assessment passes, begin a more detailed review and refactor of the generated code. If your LLM has a feature for long term improvement, pass those refactor updates into to preserve that code improvement in the model for future work.

## The robot side kick

This whole flow really does start to feel like science fiction when it works. _When it works_. I've had the results go anywhere from "coding with Bender from Futurama" to "Data from Star Trek" so as usual treat the generated code with skepticism like you would any Stack Overflow post and elevate the importance of good test suites even higher in your organizations hierarchy of needs, because development is about to get a whole more fast and iterative with these systems in hand of your engineers.

May your code reviews be fast, accurate, and thorough.
