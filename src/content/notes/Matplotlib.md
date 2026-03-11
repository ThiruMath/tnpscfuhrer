 [[Matplotlib]], a popular data visualization library in Python:

### **Matplotlib Cheat Sheet:**

#### **1. **Import Matplotlib:**
```python
import matplotlib.pyplot as plt
```

#### **2. **Basic Plotting:**
```python
# Line Plot
plt.plot(x, y, label='label')
plt.xlabel('X-axis label')
plt.ylabel('Y-axis label')
plt.title('Title')
plt.legend()
plt.show()
```

#### **3. **Scatter Plot:**
```python
plt.scatter(x, y, color='color', marker='marker', s=size, label='label')
```

#### **4. **Bar Chart:**
```python
plt.bar(x, height, color='color', width=width, label='label')
```

#### **5. **Histogram:**
```python
plt.hist(data, bins=number_of_bins, color='color', edgecolor='edgecolor')
```

#### **6. **Box Plot:**
```python
plt.boxplot(data, vert=True or False, patch_artist=True or False)
```

#### **7. **Pie Chart:**
```python
plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=angle, colors=colors)
```

#### **8. **Subplots:**
```python
plt.subplot(rows, columns, index)
```

#### **9. **Customization:**
```python
# Figure Size
plt.figure(figsize=(width, height))

# Color Map
cmap = plt.get_cmap('color_map')

# Grid
plt.grid(True)

# Axis Limits
plt.xlim(x_min, x_max)
plt.ylim(y_min, y_max)
```

#### **10. **Save Figure:**
```python
plt.savefig('filename.png', format='png', dpi=dots_per_inch)
```

This cheat sheet covers some commonly used Matplotlib functions. Experiment with these and refer to the Matplotlib documentation for more advanced features and customization options.