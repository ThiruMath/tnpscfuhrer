Gradient descent is a mathematical technique that iteratively finds the weights and bias that produce the model with the lowest loss. 

Gradient descent finds the best weight and bias by repeating the following process for a number of user-defined iterations.

The model begins training with randomized weights and biases near zero, and then repeats the following steps:

1. Calculate the loss with the current weight and bias.

2. Determine the direction to move the weights and bias that reduce loss.

3. Move the weight and bias values a small amount in the direction that reduces loss.

4. Return to step one and repeat the process until the model can't reduce the loss any further.

### Model convergence and loss curves



### Convergence and convex functions

The loss functions for linear models always produce a convex surface. As a result of this property, when a linear regression model converges, we know the model has found the weights and bias that produce the lowest loss

