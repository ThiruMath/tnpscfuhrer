As mentioned in the [[Linear Regression]] module, calculating prediction bias is a quick check that can flag issues with the model or training data early on

Prediction bias is the difference between the mean of a model's predictions and the mean of ground-truth labels in the data.


Prediction bias can be caused by

- Biases or [[Noise]] in the data, including biased sampling for the training set
- Too-strong [[Data Science/Regularization]], meaning that the model was oversimplified and lost some necessary complexity
- Bugs in the model training pipeline
- The set of features provided to the model being insufficient for the task

