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

```python
from plug_api.v1 import PlugApiClient
client = PlugApiClient("http://localhost:8181", "keys.db")
```

The local key database will be used to store signing keys.  You may provide any
path here; if the file does not exist, it will be created automatically.

With this instance of the PlugApiClient, you can now begin interacting with the nodes. Three of the most common interactions are broadcasting a transform, the key_manager, and handling nonces.

### Broadcasting a Transform

Probably the single most common thing your API Client will do is broadcast transforms. The `broadcast_transform()` method takes a Transform argument, and posts it to the Plug API backend.

```python
client.broadcast_transform(ExampleTransform(
        receiver=address_input,
        amount=int(amount),
    ))
```

### The Key Manager

The Key Manager is used to generate and store keys, sign transactions and generate
new addresses. The API client requires a key manager instance so that it can sign transactions
(e.g., when calling `PlugApiClient.broadcast_transform`).

A simple instance of the Key Manager looks like this:

```python
from plug_api.key_managers.sqlite import SqliteKeyManager

def get_key_manager():
    return SqliteKeyManager('keys.db').setup()
```

This script can now be required in elsewhere in your project, and used whenever you need to handle signing keys. An example of this might be creating two new users for a transaction:

```python
sender = key_manager.generate()
receiver = key_manager.generate()
```

Consult the readme files for more information on using the Key Manager and its available methods.

### Handling Nonces

The Key Manager also keeps track of the nonce value for each address, so that it can
generate valid proofs. It contains tools for interacting with nonces, including functionality for incrementing or manually setting their value. IE:

```python
key_manager.get_nonce()
key_manager.set_nonce()
key_manager.advance_nonce()
```

## Code Examples

The following is a basic example of the Plug API Client in action:

### key_manager.py
```python
from plug_api.key_managers.sqlite import SqliteKeyManager

def get_key_manager():
    return SqliteKeyManager('keys.db').setup()
```

### api_client.py
```python
from key_manager import get_key_manager
from plug_api.clients.v1 import PlugApiClient

def get_api_client():
    return PlugApiClient("http://localhost:8181", get_key_manager())
```

### user.py
```python
from api_client import get_api_client
from key_manager import get_key_manager

class User:
    client = get_api_client()
    key_manager = get_key_manager()
    network_id = client.network_id

    def __init__(self):
      self.address = self.key_manager.generate()
      self.key_manager.set_nonce(self.address, self.network_id, 0)
```

### transaction.py
```python
from client.api_client import get_api_client
from register import register_transform_event

from user import User

async def init_transaction(sender_key_input, receiver_address, amount):
    register_transform_event(BalanceTransfer)

    response = get_api_client().broadcast_transform(BalanceTransfer(
        sender=sender_key_input,
        receiver=receiver_address,
        amount=int(amount)
    ))

    print(response)
```

These code examples run through the entire process of setting up and running the API Client. For more information about the library, including all its available methods, please consult the reademe documents located in the `plug/libs/plug-api-1.6.1.tar.gz` directory.
