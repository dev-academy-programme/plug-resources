# Models

## What is a Model?

Models define domain-specific data types/structures.

[Read more about Models in Crypto](../crypto/models.md)


## Creating a Model

To create a new model, write a class that extends `plug.abstract.Model` and define a unique `fqdn`.

([What is an FQDN?](https://www.lifewire.com/what-does-fqdn-mean-2625883))

Your model’s FQDN must be universally unique, as this value will identify instances of your model on any Plug blockchain, regardless of what other modules are also installed.

Here is an example of a (minimal) model:

``` py
import dataclasses

from plug.abstract import Model

@dataclasses.dataclass
class MyModel(Model):
    fqdn = "com.my-company.MyModel"
```

### default_factory

All models require a `default_factory` to initialize a new instance of the model, this is used when accessing a model by key that has not been created already.


For a Model that models balance, the `default_factory` will initialize the balance.

``` py
@dataclass
class BalanceModel(Model):
  fqdn = "com.my-company.MyModel"
  balance: int

  @classmethod
  def default_factory(cls):
    return cls(balance = 0) #where initial balance is 0
```

!!PLACEHOLDER BELOW THIS LINE - still unsure when the `unpack` and `pack` methods are required, as they are not described within the plug docs on Models

### Unpack and Pack

The Model class from within `plug.abstract` demands that a model be `Packable`, which means your Model must have methods to `pack` and `unpack`.

### Pack

Here is an example of a pack method, which packs the balance within a Model.

``` py
@staticmethod
def pack(registry, obj):
    return {
        "balance": obj.balance,
    }
```

### Unpack

Here is an example of an unpack method, which unpacks the balance from a payload.

``` py
@classmethod
def unpack(cls, registry, payload):
    return cls(
        balance=payload["balance"]
    )
```

## Balance Model Example

Here is a full example of a Model that models Balance.

``` py
from dataclasses import dataclass
from plug.abstract import Model

@dataclass
class BalanceModel(Model):
    fqdn = "com.my-company.MyModel"
    balance: int = 0

    @classmethod
    def default_factory(cls):
        return cls(balance = 100)

    @staticmethod
    def pack(registry, obj):
        return {
            "balance": obj.balance,
        }

    @classmethod
    def unpack(cls, registry, payload):
        return cls(
            balance=payload["balance"]
        )
```
