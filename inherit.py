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
    def speak(self):
        print("BARK!")

x = Animal("blah")
x.speak() # --> "Growl..."

y = Dog("Cino")
y.speak() # --> "BARK!"
y.toString() # --> "Cino is 0 years old"
