import pandas as pd
from database.db import get_connection

def import_table(
    csv_path,
    table_name,
    columns,
    query,
    transform=None
):
    df = pd.read_csv(csv_path)

    print(f"\nLoading {table_name}...")
    print(f"Rows Found : {len(df)}")

    df = df.astype(object)
    df = df.where(pd.notna(df), None)

    conn = get_connection()
    cursor = conn.cursor()

    imported = 0
    skipped = 0

    for _, row in df.iterrows():

        try:

            values = []

            for column in columns:
                values.append(row[column])

            if transform:
                values = transform(values)

            cursor.execute(query, tuple(values))

            imported += 1

            if imported % 5000 == 0:
                print(f"{imported} Imported...")

        except Exception as e:
            print("=" * 50)
            print("Product ID:", row["product_id"])
            print("Category:", category)
            print("Full Error:", repr(e))
            print("=" * 50)
        raise

    conn.commit()

    cursor.close()
    conn.close()

    print("--------------------------------")
    print(f"Table      : {table_name}")
    print(f"Imported   : {imported}")
    print(f"Skipped    : {skipped}")
    print("--------------------------------")