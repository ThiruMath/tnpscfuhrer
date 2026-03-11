Python keywords cannot be used as the names of **variables, functions, and classes**.

```python
import keyword
 
# printing all keywords at once using "kwlist()"
print("The list of keywords is : ")
print(keyword.kwlist)
```
Output 
```
The list of keywords are: 
['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 
'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 
'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']
```

- **None**: This is a special constant used to denote a null value or a void. It’s important to remember, 0, any empty container(e.g. empty list) does not compute to None. 
- It is an object of its datatype – NoneType. It is not possible to create multiple None objects and can assign them to variables.

True, False, and None Use in Python
- False is 0, and True is 1.
- True + True + True is 3.
- True + False + False is 1.
- None isn’t equal to 0 or an empty list ([]).
