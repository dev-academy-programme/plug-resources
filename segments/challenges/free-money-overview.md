# Free Money Challenge Overview

The purpose of this challenge is to get a better understanding of how new Transforms are created in Plug, and how to handle working with them on the client side. Once completed, the Free Money Challenge will allow you to do several things. Using a command line interface, you will be able to:

- Create new Users.
- Query the balance of a specific User.
- Transfer money between two Users.
- Give some free money to a specific User, of whatever denomination you chose.

This challenge is a good starting point for a variety of reasons. It covers a lot of functionality that will be common across a wide variety of blockchain applications, and is easily extendable into further challenges or projects.

You can find the [Free Money Challenge here.](https://github.com/dev-academy-programme/plug-intro)

After completing the Free Money Challenge, you should feel confident in your understanding of the following areas:

- What [Models](../plug/models.md) are, and how they work.
- The process of creating a new [Transform](../plug/transforms.md) to manipulate the state of the blockchain.
- How to write client side code to manually POST Transform events to the server.
- The basics of the [Plug client_api](.,/plug/api-client.md), and how to get it POSTing your Transform events for you.

## Instructions:

General instructions for the [Free Money Challenge can be found here,](https://github.com/dev-academy-programme/plug-intro) however the following section outlines more explicit solutions. You should try working through the challenge yourself before consulting this section:

#### Writing the BalanceTransfer transform.

At the top of your BalanceTransfer function, you must initialize all of the local properties:

```
@dataclass
class BalanceTransfer(Transform):
    fqdn = "tutorial.BalanceTransfer"
    sender: str
    receiver: str
    amount: int
```

These properties will all be set once the object is packed into the registry. This next part of the class is fairly boilerplate, and will look similar across most of the Transforms you will write:

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

The final required methods are the `verify()` and `apply()`. They handle the actual business logic of the Transform:

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



---
