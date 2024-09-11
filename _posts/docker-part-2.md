---
title: "Me vs Docker Round 2: Optimizing Dockerfiles"
excerpt: "Another layer bites the dust."
coverImage: "/assets/blog/docker-part-2/long_lake.jpg"
date: "2020-06-05"
tags: [docker, react, django, python, javascript, project orbital]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/docker-part-2/long_lake.jpg"
---

In the interest of making a solid foundation for my app I made some passes at optimizing my Dockerfiles and splitting out dev dependencies. I also finally wrapped my head around how a `/` effects a Dockerfiles `COPY` function, which had previously confused me.

## Dockerfile RUN Optimizations

An interesting concept I came across while reading and working through Pluralsights Docker course is that every single `RUN` command (and I think every command in general) in the Dockerfile creates its own layer with its own resulting contents from that command. These layers are then connected together to create the final image. This can have some initially unintuitive effects with regards to final image size.

A rather practical example of this would be as follows. Lets say you were basing a container off of a debian image. Upon creating the image `FROM debian` you wished to run an update of that debian system and install `wget`. But at the end of that you know it would be good practice to remove update files that would be in `apt/lists` directory post update, thus keeping the image only as large as it needs to be to be functional. You may come up with something like this:

```Dockerfile
FROM debian
RUN apt-get update
RUN apt-get install -y wget
RUN rm -rf /var/lib/apt/lists/*
```

And that should clean things up nicely right? No quite. While the resulting final file system of the image will indeed have the `apt/lists` files removed, there will still be an image deeper in that contains all those `/lists/` files. This is because _every single individual run command creates a layer_. And that layer is part of the final image. They are additive.

As a result, the first `RUN` command creates an image of about 9mb, the second one installing `wget` creates one that is about 40mb, and the final `RUN` command that deletes the contents of the `/list/` dir is 0mb, for an overall image size of around 50mb.

Instead this can all be achieved in a single `RUN` command, that updates, adds, and removes file all in one go. This results in less layers to maintain, and a smaller overall image.

```Dockerfile
FROM debian
RUN apt-get update && \
    apt-get install -y wget && \
    rm -rf /var/lib/apt/lists/*
```

The overall image size will now be only 40mb and a single layer.

## The Frontend Dockerfile

I took this new found knowledge and looked to see if I had any groups of commands that could be optimized. Though I did not have any situations (yet) removing unneeded files that were sneakily creating excess layers and bloating overall image size, I did have a situation where I could reduce the overall number of layers.

The Dockerfile for my `/frontend/` dir looked like this previously:

```Dockerfile
FROM node:13.12.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install react-scripts@3.4.1 -g

COPY . ./

CMD ["npm", "start"]
```

See those two back to back `RUN` commands? They were able to be rewritten as a single `RUN` command like so:

```Dockerfile
RUN npm install && \
    npm install react-scripts@3.4.1 -g
```

I really like setting up precedents like this in my code because it serves a good reminder down the road for me to follow these kinds of practices. Did this refactor make a _huge_ difference? Absolutely not. It removed 1 layer. Overall image size was unchanged which I conformed to myself by using the `docker history` command to observe the build history of the Frontend image.

Heres the old image history with two `RUN` commands:

![two_layers](/assets/blog/docker-part-2/two_layers.png)

The two `npm install` commands create two layers, 167mb and 203mb respectively for a total between them of 370mb. And heres the result of the refactor to one `RUN` command:

![one_layer](/assets/blog/docker-part-2/one_layer.png)

One layer, 370mb.

But inevitably this Dockerfile will get more stuff some day, and having run commands already chained like that really idiot proofs it against future me.

Another small layer reduction could be done by reducing the number of `COPY` commands. Because I seem to be allergic to reading instructions first, I first tried to unify my `COPY` commands the same way I did the `RUN` commands like so:

```Dockerfile
COPY package.json ./ &&\
    package-lock.json ./
```

Yeah that didn't work.

```bash
ERROR: Service 'frontend' failed to build: COPY failed: stat /var/lib/docker/tmp/docker-builder932974682/&&: no such file or directory
```

`COPY` commands to the same location are unified like this:

```Dockerfile
COPY package.json package-lock.json ./
```

Another layer bites the dust. Worth noting is that if files need to be copied to multiple different locations in the image, multiple `COPY` instructions will be needed. No way around that.

Another small optimization to my Dockerfile was changing my install command to:

```bash
npm install --production
```

Which since I had been so far good about installing JavaScript dependencies like eslint that are only needed for development by using the `--save-dev` flag, this tells npm to only install the packages needed for production. Thus further reduced the size of my resulting image, and reduced build time a bit. A drop in the npm ocean but hey, I'll take it.

However. The word "production" got the gears turning in my head, which is usually dangerous. I remember looking at console outputs for the react app and seeing warnings about "not running an optimized production build" or something along those lines. Sure enough in the CRA documentation I found [this](https://create-react-app.dev/docs/deployment/) article about how to build an optimized copy of the source code and serve it using the `serve` library. After testing this locally and confirming it works I took the dive on getting it working in Docker. The file then looked like this:

```Dockerfile
FROM node:13.12.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./

RUN npm install --production && \
    npm install react-scripts@3.4.1 -g && \
    npm install serv

COPY . ./

RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]
```

There were some things that could still be improved here, like reordering some copy and run commands to unify layers, but the build worked, and my full optimized code was now served on the port instead of the development build. I also suspected I would now be able to `rm -rf` all my old source code, just leaving the `/build/` directory in place, but that all sounded adventurous enough to save for a later time. Progress.

## The Backend Dockerfile

Speaking of dependencies, could I remove dev dependencies for the backend side of things? The Django app had very few dev dependencies but there were two, `pycodestyle` and `pylint` which I was using in conjunction with VScode to lint my Python code. To solve this I split up my dependencies into two files in a new directory called `/dependencies/` like so:

![deps](/assets/blog/docker-part-2/deps.png)

With the contents of the `dev.txt` file being just

```txt
pycodestyle==2.6.0
pylint==2.5.2
```

The `prod.txt` file containing all the rest. Then in my Dockerfile for the backend I simply changed my `RUN` command for installing dependencies to:

```Dockerfile
RUN pip install -r requirements/prod.txt
```

This removed two dependencies from the final Docker image and sets a nice precedent for the future while developing. The only wrinkle being if I want to set this up for local dev on another machine I need to run a `pip install` against both files now.

## The COPY Command and Trailing Slashes

Whether a copy command ended with a `/` or not had vexed me previously. Looking at other peoples Dockerfiles I saw times when it was there, and times when it wasn't and hadn't been able to decern why at a glance. It turns out the `COPY` command is based on the GO languages `filepath.Match()` function.

```Dockerfile
COPY source_code /destination
```

will copy a file _or_ or a directory named `source_code` and rename it as `/destination`. The leading `/` indicating an absolute path.

```Dockerfile
COPY source_code /destination/
```

indicates that `destination` is a directory. This means that a file named `source_code` will be placed in a directory named `destination`. For example `source_code.txt` will land in the image as `/destination/source_code.txt`. However, if `source_code` is a directory, it will be copied into the image and renamed as `/destination`. NOT copied _into_ a directory like `/destination/source_code/` which I had previously misunderstood.

To copy a lot of things you can use a command like

```Dockerfile
COPY path/source_code* /destination/
```

which will copy all files or directories located on that path, to the directory `/destination`.

```Dockerfile
COPY source_code destination
```

will copy a file or directory named `source_code` as `destination`, located relative (instead of absolute) to the previous WORKDIR instruction.

Guess I should learn GO eh?

Thank you for reading! Part 3 will contain some actually React and UI building I promise.
