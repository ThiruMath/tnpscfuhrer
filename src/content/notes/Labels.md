**Direct versus proxy labels**

- **Direct labels**, which are labels identical to the prediction your model is trying to make. That is, the prediction your model is trying to make is exactly present as a column in your dataset. For example, a column named bicycle owner would be a direct label for a binary classification model that predicts whether or not a person owns a bicycle.
- **Proxy labels**, which are labels that are similar—but not identical—to the prediction your model is trying to make. For example, a person subscribing to Bicycle Bizarre magazine probably—but not definitely—owns a bicycle.

Direct labels are generally better than proxy labels. If your dataset provides a possible direct label, you should probably use it. Oftentimes though, direct labels aren't available.

Proxy labels are always a compromise—an imperfect approximation of a direct label. However, some proxy labels are close enough approximations to be useful. Models that use proxy labels are only as useful as the connection between the proxy label and the prediction.

Recall that every label must be represented as a floating-point number in the feature vector (because machine learning is fundamentally just a huge **amalgam** of mathematical operations). Sometimes, a direct label exists but can't be easily represented as a floating-point number in the feature vector. In this case, use a proxy label.

