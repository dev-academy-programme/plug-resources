# Plug Resources

## Segments
* [Index](./segments/README.md)
  * [Crypto](./segments/crypto/README.md)
    * [Blockchain](./segments/crypto/blockchain.md)
    * [Decentralisation](./segments/crypto/decentralisation.md)
  * [Python](./segments/python/README.md)
    * [Variables](./segments/python/variables.md)
    * [Functions](./segments/python/functions.md)
    * [Imports](./segments/python/imports.md)
    * [Classes](./segments/python/classes.md)
  * [Plug](./segments/plug/README.md)
    * [Prerequisites](./segments/plug/prerequisites.md)
    * [Setup](./segments/plug/setup.md)
    * [Cookie Cutter Scaffold](./segments/plug/cookie-cutter.md)
    * [Models](./segments/plug/models.md)
    * [Transforms](./segments/plug/transforms.md)

## Student Guide
  * [Index](./student-guide/README.md)
  * [What Next?](./student-guide/what-next.md)
  * [Free Money](./student-guide/free-money.md)
  * [Crypto Kiwis](./student-guide/crypto-kiwis.md)

## Teaching Guide
  * [Index](./teaching-guide/README.md)
  * [Free Money](./teaching-guide/free-money.md)
  * [Crypto Kiwis](./teaching-guide/crypto-kiwis.md)


## Creating a handbook for a new cohort
Fork this repo into your cohort's org

Rename the repo to student-handbook

Clone the fork to your computer

Add an upstream remote, create a deployment branch, rename the README and install gitbook-cli globally:

```
  git remote add upstream https://github.com/dev-academy-programme/plug-resources.git

  git remote set-url --push upstream no_url

  git branch deployed

  cp README.md BUILD_INSTRUCTIONS.md

  yarn global add gitbook-cli
```

Save, stage, commit and push yor changes.

## Provisioning the hosting environment

Create a new Heroku app called plug-dev-handbook

```
heroku apps:create plug-dev-handbook
```

Deploy the application

```
gitbook install

gitbook build

git checkout deployed
git add -A
git commit -m "build handbook"

git push --force heroku deployed:master
```

Create two environment variables in the Heroku app with the following values:

heroku config:set USERNAME=COHORT-YEAR
heroku config:set PASSWORD=THE-PASSWORD-ON-THE-BOOTCAMP-COMPUTERS
Put these same values in the .env file

Building and deploying the book
Throughout the bootcamp, we turn on pages in SUMMARY.md by adding a path to the pages we're turning on. To publish these changes:

In the cohort's student-handbook repo on your computer, pull from upstream to ensure you have the latest changes from book-source.

git pull upstream master
Make your changes to SUMMARY.md and stage and commit them.

To build and test locally:

gitbook install
gitbook serve
Run gitbook help to see more build options.

Build and deploy the book: ./deploy (this can take a few minutes)

Gitbook Inclusions
If you need to do inclusions, they look like this:

{% include book.repo.concepts + 'README.md' %}
book.repo.concepts is a global/book-level variable defined in book.json.

More info at https://help.gitbook.com/format/conrefs.html.
