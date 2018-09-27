# Setup

## Index
* [Prerequisites](/segments/plug/setup.md#prerequisites.md)
* [Plug Libraries](/segments/plug/setup.md#download-the-plug-libraries)

## Prerequisites

{% include "/segments/python/environment/setup-3.md" %}
{% include "/segments/python/environment/pipenv.md" %}

## Download the plug libraries

Next you will need to install the Plug libraries which you can download from the following git repo.

```sh
git clone https://github.com/dev-academy-programme/plug-libs
```

The rest of the instructions will assume that the plug-libs folder is at the same level as your project.

Install the Plug Core library

```sh
pipenv install ../plug-libs/plug_framework-0.0.24-py3-none-any.whl
```
Install the Plug Api library

```sh
pipenv install ../plug-libs/plug_framework-0.0.24-py3-none-any.whl
pipenv install <LOCAL_PATH_TO>/plug-api-1.6.1.tar.gz
```

You will want to be working from within your Python Virtual Environment. You can start this by running the command
