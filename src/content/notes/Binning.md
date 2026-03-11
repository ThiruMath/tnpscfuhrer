- Binning (also called bucketing) is a [[Feature Engineering]] technique that groups different numerical subranges into bins or buckets. I
- n many cases, binning turns numerical data into categorical data. 

For example, consider a feature named X whose lowest value is 15 and highest value is 425. Using binning, you could represent X with the following five bins:

- Bin 1: 15 to 34
- Bin 2: 35 to 117
- Bin 3: 118 to 279
- Bin 4: 280 to 392
- Bin 5: 393 to 425


Binning is a good alternative to [[Normalization|scaling]] or [[Clipping]] when either of the following conditions is met:

- The overall linear relationship between the feature and the label is weak or nonexistent.
- When the feature values are clustered.

Binning can feel counterintuitive, given that the model in the previous example treats the values 37 and 115 identically. 
But when a feature appears more clumpy than linear, binning is a much better way to represent the data.

**Quantile bucketing** creates bucketing boundaries such that the number of examples in each bucket is exactly or nearly equal.
- Quantile bucketing mostly hides the outliers.
- Bucketing with equal intervals works for many data distributions. 
- For skewed data, however, try quantile bucketing. 
- Equal intervals give extra information space to the long tail while compacting the large torso into a single bucket. 
- Quantile buckets give extra information space to the large torso while compacting the long tail into a single bucket.



