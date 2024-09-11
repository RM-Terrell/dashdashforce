---
title: "Adding a key:value pair to a list of Javascript objects"
excerpt: "A very specific problem with a very convenient solution."
coverImage: "/assets/blog/update-dict/allenspark.jpg"
date: "2020-08-28"
tags: [javascript]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/update-dict/allenspark.jpg"
---

A very specific problem with a very convenient solution.

My current big project at work is making a prototype webpage in both React.js and Vue.js for the purpose of choosing a long term library for our company UIs. In doing so I had a situation where I needed to add a particular key:value pair to a list of objects (I may reveal my Python side and call these dictionaries) representing the state of our applications UI.

My initial idea on doing this involved using a `.forEach()` to iterate the list, and then maybe use the `.push()` method to add to each object. Well `.push` doesn't work on objects (its an array method only), but it turns out its even easier than that. Using `.map` you can iterate the list, then use an arrow function like so:

```javascript
let newThings = things.map(x => ({ ...x, newKey: itsValue }));
```

The magic of this is the spread operator (`...`), which leaves the existing values in place (spread into the object), and the new key: value pairs are inserted into each object on iteration.

So if you start with this list of objects

```javascript
let listOfObjects = [
    {
        key1: 1,
        key2: 2,
    },
    {
        key1: 3,
        key2: 4
    },
    {
        key1: 5,
        key2: 6
    }
]
```

and you want to add `booleanKey: false` to every single object you'd do the following:

```javascript
let newListOfObjects = listOfObjects.map(x => ({ ...x, booleanKey: false }));
```

and you'd get this as the result

```javascript
let newListOfObjects = [
    {
        key1: 1,
        key2: 2,
        booleanKey: false,
    },
    {
        key1: 3,
        key2: 4,
        booleanKey: false,
    },
    {
        key1: 5,
        key2: 6,
        booleanKey: false,
    }
]
```

May your dictionaries be swift and concise.
