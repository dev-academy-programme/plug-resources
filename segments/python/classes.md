# Classes in Python

You may define a class like so:

``` py
class class_name:
  def class_method():
    #do stuff within class
```

This is the simplest version of a class.

A more contextual example would be:

``` py
class hello:
    def sayHello(self):
        print("hello")
```

Where the class `hello` has a `sayHello` method. Calling this method will print `"hello"`.

``` py
x = hello()
```

This will create a new instance of the `hello` class and assign it to `x`.

``` py
x.sayHello() # --> "hello"
```

Running this command will run the `sayHello` method within the instance of `hello` assigned to `x`. Resulting in "hello" being printed to the console.

---

Classes also may have variables held within their instance. These are defined like so:

``` py
class hello:
    name = "Alice"
    def sayHello():
        print("Hello")
```

Methods within classes will receive `self` as their first argument. `self` is a pointer referring to the instance of the class that the method is occuring within/from. Any local variables within the instance can be accessed from within the `self` variable.

``` py
class hello:
    name = "Alice"
    def sayHello(self):
        print("Hello " + self.name) # --> "Hello Alice"
```

You may assign new values to these local variables within class methods like so:

``` py
class hello:
    name = "Alice"
    def sayHello(self):
        print("Hello " + self.name)
    def setName(self, name):
        self.name = name
        print("Name set to " + name)

x = hello()

x.sayHello() # --> "Hello Alice"
x.setName("Bob") # --> "Name set to Bob"
x.sayHello() # --> "Hello Bob"
```

It is important to keep in mind that the class is a `constructor`, and so you can create many instances of said class, and each instance is unique. Like many goombas in a mario level.

``` py
class hello:
    name = "Alice"
    def sayHello(self):
        print("Hello " + self.name)
    def setName(self, name):
        self.name = name
        print("Name set to " + name)

x = hello()
y = hello()

x.sayHello() # --> "Hello Alice"
y.sayHello() # --> "Hello Alice"

x.setName("Bob") # --> "Name set to Bob"
y.setName("Sarah") # --> "Name set to Sarah"


x.sayHello() # --> "Hello Bob"
y.sayHello() # --> "Hello Sarah"

```

To pass initial variables / parameters into a class upon construction, the class must have an `__init__` method. For the examples we have been using, we can allow a name to be chosen upon instantiation, rather than using a placeholder.

``` py
def __init__(self, name):
      self.name = name
```

The `__init__` method will take `self` as the first argument

``` py
class hello:
    def __init__(self, name):
        self.name = name
    def sayHello(self):
        print("Hello " + self.name)

x = hello("Bob")

x.sayHello() # --> "Hello Bob"
```

Here is a more complex example for consolidation:

``` py
class Dog:
    age = 0
    def __init__(self, name, breed):
        self.name = name
    def ageOneYear(self):
        self.age+=1
    def toString(self):
        print("{} is {} years old".format(self.name, self.age))
    def bark(self):
        print("BARK!")

x = Dog("Cino", "Cavoodle")

x.toString() # --> "Cino is 0 years old"
x.ageOneYear()
x.toString() # --> "Cino is 1 years old"

x.bark() # --> "BARK!"
```

Classes my inherit from other classes, this allows a class to extend functionality from another.

``` py
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        print("Growl...")
    def toString(self):
        print("{} is {} years old".format(self.name, self.age))

class Dog(Animal):
    def __init(self, name):
        Animal.__init__(self, name)
        #Call upon the constructor of the parent class
    def speak(self):
        print("BARK!")

x = Animal("blah")
x.speak() # --> "Growl..."

y = Dog("Cino")
y.speak() # --> "BARK!"
y.toString() # --> "Cino is 0 years old"
# Dog has inherited the `toString` method from `Animal`
```


## Read more about Classes

* [Python Classes Tutorial](https://docs.python.org/3/tutorial/classes.html)
* [W3Schools](https://www.w3schools.com/python/python_classes.asp)
* [Interactive Tutorial](https://www.learnpython.org/en/Classes_and_Objects)
* [Read about Inheritence](https://www.python-course.eu/python3_inheritance.php)
* [Another Inheritence Tutorial](https://www.programiz.com/python-programming/inheritance)
