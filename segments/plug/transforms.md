# Transforms

## Index
* [What is a Transform?](#what-is-a-transform?)
* [Creating a Transform](#creating-a-transform)
  * [verify()](#verify())
  * [apply()](#apply())
  * [pack()](#pack())
  * [unpack()](#unpack)
  * [requirement methods](#requirements)
    * [required_authorizations()](#requied_authorizations())
    * [required_models()](#required_models)
    * [required_keys()](#required_keys)
* [Using your Transform](#using-your-transform)

## What is a Transform?

Transforms are the controllers that execute the business logic of the module.

[Read more about Transforms in Crypto](../crypto/transforms.md)

## Creating a Transform

To write a Transform, write a class that extends `plug.abstract.Transform` class and define a unique `FQDN`.
Each Transform’s FQDN must be universally unique.

([What is an FQDN?](https://www.lifewire.com/what-does-fqdn-mean-2625883))


Below is an example of a simple definition for a Transform which describes a transfer of some amount from one user to another.

``` py
from plug.abstract import Transform

class BalanceTransfer(Transform):
  fqdn = 'com.my-company.BalanceTransfer'
  sender: str #sender signing key
  receiver: str #receiver signing key
  amount: int #amount to transfer

```

A Transform must never modify hashed values, in the example above, the `BalanceTransfer` class cannot modify its `sender`, `receiver` or `amount` parameters:

The Transform’s functionality is divided (primarily) into two methods; `verify()` and `apply()`.

### Verify()

`verify()` checks the inputs for a transaction, and verifies the transaction against the current blockchain state.

``` py
def verify(self, state_slice):
  balances = state_slice[BalanceModel.fqdn]

  if self.amount <= 0:
    raise VerificationError(_("Transfer amount must be more than 0"))

  if balances[self.sender].balance < self.amount:
    raise VerificationError(_("Not enough money"))
```

If `verify()` raises an exception, it will prevent `apply()` from being invoked. This is the mechanism by which your transforms can reject invalid transactions.

In the above example, the transaction will fail if the amount to send is less than 0, or the sender does not have enough funds.


### Apply()

`apply()` carries out the business logic, making changes to the State.

``` py
def apply(self, state_slice):
  balances = state_slice[BalanceModel.fqdn]
  balances[self.receiver].balance += self.amount #add funds to receiver
  balances[self.sender].balance -= self.amount #subtract funds from sender
```

As you can see in the `apply()` above, apply is where the state change logic occurs, after being verified.

### verify() vs. apply()

When designing Transforms, both the `verify()` and `apply()` methods accept a State Slice.

Both methods may interact with the State Slice in any way, including making modifications.

The critical difference is, any changes that `verify()` makes to the State Slice are discarded, whereas any changes that `apply()` makes are subsequently copied to the State.

---

The `plug.abstract.Transform` class extends `Packable`, meaning it needs both `pack()` and `unpack()` methods.

### Pack

The `pack()` method describes what information is Hashed/stored within each Transform event. For the BalanceTransfer example, we want to store the `sender`, `receiver` and `amount`.

``` py
@staticmethod
def pack(registry, obj):
  return {
    "sender": obj.sender,
    "receiver": obj.receiver,
    "amount": obj.amount,
  }

```

### Unpack

`unpack()` behaves as the inverse of `pack()`, detailing which information can be read from the packed Transform event/block when read.

``` py
@classmethod
def unpack(cls, registry, payload):
  return cls(
    sender=payload["sender"],
    receiver=payload["receiver"],
    amount=payload["amount"],
    )
```

---

### Requirements

A transform will also accept several `required` methods.

###E requied_authorizations()

The item(s) you return from the `required_authorizations` method describes the values that must be provided within a payload to authorize the Transform.

``` py
def required_authorizations(self):
  return {self.sender}
```

In the case above, the only authorization needed for a `BalanceTransfer` is the sender. This makes sense, as the receiver is not required to accept the Transfer.

#### required_models()

The items(s) you return from the `required_models()` method describes the models that must be present within a payload to verify the Transform.

``` py
def required_models():
  return {BalanceModel.fqdn}
```

In the case above, the `BalanceModel` is described at required, identified by it's unique `fqdn`. This is because the Balance Model describes the state of Balance, and BalanceTransfer is making changes to this state.

[Read more about Models here](./models.md)

#### required_keys()

The items(s) you return from the `required_keys()` method describe the keys that must be present without the paylaod for the Transform to be valid.

```py
def required_keys(self):
  return {self.sender, self.receiver}
```

In the case above, both a `sender` and a `receiver` must be provided. This makes sense, as even though only the `sender` must authorize the Transform (transaction/transfer), both a `sender` and `receiver` must be specified so the balance can be transferred from A to B.

## Using your transform

Include your transforms using the plug.registry.classes key in your config.yaml:

``` yaml
plug:
  registry:
    classes:
    - my.transforms.BalanceTransfer
```

or in your head class within `__init__.py` in the `setup` method

``` py
class HEAD_PLUGIN(Plugin):
  @classmethod
  def setup(cls, registry):
    components = [
      # Include your plugin's models/transforms/errors etc here.
      plugin.transform.BalanceTransfer,
    ]
    for component in components:
      registry.register(component)
```
