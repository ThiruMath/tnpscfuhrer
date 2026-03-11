A function is a block of code designed to perform a specific task.

![[IMG-20231222-WA0000.jpg]]
Header 
Note that a function can also have no arguments, or it can have multiple arguments.

For every function, the parentheses enclosing the function argument(s) must be followed by a colon :

Body 
Every line of code in the function body must be indented exactly four spaces.


https://chat.openai.com/share/d75deb94-16bf-41a9-b1f8-7b8197a02a55

Variable "scope" in python explain with examples 

In Python, variable scope refers to the region of the code where a variable is accessible. There are mainly two types of variable scopes:

1. **Global scope:** Variables defined outside of any function have global scope, meaning they can be accessed from anywhere within the code.

    ```python
    global_var = 10  # Global variable

    def func():
        print(global_var)  # Accessing global_var within a function

    func()  # Output: 10
    print(global_var)  # Output: 10
    ```

2. **Local scope:** Variables defined within a function have local scope, meaning they are accessible only within that function.

    ```python
    def func():
        local_var = 20  # Local variable
        print(local_var)  # Accessing local_var within the function

    func()  # Output: 20
    print(local_var)  # This will cause an error because local_var is not accessible here
    ```

Additionally, Python has a concept of scope hierarchy where variables are looked up in a specific order: local scope, then enclosing functions' scopes, and finally the global scope.

Consider this example:

```python
x = 30  # Global variable

def outer_func():
    y = 40  # Enclosing function's variable
    
    def inner_func():
        z = 50  # Local variable
        print(x, y, z)  # Accessing variables from different scopes
    
    inner_func()

outer_func()  # Output: 30 40 50
```

Here, `inner_func()` can access variables from its local scope, the enclosing function's scope, and the global scope. However, variables defined inside `inner_func()` are not accessible outside of it or in other enclosing functions.

Understanding variable scope helps in writing cleaner and more maintainable code by managing the visibility and accessibility of variables.

