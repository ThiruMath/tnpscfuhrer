The following are common causes of unreliable data in datasets:

- **Omitted values**. For example, a person forgot to enter a value for a house's age.
- **Duplicate examples**. For example, a server mistakenly uploaded the same log entries twice.
- **Bad feature values**. For example, someone typed an extra digit, or a thermometer was left out in the sun.
- **Bad labels**. For example, a person mistakenly labeled a picture of an oak tree as a maple tree.
- **Bad sections of data**. For example, a certain feature is very reliable, except for that one day when the network kept crashing.

**Note**: Any sufficiently large or diverse dataset almost certainly contains outliers that fall outside your data schema or unit test bands. Determining how to handle outliers is an important part of machine learning. The [[Numerical data]] unit details how to handle numeric outliers.


Don't train a model on incomplete examples. Instead, fix or eliminate incomplete examples by doing one of the following:

- Delete incomplete examples.
- **Impute missing values**; that is, convert the incomplete example to a complete example by providing well-reasoned guesses for the missing values.

Imputation is the process of generating well-reasoned data, not random or deceptive data. Be careful: good imputation can improve your model; bad imputation can hurt your model.

One common algorithm is to use the [[Mean]] or [[Median]] as the imputed value. Consequently, when you represent a numerical feature with [[Z-score|Z-Scores]], then the imputed value is typically 0 (because 0 is generally the mean Z-score).