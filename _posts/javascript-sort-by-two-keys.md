---
title: "How to sort by two keys in an array of objects in JavaScript"
excerpt: "Here's how I solved it and created a function that eventually became part of a composed function pipeline for UI data processing."
coverImage: "/assets/blog/javascript-sort-by-two-keys/walkway.JPG"
date: "2023-11-13"
tags: [javascript]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/javascript-sort-by-two-keys/walkway.JPG"
---

I had a problem at work the other day that felt like a good interview question. "Given an array of objects all containing the same keys, sort the objects by one key first, then another leaving them grouped by the first key." Well I didn't have to reimplement a quick sort or a binary search tree to do it but got to instead experiment with some of the optional arg that `.sort()` can take in JavaScript.

## Structure change

From a server side process API call I was getting an array of data like the following dumped into a web browser client that would eventually be used to render some React components.

```javascript
const data = [
{FIRSTKEY: 1, SECONDKEY:1, ...<other_data>},
{FIRSTKEY: 1, SECONDKEY:2, ...<other_data>},
{FIRSTKEY: 2, SECONDKEY:1},
{FIRSTKEY: 5, SECONDKEY: 2},
{FIRSTKEY: 3, SECONDKEY: 1},
{FISRTKEY: 1, SECONDKEY: 3},
{FIRSTKEY: 5, SECONDKEY: 1},
<on and on for potentially a few hundred objects>
]
```

The example above conveniently has the first 3 values already in the kind of order I wanted but there was no promise the data coming from the backend system would always be like that. `FIRSTKEY` and `SECONDKEY` values could be in either position in the object, and the objects themselves in any order as seen in the rest of the objects in the array. Each object would also be containing a lot more data that would be rendered to the UI. There was a guarantee however of the sorting key/values being unique across the collection of data as they corresponded to unique data from a database. So the end result I wanted was the following using the above data as a running example:

```javascript
const data = [
{FIRSTKEY: 1, SECONDKEY:1},
{FIRSTKEY: 1, SECONDKEY:2},
{FIRSTKEY: 1, SECONDKEY: 3},
{FIRSTKEY: 2, SECONDKEY:1},
{FIRSTKEY: 3, SECONDKEY: 1},
{FIRSTKEY: 5, SECONDKEY: 1},
{FIRSTKEY: 5, SECONDKEY: 2},
]
```

So group and sort by FIRSTKEY, then by SECONDKEY within the initial grouping. As stated in the first data example there could be a few hundred of these, with likely there being a few dozen more in the future, but the possibility of expanding to thousands or hundreds of thousands of these elements was unlikely. So no massive performance requirements but still worth not being silly about.

Here's how I solved it and created a function that eventually became part of a composed function pipeline for UI data processing:

``` javascript
/**
* @param {Array.<Object>} data
* @returns {Array.<Object>}
*/
export function sortByTwoKeys(data) {
    return data.sort((a, b) => {
        if (a.SECONDKEY === b.SECONDKEY) {
            return a.FIRSTKEY - b.FIRSTKEY;
        }
        return a.SECONDKEY - b.SECONDKEY;
    });
}
```

This works by giving `.sort()` a comparator function [as documented here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn) in MDN docs. This is an incredibly powerful feature and allows the expansion of the behavior of `.sort()` to do just about thing in terms of custom data sorting. In this case I worked backwards and first determined the state of the `SECONDKEY` value relative to its next element, then used to that to reposition the element in the resulting array.

Happy sorting!
