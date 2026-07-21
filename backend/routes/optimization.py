from flask import Blueprint, jsonify, request
from optimization.ant_colony import AntColonyOptimizer

optimization_bp = Blueprint("optimization", __name__)

@optimization_bp.route("/route-optimization", methods=["GET", "POST"])
def route_optimization():
    if request.method == "POST":
        data = request.json or {}
        start = data.get("start", "São Paulo Warehouse")
        destination = data.get("destination", "Rio Distribution Center")
    else:
        start = request.args.get("start", "São Paulo Warehouse")
        destination = request.args.get("destination", "Rio Distribution Center")
        
    aco = AntColonyOptimizer()
    try:
        result = aco.optimize(start, destination)
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400