# Free Money Challenge Solution

This outlines a sample solution to the [Free Money Challenge](https://github.com/dev-academy-programme/plug-intro)

#### Writing the BalanceTransfer transform.

At the top of your BalanceTransfer function, you must initialize all of the local properties. These properties will all be set once the object is packed into the registry.

```
@dataclass
class BalanceTransfer(Transform):
    fqdn = "tutorial.BalanceTransfer"
    sender: str
    receiver: str
    amount: int
```

 This next part of the class is fairly boilerplate, and will look similar across most of the Transforms you will write. It specifies the different authorizations, models and keys required to perform the Transform - as well as instructions for how to handle packing/unpacking the object.

```
    ...

    def required_authorizations(self):
        return {self.sender}

    @staticmethod
    def required_models():
        return {BalanceModel.fqdn}

    def required_keys(self):
        return {self.sender, self.receiver}

    @staticmethod
    def pack(registry, obj):
        return {
            "sender": obj.sender,
            "receiver": obj.receiver,
            "amount": obj.amount,
        }

    @classmethod
    def unpack(cls, registry, payload):
        return cls(
            sender=payload["sender"],
            receiver=payload["receiver"],
            amount=payload["amount"],
        )
```

The final required methods are the `verify()` and `apply()`. They handle the actual business logic of the script. Most of the action inside a Transform will generally take place inside these two functions.

```
    ...

    def verify(self, state_slice):
        balances = state_slice[BalanceModel.fqdn]

        if self.amount <= 0:
            raise free_money.error.InvalidAmountError("Transfer amount must be more than 0")

        if balances[self.sender].balance < self.amount:
            raise free_money.error.NotEnoughMoneyError("Insufficient funds")

    def apply(self, state_slice):
        balances = state_slice[BalanceModel.fqdn]
        balances[self.sender].balance -= self.amount
        balances[self.receiver].balance += self.amount
```

This completes the transform. It's a very straight forward process if you actually just read it through line by line. It has a few properties, and some methods for packing/unpacking events, and verifying/applying transformations on the state.

#### Writing the FreeMoney transform.

The FreeMoney transform is virtually identical to BalanceTransfer. It doesn't require a sender, and the `verify()` / `apply()` methods are slimmed down a little too.

```
@dataclass
class FreeMoney(Transform):
    fqdn = "tutorial.FreeMoney"
    receiver: str
    amount: int

    def required_authorizations(self):
        return {self.receiver}

    @staticmethod
    def required_models():
        return {BalanceModel.fqdn}

    def required_keys(self):
        return {self.receiver}

    @staticmethod
    def pack(registry, obj):
        return {
            "receiver": obj.receiver,
            "amount": obj.amount,
        }

    @classmethod
    def unpack(cls, registry, payload):
        return cls(
            receiver=payload["receiver"],
            amount=payload["amount"],
        )

    def verify(self, state_slice):
        balances = state_slice[BalanceModel.fqdn]

        if self.amount <= 0:
            raise free_money.error.InvalidAmountError("Transfer amount must be more than 0")

    def apply(self, state_slice):
        balances = state_slice[BalanceModel.fqdn]
        balances[self.receiver].balance += self.amount
```

Once again, take the time to read through this code line by line. It's not too hard to get your head around the things going on here.

#### Writing the FreeMoney client.

The client side code is a bit more complex than the Transforms. There are two ways of going about it. We're going to do it the long way first, packing up and hashing our own objects, and then POSTing them to the backend API.

Here in `free_money.py`, we start by registering the free money event in the register. You will also need to create a new instance of the User class, and pass in the `signing_key_input` to make sure you get back the correct User object.

```
...
import asyncio

async def init_free_money(signing_key_input):
    registry = Registry().with_default()
    registry.register(Event)
    registry.register(FreeMoney)

    user = await User.load(signing_key_input)
```

Once that is done, we now have everything required to create a new instance of our FreeMoney transform.

```
...

  transform = FreeMoney(
    receiver=user.address,
    amount=1000,
    )
```

Now it's time for the complicated stuff. Fortunately, it's mostly just complicated for the computer. This block on `challenge`s, `proof`s and `transaction`s will look pretty similar in all of your client side code. And, other than tweaking a few minor details, you won't ever have to change much to get this working elsewhere.

```
...

  challenge = transform.hash(sha256)
  proof = SingleKeyProof(user.address, user.nonce, challenge, 'challenge.FreeMoney')
  proof.sign(user.signing_key)
  transaction = Transaction(transform, {proof.address: proof})
```

Now that we have the `challenge`, `proof` and `transaction` objects all ready to go, it's time to pack them up into an `event`, and then into a `payload` to POST over HTTP to the api backend.

```
    ...

    event = Event(
        event=TransactionEvent.ADD,
        payload=transaction
    )

    payload = registry.pack(event)
```

And finally, the transform event is all good to go, and ready to be sent off to the API. This block will finish off the script:

```
    ...

    async with aiohttp.ClientSession() as session:
        async with session.post("http://localhost:8181/_api/v1/transaction", json=payload) as response:
            data = await response.json()

            print(data)
```

Take a moment to read back over all of this code, and make sure that you understand everything that is happening along the way. It is a fairly straight forward series of events: First, the `User` object is instantiated. The User's `address` is then passed into the `FreeMoney` transform that we wrote earlier. The transform is then hashed and turned into a `challenge`, which in turn is used to create the `proof`, which then gets signed with the Users `signing_key`. All of this comprises a `transaction`, which is then turned into an `event`. Finally, the event is packed into the `registry` and `payload`, and POSTed to the correct route.

It's a very dense process, but one step logically follows on to another. If these concepts are very foreign to you, try checking out the [resource on blockchain]('../crypto/blockchain.md) in this module.

#### Using the Plug API Client.

If you haven't already, head over to this page on the [Plug API Client](.,/plug/api-client.md) and follow the setup instructions. All of the example code for using the API Client is lifted from the solution to this Free Money challenge.

Changing our current scripts to use the `api_client` is quite a bit of work, but it will lead to much cleaner, more manageable code.

##### API Client Walkthrough

You'll need to create a couple of new files inside your `client` directory. First, `key_manager.py`, which looks like this:

```
from plug_api.key_managers.sqlite import SqliteKeyManager

def get_key_manager():
    return SqliteKeyManager('keys.db').setup()
```

This file can now be required in elsewhere in the project whenever you need to interact with signing keys. Next, create `api_client.py`, and set it up like this:

```
from key_manager import get_key_manager
from plug_api.clients.v1 import PlugApiClient

def get_api_client():
    return PlugApiClient("http://localhost:8181", get_key_manager())
```

This requires in the `key_manager` function from before, and passes it into the constructor for the PlugApiClient. Now _this_ script can be required in whenever we need to interact with the api_client. Let's look at an example of that now in `user.py`.

```
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

The entire class just looks like this now. The key manager handles the generation and local storage of the keys for us.
Next let's explore how the api_client is used to interact with our Transforms in `free_money_client.py`:

```
from plug.message import Event
from plug.registry import Registry

from client.api_client import get_api_client
from register import register_transform_event

from free_money.transform import FreeMoney
from user import User

async def init_free_money(address_input, amount):
    register_transform_event(FreeMoney)

    response = get_api_client().broadcast_transform(FreeMoney(
        receiver=address_input,
        amount=int(amount),
    ))

    print(response)
```

_This_ is really amazing. All of that complicated code from before doing the hashing and proofing and packaging; condensed down into a tight little function. The `broadcast_transform()` method does it all for us!

 Use this as a template to re-write the `transaction.py` file too. It will mostly be the same as in this example.

---

##### What next?

- Read the documentation for the `api_client` and familiarize yourself with the methods in there.
