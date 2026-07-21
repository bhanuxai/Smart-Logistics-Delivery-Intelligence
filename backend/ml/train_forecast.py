import pandas as pd
import pymysql
import joblib
import os

from dotenv import load_dotenv
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

load_dotenv()

# ---------------------------------------
# Database Connection
# ---------------------------------------

connection = pymysql.connect(
    host="localhost",
    user="root",
    password=os.getenv("DB_PASSWORD"),
    database="smart_logistics_db",
    cursorclass=pymysql.cursors.DictCursor
)

# ---------------------------------------
# Load Historical Demand Data
# ---------------------------------------

query = """
SELECT
    YEAR(o.order_purchase_timestamp) AS year,
    MONTH(o.order_purchase_timestamp) AS month,
    p.product_category_name,
    COUNT(*) AS total_orders,
    AVG(oi.price) AS avg_price

FROM orders o

JOIN order_items oi
    ON o.order_id = oi.order_id

JOIN products p
    ON oi.product_id = p.product_id

WHERE
    p.product_category_name IS NOT NULL

GROUP BY
    YEAR(o.order_purchase_timestamp),
    MONTH(o.order_purchase_timestamp),
    p.product_category_name

ORDER BY
    year,
    month;
"""

cursor = connection.cursor()
cursor.execute(query)

rows = cursor.fetchall()

df = pd.DataFrame(rows)
print(df["avg_price"].head())
print(type(df["avg_price"].iloc[0]))
df["avg_price"] = df["avg_price"].astype(float)
df["total_orders"] = df["total_orders"].astype(int)

cursor.close()
connection.close()

print("\nDataset Loaded Successfully")
print(df.head())
print(df.shape)
print(df.dtypes)

# Encode category

encoder = LabelEncoder()

df["product_category_name"] = encoder.fit_transform(
    df["product_category_name"]
)

# Features

X = df[
    [
        "year",
        "month",
        "product_category_name",
        "avg_price"
    ]
]

y = df["total_orders"]

# Train Test Split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Model

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# Prediction

pred = model.predict(X_test)

print("MAE :", mean_absolute_error(y_test, pred))
print("RMSE:", mean_squared_error(y_test, pred) ** 0.5)
print("R2  :", r2_score(y_test, pred))

# Save
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")

os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(model, os.path.join(MODEL_DIR, "forecast_model.pkl"))
joblib.dump(encoder, os.path.join(MODEL_DIR, "forecast_encoder.pkl"))

print("✅ Forecast model saved successfully!")

print("Forecast model saved successfully!")