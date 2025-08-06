import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler, OrdinalEncoder, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.neural_network import MLPClassifier

df = pd.read_csv("your_data.csv")

# Cleaning
df['max_power'] = pd.to_numeric(df['max_power'], errors='coerce')
df.dropna(inplace=True)

# Number of data rows
print("Number of data rows:", df.shape[0])

# Normalization
scale = MinMaxScaler()
df['engine'] = scale.fit_transform(
    df[['engine']].replace('cc', '', regex=True)
)

# Standardization
standard_scale = StandardScaler()
df['max_power'] = standard_scale.fit_transform(df[['max_power']])

# One-hot encoding
one_hot_encoder = OneHotEncoder(sparse_output=False, dtype='int', handle_unknown='ignore')
encoded_data = one_hot_encoder.fit_transform(df[['fuel', 'seller_type', 'transmission']])
df_encoded = pd.DataFrame(encoded_data, columns=one_hot_encoder.get_feature_names_out())
df = pd.concat([df, df_encoded], axis=1)
df.drop(['fuel', 'seller_type', 'transmission'], axis=1, inplace=True)

# Binning
df['price_category'] = pd.cut(df['selling_price'], bins=3, labels=False)

# Scaling
scaler = StandardScaler()
df['selling_price'] = scaler.fit_transform(df[['selling_price']])

df.drop(['Unnamed: 0', 'selling_price'], axis=1, inplace=True)

# Train-test split
X = df.drop(['price_category'], axis=1)
y = df['price_category']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Number of training rows:", X_train.shape[0])
print("Number of testing rows:", X_test.shape[0])

mlp_classifier = MLPClassifier(hidden_layer_sizes=(50, 30), max_iter=1000)
mlp_classifier.fit(X_train, y_train)

# Predict
y_pred = mlp_classifier.predict(X_test)

print("Hidden layers size:", mlp_classifier.hidden_layer_sizes)
print("Number of iterations:", mlp_classifier.n_iter_)
print("Number of outputs:", mlp_classifier.n_outputs_)
print("Classes:", mlp_classifier.classes_)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
