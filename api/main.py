"""
API FastAPI — Morpion ML
========================
Expose un endpoint POST /predict qui retourne les probabilités ML
pour un état du plateau de Morpion.

Lancement :
    pip install fastapi uvicorn scikit-learn xgboost pandas
    uvicorn api.main:app --reload --port 8123
"""

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─── Chargement des modèles ───────────────────────────────────────────────────

try:
    model_xwins = joblib.load("ressources/model_xwins.pkl")
    model_draw  = joblib.load("ressources/model_draw.pkl")
except FileNotFoundError as e:
    raise RuntimeError(
        f"Modèle introuvable : {e}. "
        "Lancez uvicorn depuis la racine du projet."
    )

# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(title="Morpion ML API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

# ─── Schéma d'entrée (18 features, même ordre que le dataset) ─────────────────

class BoardFeatures(BaseModel):
    c0_x: int; c0_o: int
    c1_x: int; c1_o: int
    c2_x: int; c2_o: int
    c3_x: int; c3_o: int
    c4_x: int; c4_o: int
    c5_x: int; c5_o: int
    c6_x: int; c6_o: int
    c7_x: int; c7_o: int
    c8_x: int; c8_o: int

# ─── Endpoint ─────────────────────────────────────────────────────────────────

@app.post("/predict")
def predict(features: BoardFeatures):
    """
    Reçoit les 18 features du plateau et retourne les probabilités ML.

    Body JSON (envoyé par encodeBoard() du frontend) :
        { c0_x, c0_o, c1_x, c1_o, ..., c8_x, c8_o }

    Réponse :
        { x_wins: float, is_draw: float }
    """
    # Reconstruction dans l'ordre d'entraînement :
    # [c0_x..c8_x, c0_o..c8_o]
    f = features
    row = np.array([
        f.c0_x, f.c1_x, f.c2_x, f.c3_x, f.c4_x,
        f.c5_x, f.c6_x, f.c7_x, f.c8_x,
        f.c0_o, f.c1_o, f.c2_o, f.c3_o, f.c4_o,
        f.c5_o, f.c6_o, f.c7_o, f.c8_o,
    ], dtype=float).reshape(1, -1)

    try:
        x_wins = float(model_xwins.predict_proba(row)[0][1])
        is_draw = float(model_draw.predict_proba(row)[0][1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur modèle : {e}")

    return {"x_wins": x_wins, "is_draw": is_draw}


@app.get("/health")
def health():
    return {"status": "ok"}
