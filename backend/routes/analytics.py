from flask import Blueprint, jsonify
from database.db import get_connection

analytics_bp = Blueprint("analytics", __name__)

# --------------------------------------------------
# Monthly Sales
# --------------------------------------------------
@analytics_bp.route("/monthly-sales", methods=["GET"])
def monthly_sales():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            DATE_FORMAT(o.order_purchase_timestamp,'%Y-%m') AS month,
            ROUND(SUM(p.payment_value),2) AS revenue
        FROM orders o
        JOIN payments p
            ON o.order_id = p.order_id
        GROUP BY month
        ORDER BY month;
    """)

    data = cursor.fetchall()

    for row in data:
        row["revenue"] = float(row["revenue"])

    cursor.close()
    conn.close()

    return jsonify(data)


# --------------------------------------------------
# Top 10 Product Categories
# --------------------------------------------------
@analytics_bp.route("/top-products", methods=["GET"])
def top_products():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            COALESCE(pc.product_category_name_english,'Unknown') AS category,
            COUNT(*) AS total_orders,
            ROUND(SUM(oi.price),2) AS revenue

        FROM order_items oi

        JOIN products p
            ON oi.product_id = p.product_id

        LEFT JOIN product_categories pc
            ON p.product_category_name = pc.product_category_name

        GROUP BY category

        ORDER BY revenue DESC

        LIMIT 10;
    """)

    data = cursor.fetchall()

    for row in data:
        row["revenue"] = float(row["revenue"])

    cursor.close()
    conn.close()

    return jsonify(data)


# --------------------------------------------------
# Top Sellers
# --------------------------------------------------
@analytics_bp.route("/top-sellers", methods=["GET"])
def top_sellers():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            seller_id,
            COUNT(*) AS total_orders,
            ROUND(SUM(price),2) AS revenue

        FROM order_items

        GROUP BY seller_id

        ORDER BY revenue DESC

        LIMIT 10;
    """)

    data = cursor.fetchall()

    for row in data:
        row["revenue"] = float(row["revenue"])

    cursor.close()
    conn.close()

    return jsonify(data)


# --------------------------------------------------
# Payment Methods
# --------------------------------------------------
@analytics_bp.route("/payment-methods", methods=["GET"])
def payment_methods():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            payment_type,
            COUNT(*) AS total_transactions,
            ROUND(SUM(payment_value),2) AS total_amount

        FROM payments

        GROUP BY payment_type

        ORDER BY total_transactions DESC;
    """)

    data = cursor.fetchall()

    for row in data:
        row["total_amount"] = float(row["total_amount"])

    cursor.close()
    conn.close()

    return jsonify(data)


# --------------------------------------------------
# Review Distribution
# --------------------------------------------------
@analytics_bp.route("/review-distribution", methods=["GET"])
def review_distribution():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            review_score,
            COUNT(*) AS total_reviews

        FROM reviews

        GROUP BY review_score

        ORDER BY review_score;
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)


# --------------------------------------------------
# Get Detailed Reviews List
# --------------------------------------------------
@analytics_bp.route("/reviews-list", methods=["GET"])
def reviews_list():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                review_id,
                order_id,
                review_score,
                COALESCE(review_comment_title, '') AS title,
                COALESCE(review_comment_message, '') AS message,
                review_creation_date
            FROM reviews
            WHERE review_comment_message IS NOT NULL AND review_comment_message != ''
            ORDER BY review_creation_date DESC
            LIMIT 50;
        """)

        data = cursor.fetchall()
        
        for row in data:
            if "review_creation_date" in row and row["review_creation_date"]:
                row["review_creation_date"] = row["review_creation_date"].strftime("%Y-%m-%d %H:%M:%S")

        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Get Detailed Payments List
# --------------------------------------------------
@analytics_bp.route("/payments-list", methods=["GET"])
def payments_list():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                p.order_id,
                p.payment_sequential,
                p.payment_type,
                p.payment_installments,
                p.payment_value,
                o.order_status,
                o.order_purchase_timestamp AS timestamp
            FROM payments p
            LEFT JOIN orders o ON p.order_id = o.order_id
            ORDER BY o.order_purchase_timestamp DESC
            LIMIT 50;
        """)

        data = cursor.fetchall()
        
        for row in data:
            if "timestamp" in row and row["timestamp"] and not isinstance(row["timestamp"], str):
                row["timestamp"] = row["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
            row["payment_value"] = float(row["payment_value"]) if row["payment_value"] is not None else 0.0

        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Get Detailed Customers List
# --------------------------------------------------
@analytics_bp.route("/customers-list", methods=["GET"])
def customers_list():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                customer_id,
                customer_unique_id,
                customer_zip_code_prefix AS zip_code,
                customer_city AS city,
                customer_state AS state
            FROM customers
            LIMIT 50;
        """)

        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Global Autocomplete Search
# --------------------------------------------------
@analytics_bp.route("/search", methods=["GET"])
def global_search():
    from flask import request
    query = request.args.get("q", "").strip()
    if not query or len(query) < 2:
        return jsonify({"orders": [], "sellers": [], "customers": []})

    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Search orders
        cursor.execute("""
            SELECT order_id AS id, order_status AS status
            FROM orders
            WHERE order_id LIKE %s
            LIMIT 5;
        """, (f"%{query}%",))
        orders = cursor.fetchall()

        # Search sellers
        cursor.execute("""
            SELECT seller_id AS id, seller_city AS city, seller_state AS state
            FROM sellers
            WHERE seller_id LIKE %s OR seller_city LIKE %s
            LIMIT 5;
        """, (f"%{query}%", f"%{query}%"))
        sellers = cursor.fetchall()

        # Search customers
        cursor.execute("""
            SELECT customer_id AS id, customer_city AS city, customer_state AS state
            FROM customers
            WHERE customer_id LIKE %s OR customer_city LIKE %s
            LIMIT 5;
        """, (f"%{query}%", f"%{query}%"))
        customers = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "orders": orders,
            "sellers": sellers,
            "customers": customers
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Sales by State
# --------------------------------------------------
@analytics_bp.route("/sales-by-state", methods=["GET"])
def sales_by_state():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            c.customer_state,
            ROUND(SUM(p.payment_value),2) AS revenue

        FROM customers c

        JOIN orders o
            ON c.customer_id = o.customer_id

        JOIN payments p
            ON o.order_id = p.order_id

        GROUP BY c.customer_state

        ORDER BY revenue DESC;
    """)

    data = cursor.fetchall()

    for row in data:
        row["revenue"] = float(row["revenue"])

    cursor.close()
    conn.close()

    return jsonify(data)