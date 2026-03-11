Pandas library in Python:

### **Pandas Cheat Sheet for Data Science:**

#### **1. Importing Pandas:**
```python
import pandas as pd
```

#### **2. Reading Data:**
```python
df = pd.read_csv('filename.csv')  # Read from CSV
df = pd.read_excel('filename.xlsx')  # Read from Excel
```

#### **3. Data Exploration:**
```python
df.head()  # Display first 5 rows
df.info()  # Display data types and non-null counts
df.describe()  # Summary statistics
```

#### **4. Selection and Indexing:**
```python
df['column_name']  # Select a single column
df[['col1', 'col2']]  # Select multiple columns
df.loc[row_indexer, column_indexer]  # Label-based indexing
df.iloc[row_indexer, column_indexer]  # Integer-location based indexing
```

#### **5. Filtering Data:**
```python
df[df['column'] > value]  # Conditional filtering
df[(df['col1'] > val1) & (df['col2'] == val2)]  # Multiple conditions
```

#### **6. Handling Missing Data:**
```python
df.dropna()  # Drop rows with missing values
df.fillna(value)  # Fill missing values
```

#### **7. Grouping and Aggregation:**
```python
df.groupby('column').mean()  # Group by and calculate mean
df.groupby(['col1', 'col2']).agg({'col3': 'sum', 'col4': 'count'})  # Custom aggregation
```

#### **8. Sorting Data:**
```python
df.sort_values(by='column', ascending=False)  # Sort by column in descending order
```

#### **9. Data Cleaning:**
```python
df.drop_duplicates()  # Remove duplicate rows
df.rename(columns={'old_name': 'new_name'})  # Rename columns
```

#### **10. Exporting Data:**
```python
df.to_csv('new_file.csv', index=False)  # Save to CSV
df.to_excel('new_file.xlsx', index=False)  # Save to Excel
```

This is a concise guide, and you can explore the pandas documentation for more in-depth information.