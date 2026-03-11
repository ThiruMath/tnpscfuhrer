Accuracy is the proportion of all classifications that were correct, whether positive or negative. It is mathematically defined as:
$$\text{Accuracy} =
\frac{\text{correct classifications}}{\text{total classifications}}
= \frac{TP+TN}{TP+TN+FP+FN}
$$

A perfect model would have zero false positives and zero false negatives and therefore an accuracy of 1.0, or 100%.


The dataset that you split into train, test and evaluate sets has 9,998 negative examples and 2 positive examples. The resulting model has an accuracy rate of 99.9%. Can you trust this model based on that accuracy metric?

**No**

Accuracy is not a good metric to use to evaluate models with class-imbalanced datasets, like in the scenario here. A model that always predicted the negative class would have an accuracy of 99.9% even though it would have no ability to identify positive examples. For class-imbalanced datasets, you should consider using other evaluation metrics, such as precision or recall.

