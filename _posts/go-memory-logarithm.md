---
title: "Using logarithms to size arrays in Go"
excerpt: "I should have paid more attention in highschool math."
coverImage: "/assets/blog/go-memory-logarithm/hidden_valley.JPG"
date: "2025-11-20"
tags: [go, math, algorithms, profiling]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/go-memory-logarithm/hidden_valley.JPG"
---

I love it when fundamental math concepts pop up in a practical problem.

In an attempt to more thoroughly learn Go and get better at algorithmic thinking, I've gone back to working through basic Code Wars problems with the goal of trying to solve each problem via drawing and sketching on an iPad first before I start typing out actual code. To those of you who this sounds obvious and trivial, I envy you. It sadly took this long into my software career before I realized the value of _drawing_ when working a problem vs just trying to solve it all in my head and lean on pattern recognition to solve problems vs step by step thinking and writing down the edge cases and requirements.

I recently worked on a seemingly very simple problem in Code Wars that was the following:

```txt
Given a random non-negative number, you have to return the digits of this number within an array in reverse order.

Example (Input => Output):
35231 => [1,3,2,5,3]
0     => [0]
```

I started with the obvious edge case of 0 as an input.

```txt
Input: 0 -> if 0 -> return empty array
```

Trivial to code that part so I shrunk that drawing and put it to the side to integrated in the final algo as the first line. Drawing out the rest of the problem, an obvious though computationally intensive solution came to mind first.

```txt
Input -> convert to string -> break each character into an array -> convert to number -> reverse? -> return the array.
```

In a language like Python the syntax would be pretty easy and intuitive. However, thats a lot of type conversions, especially when the input type (number) closely matches the output type (array of numbers). Can this be done without a conversion? Without a reversal at the end by iterating 0 to `len(input)` and appending?

Again back to drawing and trying to forget about the actual programming implementation details (I often get lost in these)

```txt
Input -> somehow get last digit -> append to front of array -> return the array
```

Getting the last digit thankfully is easy via the modulo operator `%` and using the value `10` as these numbers are base 10. So I know that line will be something like

```go
var digits []int

// loop code here {

digits[index] = n % 10

// } end loop
```

And to control the loop and index I could `range` over the length of the input digit from 0 assigning based on my current index position which will conveniently create an array in the reverse order of the input. Solved a couple problems there. But then how to "chop off" that last digit so I could start the loop again one closer to the first digit? I'll admit it took me an embarrassingly long time to remember that the mythical concept of "division" exists (again by 10)

```go
n /= 10
```

Redrawing once more I got:

```txt
Input -> create return array -> get length of input -> loop -> { modulo the last digit -> divide and reassign }-> return the array
```

But hang on, how do I "get length of input"? This input isn't a slice or string that I can run `len()` against. How does one get the number of digits in a number? That _sounds_ like something with a very elegant math solution but I wasn't sure how to find it. Turning the problem to Gemini "how do I get the number of digits in a number in general computer programming languages (no specific library tool)?" I was sent right back to highschool math.

A logarithm.

Logarithms essentially count 0s, and log<sub>10</sub>(x) asks the question "what power of 10 is the number `x`?

- **Number: 10**
  - Zeros: 1
  - Exponential: $10^1$
  - Logarithm: $\log_{10}(10) = 1$

- **Number: 100**
  - Zeros: 2
  - Exponential: $10^2$
  - Logarithm: $\log_{10}(100) = 2$

- **Number: 1000**
  - Zeros: 3
  - Exponential: $10^3$
  - Logarithm: $\log_{10}(1000) = 3$

- **Number: 1234**
  - Digits: 4
  - Exponential: $10^{3.09}$
  - Logarithm: $\log_{10}(1234) \approx 3.09$


Using this relation I can `math.log10()` my input number to get its number of `0`s. A few small wrinkles though, `log10()` in Go takes and returns a `float64` so a type conversion is needed there for my `int` input. Likewise in the case of 1234, I'm not interested in the `3.09` part of the full answer, I just want the `3`, so converting to an `int` again can be used to nicely floor the value.

One last detail is that if I send `10` into my function, the `log10()` will return 1, not 2 for the total number of digits. So I need to also add 1 each time. This solves the issue of passing in `9` and getting the answer `int(log10(int(9))) = 0`.

At this point I actually built and ran the whole function and it worked as intended but I made a second realization upon setting up the final return array as

```go
digits := []int{}
```

Now that I knew the number of digits in my input _I knew the number of values that needed to be stored in the slice_ so I could use a `make` command instead and pre-size the slice in memory to avoid reallocation as I added digits. The final code looked like this.

```go
import (
  "math"
)

func Digitize(n int) []int {
    if n == 0 {
        return []int{0}
    }

    count := int(math.Log10(float64(n))) + 1
    digits := make([]int, count)

    for idx := 0; idx < count; idx++ {
        digits[idx] = n % 10
        n /= 10
    }

    return digits
}
```

For being a rank 8 (the easiest problem class) on Code Wars that had a surprising number of interesting optimizations that could be done. For fun lets benchmark all the versions I came up with.

```go
package benchmarking

import (
    "math"
    "strconv"
)

// Final version
func Digitize(n int) []int {
    if n == 0 {
        return []int{0}
    }

    count := int(math.Log10(float64(n))) + 1
    digits := make([]int, count)

    for idx := 0; idx < count; idx++ {
        digits[idx] = n % 10
        n /= 10
    }

    return digits
}

// First instinct using a type conversion to string and then "shattering"
func DigitizeStringConv(n int) []int {
    if n == 0 {
        return []int{0}
    }

    s := strconv.Itoa(n)
    digits := make([]int, len(s))

    for i := 0; i < len(s); i++ {
        digits[i] = int(s[len(s)-1-i] - '0')
    }

    return digits
    }

// Close to my final version, but without a pre-alloc of the slice
func DigitizeAppend(n int) []int {
    if n == 0 {
        return []int{0}
    }

    digits := []int{}

    for n > 0 {
        remainder := n % 10
        digits = append(digits, remainder)
        n /= 10
    }

    return digits
}

```

and the benchmark setup

```go
package benchmarking

import (
    "testing"
)

var testNumber1 = 1234
var testNumber2 = 123456789

func BenchmarkDigitize(b *testing.B) {
    b.ReportAllocs()
    for b.Loop() {
        Digitize(testNumber2)
    }
}

func BenchmarkDigitizeAppend(b *testing.B) {
    b.ReportAllocs()
    for b.Loop() {
        DigitizeAppend(testNumber2)
    }
}

func BenchmarkDigitizeConv(b *testing.B) {
    b.ReportAllocs()
    for b.Loop() {
        DigitizeStringConv(testNumber2)
    }
}
```

Which gives the following results

```bash
Running tool: /usr/local/go/bin/go test -benchmem -run=^$ -bench ^BenchmarkDigitize$ check_check/benchmarking

goos: linux
goarch: arm64
pkg: check_check/benchmarking
BenchmarkDigitize-6    41536802         27.45 ns/op       80 B/op        1 allocs/op
PASS
ok   check_check/benchmarking 1.143s

Running tool: /usr/local/go/bin/go test -benchmem -run=^$ -bench ^BenchmarkDigitizeAppend$ check_check/benchmarking

goos: linux
goarch: arm64
pkg: check_check/benchmarking
BenchmarkDigitizeAppend-6    12497330         94.87 ns/op      248 B/op        5 allocs/op
PASS
ok   check_check/benchmarking 1.188s

Running tool: /usr/local/go/bin/go test -benchmem -run=^$ -bench ^BenchmarkDigitizeConv$ check_check/benchmarking

goos: linux
goarch: arm64
pkg: check_check/benchmarking
BenchmarkDigitizeConv-6    29294073         42.43 ns/op       96 B/op        2 allocs/op
PASS
ok   check_check/benchmarking 1.247s
```

Interestingly the Append version has not just the worst memory allocation trashing but _also_ ns/op as it keeps expanding the slice with each `.append` call, while the string conversion implementation faired pretty well due to its more efficient slice pre-alloc. I was actually surprised by that and expected the number-string type conversions of `DigitizeStringConv()` to be more expensive.

I should draw and benchmark more.
