# INSTITUT SUPERIEUR POLYTECHNIQUE DE MADAGASCAR

**Examen Final — Semestre 1**
ESIIA4 – IGGLIA4 – IMTICIA4 – ISAIA4

---

# MACHINE LEARNING

**Hackathon — 9 heures — Groupes de 7 étudiants**

---

## 1. Contexte

Vous êtes l'équipe R&D d'une startup EdTech malgache dont le produit phare intègre une IA de Morpion adaptative. Votre mission : construire un pipeline ML complet — de la génération des données à l'interface jouable — capable d'évaluer et jouer intelligemment les positions du jeu.

|              |                                                               |
| ------------ | ------------------------------------------------------------- |
| **Durée**    | 9 heures (07h30 – 16h30)                                      |
| **Mode**     | Distanciel complet                                            |
| **Groupes**  | 7 étudiants — filières libres (ESIIA, IGGLIA, IMTICIA, ISAIA) |
| **Deadline** | Dernier commit GitHub à 16h30 précises                        |

---

## 2. Description du Dataset

Vous devez constituer vous-mêmes le dataset. Il représente des états de plateau de Morpion, chacun labellisé avec le résultat théorique en supposant un jeu parfait des deux joueurs à partir de cet état.

### 2.1 Proposition d'encodage du plateau

Le plateau 3×3 comporte 9 cases numérotées de 0 à 8 (ligne par ligne, de gauche à droite). Chaque case est encodée par deux colonnes binaires : `ci_x` (1 si X occupe la case i, 0 sinon) et `ci_o` (1 si O occupe la case i, 0 sinon). Une case vide donne `ci_x = 0`, `ci_o = 0`.

```
| 0 | 1 | 2 |
| 3 | 4 | 5 |
| 6 | 7 | 8 |
```

Le dataset comporte ainsi **18 features d'entrée** : `c0_x, c0_o, c1_x, c1_o, …, c8_x, c8_o`.

### 2.2 Structure du dataset

| Colonne         | Type      | Description                                                       |
| --------------- | --------- | ----------------------------------------------------------------- |
| `c0_x` … `c8_x` | int (0/1) | 1 si X occupe la case i, 0 sinon                                  |
| `c0_o` … `c8_o` | int (0/1) | 1 si O occupe la case i, 0 sinon                                  |
| `x_wins`        | int (0/1) | Cible A — 1 si X gagne en jeu parfait depuis cet état             |
| `is_draw`       | int (0/1) | Cible B — 1 si la partie est nulle en jeu parfait depuis cet état |

> Le dataset ne contient que les états où c'est au tour de X de jouer. Les deux cibles sont calculées en supposant que les deux joueurs jouent de manière optimale jusqu'à la fin de la partie.

---

## 3. Votre Mission

> **Organisation de l'équipe (7 membres, filières libres)**
>
> La diversité des profils est un atout et l'organisation de chaque équipe est clé dans cet examen.
>
> Rôles suggérés (non obligatoires) :
>
> - **Data Engineer / Algo Specialist** (×1) — Étape 0 : générateur Minimax-Alphabeta + export CSV
> - **Data Analyst** (×1) — Étape 1 : EDA, visualisations, analyse du déséquilibre
> - **ML Engineer** (×2) — Étapes 2 & 3 : modèles, tuning, analyse des coefficients
> - **Dev Interface** (×2) — Étape 4 : interface jouable, intégration des 3 modes
> - **Tech Lead** (×1) — README, vidéo, coordination et intégration finale
>
> **Certaines étapes peuvent être traitées en parallèles.**

---

### Étape 0 — Génération du Dataset

Implémentez en Python un générateur qui parcourt tous les états valides du plateau (où c'est au tour de X) et les labellise via l'algorithme Minimax (vous pouvez utiliser les élagages Alpha-Bêta pour accélérer la génération) — que vous connaissez déjà.

**Comportement attendu**

- **Entrée :** un état de plateau (liste de 9 valeurs) + indication du joueur courant.
- **Sortie :** le résultat théorique depuis cet état en jeu parfait — X gagne, O gagne ou nulle.

Le générateur doit :

- Parcourir tous les états valides du plateau.
- Pour chaque état où c'est au tour de X, appeler Minimax pour obtenir l'outcome.
- Encoder l'état en 18 features (`ci_x`, `ci_o`) et enregistrer `x_wins` et `is_draw`.
- Exporter le résultat dans `ressources/dataset.csv` via pandas.

---

### Étape 1 — EDA et Préparation des Données

Réalisez une Exploratory Data Analysis orientée vers les cibles `x_wins` et `is_draw`. Questions clés :

- Distribution de `x_wins` et `is_draw` — le dataset est-il équilibré ?
- Quelle case est le plus souvent occupée par X dans les états où il gagne ?
- Corrélation entre les features et chaque cible — heatmap.

---

### Étape 2 — Baseline : Régression Logistique (×2)

Entraînez **deux modèles de Régression Logistique indépendants** : l'un sur `x_wins`, l'autre sur `is_draw`. Les deux partagent les mêmes 18 features d'entrée.

- Évaluez avec : Accuracy, F1-Score, matrice de confusion.
- Comparez les deux modèles : lequel est plus difficile à apprendre ? Pourquoi ?

> **Analyse des coefficients (obligatoire)** : pour chaque modèle, visualisez les 18 coefficients mappés sur le plateau 3×3 (une carte pour `ci_x`, une pour `ci_o`). Quelles cases influencent le plus la prédiction ? La case centrale joue-t-elle un rôle particulier ?

---

### Étape 3 — Modèles Avancés

Une fois la baseline établie, explorez des modèles plus puissants (**non encore vus en cours**). Appliquez-les sur les deux cibles et comparez avec la baseline.

| Piste                           | Note                                                               |
| ------------------------------- | ------------------------------------------------------------------ |
| **Decision Tree**               | Interprétable et visualisable — naturel pour des positions de jeu. |
| **Random Forest**               | Robustesse améliorée, feature importance utile.                    |
| **Gradient Boosting / XGBoost** | Souvent les plus performants sur données tabulaires.               |
| **Réseau de Neurones (MLP)**    | sklearn MLPClassifier ou Keras — architecture libre.               |

---

### Étape 4 — Interface Jouable

Développez une interface Morpion jouable supportant trois configurations. Le langage et la technologie sont libres : Python, JavaScript/Web, Unity, mobile, terminal — à vous de choisir selon les compétences de votre équipe.

| Configuration       | Comportement                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| **vs Human**        | Deux joueurs humains s'affrontent.                                                                    |
| **vs IA (ML)**      | L'IA utilise vos modèles ML (`x_wins`, `is_draw`) pour évaluer chaque position et choisir son coup.   |
| **vs IA (Hybride)** | Minimax-Alphabeta jusqu'à profondeur 3, puis vos modèles ML comme fonction d'évaluation des feuilles. |

> **Mode hybride :** vos modèles ML remplacent la fonction d'évaluation heuristique de Minimax. Les probabilités prédites (`x_wins`, `is_draw`) guident la recherche au lieu de règles codées en dur.

---

## 4. Livrables — Avant 16h30 sur GitHub

| #     | Livrable                 | Description                                                                                                                                                                                                                                                                                                                 |
| ----- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | `generator`              | Script Minimax-Alphabeta générant `ressources/dataset.csv`                                                                                                                                                                                                                                                                  |
| **2** | `ressources/dataset.csv` | Le dataset généré (18 features + `x_wins` + `is_draw`)                                                                                                                                                                                                                                                                      |
| **3** | `notebook.ipynb`         | EDA · Baseline ×2 · Analyse des coefficients · Modèles avancés. Code commenté.                                                                                                                                                                                                                                              |
| **4** | `interface/` ou `game.*` | Interface jouable — 3 modes. Langage libre. Un `README-jeu.md` explique comment lancer. Un éventuel déploiement en ligne serait un atout.                                                                                                                                                                                   |
| **5** | **Vidéo (3–5 min)**      | Présentation équipe · EDA · Baseline vs Final · Démo interface. Lien dans README.                                                                                                                                                                                                                                           |
| **6** | `README.md`              | Rapport structuré avec, au moins, les informations de base : <br>- en-tête avec lien vers le site de l'ISPM <br>- le nom du groupe <br>- les membres du groupe <br>- description du projet <br>- structure du repository <br>- résultats ML <br>- réponses aux questions (voir 5.) <br>- lien vers la vidéo de présentation |

---

## 5. Questions README (Q1–Q4)

### Q1 — Analyse des coefficients

Pour chaque modèle (`x_wins` et `is_draw`), quelles cases du plateau — et quelles occupations (X ou O) — ont les coefficients les plus élevés en valeur absolue ? La case centrale est-elle particulièrement influente ? En quoi est-ce cohérent avec la stratégie humaine ?

### Q2 — Déséquilibre des classes

Le dataset est-il équilibré entre `x_wins = 1` et `x_wins = 0` ? Même question pour `is_draw`. Quelle métrique privilégiez-vous en conséquence (Accuracy, F1, AUC…) et pourquoi ?

### Q3 — Comparaison des deux modèles

Lequel des deux classificateurs obtient le meilleur score ? Selon vous, pourquoi l'un est-il plus difficile à apprendre que l'autre ? Dans quels types de positions vos modèles se trompent-ils le plus ?

### Q4 — Mode hybride

En mode Hybride, observez-vous une différence de comportement par rapport au mode IA-ML pur ? Le joueur hybride évite-t-il mieux les pièges ? Décrivez qualitativement.

---

## 6. Critères d'Évaluation

| Critère                                             | Poids    | Points clés                |
| --------------------------------------------------- | -------- | -------------------------- |
| Performance ML (sur les 2 cibles)                   | **25%**  | Baseline vs modèle final   |
| Génération du dataset (generator + dataset.csv)     | **20%**  | Script propre, CSV valide  |
| Interface jouable (3 configurations fonctionnelles) | **20%**  | UX claire, modes distincts |
| Présentation & Vidéo                                | **15%**  | EDA, insights, démo        |
| Qualité du code (structure, commentaires)           | **10%**  | Notebook lisible           |
| Réponses README (Q1–Q4)                             | **10%**  | Argumentation technique    |
| **TOTAL**                                           | **100%** |                            |

---

**Bon courage à toutes les équipes**
