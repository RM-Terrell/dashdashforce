---
title: "Hacking Python sys.path"
excerpt: "PYTHONPATH my old nemesis, we meet yet again."
coverImage: "assets/blog/hacking_sys_path/railing.JPG"
date: "2025-3-11"
tags: [python, docker, vscode]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "assets/blog/hacking_sys_path/railing.JPG"
---

I did something silly with Python at work that seemed worth documenting for future desperate times. If you find yourself needing to mess with PYTHONPATH inside Python scripts because you can't change the existing Python virtualenv, this is your post. God help you.

My company uses Liquibase to do database deployments and we've started to integrate into more of its features. Liquibase has an _awesome_ feature called Custom Policy Checks that lets you write SQL code linting rules in Python and then run them against changesets. Side note: This feature is so cool it killed my custom rust based sql linter project that I built to solve this exact problem in our code base. Pour one out.

I tried setting the system up using [their Docker container](https://hub.docker.com/r/liquibase/liquibase) as a VS Code devcontainer base image and ran into some interesting issues and solutions. The below solution to my issue I generalized out the tool and library names in the code to not be Liquibase specific as it works for any situation where you have to modify PYTHONPATH at runtime. If I come up with a better solution, or Liquibase changes something in the container making this unneeded I'll update this post at the end.

## The setup

The project setup involved a standard `devcontainer.json` and `Dockerfile` that was based off a Docker container that came pre-baked with Liquibase tools linked above. As a result, right after firing up the container I could run

```bash
liquibase --help
```

inside it and see it was already configured and ready to roll. Far better than manually installing it all myself, or so I thought. However the container was missing one of Liquibase's other Python libraries I needed too, so to install it programmatically I added the install step to the `devcontainer.json` file.

```json
{
    ...
    "postCreateCommand":"pip3 install extra_python_library"
}
```

I then setup a python file that used `extra_python_library` with my code, and organized it so that liquibase could see and run it. So the whole flow was: liquibase -> runs my custom python code -> runs the extra library. Upon running `liquibase` (I'll call this this `third_party_tool` from now on to keep it general) and hoping to see it work with `extra_python_library` I got the following:

```bash
ModuleNotFoundError: No module named 'extra_python_library' line: 4
```

With line 4 being the normal import statement for the library, and with VS Code showing all was fine with no linting errors. Command clicking (VS Code shortcut to jump to definition) the import in the python code showed that at least VS Code understood the location of the library but clearly not the actual tooling running the script.

From there I tried seeing what _was_ in the PYTHONPATH when ran.

`script_file.py`
```python
import sys
print(sys.path)
print(sys.executable)
```

This output the following first clue.

```bash
['/graalpy_vfs/proj', '/graalpy_vfs/home/lib-python/3', '/graalpy_vfs/home/lib-graalpython/modules', '/graalpy_vfs/venv/lib/python3.11/site-packages']

/graalpy_vfs/venv/bin/python
```

My first thought was "what the hell is a graal?" and shout-out to Gemini 2.0 for teaching me about Graal and pointing me to links to learn more about it. Turns out `third_party_tool` uses Graal to run its Java code and then run Python code. With its own virtualenv I figured all I needed to do was activate the thing like any other virtualenv and modify the PYTHONPATH with the right code path, then find a way to do that in an automated fashion on container setup. In this case however it would seem that the tooling for activating and working with the Graal virtualenv was stripped out or disabled as all documented ways of working with it failed, and I was not even able to find _where_ in the container linux system the virtualenv was located via the usual techniques. `whereis` however would return the executable for liquibase as expected.

...but what if I just changed it myself during script runtime? I mean _I_ know where the code is.

Time for some good old fashion hackery.

## The fix

### Project directory

The first step was to confirm the location of my project directory and make sure its mount location was enshrined somehow and unlikely to change without throwing a red flag in PR review, because a change there would blow up the whole path manipulation thing in the future. Within `devcontainer.json` I setup the following location for my whole project (not just the python code, all sql code with the python code sitting in the root)

`devcontainer.json`
```json
{

"workspaceFolder": "/lib/project_name/",
"workspaceMount": "source=${localWorkspaceFolder},target=/lib/project_name,type=bind",

}
```

Now I knew one of the paths I needed to add to PYTHONPATH, because not only was the third party library not going to be visible to the graal vm, neither would any imported modules within my project. Another side note: Liquibase's' ability to see any scripts at all and run them is based on a config file where you give it the location of your custom policy checks. This is why it could at least see my basic scripts but nothing else.

### PATH manipulation

The next location I needed was the library that threw the error from earlier. Fortunately VS Code was able to directly help me with that one by jumping to definition of the library code and observing the file path which was at `/usr/local/python/current/lib/python3.12/site-packages/` in my case. `find` also confirmed this. This one will vary a bit depending on how exactly python is setup in your container and thus how `pip` installs packages.

With that info I could modify my script to have these paths before the imports even ran.

`custom_policy_check.py`
```python
import sys

PROJECT_DIR = "/lib/project_name"
# This fixes the issue of the whole project not being in the PYTHONPATH
if PROJECT_DIR not in sys.path:
    sys.path.insert(0, PROJECT_DIR)

# This fixes the issue of the third party library not being in the PYTHONPATH
EXTRA_PYTHON_LIBRARY_PATH = "/usr/local/python/current/lib/python3.12/site-packages/"

try:
    from extra_python_library import utility
    print("extra_python_library found locally")
except ModuleNotFoundError:
    print("extra_python_library not found locally, adding to path")
    if EXTRA_PYTHON_LIBRARY_PATH not in sys.path:
        sys.path.insert(0, EXTRA_PYTHON_LIBRARY_PATH)
    try:
        from extra_python_library import utility
        print("extra_python_library successfully loaded into PYTHONPATH after initial failure")
    except ModuleNotFoundError:
        print("loading of extra_python_library into PYTHONPATH failed")
        sys.exit(1)

from extra_python_library import utility
from project import project_code


# rest of the script....
```

And with that running `liquibase`, it ran my custom python code without any import errors and the custom policy checks completed.

## Factoring it out

Now this whole thing is a little gross looking, and in my case I had 4 different python files that needed to be separate files and thus would needed 4 instances of this same path hackery. As a result I factored out the following code

```python
# This fixes the issue of the third party library not being in the PYTHONPATH
EXTRA_PYTHON_LIBRARY_PATH = "/usr/local/python/current/lib/python3.12/site-packages/"

try:
    from extra_python_library import utility
    print("extra_python_library found locally")
except ModuleNotFoundError:
    print("extra_python_library not found locally, adding to path")
    if EXTRA_PYTHON_LIBRARY_PATH not in sys.path:
        sys.path.insert(0, EXTRA_PYTHON_LIBRARY_PATH)
    try:
        from extra_python_library import utility
        print("extra_python_library successfully loaded into PYTHONPATH after initial failure")
    except ModuleNotFoundError:
        print("loading of extra_python_library into PYTHONPATH failed")
        sys.exit(1)
```

into its own file called `setup_extra_python_library_path.py` located in a directory called `utils`, and the imported it right after the part adding the project path to PYTHONPATH like so:

`custom_policy_check.py`
```python
import sys

PROJECT_DIR = "/lib/project_name"
# This fixes the issue of the whole project not being in the PYTHONPATH
if PROJECT_DIR not in sys.path:
    sys.path.insert(0, PROJECT_DIR)

# This fixes the issue of the third party library not being in the PYTHONPATH
EXTRA_PYTHON_LIBRARY_PATH = "/usr/local/python/current/lib/python3.12/site-packages/"

from project import utils.setup_extra_python_library_path

from extra_python_library import utility
from project import project_code
```

The part that handles the whole project path I was not able to factor into its own file because once its placed in its own file and imported, that _requires the project module path to by on the PYTHONPATH in order for the import to work_ and thus the factoring out caused it to fail. So as a result all my python scripts have to have that at the top of them.

## Final thoughts

I'm not a huge fan of such indirect solutions and would much rather programmatically add the paths on container setup and will continue to investigate such a solution. In the meantime this solution gets the policy checks working, and I wrote up an ADR doc on _why_ I did this that will hopefully add context and understanding to the next poor soul who wonders why we're modifying paths on the fly. Probably me in 6 months lets be real here.

The entire thing was worth the effort just for a comment from one of my fellow engineers

> Wow thats amazing and I hate it.

Happy hacking.
