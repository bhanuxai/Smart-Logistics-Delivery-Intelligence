import pandas as pd
from sqlalchemy import create_engine
import os

# -------------------------------
# MySQL Connection
# -------------------------------
import os
from dotenv import load_dotenv
load_dotenv()

USERNAME = os.getenv("DB_USER", "root")
PASSWORD = os.getenv("DB_PASSWORD")
HOST = os.getenv("DB_HOST", "localhost")
PORT = os.getenv("DB_PORT", "3306")
DATABASE = os.getenv("DB_NAME", "smart_logistics_db")

engine = create_engine(
    f"mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"
)

# -------------------------------
# Dataset Folder
# -------------------------------
DATASET_PATH = "../datasets"

files = {
    "customers": "olist_customers_dataset.csv",
    "orders": "olist_orders_dataset.csv",
    "order_items": "olist_order_items_dataset.csv",
    "products": "olist_products_dataset.csv",
    "sellers": "olist_sellers_dataset.csv",
    "payments": "olist_order_payments_dataset.csv",
    "reviews": "olist_order_reviews_dataset.csv",
    "geolocation": "olist_geolocation_dataset.csv",
    "product_categories": "product_category_name_translation.csv"
}

# -------------------------------
# Import Function
# -------------------------------
for table, filename in files.items():

    file_path = os.path.join(DATASET_PATH, filename)

    print(f"\nImporting {filename}...")

    df = pd.read_csv(file_path)

    print(df.shape)

    df.to_sql(
        name=table,
        con=engine,
        if_exists="append",
        index=False
    )

    print(f"{table} imported successfully!")

print("\nAll datasets imported successfully!")