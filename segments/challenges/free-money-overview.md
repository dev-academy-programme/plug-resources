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

The final required methods are the `verify()` and `apply()`. 

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



---
