from flask import Blueprint, request, jsonify
import joblib
import os
import pandas as pd

forecast_bp = Blueprint("forecast", __name__)

# ----------------------------
# Load Model & Encoder
# ----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")

model = joblib.load(os.path.join(MODEL_DIR, "forecast_model.pkl"))
encoder = joblib.load(os.path.join(MODEL_DIR, "forecast_encoder.pkl"))


# ----------------------------
# Forecast Endpoint
# ----------------------------

@forecast_bp.route("/forecast", methods=["POST"])
def forecast():

    try:

        data = request.get_json()

        year = int(data["year"])
        month = int(data["month"])
        category = data["product_category_name"]
        avg_price = float(data["avg_price"])

        # Encode Category
        if category not in encoder.classes_:
            return jsonify({
                "success": False,
                "message": "Unknown Product Category"
            }), 400

        category_encoded = encoder.transform([category])[0]

        features = pd.DataFrame([{
            "year": year,
            "month": month,
            "product_category_name": category_encoded,
            "avg_price": avg_price
        }])

        prediction = model.predict(features)[0]

        # Demand Level
        if prediction >= 150:
            demand = "High"

        elif prediction >= 50:
            demand = "Medium"

        else:
            demand = "Low"

        return jsonify({

            "success": True,

            "predicted_orders": round(float(prediction), 2),

            "demand_level": demand,

            "category": category,

            "month": month,

            "year": year

        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500