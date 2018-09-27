## Virtual Environments

Pipenv is a tool for isolating your Python and project libraries.

Before you install python libraries for your project it is highly recommended that you create/activate a virtual environment.

You can use pip to install pipenv

``` sh
pip install --user pipenv
```

See [Python Environment Guide](https://docs.python-guide.org/dev/virtualenvs/) for a guide to using pipenv.

Once you have everything you need you can activate your environment.

``` sh
pipenv shell
```

You will know that the virtual environment is active because the name of the virtual environment will be prepended to the shell prompt, e.g.:

``` sh
(directory-name)$
```
Note, if you are  vim user you might find some issues with using vim inside of your pipenv shell.
