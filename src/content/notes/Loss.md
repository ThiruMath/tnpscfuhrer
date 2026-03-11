
Loss is a numerical metric that describes how wrong a model's [[predictions]] are.

Loss measures the distance between the model's predictions and the actual labels. The goal of training a model is to minimize the loss, **reducing it to its lowest possible value.**

### Distance of loss

In [[General/Notion/Math/Statistics]] and [[machine learning]], loss measures the difference between the predicted and actual values.

Loss focuses on the distance between the values, not the direction. 

For example, if a model predicts 2, but the actual value is 5, we don't care that the loss is negative (-3). Instead, we care that the distance between the values is 3. Thus, all methods for calculating loss remove the sign.

The two most common methods to remove the sign are the following:

- Take the absolute value of the difference between the actual value and the prediction.
- Square the difference between the actual value and the prediction.

### Types of loss

**$L_1$ loss** 

- The sum of the absolute values of the difference between the predicted values and the actual values.
- $\sum| actual\ value - predicted\ value |$

[[Means Absolute Error]] (MAE)

- The average of $L_1$ losses across a set of examples.	
- $\frac{1}{N} \sum | actual\ value - predicted\ value |$

$L_2$ loss

- The sum of the squared difference between the predicted values and the actual values.
- $\sum(actual\ value - predicted\ value)^2$

[[Means Squared Error]] (MSE)

- The average of $L_2$ losses across a set of examples.
- $\frac{1}{N} \sum (actual\ value - predicted\ value)^2$

The functional difference between L1 loss and L2 loss (or between MAE and MSE) is squaring. 

When the difference between the prediction and label is large, squaring makes the loss even larger. When the difference is small (less than 1), squaring makes the loss even smaller.

When processing multiple examples at once, we recommend averaging the losses across all the examples, whether using MAE or MSE.

### Choosing a loss

When choosing the best loss function, consider how you want the model to treat outliers. For instance, MSE moves the model more toward the outliers, while MAE doesn't.

L2 loss incurs a much higher penalty for an outlier than L1 loss.


**MSE**. The model is closer to the outliers but further away from most of the other data points.

**MAE**. The model is further away from the outliers but closer to most of the other data points.



