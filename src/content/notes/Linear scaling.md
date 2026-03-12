
Linear scaling (more commonly shortened to just scaling) means converting floating-point values from their natural range into a standard range—usually 0 to 1 or -1 to +1.

 Linear scaling is a good choice when all of the following conditions are met:

- The lower and upper bounds of your data don't change much over time.
- The feature contains few or no outliers, and those outliers aren't extreme.
- The feature is approximately uniformly distributed across its range. That is, a histogram would show roughly even bars for most values.

Suppose human age is a feature. Linear scaling is a good normalization technique for age because:

- The approximate lower and upper bounds are 0 to 100.
- age contains a relatively small percentage of outliers. Only about 0.3% of the population is over 100.
- Although certain ages are somewhat better represented than others, a large dataset should contain sufficient examples of all ages.

**Note :** 

- Most real-world features do not meet all of the criteria for linear scaling. 
- [[Z-score]] scaling is typically a better normalization choice than linear scaling.