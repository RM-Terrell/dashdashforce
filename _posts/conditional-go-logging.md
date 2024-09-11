---
title: "Conditional Call Stack Based Logging in Go"
excerpt: "The ability to pause everything and inspect every variable at a specific point is like programming with your third eye open in a way that a good old print() statement can't hope to compete with. However..."
coverImage: "/assets/blog/conditional-go-logging/adams_fire.jpg"
date: "2021-11-30"
tags: [go]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/conditional-go-logging/adams_fire.jpg"
---

I like debuggers a lot. The ability to pause everything and inspect every variable at a specific point is like programming with your third eye open in a way that a good old `print()` statement can't hope to compete with. However there are occasions (especially when working on a remotely deployed application) that the process of hooking up a debugger to a process can be tricky and possibly not worth the effort for a quick inspection of some data. However. If the code in question happens to be a function or bit of code that is highly reused by many parts of the rest of the code base, and as such will get called MANY times in the process of performing some behavior you want to inspect, the sheer number of logs can be an issue. It can all feel like looking for a needle in needle stack.

Eventually I thought to myself "if only I could only log out the variable I want to inspect when it was in the call stack of a particular function I cared about....hey wait a second." Turns out this isn't hard to do at all and most languages probably support something like this.

Lets say you have a function that calls down into another reused function called `ReusedFunction()`, and you only want to log out data when `ReusedFunction()` is called by `FunctionOfInterest()`. You can make use of the Go standard library `debug.stack()` feature to get the entire stack at that point, then do a string comparison to see if `FunctionOfInterest()` is in there. If it is, log it.

```go

func ReusedFunction() int {
    ...
    if strings.Contains(string(debug.Stack()), "FunctionOfInterest") {
        log.Infof("FunctionNameOfInterest variableOfConcern: %v", variableOfConcern)
    }
    ...
}
```

And with that you'll only have logs when you want them. Toss that one in the file that I know you have for keeping useful stuff you copy paste a lot.

Happy logging!
