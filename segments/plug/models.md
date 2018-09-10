# Models

## Index
* [What is a Model](#what-is-a-model)
* [Creating a Model](#creating-a-model)
  * [default_factory](#default-factory)
  * [pack](#pack)
  * [unpack](#unpack)
* [Model Example](#model-example)
* [Using a Model](#using-a-model)
* [Validation](#validation)

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

### default factory

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

## Model Example

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

## Using a Model

Include your models using the plug.registry.classes key in your config.yaml:

``` yaml
plug:
  registry:
    classes:
    - my.models.VoucherModel
```

or in your head class within `__init__.py` in the `setup` method

``` py
class HEAD_PLUGIN(Plugin):
  @classmethod
  def setup(cls, registry):
    components = [
      # Include your plugin's models/transforms/errors etc here.
      plugin.model.BalanceModel,
    ]
    for component in components:
      registry.register(component)
```

!!!PLACEHOLDER - The plug docs describe validation for models, this is something that hasn't shown up in the FreeMoney exercise or in the tutorial docs. I will break this information down, but have no context for it.

## Validation

Each model uses python dataclasses and typing to validate on instantiation. This means optional params and defaults can be defined.

``` py
@dataclasses.dataclass
class VoucherModel(Model):
    fqdn = "com.my-company.VoucherModel"
    issuer: str
    recipient: str
    value: typing.Optional[int] = 0
```

Using the above class, `VoucherModel(issuer=1, recipient=2)` would raise an error.

You can also validate a key to know if it is a valid key belonging to this Model.

If the key is not valid, a `plug.error.KeyValidationError` should be raised.

Plug defines a default validation that will check that the key is a string.

If `key_validation_regex` is not `None`, Plug will also check that the key matches it. Models can override this method to provide custom validation rules and Mixins can be used to extend it as well.

Check `plug.model.AddressValidationModelMixin` for an example of a Mixin provided by Plug core that will validate that the keys are valid Plug addresses.

``` py
@dataclasses.dataclass
class VoucherModel(Model):
  fqdn = "com.my-company.VoucherModel"

  # Only uppercase alphanumeric keys are allowed as voucher codes
  key_validation_regex = re.compile(r"^[A-Z0-9]+$")

  @classmethod
  def validate_key(cls, key):
    super().validate_key(key)  # Default checks

    if key == "VOUCHER":
      message = _("Voucher can not be 'VOUCHER'.")
      raise plug.error.KeyValidationError(message)
```
