---
title: "Me vs Docker Round 1: Nothing is as easy as it looks."
excerpt: "Turns out you need to actually COPY your project code into the container for it to work."
coverImage: "/assets/blog/docker-part-1/floyen.jpg"
date: "2020-05-29"
tags: [docker, react, django, python, javascript, project orbital]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/docker-part-1/floyen.jpg"
---

What follows are my attempts to Dockerize an old application I wrote and in the process totally rewriting it. Those of you experienced in Docker may find yourself yelling at your monitor, laughing or crying at my misunderstandings, maybe a bit of both. You've been warned. This isn't going to be pretty. But hopefully from my struggles someone out there may learning something, get some fresh perspective on newbie misunderstandings of Docker, or at least get a good laugh. Lets roll.

## The Application

First some background. Please skip this section if you want to get right to me face-rolling some Dockerfiles. The application in question lives in [this repo](https://github.com/RM-Terrell/project-orbital) and is, in a way the oldest application I've written though its gone through many revisions.

At my previous job I worked as a Data Analyst, and during this time was self teaching myself JavaScript and web development in general. The other Analysts there had a lot of math they needed to do on a regular basis and as these things go we didn't yet have a standardized way of doing this math, which lead to slight inconsistencies in our results. Things like converting standard error to standard deviation and such and even with the same process of calculation, simple human error can result in inconsistencies. So I decided to solve this problem with my new found skills. I made a very _very_ simple webpage that contained input fields where an analyst could place starting values, click a button, and get results. All converted by JavaScript calculations that were vetted by our lead statistician. It was a dreadful little webpage that I improved a lot over the months, and eventually years as it has continued to be the app that I use to learn new stuff with. It was also the app that lead the COO of that company to ask me "hey wanna get paid for that some day?" and helped launch my career.

The application had a year or so prior to this post evolved from a simple pure HTML / JS page to being a Django backend that served a React powered front end. I think at one point it was even a hare brained Electron app. I'd wanted to learn React and show off some of my new found Python / Django skills I had since acquired at my new job. The app was a little odd however, in that I had opted to not use the famous Create React App (CRA) repo to build and run the React side of things, but had instead rolled a different solution from someones blog post I'd since lost. It used Webpack and Babel, to take the relevant JS, CSS, and HTML code, build it all in a bundle, and then this static bundle was loaded by a Django extension called Webpack Loader, which used Django to ultimately serve it to the user in a template. That last detail is important, and I didn't fully understand it at the time which caused significant confusion later on.

Fast forwarding to present, and I'd decided I need to learn Docker. I'd completed the first few sections of Pluralsight's Docker path, read a few articles and even looked over some Dockerized apps at my current job. Totally 100% prepared to get my hands dirty.

## The Initial Refactor

In my reading on Docker I had came across the `docker-compose` feature and the concept of splitting the backend of your application into one container, and the frontend into another. This allowed you to take down or put up the two separate from one another, scale them, switch one out for another, etc. That sounded seriously cool to me, and armed with no other good reason than that I went to work. Lesson learned in retrospect: "this sounds sweet" is not _always_ a good reason to do something.

First goal, split the frontend and backend code nicely into their own directories and make the app functional again, pre Docker. The thought of doing this even a year or two ago would have scared the crap out of me so the fact that I went at it with such zeal was a nice reminder I _had_ gotten better at all this.

The initial file structure looked like this.

![old_and_busted](/assets/blog/docker-part-1/original_file_struct.png)

So things were already part way there, with the `django_orbital` directory containing only backend Django code. The frontend related code however was sort of strewn about the root of the project. After copy pasting it all inside of a `frontend` directory, I went about changing Django settings paths for the static files, changing the path to the `index.html` file for the main URL, and any other code that referenced original locations. VScode's find / replace wound up being all I needed, looking for references to the old paths and changing them as I found them. The end result looked like this

![new_hotness](/assets/blog/docker-part-1/new_file_struct.png)

with the "django_orbital" directory renamed to be more general as "api" and the frontend nicely unified in one directory. You can see I also tossed in a `Dockerfile` in each directory, and a `docker-compose.yml` in the root, though they were empty at this point. And somehow I managed to do everything right in changing paths because the darn thing worked first try when building locally. Heres a look at the UIs old ugly mug in its newly refactored glory.

![powersh](/assets/blog/docker-part-1/old_ui.png)

## Docker Time

Now to actually build some Docker containers and compose them. Looking at the docs and also some other articles, I came up with my first drafts of the Dockerfiles. I didn't feel comfortable fully writing them from scratch yet as I was at that point learning wise were the pieces weren't really all in my head yet. Docker was not grokked. So I did what every good dev does when they're learning tech and copy pasted it off somewhere on Stack Overflow.

The Dockerfile for the `api` directory looked like this.

```Dockerfile
FROM python:3.8

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/api
COPY requirements.txt /app/api
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

The `frontend` directory:

```Dockerfile
FROM node

WORKDIR /app/frontend
COPY package.json /app/frontend

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
```

and finally the `docker-compose.yml`

```Dockerfile
version: '3'

services:
  db:
    image: postgres
    ports:
      - "5432:5432"
  django:
    build: ./api
    command: ["python", "manage.py", "runserver", "0.0.0.0:8000"]
    volumes:
      - ./api:/api/django_orbital
    ports:
      - "8000:8000"
    depends_on:
      - db
  frontend:
    build: ./frontend
    command: ["npm", "start"]
    volumes:
      - ./frontend:/app/frontend
      - node-modules:/app/frontend/node_modules
    ports:
      - "3000:3000"

volumes:
  node-modules
```

I tentatively fired up my first, non online course related

```bash
docker-compose build
```

....then did it again after I remembered to start Docker.

![awayyyyyyy_we_go](/assets/blog/docker-part-1/and_were_off.png)

And shockingly it built. However on running:

```bash
docker-compose up
```

I encountered the error:

```bash
python: can't open file 'manage.py': [Errno 2] No such file or directory
```

Turns out you need to actually _COPY_ your project code into the container for it to work. I had succeeded in making an empty Docker container. Nice work. Also no need for postgres in the container yet, also learned a fresh lesson on being consistent about naming directories. `django_orbital` != `api`.

Second pass Dockerfiles and compose file brought me much closer. After tweaking the Dockerfile for the `api` directory to look like this

```Dockerfile

FROM python:3.8

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/api
COPY requirements.txt /app/api
RUN pip install -r requirements.txt

COPY . /app/api/

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

the `up` command built the images and ran the containers with no more error about `manage.py` not being present. I wanted to verify all the code was there though with my own eyes and I remembered that these containers can be entered into like a VM and explored with a Docker command. VScode however makes this very easy with the Docker extension. When the container is running you can simply right click it and a drop down menu appears with the option to attach a shell, which drops you straight into the container using the built in terminal.

![attach_shell](/assets/blog/docker-part-1/attach_shell.png)

## What is a Container Anyways?

From there I was able to explore around the container and see all the code in it. I found the `app` directory and then all the api code.....but only the api code. No sign of the frontend contents. And sure enough on trying to navigate `localhost:8000` where the app was running I was presented with the error

```bash
django.template.exceptions.TemplateDoesNotExist: index.html
```

I then also realized (and you can see this in the above screenshot with the orange square representing a stopped state) that although the `api` container was running, the `frontend` one was not. When I ran the `up` command, the backend would start, the frontend would start, but then the frontend would exit with 0. To verify all was fine with the `api` container I was able to navigate to the `/admin` page for Django which worked perfectly. So I _had_ at least succeeded in Dockerizing the Django side of my app.

Eventually it dawned on me why it made sense I couldn't see the `frontend` code in the `api` container. They're different containers. Different things entirely. Duh. I had this idea in my head that somehow they would be magically built into one unified thing I could explore like a totally built VM. This brought me to more reading about what `compose` really did.

From there the dominos started to fall. Of course the `frontend` container ran, then exited. That's exactly what I had built the frontend code to do! On running the command `npm run start`, Webpack was called which built all the static files.....and that was it. So once that process ended the container exited with nothing else to do with itself. But why did it do that? Wait a minute, how does that built frontend code even get served by Django when I'm running this thing local? I had built a monster I didn't understand. I began googling source code and articles about React and Django apps and seeing some of the differences between what other people had built and what I had.

## Ghost of Christmas Past

In particular I had a URL in my Django URL's that fetched the `index.html` template on navigation to the home URL

### **`urls.py`**

```python
path('', TemplateView.as_view(template_name='index.html'))
```

and was using a tool called "Django Webpack Loader" to load all the static assets generated via Webpack, Babel, React, including CSS, into that template on load.

### **`settings.py`**

```python
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE_DIR, '../frontend/webpack-stats.json'),
    }
}
```

Suddenly it all made sense. The Django app running in the `api` container would be looking for the `/dist` folder with its static assets right there in the same file system, which of course didn't exist in the container. I had formed a very hard link between the frontend and backend, which was business as usual for me at my day job building Django, Jquery, Bootstrap apps. Had I chosen to Dockerize this thing as one container I would have avoided this issue entirely. I would need to find a way to either get those files over to the other container after building them (which sounds hilariously hacky), host the files on some port in the `frontend` container to be fetched (much less hacky and probably a good solution), or change how this worked entirely. There were a few solutions to these options I found, and I'm sure there may have some that required minimal modification to what I had built, but in the spirit of playing with new tech and fresh starts I decided to rebuild the React portion of my app with Create React App (CRA) to serve the UI on a port, do away with the "Django Webpack Loader" system, and use Django as a pure REST API backend.

## Nuke it from orbit

This solution had a few advantages. First it simplified the Django backend of my app down to just the REST API. This made Django a bit overkill for my current needs but whatever. I like Django and can grow into it. Maybe even get creative and swap it with Flask if I feel like it, and the same goes for the frontend. Since the two systems will communicate with REST API calls only, they can be interchanged more easily. Maybe I'll make a Vue system, containerize it and swap it. Why not? This severs the coupling created by the URL template load and Webpack Loader. Second it gets my hands dirty with CRA and gives me a really good chance to comb through my old code and improve it as I copy the old components over into CRA. Also I badly needed to update Django to a newer version due to an old vulnerability and more importantly because I like new shiny things. Django 3.0 coming in hot.

With that I put on my fireman suit and burned it all down. Again. I think this makes 4-5 times I've done that with this repo. The final project file structure looked like this:

![pretty](/assets/blog/docker-part-1/final_structure.png)

All cleanly named and nicely divided up, and the Dockerfiles were as follows:

Backend Dockerfile:

```Dockerfile
FROM python:3.8

WORKDIR /app/backend

COPY requirements.txt /app/backend
RUN pip install -r requirements.txt

COPY . /app/backend/

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

Frontend Dockerfile

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

Docker-compose file

```Dockerfile
version: "3.2"

services:
  backend:
    build: ./backend
    command: ["python", "manage.py", "runserver", "0.0.0.0:8000"]
    volumes:
      - ./backend:/app/backend
    ports:
      - "8000:8000"
    stdin_open: true
    tty: true
  frontend:
    build: ./frontend
    command: ["npm", "start"]
    stdin_open: true
    tty: true
    volumes:
      - './frontend:/app/frontend'
      - '/app/frontend/node_modules'
    ports:
      - "3001:3000"
    environment:
      - CHOKIDAR_USEPOLLING=true
```

After adding some pure hello-world code to the REST API to test it, a `build` and `up` command and CRA was running on port 3001, and the REST API on port 8000

![ITS_ALIVE](/assets/blog/docker-part-1/rest_lives.png)

![ITS_ALSO_ALIVE](/assets/blog/docker-part-1/react_lives.png)

One interesting note that I saw omitted in some blog posts, and people in comments pointed out. In order for CRA to keep running after its container launches you NEED the lines

```Dockerfile
    stdin_open: true
    tty: true
```

in the compose file. Without them the CRA container will exit, and the React app will not be served on the port.

And with that the pieces are in place. I have successfully Dockerized a Django REST API, a CRA React application, and strung them together with a compose file. What will follow next is copying back over all my React code, revising them, expanding the REST API functionality to inform the React frontend, and also optimizing the Dockerfiles.

Stay tuned for part 2, and may you have an easier time building your containers than I have had.

Thanks for reading.
