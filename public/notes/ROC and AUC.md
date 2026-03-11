[[Precision]], [[Recall]], [[False positive rate]], [[Accuracy]] 
all calculated at a single classification threshold value

But if you want to evaluate a model's quality across all possible thresholds, you need different tools.

- The [[ROC|ROC curve]] is a visual representation of model performance across all thresholds
- The area under the ROC curve ([[AUC]]) represents the probability that the model, if given a randomly chosen positive and negative example, will rank the positive higher than the negative.
- 
