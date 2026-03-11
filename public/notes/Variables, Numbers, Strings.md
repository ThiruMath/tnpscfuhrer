
Sure, here's a cheat sheet covering variables, numbers, and strings in Python:

### Variables
- **Definition**: A variable is a name that refers to a value.
- **Syntax**: `variable_name = value`
- **Naming Rules**:
  - Must start with a letter or underscore (`_`)
  - Can contain letters, numbers, and underscores
  - Case-sensitive (`myVar` and `myvar` are different)

### Numbers
1. **Integers**:
   - Examples: `5`, `-3`, `0`
   - No decimal point

2. **Floats**:
   - Examples: `3.14`, `-0.001`, `2.0`
   - Contains a decimal point

3. **Complex Numbers**:
   - Examples: `3+4j`, `1j`
   - `j` denotes the imaginary part

4. **Basic Operations**:
   - Addition: `a + b`
   - Subtraction: `a - b`
   - Multiplication: `a * b`
   - Division: `a / b` (always returns a float)
   - Floor Division: `a // b` (integer division)
   - Modulus: `a % b` (remainder of the division)
   - Exponentiation: `a ** b` (a raised to the power of b)

### Strings
1. **Definition**: A sequence of characters.
   - Examples: `'hello'`, `"world"`, `'''multi-line string'''`, `"""multi-line string"""`

2. **Basic Operations**:
   - Concatenation: `str1 + str2`
   - Repetition: `str * n` (repeats the string `n` times)
   - Length: `len(str)`

3. **Indexing and Slicing**:
   - Indexing: `str[index]` (starts at 0)
   - Slicing: `str[start:end]` (end index is exclusive)
   - Example: `str[1:4]` (characters from index 1 to 3)

4. **String Methods**:
   - `str.lower()`: converts to lowercase
   - `str.upper()`: converts to uppercase
   - `str.strip()`: removes whitespace from both ends
   - `str.replace(old, new)`: replaces occurrences of `old` with `new`
   - `str.split(delimiter)`: splits the string into a list
   - `str.find(substring)`: returns the index of the first occurrence of `substring`
   - `str.join(iterable)`: joins elements of `iterable` into a single string

### Examples

```python
# Variables
name = "Alice"
age = 30
pi = 3.14159

# Numbers
a = 5
b = 3.2

# Operations
sum_ab = a + b          # 8.2
product_ab = a * b      # 16.0
floor_div = a // 2      # 2
modulus = a % 3         # 2
power = a ** 2          # 25

# Strings
greeting = "Hello"
full_greeting = greeting + ", " + name + "!"  # "Hello, Alice!"
repeat_greeting = greeting * 3                # "HelloHelloHello"
length_of_name = len(name)                    # 5

# Indexing and Slicing
first_char = name[0]       # 'A'
substring = name[1:4]      # 'lic'

# String Methods
lowercase_greeting = greeting.lower()  # 'hello'
uppercase_name = name.upper()          # 'ALICE'
stripped_name = "  Alice  ".strip()    # 'Alice'
replaced_greeting = greeting.replace("H", "J")  # 'Jello'
split_greeting = full_greeting.split(", ")      # ['Hello', 'Alice!']
found_index = greeting.find("e")       # 1
joined_str = ", ".join(["apple", "banana", "cherry"])  # 'apple, banana, cherry'
```

This cheat sheet should cover the basics for working with variables, numbers, and strings in Python. Let me know if you need more details or examples!