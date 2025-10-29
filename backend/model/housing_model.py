# ======================================================
# File: housing_model.py
# Descrizione: Training modello Regressione Lineare
# per predire i prezzi delle case in California.
# ======================================================

import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ======================================================
# 1. FUNZIONE DI CARICAMENTO E PULIZIA DATI
# ======================================================
def load_and_clean_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)

    # Rimozione outlier principali
    df = df[df["median_house_value"] <= 500000]
    df = df[df["housing_median_age"] <= 50]
    df = df[df["median_income"] <= 15]

    return df


# ======================================================
# 2. COSTRUZIONE PIPELINE DI PREPROCESSING
# ======================================================
def build_preprocessor(df: pd.DataFrame):
    numeric_features = df.select_dtypes(include=["int64", "float64"]).columns.tolist()
    if "median_house_value" in numeric_features:
        numeric_features.remove("median_house_value")
    categorical_features = ["ocean_proximity"]

    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features)
        ]
    )

    return preprocessor


# ======================================================
# 3. TRAINING MODELLO
# ======================================================
def train_model(df: pd.DataFrame):
    X = df.drop("median_house_value", axis=1)
    y = df["median_house_value"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    preprocessor = build_preprocessor(df)
    model = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", LinearRegression())
    ])

    model.fit(X_train, y_train)

    # Valutazione
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print(f"R2: {r2:.3f}")
    print(f"MAE: {mae:.2f}")
    print(f"RMSE: {rmse:.2f}")

    return model, {"r2": r2, "mae": mae, "rmse": rmse}


# ======================================================
# 4. VALIDAZIONE INCROCIATA
# ======================================================
def cross_validate_model(model, X, y, cv_splits=5):
    cv = KFold(n_splits=cv_splits, shuffle=True, random_state=42)
    scores = cross_val_score(model, X, y, cv=cv, scoring="r2")
    print(f"Cross-Validation R2 mean: {scores.mean():.3f}")
    return scores.mean()


# ======================================================
# 5. SALVATAGGIO E CARICAMENTO MODELLO
# ======================================================
def save_model(model, path="housing_model.joblib"):
    joblib.dump(model, path)
    print(f"✅ Modello salvato in: {path}")

def load_model(path="housing_model.joblib"):
    return joblib.load(path)


# ======================================================
# 6. ESECUZIONE PRINCIPALE
# ======================================================
if __name__ == "__main__":
    data_path = Path("../../backend/data/housing.csv")
    df = load_and_clean_data(data_path)
    model, metrics = train_model(df)
    save_model(model)
