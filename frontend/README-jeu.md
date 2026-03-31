# Morpion IA — Interface Jouable

Interface React + TypeScript pour le projet Hackathon ML ISPM 2025.

---

## Lancer l'interface

```bash
cd exam
pnpm install   # ou npm install
pnpm dev       # ou npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

---

## 3 Modes de jeu

| Mode | Description |
|---|---|
| **Humain vs Humain** | Deux joueurs s'affrontent sur le même écran. X joue toujours en premier. |
| **vs IA (ML)** | L'IA joue O. Elle évalue chaque coup légal via les modèles ML et choisit le meilleur. |
| **vs IA (Hybride)** | L'IA joue O. Minimax Alpha-Bêta jusqu'à profondeur 3, puis les modèles ML évaluent les feuilles. |

---

## Intégration des modèles ML (pour la collègue)

### Ce que l'interface attend

Un endpoint HTTP sur `http://localhost:8000/predict` :

**Requête**
```
POST /predict
Content-Type: application/json

{
  "c0_x": 0, "c0_o": 0,
  "c1_x": 1, "c1_o": 0,
  ...
  "c8_x": 0, "c8_o": 0
}
```

Les 18 features correspondent exactement au format de `ressources/dataset.csv`.

**Réponse**
```json
{
  "x_wins": 0.82,
  "is_draw": 0.11
}
```

### Exemple FastAPI minimal

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle, pandas as pd

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_xwins = pickle.load(open("model_xwins.pkl", "rb"))
model_draw  = pickle.load(open("model_draw.pkl", "rb"))

FEATURES = [f"c{i}_{p}" for i in range(9) for p in ["x", "o"]]

@app.post("/predict")
def predict(features: dict):
    df = pd.DataFrame([features])[FEATURES]
    return {
        "x_wins": float(model_xwins.predict_proba(df)[0][1]),
        "is_draw": float(model_draw.predict_proba(df)[0][1]),
    }
```

```bash
pip install fastapi uvicorn pandas scikit-learn
uvicorn main:app --reload --port 8000
```

### Activer l'API (désactiver le stub)

Dans `src/game/aiInterface.ts`, ligne 42 :
```typescript
const USE_STUB = false  // ← passer à false quand l'API est prête
```

---

## Structure des fichiers

```
exam/src/
├── game/
│   ├── gameLogic.ts    # Types + logique pure (win, draw, encodage 18 features)
│   ├── aiInterface.ts  # Contrat ML : getMLPrediction, getMLMove
│   └── minimax.ts      # Minimax α-β profondeur 3 + évaluation ML aux feuilles
├── components/
│   ├── Board.tsx / .css
│   ├── Cell.tsx / .css
│   ├── GameStatus.tsx / .css
│   └── ModeSelector.tsx / .css
├── App.tsx             # Orchestration principale
├── App.css
└── index.css
```

---

## Build pour déploiement

```bash
pnpm build       # génère dist/
pnpm preview     # prévisualise le build
```

Le dossier `dist/` peut être déployé sur Vercel, Netlify, ou GitHub Pages.
