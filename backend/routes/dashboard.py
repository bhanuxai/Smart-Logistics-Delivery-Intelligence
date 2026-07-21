from flask import Blueprint, jsonify
from database.db import get_connection

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard():

    conn = get_connection()
    cursor = conn.cursor()

    # Total Revenue
    cursor.execute("""
        SELECT ROUND(SUM(payment_value), 2) AS total_revenue
        FROM payments
    """)
    revenue = cursor.fetchone()["total_revenue"]

    # Total Orders
    cursor.execute("""
        SELECT COUNT(*) AS total_orders
        FROM orders
    """)
    orders = cursor.fetchone()["total_orders"]

    # Total Customers
    cursor.execute("""
        SELECT COUNT(*) AS total_customers
        FROM customers
    """)
    customers = cursor.fetchone()["total_customers"]

    # Total Products
    cursor.execute("""
        SELECT COUNT(*) AS total_products
        FROM products
    """)
    products = cursor.fetchone()["total_products"]

    # Total Sellers
    cursor.execute("""
        SELECT COUNT(*) AS total_sellers
        FROM sellers
    """)
    sellers = cursor.fetchone()["total_sellers"]

    # Average Review
    cursor.execute("""
        SELECT ROUND(AVG(review_score), 2) AS average_review
        FROM reviews
    """)
    avg_review = cursor.fetchone()["average_review"]

    cursor.close()
    conn.close()

    return jsonify({
        "total_revenue": float(revenue) if revenue else 0,
        "total_orders": orders,
        "total_customers": customers,
        "total_products": products,
        "total_sellers": sellers,
        "average_review": float(avg_review) if avg_review else 0
    })