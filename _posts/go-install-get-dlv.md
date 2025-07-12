---
title: "Setting up Golang debugging in a VS Code devcontainer"
excerpt: "GCC strikes again"
coverImage: "/assets/blog/go-install-get-dlv/dia.JPG"
date: "2025-07-12"
tags: [go, dlv, delv, vscode, docker, linux]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/go-install-get-dlv/dia.JPG"
---

A little while back I decided I wanted my own way to run and debug Golang code in a familiar method (local VS Code) to help with a few small projects I'm working on in Go, and also use a proof of concept platform at work. I spun up [a repo](https://github.com/RM-Terrell/go-scratch-pad) after I got code executing in a devcontainer but soon after realized debug breakpoints didn't work. A small but rather important detail considering the goal of the project. I quickly hit a few errors that felt work documenting for other gophers.

## Dockerfile and devcontainer.json files

My Dockerfile had a starting state like this

```Dockerfile
FROM debian:stable-slim

ARG GO_VERSION=1.23.0

RUN apt-get update && apt-get install -y \
    curl \
    git

RUN curl -fsSL https://golang.org/dl/go$GO_VERSION.linux-amd64.tar.gz | tar -C /usr/local -xz
ENV PATH="/usr/local/go/bin:${PATH}"
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces

CMD ["bash"]
```

and my devcontainer.json looked like this

```json
{
    "name": "Golang Scratch Pad",
    "build": {
        "dockerfile": "Dockerfile"
    },
    "features":{
        "ghcr.io/nils-geistmann/devcontainers-features/zsh:0": {
            "setLocale": true,
            "theme": "robbyrussell",
            "plugins": "git docker",
            "desiredLocale": "en_US.UTF-8 UTF-8"
        }
    },
    "workspaceFolder": "/workspaces/go-scratch-pad",
    "customizations": {
        "vscode": {
            "extensions": [
                "tamasfe.even-better-toml",
                "golang.Go",
                "DavidAnson.vscode-markdownlint",
                "streetsidesoftware.code-spell-checker",
                "streetsidesoftware.code-spell-checker-french",
                "streetsidesoftware.code-spell-checker-norwegian-bokmal",
                "aaron-bond.better-comments"
            ],
            "settings": {
                "go.gopath": "/go",
                "terminal.integrated.shell.linux": "zsh",
                "terminal.integrated.profiles.linux": {
                    "zsh": {
                        "path": "zsh"
                    }
                }
            }
        }
    },
    "forwardPorts": [3000],
    "postCreateCommand": "go version"
}
```

I was using VS Code (June 2025 release) with the official Go extension to enable debugging and other language support on version .48, with Docker Desktop. I was also doing all this on a Macbook Air with an M-series chip. That last tidbit is a hint, and if you can find the issue in my Dockerfile knowing that information you're far better at reading than I am.

## Guess I need dlv

Immediately I hit the following pop up error in VS Code when clicking on the "debug test" button over a unit test.

```console
The "dlv" command is not available. Run "go install -v github.com/go-delve/delve/cmd/dlv@latest" to install.
```

Upon looking up this error I found a few discussions suggesting the VS Code "Install" button right under that error isn't always reliable across all development environments so it's best to do it yourself. Turns out its probably more reliable than me.

## get vs install

A first small mistake was not understanding what `go get` does vs `go install` and falling victim to the old ["that's deprecated now"](https://go.dev/doc/go-get-install-deprecation). They're distinctly different now and slapping a `go get` in the final setup steps of my Dockerfile did _not_ work since I was trying to install an executable. Yes I know the error message had `go install` right in the suggestion. Yes I have the memory of a squirrel sometimes. I added the following to my Dockerfile in order to 1: setup the right PATH variables so that the new code could be ran from the CLI and my debugger and 2: install the libraries every time the container is built.

```Dockerfile

ENV GOPATH=/go
ENV GOBIN=${GOPATH}/bin
ENV CGO_ENABLED=1
ENV PATH=${GOBIN}:${GOPATH}/bin:/usr/local/go/bin:${PATH}

<rest of the Dockerfile>

RUN go install golang.org/x/tools/gopls@latest \
    && go install honnef.co/go/tools/cmd/staticcheck@latest \
    && go install github.com/go-delve/delve/cmd/dlv@latest

<rest of the Dockerfile>
```

`gopls` and `staticcheck` are two other libraries needed to fully build code and debug it. Fun fact with this command deprecation, AI tools will sometimes lie to you about what `go get` does due to the history of how the command has changed, thus demonstrating the importance of knowing how to read in 2025.

A neat Go feature though is its built in CLI help documentation. To see docs for this situation run

```bash
go help get
go help install
```

And you'll get the correct version specific info right from the source:

> In earlier versions of Go, 'go get' was used to build and install packages.
Now, 'go get' is dedicated to adjusting dependencies in go.mod. 'go install'
may be used to build and install commands instead. When a version is specified,
'go install' runs in module-aware mode and ignores the go.mod file in the
current directory.

## Typos

It's `dlv` not `delv`.

![words](/assets/blog/go-install-get-dlv/words.jpeg)

## New errors

Upon trying to build the container with the new libraries being installed I got the following error:

```bash
14.70 cgo: C compiler "gcc" not found: exec: "gcc": executable file not found in $PATH
```

Although Go itself doesn't require C, the dlv library uses it to recompile code with debugging options This wound up being an easy fix via the build-essential library

```Dockerfile
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential
```

## arm64 vs amd64

Now up until this point all had been compiling and running as expected except for the debugger. As I said earlier though _I was running Docker and the devcontainer on a Macbook Air with an M2 chip._ And due to an errant copy paste I was installing the `amd64` version of Go by accident, when I needed the `arm64` version. I need to get my eyes checked it seems.

```bash
11.87 go: downloading github.com/google/go-cmp v0.6.0
17.39 # runtime/cgo
17.39 gcc: error: unrecognized command-line option '-m64'
------
[2025-07-04T16:14:17.759Z] ERROR: failed to build: failed to solve: process "/bin/sh -c go install golang.org/x/tools/gopls@latest && go install honnef.co/go/tools/cmd/staticcheck@latest && go install github.com/go-delve/delve/cmd/dlv@latest" did not complete successfully: exit code: 1
```

What's amazing about this was that code itself compiled and ran until this point inside the container via `go build` and `go run`, which is a testament to how good the automatic compilation abilities of Go is, and it took until I tried to debug code and use `build-essential` tools that I actually hit an issue as I was running an incompatible versions.

As a result

```Dockerfile
RUN curl -fsSL "https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz" | tar -C /usr/local -xz
```

became

```Dockerfile
RUN curl -fsSL "https://golang.org/dl/go${GO_VERSION}.linux-arm64.tar.gz" | tar -C /usr/local -xz
```

along with a

```Dockerfile
ENV CGO_ENABLED=1
```

and BOOM. We have a working debugger.

![it_works](/assets/blog/go-install-get-dlv/it_works.png)

The final Dockerfile looked like this after I also added a default non root user:

```Dockerfile
FROM debian:stable-slim

ARG GO_VERSION=1.23.0

ENV GOPATH=/go
ENV GOBIN=${GOPATH}/bin
ENV CGO_ENABLED=1
ENV PATH=${GOBIN}:${GOPATH}/bin:/usr/local/go/bin:${PATH}

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential

RUN curl -fsSL "https://golang.org/dl/go${GO_VERSION}.linux-arm64.tar.gz" | tar -C /usr/local -xz

RUN go install golang.org/x/tools/gopls@latest \
    && go install honnef.co/go/tools/cmd/staticcheck@latest \
    && go install github.com/go-delve/delve/cmd/dlv@latest

RUN useradd -ms /bin/bash vscode
USER vscode

WORKDIR /workspaces

CMD ["bash"]
```

Happy debugging.
