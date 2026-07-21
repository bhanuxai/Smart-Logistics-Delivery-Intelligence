from importers.etl import import_table

query = """
INSERT INTO orders(
order_id,
customer_id,
order_status,
order_purchase_timestamp,
order_approved_at,
order_delivered_carrier_date,
order_delivered_customer_date,
order_estimated_delivery_date
)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
"""

columns = [
"order_id",
"customer_id",
"order_status",
"order_purchase_timestamp",
"order_approved_at",
"order_delivered_carrier_date",
"order_delivered_customer_date",
"order_estimated_delivery_date"
]

import_table(
    "datasets/olist_orders_dataset.csv",
    "orders",
    columns,
    query
)