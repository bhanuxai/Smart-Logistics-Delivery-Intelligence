from flask import Blueprint, jsonify, request
from database.db import get_connection
from gemini_service import generate_insights

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/insights", methods=["GET"])
def insights():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) AS orders FROM orders")
    orders = cursor.fetchone()["orders"]

    cursor.execute("SELECT COUNT(*) AS customers FROM customers")
    customers = cursor.fetchone()["customers"]

    cursor.execute("SELECT ROUND(SUM(payment_value),2) AS revenue FROM payments")
    revenue = cursor.fetchone()["revenue"]

    cursor.execute("SELECT ROUND(AVG(review_score),2) AS rating FROM reviews")
    rating = cursor.fetchone()["rating"]

    cursor.execute("""
        SELECT
            COALESCE(pc.product_category_name_english,'Unknown') AS category,
            ROUND(SUM(oi.price),2) AS revenue
        FROM order_items oi
        JOIN products p
            ON oi.product_id = p.product_id
        LEFT JOIN product_categories pc
            ON p.product_category_name = pc.product_category_name
        GROUP BY category
        ORDER BY revenue DESC
        LIMIT 1
    """)

    top_category = cursor.fetchone()["category"]

    cursor.close()
    conn.close()

    import json

    prompt = f"""
You are a Senior Logistics Business Intelligence Analyst.

Analyze the following metrics:

Revenue: {revenue}
Orders: {orders}
Customers: {customers}
Average Rating: {rating}
Top Category: {top_category}

Return a JSON object with this exact structure:
{{
  "executive_summary": "Concise summary under 80 words.",
  "key_findings": [
    "First key finding",
    "Second key finding",
    "Third key finding"
  ],
  "recommendations": [
    "First recommendation",
    "Second recommendation",
    "Third recommendation"
  ]
}}
"""

    try:
        ai_response = generate_insights(prompt, json_mode=True)
        data = json.loads(ai_response)
        executive_summary = data.get("executive_summary", "")
        key_findings = data.get("key_findings", [])
        recommendations = data.get("recommendations", [])
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        try:
            fallback_response = generate_insights(prompt)
            data = json.loads(fallback_response)
            executive_summary = data.get("executive_summary", "")
            key_findings = data.get("key_findings", [])
            recommendations = data.get("recommendations", [])
        except Exception:
            executive_summary = "Unable to load insights summary."
            key_findings = ["Unable to load key findings."]
            recommendations = ["Unable to load recommendations."]

    findings_md = "\n".join([f"- {item}" for item in key_findings])
    recs_md = "\n".join([f"- {item}" for item in recommendations])
    
    markdown_insights = f"""# Executive Summary

{executive_summary}

# Key Findings

{findings_md}

# Recommendations

{recs_md}"""

    return jsonify({
        "insights": markdown_insights,
        "executive_summary": executive_summary,
        "key_findings": key_findings,
        "recommendations": recommendations
    })

@ai_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"reply": "I did not receive any message. How can I help you today?"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT
            DATE_FORMAT(o.order_purchase_timestamp,'%Y-%m') AS month,
            ROUND(SUM(p.payment_value),2) AS revenue
        FROM orders o
        JOIN payments p ON o.order_id = p.order_id
        GROUP BY month
        ORDER BY month;
    """)
    monthly_sales = cursor.fetchall()
    
    cursor.execute("""
        SELECT c.customer_state, ROUND(SUM(p.payment_value),2) AS revenue
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        JOIN payments p ON o.order_id = p.order_id
        GROUP BY c.customer_state
        ORDER BY revenue DESC LIMIT 5;
    """)
    top_states = cursor.fetchall()
    
    cursor.close()
    conn.close()

    context = f"""
You are Logix-AI, the advanced AI Operations Chatbot for the Amazon Logix Delivery Intelligence Platform.
You have access to the platform's current logistics database summary:

Monthly Revenue Data:
{monthly_sales}

Top States by Revenue:
{top_states}

Use this data to answer the user's question: "{user_message}".
If they ask about the decrease in February (specifically Feb 2018 or other periods), explain that e-commerce sales typically peak in November (due to Black Friday / holiday shopping) and December, and then decline in January and February due to post-holiday seasonality.
Keep your response concise, helpful, professional, and formatted in Markdown.
"""
    reply = generate_insights(context)
    return jsonify({"reply": reply})

@ai_bp.route("/optimize", methods=["GET"])
def optimize():
    opt_type = request.args.get("type", "warehouse") # warehouse, inventory, shipment
    
    conn = get_connection()
    cursor = conn.cursor()
    
    if opt_type == "warehouse":
        cursor.execute("""
            SELECT c.customer_state, COUNT(*) as orders, ROUND(SUM(p.payment_value),2) AS revenue
            FROM customers c
            JOIN orders o ON c.customer_id = o.customer_id
            JOIN payments p ON o.order_id = p.order_id
            GROUP BY c.customer_state
            ORDER BY revenue DESC
            LIMIT 10;
        """)
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        
        prompt = f"""
You are a Senior Logistics Expert. Suggest the best warehouse locations based on this sales by state data:
{data}

Provide an analysis of which states have the highest sales volume (like SP - Sao Paulo, RJ - Rio de Janeiro) and where new fulfillment centers should be opened or optimized to reduce shipping distances.
Return your response in clean Markdown.
"""
        recommendation = generate_insights(prompt)
        return jsonify({"recommendation": recommendation})

    elif opt_type == "inventory":
        cursor.execute("""
            SELECT
                COALESCE(pc.product_category_name_english,'Unknown') AS category,
                COUNT(*) AS total_orders,
                ROUND(SUM(oi.price),2) AS revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            LEFT JOIN product_categories pc ON p.product_category_name = pc.product_category_name
            GROUP BY category
            ORDER BY revenue DESC
            LIMIT 10;
        """)
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        
        prompt = f"""
You are a Supply Chain Inventory Specialist. Suggest inventory allocation strategies across terminals for these top 10 categories:
{data}

Detail how items like health_beauty or watches_gifts (high revenue) should be allocated to regional warehouses to meet local demand and minimize stockouts.
Return your response in clean Markdown.
"""
        recommendation = generate_insights(prompt)
        return jsonify({"recommendation": recommendation})

    elif opt_type == "shipment":
        cursor.execute("""
            SELECT 
                COUNT(*) as total_delivered,
                ROUND(AVG(TIMESTAMPDIFF(HOUR, order_purchase_timestamp, order_delivered_carrier_date)), 2) as avg_carrier_hours,
                ROUND(AVG(TIMESTAMPDIFF(HOUR, order_delivered_carrier_date, order_delivered_customer_date)), 2) as avg_delivery_hours
            FROM orders
            WHERE order_status = 'delivered' 
              AND order_purchase_timestamp IS NOT NULL 
              AND order_delivered_carrier_date IS NOT NULL 
              AND order_delivered_customer_date IS NOT NULL;
        """)
        data = cursor.fetchone()
        cursor.close()
        conn.close()
        
        prompt = f"""
You are a Freight and Last-Mile Shipment Optimizer. Suggest shipment route and carrier optimization strategies based on this latency data:
Average dispatch latency (purchase to carrier handover): {data.get('avg_carrier_hours', 0) if data else 0} hours
Average shipping latency (carrier to customer delivery): {data.get('avg_delivery_hours', 0) if data else 0} hours
Total shipments analyzed: {data.get('total_delivered', 0) if data else 0}

Suggest how to optimize carrier handovers and dispatch routing to improve delivery speeds and customer satisfaction.
Return your response in clean Markdown.
"""
        recommendation = generate_insights(prompt)
        return jsonify({"recommendation": recommendation})
        
    else:
        cursor.close()
        conn.close()
        return jsonify({"error": "Invalid optimization type"}), 400

@ai_bp.route("/delay-explanation", methods=["GET"])
def delay_explanation():
    order_id = request.args.get("order_id", "").strip()
    if not order_id:
        return jsonify({"error": "Order ID is required"}), 400
        
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            order_id, 
            order_status, 
            order_purchase_timestamp, 
            order_approved_at, 
            order_delivered_carrier_date, 
            order_delivered_customer_date, 
            order_estimated_delivery_date
        FROM orders 
        WHERE order_id = %s
    """, (order_id,))
    order = cursor.fetchone()
    
    if not order:
        cursor.close()
        conn.close()
        return jsonify({"error": "Order not found"}), 404
        
    cursor.execute("""
        SELECT 
            oi.product_id, 
            oi.price, 
            COALESCE(pc.product_category_name_english,'Unknown') AS category
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        LEFT JOIN product_categories pc ON p.product_category_name = pc.product_category_name
        WHERE oi.order_id = %s
    """, (order_id,))
    items = cursor.fetchall()
    
    cursor.execute("""
        SELECT c.customer_state
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        WHERE o.order_id = %s
    """, (order_id,))
    customer_state = cursor.fetchone()
    state = customer_state["customer_state"] if customer_state else "Unknown"
    
    cursor.execute("""
        SELECT review_score, review_comment_message
        FROM reviews
        WHERE order_id = %s
    """, (order_id,))
    review = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    def dt_str(dt):
        return dt.strftime("%Y-%m-%d %H:%M:%S") if dt else "N/A"
        
    order_details = {
        "order_id": order["order_id"],
        "status": order["order_status"],
        "purchased_at": dt_str(order["order_purchase_timestamp"]),
        "approved_at": dt_str(order["order_approved_at"]),
        "carrier_handover_at": dt_str(order["order_delivered_carrier_date"]),
        "delivered_to_customer_at": dt_str(order["order_delivered_customer_date"]),
        "estimated_delivery_at": dt_str(order["order_estimated_delivery_date"]),
        "destination_state": state,
        "items": items,
        "review_score": review["review_score"] if review else "N/A",
        "review_comment": review["review_comment_message"] if review else "N/A"
    }
    
    prompt = f"""
You are a Customer Service Logistics Analyst. Explain why this specific order was delayed to a delivery partner/customer.
Here are the timeline and details of the order:
Order ID: {order_details['order_id']}
Status: {order_details['status']}
Purchased At: {order_details['purchased_at']}
Approved At: {order_details['approved_at']}
Handed to Carrier At: {order_details['carrier_handover_at']}
Delivered to Customer At: {order_details['delivered_to_customer_at']}
Estimated Delivery Date: {order_details['estimated_delivery_at']}
Destination State: {order_details['destination_state']}
Items in Order: {order_details['items']}
Customer Review Rating: {order_details['review_score']}
Customer Review Comment: {order_details['review_comment']}

Identify where the bottleneck occurred (e.g. order approval delay, long carrier transit time, or weather/logistics disruptions in the destination state).
Write a professional, friendly, and analytical explanation detailing the cause of the delay and recommending corrective actions to avoid it next time.
Return your explanation in clean Markdown.
"""
    explanation = generate_insights(prompt)
    return jsonify({
        "details": order_details,
        "explanation": explanation
    })

@ai_bp.route("/generate-report", methods=["GET"])
def generate_report():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) AS orders FROM orders")
    orders = cursor.fetchone()["orders"]
    
    cursor.execute("SELECT ROUND(SUM(payment_value),2) AS revenue FROM payments")
    revenue = cursor.fetchone()["revenue"]
    
    cursor.execute("SELECT ROUND(AVG(review_score),2) AS rating FROM reviews")
    rating = cursor.fetchone()["rating"]
    rating_text = f"{rating:.2f}" if rating is not None else "N/A"
    
    cursor.execute("""
        SELECT
            COALESCE(pc.product_category_name_english,'Unknown') AS category,
            COUNT(*) AS total_orders,
            ROUND(SUM(oi.price),2) AS revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        LEFT JOIN product_categories pc ON p.product_category_name = pc.product_category_name
        GROUP BY category
        ORDER BY revenue DESC
        LIMIT 5;
    """)
    top_categories = cursor.fetchall()
    
    cursor.execute("""
        SELECT
            c.customer_state,
            ROUND(SUM(p.payment_value),2) AS revenue
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        JOIN payments p ON o.order_id = p.order_id
        GROUP BY c.customer_state
        ORDER BY revenue DESC
        LIMIT 5;
    """)
    top_states = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    prompt = f"""
You are a Logistics Operations Director. Write a comprehensive Weekly Logistics Report based on the following weekly operational metrics:
Total Invoiced Revenue: ${revenue:,.2f}
Total Orders Dispatched: {orders:,}
Average Review Score: {rating_text} / 5.00
Top Categories by Revenue: {top_categories}
Top Customer States: {top_states}

Structure your report into the following sections:
1. Executive Summary: High-level overview of the platform performance.
2. Financial & Sales Volume Analysis: Discussion of revenue, orders, and regional performance.
3. Inventory & Category Review: Operational review of top products and categories.
4. Recommendations & Actions: Strategic suggestions to improve routing, reduce shipment latency, and optimize carrier allocation.

Write a formal corporate report. Use clean Markdown headings, tables, bullet points, and highlight key metrics.
"""
    report = generate_insights(prompt)
    return jsonify({"report": report})