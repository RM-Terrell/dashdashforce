---
title: "The Scorched Earth Guide to Adding Vue 2 to Django"
excerpt: "..if you dear reader are wandering the same vast desert of 'please no more greenfield guides, my boss wont let me burn down our codebase' then I hope the information here is useful to you."
coverImage: "/assets/blog/vue-django/red_deer.jpg"
date: "2020-09-26"
tags: [vue, javascript, django, webpack, babel, jest]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/vue-django/red_deer.jpg"
---

As a follow up to my previous post on setting up React 16 in an existing Django app, here is the equivalent set up for Vue 2 in the same application. Comparing the two libraries, Vue wound up actually being the trickiest overall to configure. One issue was that looking for existing guides / blog posts on how to do this with Vue was like wandering a desert compared to React. As such, if you dear reader are wandering the same vast desert of "please no more greenfield guides, my boss wont let me burn down our codebase" then I hope the information here is useful to you. Lets start a garden in a wasteland.

## Background

In my previous post I went into detail on the limitations and requirements for the application and some of its unique challenges. I won't reiterate those details here, but for a short context, the application is a multi-page (non SPA) Django app that has outgrown its current front end tech, and needs to work with and without an internet connection. It also must be improved incrementally and have good long term reliability and support. My project was building a webpage for the app in both React and Vue for the team to compare and this documents my attempt at getting the Vue build system in place.

## Resources used

The following links proved extremely helpful in figuring out how to do all this and as such I felt were worth linking here:

[A general guide to setting up Vue with Webpack 4](https://appdividend.com/2018/03/12/how-to-setup-vue-js-with-webpack-4-example/)

[A guide to single file components in Vue](https://www.freecodecamp.org/news/how-to-create-a-vue-js-app-using-single-file-components-without-the-cli-7e73e5b8244f/)

[This post on how to change the template tags for Vue](https://stackoverflow.com/questions/33628558/vue-js-change-tags). More on this later.

I also followed Scott Tolinski's Vue course on LevelUpTuts which can be previewed [here](https://www.youtube.com/watch?v=X-4BEPiZI2U).

## The install process

To get Vue and its various CLI tools into the project I first did:

```bash
npm install vue
npm install @vue/cli --save-dev
```

`--save-dev` because the CLI tools are for developer work only. One of the very first things I did was try the Vue CLI tool for adding Vue to an existing project. This involves running `vue-cli create` and passing it the name of the existing project folder and it's _supposed_ to integrate a functional build system into your project. Yeah no. Maybe that works for some people but it broke the entire UI of my project and added directories and files in places they don't belong for our project. I actually reverted my dev VM to a snapshot it made such a mess. With that mistake learned I decided to do it myself correctly.

### ESLINT

Before even getting Vue working though I really wanted to have ESLINT in place to keep a watchful eye on me writing component code. To get ESLINT working with Vue's unique files and syntax I installed the following package:

```bash
npm install --save-dev eslint-plugin-vue@next
```

And then in my `eslintrc.json` file, in the `extends` section I added the following to hook the package into ESLINT:

```json
    "extends": [
        "plugin:vue/recommended"
    ],
```

If you're not using ESLINT this can be totally skipped.

### Webpack and Babel

Next up was getting Webpack and Babel working with the projects unique file structure. My solution to adding Vue required that all `.vue` files would be fully built locally by the system on install (it runs in quite a few different environments) and not use online CDNs. Babel was needed to transform the "invalid" code contained in `.vue` files into code that the browser can actually run and Webpack does the job of bundling it all up into a highly optimized bundle which is loaded by the browser. This wound up requiring quite a few packages to do the job.

```bash
npm i vue-loader vue-template-compiler webpack webpack-cli babel-loader @babel/core @babel/preset-env html-webpack-plugin vue-style-loader css-loader -D
```

For more detailed descriptions on Webpack, Babel, their CLI tools, and needed packages like `preset-env`, see my last post on React, as both the React build system and Vue's share these tools.

`vue-template-compiler` was one of the oddballs here and was needed to specifically configure allow `.vue` files to get loaded and built into valid JS. To wire up all these tools I created `.babelrc` and `webpack.config.js` files like so.

`.babelrc`

```json
{
    "presets": [
      "@babel/preset-env"
    ],
    "plugins": [
    ]
}
```

`webpack.config.js`

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const path = require('path');

module.exports = {
    entry: './static/js/vue/main.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },
            {
                test: /.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    resolve: {
        alias: { vue: 'vue/dist/vue.esm.js' },
        extensions: ['*', '.js', '.vue', '.json'],
    },
};
```

One tripping point I hit had to do with loading css code from `.vue` files. So many cryptic build errors. I am not 100% sure my solution of using `vue-style-loader` _and_ `css-loader` is the most optimal. I suspect `vue-style-loader` may be able to handle the entire job by itself with some further tweaking, but this config from the webpack file

```javascript
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ],
            },
```

got the system building, and being that this install was for demo purposes only I went with it. If you're building this for a production system there may be some optimization here that would allow you to remove one of those packages. For more details on what each section of this Webpack config file does, see my previous post and also the Webpack docs. Theres a lot here but each part is pretty straight forward.

### The file structure

For this project I wanted to get Vue working as Single File Components, and able to load as many or as few components on a webpage as I wanted. We would be undergoing a gradual transition to the new UI tech so setting things up to only work as full page SPAs was not practical. To get my first Hello World style component building, heres how I set up my HTML and JS files.

The first HTML file that I tried was a very simple webpage loaded by Django's view/template system, the contents of which would ultimately get replaced by Vue components. After deleting all the Django template code I would be replacing, the HTML file looked like this (minus a few Django tags that loaded the footer, header and such):

```html
    <div id="test-table"></div>
    <script src="{% static 'dist/main.js' %}"></script>
```

And thats it. What happens here is that the final built product of all those packages we installed will wind up in `dist/main.js` (configured by the webpack config), and when ran it would build into _and replace_ the div with an id of `test-table`. I emphasize that it both builds into it, and replaces it because I thought that was interesting behavior. There will not necessarily be a div with an id of `test-table` depending on how you build the component that goes there. If your final built HTML structure seems to be lacking this outer HTML element, that is probably why.

In the webpack config file there is an entry point defined. You can have one or many entry points, and for this system it represented the highest level entry point for the component I was building

```javascript
    entry: './static/js/vue/main.js',
```

That file (main.js) looked like this:

```javascript
import Vue from 'vue';
import TestTable from './components/TestTable.vue';

new Vue({
    render: h => h(TestTable),
}).$mount('#test-table');
```

Another pretty simple file. We import Vue, the component to be rendered (my Hello World component), then fire up a new Vue instance rendering the component imported. Remember that div with an id of `test-table` from the HTML? You can see  Vue using the `$mount()` command to render into that div. That div#id must exist on the page or it wont build into anything.

Meanwhile the component itself looked like this:

```vue
<template>
    <div id="test-table">
        <TableTitle v-bind:title="title" />
        <table class="table table-striped header-fixed">
            <thead>
                <tr>
                    <th v-for="header in columnHeaders" :key="header">
                    {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Some cell data</td>
                    <td>Some more testing cell data</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TableTitle from './TableTitle.vue';

export default {
    name: 'TestTable',
    components: {
        TableTitle,
    },
    data() {
        return {
            title: 'Test Table',
            columnHeaders: ['Name', 'Test Column 1',],
        };
    },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData: async function() {
            // A function that would eventually fetch data
        },
    },
};
</script>

<style scoped>
    table {
        border: 1px solid #111;
    }
</style>
```

This wont be a guide on how Vue works but the component file represents a very simple HTML table with a title component that it also imports from a different `.vue` file. Just like a JavaScript module.

To build the entire system, in my `package.json` file I added the following:

```json
"scripts": {
    "build": "webpack --config=webpack.config.js"
}
```

This command let me run a simple `npm run build` and signaled to use the webpack config to build the system. Afterwards a build file was built in the `dist` directory and I was set! The page rendered the basic HTML table in the `test-table` div.

One other wrinkle in teh build process is that the Django backend gathers up all static files for serving (like js, css, images, etc) and serves them on a url. You can see this static url in action from the HTML file above

```html
<script src="{% static 'dist/main.js' %}"></script>
```

That `static` keyword actually gets transformed at runtime to be the URL of hosted files. In order to gather up our built JS bundle I needed to just run our systems `collectstatic` command. After that the JS file was loaded and the UI worked as expected with a rendered Vue component.

For testing I opted to use Jest. My previous post on React has more info on the Jest test runner, and their docs are quite good. A few installs and configs for that.

```bash
npm i babel-jest jest vue-jest
```

In the `package.json` I added a new script to call jest with `npm run jest`

```json
   "scripts": {
        "build": "webpack --config=webpack.config.js",
        "test": "jest"
   }
```

and created a file named `jest.config.js` like so

```javascript
module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest',
    },
    moduleFileExtensions: ['js', 'json', 'vue'],
};
```

This part took a lot more fiddling to get set up than React due to the unique loaders needed to allow Jest to render and test them. I also found that I needed to set a browserlist option in my `package.json` because I immediately hit issues with trying to convert the very modern `.fetch()` method to older compatible code. Again in `package.json`

```json
  "browserslist": [
    "since 2017-06"
  ],
```

There are packages to help make `.fetch()` work in older browsers and test simulations but for this demo I was more than happy just having it build.

With Jest installed and the above config options, I was able to create a very basic test file like so

```javascript
import { mount } from '@vue/test-utils';
import TableTitle from '../vue/components/TableTitle.vue';

test('<TableTitle />', () => {
    const msg = 'Testing Title Text';
    const wrapper = mount(TableTitle, {
        propsData: {
            title: msg,
        },
    });
    expect(wrapper.text()).toContain(msg);
});
```

This test was just to confirm that text passed into the title component rendered on the page as expected. It also served as a demo to my team mates of the syntax of Jest tests in JavaScript, of which we had none at the time.

## Django tag collision

One interesting issue I hit when building components in Vue that I didn't in React, was that both Vue and Django by default used the syntax {{ im_a_variable }} to do template variable things. And if you leave both configured to use that syntax, I had instances of improperly loading data from Vue (some sort of confusion with Vue vs Django template data) and in general it was confusing to look at switching between files. Luckily Vue has a very easy way to changes its template syntax to be different than Django's. Also saying out loud "data from the view" (meaning Django's "view" engine) and "data from Vue" is _really_ hard on the ears, so any opportunity to avoid confusing the two sounded good to me.

Where the new Vue instance is created I simply added:

```javascript
new Vue({
    delimiters: ["<%","%>"],
});
```

and then the Vue engine would use the `<%` tag combination to do templating. You can set this to work however you want so that it doesn't collide with your existing system. It also makes developing much easier as you don't find yourself confusing Django / .NET / other template systems with Vue.

And that was it! From there I built out the whole demo page and eventually put up two PRs for comparison. React ultimately won the competition for my team, but the work of learning and comparing them was extremely fun. Getting the entire build system working was a truly one of my best "I know kung foo" moments of my dev career.

May your components be modular and swift.
