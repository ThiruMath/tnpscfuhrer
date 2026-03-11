##### Step 1:  [[Import Required Libraries ]]

- [[NumPy]]: Numerical Computing 
- [[Pandas]]: Data Manipulation 

##### Step 2: [[Importing Data set]]

##### Step 3: [[Handling the missing values]]

- Detecting Missing Values:
	- isnull(): Detects missing values and returns True where they exist.
	- notnull(): Opposite of isnull(), returns True where values are not missing.
- Dropping Missing Values:
	- If you want to remove rows or columns with missing data, you can use dropna().
- Filling Missing Values:
	- Instead of dropping rows/columns, you can fill in missing values using fillna()
- Replacing Missing Values with Interpolation:

	- Means, Median,Mode
	- sklearn.preprocessing 

##### Step 4: Encoding Categorical Data

- Label Encoder 

##### Step 5: [[Splitting the dataset into test set & training set]]

```python

- train_test_split()

- from sklearn.model_selection import train_test_split 
```

##### Step 6: [[Feature Scaling]]

- **Min-Max Scaling** (Normalization): This technique scales the data between a fixed range, usually 0 and 1.
- **Z-score Normalization** (Standardization): This method scales the data such that the mean is 0 and the standard deviation is 1. 
- **MaxAbs Scaling**: This scales the data by its maximum absolute value, preserving the sign of the data (useful for data that is already centered around 0).
- **Robust Scaling**: This technique is less sensitive to outliers as it uses the median and **interquartile range (IQR)** instead of the mean and standard deviation for scaling.

**When to Use Feature Scaling**:

- Algorithms based on distance: Algorithms like k-NN, K-Means, SVM, and PCA rely on the distance between points and can be influenced by the scale of features.

- Gradient-based algorithms: Algorithms like gradient descent (used in linear regression, logistic regression, and neural networks) converge faster with feature scaling.

- [[Neural Networks]]: Feature scaling improves performance because it ensures faster convergence and avoids issues with large weight updates.


**When Not to Use Feature Scaling**:

- Tree-based algorithms: Algorithms like Decision Trees, Random Forests, and XGBoost do not require feature scaling because they are not distance-based and can handle features with varying magnitudes.

- Feature scaling ensures that your model performs optimally, treating each feature equally and helping distance- or gradient-based algorithms perform well.

