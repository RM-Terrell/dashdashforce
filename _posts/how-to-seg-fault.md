---
title: "How to get a segmentation violation in Go"
excerpt: "Even though I've been writing Go for a bit now there are still occasions when something in the basics jumps out and bites me. This was one of them."
coverImage: "/assets/blog/go-seg-fault/fog.jpg"
date: "2022-11-14"
tags: [go]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/go-seg-fault/fog.jpg"
---

Today I learned the important difference between "declaring" variables in Go with a starting value, and just "initializing" them. Turns out its important. Who knew?

## The problem

When working with the AWS SDK for Go I was trying to list off a group of EKS clusters and do some work on each cluster. Pretty basic task. My first attempt at solving this looked something like this and simply got all the clusters from the AWS SDK (I have the listing function wrapped inside the `listClusters` function on the `aws` package) and it then appends on the clusters until there is no `nextToken` present. To give a hint of the issue I hit, take a look at line 2.

```go
var nextToken *string = nil
var finalListClustersOutput *eks.ListClustersOutput
keepLooping := true

for keepLooping {
    input := &eks.ListClustersInput{
        NextToken: nextToken,
    }

    listClustersOutput, _ := aws.listClusters(eksClient, input)

    finalListClustersOutput.Clusters = append(finalListClustersOutput.Clusters, listClustersOutput.Clusters...)
    nextToken = listClustersOutput.NextToken

    keepLooping = nextToken != nil
}
```

On running this however I hit the dreaded Segmentation Violation error which was certainly _not_ was I was expecting for such a simple bit of code.

```bash
Running tool: /usr/local/go/bin/go test -timeout 30s -run ^TestFunction$ path/to/function/being/tested

--- FAIL: TestFunction (0.00s)
panic: runtime error: invalid memory address or nil pointer dereference [recovered]
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1]
```

Hooking up a debugger to this code stack and inspecting the `finalListClustersOutput` variable showed that it was indeed `nil`.

```bash
finalListClustersOutput: *github.com/aws/aws-sdk-go/service/eks.ListClustersOutput nil
```

## The fix

Even though I've been writing Go for a bit now there are still occasions when something in the basics jumps out and bites me. This was one of them.

```go
var finalListClustersOutput *eks.ListClustersOutput
```

What this line does is initialize the variable `finalListClustersOutput` but does so with the type being a pointer to EKS ListClustersOutput, and then critically _initializes it to its zero value_ which in our case is, you guessed it, `nil`. If you do this with an `int` type variable you'll get a starting value of `0` for example. I spent a lot of time writing Python and JS before my current gig so some part of my brain thought when I initialized a variable this way it defined the type and then....well I don't know did magic or something to let me add values to it, something like creating an empty list of clusters. Not so. As a result on the first `.append` pass the code would try to append to `nil` and thus panic.

The solution is luckily very simple.

```go
var nextToken *string = nil
var clusterNameList []*string
keepLooping := true

for keepLooping {
    input := &eks.ListClustersInput{
        NextToken: nextToken,
    }

    listClustersOutput, _ := aws.listClustersWrapper(eksClient, input)

    clusterNameList = append(clusterNameList, listClustersOutput.Clusters...)
    nextToken = listClustersOutput.NextToken

    keepLooping = nextToken != nil
}
```

Now there is a proper list of strings to append values to and the code runs as expected. An alternative is to create a pointer to an instance instead of a nil pointer, something like this

```go
finalListClustersOutput := &eks.ListClustersOutput{}
```

Happy appending!
