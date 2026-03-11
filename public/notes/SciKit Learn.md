Basic Model

```python

from sklearn import preprocessing
X=preprocessing.StandardScaler().fit(X).transform(X)


from sklearn.model_selection import train_test_split X_train, X_test, y_train, y_test train_test_split(X, y, test_size=0.33)

from sklearn import svm
clf svm.SVC(gamma-0.001, C-100.)


clf.fit(X_train, y_train)


clf.predict(X_test)


from sklearn.metrics import confusion_matrix

print(confusion_matrix(y_test, yhat, labels=[1,0]))


import pickle spickle.dumps(clf)
```