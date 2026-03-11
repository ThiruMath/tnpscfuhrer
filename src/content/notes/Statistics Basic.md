
1. [[Mean]] (Average)

Definition: The mean is the sum of all values divided by the number of values.

Explanation: It represents the central value of a dataset. Sensitive to outliers.

Formula:
$$
\text{Mean} = \frac{\sum_{i=1}^{n} x_i}{n}
$$

Given data: [5, 10, 15, 20, 25]  
Mean = (5 + 10 + 15 + 20 + 25) / 5 = 15

Python Code:

```python
data = [5, 10, 15, 20, 25]
mean = sum(data) / len(data)
print(mean)
```


2. Median

Definition: The median is the middle value of a dataset when ordered from least to greatest.

Explanation: It is less affected by outliers compared to the mean.

Formula:

If  is odd:
$$
\text{Median} = x_{\frac{n+1}{2}}
$$
$$
\text{Median} = \frac{x_{\frac{n}{2}} + x_{\frac{n}{2}+1}}{2}
$$

Given data: [5, 10, 15, 20, 25]  
Median = 15 (middle value)

Python Code:

```python
data = [5, 10, 15, 20, 25]
data.sort()
n = len(data)
median = data[n//2] if n % 2 != 0 else (data[n//2 - 1] + data[n//2]) / 2
print(median)
```


3. Mode

Definition: The mode is the value that appears most frequently in a dataset.

Explanation: A dataset may have more than one mode or no mode at all.

Formula: There is no specific formula; it is the most frequent value.

Example:
Given data: [5, 10, 10, 15, 20]
Mode = 10 (appears most frequently)

Python Code:

```python
from statistics import mode
data = [5, 10, 10, 15, 20]
mode_value = mode(data)
print(mode_value)
```

4. Variance

Definition: Variance measures how much the values in a dataset deviate from the [[Mean]].

Explanation: A higher variance means the data is more spread out.

Formula:
$$
\text{Variance} (\sigma^2) = \frac{\sum_{i=1}^{n} (x_i - \mu)^2}{n}
$$

Example:
Given data: [5, 10, 15, 20, 25]
Mean = 15, Variance = 

Python Code:

```python
import numpy as np
data = [5, 10, 15, 20, 25]
variance = np.var(data)
print(variance)
```


5. Standard Deviation

Definition: The standard deviation is the square root of the variance.

Explanation: It indicates how much values in a dataset typically differ from the mean.

Formula:
$$
\text{Standard Deviation} (\sigma) = \sqrt{\frac{\sum_{i=1}^{n} (x_i - \mu)^2}{n}}
$$

Python Code:

```python
standard_deviation = np.std(data)
print(standard_deviation)
```


6. Correlation

Definition: Correlation measures the strength and direction of the linear relationship between two variables.

Explanation: The value of correlation () ranges from -1 (perfect negative correlation) to +1 (perfect positive correlation).

Formula:

$$
r = \frac{\sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n} (x_i - \bar{x})^2 \sum_{i=1}^{n} (y_i - \bar{y})^2}}
$$

Given data for two variables X = [1, 2, 3, 4] and Y = [2, 4, 6, 8], the correlation is +1 (perfect positive correlation).

Python Code:

```python
data_x = [1, 2, 3, 4]
data_y = [2, 4, 6, 8]
correlation = np.corrcoef(data_x, data_y)[0, 1]
print(correlation)

```

7. Linear Regression

Definition: Linear regression estimates the relationship between a dependent variable (Y) and one or more independent variables (X).

Explanation: A simple linear regression fits a straight line through the data points.

Formula:
$$
Y = \beta_0 + \beta_1 X
$$

Example:
Given data X = [1, 2, 3] and Y = [2, 3, 4], linear regression would estimate .

Python Code:

```python
from sklearn.linear_model import LinearRegression
X = np.array([1, 2, 3]).reshape(-1, 1)
Y = np.array([2, 3, 4])
model = LinearRegression()
model.fit(X, Y)
print(f"Intercept: {model.intercept_}, Coefficient: {model.coef_[0]}")
```


8. Confidence Interval

Definition: A confidence interval is a range of values, derived from sample data, that is likely to contain the value of an unknown population parameter.

Explanation: A 95% confidence interval means that if the same population is sampled 100 times, the true parameter will fall within this range 95 times.

Formula:
$$
\text{CI} = \bar{x} \pm Z \times \frac{\sigma}{\sqrt{n}}
$$

Example:
For a sample mean of 50, sample standard deviation of 10, and 95% confidence interval (Z = 1.96), with ,
CI = 

Python Code:

```python
import scipy.stats as stats
sample_mean = 50
sample_std = 10
n = 100
z = 1.96  # Z-value for 95% confidence
margin_of_error = z * (sample_std / np.sqrt(n))
ci_lower = sample_mean - margin_of_error
ci_upper = sample_mean + margin_of_error
print(f"95% Confidence Interval: ({ci_lower}, {ci_upper})")
```



