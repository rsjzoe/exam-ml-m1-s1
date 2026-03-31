# Morpion IA — Pipeline Machine Learning

**[Institut Supérieur Polytechnique de Madagascar](https://www.ispm.mg)**  
Examen Final — Semestre 1 — Machine Learning  
ESIIA4 – IGGLIA4 – IMTICIA4 – ISAIA4

---

## Membres du groupe

<!-- TODO: ajouter les noms des membres -->

---

## Description

Pipeline ML complet autour du jeu de Morpion : génération de dataset par algorithme Minimax Alpha-Bêta, entraînement de modèles de classification (Régression Logistique, Decision Tree, Random Forest, XGBoost), et interface jouable en React avec 3 modes — Humain vs Humain, vs IA (ML), vs IA (Hybride).

---

## Structure du repository

```txt
.
├── api/
│   └── main.py              # API FastAPI — expose /predict aux modèles ML
├── frontend/                # Interface React + TypeScript (Vite)
│   └── src/
│       ├── game/            # Logique de jeu, IA ML, Minimax hybride
│       └── components/      # Board, Cell, GameStatus, ModeSelector
├── generators/
│   ├── generator_dataset.py # Génère ressources/dataset.csv via Minimax
│   ├── minimax.py           # Algorithme Minimax Alpha-Bêta
│   └── utils.py
├── ressources/
│   ├── dataset.csv          # 2423 états labellisés (18 features + 2 cibles)
│   ├── model_xwins.pkl      # Modèle XGBoost — prédit x_wins
│   └── model_draw.pkl       # Modèle XGBoost — prédit is_draw
├── notebook.ipynb           # EDA + Baseline + Modèles avancés
└── README.md
```

---

## Installation et lancement

Le projet comporte deux parties à lancer en parallèle : l'**API Python** et le **frontend React**.

### Prérequis

- Python 3.10+
- Node.js 18+ et [pnpm](https://pnpm.io) (ou npm)

---

### 1. API Python (modèles ML)

> Toutes les dépendances Python sont isolées dans `.venv` — pour tout supprimer : `rm -rf .venv`

Depuis la racine du projet :

```bash
# 1. Créer l'environnement virtuel
python3 -m venv .venv

# 2. Installer les dépendances
.venv/bin/pip install fastapi uvicorn scikit-learn xgboost

# 3. Lancer l'API
.venv/bin/uvicorn api.main:app --port 8123
```

L'API est disponible sur `http://localhost:8123`.  
Vérification : `curl http://localhost:8123/health` doit retourner `{"status":"ok"}`.

---

### 2. Frontend React

Dans un second terminal :

```bash
cd frontend

# Installer les dépendances Node
pnpm install   # ou : npm install

# Lancer en développement
pnpm dev       # ou : npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173).

> L'API doit être lancée en parallèle pour que les modes **vs IA (ML)** et **vs IA (Hybride)** fonctionnent.

---

## Résultats ML

| Modèle                | Cible       | Accuracy   | F1-Score   |
| --------------------- | ----------- | ---------- | ---------- |
| Régression Logistique | x_wins      | 0.7876     | 0.7336     |
| Régression Logistique | is_draw     | 0.8268     | 0.7484     |
| Decision Tree         | x_wins      | 0.7918     | 0.7972     |
| Decision Tree         | is_draw     | 0.8330     | 0.8356     |
| Random Forest         | x_wins      | 0.8784     | 0.8692     |
| Random Forest         | is_draw     | 0.9052     | 0.8908     |
| **XGBoost**           | **x_wins**  | **0.9381** | **0.9371** |
| **XGBoost**           | **is_draw** | **0.9196** | **0.9164** |

---

## Réponses aux questions (Q1–Q4)

### Q1 — Analyse des coefficients

<!-- TODO -->

### Q2 — Déséquilibre des classes

<!-- TODO -->

### Q3 — Comparaison des deux modèles

<!-- TODO -->

### Q4 — Mode hybride

<!-- TODO -->

---

## Vidéo de présentation

<!-- TODO: lien vidéo -->
