# Projet Machine Learning — Morpion Adaptatif

[![ISPM](https://www.ispm.mg)](https://www.ispm.mg)

---

## Informations du groupe

| | |
|---|---|
| **Établissement** | Institut Supérieur Polytechnique de Madagascar |
| **Filière** | ESIIA4 / IGGLIA4 / IMTICIA4 / ISAIA4 |
| **Groupe** | Groupe XX |
| **Membres** | [A remplire] |

---

## Description du projet

Ce projet implémente un pipeline Machine Learning complet autour du
jeu de Morpion (Tic-Tac-Toe). Il comprend :

- Un générateur de dataset basé sur l'algorithme Minimax avec
  élagage Alpha-Bêta
- Une analyse exploratoire des données (EDA)
- Des modèles ML entraînés sur deux cibles : `x_wins` et `is_draw`
- Une interface jouable avec trois modes : vs Human, vs IA (ML),
  vs IA (Hybride)

---

## Structure du repository

```
projet-morpion/
├── generator.py          # Générateur Minimax + export CSV
├── minimax.py            # Algorithme Minimax + Alpha-Bêta
├── utils.py              # Fonctions utilitaires du plateau
├── notebook.ipynb        # EDA + Baseline + Modèles avancés
├── ressources/
│   ├── dataset.csv       # Dataset généré (2423 lignes, 20 colonnes)
│   ├── model_xwins.pkl   # Meilleur modèle — cible x_wins
│   └── model_draw.pkl    # Meilleur modèle — cible is_draw
├── interface/            # Interface jouable (3 modes)
│   └── README-jeu.md     # Instructions pour lancer le jeu
└── README.md             # Ce fichier
```

---

## Résultats ML

### Dataset

| Propriété | Valeur |
|-----------|--------|
| Nombre d'états | 2423 |
| Nombre de features | 18 |
| x_wins = 1 | 1830 (75%) |
| x_wins = 0 | 593 (25%) |
| is_draw = 1 | 441 (18%) |
| is_draw = 0 | 1982 (82%) |

### Tableau comparatif des modèles

| Modèle | x_wins Accuracy | x_wins F1 | is_draw Accuracy | is_draw F1 |
|--------|----------------|-----------|-----------------|------------|
| Régression Logistique | 0.6534 | 0.6520 | 0.7894 | 0.6965 |
| Decision Tree | 0.7918 | 0.7972 | 0.8330 | 0.8356 |
| Random Forest | 0.8784 | 0.8692 | 0.9052 | 0.8908 |
| XGBoost | 0.9381 | 0.9371 | 0.9196 | 0.9164 |
| MLP | 0.9155 | 0.9161 | 0.9485 | 0.9478 |
| Gradient Boosting | 0.8392 | 0.8275 | 0.8763 | 0.8587 |

**Meilleur modèle : XGBoost** sur les deux cibles.

---

## Réponses aux questions

### Q1 — Analyse des coefficients

La case centrale (L1,C1 — case 4) est la plus influente dans les
deux modèles :

- Corrélation `x_wins ← X occupe centre` : **+0.11**
- Corrélation `x_wins ← O occupe centre` : **-0.22**

La case centrale apparaît occupée par X dans **592 états gagnants
sur 1830** soit 32% des victoires de X.

La corrélation négative de O au centre (-0.22) est plus forte en
valeur absolue que la corrélation positive de X au centre (+0.11).
Cela signifie que laisser O prendre le centre nuit plus à X que
X prenant le centre ne l'aide.

C'est cohérent avec la stratégie humaine : le centre appartient à
4 combinaisons gagnantes (2 diagonales + 1 ligne + 1 colonne),
ce qui en fait la case stratégiquement la plus puissante du plateau.

Pour `is_draw` : les coefficients sont plus uniformément répartis
sur tout le plateau, car un match nul nécessite un équilibre global
et non une case clé.

---

### Q2 — Déséquilibre des classes

| Cible | Classe 0 | Classe 1 | Équilibré ? |
|-------|----------|----------|-------------|
| x_wins | 593 (25%) | 1830 (75%) | Non |
| is_draw | 1982 (82%) | 441 (18%) | Très déséquilibré |

Les deux cibles sont déséquilibrées, surtout `is_draw` (seulement
18% de 1). Dans ce cas l'Accuracy est trompeuse — un modèle qui
prédit toujours "pas nul" obtiendrait déjà 82% d'accuracy sans
rien apprendre réellement.

On privilégie donc le **F1-Score** qui pénalise les erreurs sur la
classe minoritaire, et l'**AUC-ROC** qui mesure la capacité du
modèle à distinguer les deux classes indépendamment du seuil de
décision. Ces métriques donnent une image plus honnête des
performances réelles du modèle.

---

### Q3 — Comparaison des deux modèles

`x_wins` est plus difficile à apprendre que `is_draw` pour la
Régression Logistique (0.65 vs 0.79). Trois raisons expliquent
cette différence :

**Raison 1 — Complexité non-linéaire.** Prédire si X gagne dépend
de combinaisons précises de cases occupées (ex : X a deux cases
alignées + la troisième est libre). La Régression Logistique est
un modèle linéaire qui ne peut tracer qu'une frontière droite entre
les classes, insuffisante pour capturer ces interactions.

**Raison 2 — Déséquilibre trompeur pour is_draw.** L'accuracy de
0.79 pour `is_draw` est en partie due au déséquilibre (82% de 0)
— le modèle prédit souvent "pas nul" et a statistiquement raison.
Le F1 de 0.69 révèle cette limite.

**Raison 3 — Nature du problème.** Déterminer une victoire
nécessite de reconnaître des patterns globaux sur le plateau
(alignements, menaces, contre-menaces) que la régression logistique
ne modélise pas.

Les modèles avancés corrigent cela progressivement :
- Decision Tree : +13% sur x_wins grâce aux règles de décision
- Random Forest : +22% grâce à l'ensemble de 100 arbres
- XGBoost : +28% grâce au boosting itératif

Les erreurs se concentrent sur les états intermédiaires du jeu
(3-4 pièces posées) où plusieurs issues sont encore possibles et
où la frontière de décision est la plus complexe.

---

### Q4 — Mode hybride
[Reponse du question 4 a faire]


---

## Vidéo de présentation

[Lien vers la vidéo — à compléter avant 16h30]

---

*ISPM — Examen Final Semestre 1 — Machine Learning — 2024/2025*