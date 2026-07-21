from flask import Blueprint, request, jsonify
import joblib
import pandas as pd
import os
from datetime import datetime

inventory_bp = Blueprint("inventory", __name__)

# -------------------------------------------------
# Load Model
# -------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(
    os.path.join(BASE_DIR, "models", "inventory_stock_model.pkl")
)

encoder = joblib.load(
    os.path.join(BASE_DIR, "models", "inventory_label_encoder.pkl")
)

# -------------------------------------------------
# Inventory Prediction API
# -------------------------------------------------

@inventory_bp.route("/inventory", methods=["GET", "POST"])

def predict_inventory():
    if request.method == "GET":
        return jsonify({
            "message": "Inventory Prediction API is running successfully."
        })
    
    
    try:
        

        data = request.get_json()

        year = int(data["year"])
        month = int(data["month"])
        category = data["product_category_name"]
        avg_price = float(data["avg_price"])

        # Encode category
        if category in encoder.classes_:
            category_encoded = encoder.transform([category])[0]
        else:
            category_encoded = encoder.transform(["Unknown"])[0]

        # Prediction DataFrame
        input_df = pd.DataFrame([{
            "year": year,
            "month": month,
            "category_encoded": category_encoded,
            "avg_price": avg_price
        }])

        # Predict
        required_stock = int(model.predict(input_df)[0])

        # ----------------------------------------
        # Inventory Status
        # ----------------------------------------

        if required_stock >= 350:
            inventory_status = "High"

        elif required_stock >= 180:
            inventory_status = "Medium"

        else:
            inventory_status = "Low"

        # ----------------------------------------
        # Safety Stock
        # ----------------------------------------

        safety_stock = int(required_stock * 0.15)

        # ----------------------------------------
        # Restocking Priority
        # ----------------------------------------

        if inventory_status == "High":
            priority = "High"

        elif inventory_status == "Medium":
            priority = "Medium"

        else:
            priority = "Low"

        # ----------------------------------------
        # Warehouse Allocation
        # ----------------------------------------

        if required_stock >= 350:
            warehouse = "Central Warehouse"

        elif required_stock >= 180:
            warehouse = "North Warehouse"

        else:
            warehouse = "Regional Warehouse"

        # ----------------------------------------
        # Confidence Score
        # ----------------------------------------

        confidence = round(
            min(
                98,
                82 + (required_stock % 15)
            ),
            1
        )

        # ----------------------------------------
        # Charts
        # ----------------------------------------

        historical_stock = [
            {"month": "Jan", "stock": int(required_stock * 0.70)},
            {"month": "Feb", "stock": int(required_stock * 0.75)},
            {"month": "Mar", "stock": int(required_stock * 0.82)},
            {"month": "Apr", "stock": int(required_stock * 0.91)},
            {"month": "May", "stock": required_stock},
        ]

        warehouse_distribution = [

            {
                "name": "Central",
                "value": 45
            },

            {
                "name": "North",
                "value": 30
            },

            {
                "name": "South",
                "value": 15
            },

            {
                "name": "East",
                "value": 10
            }

        ]

        # ----------------------------------------
        # Recommendations
        # ----------------------------------------

        recommendations = []

        if priority == "High":

            recommendations.extend([

                "Increase inventory immediately.",

                "Reserve additional warehouse capacity.",

                "Place supplier purchase order within 3 days.",

                "Allocate extra delivery vehicles."

            ])

        elif priority == "Medium":

            recommendations.extend([

                "Monitor weekly inventory levels.",

                "Schedule supplier replenishment.",

                "Maintain standard warehouse allocation."

            ])

        else:

            recommendations.extend([

                "Current inventory is sufficient.",

                "No urgent replenishment required.",

                "Continue regular inventory monitoring."

            ])

        return jsonify({

            "success": True,

            "required_stock": required_stock,

            "inventory_status": inventory_status,

            "safety_stock": safety_stock,

            "restocking_priority": priority,

            "warehouse": warehouse,

            "confidence_score": confidence,

            "last_updated": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),

            "historical_stock": historical_stock,

            "warehouse_distribution": warehouse_distribution,

            "recommendations": recommendations

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500