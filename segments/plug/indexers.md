# Indexers

Indexers are a useful component of a complex plugin.

You may use indexers for many things, for our examples, we will focus on the `ModelIndexer` built into plug, and extending upon it.

## ModelIndexer

The ModelIndexer allows you to arrange the items you are storing in the plug state as [Models](models.md), and allows you to specify how the items should be entered, removed, etc from the Model more specifically.

### Setup

You will define which models use what Indexer within your `config.yaml` file using the following structure:

``` yaml
indexers:
  example.ExampleModel:
  - plug_name.indexers_file.ExampleModelIndexer
```

Above we are telling our Plugin that the `ExampleModel` model will use the `ExampleModelIndexer` as its Indexer. The `ExampleModelIndexer` is a class within the `indexers_file.py` file, within the `plug_name` directory.

**You don't have to import your indexers within your plug, this config.yaml setup with link them for you!**

### Writing an Indexer

The indexer is a class that will extend from:
  * `PersistToFileMixin`, located within plug.indexer
  * `ModelIndexer`, located within plug.indexer

Your indexer will also need a unique fqdn, this will be used when making requests to your indexer later, as a way of specifying which indexer you are requesting the Model of.

``` py
from plug.abstract import ModelIndexer
from plug.indexer import PersistToFileMixin

class ExampleModelIndexer(PersistToFileMixin, ModelIndexer):
    fqdn = "example.ExampleModelIndexer"
```

The most important method of an indexer is the `update` method.

This update method is called when an alteration has been made to the State of the Model that your indexer is linked to. This kind of update is usually triggered by actions within the `apply` method of a [Transform](transform.md)

The `update` method will look something like this:

``` py
def update (self, key, value):
    self[key] = value
```

The above is the simplest version of an `update` method, but you may customise it to your liking, like so:

``` py
def update (self, key, value):
  if 'sub_key' not in self:
    self['sub_key'] = {}
  self['sub_key'][key] = value
```

The above example will index the items within the model to a `sub_key` subkey. This allows us to organise our Models, and data within models to our liking. A result of this organisation could be cleaner data when reading the state later on.

So if in the `apply` method of a transform, we were to:

``` py
state_slice[ExampleModel.fqdn]['some_key'] = some_value
```

Then the args for the Indexer's `update` method would be:
* `key` = 'some_key'
* `value` = some_value

but within the state they would be organised as:

```
state
  - ExampleModel.fqdn
    - sub_key
      - 'some_key'
        - some_value
```

## Full Example

For an example in context, you may have a voting app. You have a `VoteModel` model, a `VoteIndexer` indexer, and a `placeVote` transform.

All votes are `VoteModel` entries, but a vote can be **for** or **against**.

The `apply` of our transform may look like:

``` py
def apply (self, state_slice):
  state_slice[VoteModel.fqdn][self.voter_address] = VoteModel(
    voter_address = self.voter_address,
    is_vote_for = self.is_vote_for
  )
```

And within our `VoteIndexer` we could organise this vote:

``` py
def update (self, key, value):
  if '_for' not in self:
    self['_for'] = []
  if '_against' not in self:
    self['_against'] = []
  # The above ensures that there are lists of votes for and against

  if value.is_vote_for == True:
    self['_for'].append(value)
  else:
    self['_against'].append(value)
```

Because of the above organisation, if we were to request to state of `VoteModel`, querying the `VoteIndexer`, our response would be oragnised as:

``` json
  "response": {
    "payload": {
      "_for": [],
      "_against": []
    }
  }
```
