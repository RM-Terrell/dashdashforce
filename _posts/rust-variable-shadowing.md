---
title: "Variable shadowing and scoping in Rust"
excerpt: "Having been raised in the Mad Max-esque craziness that is JavaScript's scoping system, learning Rust has been a real breath of fresh air."
coverImage: "/assets/blog/rust-variable-shadowing/a_basin.jpg"
date: "2021-05-26"
tags: [rust]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/rust-variable-shadowing/a_basin.jpg"
---

Having been raised in the Mad Max-esque craziness that is JavaScript's scoping system, learning Rust has been a real breath of fresh air. However that doesn't make it totally free of some sneaky behaviors. One in particular is the concept of variable shadowing, and how it can lead to some odd code execution when re-declaring variables. Let's take a look.

## Scoping

Rust follows pretty straight forward rules when it comes to scoping. Generally, if a variable is declared within a `{}` block, the curly brackets define the scope by which that variable can be accessed. If you try to access the variable outside of it, you'll compilation errors. For example:

```rust
fn main() {
    let alpha = 117;
    {
        let beta = 2077;
    }
    println!("value of beta: {}", beta);
}
```

will result in

```bash
 --> src\main.rs:8:38
  |
8 |     println!("Value of beta: {}", beta);
  |                                      ^^^^ not found in this scope
```

as the curly brackets around the declaration of `beta` create a scope outside of which it cannot be accessed. This is true of function declaration, loop iterations, etc. Also of note is that Rust has some seriously clear error messages.

## Shadowing

But what if we try to access `alpha` inside the scoped block?

```rust
fn main() {
    let alpha = 117;
    {
        let beta = 2077;
        println!("Value of alpha: {}", alpha);
    }
}
```

```bash
Value of alpha: 117
```

Makes pretty good sense right? The inner scoped declared by the curly brackets gets access to all variables declared in the outer scope.

But what if we redeclare `alpha` inside the inner scope and then access it again in the outer scope?

```rust
fn main() {
    let alpha = 117;
    {
        let beta = 2077;
        let alpha = 451;
        println!("Value of inner alpha: {}", alpha);
    }
    println!("Value of outer alpha: {}", alpha);
}
```

```bash
Value of inner alpha: 451
Value of outer alpha: 117
```

Well that's interesting. Declaring `alpha` again within the inner scope didn't cause any compilation warning or error and seems to have created two totally separate variables. Inspecting the pointer addresses shows that that is indeed what has happened, signified by their different addresses.

```rust
fn main() {
    let alpha = 117;
    {
        let beta = 2077;
        let alpha = 451;
        println!("Value of inner alpha: {}", alpha);
        println!("Address of inner alpha: {:p}", &alpha);
    }
    println!("Value of outer alpha: {}", alpha);
    println!("Address of outer alpha: {:p}", &alpha);
}
```

```bash
Value of inner alpha: 451
Address of inner alpha: 0x620b6ff3dc
Value of outer alpha: 117
Address of outer alpha: 0x620b6ff3d8
```

So what if we try to declare a variable twice within the _same_ scope?

```rust
fn main() {
    let alpha = 117;
    println!("Value of alpha: {}", alpha);
    println!("Address of alpha: {:p}", &alpha);
    let alpha = 451;
    println!("Value of alpha after re-declaration: {}", alpha);
    println!("Address of re-declared alpha: {:p}", &alpha);
}
```

```bash
Value of alpha: 117
Address of alpha: 0x6d7251f88c
Value of alpha after re-declaration: 451
Address of re-declared alpha: 0x6d7251f92c
```

Once again no errors or warning on compilation, and a second variable is created also of the name `alpha` with a different pointer that overrides the first `alpha`.

## Updating within an inner scope

Updating the value of `alpha` within the inner block does indeed persist that change to the outer scope without creating a new variable as seen here:

```rust
fn main() {
    let mut alpha = 117;
    println!("value of alpha after declaration: {}", alpha);
    {
        alpha = 451;
        println!("value of inner alpha: {}", alpha);
        println!("Address of inner alpha: {:p}", &alpha);
    }
    println!("Value of outer alpha: {}", alpha);
    println!("Address of outer alpha: {:p}", &alpha);
}
```

```bash
value of alpha after declaration: 117
value of inner alpha: 451
Address of inner alpha: 0x5f02eff4d4
Value of outer alpha: 451
Address of outer alpha: 0x5f02eff4d4
```

May your code be well oxidized.
