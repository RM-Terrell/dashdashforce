---
title: "Shoshin 2: Jest tests can be ran asynchronous"
excerpt: "Me and async clearly don't have a great relationship..."
coverImage: "/assets/blog/jest-test-async/whitley.jpg"
date: "2021-01-18"
tags: [javascript, jest, shoshin]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/jest-test-async/whitley.jpg"
---

Me and async clearly don't have a great relationship, and once again, taking the time to slow down and read the manual is very important. Just because you've never seen `async` used in a test doesn't mean it doesn't exist.

I was working on a set of Jest tests for some React code using React Testing Library and was specifically working on testing a table that loads data from a REST API call. This table uses a `.fetch()` to get the data, then `.setState()` to update the table state with the new data. I had successfully mocked out the function containing the `fetch()` call, so I thought I was in the clear testing wise to run assertions against the table loading with new data.

My test originally looked like this:

```javascript
import React from 'react';
import {
    render, cleanup, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import Table from './Table';

// fetch call function being mocked out
jest.mock('./getData');

const someJsonData = {}:

test(`Given the table is rendered, verify it loads some mocked data.`, () => {
    getData.mockImplementation(() => someJsonData);
    render(<Table />);

    // Look for content inside table
    expect(screen.queryByText('text that should be present')).toBeInTheDocument();
});
```

At this point I was just starting with Jest and had used a VSCode extension to auto fill the test boiler plate. Coming from a background of Python testing, QUnit, and Selenium testing (the king of crazy wait statements, this matters in a bit) this all looked pretty reasonable. However on running the test, the assertion for the content that should be in one of the table rows would fail. I knew the mock was working from some previous testing, so I tossed in a `screen.debug()` command to see what the table looked like before the assertion.

Sure enough the table rows were empty, though the header, title, and other static content was there. So all the content not part of the new `setState()` call was not there, but everything else was....suspicious. Maybe I need to...wait for the data to be there? How do I wait for a `setState()` command?

My first thought was terrible and I started thinking about ways to wait for amounts of time, or ping the rendered HTML for the presence of some element, then move on. My Selenium instincts trying to drive me to madness. I hoped there had to be a better way here and luckily there was.

Turning to the Jest docs and looking at their examples, my code seemed fine at first glance, except on closer inspection I noticed the presence of something I'd never seen done in a unit test before. An `async` unit test! And sure enough, that would allow me to `await render()` the component, which would wait until its internal `setState()` call had completed.

Refactoring the code based on React Testing Libraries docs I landed on this

```javascript
import React from 'react';
import {
    render, cleanup, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import Table from './Table';

// fetch call function being mocked out
jest.mock('./getData');

const someJsonData = {}:

test(`Given the table is rendered, verify it loads some mocked data.`, async () => {
    getData.mockImplementation(() => someJsonData);
    await render(<Table />);

    // Look for content inside table
    expect(screen.queryByText('text that should be present')).toBeInTheDocument();
});
```

And sure enough the assertion now passed and the `screen.debug()` showed the table looking as expected. I also discovered the VSCode extension command I was using to fill out the boiler plate has a `testa` command (vs `test` that i was using previously) that fills out an async version of a Jest test. Much more useful for testing React code.

The extension in question is "ES7 React/Redux/GraphQL/React-Native snippets" and it is very much worth checking out if you work with any of the tech in it's title, or Jest.

Happy testing.
