The goal of normalization is to transform features to be on a similar scale. For example, consider the following two features:

1. Feature X spans the range 154 to 24,917,482.
2. Feature Y spans the range 5 to 22.

These two features span very different ranges. 

Normalization might manipulate X and Y so that they span a similar range, perhaps 0 to 1.


Normalization provides the following benefits:

- Helps models **converge more quickly** during training. 
	- When different features have different ranges, gradient descent can "bounce" and slow convergence. 
	- That said, more advanced optimizers like [[Adagrad]] and [[Adam]] protect against this problem by changing the effective learning rate over time.
- **Helps models infer better predictions.** 
	- When different features have different ranges, the resulting model might make somewhat less useful predictions.
- **Helps avoid the "[[NaN trap]]"** when feature values are very high. 
	- NaN is an abbreviation for not a number. 
	- When a value in a model exceeds the floating-point precision limit, the system sets the value to NaN instead of a number. 
	- When one number in the model becomes a NaN, other numbers in the model also eventually become a NaN.
- **Helps the model learn appropriate weights for each feature**. 
	- Without feature scaling, the model pays too much attention to features with wide ranges and not enough attention to features with narrow ranges.


- [[Linear scaling]]
- Z-score scaling 
- Log scaling


Linear scaling 

- When the feature is uniformly distributed across a fixed range.

Z-score scaling

- When the feature distribution does not contain extreme outliers.

Log scaling

- When the feature conforms to the power law

Clipping

- When the feature contains extreme outliers.

