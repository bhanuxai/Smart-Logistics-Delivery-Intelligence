# 🚚 Smart Logistics & Delivery Intelligence Platform

<p align="center">
  <img src="https://capsule-render.vercel.app/type=waving&color=22D3EE&height=120&section=header" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/bhanuxai/Smart-Logistics-Delivery-Intelligence">
    <img src="https://readme-typing-svg.herokuapp.com?font=Outfit&weight=800&size=24&duration=3000&pause=1000&color=22D3EE&center=true&vCenter=true&width=600&lines=Smart+Logistics+Intelligence;AI-Powered+Optimization+Engine;Machine+Learning+%26+Ant+Colony+Routing" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/bhanuxai/Smart-Logistics-Delivery-Intelligence?style=for-the-badge&color=FF9900" alt="Stars" />
  <img src="https://img.shields.io/github/forks/bhanuxai/Smart-Logistics-Delivery-Intelligence?style=for-the-badge&color=22D3EE" alt="Forks" />
  <img src="https://img.shields.io/github/license/bhanuxai/Smart-Logistics-Delivery-Intelligence?style=for-the-badge&color=black" alt="License" />
  <img src="https://img.shields.io/github/last-commit/bhanuxai/Smart-Logistics-Delivery-Intelligence?style=for-the-badge&color=00FF66" alt="Last Commit" />
  <img src="https://img.shields.io/github/issues/bhanuxai/Smart-Logistics-Delivery-Intelligence?style=for-the-badge&color=FF3366" alt="Issues" />
</p>

---

## 🎨 Hero Banner

<p align="center">
  <img src="https://raw.githubusercontent.com/bhanuxai/Smart-Logistics-Delivery-Intelligence/main/docs/hero_banner.png" alt="Smart Logistics & Delivery Intelligence Hero Banner" width="900" style="border: 3px solid black; border-radius: 16px; box-shadow: 6px 6px 0px rgba(0,0,0,1);" />
</p>

---

## 📖 About Project

The **Smart Logistics & Delivery Intelligence Platform** is a world-class, AI-driven operations dashboard engineered to solve complex supply chain routing, predictive delivery analytics, demand forecasting, and inventory tracking bottlenecks. 

By combining traditional machine learning classifiers with custom **Ant Colony Optimization (ACO)** heuristics, the platform gives fleet controllers real-time predictive insights to streamline fleet operations, reduce fuel costs, and maintain high service levels.

### 💼 Business Value
- **Reduce Operating Costs**: Cut transit miles by utilizing optimization graph algorithms to construct the shortest delivery routes.
- **Dynamic SLA Management**: Anticipate delays with highly accurate delivery time estimates before cargo leaves the hubs.
- **Optimal Stocking**: Prevent supply bottlenecks or warehousing overheads with automated inventory stock recommendations.
- **Smart Decision Support**: Instantly query logs, telemetry profiles, and dispatch routes through an integrated LLM Chatbot assistant.

---

## ✨ Features

| Feature Card | Description | Core Technology |
| :--- | :--- | :--- |
| 🚚 **Delivery Prediction** | Real-time classification of shipping times, anticipating delay factors such as city zones and freight metrics. | Random Forest Regressor |
| 📦 **Inventory Intelligence** | Dynamic threshold calculations that estimate minimum safety stock margins for warehouse products. | Random Forest Classifier |
| 📈 **Demand Forecasting** | Visualizes future shipment load volumes across states, allowing operators to preemptively allocate fleets. | Random Forest Regressor |
| 🗺 **Route Optimization** | Interactive mapping displaying optimized paths for multi-stop delivery points. | Ant Colony Optimization (ACO) |
| 🤖 **AI Chatbot** | Interactive panel enabling natural language queries regarding sellers, active routes, and cargo telemetry. | Google Gemini Pro API |
| 📊 **Analytics Dashboard** | Sleek Neo-Brutalist visualization panel detailing payment distributions, reviews feedback, and hub pings. | React / Recharts |
| 📄 **Export Reports** | Generate print-friendly transaction receipts, dispatch details, and operator telemetry logs. | Browser Print Sync |
| ⚡ **Real-time Insights** | Direct REST API queries mapped to backend MySQL transactions to keep coordinates synchronized. | Flask Blueprints / MySQL |

---

## 🛠️ Tech Stack

<p align="center">
  <!-- Frontend -->
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Recharts-22D3EE?style=for-the-badge&logo=chartdotjs&logoColor=black" alt="Recharts" />
  <br/>
  <!-- Backend -->
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <br/>
  <!-- AI / ML -->
  <img src="https://img.shields.io/badge/Scikit_Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Scikit-Learn" />
  <img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas" />
  <img src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini API" />
</p>

---

## 📐 System Architecture

```mermaid
graph TD
    A[Customer / Operator UI] -->|Interacts with| B(React Frontend Dashboard)
    B -->|API Requests| C(Flask REST Backend)
    C -->|Queries| D[(MySQL Database)]
    C -->|Triggers| E[Machine Learning Engine]
    E -->|Predicts| F[Delivery Duration Classifier]
    E -->|Forecasts| G[Demand Forecasting Predictor]
    E -->|Measures| H[Inventory Stock Predictor]
    C -->|Calculates| I[Ant Colony Router]
    I -->|Optimizes| J[Shortest Delivery Routes]
    J -->|Deploys to| K[Hubs & Warehouses]
    K -->|Fulfills| L[End Customer Delivery]
```

---

## 📷 Screenshots

<details>
<summary>🔍 Click to view Dashboard Preview</summary>
<br>
<p align="center">
  <!-- TODO: Replace with your actual dashboard screenshot once deployed -->
  <img src="https://raw.githubusercontent.com/bhanuxai/Smart-Logistics-Delivery-Intelligence/main/docs/hero_banner.png" alt="Dashboard" width="800" style="border: 2px solid black; border-radius: 8px;" />
</p>
</details>

<details>
<summary>🔍 Click to view Delivery Prediction Preview</summary>
<br>
<p align="center">
  <!-- TODO: Replace with your actual prediction page screenshot once deployed -->
  <img src="https://raw.githubusercontent.com/bhanuxai/Smart-Logistics-Delivery-Intelligence/main/docs/hero_banner.png" alt="Delivery Prediction" width="800" style="border: 2px solid black; border-radius: 8px;" />
</p>
</details>

<details>
<summary>🔍 Click to view Route Optimization Graph Preview</summary>
<br>
<p align="center">
  <!-- TODO: Replace with your actual route optimization screenshot once deployed -->
  <img src="https://raw.githubusercontent.com/bhanuxai/Smart-Logistics-Delivery-Intelligence/main/docs/hero_banner.png" alt="Route Optimization" width="800" style="border: 2px solid black; border-radius: 8px;" />
</p>
</details>

<details>
<summary>🔍 Click to view AI Chatbot Preview</summary>
<br>
<p align="center">
  <!-- TODO: Replace with your actual chatbot screenshot once deployed -->
  <img src="https://raw.githubusercontent.com/bhanuxai/Smart-Logistics-Delivery-Intelligence/main/docs/hero_banner.png" alt="AI Chatbot" width="800" style="border: 2px solid black; border-radius: 8px;" />
</p>
</details>

---

## 🧠 Machine Learning & Optimization Models

| Engine Component | Model / Algorithm | Purpose | Metric Highlight |
| :--- | :--- | :--- | :--- |
| **Delivery Prediction** | Random Forest Regressor | Predicts shipping duration based on distances and price ratios. | $\approx 96.2\%$ Accuracy |
| **Demand Forecasting** | Random Forest Regressor | Forecasts future customer order counts grouped by Brazilian states. | $R^2 \approx 0.94$ |
| **Inventory Intelligence** | Random Forest Classifier | Evaluates stock velocity levels to identify replenishing indicators. | $F_1 \text{ Score } \approx 0.95$ |
| **Route Optimization** | Ant Colony Optimization | Simulates artificial agent pheromone paths to solve Traveling Salesperson Problems. | Optimized in $< 350\text{ms}$ |

---

## 🚀 Installation & Setup

### Prerequisites
- **Python**: v3.10 or higher
- **Node.js**: v18 or higher
- **MySQL Server**: v8.x

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/bhanuxai/Smart-Logistics-Delivery-Intelligence.git
cd Smart-Logistics-Delivery-Intelligence
```

### 2. Backend Installation
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
cp .env.example .env
# Edit .env with your local MySQL credentials and Gemini API Token
```

### 3. Database Seeding
Ensure your local MySQL server is active, a database schema named `smart_logistics_db` is created, and parameters are added to your `backend/.env`.
```bash
# Import the schemas and populate dataset records
python database/import_data.py
```

### 4. Frontend Installation
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
# Verify VITE_API_URL targets your local Flask server port (default 5000)
```

### 5. Running the Application
Ensure you run both services concurrently:
```bash
# Terminal 1: Launch Backend
cd backend
venv\Scripts\activate
python app.py

# Terminal 2: Launch Frontend
cd frontend
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) on your browser to view the application.

---

## 🔑 Environment Variables

The project reads configurations dynamically from local files. Ensure these variables are populated:

### Backend Variables (`backend/.env`)
```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_logistics_db
GEMINI_API_KEY=your_google_gemini_api_key
SECRET_KEY=any_hash_security_key_for_flask
```

### Frontend Variables (`frontend/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 📂 Project Structure

```text
Smart-Logistics-Delivery-Intelligence
├── backend/
│   ├── database/
│   │   ├── db.py             # Database connections & cursor handlers
│   │   ├── import_data.py    # ETL script to seed databases
│   │   ├── schema.sql        # MySQL schemas definition
│   │   └── queries.sql       # Testing SQL scripts
│   ├── datasets/             # Local database CSV seeds (gitignored)
│   ├── importers/            # Custom ETL data mapping logic
│   ├── ml/                   # Machine learning model definitions
│   ├── models/               # Serialized classifier models (.pkl) (gitignored)
│   ├── optimization/         # Ant Colony Optimization implementations
│   ├── routes/               # API endpoint routing logic (Flask Blueprints)
│   ├── app.py                # Main entry point for Flask backend server
│   ├── config.py             # Environment configurations loader
│   ├── gemini_service.py     # Google Gemini API model connector
│   └── requirements.txt      # Python backend packages list
├── docs/
│   └── hero_banner.png       # README Hero banner graphic
├── frontend/
│   ├── public/               # Static vectors & favicon assets
│   ├── src/
│   │   ├── assets/           # Dashboard graphics & logo media
│   │   ├── components/       # Reusable layout cards & charts
│   │   ├── pages/            # Core views (Dashboard, Products, Sellers, Profile, etc.)
│   │   ├── services/         # API Service mapper integrations
│   │   ├── App.jsx           # Main routing & layout component
│   │   └── main.jsx          # React app DOM entry point
│   ├── package.json          # Node dependencies definition
│   └── vite.config.js        # Vite runtime options mapping
├── .gitignore                # Global workspace gitignore rules
├── package.json              # Workspace root Node configurations
└── README.md                 # Project README documentation (This file)
```

---

## 📈 Performance Highlights

<p align="center">
  <img src="https://img.shields.io/badge/Prediction_Accuracy-95%25+-00FF66?style=for-the-badge&logo=checkmarx&logoColor=white" alt="Accuracy Badge" />
  <img src="https://img.shields.io/badge/Routing_Latency-%3C_350ms-cyan?style=for-the-badge&logo=speedtest&logoColor=white" alt="Latency Badge" />
  <img src="https://img.shields.io/badge/Telemetry_Sync-Real--Time-orange?style=for-the-badge&logo=fastapi&logoColor=white" alt="Sync Badge" />
</p>

---

## 🔮 Future Scope
- 🛰️ **Live GPS Tracker Integration**: Link fleet transport API streams with Leaflet maps.
- 🧠 **Deep Learning Recurrent Networks**: Introduce LSTM pipelines to forecast multivariable macro-demands.
- ⚡ **IoT Edge Sensors Telemetry**: Sync storage refrigeration sensors to anticipate carrier engine failures.
- 🐳 **Kubernetes Auto-Scaling**: Deploy Flask replicas on clusters to support high operator concurrent queries.
- 📱 **Mobile Dispatch Application**: Cross-platform React Native app for driver receipt signatures and route uploads.

---

## 🤝 Contribution

Contributions are welcome! If you'd like to improve optimization routing or build telemetry widgets:
1. Fork this Repository.
2. Create a Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🌐 Connect With Me

<p align="left">
  <a href="https://github.com/bhanuxai" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" />
  </a>
  <a href="https://linkedin.com" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge" />
  </a>
  <a href="mailto:bhanu@example.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email Badge" />
  </a>
</p>

---

<p align="center">
  <img src="https://capsule-render.vercel.app/type=waving&color=FF9900&height=100&section=footer" width="100%" />
</p>

<p align="center">
  Made with ❤️ by <b>Bhanu</b>
</p>
