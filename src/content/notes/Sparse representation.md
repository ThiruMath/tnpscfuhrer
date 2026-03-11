A feature whose values are predominately zero (or empty) is termed a sparse feature. Many categorical features, such as car_color, tend to be sparse features. Sparse representation means storing the position of the 1.0 in a sparse vector. For example, the one-hot vector for "Blue" is:

[0, 0, 1, 0, 0, 0, 0, 0]

Since the 1 is in position 2 (when starting the count at 0), the sparse representation for the preceding one-hot vector is:

2

Notice that the sparse representation consumes far less memory than the eight-element one-hot vector. Importantly, the model must train on the one-hot vector, not the sparse representation.



Note: The sparse representation of a multi-hot encoding stores the positions of all the nonzero elements.