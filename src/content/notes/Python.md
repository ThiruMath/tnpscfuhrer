Certainly! Here’s a concise Python cheat sheet covering some of the basics and most commonly used features.

### Basic Syntax
```python
# Variables and Data Types
x = 5             # integer
y = 3.14          # float
name = "Alice"    # string
is_valid = True   # boolean

# Data Structures
my_list = [1, 2, 3]            # list
my_tuple = (1, 2, 3)           # tuple
my_set = {1, 2, 3}             # set
my_dict = {'key': 'value'}     # dictionary

# Comments
# This is a single-line comment
"""This is a
multi-line comment"""
```

### Basic Operations
```python
# Arithmetic
sum = 5 + 3       # addition
diff = 5 - 3      # subtraction
prod = 5 * 3      # multiplication
quot = 5 / 3      # division
mod = 5 % 3       # modulus
exp = 5 ** 3      # exponentiation

# Comparison
equal = 5 == 3    # equality
not_equal = 5 != 3 # inequality
greater = 5 > 3   # greater than
less = 5 < 3      # less than
```

### Control Flow
```python
# If-Else
if x > 0:
    print("Positive")
elif x == 0:
    print("Zero")
else:
    print("Negative")

# Loops
# For Loop
for i in range(5):
    print(i)

# While Loop
count = 0
while count < 5:
    print(count)
    count += 1
```

### Functions
```python
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))
```

### Classes and Objects
```python
class Dog:
    def __init__(self, name):
        self.name = name
    
    def bark(self):
        return f"{self.name} says woof!"

my_dog = Dog("Buddy")
print(my_dog.bark())
```

### File I/O
```python
# Reading a file
with open('file.txt', 'r') as file:
    content = file.read()

# Writing to a file
with open('file.txt', 'w') as file:
    file.write("Hello, World!")
```

### Common Modules
```python
import math
print(math.sqrt(16))

import random
print(random.randint(1, 10))

import datetime
print(datetime.datetime.now())
```

### List Comprehensions
```python
squares = [x**2 for x in range(10)]
print(squares)
```

### Exception Handling
```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
finally:
    print("Execution complete")
```

### Useful Built-in Functions
```python
len(my_list)        # Length of a list
str(123)            # Convert to string
int("123")          # Convert to integer
sum([1, 2, 3])      # Sum of a list
sorted([3, 1, 2])   # Sort a list
```

This cheat sheet provides a quick reference to Python's core features. For more detailed information, refer to the official Python documentation.