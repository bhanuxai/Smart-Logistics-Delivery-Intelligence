import pandas as pd
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

print("=" * 60)
print("SMART LOGISTICS - INVENTORY MODEL TRAINING")
print("=" * 60)

# -----------------------------
# Load datasets
# -----------------------------
orders = pd.read_csv("datasets/olist_orders_dataset.csv")
order_items = pd.read_csv("datasets/olist_order_items_dataset.csv")
products = pd.read_csv("datasets/olist_products_dataset.csv")
translation = pd.read_csv("datasets/product_category_name_translation.csv")

print("Datasets Loaded Successfully")

# -----------------------------
# Convert order date
# -----------------------------
orders["order_purchase_timestamp"] = pd.to_datetime(
    orders["order_purchase_timestamp"]
)

orders["year"] = orders["order_purchase_timestamp"].dt.year
orders["month"] = orders["order_purchase_timestamp"].dt.month

# -----------------------------
# Merge datasets
# -----------------------------
df = order_items.merge(
    orders[["order_id", "year", "month"]],
    on="order_id",
    how="left"
)

df = df.merge(
    products[["product_id", "product_category_name"]],
    on="product_id",
    how="left"
)

df = df.merge(
    translation,
    on="product_category_name",
    how="left"
)

df["product_category_name_english"] = (
    df["product_category_name_english"]
    .fillna("Unknown")
)

print("Datasets merged successfully")

# -----------------------------
# Group data
# -----------------------------
grouped = (
    df.groupby(
        [
            "year",
            "month",
            "product_category_name_english"
        ]
    )
    .agg(
        avg_price=("price", "mean"),
        total_orders=("order_id", "count")
    )
    .reset_index()
)

print("Grouped records :", len(grouped))

# -----------------------------
# Create Target
# -----------------------------
SAFETY_FACTOR = 1.15

grouped["required_stock"] = (
    grouped["total_orders"] * SAFETY_FACTOR
).round().astype(int)

print("Required Stock Generated")

# -----------------------------
# Encode category
# -----------------------------
encoder = LabelEncoder()

grouped["category_encoded"] = encoder.fit_transform(
    grouped["product_category_name_english"]
)

# -----------------------------
# Features
# -----------------------------
X = grouped[
    [
        "year",
        "month",
        "category_encoded",
        "avg_price"
    ]
]

y = grouped["required_stock"]

# -----------------------------
# Train Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# -----------------------------
# Train Model
# -----------------------------
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

print("Training Model...")

model.fit(X_train, y_train)

print("Training Completed")

# -----------------------------
# Evaluation
# -----------------------------
pred = model.predict(X_test)

print("\nModel Performance")
print("-" * 40)

print("R2 Score :", round(r2_score(y_test, pred), 4))
print("MAE      :", round(mean_absolute_error(y_test, pred), 2))

# -----------------------------
# Save Model
# -----------------------------
joblib.dump(
    model,
    "models/inventory_stock_model.pkl"
)

joblib.dump(
    encoder,
    "models/inventory_label_encoder.pkl"
)

print("\nModel Saved Successfully")
print("inventory_stock_model.pkl")
print("inventory_label_encoder.pkl")