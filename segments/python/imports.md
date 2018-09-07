# Import System for Python

In python you can import libraries/modules quite simply.

An example would be importing the built in `json` library into one of your `.py` files.

``` py
import json
```

This will import the library and all of its functionality. The imported library is named `json` and you can refer to it within your code as `json`

You may also import public methods/functions/classes from your other files.

``` py
from functions import sayHello
```

Where there is a file within your root directory named `functions` containing a public function named `sayHello`.


Alternatively, if the `functions.py` file was located within a `utiltiies` directory

``` py
from utilities.functions import sayHello
```

In both of the above cases, the imported function can be referenced as `sayHello`

However, if `functions.py` housed a collection of functions, you may import the whole file instead.

``` py
import utiltities.functions
```

And you would refer to this within your code as `utilities.functions`, e.g

``` py
utilities.functions.sayHello("Alice")
```

## Read more about the Python Import System

* [Python Import System Docs/Tutorial](https://docs.python.org/3/reference/import.html)
