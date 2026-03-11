

[[Accuracy]] = $$\frac{TP+TN}{TP+TN+FP+FN}$$

[[Recall]] =  $$\frac{TP}{TP+FN}$$

[[Precision]] = $$\frac{TP}{TP+FP}$$
[[False positive rate]] = $$\frac{FP}{FP+TN}$$

[[Accuracy]] 

- Use as a rough indicator of model training progress/convergence for balanced datasets.
- For model performance, use only in combination with other metrics.
- Avoid for **imbalanced datasets**. Consider using another metric.

[[Recall]] - (True positive rate)

- Use when false negatives are more expensive than false positives.

[[False Positive Rate]]

- Use when false positives are more expensive than false negatives.

[[Precision]]

- Use when it's very important for positive predictions to be accurate.

