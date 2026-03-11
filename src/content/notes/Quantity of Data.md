As a rough rule of thumb, your model should train on at least an order of magnitude (or two) more examples than trainable parameters. However, good models generally train on substantially more examples than that.

Models trained on large datasets with few features generally outperform models trained on small datasets with a lot of features. [[Google]] has historically had great success training simple models on large datasets.

Different datasets for different machine learning programs may require wildly different amounts of examples to build a useful model. For some relatively simple problems, a few dozen examples might be sufficient. For other problems, a trillion examples might be insufficient.

It's possible to get good results from a small dataset if you are adapting an existing model already trained on large quantities of data from the same schema.