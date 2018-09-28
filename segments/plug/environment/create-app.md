# Create your own App

* [Pipenv / virtual environment](/segments/plug/create-app.md#virtual-environment)
* [Installing Local Plugin](/segments/plug/create-app.md#installing-local-plugin)
* [Pipfile](/segments/plug/create-app.md#Pipfile)
* [Creating a Node](/segments/plug/create-app.md#creating-a-node)
* [Running your Node](/segments/plug/create-app.md#running-your-node)

## Virtual Environment

Ensure you are using `pipenv` with `python3` by running
``` sh
pipenv --three
```

``` sh
pipenv shell
```

within your project's root directory.

## Installing Local Plugin

[Setting up a Cookie Cutter Plugin]({{book.cookie-cutter}})

If you have a plugin within your app, you will first need a config.yaml file that points to the plugin.
Here is example of a config.yaml file

``` yaml
plug:
  network_id: i_am_at_network
  max_block_size: 1000
  registry:
    plugins:
    - <PLUGIN_DIRECTORY_NAME>.<HEAD_CLASS_OF_PLUGIN (WITHIN __INIT__.py)>
  storage:
    class: plug.storage.sqlite.SqliteStorage
    path: db.sqlite
    store_n_states: 10
```

The important line is the `plugins:
- <PLUGIN_DIRECTORY_NAME>.<HEAD_CLASS_OF_PLUGIN (WITHIN __INIT__.py)>` line.

Once you have this setup, you may install your local plugin by running

``` sh
pipenv install -e .
```

## Pipfile

Your `Pipfile` should look something like this:

```py
[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[dev-packages]

[packages]
<NAME_OF_PLUGIN_FOLDER> = {editable = true, path = "."}
"ca100b1" = {path = <PATH_TO_PLUG_CORE_LIBRARY>}
plug-api = {path = <PATH_TO_PLUG_API_LIBRARY>}

[requires]
python_version = "3.7"
```

Ensure that the `python_version` is at least version `3.6` or higher.

## Creating a Node

You will need to create a network/node before you can run the code.

Create a network by running:

``` sh
plug-dev create-network ./config.yaml -n1 -d ./nodes
```

Adding the `-f` argument will prevent the command from failing if a `nodes` directory already exists.

The `-n1` argument tells `plug-dev create-network` to create a 1-node network. Try specifying different values to configure multiple nodes (for example, use `-n3` to create a network with 3 nodes). The `-d ./nodes` tells `plug-dev create-network` to create the node structure locally in the dir `nodes`.

After running this command you should see some files creates within `./nodes/node_0`, importantly, a `config.yaml` file for the created node.

## Running your Node

You may run the node by either navigating to the node and running from the node's directory:

```sh
cd ./nodes/node_0
plug run
```

or from outside the node directory with:

```sh
plug run --config ./nodes/node_0/config.yaml
```

You should see a screen like this:
``` sh
_
_ __ | |_   _  __ _
| '_ \| | | | |/ _` |
| |_) | | |_| | (_| |
| .__/|_|\__,_|\__, |
|_|            |___/  
eventloop running forever, press CTRL-C to interrupt...
PID 15873, send SIGINT or SIGTERM to exit.
To get verbose consensus diagnostics, use --log-level=DEBUG
2018-09-07 11:02:58,114 - INFO - 106 - Setting up ...
2018-09-07 11:02:58,210 - INFO - 110 - Running ...

```

## Interacting with your Node / Swagger API

Once your node is up and running, you can interact with its HTTP API by going to http://localhost:8181/_swagger.
