---
title: "Setting up Cypress tests in multiple directories"
excerpt: "Such large refactors always have That One Dumb Thing that trips you up for a minute because it's weirdly hard to figure out just from docs."
coverImage: "/assets/blog/cypress-multiple-directories/steamboat_trees.jpg"
date: "2023-05-20"
tags: [cypress, javascript, testing]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/cypress-multiple-directories/steamboat_trees.jpg"
---

I've been learning a bit about end to end testing in Cypress through a project that involves re-architecting the UI of our application to work as a micro-frontends application. Each part of the larger application lives in its own subdirectory location and as part of this effort I've been moving end to end tests for each module into said subdirectory (from their default locations in `./cypress/`) along with making other changes to optimize how and when these tests run.

Such large refactors always have That One Dumb Thing that trips you up for a minute because it's weirdly hard to figure out just from docs. In this case after moving test files into their respective subdirectories, the Cypress test runner couldn't find those tests. Our system uses Cypress version 9 so the first tricky bit was that the Cypress API seems to have changed quite a lot after version 10. If you're on 10+ my fixes below won't be direct copy/pastes but should still be helpful. Cypress docs are indicated as "Legacy" for versions below 10.

The reason the tests couldn't be found was this little bit of the docs right [here](https://docs.cypress.io/guides/references/legacy-configuration#Folders--Files). Cypress refers to the tests as "integrations" and the default value of `integrationFolder` is the location I deleted the tests from, `./cypress/integration`. To get the Cypress test runner to find my new tests living in paths like `./modules/name-of-module/cypress/integration/` I did the following.

```json
"integrationFolder": "./",
"testFiles": "{./cypress/**/*.spec.js,./modules/**/cypress/**/*.spec.js}",
```

A few things happen here. Setting `integrationFolder` to `./` tells Cypress to search the whole project and not just the `./cypress/integration` folder. This however isn't great as its highly non specific and some other Javascript testing libraries use `.spec.js` files and other test file formats that Cypress will pick up by accident and try to run. I know because I saw it happen as Cypress picked up hundreds more tests that weren't really Cypress tests or, worse yet were Cypress test inside `/node_modules/`. To make it a bit more specific for my project I made use of the `testFiles` field which takes a glob pattern. With the above value Cypress only looked inside the usual `./cypress/` folder and now my module Cypress directories. Much better!

Version 10+ combines the two fields into one which can be found [here](https://docs.cypress.io/guides/references/configuration#e2e) called `specPattern`. It features the same default test location but should be more easily adaptable to a similar situation with different test locations.

Happy testing!
