---
title: "The Scorched Earth Guide to Adding React 16 to Django"
excerpt: "I hate greenfield guides."
coverImage: "/assets/blog/react-django/royal_arch.jpg"
date: "2020-09-04"
tags: [react, javascript, django, webpack, babel, jest]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/react-django/royal_arch.jpg"
---

I hate greenfield guides. I really do. I know I know, how else are you going to teach the basics without confusing things unnecessarily? But I work in an industry, and at a company with many long running projects that we'd love to drag into the future without resorting to the nuclear solution of "sorry boss, gotta rebuild it from the ground up". Things need to be done in a practical manner that balance dev desire for shiny things that don't suck to work on, with projects that work _now_ and bring value to the company. In my case, we have a long running Django app whose UI is becoming increasingly complex and has outgrown the limitations of its current technologies. On top of that, its running an old version of Django with significant reasons not to update right this second, all inside a CentOS6 VM. Needless to say, I don't need any more "How to Setup React Using Create React App" guides.

Lets take count of what I've got to work with.

- Outdated Django backend? Check.
- No JavaScript tests? Check.
- Needs to be implemented gradually without full page rewrites? Check.
- Centos6? .....sadly...yes. Check.
- Needs to work both with and without an internet connection? (sigh) Check.
- Jquery. _VERY_ check.

Lots of existing and sometimes differing standards for HTML / JS code organization? You better believe it.

This isn't greenfield, hell it isn't even brownfield. Welcome to The Scorched Earth Guide to Adding React 16 to Django.

## A little background before we start

Skip to [this section](#initial-installs) if you just want the `install` commands to slam jam into your terminal.

This post documents a part of a dream project (for me) I got to do at my work. As I said, the project in question leans on Django with jQuery / Bootstrap / jQuery DataTables for its UI. Old school script links, downloaded minified source code (without NPM) and everything. We're starting to hit the limits of that pretty hard as we are redesigning many of our pages and they are becoming much more dynamic and modular. New solutions are needed. I got tasked with prototyping out a new webpage in both React and Vue.js for the purpose of then having the other people on my team look at the diffs, my notes, compare them, and make a choice on which we would choose as our defacto UI library going forward. We have a few people with React experience, and no one with Vue experience, and I had fiddled with both before and knew enough to be dangerous. So I took it on. There will be another part to this next, largely the same but documenting the Vue version.

The project was running Django 1.10, Centos6 running in a VM _or_ cloud, some outdated version of Postgres, and had only just recently had node.js / NPM installed on the OS of the system as part of adding SASS (the css system) to it. So this would be the first _big_ flex of using NPM for everything javascript. The project needed to be able to run with and without internet connections so using those nifty React CDN `<script>` tags you see in a lot of React guides was out of the question. It needed to be able to build once (with an internet connection) then be severed from the net and still work, so a full build pipeline using webpack, babel, etc was in order. At the same time just downloading the contents of those CDNs once and stashing it in a `/static/` folder somewhere just felt gross and lazy. NPM's systems for detecting and reporting security vulnerabilities and outdated / broken dependencies is a god send, and on the version of this project running in the cloud where it could be updated by us, we would want to make full use of that. I'd dealt with updating downloaded, minified jQuery one time too many to want to do that for something as large as React.

I sort of lied when I said it had no JavaScript tests. It had one. In QUnit. That was ran and was parsed with Selenium. I may or may not have written that.....part of this project would involve burying my past mistakes with that in a _deep_ grave. Jest here we come.

## Goals

The main systems to be added were the following:

- React
- Webpack
- Babel
- Jest

Along with anything else they need to work. For those who arn't familiar with these technologies, or are just getting started with them here's a short summary.

### React

React is a JavaScript library developed by Facebook and used to give developers a _whole_ lot of power for manipulating the DOM of a webpage. It does so in a manner that allows a dev to take elements of a page, and divide them up into "components" (from here on out written capitalized as "Component" to avoid confusion) written in `.js` files. These Components follow a very OOP like approach to website development and treat each website element as an encapsulated element. The Component file can contain all the styles, methods, HTML code, etc needed for it, and can have more data passed into it by its parent rendering Component via a system called "props" or dynamically updated and re-renderd via a system called "state". It utilizes a very unique syntax called JSX to let you write HTML inside a `.js` file alongside / inside of your methods for your Components. While other UI frameworks try to make HTML smart with unique inline commands, React flips that and just adds dumb HTML to already smart JavaScript code.

React uses a Virtual DOM to asses changes to the website and then only re-render the parts of the page that _need_ to be re-rendered. This results in some pretty massive performance improvements over hacking away at the DOM with jQuery methods like a drunk samurai. There are countless courses, guides, articles, video, etc on React for learning. Official docs [here](https://reactjs.org/docs/getting-started.html).

### Webpack

Webpack takes all your JavaScript, CSS, images, and other static assets and provides a very powerful api for packaging them up into bundles for use by the browser. It posses features for code splitting, cache busting, and other nifty performance tricks. It is needed for React as part of the build process of assembling the invalid JSX syntax that would throw syntax errors if ran in the browser, and packaging it all up into something that actually runs. It also makes use of the `import` / `export` syntax for some of its performance features and dependency trees. Official docs [here](https://webpack.js.org/concepts/).

### Babel

Babel is a tool used for taking new, cutting edge JavaScript code, and transforming it into something that either old or just poorly updated browsers like Safari, can actually run. In our case it also handles the job of transforming JSX syntax into valid JavaScript code, which Webpack bundles up. Official docs [here](https://babeljs.io/docs/en/).

### Jest

Jest is a test runner also developed by Facebook. It will handle the job of running our unit and integration tests, and also supports snapshot testing. Snapshot testing is probably the thing I am most excited about (as of this writing I don't believe any other JS test runner does it), because it bridges the gap between integration tests, and full on end to end tests. It allows you, for example, to take a snapshot of how a rendered component looks in the DOM, save that rendered result as a file in source control, then run automated tests against that "orbiter of truth" snapshot to see if something has unexpectedly changed in how a component renders. Official docs [here](https://jestjs.io/docs/en/getting-started).

## Onwards

First priority, get some silly "Hello World" thing rendering on a page in the running project to prove it can be done. I found a few great blog posts that really helped me understand the scope of the mess I was getting into. Shout out to these writers:

[Doug Mackenzie's post on multi page React apps](https://medium.com/@dougmacknz/how-to-integrate-react-into-an-existing-multi-page-app-b727c2483ec4)

[Sonny Recio's post on React in a .NET MVC app](https://reciosonny.com/how-to-integrate-reactjs-in-existing-asp-net-mvc-app)

I liked these posts in particular because I would not be building a full on Single Page App (SPA), but a hybrid app with SPA like components of various webpages.

## Initial Installs

First up, React, Webpack, and Babel installs. These commands were all ran inside the VM in the projects main directory, and if you want more info on the packages they can be looked up on NPM's website.

```bash
npm install react react-dom --save

npm install webpack webpack-cli --save-dev
```

`react` and `react-dom` were both needed for the actual React library. `webpack` and `webpack-cli` were both needed for 1: running Webpack at all, and 2: using it via a CLI interface with its full tool set.

Next up Babel.

```bash
npm install @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
```

These are a bit less readable. `@babel/core` is well...the core of Babel. Need that. `babel-loader` is utilized by Webpack to hook the two together, it will make an appearance in our webpack config file shortly. `@babel/preset-env` and `@babel/preset-react` are both configs for Babel to do its thing when packing up JSX syntax and related React things into valid JavaScript code.

## Configs

Now that everything is downloaded into our `node_modules` folder we need to do something useful with them.

### package.json

To handle the process of running the Webpack build I decided to lean on my `package.json` file's `scripts` section. Once all was said and done it looked something like this:

```json
{
  "name": "project_name",
  "version": "1.0.0",
  "private": "true",
  "license": "UNLICENSED",
  "description": "npm packages for the project",
  "author": "rm-terrell",
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
  },
  "scripts": {
    "build": "webpack --config=webpack.config.js",
  },
  "devDependencies": {
    "@babel/core": "^7.11.1",
    "@babel/preset-env": "^7.11.0",
    "@babel/preset-react": "^7.10.4",
    "babel-loader": "^8.1.0",
    "jest": "^26.4.0",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12"
  }
}
```

In the `scripts` section I added a command called `build`. This is ran via the console command `npm run build`. In general, `npm run` is how you run anything in the scripts section followed by the name of the script you added. This command calls the (not yet existing) `webpack.config.js` file. Once that is called, Webpack will launch and do its thing according to the rules in its config. You could name this command whatever you want, the important part is that the `webpack --config=webpack.config.js`, which should always start with `webpack` to invoke the CLI, followed by the path to the config, wherever you put it.

### webpack.config.js

Next I created the `webpack.config.js` file. The contents of which I blatantly stole from other posts on the internet about React build systems.

```javascript
const path = require('path');

module.exports = {
    entry: {
        index: './static/js/component/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        filename: '[name].js',
    },
    mode: 'development',
    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader',
                },
                test: /\.js$/,
                exclude: /node_modules/,
            },
        ],
    },
};
```

Few things going on here. The section with:

```javascript
    entry: {
        index: './static/js/index.js',
    },
```

was probably the most confusing to me coming from a land of `<script>` imported JS files in HTML. It defines the starting point for webpack to use to begin its build. In my case this represented the root file containing the `.render()` function for React that imports (or defines) the highest level component and renders it (that'll make more sense when you see the actual React code). You can have a single, or many points of entry in a webpack build. If you have some root `.js` file that builds out all the components of your app (a true SPA probably) use that. In my case there would eventually be many entry points, representing many builds of many components for many pages. Google around about "webpack entry point" for more info on this. Its a complex topic.

The section containing

```javascript
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        filename: '[name].js',
    },
```

defines the output of the build process. This does not have to be explicitly created by you, Webpack will make it if it doesn't exist. The output after a build contained the built files, which I eventually linked in my `.html` file for the React component to load. More on that shortly.

To make use of `babel-loader` from earlier we do the following

```javascript
    use: {
        loader: 'babel-loader',
    },
```

Make sure to set `mode` for the build setting. Switch to `production` for the final build which will be highly optimized, but harder to debug.

### .babelrc

To set up the config for Babel I created the following `.babelrc` file. Once again dashingly pilfered from somewhere on the internet.

```json
{
  "presets": [
    "@babel/preset-react",
    "@babel/preset-env"
  ],
  "plugins": [
  ]
}
```

Pretty straight forward. The `presets` do the job of linking up those packages by the same name we installed earlier. There are many many options that can be set up here in order to make it work with different browsers. You can set this to only work with the newest Chrome, or try to make it compatible with ancient relics like IE6. Consult their docs for the full list of options. For this demo I went simple and didn't bother, however this bit me later when I tried to use `.fetch()`. More on that later and how I fixed it.

## HTML and React code

At this point I still hadn't actually ran any build commands yet. But it _seemed_ like everything was in place. On to real code.

In the `.html` code that would hold my "Hello World" component I deleted all the HTML and Django template syntax I would ultimately be replacing with React. This HTML file had already been set up to be served by a Django view on a predetermined URL. It had a few bits of boilerplate Django template code that loaded things like a navbar and footer. But besides those templates, what I was left with was the following:

```html
    <div id="root"></div>
    <script src="{% static 'dist/index.js' %}"></script>
```

As is, this resulted in an empty webpage (sans the template loaded items), an empty `<div>` with an id of "root", and a 404 error about not finding the script. No worries, I hadn't written it yet or built the final version with Webpack. On the second line you see a linked `.js` file. That file would be the final built version from Webpack, but I still needed to write the entry point `.js` file for Webpack to use. This would be built along the path I had defined in the `webpack.config.js` for `entry`, in this case `/static/js/index.js`. That file ended up like this:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <div>Hello world!</div>;

ReactDOM.render(<App />, document.getElementById('root'));

```

...could that be it? Is this actually going to work? An `npm run build` command confirmed that I had a green build, and a file had been built into the `/static/dist/` directory as I wanted. Navigating to the webpage however I had no "Hello World" and one of these in my browser console

```bash
GEThttp://URL_TO_MY_SERVER/static/dist/index.js
[HTTP/1.1 404 Not Found 4ms]
```

Odd. The file is there. What do you mean you can't find it?? Look harder.

Well it turns out the Django app uses Django's `collectstatic` system which snorts through the file structure and collects together all the static files and serves them on a URL. Remember this from a few lines up?

```html
    <script src="{% static 'dist/index.js' %}"></script>
```

The `{ static .... }` thing is a generated URL that comes from Django that links to files from the static host URL. I patted myself on the back for inadvertently using a core system without knowing it. Copy paste can kill. After running our command for `collectstatic` it worked!! I had my first running React component in the project along side a whole bunch of prexisting Django / jQuery / Bootstrap code. Firing up the React devtools confirmed that React was being detected and I could inspect my very simple component using those tools.

## Jest Setup

The last item was to get Jest in place and running. Like I said before, this app had no real JS tested to speak of so it was time to fix that. I deleted the unused QUnit files like a bad Christmas gift from that relative who doesn't really know you that well.

For this section I'll spare you the details of my fiddling, the packages I needed were

```bash
npm i -D jest babel-jest react-test-renderer @testing-library/react
```

`jest` should be pretty obvious. It's the test runner. `@testing-library/react` was what I decided to use for testing fine grain functionality and rendering behavior of React components (Jest can't do this on its own, its just a test runner and basic assertion library) and the other two packages were needed to tie the pieces together to get tests running with my build system. Enzyme is another React testing library worth looking into if you are doing this too.

I also added a new script to my `package.json` file for running tests

```json
"scripts": {
    "build": "webpack --config=webpack.config.js",
    "test": "jest"
}
```

This allowed me to run tests with just `npm run test`. For examples on test file layout and syntax take a look at the docs for Jest and React Testing Library. Those two systems have an incredible amount of features and utility.

For my demo, I decided to put all my tests in a `/tests/` directory, and named each file after the name of the Component they were testing. For example `Filter.test.js`. The `.test.js` part is required for Jest to pick the file up as a testing file and run it. Heres an example of a very simple test I wrote that just checks for a `<button>` to be rendered with a text value of "Search" from a React Component called Filter.

```javascript
import React from 'react';
import { render, cleanup } from '@testing-library/react';

import Filter from '../react_components/tableFilter';

afterEach(cleanup);

test('Given the Filter component, verify it renders to the DOM with the correct button text', () => {
    const wrapper = render(<Filter name="Search" />);
    expect(wrapper.getByText('Search').tagName).toBe('BUTTON');
});
```

Interestingly a few other tweaks were needed. Later into development after I had built a good portion of the page and was trying to test a React component that used `.fetch()`, I was greeted with this mildly cryptic error

```bash
 ReferenceError: regeneratorRuntime is not defined
```

Neat. After some googling it turns out this is due to how methods like `.fetch()` are handled when trying to make the tests run in node.js (which as of this writing doesn't have `.fetch()`). There are many solutions to this. Turns out one easy on is to use Babel to transpile the code before testing into an implementation without `.fetch()`. I followed the advice of Wes Bos in [this Github thread](https://github.com/parcel-bundler/parcel/issues/871#issuecomment-452778385) and slammed in a `browserslist` value (in my `package.json` file) of the release data of ES6. This same `browserlist` option could also be added to the `.babelrc` file I created too, albeit with slightly different syntax for the different file format. It works in either place.

 My final `package.json` file looked like this:

```json
{
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
  },
  "scripts": {
    "build": "webpack --config=webpack.config.js",
    "test": "jest"
  },
  "browserslist": [
    "since 2017-06"
  ],
  "devDependencies": {
    "babel-jest": "^26.3.0",
    "react-test-renderer": "^16.13.1",
    "@babel/core": "^7.11.1",
    "@babel/preset-env": "^7.11.0",
    "@babel/preset-react": "^7.10.4",
    "@testing-library/react": "^10.4.8",
    "babel-loader": "^8.1.0",
    "jest": "^26.4.0",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12"
  }
}
```

And with that I was set. I had React building and running components in one of our webpages along side our existing UI which could now gradually be expanded and / or replaced with React. I had Jest tests running against them, and all under the management of NPM. When I redeployed the code to a test server instead of my VM, it even worked on the first try. I love it when things just work.

## Passing data from Django to React

After getting into building the demo page, I ran into an issue that most everyone who has a view/controller rendered template, and doesn't have a Node.js backend encounters. How do I pass my view/controller (I'm going to stick with Django terminology from now on out and call it a "view") template data to the React frontend? To illustrate the issue here's a pretty standard Django view sending a string to the template via Django's template tag system.

The view which is tied to the URL

```python
def welcome_view(request):
    """
    View for welcoming a user.
    :param HttpRequest request:
    :return: HttpResponse
    """
    return render(request, 'views/welcome.html', {"user_name": request.user.name})
```

and its template HTML file `welcome.html`

```html
<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
</head>

<body>
  <div>
    Welcome to this demo site, {{ user_name }}!
  </div>
</body>
</html>
```

In this example the user info is pulled from the request, and sent to the front end template so that the end result would output the user name dynamically based on log in. I realize there are ways this could all be refactored to not need the back end call at all but lets roll with it as an example because sometimes you 100% need data from the backend.

The problem here, is that since React runs entirely in JavaScript files, the `{{ }}` or `{% %}` syntax for grabbing Django data can't be used in Javascript. Only HTML files loaded by the view, or inline scripts _in_ those HTML files. So how do we build this page in React while still making use of the Django variable?

In newer versions of Django there is a template tag purpose built for this called `json_script`, its docs can be found [here](https://docs.djangoproject.com/en/3.1/ref/templates/builtins/#json-script). It takes data from your backend view, and safely parses it into a JSON object which can then be directly accessed by any JavaScript code on that page. This seems like a solid standardized approach, but of course the version of Django I was using didn't have it. I'm also not 100% a fan of this personally because it adds an odd, somewhat ambiguous layer of abstraction between the front and backend. Some people may call this good because "oh man but what are you going to do when you want to swap out your frontend every other weekend??" Yeah I work at a company that has been using jQuery for longer than I've been coding. I'd rather it be clear and easy to work with. With `json_script`, your data from the view gets parsed into a JSON object you don't really write and just have to know is there in the final render. I could see this being very confusing to newer programmers on the team or just people who've never seen the code before. Or me in 6 months. It also confuses the hell out of ESLINT and VScode.

A slightly more explicit (but still more layered than I like) solution that I ultimately went with for the demo and may stick with long term for reasons I get into in a bit, is accessing the Django variables with an inline HTML script, declaring them, and then using them in the JavaScript files. The view code is unchanged, and the HTML code ends up like this

```html
<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
</head>

<body>
    <div id="root"></div>
</body>
<script>
  let userName = "{{ user_name }}";
</script>
<script src="{% static 'dist/index.js' %}"></script>
</html>
```

and then the React component would look something like this

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <div>Welcome to this demo site, {userName}!</div>;

ReactDOM.render(<App />, document.getElementById('root'));
```

This works because since we declared the variable `userName` inside the HTML file in an inline script which places it high enough scope wise to be accessible by the loaded `index.js` file.

I still find this solution sub optimal because, once again, we have a fuzzy layer between the back and frontend. The JS variable is declared with a Django variable as its value and then..... who knows? Its not clear what is happening with it unless you search the whole code base and see it being used in a React component. Pray you don't also reuse JS variable names to add to the confusion.

The best solution would involve running the `ReactDOM.render()` method _inside the HTML file_, accessing the Django variable right there in the render method, and passing the value in as a prop. Direct and self documenting. This has a few tricky bits though that have so far prevented me from getting it working, and may involve confusing enough syntax and script links to not be worth it. It would look something like this

```html
<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
</head>

<body>
    <div id="root"></div>
</body>
<script  src='A LINK PATH SOMEHOW IMPORTING THE APP COMPONENT'></script>
<script  src='A LINK PATH SOMEHOW IMPORTING REACT AND REACTDOM'></script>
<script>
  ReactDOM.render(
    React.createElement(App, {userName: '{{userName}}'}, null),
    document.getElementById('root')
    );
</script>
</html>
```

A few things happening here. First off the `.render()` function looks _very_ different. That is because inside HTML you can't use JSX syntax. That's invalid JS that gets transformed by Babel remember? Well Babel isn't set up to extract inline scripts, and when it does transform our JS files, this is what it gets turned into. JSX-less React. Docs on that [here](https://reactjs.org/docs/react-without-jsx.html). You still have all the features of React, just not in as pretty of a syntax.

Also with this solution the code in `index.js` is gone since that only had the `.render()` method. Its link is gone too. The issue to tackle here is how to then get React, ReactDOM, and the `<App>` component in the HTML file. I can't use `import` commands because those don't work in HTML (not as of this writing), so I'd need to `<script>` link that code somehow without creating new problems like fragile paths.

I think this is the most explicit and clear solution though, if possible. The Django variable is accessed and passed as prop all in one place, its usage is clear and understandable. No cases of "wait why do we have this declared here?" or "Where the hell did this variable come from???". It also scopes the variable to the component(s) that it is needed in. Whether this is the long term solution will be a matter of if I can get those script links working without creating more confusion and fragile code. I will update this post if I find a good solution.

Next up, Vue.js.

May you tend a green garden of code in whatever scorched landscape you find yourself.
