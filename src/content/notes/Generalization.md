Generalization is the opposite of [[Overfitting]]. That is, a model that generalizes well makes good predictions on new data. Your goal is to create a model that generalizes well to new data.

**Generalization conditions**

A model trains on a training set, but the real test of a model's worth is how well it makes predictions on new examples, particularly on real-world data. While developing a model, your test set serves as a proxy for real-world data. Training a model that generalizes well implies the following dataset conditions:

- Examples must be independently and identically distributed, which is a fancy way of saying that your examples can't influence each other.
- The dataset is stationary, meaning the dataset doesn't change significantly over time.
- The dataset partitions have the same distribution. That is, the examples in the training set are statistically similar to the examples in the validation set, test set, and real-world data.


