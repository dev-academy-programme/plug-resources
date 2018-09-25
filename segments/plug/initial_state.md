# Plug Initial State

## What does this mean?

An iniital state for your plugin means that there are set values, described by your [Models](models.md).
This initial state will be the state that your plugin will hold in each node upon starting.

If you are building a plugin that stores user balances, you may want some initial users to exist within the node, and those users can have set initial balances.

Initial States are useful for testing locally, but your project may also require that a state exists to begin with.

## How do I set an Iniital State?

The initial state is described in your main `config.yaml` file.

The structure should be:

```yaml
plug:
  #Other values here
  initial_state:
    #Initial State values here
```

If we go by the example of a plugin that stores user balance, we may have a `BalanceModel` model for our plugin. Our initial_state would like like so:

``` yaml
plug:
  initial_state:
    example.BalanceModel:
      ABC: #public key indexing model
        public_key: "ABC" #User Public Key
        balance: 100 #This is the initial balance for this "fake user"
      123:
        signing_key: "123"
        balance: 200
```

If we wanted to store users and a list of other user public keys, say, following list for the user, we would have a `FollowingModel` that stores a `following` list inside:

``` yaml
plug:
  initial_state:
    example.FollowingModel:
      ABC: #public key of user indexing the model
        public_key: "ABC" #User Public Key
        following: #Model inner list
          - public_key: "123" #list entry
          - public_key: "xyz" #list entry
```

Each use of a `-` indented below your Models inner list name describes a new entry within that list in the initial state.
