import pandas as pd
from database.db import get_connection

df = pd.read_csv("datasets/olist_order_items_dataset.csv")

print(f"Loaded {len(df)} order items.")

conn = get_connection()
cursor = conn.cursor()

query = """
INSERT INTO order_items (
    order_id,
    order_item_id,
    product_id,
    seller_id,
    shipping_limit_date,
    price
)
VALUES (%s,%s,%s,%s,%s,%s,%s)
"""

count = 0
skipped = 0

for _, row in df.iterrows():
    try:
        values = (
            str(row["order_id"]),
            int(row["order_item_id"]),
            str(row["product_id"]),
            str(row["seller_id"]),
            pd.to_datetime(row["shipping_limit_date"]).to_pydatetime(),
            float(row["price"]),
            float(row["freight_value"])
        )

        cursor.execute(query, values)
        count += 1

        if count % 5000 == 0:
            conn.commit()
            print(f"{count} rows imported...")

    except Exception as e:
        skipped += 1
        print(f"Skipped Row: {e}")

conn.commit()
cursor.close()
conn.close()

print("\n=========================")
print(f"Imported : {count}")
print(f"Skipped  : {skipped}")
print("=========================")