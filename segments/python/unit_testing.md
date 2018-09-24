# Unit Testing

## Index
  * [Setup](#setup)
  * [Define a test](#define-a-test)
  * [Test Structure Convention](#test-structure-convention)
  * [Mocking your Modules](#mocking-your-own-modules)

## Setup

You will want a directory named `tests` that will include all of your unit test files.

We will be using `pytest` as our testing library, and `pytest` requires that all unit-test files follow the naming convention of `*_test.py` or `test_*.py`.

You can includes files that do not include `test_` in their name and they will not be recognised as testing files, but may be imported / utilised within your tests.
This is a great way of [mocking modules](#mocking-your-own-modules), as you can simulate your import structure but only use the module you are testing.

## Define a Test

## Test Structure Convention

The testing cvonvention that we use can be reffered to as **The Three As**.

### Arrange

The first section of a test method should be about **Arranging** the variables/values that will be needed for the **Input** portion of the method you are testing. A function like

``` py
def say_hello(name):
  return "Hello " + name
```

receives a `name` argument as input, so you should arrange a fake name.

```py
def test_convention():
  """Arrange"""
  fake_name = "Alice"
```

### Act

The **Act** portion of your test is generally when you call upon the method your are testing, to retrieve the **actual/output** that you will need to perform your assertions on. For the `say_hello` example above, the output is a concatenated string, so our **Act** segment should look like:

```py
"""Act"""
actual = say_hello(fake_name)
```

### Assert

Now that we have arranged our expected output, and collected our output from our test inputs, we need to make some assertions.

Assertions are the conditions by which your test will pass and fail. The cleanest way to organise this is the arrange an `expected` output, and call your real output `actual`. This way your assertion can be as simple as:

```py
"""Assert"""
assert actual == expected
```

Make sense?

### All Together Now

An example of the whole test convention is:

```py
def test_say_hello():
  """Arrange"""
  fake_name = "Alice"
  expected = "Hello Alice"

  """Act"""
  actual = say_hello(fake_name)

  """Assert"""
  assert actual == expected
```

## Mocking your own modules

Say we are testing the module below:


``` py
#methods.py
from utils import capitalise

def say_hello(name):
  return "Hello " + capitalise(name)

```

Where the `say_hello` function is will call upon the `capitlise` function within `utils.py`. `utils.py is within the same directory as `methods.py`.

We only want to test the `say_hello` function and want to mock out the `capitlise` function.

Our testing directory structure should look like so:

```
| tests/
|
|___utils.py
|___test_methods.py
```

Where our `tests/utils.py` file can simply pretend to include a `capitlise` function:

```py
# tests/utils.py
def capitlise(name):
  return name
```

But does not actually alter the name in any way.

So in practice, if our `test_methods.py` file looks like:

```py
# tests/test_methods.py

from core.methods import say_hello

def test_say_hello():
  name = "alice"
  expected = "Hello alice"

  actual = say_hello(name)

  assert actual == expected
```

This test will pass, as when `say_hello` is run within the test context, it import our mock `capitlise` from `tests/methods.py`, and will not actually alter the name.

With this method we can be sure that we are unit testing `say_hello` exclusively, and the results of our test are not dependant on `capitlise` performing as it should.
