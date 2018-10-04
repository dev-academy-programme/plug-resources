## Plug Resources

This repo is a resource for educators wanting to build curriculum to teach [Plug](https://www.plugblockchain.com). The segments folder contains the core content and the other folders represent views into that content.

You will need gitbooks to build the resources, the core idea is to create small segments of curriculum which educators can assemble to fit the needs of the programme they are delivering.

Install gitbook CLI

```sh
yarn global add gitbook-cli
 - or -
npm install -g gitbook-cli
```
e.g. the hackathon folder contains a view of the material aimed at students participating in a two day hackathon.

```sh
cd hackathon
gitbook install
gitbook serve
```

The books should be visible at http://localhost:4000

Alternatively you can use `gitbook build` to create a html version which will be built in a `_book` subfolder or `gitbook pdf` to create a pdf version.
