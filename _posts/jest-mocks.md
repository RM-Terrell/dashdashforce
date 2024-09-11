---
title: "Mocking named exports in Jest unit tests"
excerpt: "Apparently it takes forgetting and remembering how to do something about 3 times before I finally decide to take the time to write something down."
coverImage: "/assets/blog/jest-mocks/canada_waterfall.JPG"
date: "2023-07-20"
tags: [jest, javascript, testing]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/jest-mocks/canada_waterfall.JPG"
---

Apparently it takes forgetting and remembering how to do something about 3 times before I finally decide to take the time to write something down. I should work on that. This time around it was remembering how to mock out a named export function in Javascript for unit testing a React component. I rather love good unit testing so this was a problem that needed solving…again.

## The problem

Let’s say you have a JS file with some functions in them like this that are used in another file that you are unit testing.

```javascript
export function dataCleaner(data) {
    ...more code here
};
```

In my case `dataCleaner()` was a function being used in a React component that was doing some seriously hairy transformation work that I didn’t want to test or even execute in a unit test so I wanted to mock it out. The mocks would allow for easy testing of the component and how it handled the different mocked returned data from `dataCleaner()`.

## The solution

In order to mock `dataCleaner()` in a Jest test I found I was able to do the following inside the main block of one of my Jest tests.

```javascript
import * as dataUtilFunctions from 'path/to/data/utils/functions.js';

test(`Given the table is rendered, verify it loads some mocked data.`, () => {
    dataUtilFunctions.dataCleaner = jest.fn();
    dataUtilFunctions.dataCleaner.mockImplementation(() => {
        return {}
    });

    ....rest of the unit test here
});
```

So in this case I’m mocking dataCleaner to return an empty object. This can also be done at a higher level at the top of the test file itself or even in a setup file for jest so that every single test will have that mock by default. In my case I only needed it for two tests so I did it this way in both with different return values.

I also found in my searching that there is a newer alternative syntax to do this which I found via [this Stack Overflow question](https://stackoverflow.com/a/75189751). That newer way of mocking seems especially good with rather large files with a lot of named exports and I was able to make it work in my case too.

Happy mocking!
