---
title: "Setting up different Webpack configs for prod and dev"
excerpt: "'Why are we running Webpack developer mode builds on a production test server?' '...good question I'll get right on that.'"
coverImage: "/assets/blog/webpack-prod-configs/loveland_pass.jpg"
date: "2020-12-12"
tags: [webpack, javascript]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/webpack-prod-configs/loveland_pass.jpg"
---

"Why are we running Webpack developer mode builds on a production test server?" "...good question I'll get right on that."

Bringing in Webpack, Babel, Jest, and React to one of our legacy products has been a pretty awesome journey and there have been a _lot_ of procedures and processes to get setup properly. One of those was figuring out how we were going to tell Webpack to run either developer or production (dev and prod from here on out) without doing a bunch of fidgety manual file editing. No one has time for that. There were a few different ways this could have been done, including hooking into some pre-existing linux environment variables used to define what mode the whole app (especially the Django part of it) was running in. The solution I ultimately landed on made use of Webpacks preexisting tools for managing shared config options called `webpack-merge` and some creative shell scripts.

## First attempts and their problems

One of the first approaches I considered involved creating one `webpack.config.js` file and having some JS logic inside it that read env variables and changed config options accordingly. I opted away from this because I found the idea of logic in a config file really gross and hard to test / document. There should be logic elsewhere that controls which config is ran whether thats some sort of orchestrated build system or even just shell scripts (which this product currently uses).

The next solution involved....you guessed it, two config files. This was somehow even more gross though because now I had duplicated options in the config files. For example heres a short version of what the dev and prod versions of the webpack config would look like:

The dev version:

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
      rules: [
          {
              use: {
                  loader: 'babel-loader
              },
              test: /\.js$/,
              exclude: /node_modules/,
          }
      ]
  }
};
```

And the prod version

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
      rules: [
          {
              use: {
                  loader: 'babel-loader
              },
              test: /\.js$/,
              exclude: /node_modules/,
          }
      ]
  }
};
```

What happens when you add new entry points? Change loaders? If the default ran for developers is the dev mode config, then most likely the prod version will be forgotten and broken on deployment, while at the same time creating a bunch of confused devs wondering why "its works on my machine".

## Modern problems, modern tools (mostly)

Turns out Webpack has a great fix for this, a little library called `webpack-merge` which lets you define the shared config options (like entry points) in a common inherited file.

First install the library:

```bash
npm i -D webpack-merge
```

then you create a file called `webpack.common.js` or whatever name you want in the place of `common` to indicate its the shared config. I thought `webpack.progenitor.js` was really jazzy.

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
      rules: [
          {
              use: {
                  loader: 'babel-loader
              },
              test: /\.js$/,
              exclude: /node_modules/,
          }
      ]
  }
};
```

Looks pretty similar to before but without the modes and dev tools options that are different between configs. Remove any other options that will differ between builds for you. As you may imagine, the `common` config never actually gets ran. It's a lot like an abstract base class for Webpack. If you want to go full Java maybe call it `webpack.AbstractBaseClass.js`? You get the point. Then create a `webpack.dev.js` and `webpack.prod.js`, or whatever different versions you need.

`webpack.dev.js`

```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
});
```

and the `webpack.prod.js` file

```javascript
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
});
```

You can now see that your common config files options are imported and merged in with the `merge` method. Your `prod` and `dev` versions will be what get ran by your orchestration tools, and whatever differing config options you want get put in these files. It may be worth a comment or two in these files explaining the intent since unlike an abstract base class you don't have a compiler that will make it explode if not used correctly.

For my situation we use a series of shell scripts to automate building the application. I opted to have our shell scripts run the prod version by default. Then if a dev wants to run a dev version of webpack they can pass a flag into the system to trigger it to do so. This has the added benefit of devs regularly seeing the final built version of the JS code by default, meaning if there are any issues with the final build version (some horrors from Babel compilation or something) they will see it right away. Time will tell if this is a good approach in the long run for us as the whole Webpack build system is very very new. For now though the OOP-ified configs have made life a lot easier and bundle sizes have been reduced 10x in prod mode.

Happy compiling.
