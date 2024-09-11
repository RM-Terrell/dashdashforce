---
title: "Python and its named reference system"
excerpt: "Sometimes it helps to interrogate the man behind the curtain a bit."
coverImage: "/assets/blog/python-named-reference/winter_park_mary_jane.jpg"
date: "2021-05-02"
tags: [python]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/python-named-reference/winter_park_mary_jane.jpg"
---

My first programming languages were Javascript and C#, and at my current job I started working with Python for the first time. Since I learned Python primarily on the job, I dived into it with a very "alright lets just make this work" kind of attitude and breezed over some of the fundamentals. Over the years I've picked up a lot of things from co-workers far smarter than myself and Python is in general a pretty forgiving language when learned this way, but some holes have remained. In particular, Python's behavior around assigning and updating lists has bitten me on a few occasions and I didn't quite fully understand why. Recently however I've gotten back to basics and been working through the Pluralsight Python course.

One core rule that is fundamental to Python and how it works has made my past troubles clearer:

**All variable are objects in Python and a variable is just a named reference to that object. As a result, the assignment operator only binds objects to names, it never copies an object by value.**

Lets see this in action.

## Integer / Immutable Objects and the Effects of Assigning

When it comes to immutable types like numbers and strings, its hard to really notice this behavior happening behind the scenes, as things stay pretty intuitive. However, one can use Pythons built in `id()` function to see whats really going on.

We'll start with variables `a` and `b` assign them different values. Using `id()` you can see that besides having different values, these two variable have different reference ids. Then we will assign `b` to `a` and using the `id()` function again get the named reference to the variable object.

![a_b_id](/assets/blog/python-named-reference/a_and_b_id.PNG)

(note: the `is` operator tests whether two objects are the same in a reference sense, not a value one, probably via their `id` values)

After `b` is assigned to `a`, their ids are now the same. Heres whats happening behind the scenes. During the initial setup of `a` and `b`, two `int` objects in memory are created holding the values, and a named reference is created binding the variables to those objects.

```ascii
{a} -> {int: 200}
{b} -> {int: 400}
```

and when `b` is assigned to `a` the following occurs:

```ascii
{a} ->
      | ->  {int:200}
{b} ->

           {int:400}
```

And sometime later the Python garbage collector reclaims and removes the `{int: 400}` object as it is now unreachable by any variables.

Whoever, what happens if the value of `a` is updated?
![a_b_reassign](/assets/blog/python-named-reference/a_is_b_update.PNG)

After updating the value of `a` to 201, `a` now points to a new object in memory holding an `int` value of 201. What did NOT happen is an in place updating of the previous `{int:200}` object, and meanwhile, the `b` variable still points to the old object. Our diagram now looks like this:

```ascii
{a} -> {int:201}
{b} -> {int:200}
```

No garbage collection is needed here as both objects are still bound to variables.

## Lists and Mutable Objects

Things get more interesting with mutable types like lists, sets, and dictionaries. The same rules apply where a variable binds the named reference to the object in memory, however that object can now be mutated resulting in some unexpected behavior.

![lists](/assets/blog/python-named-reference/a_is_b_lists.PNG)

As you can see we created a list `a` and also bound the variable `b` to `a`. Checking the value of `b` we can see it contains the same values as `a`. However upon mutating `a` by changing its second element, `b` has also been updated!

The first steps of assigning `b` to `a` look like this:

```ascii
{a} ->
      |-> {list: [1, 5, 10]}
{b} ->
```

At this stage a check for both value equality via `==` and reference equality via `is `would return `True`. Upon updating the value of the list though, a new object in memory is not created like before, but updated in place. This causes the end result to look like this:

```ascii
{a} ->
      |-> {list: [1, 25, 10]}
{b} ->
```

and still, both a reference and value equality check would return `True`. The rabbit hole also goes deeper than what I've initially shown here, where the list itself is a collection of references to `int` objects in memory, and updating one causes a similar event to our first example around immutable types. A new ``{int:25}` is created, the reference in the list updated, and the old `{int 3}` garbage collected.

Two separate lists declared with identical values initially though would follow a different behavior, one that in some cases may be more in line with desired behavior.

![two_lists](/assets/blog/python-named-reference/two_lists.PNG)

Here you can see that both `a` and `b` point to two different objects in memory via checking for reference equality with `is`, and thus mutating one list does not effect the other.

```ascii
{a} -> {list: [1, 2, 3]}
{b} -> {list: [1, 2, 3]}
```

## Final Thoughts

Understanding this behavior has been extremely helpful in understand just what I'm asking the computer to do when working with variables, especially when working with mutable collections. I specifically remember a few occasions where I misused the `is` operator with collections and found myself confused on why two lists with identical values when printed out to console didn't cause `is` to return `True`. It also has helped me to appreciate some of the features from C# such as forcing a pass by value operation with function parameters.

Sometimes it helps to interrogate the man behind the curtain a bit.
