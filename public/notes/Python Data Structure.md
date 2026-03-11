Here's a cheat sheet for Lesson 3: Data Structures in [[Python Intro]]:

### Lists:
- **Definition:** Ordered collection of items.
- **Creation:** Using square brackets `[]`.
- **Indexing:** Accessing elements by their position.
- **Slicing:** Extracting a subset of elements.
- **Methods:** Built-in functions to manipulate lists.
  - `append()`: Adds an element to the end.
  - `insert()`: Inserts an element at a specified position.
  - `remove()`: Removes the first occurrence of a value.
  - `pop()`: Removes and returns the element at a specified index.
- **Example:**
```python
my_list = [1, 2, 3, 4, 5]
print(my_list[0])    # Output: 1
print(my_list[1:3])  # Output: [2, 3]
my_list.append(6)
print(my_list)       # Output: [1, 2, 3, 4, 5, 6]
```

### Tuples:
- **Definition:** Ordered, immutable collection of items.
- **Creation:** Using parentheses `()`.
- **Accessing Elements:** Similar to lists, using indexing.
- **Example:**
```python
my_tuple = (1, 2, 3)
print(my_tuple[0])   # Output: 1
```

### Dictionaries:
- **Definition:** Unordered collection of key-value pairs.
- **Creation:** Using curly braces `{}`.
- **Accessing Values:** Using keys.
- **Methods:**
  - `keys()`: Returns a list of all keys.
  - `values()`: Returns a list of all values.
  - `items()`: Returns a list of key-value tuples.
- **Example:**
```python
my_dict = {'a': 1, 'b': 2, 'c': 3}
print(my_dict['a'])          # Output: 1
print(my_dict.keys())        # Output: dict_keys(['a', 'b', 'c'])
print(my_dict.values())      # Output: dict_values([1, 2, 3])
```

### Notes:
- Lists and dictionaries are mutable, meaning they can be modified after creation.
- Tuples are immutable, meaning they cannot be modified after creation.
- Lists are used for sequential data, tuples for fixed collections, and dictionaries for key-value mappings.