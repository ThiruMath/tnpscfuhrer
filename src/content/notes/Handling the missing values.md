Handling missing values is an essential step in data preprocessing. 
- Pandas provides several functions to detect and handle missing data efficiently. 

**Detecting Missing Values:**

- isnull(): Detects missing values and returns True where they exist.

- notnull(): Opposite of isnull(), returns True where values are not missing.

```python
#Detect missing values
print(df.isnull().sum())  # Count missing values in each column
```

**Dropping Missing Values:**

- If you want to remove rows or columns with missing data, you can use **dropna()**.

Drop rows with any missing value:
```python
df_cleaned = df.dropna()
```

Drop rows with missing values in a specific column:
```python
df_clean = df.dropna(subset=['col_name'])
```

Drop columns with any missing values:
```python
df_cleaned = df.dropna(axis=1)
```

**Filling Missing Values:**

- Instead of dropping rows/columns, you can fill in missing values using **fillna()**.

- Fill with a specific value (e.g., 0 or mean):

```python
df_filled = df.fillna(0)  # Replace all NaN with 0
df['col_name'].fillna(df['col_name'].mean(), inplace=True)  # Fill with column mean
```

Forward fill or backward fill (use the previous or next value):


```python
df_filled = df.fillna(method='ffill')  # Forward fill
df_filled = df.fillna(method='bfill')  # Backward fill
```

4. Replacing Missing Values with Interpolation:

You can use interpolation to estimate and fill missing values.

df_interpolated = df.interpolate(method='linear')

5. Replacing Missing Values with Group-based Strategies:

Sometimes it’s better to replace missing values based on groups (e.g., filling with the mean of specific groups).

df['column_name'] = df.groupby('group_column')['column_name'].transform(lambda x: x.fillna(x.mean()))