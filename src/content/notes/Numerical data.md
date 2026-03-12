A machine learning (ML) model's health is determined by its data. Feed your model healthy data and it will thrive; feed your model junk and its predictions will be worthless.

Best practices for working with numerical data:

- Remember that your ML model interacts with the data in the [[feature vector]], not the data in the dataset.
- Normalize most numerical features.
- If your first normalization strategy doesn't succeed, consider a different way to normalize your data.
- Binning, also referred to as bucketing, is sometimes better than normalizing.

Considering what your data should look like, write verification tests to validate those expectations. For example:
- The absolute value of latitude should never exceed 90. You can write a test to check if a latitude value greater than 90 appears in your data.
- If your data is restricted to the state of Florida, you can write tests to check that the latitudes fall between 24 through 31, inclusive.
- Visualize your data with scatter plots and histograms. Look for anomalies.
- Gather statistics not only on the entire dataset but also on smaller subsets of the dataset. That's because aggregate statistics sometimes obscure problems in smaller sections of a dataset.
- Document all your data transformations.

Data is your most valuable resource, so treat it with care.