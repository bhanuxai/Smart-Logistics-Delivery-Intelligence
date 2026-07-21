import pandas as pd
import joblib
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from urllib.parse import quote_plus
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
load_dotenv()
# ===================================
# DATABASE CONFIGURATION
# ===================================

DB_USER = "root"
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "smart_logistics_db"

engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

print("✅ Connected Successfully")

# ===================================
# LOAD DATA
# ===================================

query = """
SELECT
    c.customer_state,
    s.seller_state,
    p.product_category_name,
    pay.payment_type,
    oi.price,
    oi.freight_value,
    DATEDIFF(
        o.order_delivered_customer_date,
        o.order_purchase_timestamp
    ) AS delivery_days

FROM orders o

JOIN customers c
ON o.customer_id = c.customer_id

JOIN order_items oi
ON o.order_id = oi.order_id

JOIN sellers s
ON oi.seller_id = s.seller_id

JOIN products p
ON oi.product_id = p.product_id

JOIN payments pay
ON o.order_id = pay.order_id

WHERE
o.order_delivered_customer_date IS NOT NULL
AND o.order_purchase_timestamp IS NOT NULL;
"""

df = pd.read_sql(query, engine)

print(f"\nDataset Loaded : {df.shape}")

# ===================================
# DATA CLEANING
# ===================================

df["product_category_name"] = df["product_category_name"].fillna("Unknown")

# ===================================
# LABEL ENCODING
# ===================================

encoders = {}

categorical_columns = [
    "customer_state",
    "seller_state",
    "product_category_name",
    "payment_type"
]

for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    encoders[col] = le

# ===================================
# FEATURES
# ===================================

X = df.drop("delivery_days", axis=1)
y = df["delivery_days"]

# ===================================
# TRAIN TEST SPLIT
# ===================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ===================================
# TRAIN MODEL
# ===================================

print("\nTraining Random Forest...")

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("✅ Model Trained Successfully")

# ===================================
# EVALUATION
# ===================================

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\n========== MODEL PERFORMANCE ==========")
print(f"Mean Absolute Error : {mae:.2f} Days")
print(f"R² Score            : {r2:.4f}")

# ===================================
# SAVE MODEL
# ===================================

joblib.dump(model, "delivery_model.pkl")
joblib.dump(encoders, "label_encoders.pkl")

print("\n✅ delivery_model.pkl Saved")
print("✅ label_encoders.pkl Saved")