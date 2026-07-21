from flask import Blueprint, request, jsonify
from database.db import get_connection
import hashlib

products_bp = Blueprint("products", __name__)

def get_product_stock_and_warehouses(product_id):
    # Deterministic warehouse stock generator based on product ID
    h = int(hashlib.md5(product_id.encode('utf-8')).hexdigest(), 16)
    total_stock = (h % 350) + 15  # between 15 and 364
    central = int(total_stock * 0.45)
    north = int(total_stock * 0.30)
    south = int(total_stock * 0.15)
    east = total_stock - (central + north + south)
    return {
        "total_stock": total_stock,
        "warehouses": {
            "Central Warehouse": central,
            "North Warehouse": north,
            "South Warehouse": south,
            "East Warehouse": east
        }
    }

@products_bp.route("/products", methods=["GET"])
def get_products():
    try:
        # Query parameters
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        search = request.args.get("search", "").strip()
        category = request.args.get("category", "").strip()
        sort_by = request.args.get("sort_by", "product_id").strip()
        sort_order = request.args.get("sort_order", "asc").strip()

        # Validate sorting parameters
        valid_sort_fields = {
            "product_id": "p.product_id",
            "category": "COALESCE(pc.product_category_name_english, p.product_category_name)",
            "price": "price",
            "weight": "p.product_weight_g"
        }
        sort_field = valid_sort_fields.get(sort_by, "p.product_id")
        order = "ASC" if sort_order.lower() == "asc" else "DESC"

        conn = get_connection()
        cursor = conn.cursor()

        # Fetch unique categories for the filter dropdown
        cursor.execute("""
            SELECT DISTINCT p.product_category_name, pc.product_category_name_english
            FROM products p
            LEFT JOIN product_categories pc ON p.product_category_name = pc.product_category_name
            WHERE p.product_category_name IS NOT NULL
            ORDER BY COALESCE(pc.product_category_name_english, p.product_category_name)
        """)
        db_categories = cursor.fetchall()
        categories = []
        for c in db_categories:
            raw_cat = c["product_category_name"]
            eng_cat = c["product_category_name_english"]
            clean_name = (eng_cat or raw_cat).replace("_", " ").title()
            categories.append({
                "value": raw_cat,
                "label": clean_name
            })

        # Build filter clauses
        filters = []
        params = []

        if search:
            filters.append("(p.product_id LIKE %s OR p.product_category_name LIKE %s OR pc.product_category_name_english LIKE %s)")
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])

        if category:
            filters.append("p.product_category_name = %s")
            params.append(category)

        filter_clause = "WHERE " + " AND ".join(filters) if filters else ""

        # Count total matches for pagination
        count_query = f"""
            SELECT COUNT(DISTINCT p.product_id) AS total
            FROM products p
            LEFT JOIN product_categories pc ON p.product_category_name = pc.product_category_name
            {filter_clause}
        """
        cursor.execute(count_query, params)
        total_records = cursor.fetchone()["total"]

        # Fetch paginated products
        offset = (page - 1) * limit
        query = f"""
            SELECT p.product_id, 
                   p.product_category_name, 
                   pc.product_category_name_english,
                   p.product_weight_g, 
                   p.product_length_cm, 
                   p.product_height_cm, 
                   p.product_width_cm,
                   COALESCE(ROUND(AVG(oi.price), 2), 59.99) AS price
            FROM products p
            LEFT JOIN product_categories pc ON p.product_category_name = pc.product_category_name
            LEFT JOIN order_items oi ON p.product_id = oi.product_id
            {filter_clause}
            GROUP BY p.product_id
            ORDER BY {sort_field} {order}
            LIMIT %s OFFSET %s
        """
        query_params = list(params) + [limit, offset]
        cursor.execute(query, query_params)
        db_products = cursor.fetchall()

        # Format and enrich products with stock
        enriched_products = []
        for p in db_products:
            stock_info = get_product_stock_and_warehouses(p["product_id"])
            p_category_clean = (p["product_category_name_english"] or p["product_category_name"] or "Unknown").replace("_", " ").title()
            
            # Format dimensions
            l = p['product_length_cm']
            h = p['product_height_cm']
            w = p['product_width_cm']
            dimensions = f"{int(l)}x{int(h)}x{int(w)} cm" if (l and h and w) else "N/A"

            enriched_products.append({
                "product_id": p["product_id"],
                "category": p_category_clean,
                "raw_category": p["product_category_name"] or "Unknown",
                "weight_g": p["product_weight_g"] or 0,
                "dimensions": dimensions,
                "price": float(p["price"]),
                "total_stock": stock_info["total_stock"],
                "warehouses": stock_info["warehouses"]
            })

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "page": page,
            "limit": limit,
            "total_records": total_records,
            "total_pages": (total_records + limit - 1) // limit,
            "categories": categories,
            "products": enriched_products
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
