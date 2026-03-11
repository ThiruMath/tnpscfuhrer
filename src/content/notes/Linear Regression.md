***Description***: Linear regression models the relationship between dependent and independent variables using a linear approach.

Linear regression is a statistical technique used to find the relationship between variables. In an ML context, linear regression finds the relationship between [[features]] and a [[label]].

In algebraic terms, the model would be defined as
              *$y = mx + b$ 

    $y$ - the value we want to predict.

    $m$ - is the slope of the line

    $b$ - is the y-intercep

In ML, we write the equation for a linear regression model as follows:

             $y' = b + w_1x_1$

     $y'$  - is the predicted label—the output.
 
     $b$ - is the bias of the model. Bias is the same concept as the y-intercept in the algebraic equation for a line. In ML, bias is sometimes referred to as . Bias is a parameter of the model and is calculated during training.

     $w_1$ - is the weight of the feature. Weight is the same concept as the slope in the algebraic equation for a line. Weight is a parameter of the model and is calculated during training.

     $x_1$ - is a feature—the input


[[Gradient descent]]



***Key Points***:

- Simple and easy to implement.
- Assumes a linear relationship between the variables.
- Sensitive to outliers.

***Applications***: House price prediction, sales forecasting, risk management

##### Step 1: [[Data Pre Processing]]

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('studentscores.csv')
X = df.iloc[ : ,   : 1 ].values
Y = df.iloc[ : , 1 ].values

from sklearn.cross_validation import train_test_split
X_train, X_test, Y_train, Y_test = train_test_split( X, Y, test_size = 1/4, random_state = 0)
```

Avoiding Dummy Variable Trap

X = X[: , 1:]

##### Step 2: [[Fitting Simple Linear Regression model to the Training set]]

- LinearRegression()

```python
from sklearn.linear_model import LinearRegression
regressor = LinearRegression()
regressor = regressor.fit(X_train, Y_train)
```

##### Step 3: [[Predecting the Result]]

```python
Y_pred = regressor.predict(X_test)
```

##### Step 4: Visualization

```python
#Visualising the Training results

plt.scatter(X_train , Y_train, color = 'red')

plt.plot(X_train , regressor.predict(X_train), color ='blue')
```


```python
#Visualizing the test results

plt.scatter(X_test , Y_test, color = 'red')

plt.plot(X_test , regressor.predict(X_test), color ='blue')
```