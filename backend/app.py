from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from pathlib import Path

# Inizializzazione app Flask
app = Flask(__name__)
CORS(app)
# Caricamento modello salvato
MODEL_PATH = Path(__file__).parent / "model" / "housing_model.joblib"
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


# Avvio server
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
