---
title: "Shoshin 4: But what *is* JSON?"
excerpt: "So on this installment of 'beginners mind' we have the question of 'what *is* the data I need anyways?' Not what I was sending to the API it turns out."
coverImage: "/assets/blog/shoshin-4/DSCF0706b.jpg"
date: "2023-09-25"
tags: [json, shoshin]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/shoshin-4/DSCF0706b.jpg"
---

A friend of mine once said "if you ever get to the point that you start suspecting the compiler has done something wrong, you need to stop and think *real* hard about all the basics of what you're doing because whatever it is it's almost certainly your fault". Well I didn't get the point where I was questioning the Java compiler but I did chase my tail through the call stack for a few hours until a coworker made the helpful and embarrassingly obvious observation "hey maybe you formatted your JSON wrong?"

So on this installment of "beginners mind" we have the question of "what *is* the data I need anyways?" Not what I was sending to the API it turns out.

## Well thats an odd "feature"

The root of the problem was a feature in the Firefox developer tools that I didn't take the time to fully appreciate. To get a quick sample of the data I needed to bounce off my new endpoint I hoped into a page on our website and found JSON data in a request that was similar to the new one I had built. However when looking at JSON data in Firefox dev tools you'll note there is a `raw` toggle and turning it on and off does useful things for visualizing the data. I had used this before and assumed that no matter what setting you had it on the actual data would be unchanged. Here's an example working as expected from the Outside Magazine website

![raw_off](/assets/blog/shoshin-4/json.PNG)

![raw_on](/assets/blog/shoshin-4/json2.PNG)

Here's the result of copy and pasting the first example data with the `raw` setting off.

```json
{
 "operationName": "Find",
 "query": "\n  query Find(\n    $bookmarkListInput: GetBookmarkListInput!\n    $data: FindOnListInput!\n  ) {\n    bookmarkList(data: $bookmarkListInput) {\n      find(data: $data) {\n        id\n      }\n    }\n  }\n",
 "variables": {
  "bookmarkListInput": {
   "listName": "Saved for later"
  },
  "data": {
   "contentType": "ContentItem",
   "contentUid": "https://www.velonews.com/gallery/pro-bike-gallery-curtis-whites-cyclocross-nationals-winning-trek-boone-disc/"
  }
 }
}
```

And here it is with the `raw` setting on

```json
{"query":"\n  query Find(\n    $bookmarkListInput: GetBookmarkListInput!\n    $data: FindOnListInput!\n  ) {\n    bookmarkList(data: $bookmarkListInput) {\n      find(data: $data) {\n        id\n      }\n    }\n  }\n","variables":{"data":{"contentType":"ContentItem","contentUid":"https://www.velonews.com/gallery/pro-bike-gallery-curtis-whites-cyclocross-nationals-winning-trek-boone-disc/"},"bookmarkListInput":{"listName":"Saved for later"}},"operationName":"Find"}
```

Same data. Different spacing / formatting as expected.

## Discovery

However a _very_ funny thing happens if your json is formatted as _an array of objects_. In my case I was sending a JSON object like this

```json
[
    {"key": "value",},
    {"different_key": "different_value"},
    {"another_key": "another_value"}
]
```

With the `raw` setting turned off Firefox would format the array into a nicely readable format by putting index values on each object. This was what Firefox gave me on copy pasting the above JSON with `raw` off

```json
[
    0: {"key": "value",},
    1: {"different_key": "different_value"},
    2: {"another_key": "another_value"}
]
```

This is not the same JSON. I would think that copying the data would remove those added indexes but apparently not and I hadn't had enough coffee that day to notice the new data in the JSON. It honestly is nice to read with each element of the array labeled with their position so you don't have to count, but if you blindly copy paste like me assuming it'll be the same data you're in for a bad time. In my case our middle tier had a validator that lived pretty high up in the call stack above the code I was working in that checked the JSON was formatted in some expected manner, else it rejected the request.

After a few hours of chasing my tail before taking a hard look at the JSON object with array index values inserted, I then pasted in a raw JSON object into an editor and realized my mistake. Upon sending _that_ data my breakpoint down in the call stack tripped as expected and development continued.

Lesson learned, take a second and check your assumptions about data structure before rooting around deep in the code stack.
