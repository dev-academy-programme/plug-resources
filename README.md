## Plug Curriculum Book Source

To Build a book, navigate to the desired directory:

If you build from root (here), the resulting book will include both the `teaching-guide` and `student-guide` resources.

## Build Student-Guide

(Currently on instructions for local serving of book)


Install gitbook CLI

```sh
yarn add global gitbook
 - or -
npm install -g gitbook
```

For building full book, stay in this root directory.

For building `student-guide`, run

```sh
cd student-guide/
```

For building `teaching-guide` run

```sh
cd teaching-guide/
```

Then for any book, run

```sh
gitbook install
gitbook serve
```

The books should be visible at http://localhost:4000
