---
title: "Rendering React components directly in Django HTML templates."
excerpt: "'The Dream' when I first set up React with Django was to do the obvious."
coverImage: "/assets/blog/react-in-django-templates/bergen.jpg"
date: "2021-08-12"
tags: [react, javascript, django, webpack]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/react-in-django-templates/bergen.jpg"
---

## The Ghost of Solutions Past

In my "Scorched Earth Guide to Adding React 16 to Django" one of the sticking points was how to effectively pass data from the Django templates to React. Django's template syntax is a very handy way to move data from the backend to the fronted of an application with few intermediate layers, and in legacy Django apps built on jQuery, Bootstrap, etc, their usage tends to be quite prolific. As such when gradually upgrading to using React (or similar UI library) the issue of how to get template variables (which have to be accessed in HTML files, not JS ones) can rear its ugly head a lot. My initial solution using an intermediate JavaScript file worked well enough but as time has gone on an even more direct approach was needed.

In this post I'm going to document something I was unable to find explained how to do in any other article or Stack Overflow post I could find. How do you render React components _directly inside Django template HTML files_ without the need for external CDNs or intermediate JavaScript files? Maybe I just suck at Googling. Maybe not. This solution uses Webpack build options, static file directories, a create file copy, and script linking, and as such should also work with other backend systems like Rails, ASP .NET, or PHP. Lets get crackin.

Note: the first few sections will be background on the first solution and its issues, which may or may not be interesting to you. If you want to go straight to the new implementation jump to the [Direct Rendering](#direct-rendering) section.

## Context

"The Dream" when I first set up React with Django was to do the obvious. Have a template with existing stuff in it, have an inline script, `ReactDOM.render()` the component I want in that page (in the context of usually replacing or augmenting some existing jQuery / Django template thing), and let it roll. The first problem was, you of course can't just call `ReactDOM.render()` in the template without the React library actually being loaded. When I tried looking for how to do _that_ the main solution I found was to use a CDN link like `<script scr="https://unpkg.com/react@16.13.1/umd/react.development.js"/>` in the template.

This was not a feasible solution for a couple of reasons. First off it duplicates the versioning of React from the existing installs setup per the `package.json` file and installed in `node_modules`. It also means an internet connection is needed, which the app doesn't always have. It also just means trusting the CDN will always be up, which I'd rather not do. The CDN solution is great for quick additions of React or experimentation but IMO not great for real production. I'm sure someone will give me heat for that but whatever.

The other option was of course to use `import` and import in `react` and `react-dom` which works beautifully inside actual `.js` files. All loaded up and optimized via Webpack or a similar tool. This becomes more difficult in an inline script inside an HTML file which is the only place I can use Django's template syntax to get backend data. `import` statements are just starting to become a thing in-browser but their support is not great _yet_ and I wasn't sure how good I felt about relying on such a new feature. This app does genomics / cancer diagnostic work for researchers. We have little tolerance for things that might be finicky based on browser version or type in this app.

## The Problem With Intermediates

As such I went with a solution that many many articles recommended and I think still works well in a lot of cases. You build out your React component in `.js` files, then make an intermediate `.js` file that `import`s it and targets some HTML `id` in your desired template, build that JS file as entry point file in webpack, then `<script src=>` link it in your template.

The HTML looks something like this:

```html
    {% block content %}
        <div id="target-html-element-for-react"></div>
        <script>
            let variableToBeUsedByReactAsProp = "{{ django_template_thing }}";
        </script>

        <script src="{% static 'dist/intermediateParentComponentWrapper.js' %}"></script>

    {% endblock %}
```

And the intermediate JS file something like this:

```javascript
    import React from 'react';
    import ReactDOM from 'react-dom';

    import ParentComponent from './ParentComponent';

    ReactDOM.render(
        <ParentComponent
            requiredProp={variableToBeUsedByReactAsProp}
        />, document.getElementById('target-html-element-for-react'));
```

Then the webpack file grabs it as an entry, and dumps the build into the static hosted directory. So your `webpack.config.js` will look something like this sans your `mode` settings and anything else:

```javascript
const path = require('path');

module.exports = {
    entry: {
        intermediateParentComponentWrapper: './react_components/intermediateParentComponentWrapper.js',
    },
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        filename: '[name].js',
    },
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

This works pretty well. Especially with components that don't have too many props, or at least can have unique variables set in the inline script to prevent name collisions or race conditions on updating them if a section of the page is being rendered by some template syntax. But there in lies some issues. When you're working in one JS file, or many JS files with imports and exports, your editor can yell at you about variables already being declared, variables not being declared, scope issues, etc. But when all these variables are set in disparate HTML files that don't know about each other until run time? Strange things can happen without you noticing right away.

In particular, things get real weird when you have a bit of template logic that is iterating a collection, and you want to use a React component within part of the HTML that gets generated. In that situation you have one React component being rendered many times, with all those intermediate variables getting declared and updated many times. It gets pretty gross to keep track of and insidious bugs can creep in.

And of course theres just the sheer number of variables this creates. We had one component with 14 props. That means 14 different variables declared in the HTML and not obviously used until later. Thats a lot of `Command + F` if things change. And 14 props isn't even that gnarly of a component in React terms.

## The White Rabbit Appears

I wanted to fix this issue but wasn't sure how at first. Specifically I didn't know how to get around the CDN link issue without resorting to copy pasting the CDN file into our static directory which would result in duplication of versions and just feel icky to do. But wait a minute, what _is_ all that stuff in the `node_modules` folder anyways? Is there something in there that could work the same as the CDN file? We already installed `react` in there....

The Stack Overflow post that pointed me down the rabbit hole was [this one](https://stackoverflow.com/questions/41190269/how-to-create-angular2-library-which-could-be-supported-by-all-script-loaders/41735405#41735405). The explanation that all CDNs work in a manner that can be done locally via Webpack got the gears turning. Time to open up the `node_modules` folder.

Sure enough within there was a folder labeled `umd`. I knew what that was now. A quick diff check showed that the file `node_modules/react/umd/react.development.js` was _the exact same file_ as the one hosted on the CDN (with the same version of react installed local that is). I _already had_ the files I needed locally hiding under my nose. Also building JavaScript libraries as `umd` gave me an idea of how I could build my React components as `umd` and thus use them after script linking the same way.

## Direct Rendering

The solution I landed on was this. First off I needed `react` and `react-dom` in the global scope for use rendering components. The library is already installed in `node_modules` so I made use of the `CopyPlugin` library for Webpack. Official docs [here](https://webpack.js.org/plugins/copy-webpack-plugin/).

```javascript
    new CopyPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, 'node_modules/react/umd/react.development.js'),
                to: path.resolve(__dirname, 'static/dist/react.js'),
            },
            {
                from: path.resolve(__dirname, 'node_modules/react-dom/umd/react-dom.development.js'),
                to: path.resolve(__dirname, 'static/dist/react-dom.js'),
            },
        ],
    })
```

This makes the copy over part of the build process nicely centralized. No external `.sh` scripts or something. The version I linked here grabs the dev versions, but we also have a production build version of our webpack config, in that version I setup the CopyPlugin with the same final target filenames, but instead grabbing the `.production.min.js` versions of each file. This results in our up coming script links always being the same path no matter the build version, but with dedicated versions of the library for better performance in prod, and better debugging in dev.

This app had a file called `base.html` which all other templates loaded into and contained all the scripts needed globally. In that I addded

```html
    <script src="{% static 'dist/react.js' %}"></script>
    <script src="{% static 'dist/react-dom.js' %}"></script>
```

If React is only needed on one page, these links could just be put on that one instead too.

In order to test this worked I jumped into an HTML file and put a `ReactDOM.render()` call in it rendering an empty component. Holy crap it worked! At least as well as an empty render call can without throwing errors.... With that in place next up was the actual React components that build the feature. First up to get them in UMD format so they can be called externally, I added the following lines to the `webpack.config.js` file (the common one shared by both dev and prod):

```javascript
    output: {
        ...
        library: ['[name]'],
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
```

This changes the end result of the built files. Specifically the code generated is no longer wrapped in an anonymous function and has all its exports exposed. Without this webpack builds the files as standard scripts. After this I no longer needed the intermediate JS file from before that just did a `ReactDOM.render()` and grabbed those global variables. That would now be done directly. Instead the `entry` point was changed to be the highest level parent component I wanted to render.

The whole webpack config looked a bit like this

```javascript
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        ParentComponent: './react_components/ParentComponent.js', // note this is no longer the intermediate and no changes were needed to this file
    },
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        filename: '[name].js',
        library: ['[name]'],
        libraryTarget: 'umd', // library builds with exports exposed for external calls
        libraryExport: 'default',
    },
    new CopyPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, 'node_modules/react/umd/react.development.js'), // dev versions here for demo
                to: path.resolve(__dirname, 'static/dist/react.js'),
            },
            {
                from: path.resolve(__dirname, 'node_modules/react-dom/umd/react-dom.development.js'),
                to: path.resolve(__dirname, 'static/dist/react-dom.js'),
            },
        ],
    }),
    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader', // babel things for JSX compilation
                },
                test: /\.js$/,
                exclude: /node_modules/,
            },
        ],
    },
};
```

And with that done I could now script link the built `ParentComponent` file right where I needed it used. Note in the code below, that the script link is now _above_ the HTMl it eventually lands in. This is because it's just loading the ParentComponent library, which gets called in the render method, instead of loading an auto executing script which needed the target HTML element already present in order for it to work.

```html
    {% block content %}
        <script type="module" src="{% static 'dist/ParentComponent.js' %}"></script>

        <div id="target-html-element-for-react"></div>

        <script type="module">
            ReactDOM.render(
                React.createElement(ParentComponent,
                    {
                        requiredProp: '{{ django_template_thing }}',
                    },
                    null
                ),
                document.querySelector('#target-html-element-for-react')
            );
        </script>
    {% endblock %}
```

BOOM.

You know those moments where you get to close about 37 different tabs and go back to thinking you actually _are_ smart enough for this career and not just faking it really well? This was one of those. Now data can be passed straight from Django to React with no middle man. And conveniently, the previous solution also still works just fine. No need to refactor everything all at once.

The big caveat here is that this changes _all_ of the webpack built JavaScript files to be UMD libraries. For our needs that seems fine for now as this is the main way we are using them, however that may not work for all situations. In that case it seems the best answer is to have separate webpack configs for the UMD libraries and for the rest of the code, and then string them together via the `package.json` `scripts` section that calls them. I was not able to find a way to tell webpack to build some files in one format, and others in another in the same file.

One other wrinkle here is that you'll see I didn't use JSX syntax in the `ReactDOM.render()` call. This is because JSX is not valid JavaScript that can run in the browser and has to be compiled via Babel. I'm honestly not sure how to setup Babel to compile inline scripts and frankly it didn't seem worth it since all I'm doing here is a basic render call. I'm not building out whole components / features in the inline script. So it seems fine to me to forgo JSX in this one part of the code base.

Happy webpacking.

Here's some of the resources I used to figure this all out:

<https://www.valentinog.com/blog/drf/>
<https://hackernoon.com/reconciling-djangos-mvc-templates-with-react-components-3aa986cf510a>
<https://stackoverflow.com/questions/41190269/how-to-create-angular2-library-which-could-be-supported-by-all-script-loaders/41735405#41735405>
<https://webpack.js.org/configuration/output/#outputlibraryexport>
<https://reactjs.org/docs/react-without-jsx.html>
