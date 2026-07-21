from flask import Flask
from flask_cors import CORS

from routes.dashboard import dashboard_bp
from routes.analytics import analytics_bp
from routes.ai import ai_bp
from routes.prediction import prediction_bp
from routes.optimization import optimization_bp
from routes.inventory import inventory_bp
from routes.products import products_bp
from routes.sellers import sellers_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(dashboard_bp, url_prefix="/api")
app.register_blueprint(analytics_bp, url_prefix="/api")
app.register_blueprint(ai_bp, url_prefix="/api")
app.register_blueprint(prediction_bp, url_prefix="/api")
app.register_blueprint(optimization_bp,url_prefix="/api")
app.register_blueprint(inventory_bp, url_prefix="/api")
app.register_blueprint(products_bp, url_prefix="/api")
app.register_blueprint(sellers_bp, url_prefix="/api")

if __name__ == "__main__":
    print(app.url_map)
    app.run(debug=True)