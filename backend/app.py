from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import json
from pathlib import Path

# --- Configurazione app Flask ---
app = Flask(__name__)


def handle_options():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        headers = None
        if "ACCESS_CONTROL_REQUEST_HEADERS" in request.headers:
            headers = request.headers["ACCESS_CONTROL_REQUEST_HEADERS"]
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", headers or "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        return response

CORS(
    app,
    resources={r"/*": {"origins": [
        "https://california-housing-price-predictor-vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)

# --- Percorsi ---
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "model" / "housing_model.joblib"
METRICS_PATH = BASE_DIR / "model" / "metrics.json"
DATA_PATH = BASE_DIR / "data" / "housing.csv"

# --- Caricamento modello ML ---
model = joblib.load(MODEL_PATH)

# --- Endpoint base ---
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "California Housing Price Prediction API is running 🚀"})

# --- Endpoint predizione ---
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Nessun dato fornito"}), 400

        df = pd.DataFrame([data])
        prediction = model.predict(df)[0]

        return jsonify({
            "input": data,
            "predicted_house_value": round(float(prediction), 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Endpoint metriche modello ---
@app.route("/metrics", methods=["GET"])
def metrics():
    try:
        if not METRICS_PATH.exists():
            return jsonify({"error": "Metrics file not found"}), 404

        with open(METRICS_PATH, "r") as f:
            metrics_data = json.load(f)

        return jsonify(metrics_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Endpoint EDA ---
@app.route("/eda", methods=["GET"])
def eda():
    try:
        df = pd.read_csv(DATA_PATH)

        # Filtri leggeri per pulizia
        df = df[df["median_house_value"] <= 500000]
        df = df[df["housing_median_age"] <= 50]
        df = df[df["median_income"] <= 15]

        # Funzione helper per histogrammi
        def make_distribution(series, bins=10, round_digits=2):
            counts, bin_edges = np.histogram(series, bins=bins)
            formatted = {
                f"{round(bin_edges[i], round_digits)} – {round(bin_edges[i + 1], round_digits)}": int(counts[i])
                for i in range(len(bin_edges) - 1)
            }
            return formatted

        stats = df.describe(include="all").replace({np.nan: None}).to_dict()

        distributions = {
            "median_income": make_distribution(df["median_income"], bins=12),
            "housing_median_age": make_distribution(df["housing_median_age"], bins=10, round_digits=1),
            "median_house_value": make_distribution(df["median_house_value"], bins=12, round_digits=0),
        }

        corr_matrix = df.corr(numeric_only=True).round(3).replace({np.nan: None}).to_dict()

        # Campione ridotto per mappe
        sample_data = (
            df.sample(5000, random_state=42)[["latitude", "longitude", "median_house_value"]]
            .to_dict(orient="records")
        )

        return jsonify({
            "summary_stats": stats,
            "distributions": distributions,
            "correlations": corr_matrix,
            "geo_sample": sample_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Avvio server ---
if __name__ == "__main__":
    from os import environ
    app.run(host="0.0.0.0", port=int(environ.get("PORT", 5000)))


