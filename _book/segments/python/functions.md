# Functions in Python

Functions in Python are defined using the `def` keyword, and are dependant on clean indentation/white space.

``` py
def sayHello(name):
  print("hello " + name)

...

print(sayHello("Alice")) # --> "Hello Alice"
```

or

``` py
def addNumbers(a, b):
  return a + b

...

print(addNumbers(1, 2)) # --> 3
```

are examples of two very simple functions.

The rules for indentation follow for each nested block/scope

``` py
def canLegallyDrive(age):
    requiredAge = 16
    if age >= requiredAge:
        return bool(1)
    else:
        return bool(0)

...

print(canLegallyDrive(18)) # --> True
print(canLegallyDrive(13)) # --> False
```

## To Learn more about Python Functions

* [W3Schools](https://www.w3schools.com/python/python_functions.asp)
* [Methods vs Functions](https://www.datacamp.com/community/tutorials/functions-python-tutorial)
* [Interactive Tutorial](https://www.learnpython.org/en/Functions)
