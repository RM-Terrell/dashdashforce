---
title: "Go unit testing in VSCode"
excerpt: "Command line tools are great but sometimes its easier to just click a button."
coverImage: "public/assets/blog/vscode-go-testing/frisco-spring.JPG"
date: "2022-05-24"
tags: [go, testing]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "public/assets/blog/vscode-go-testing/frisco-spring.JPG"
---

I really like unit testing. And even more than unit testing I like tools that make it easy to do a lot of it quickly and get useful information back. In the past I've used a few coverage tools that print out tables with information on lines that are covered vs not covered but [the Go extension from Google for VSCode](https://marketplace.visualstudio.com/items?itemName=golang.go) is a real stand out to me now. Beyond the usual syntax highlighting and code navigation tools, it adds tooling to quickly generate tests for a given function, and visual coverage tools for those tests. Let's take a look.

## Visual Coverage Reporting

All the main features of the extension can be accessed via the right click menu towards the bottom and what they do is pretty self explanatory. But one option I went an oddly long time without clicking is "Toggle test coverage in current package" seen here:

![toggle coverage](/assets/blog/vscode-go-testing/toggle_coverage.png)

Clicking this does something pretty sweet. After a few seconds of running tests (you'll see a "Cancel Running Tests" bit of text at the bottom right of your editor while they're running) the code in the whole package will now have a red / green overlay indicating which lines are covered by tests and which are not.

![coverage highlights](/assets/blog/vscode-go-testing/coverage_highlighting.png)

In this example you can see the last function `SumCubes()` is not covered. This overlay is even customizable in its colors and styling via these settings in Vscode:

![highlight settings](/assets/blog/vscode-go-testing/coverage_settings.png)

Clicking the option again from its right click menu will remove the overlay. Coverage reports via tables and text outputs are great but being able to just _see_ the lines that aren't covered with a quick scroll is so much faster for finding missed execution paths in new code.

## Test Scaffolding

In order to make tests for uncovered functions the extension also makes things easy. Working with the uncovered `SumCubes()` function simply right clicking it and selecting "Generate Unit Tests for Function" will create a new `name_of_functions_file_test.go` if it doesn't already exit, or in my case tack on the following code to my existing test file:

```go
func TestSumCubes(t *testing.T) {
    type args struct {
        n int
    }
    tests := []struct {
        name string
        args args
        want int
    }{
        // TODO: Add test cases.
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := SumCubes(tt.args.n); got != tt.want {
                 t.Errorf("SumCubes() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

BAM! Unit testing can be pretty time consuming due to the amount of boiler plate code that has to be written, to the point that in the past when writing React tests I added a Vscode snippet to generate it all for me, but this is even better due to its awareness of function names, arguments and return types, and how it uses all this info to pre-populate a significant amount of the unit testing boilerplate with the correct info for your specific function.

## Visual Debugging Buttons in the UI

Another feature I love about this extension is that it adds all the buttons need to run tests, run multiple tests, and even debug tests right into the editors UI. Command line tools are great but sometimes its easier to just click a button. For each test it adds a big green arrow button in the left gutter next to the test function name to run the test, along with the smaller text "debug test" above the function name. It also populates the preexisting left side panel Testing button with information about your tests like pass / fails or whether they've been ran or not.

![test runs](/assets/blog/vscode-go-testing/all_tests_run.png)

All in all this extension is amazing for those as unit test obsessed as myself. Happy testing!
