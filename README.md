# 🏠 California Housing Price Predictor

Un progetto **end-to-end di Machine Learning + Web Development** che combina:
- 📊 **Python + Flask** per il backend e il modello di regressione lineare
- 💻 **Next.js (TypeScript + Tailwind)** per il frontend
- 🤖 Dataset: *California Housing Prices* (da Scikit-learn)

---

## 🚀 Funzionalità principali

### 🔧 Backend (Flask)
- API REST per predizione dei prezzi (`/predict`)
- Endpoint `/metrics` per leggere le metriche del modello
- Pipeline di preprocessing con `scikit-learn`
- Addestramento del modello di regressione lineare con salvataggio in `.joblib`
- Supporto **CORS** per comunicare con il frontend

### 🧠 Modello ML
Il modello utilizza il dataset *California Housing Prices*, che contiene dati su posizione geografica, età media delle abitazioni, popolazione e reddito medio.
Metriche salvate:
- **R²**: coefficiente di determinazione
- **MAE**: errore medio assoluto
- **RMSE**: errore quadratico medio

### 🌐 Frontend (Next.js + TypeScript)
- Form interattivo per inserire le caratteristiche della casa
- Chiamate API al backend Flask
- Loader animato durante le predizioni
- Risultato formattato in dollari
- Pagine informative:
  - `/about` – informazioni su dataset e modello
  - `/metrics` – performance del modello con R², MAE, RMSE

---

## 🗂️ Struttura del progetto

```
CALIFORNIA_HOUSING/
│
├── backend/
│   ├── app.py                     # Flask API
│   ├── model/
│   │   ├── housing_model.py       # training e salvataggio modello
│   │   ├── housing_model.joblib   # modello addestrato
│   │   └── metrics.json           # metriche del modello
│   └── data/
│       └── housing.csv            # dataset
│
├── frontend/
│   ├── src/app/
│   │   ├── components/HouseForm.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   └── metrics/page.tsx
│   ├── .env.local
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installazione e avvio

### 1️⃣ Backend (Flask)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
python app.py
```
Backend disponibile su: [http://127.0.0.1:5000](http://127.0.0.1:5000)

### 2️⃣ Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Frontend disponibile su: [http://localhost:3000](http://localhost:3000)

---

## 📦 Requisiti principali

**Backend**
```
flask
flask-cors
pandas
numpy
scikit-learn
joblib
```
**Frontend**
```
next
react
typescript
tailwindcss
```
---

## 📈 API Endpoints

| Metodo | Endpoint     | Descrizione |
|--------|---------------|-------------|
| `GET`  | `/`           | Test API |
| `POST` | `/predict`    | Predice il valore di una casa |
| `GET`  | `/metrics`    | Restituisce le metriche del modello |

Esempio richiesta:
```bash
POST /predict
Content-Type: application/json

{
  "longitude": -122.23,
  "latitude": 37.88,
  "housing_median_age": 41.0,
  "total_rooms": 880.0,
  "total_bedrooms": 129.0,
  "population": 322.0,
  "households": 126.0,
  "median_income": 8.3252,
  "ocean_proximity": "NEAR BAY"
}
```

---

## 🧠 Dataset
Il dataset *California Housing Prices* è incluso in Scikit-learn ed è stato originariamente derivato dal censimento USA del 1990.
Contiene informazioni su:
- Posizione (latitudine, longitudine)
- Caratteristiche delle abitazioni
- Dati socioeconomici
- Prezzo mediano delle case

---

## 🧾 Licenza
MIT License © 2025

---

## ✨ Autore
**California Housing ML App** — progetto dimostrativo per analisi e sviluppo full-stack AI.