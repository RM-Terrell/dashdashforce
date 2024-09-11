---
title: "Variable Ownership and Borrowing in Rust"
excerpt: "Stay Rusty my friends."
coverImage: "/assets/blog/rust-variable-ownership/tetons.jpg"
date: "2021-06-26"
tags: [rust]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/rust-variable-ownership/tetons.jpg"
---

One of the central concepts of Rust is variable ownership, and Rust implements rather strict rules around what variables have access or control over what resources at a given time to prevent race conditions or other mangling of data. In general, **there is only one variable that binds to a resource at a time**. The exception here will be with primitives as I will show later. So lets see this in action.

## Collections

One of my main languages currently is Python so I will start first by showing an example of code running in Python, that when done in Rust causes a violation of Rust's ownership principals.

```python
    alpha = [1, 2, 3, 4]
    beta = alpha
    print(alpha)
```

This code prints out the list `alpha` just fine.

```bash
[1, 2, 3, 4]
```

Inspecting the pointer values of both `alpha` and `beta` via Python's `id()` method reveals that both variables now posses the same memory address pointing to the list. Heres the equivalent code in Rust.

```rust
    let alpha = vec![1,3,5,2,8];

    let beta = alpha;
    println!("{:?}", alpha);
```

Attempting to compile this however results in the following error

![rust_ownership_violation](/assets/blog/rust-variable-ownership/nope.png)

```bash
error[E0382]: borrow of moved value: `alpha`
 --> src/main.rs:6:22
  |
3 |     let alpha = vec![1,3,5,2,8];
  |         ----- move occurs because `alpha` has type `Vec<i32>`, which does not implement the `Copy` trait
4 |
5 |     let beta = alpha;
  |                ----- value moved here
6 |     println!("{:?}", alpha);
  |                      ^^^^^ value borrowed here after move

error: aborting due to previous error; 1 warning emitted
```

Whats happening here is that on line 3 where `beta` is assigned to `alpha`, control of the original vector resource sitting in the memory heap is given to `beta`, and `beta` exclusively, while `alpha` is invalidated for use until control is explicitly handed back to it. This prevents situations where two different variables might make changes to a single resource at different times, which can cause race conditions or unexpected data modification depending on how those variables are used. One way to hand control back would be to use a closure, where variable reassigned within closures can be used again onces outside the closure.

If in this situation you simply want `beta` to be a copy of all the values in `alpha` (thus making them two different vectors with the same starting data), you can make use of Rust's `.clone()` method, documented [here](https://doc.rust-lang.org/std/clone/trait.Clone.html).

This rule around ownership follows for all collections in Rust, like vectors, arrays, dictionaries, sets, etc. However with primitive types the situation is a bit different.

## Primitives

Copying of primitive types is very cheap as primitives are not pointers to data on the heap like a collection. Their size is known at compile time so they are stored entirely on the stack. As such, when you do the same sort of reassignment, Rust simply copies the value over into a new resource and assigns it to your variable as seen below.

```rust
    let alpha = "Diosdado";

    let beta = alpha;

    println!("{}", alpha);
    println!("{:p}", &alpha);
    println!("{}", beta);
    println!("{:p}", &beta);
```

Which results in

```bash
Diosdado
0x7ffee15ea010
Diosdado
0x7ffee15ea020
```

So everything works just fine and the new resource is created with the same value, but different pointers. One small wrinkle here is that the above example uses a string literal, not the `String` type, which is instead a heap allocated collection with a pointer. `String`s behave just like the vector examples in the previous sections.

## Boxing

If however you would like the same sort of behavior observed in collections, but with a primitive type, Rust can do that! Rust contains a feature called "boxing" documented [here](https://doc.rust-lang.org/std/boxed/struct.Box.html) that allows you to create a pointer for heap allocation for any type. If we wished to box Mr. Diosdado we would do it like so.

```rust
    let alpha = Box::new("Diosdado");

    let beta = alpha;

    println!("{}", alpha);
    println!("{:p}", &alpha);
    println!("{}", beta);
    println!("{:p}", &beta);
```

And now we're back to the same "moved" error as before.

![boxed_rust_ownership_violation](/assets/blog/rust-variable-ownership/boxed_error.png)

Also shout out to the VS Code Rust extensions fantastic hover documentation tips and overall visual error tools.

![docs](/assets/blog/rust-variable-ownership/docs.png)

Stay Rusty my friends.
