from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from pathlib import Path
import json
import  numpy as np
# Inizializzazione app Flask
app = Flask(__name__)
CORS(app)
# Caricamento modello salvato
MODEL_PATH = Path(__file__).parent / "model" / "housing_model.joblib"
METRICS_PATH = Path(__file__).parent / "model" / "metrics.json"
DATA_PATH = Path(__file__).parent / "data" / "housing.csv"

model = joblib.load(MODEL_PATH)

# Endpoint base
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "California Housing Price Prediction API is running 🚀"})


# Endpoint di predizione
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Input JSON dal client
        data = request.get_json()

        # Controllo dati mancanti
        if not data:
            return jsonify({"error": "Nessun dato fornito"}), 400

        # Conversione in DataFrame
        df = pd.DataFrame([data])

        # Predizione
        prediction = model.predict(df)[0]

        return jsonify({
            "input": data,
            "predicted_house_value": round(float(prediction), 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

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


@app.route("/eda", methods=["GET"])
def eda():
    try:
        df = pd.read_csv(DATA_PATH)

        # Pulizia leggera come nel notebook
        df = df[df["median_house_value"] <= 500000]
        df = df[df["housing_median_age"] <= 50]
        df = df[df["median_income"] <= 15]

        # Statistiche principali
        # stats = df.describe(include="all").to_dict()


         # Funzione helper per serializzare i bins
        def make_distribution(series, bins=10, round_digits=2):
            # Calcola distribuzione con bins uniformi
            # dist = series.value_counts(bins=bins, sort=False)

            # # Converte intervalli in stringhe compatte e leggibili
            # formatted = {}
            # for interval, count in dist.items():
            #     # Intervallo come 1.0–2.0, senza parentesi
            #     left = round(interval.left, round_digits)
            #     right = round(interval.right, round_digits)
            #     formatted[f"{left}–{right}"] = int(count)

            counts, bin_edges = np.histogram(series, bins=bins)

            # Crea un dizionario leggibile con TUTTI gli intervalli (anche quelli vuoti)
            formatted = {}
            for i in range(len(bin_edges) - 1):
                left = round(bin_edges[i], round_digits)
                right = round(bin_edges[i + 1], round_digits)
                formatted[f"{left} – {right}"] = int(counts[i])
            return formatted
        
        




        stats = df.describe(include="all").replace({np.nan: None}).to_dict() 

        # Distribuzioni principali

        distributions = {
            "median_income": make_distribution(df["median_income"], bins=12),
            "housing_median_age": make_distribution(df["housing_median_age"], bins=10, round_digits=1),
            "median_house_value": make_distribution(df["median_house_value"], bins=12, round_digits=0),
        }

        # Correlazione tra variabili numeriche
        corr_matrix = df.corr(numeric_only=True)
        # corr = corr_matrix["median_house_value"].sort_values(ascending=False).to_dict()
        corr_json = corr_matrix.round(3).replace({np.nan: None}).to_dict()

        # Campione per scatter geografico (limitato a 15000 righe per non ridurre eccessivamente le perfomance)
        sample = df.sample(5000, random_state=42)[["latitude", "longitude", "median_house_value"]]
        # sample = df[["latitude", "longitude", "median_house_value"]]
        sample_data = sample.to_dict(orient="records")

        return jsonify({
            "summary_stats": stats,
            "distributions": distributions,
            "correlations": corr_json,
            "geo_sample": sample_data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Avvio server
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
