- A Z-score is the number of [[Standard deviation|standard deviations]] a value is from the mean. 
- For example, a value that is 2 standard deviations greater than the [[Mean]] has a Z-score of +2.0. 
- A value that is 1.5 standard deviations less than the mean has a Z-score of -1.5.
- Representing a feature with Z-score scaling means storing that feature's Z-score in the feature vector
- Z-score scaling is also a good choice for data like a vaguely normal distribution.
- Z-score is a good choice when the data follows a [[Normal Distribution]] or a distribution somewhat like a normal distribution.

**Note** 

- that some distributions might be normal within the bulk of their range, but still contain extreme outliers. 
- For example, nearly all of the points in a **net_worth** feature might fit neatly into 3 standard deviations, but a few examples of this feature could be hundreds of standard deviations away from the mean. 
- In these situations, you can combine Z-score scaling with another form of normalization (usually [[Clipping]]) to handle this situation.