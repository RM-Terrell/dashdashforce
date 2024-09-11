---
title: "How to setup the VSCode python unit test extension in subsystem linux"
excerpt: "PYTHONPATH my old nemesis we meet again."
coverImage: "/assets/blog/vscode-python-ubuntu-setup/lights.JPG"
date: "2023-01-18"
tags: [python, testing, vscode, linux, windows]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/vscode-python-ubuntu-setup/lights.JPG"
---

A small configuration tip that will hopefully help someone out there. Or probably me in a few months when I forget how to do this. Do you have Subsystem Linux? Are you using VSCode? Are you working on a Python projects with unit tests? Are you getting an annoying error like this when trying to use VSCode's Testing extension?

```bash
> /usr/bin/python3 ~/.vscode-server/extensions/ms-python.python-2022.20.2/pythonFiles/testing_tools/unittest_discovery.py ./maze_runner *_test.py
cwd: .
[ERROR 2023-0-18 17:14:12.643]: Error discovering unittest tests:
 Failed to import test module: maze_runner_test
Traceback (most recent call last):
  File "/usr/lib/python3.10/unittest/loader.py", line 436, in _find_test_path
    module = self._get_module_from_name(name)
  File "/usr/lib/python3.10/unittest/loader.py", line 377, in _get_module_from_name
    __import__(name)
  File "/home/rm_terrell/GitLab_Repos/maze-reed-terrell/maze_runner/maze_runner_test.py", line 4, in <module>
    from maze_runner import maze_runner
ImportError: cannot import name 'maze_runner' from 'maze_runner' (/home/rm_terrell/GitLab_Repos/maze-reed-terrell/maze_runner/maze_runner.py)
```

I may have a fix for you.

## PYTHONPATH strikes again

PYTHONPATH my old nemesis we meet again. The root of this is the `ImportError: cannot import` error which is being caused by VSCode not understanding the path to your valid Python code. In my case my code was structured like this

![folders](/assets/blog/vscode-python-ubuntu-setup/folders.png)

Where the code being tested is sitting in that `maze_runner` directory. Even with a valid `__init__.py` file in place, and _the code itself actually running just fine when ran as part of its larger app_, the Testing extension in VSCode was showing this

![error](/assets/blog/vscode-python-ubuntu-setup/test_error.png)

With the full stack trace from the beginning of the article showing in the Output tab of the console.

## The fix

Turns out this is very easy to solve once you know where the relevant options are. There are two steps.

One: After trying to configure unit tests for the project via the Testing extension you'll have a folder in the root of your project called `.vscode` and in it you'll find a `settings.json` file. Open it and it'll look something like this.

```json
{
    "python.testing.unittestArgs": [
        "-v",
        "-s",
        "./maze_runner",
        "-p",
        "*_test.py"
    ],
    "python.testing.pytestEnabled": false,
    "python.testing.unittestEnabled": true
}
```

At the end of the json object you'll need to add a line that tells VSCode where to find a `.env` file where we'll put the new PYTHONPATH. The final file will look like this

```json
{
    "python.testing.unittestArgs": [
        "-v",
        "-s",
        "./maze_runner",
        "-p",
        "*_test.py"
    ],
    "python.testing.pytestEnabled": false,
    "python.testing.unittestEnabled": true,
    "python.envFile": "${workspaceFolder}/.env"
}
```

Two: Then create a `.env` file in the root of the project and add something like this to it

```.env
PYTHONPATH=./maze_runner:${PYTHONPATH}
```

Now in my case the code in question lives in `/maze_runner`. For you that will be different so change the file path there to whatever it needs to be. After that you should be set! Go back to the testing and you should now see a list of all your tests like this.

![working](/assets/blog/vscode-python-ubuntu-setup/working.png)

If you go into one of your test files now you should also see a little extra UI element inline with the test function name in the form of a green play arrow symbol, green checkmark, or red X depending on the the state of your tests. Something like this.

![check](/assets/blog/vscode-python-ubuntu-setup/check.png)

Happy testing!
