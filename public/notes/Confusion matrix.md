- The [[Probability]] score is not reality, or ground truth. 
- There are four possible outcomes for each output from a binary classifier. 
- For the spam classifier example, if you lay out the ground truth as columns and the model's prediction as rows, the following table, called a confusion matrix, is the result:



|                    | Actual positive                                                                                                                                                 | Actual negative                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Predicted positive | **True positive (TP):** A spam email correctly classified as a spam email. These are the spam messages automatically sent to the spam folder.                   | **False positive (FP):** A not-spam email misclassified as spam. These are the legitimate emails that wind up in the spam folder.               |
| Predicted negative | **False negative (FN):** A spam email misclassified as not-spam. These are spam emails that aren't caught by the spam filter and make their way into the inbox. | **True negative (TN):** A not-spam email correctly classified as not-spam. These are the legitimate emails that are sent directly to the inbox. |

