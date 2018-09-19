# Plug API Client

## Index
* [What is the Plug API Client?](#what-is-the-api-client)
* [Using the API](#using-the-api)
  * [Broadcast Transform](#broadcast_transform)
  * [The Key Manager](#key_manager)
  * [Handling Nonces](#handling_nonces)
* [Code Examples](#code-example)

## What is the Plug API Client?

The Plug API Client is a library for sending requests to Plug nodes via the HTTP
API. It provides several classes to make interacting with the nodes faster, and helps with local storage of signing keys, addresses and nonces.

[Read this link](../to-something.md)

## Using the API

After installing the `plug/libs/plug-api-1.6.1.tar.gz` library into your project, a new instance of the PlugApiClient can be created. The initializer requires two arguments:

- The HTTP URI of the node to connect to.
- The path to the local signing key database.

```
from plug_api.v1 import PlugApiClient
client = PlugApiClient("http://localhost:8181", "keys.db")
```

The local key database will be used to store signing keys.  You may provide any
path here; if the file does not exist, it will be created automatically.

With this instance of the PlugApiClient, you can now begin interacting with the nodes. Three of the most common interactions are broadcasting a transform, the key_manager, and handling nonces.

SqliteKeyManager

### broadcast_transform

Very informative information.

### b

another gem

### c

i can't believe how quickly i am learning!

## Code Examples

```
look at all of this fantastic code!
```
