---
title: "Aliasing JavaScript paths in Webpack, Eslint, Jest, and VSCode"
excerpt: "Coming from the world of Python with relative imports this all seemed pretty gross to me..."
coverImage: "/assets/blog/js-alias-import/mosquito_range.jpg"
date: "2021-02-24"
tags: [javascript, jest, webpack, vscode]
photo_credit: "<>"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/js-alias-import/mosquito_range.jpg"
---

You ever seen some nasty looking imports in JavaScript like

```javascript
import Checkbox from '../../../core_components/Checkbox';
```

Coming from the world of Python with relative imports this all seemed pretty gross to me so I went out looking for a way to clean those up a bit. Sure enough Webpack offers a way to build your application with import aliases, and then Jest, Eslint, and VSCode itself can also be configured to resolve those aliased imports as well. The end results was taking that nasty import above and ending with this

```javascript
import Checkbox from 'CoreComponents/Checkbox';
```

while maintaining the ability to see VSCode intellisense, have Eslint not throw "cannot resolve path" errors, and Jest tests still be able to run. Lets do it.

## Webpack

The most critical part of all this is that your application first builds correctly with the aliased imports we want to create. So we start with the `webpack.config.js` file first. The documentation on the settings I will use can be found [here](https://webpack.js.org/configuration/resolve/)

Lets assume you have a directory of modules / react components / whatever exported JS stuff in a directory called `./core_components`. Inside that directory is housed a bunch of your files with exported components in them. This directory is in the root of your project, and it needs to get used by other modules who are sometimes very deep in other directories.

```ascii
.
├── webpack.config.js
├──
├── core_components
│   └── Checkbox.js
├── some_page
│   ├── section
│       └── subsection
            └── another_subsection
                └── index.js
```

In `webpack.config.js` (or your equivalent base webpack config file)

```javascript
const path = require('path');

module.exports = {
    entry: {
        // your settings
    },
    // more of your settings
    resolve: {
        alias: {
            CoreComponents: path.resolve(__dirname, 'core_components/')
        }
    }
};
```

What this will do is tell Webpack that anytime it sees `CoreComponents` at the start of an import, it needs to alias that to the `path` you provided. If you want to alias another directory deeper you could something like

```javascript

    resolve: {
        alias: {
            CoreComponents: path.resolve(__dirname, 'core_components/home_page_components/form_modules/')
        }
    }
```

or whatever your use case calls for. Now lets say you're importing a component called `Checkbox` that lives in `core_components` from another module _many_ directories deep in your project somewhere else. Instead of

```javascript
import Checkbox from '../../../core_components/Checkbox';
```

we can now just do

```javascript
import Checkbox from 'CoreComponents/Checkbox';
```

and your application should build. Run a Webpack build to confirm, though if you're using Eslint it may be yelling at you along with VScode, and your Jests tests will have import errors. We'll fix those next.

One thing worth considering here is making the alias name `CoreComponents` something more obviously different than your usual directories, for example `@CoreComponents` or some other non directory name symbol. This will help other developers who don't know about the under the hood aliases to realize that your aliased directory name isn't an _actual_ directory on the file system. It will also help you in 3 weeks when you have forgotten about the magic you've forged here. I'm going to just use `CoreComponents` for this example but you can follow whatever convention you think is most clear. Webpack will take care of the rest.

## Jest

Next on our list is to get our tests passing again. You'll probably hit an error like this when you try to run them after updating your imports.

```bash
  ● Test suite failed to run

    Cannot find module 'CoreComponents/Checkbox' from 'some_page/section/subsection/another_subsection/index.js'

    Require stack:
      some_page/section/subsection/another_subsection/index.js
      some_page/section/subsection/another_subsection/index.test.js

      2 | import PropTypes from 'prop-types';
      3 |
    > 4 | import Checkbox from 'CoreComponents/Checkbox';
        | ^
```

To fix this we need to go into the `jest.config.js` file (this can also be done in the `package.json` file if you have your jest config set up there and the syntax should be close to identical).

In `jest.config.js`

```javascript
module.exports = {
    // your settings
    moduleNameMapper: {
        '^CoreComponents/(.*)$': '<rootDir>/core_components/$1',
    }
}
```

As you can see this config isn't quite as nice as the `moduleNameMapper` setting takes some regex args to complete the paths. Official docs and more information can be found [here](https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring). After doing that your tests should now run as Jest will have the same mapping to the aliased component as Webpack.

## Eslint

Eslint will also be yelling at you at this point with something like

```bash
Unable to resolve path to module
```

This can be solved with a small library called `eslint-import-resolver-alias`. Its official NPM page can be found [here](https://www.npmjs.com/package/eslint-import-resolver-alias). Install as a dev dependency with

```bash
npm i -D eslint-import-resolver-alias
```

And you will now have a new option in your `.eslintrc.js` file.

```javascript
module.exports = {
    // your other options
    'settings': {
        'import/resolver': {
            'alias': {
                'map': [
                    ['CoreComponents', './core_components'],
                ],
            },
            'extensions': ['.js']
        }
    }
    'rules': {
        // your rules
    }
}
```

If you have other module file types that need mapping like this, you'll need to add them to the `extensions` section. Things like `.vue` can go there too. In my case I needed to reload VSCode to reflect the updated Eslint rules in my editor (using the VSCode Eslint extension) but after that you should no longer see Eslint errors on imports.

## VSCode

Last up is VSCode and its intellisense hovers. With the old `'../../../../../'` imports, when you hovered over your import or used that import further down in your code you would get a pop over with information about the module. If you have docstrings and such that would all show up. After aliasing however those will no longer be there as VSCode cant parse the import. VSCode (as far as I know) can't read Webpack import aliases by default so we _also_ need to inform VSCode about our new alias structure. To do so, if you don't already have one create a `jsconfig.json` file in the root of your project. Add the following options

```json
{"compilerOptions": {
    "baseUrl": "./",
    "paths": {
        "CoreComponents/*": ["core_components/*"],
    }
},
"exclude": ["node_modules", "static/dist"]
}
```

Makes sure to put in those exclude options to avoid slowing the application down traversing files it doesn't need to. Obviously modify the `static/dist` option to be wherever webpack is building your static files out to. Now check this all worked by hovering over the `Checkbox` (or whatever your module is you're working with) in the import `import Checkbox from 'CoreComponents/Checkbox';`, and you should now see the information about that module populate as before.

## Final Thoughts

I don't like how many duplicated paths are present here. I'll probably reconsider this a bit and see if I can make some of these paths / names constants in some location in the app and use them in the needed configs. The tricky part is how some of them are formatted a bit different from each other, like jest requiring regex paths. Will update this post if I find a good solution to reduce duplication / files that need to be touched when updating an aliased path.

Happy aliasing.
