# Prerequisites

## Python

You will need Python 3.6 or later.

You can verify which version of Python is installed by running the following command:

``` sh
$ python --version
Python 3.6.4
```

If the version number is less than 3.6 (for example, if you see Python 2.7.14), then you will first need to install a newer version of Python.

Install Guides:
* [Linux](https://docs.python-guide.org/starting/install3/linux/)
* [OSX](https://docs.python-guide.org/starting/install3/osx/)
* [Windows](https://docs.python-guide.org/starting/install3/win/)

## Virtual Environments

Plug recommend using pipenv for isolating your Python and project libraries.

Before you install your project (or the Plug core libraries), it is highly recommended that you create/activate a virtual environment.

See [Python Environment Guide](https://docs.python-guide.org/dev/virtualenvs/) for a guide to using pipenv.

Once you have everything you need you can activate your environment.

``` sh
pipenv shell
```

You will know that the virtual environment is active because the name of the virtual environment will be prepended to the shell prompt, e.g.:

``` sh
(directory-name)$
```
