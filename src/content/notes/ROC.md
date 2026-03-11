Receiver-operating characteristic curve

The ROC curve is a visual representation of model performance across all thresholds. The long version of the name, receiver operating characteristic, is a holdover from [[WWII]] radar detection.

The ROC curve is drawn by calculating the [[Recall|True Positive Rate]] (TPR) and [[False positive rate]] (FPR) at every possible threshold (in practice, at selected intervals), then graphing TPR over FPR. A perfect model, which at some threshold has a TPR of 1.0 and a FPR of 0.0, can be represented by either a point at (0, 1) if all other thresholds are ignored, or by the following: