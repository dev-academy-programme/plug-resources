# Free Money Challenge Solution

This page outlines some potential solutions for the [Free Money Challenge]({{book.intro}}).
The sample solution code walks through creating a "UnexpectedExpense" Transform, which subtracts some money from a specific User. The solutions can be reworked to help you solve the Free Money Challenge.

#### Writing the UnexpectedExpense transform.

At the top of your UnexpectedExpense function, you must initialize all of the local properties. These properties will all be set once the object is packed into the registry.

```python
@dataclass
class UnexpectedExpense(Transform):
    fqdn = "tutorial.UnexpectedExpense"
    user: str
    amount: int
```

 This next part of the class is fairly boilerplate, and will look similar across most of the Transforms you will write. It specifies the different authorizations, models and keys required to perform the Transform - as well as instructions for how to handle packing/unpacking the object.

```python
    ...

    def required_authorizations(self):
        return {self.user}

    @staticmethod
    def required_models():
        return {BalanceModel.fqdn}

    def required_keys(self):
        return {self.user}

    @staticmethod
    def pack(registry, obj):
        return {
            "user": obj.user,
            "amount": obj.amount,
        }

    @classmethod
    def unpack(cls, registry, payload):
        return cls(
            receiver=payload["user"],
            amount=payload["amount"],
        )
```

The final required methods are the `verify()` and `apply()`. They handle the actual business logic of the script. Most of the action inside a Transform will generally take place inside these two functions.

```python
    ...

    def verify(self, state_slice):
        balances = state_slice[BalanceModel.fqdn]

        if self.amount <= 0:
            raise unexpected_expense.error.InvalidAmountError("Expense amount must be more than 0")

        if balances[self.user].balance <= 0:
            raise unexpected_expense.error.NotEnoughMoneyError("User is already broke")

    def apply(self, state_slice):
        balances = state_slice[BalanceModel.fqdn]
        balances[self.user].balance -= self.amount
```

This completes the transform. It's a very straight forward process if you actually just read it through line by line. It has a few properties, and some methods for packing/unpacking events, and verifying/applying transformations on the state.

#### Writing the UnexpectedExpense client.

The client side code is a bit more complex than the Transforms. There are two ways of going about it. We're going to do it the long way first, packing up and hashing our own objects, and then POSTing them to the backend API.

Here in `unexpected_expense.py`, we start by registering the unexpected expense event in the register. You will also need to create a new instance of the User class, and pass in the `signing_key_input` to make sure you get back the correct User object.

```python
...
import asyncio

async def init_unexpected_expense(signing_key_input):
    registry = Registry().with_default()
    registry.register(Event)
    registry.register(UnexpectedExpense)

    user = await User.load(signing_key_input)
```

Once that is done, we now have everything required to create a new instance of our UnexpectedExpense transform.

```python
...

  transform = UnexpectedExpense(
    user=user.address,
    amount=1000,
    )
```

Now it's time for the complicated stuff. Fortunately, it's mostly just complicated for the computer. This block on `challenge`s, `proof`s and `transaction`s will look pretty similar in all of your client side code. And, other than tweaking a few minor details, you won't ever have to change much to get this working elsewhere.

```python
...

  challenge = transform.hash(sha256)
  proof = SingleKeyProof(user.address, user.nonce, challenge, 'challenge.UnexpectedExpense')
  proof.sign(user.signing_key)
  transaction = Transaction(transform, {proof.address: proof})
```

Now that we have the `challenge`, `proof` and `transaction` objects all ready to go, it's time to pack them up into an `event`, and then into a `payload` to POST over HTTP to the api backend.

```python
    ...

    event = Event(
        event=TransactionEvent.ADD,
        payload=transaction
    )

    payload = registry.pack(event)
```

And finally, the transform event is all good to go, and ready to be sent off to the API. This block will finish off the script:

```python
    ...

    async with aiohttp.ClientSession() as session:
        async with session.post("http://localhost:8181/_api/v1/transaction", json=payload) as response:
            data = await response.json()

            print(data)
```

Take a moment to read back over all of this code, and make sure that you understand everything that is happening along the way. First, the `User` object is instantiated. The User's `address` is then passed into the `UnexpectedExpense` transform that we wrote earlier. The transform is then hashed and turned into a `challenge`, which in turn is used to create the `proof`, which then gets signed with the Users `signing_key`. All of this comprises a `transaction`, which is then turned into an `event`. Finally, the event is packed into the `registry` and `payload`, and POSTed to the correct route.

It's a dense process, but one step logically follows on to another. If these concepts are very foreign to you, try checking out the [resource on blockchain]({{book.blockchain}}) in this module.

#### Using the Plug API Client.

If you haven't already, head over to this page on the [Plug API Client]({{book.api-client}}) and follow the setup instructions. All of the example code for using the API Client is lifted from the solution to the Free Money challenge.

Changing our current scripts to use the `api_client` is quite a bit of work, but it will lead to much cleaner, more manageable code.

##### API Client Walkthrough

All of the functionality you'll need to work with the api lives in the `client/utils.py` script. The `utils.py` file can be required in whenever we need to interact with the api_client. Let's look at an example of that now in `user.py`:

```python
from client.utils import get_api_client, get_key_manager
from asyncio import get_event_loop

class User:

    def __init__(self, address):
        self.client = get_api_client()
        self.key_manager = get_key_manager()

        loop = get_event_loop()
        self.network_id = loop.run_until_complete(self.client.get_network_id())

        if (address):
            self.address = address
        else:
            self.address = self.key_manager.generate()
            self.key_manager.set_nonce(self.address, self.network_id, 0)
```

The entire class just looks like this now. The key manager handles the generation and local storage of the keys for us.
Next let's explore how the api_client is used to interact with our Transforms in `unexpected_expense_client.py`:

```python
from unexpected_expense.transform import UnexpectedExpense
from client.utils import register_transform_event
from client.user import User

from asyncio import get_event_loop

def init_unexpected_expense(client, address_input, amount):
    register_transform_event(UnexpectedExpense)

    loop = get_event_loop()

    response = loop.run_until_complete(client.broadcast_transform(UnexpectedExpense(
        user=address_input,
        amount=int(amount),
    )))

    print(response)
    return response
```

_This_ is really amazing. All of that complicated code from before doing the hashing and proofing and packaging; condensed down into a tight little function. The `broadcast_transform()` method does it all for us!

