Hyperparameters are variables that control different aspects of training. Three common hyperparameters are:

- Learning rate
- Batch size
- Epochs

#### Learning rate

- Learning rate is a floating point number you set that influences how quickly the model converges. 
- If the learning rate is too low, the model can take a long time to converge. 
- However, if the learning rate is too high, the model never converges, but instead bounces around the weights and bias that minimize the loss. 
- The goal is to pick a learning rate that's not too high nor too low so that the model converges quickly.

#### Batch Size

- Batch size is a hyperparameter that refers to the number of examples the model processes before updating its weights and bias. 
- You might think that the model should calculate the loss for every example in the dataset before updating the weights and bias. 
- However, when a dataset contains hundreds of thousands or even millions of examples, using the full batch isn't practical.

**Stochastic gradient descent (SGD):**

- Stochastic gradient descent uses only a single example (a batch size of one) per iteration. 
- Given enough iterations, SGD works but is very noisy. 
- "[[Noise]]" refers to variations during training that cause the loss to increase rather than decrease during an iteration. 
- The term "stochastic" indicates that the one example comprising each batch is chosen at random.

**Mini-batch stochastic gradient descent (mini-batch SGD):**

- Mini-batch stochastic gradient descent is a compromise between full-batch and SGD. 
- For number of data points, the batch size can be any number greater than 1 and less than 
- The model chooses the examples included in each batch at random, averages their gradients, and then updates the weights and bias once per iteration.
- Determining the number of examples for each batch depends on the dataset and the available compute resources. 
- In general, small batch sizes behaves like SGD, and larger batch sizes behaves like full-batch gradient descent.

#### Epochs

- During training, an epoch means that the model has processed every example in the training set once. 
- For example, given a training set with 1,000 examples and a mini-batch size of 100 examples, it will take the model 10 iterations to complete one epoch.
- Training typically requires many epochs. That is, the system needs to process every example in the training set multiple times.
- The number of epochs is a hyperparameter you set before the model begins training. 
- In many cases, you'll need to experiment with how many epochs it takes for the model to converge. 
- In general, **more epochs produces a better** model, but also takes **more time to train.**



Full batch

- After the model looks at all the examples in the dataset. For instance, if a dataset contains 1,000 examples and the model trains for 20 epochs, the model updates the weights and bias 20 times, once per epoch.

Stochastic gradient descent

- After the model looks at a single example from the dataset. For instance, if a dataset contains 1,000 examples and trains for 20 epochs, the model updates the weights and bias 20,000 times.

Mini-batch stochastic gradient descent	

- After the model looks at the examples in each batch. For instance, if a dataset contains 1,000 examples, and the batch size is 100, and the model trains for 20 epochs, the model updates the weights and bias 200 times.