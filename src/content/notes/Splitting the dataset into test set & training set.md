
```python
# Import necessary libraries
import pandas as pd
from sklearn.model_selection import train_test_split

#you have 'features' and 'target' columns
X = df.drop('target_column', axis=1) # Features
y = df['target_column']  # Target

# Split the dataset (80% for training, 20% for testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Check the dimensions of the split datasets
print("Training set shape:", X_train.shape)
print("Test set shape:", X_test.shape)
```