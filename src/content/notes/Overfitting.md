Overfitting means creating a model that matches (memorizes) the training set so closely that the model fails to make correct predictions on new data. An overfit model is analogous to an invention that performs well in the lab but is worthless in the real world.

**Fitting, overfitting, and underfitting**

- A model must make good predictions on new data. That is, you're aiming to create a model that "fits" new data.
- As you've seen, an overfit model makes excellent predictions on the training set but poor predictions on new data
- An underfit model doesn't even make good predictions on the training data. 

If an overfit model is like a product that performs well in the lab but poorly in the real world, then an underfit model is like a product that doesn't even do well in the lab.

**Detecting overfitting**

- [[Loss]] curves
- [[Generalization]] curves

A loss curve plots a model's loss against the number of training iterations. 

A graph that shows two or more loss curves is called a generalization curve.


Notice that the two loss curves behave similarly at first and then diverge. That is, after a certain number of iterations, loss declines or holds steady (converges) for the training set, but increases for the validation set. This suggests overfitting.

In contrast, a generalization curve for a well-fit model shows two loss curves that have similar shapes.


