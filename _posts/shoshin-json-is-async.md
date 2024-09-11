---
title: "Shoshin 1: body.json() is async"
excerpt: "...it took me half an hour of chasing the REST call red herring before I, you guessed it, read the docs."
coverImage: "/assets/blog/shoshin-json/walker_ranch.jpg"
date: "2020-08-07"
tags: [javascript, project orbital, shoshin]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/shoshin-json/walker_ranch.jpg"
---

> Shoshin (初心). Originates from Zen Buddhism meaning "beginner's mind." It refers to having an attitude of openness, eagerness, and lack of preconceptions when studying a subject, even when studying at an advanced level, just as a beginner would.

This is going to become a reoccurring series. Those times when my previous expectations and experiences in some language or technology lead me to make bad assumptions in something new, and if I had lead with thinking like a beginner and read the documentation without expectation, things would have been much quicker and much less frustrating. So here's installment 1, revolving around JavaScript's `body.json()` method.

During my continued work on Project Orbital I finally got to the stage where I was ready to have the React app start making calls to the Django REST API for passing around data. One REST API endpoint called `/sem_to_sd/` converts standard error of the mean to standard deviation and was fully operational. I had been testing it using Django's built in testing library, and also some manual calls using the application Postman. So I knew it at least _should_ work.

I setup a submission method within my React component as so

```javascript
  async handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/rest_api/sem_to_sd/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sem: this.state[`${this.semValue}`],
          n_value: this.state[`${this.nValue}`],
        }),
      });
      const body = res.json();
      console.log(body);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
  ```

In short, this code makes a POST call to the endpoint, sending the body data `sem` and `n_value` and expects a response containing the standard deviation.

Upon running this code however, by sending data via the UI and relevant component, `body` logged out as the following

```bash
Promise { <state> "fulfilled", <value>: {…} }
```

And thats it. No data. No nothing. Hrm. Well I knew that the POST call itself

```javascript
      const res = await fetch('http://127.0.0.1:8000/rest_api/sem_to_sd/', {})
```

creates a promise, and the `await` waits for that promise to resolved and returns the data. So why was I just getting a promise on the line

```javascript
      const body = res.json();
```

instead of JSON? Can you spot where I went wrong? Well I couldn't, it took me half an hour of chasing the REST call red herring before I, you guessed it, read the docs. Well no thats not really true, I found a Stack Overflow post that pointed out that `body.json()` _itself returns a promise_ and then I read the docs. And felt silly. [Here they are](https://developer.mozilla.org/en-US/docs/Web/API/Body/json). Right there in the first sentence. So of course I was logging out a promise, just not the promise I originally thought.

Upon changing the code to the following

```javascript
        const body = await res.json();
```

`body` now contained the JSON data I wanted. The change was also made simple by the fact that all this sits within already async function `handleSubmit()`, otherwise I would also need to add `async` into the mix for the function declaration.

My bad assumption here was brought on by years of working with Python. In Python land, the methods `json.loads()` and `json.dumps()` (along with many other useful methods in the library) handle encoding JSON, and it always behaves like a quick conversion.

Want to turn that string into JSON?

```python
import json

json_data = json.loads('{ "name":"Gordon", "age":27, "occupation":"physicist"}')
```

Done.

Python docs [here](https://docs.python.org/3/library/json.html). So naturally I went into this conversion to JSON with the same workflow and thought it would just work.

Making matters more confusing is the fact that JavaScript has a few different ways to handle promises. You can see this in the MDN docs I linked where they are handling this conversion via `then()` like so

```javascript
response.json().then(data => {})
```

instead of using `await`. This also lead to some extra reading on what exactly `await` does which was a great refresher on the fundamentals. Docs [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) on `await`.

All in all a good learning experience in async, await, json, and taking things slow.

May your mind be open to all possibilities and free of unfulfilled JavaScript promises.
