- Log scaling computes the logarithm of the raw value. 
- In theory, the logarithm could be any base; in practice, log scaling usually calculates the natural logarithm (ln).

Log scaling is helpful when the data conforms to a power law distribution. Casually speaking, a power law distribution looks as follows:

- Low values of X have very high values of Y.
- As the values of X increase, the values of Y quickly decrease. 
- Consequently, high values of X have very low values of Y.

Movie ratings are a good example of a power law distribution. In the following figure, notice:

- A few movies have lots of user ratings. (Low values of X have high values of Y.)
- Most movies have very few user ratings. (High values of X have low values of Y.)

Log scaling changes the distribution, which helps train a model that will make better predictions.

