---
title: "How to use interfaces to create mocks in Golang unit tests"
excerpt: "Now that you've successfully made your code more complicated without adding anything of new value to it, let's get to the actual benefits..."
coverImage: "/assets/blog/golang-interface-test/river_flowing.jpg"
date: "2022-09-27"
tags: [go, unit testing, tests, testing]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/golang-interface-test/river_flowing.jpg"
---

This post was inspired by a few months of adventures at my current company in trying to increase unit test coverage on a series of Go packages that make use of AWS, Azure, GCP and other related cloud SDKs. The issue of how to simulate responses from these SDK calls that were deeply imbedded into the source code is what inspired this eventual solution. I don't pretend this is the absolute be-all end-all of unit testing with third party SDKs but it resulted in a really useful way of getting good line coverage for diverging code paths while learning about some fundamental Go features, in this case Interfaces.

### The Problem

Let's say you have some code like this

```go
func DoAUsefulThing(input string) (string, error) {
    sdkResult, err := SDKPackage.DoAThing(input)
    updatedValues := ""
    if err != nil {
        // logging code here
        return nil, fmt.ErrorF("Things went wrong")
    }
    if sdkResult == "some expected value" {
        updatedValues = anInternalMethod(sdkResult)
    } else {
        updatedValues = anotherInternalMethod(sdkResult)
    }
    return updatedValues, nil
}
```

and you want to unit test it with a high degree of coverage, with `SDKPackage.DoAThing()` being some SDK like AWS or Azure, and the internalMethod functions being some other functions sitting in the same package. Here we have a unique problem. In order to unit test the diverging code paths that depend on the value of `sdkResult` or its corresponding error we need to control what the SDK returns. Also not all SDk calls are as clean and simple as this. Sometimes they need login credentials or calls to live servers, non of which we really want to deal with in unit testing. In order to mock out this functionality in testing more easily we can refactor our code to use an interface instead of directly calling the SDK method and the swap out interface methods per test. This also works for mocking out other internal methods if you so wish to mock those for testing.

### Interfaces

To start we move the `SDKPackage.DoAThing(input)` call into its own method inside the package. I'm using a naming convention here of calling them `SomeFunctionNameWrapper` with the intent of having this method contain nothing but the SDK call that I want to mock with no other "business logic" that might need to be tested. The code after refactoring will look kinda like this

```go
func DoAUsefulThing(input string) (string, error) {
    sdkResult, err := SDKDoAThingWrapper(input)
    updatedValues := ""
    if err != nil {
        // logging code here
        return nil, fmt.ErrorF("Things went wrong")
    }
    if sdkResult == "some expected value" {
        updatedValues = anInternalMethod(sdkResult)
    } else {
        updatedValues = anotherInternalMethod(sdkResult)
    }
    return updatedValues, nil
}

func SDKDoAThingWrapper(input string) (string, error) {
    sdkResult, err := SDKPackage.DoAThing(input)
    return sdkResult, err
}
```

This doesn't do much more than add more lines of code so the next step is to put the new Wrapper method behind an interface.

```go
type UsefulStuffProvider struct {
    SDKWrappers ISDKWrappers
}

func (p *UsefulStuffProvider) DoAUsefulThing(input string) (string, error) {
    sdkResult, err := p.SDKWrappers.SDKDoAThingWrapper(input)
    updatedValues := ""
    if err != nil {
        // some logging code here
        return nil, fmt.ErrorF("Things went wrong")
    }
    if sdkResult == "some expected value" {
        updatedValues = anInternalMethod(sdkResult)
    } else {
        updatedValues = anotherInternalMethod(sdkResult)
    }
    return updatedValues, nil
}


type ISDKWrappers interface {
    SDKDoAThingWrapper(input string) (string, error)
}

type SDKProviderWrappers {}

func SDKDoAThingWrapper(input string) (string, error) {
    sdkResult, err := SDKPackage.DoAThing(input)
    return sdkResult, err
}
```

And then where `DoAUsefulThing()` is implemented set it up like so

```go
provider := &UsefulStuffProvider{
    SDKWrappers: &SDKProviderWrappers{}
}

provider.DoAUsefulTing()

```

A lot just happened. First off we have a new type `ISDKWrappers` which is an interface. The `I` at the beginning is a convention from a lot in other languages to indicate an interface but is not required in Go. Feel free to use another, more clear name if you wish. Now the tricky thing about Go and interfaces is that *interfaces are implicitly implemented*. In other words _any type that has ALL the method signatures that are part of the interface, implements the interface_. Other languages require an `implements` keyword or something similar to use the interface. Not Go. Just know that you need ALL the exact same method sigs to use your interface. If you're missing one it wont work. This will come in needed when we build our testing versions later. More on interfaces [here](https://www.golangprograms.com/go-language/interface.html).

Second of all we have our type `UsefulStuffProvider` struct that our `DoAUsefulThing()` method is now implemented on and a change to how `SDKDoAThingWrapper()` is called to match that change. At this point your code should still run the same as before.

### Test Mocks

Now that you've successfully made your code more complicated without adding anything of new value to it, let's get to the actual benefits.

The `sdkResult` value check that gates the `if/else` blocks are probably the most important to get test assertions going against in a controlled manner. We want both those branches covered (and later the logging step too for in case of an error) so we want to simulate that inside unit tests.

Inside your unit test file make a new struct something like this

```go
type mockedSDKWrappers struct {
    MockedSDKDoAThingWrapper func() (string, error)
}
```

followed by a function like this

```go
func (m *mockedSDKWrappers) SDKDoAThingWrapper(input string) (string, error) {
    if m.MockedSDKDoAThingWrapper != nil {
        return m.MockedSDKDoAThingWrapper()
    }
    result := "some expected value"
    return result, nil
}
```

The `mockedSDKWrappers` struct fulfills the same role as the struct in our source code that will implement all our interface methods. Note that `SDKDoAThingWrapper` is the exact same sig as our original code as per the interface and by default when tests are ran will return the values you program in there. In this example it will always return `"some expected value"` and serves as a default case thus allowing us to unit test the first `if` block of the code with no additional changes to tests.

However our struct and its testing method have an extra trick. They can have a `MockedSDKDoAThingWrapper` which when present will be returned instead of the original version you wrote that always returned the name value. We can use this to make that wrapper function return a different value or return an error. Heres how you'll use that in a test.

```go
func TestDoAThingNotExpected(t *testing.T) {
    inputValue := "some input"
    mocks := &mockedSDKWrappers{
        MockedSDKDoAThingWrapper: func() (string, error){
            otherResult := "different unexpected value"
            return otherResult, nil
        }
    }
    usefulStuffProvider := UsefulStuffProvider{mocks}
    result, err := usefulStuffProvider.DoAUsefulThing(inputValue)

    // assertions against results here
}
```

And with that this test should now execute the second code `else` code path and you can run assertions against its return value. You could also set `MockedSDKDoAThingWrapper` to return an error instead of a string to test the error logging if you so wished. For some more reading [heres an article](https://medium.com/swlh/golangs-interfaces-explained-with-mocks-886f69eca6f0) on explaining interfaces using unit tests that helped me build some of this out.

Bonus tip: The Go extension for VSCode features a visual tool for viewing unit test code coverage. You can right click in the file you are testing, go to the bottom of the right click menu, then click the "Toggle test coverage in current package" option. Tests will now run in the background and once they're done you should see green / red highlighting for covered / not covered lines.

Happy mocking!
