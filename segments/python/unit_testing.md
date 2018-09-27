# Unit Testing

## Index
  * [Setup](#setup)
  * [Define a test](#define-a-test)
  * [Test Structure Convention](#test-structure-convention)
  * [Expecting Errors](#expecting-errors)

## Setup

You will want a directory named `tests` that will include all of your unit test files.

We will be using `pytest` as our testing library, and `pytest` requires that all unit-test files follow the naming convention of `*_test.py` or `test_*.py`.

You can includes files that do not include `test_` in their name and they will not be recognised as testing files, but may be imported / utilised within your tests.
This is a great way of [mocking modules](#mocking-your-own-modules), as you can simulate your import structure but only use the module you are testing.

## Define a Test

Defining a test within a test file is simple. Define a function within your `test_*.py`/`*_test.py` file, where the function name begins with `test_`.

You will also need to make sure you import `pytest` at the top of the file.

``` py
import pytest

def test_function():
  ## Do test stuff here
```

## Test Structure Convention

A good testing convention can to follow is "Arrange, Act, Assert"

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

## Expecting Errors

In some cases you will want to set up a test where the action should raise an exception / error. With pytest you can ensure that the correct error will occur with the code:

``` py
with pytest.raises(expected_error):
  """Act here"""
```
