---
title: "React Basics: State vs Props"
excerpt: "Humble pie, meet face."
coverImage: "/assets/blog/react-state-vs-props/winter_park_trees.jpg"
date: "2020-07-10"
tags: [react, javascript, project orbital]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/react-state-vs-props/winter_park_trees.jpg"
---

I recently bombed a _really_ easy interview question around React and it has bothered me ever since. The question was simply: "Can you explain to me the difference between State and Props in React?"

I had some very surface deep understanding of what was going on with state, enough to scrape together something resembling working code in the past, but I didn't _truly_ understand it in a way that I could explain its difference clearly, which frankly meant I didn't understand it at all. Between that and nerves I had to tell the guy I didn't know. Humble pie, meet face. It truly is amazing how valuable the act of asking very simple, very direct questions is when one is learning a new subject. Like any good exam though, this was a learning opportunity, so lets learn about State vs Props. This post and its examples will be _extremely_ simple, so if you are even slightly more than a beginning React user this will be a snore fest.

## Some background

As part of rebuilding my old application "Project Orbital" (a few other posts of mine revolve around that app) I've been trying to learn React. I had scraped together a few simple bits of UI and thought I understood some of what was going on. As such when I saw a posting for Junior React developer position I decided to go for it, which is what lead to my hilariously bad interview. I had "learned" React in a very ad hoc way, basically just googling around trying to make what I wanted to do _just work_ which lead to a lack of understanding of the basic, fundamental aspects of how the React library works.

Ever since I've been trying to approach React (and all things) with a clearer sense of "beginners mind" as the Zen practitioners like to call it. Drop all previous assumptions, ask and answer all questions that come to mind honestly, and never stop doing that. Approach every problem like its the first time.

## Props

Props (or Properties) are data/code/etc that are passed down from parent to child components in a one directional manner. If you _do_ need data to flow upwards from child to parent there are ways to do that, but basic props are not it and I wont be covering it here. Some code examples will clarify this.

```javascript
import React, { Component } from 'react';


class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>H1 Header</h1>
        <Paragraph />
      </div>
    );
  }
}

function Paragraph(props) {
  const { text } = props;

  return (
    <p>{text}</p>
  );
}

export default App;
```

In this example we have two components, App and Paragraph. App acts as the parent component, rendering an instance of Paragraph under its `<h1>` element. As is coded here, the Paragraph component will render an empty `<p>` tag. Lets say we wanted to render Paragraph with text determined by the parent component App. That is where props are used, text passed down from parent to child.

You can see in the above example I've already done some preparing for it. The Paragraph component takes in `props` as a parameter, and then through object destructuring pulls out the `text` prop and assigns it to a variable of the same name. If we wanted more props we could do that right there in the destructuring by adding more declarations. The assigned value of `text` is then rendered inside the components returned `<p>` element.

To pass actual text as a prop to the component we do it like so:

```javascript
import React, { Component } from 'react';


class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>H1 Header</h1>
        <Paragraph text="Paragraph text goes here" />
      </div>
    );
  }
}

function Paragraph(props) {
  const { text } = props;

  return (
    <p>{text}</p>
  );
}

export default App;
```

## State

State on the other hand deals with well...the state of a particular component. This has an enormous potential number of uses and is so far my favorite aspect of React. Tracking if a check box is checked, an input filled, a button clicked once or twenty times can turn into a significant nightmare without something like React. Between inline HTML event calls, separate JS file eventListeners added on in who knows what order from who knows how many files, it can all become a real trip down the proverbial rabbit hole. React acts as a far better guide to it all than the Mad Hatter.

Heres an example working off the same App component we had before. Lets add a section that renders out some data stored in JavaScript.

```javascript
import React, { Component } from 'react';


class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>H1 Header</h1>
        <SubjectData />
      </div>
    );
  }
}

class SubjectData extends Component {
  state = {
    name: "Gordon Freeman",
    age: 42,
    occupation: "Level 3 Research Associate Scientist",
  }

  render() {
    return (
      <div>
        <div>{this.state.name}</div>
        <div>{this.state.age}</div>
        <div>{this.state.occupation}</div>
      </div>
    )
  }
}

export default App;
```

As you can see the SubjectData component doesn't get its information displayed from its parent but stores it internally. Very importantly, this information can be managed from within the component, as it all lives inside the `state` object. We could add a button inside the SubjectData component that when clicked increments or decrements the age value, or have input for changing the name, or hook all this up to a REST API or other JS helper functions and the skies the limits. Warning, people have opinions on how/when/if you should update state. I won't get into them here but there are good reasons worth researching. Maybe pack a flame suit.

Most web frameworks attempt to add smart functionality to existing HTML code, like Django's template tag system, or the Vue `v-` commands. This gives you tools to work with, but just the tools provided by the framework. They are pretty opinionated which can be both good or bad depending what you want to do. React however, being a library that flips this idea and puts HTML inside JavScript, you get the full feature set of JavaScript right there next to your HTML code. State is one of the big concepts that allows you to do this.

A few important notes on state. When the state of a component is changed, React is informed and re-renders the DOM of that particular component. Not the whole DOM, just the part modified. This is one of the other super powers of React, it is very efficient in what it re-renders and when.

Also, in my example above I had both components declared as classes that extends Component. Only class based React components have state. If you don't need state you can write your component as a "functional component" which is written as a function instead. My first example with the Paragraph component is an example of a functional component. If you make a functional component and try to add state to it and its not working, you'll need to make it class based instead. There are a few schools of thought on this, some saying that you should _always_ write a component as a functional component first and only make it a class based one when you need to. I won't weigh in on those ideas yet, but they exist and are worth exploring. React inheritably has a lot of freedom too it so there are a lot of design patterns and best practices to debate. The bike shed is technicolor.

## Editor integrations

Slight tangent. One reason I've come to love React, is with everything stored in JavaScript files, and imported / exported with modern `import` / `export` statements, I've noticed some editors hints and integrations that have never been possible (in my experience so far) with other UI technologies. Heres an example of VScode giving an intellisense hint for the contents of my components state. Brilliant.

![intel](/assets/blog/react-state-vs-props/intel.png)

I'm sure Jet Brains has built some crazy IDE for Visual Basic or something tht gives similar functionality (those guys are wizards), but such minimal effort and setup for such useful developer feedback is fantastic. All in a free, open source editor.

## But to answer the original question

Props are data passed exclusively from parent to child components in a one directional manner. This can be things like rendered text, function instances, images, etc. State controls the current state of a particular element. It can be used to track things like if a button component is clicked or not, a value is entered, a color is changed, etc.

There's one interview question down I wont fail so badly next time.

May your builds be clean and your linter warnings few. Cheers.
