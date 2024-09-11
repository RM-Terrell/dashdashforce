---
title: "Generating a Go trace and streaming it out of a pod"
excerpt: "...never fear there is a solution for that too in the form of using cat."
coverImage: "/assets/blog/streaming-go-trace/whistler_1.jpg"
date: "2022-03-09"
tags: [kubernetes, docker, go]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/streaming-go-trace/whistler_1.jpg"
---

I recently found out that Go comes with a very useful built in trace generation tool, and when combined with the `graphviz` library allows for very easy analysis of a code trace. However. Once that trace file is generated inside of a container / pod, how do you get it back out onto your local machine for analysis? One solution is using the `tar` tool, however depending on what your base image is you may not have access to it. Never fear there is a solution for that too in the form of using `cat`.

## Instrumenting the code

First off, the code in question needs to be instrumented. For those unfamiliar this is similar in practice to the act of manually adding break points with `pdb` and similar tools, except the result wont be code execution pausing but the generation of a trace file that will show us info about what happened to the code when it ran.

Lets say you have a code block like this that is running inside a K8s pod.

```go
func DoAThing() {
    var variableYouCareAbout int
    var moreStuff int

    // <some more go logic here you want traced>

    return result
}
```

To instrument it for trace analysis simply add the following

```go
func DoAThing() {
    // new code to start trace
    trace_dir := "/tmp/trace_dir"
    err = os.Mkdir(trace_dir, 0777)

    if err != nil {
        log.Errorf("Couldnt generate trace file directory: %v\n", err)
    }

    file_name := path.Join(trace_dir, "trace.out")

    f, err := os.Create(file_name)

    if err != nil {
        log.Errorf("Couldnt generate trace.out file: %v\n", err)
    }

    defer func() {
        if err := f.Close(); err != nil {
            log.Errorf("Couldnt close file: %v\n", err)
        }
    }

    if err := trace.Start(f); err != nil {
        log.Errorf("Couldnt start trace: %d\n", err)
    }

    var variableYouCareAbout int
    var moreStuff int

    // <some more go logic here you want traced>

    // new code to stop the trace
    defer trace.Stop()

    return result
}
```

If it isn't automatically added to your imports, add

```go
import (
    "runtime/trace"
)
```

to your imports.

## Getting the trace file back out

This code when ran will generate a `trace.out` file in the `tmp` directory. If there are issues setting this process up it should also log some useful errors as to why. This `trace.out` file is the one we will open locally to analyze but first we need to get it out of the running container. `tar` is an easy choice if you have access to it in the pod, for those who don't however and are using K8s, the following will also work. Run this on your local machine (not in the pod):

```bash
kubectl exec \
    --namespace <your_namespace> \
    <name_of_pod_with_file> -c <name_of_container_for_that_pod> \
    -- cat /tmp/trace_dir/trace.out > /path/you/want/the/file/dropped/into/trace.out
```

Then make sure you have `graphviz` installed with the following (assuming you're on a Mac, tweak install as needed as `graphviz` is available on many platforms)

```bash
brew install graphviz
```

Then run the following in the directory you `cat`'d the file into:

```bash
go tool trace trace.out
```

After this your browser should open up with the trace. There are a significant number of tabs and features here to explore so consult its documentation [here](https://about.sourcegraph.com/go/an-introduction-to-go-tool-trace-rhys-hiltner/) for more info.

Happy tracing!
