***Description***: Logistic regression models the probability of a **binary** outcome using a logistic function. It outputs probabilities and classifies instances by setting a threshold (usually 0.5).

- Logistic regression is an extremely efficient mechanism for calculating probabilities.

***Key Points:***

- Simple and easy to implement.
- Assumes linear relationship between the input features and the log-odds of the outcome.
- Works well for binary classification problems.

***Applications***: Email spam detection, disease diagnosis, credit scoring.

**Characteristics**

- The label is categorical. 
- The term logistic regression usually refers to binary logistic regression, that is, to a model that calculates probabilities for labels with two possible values. 
- A less common variant, multinomial logistic regression, calculates probabilities for labels with more than two possible values.
- The [[Loss]] function during training is Log Loss. (Multiple Log Loss units can be placed in parallel for labels with more than two possible values.)
- The model has a linear architecture, not a deep [[Neural Networks]]. However, the remainder of this definition also applies to deep models that predict probabilities for categorical labels.

A logistic regression model uses the following two-step architecture:

- The model generates a raw prediction (y') by applying a linear function of input features.
- The model uses that raw prediction as input to a [[Sigmoid Function]], which converts the raw prediction to a value between 0 and 1, exclusive.

Like any regression model, a logistic regression model predicts a number. However, this number typically becomes part of a binary classification model as follows:

- If the predicted number is greater than the classification threshold, the binary classification model predicts the positive class.
- If the predicted number is less than the classification threshold, the binary classification model predicts the negative class.

