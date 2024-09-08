---
title: "Misadventures in Jquery Typeahead"
excerpt: "Lesson learned, don't just read the docs, read them close."
coverImage: "/assets/blog/typeahead/norway_bear.jpg"
date: "2020-05-13"
tags: [javascript,jquery,html,typeahead]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/typeahead/norway_bear.jpg"
---


During a recent project at work I had a rather painful adventure in some behavior around Jquery Typeahead and HTML form validation. You know that terrible feeling when you can't find an answer on Stack Overflow and you start questioning your entire career because you don't feel smart enough to solve a seemingly simple problem on your own? This was one of those moments. Lets set the scene.

The application contained a very simple HTML form that users would input data into. I was leveraging HTML's vanilla validation system, making use of the method `setCustomValidity()` to put error text in place if a particular input field didn't contain values that met my constraints. The presence of these messages would prevent form submission. Mostly.

One of these input fields leveraged the Jquery Typeahead library for searching a set of values. Documentation and examples of this library can be found [here](http://www.runningcoder.org/jquerytypeahead/documentation/). I've really enjoyed using this library so far and it fit the bill well for the job. However. One bit behavior threw me for a serious loop that I couldn't find a clear answer on, but only hints to.

With every other field in the form things were going as expected. If a field value didn't match my constraints a validation message would pop up like this example from the Mozilla HTML validation docs found [here](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation).

![moz-example](/assets/blog/typeahead/moz-validate-example.png)

And the form couldn't be submitted. Either by pressing the "Submit" button or using the "Enter" / "Return" key. But not so with the Typeahead field. With the rest of the form empty, or with invalid values, you could hit the "Enter" key while in that field and off the form would go, presenting the user with a nice error page from the server about how the values sent were invalid. Not exactly optimal user experience.

My first attempt to fix this was to try to suppress the enter key on that field. I did this with the following code.

```javascript
document.querySelector('#id-of-the-typeahead-field').addEventListener('keydown', (event) => {
    // 13 being the key code of the "enter"/ "return" key
    if (event.keyCode === 13) {
        event.preventDefault();
        return false;
    }
    return true;
});
```

Which did not work. The `if` block would run, `preventDefault()` would run, and the darn thing would still submit. To make sure I wasn't crazy I tied this code to other fields in the form and it worked as expected.

I then found in [the docs](http://www.runningcoder.org/jquerytypeahead/documentation/) a callback called `onSubmit`. That sounded promising! I decided, clearly when this field tries to submit the form I should just block it by returning `false`, so I added this to my typeaheads config section thinking it would just block that one field.

```javascript
$('.js-typeahead-indications').typeahead({
    // some other config options
    callback: {
        onSubmit: function cancelReturn() { return false; },
    },
});
```

And it fixed the issue! Now an "Enter" keystroke would no longer submit my form when it wasn't supposed to. Except now my whole form wouldn't submit. All of it. Even using the "Submit" button would no longer work. The single Jquery Typeahead field `onSubmit` function would now block _any_ submit attempt of _any_ type, button or keystroke.

What proceeded after that was a sort of fever dream of mad googling, trying silly changes to the HTML, trying _really_ silly changes to how my validator events were being triggered, all to no avail. The eventual solution was found by doing what I am increasingly feeling I should always do from now on, a deep breath, brewing a fresh cup of coffee (I just bought a Chemex and I'm hooked), followed by actually reading the documentation.

Remember the documentation for `onSubmit`? Its got some details. It takes in `(node, form, item, event)`. A lot to work with but the `form` parameter is of particular interest. Also remember how I've been using `setCustomValidity()` to put validity messages on fields? Its got a sister function of sorts called `checkValidity()` (docs [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity)) that can be called against the whole `form` object to look for validation messages. On top of that I already have my own custom functions for validating a field's values. So I put the pieces together like so:

```javascript
$('.js-typeahead-indications').typeahead({
    // some other config options
    callback: {
        onSubmit(node, form, item, event) {
            MyValidatorClass.validateTypeaheadField();
            if (!form.checkValidity()) {
                event.preventDefault();
            }
        },
    },
});
```

VOILA! Due to how my event handles are set up, the other empty or invalid fields will already have validation error messages on them. So when an enter key stroke sets off the submit event on the typeahead field, _the whole form_ is searched and `preventDefault()` runs, thus preventing an errant submission. Of course if all fields are valid, everything goes as planned, `preventDefault()` doesn't run the form submits.

Lesson learned, don't just read the docs, read them _close_. The details are often just as useful as the big picture content.
