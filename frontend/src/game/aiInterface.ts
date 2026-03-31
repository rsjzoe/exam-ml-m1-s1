/**
 * AI Integration Contract
 * =======================
 * Ce fichier définit le contrat entre l'interface React et les modèles ML Python.
 *
 * Pour ta collègue ML :
 *   Lance une API FastAPI sur http://localhost:8000 avec l'endpoint suivant :
 *
 *   POST /predict
 *   Body JSON : { c0_x: 0|1, c0_o: 0|1, c1_x: 0|1, ..., c8_x: 0|1, c8_o: 0|1 }
 *   Réponse   : { x_wins: float, is_draw: float }
 *
 *   Exemple FastAPI minimal (Python) :
 *   ─────────────────────────────────
 *   from fastapi import FastAPI
 *   from fastapi.middleware.cors import CORSMiddleware
 *   import pickle, pandas as pd
 *
 *   app = FastAPI()
 *   app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
 *
 *   model_xwins = pickle.load(open("model_xwins.pkl", "rb"))
 *   model_draw  = pickle.load(open("model_draw.pkl", "rb"))
 *
 *   @app.post("/predict")
 *   def predict(features: dict):
 *       df = pd.DataFrame([features])
 *       return {
 *           "x_wins": float(model_xwins.predict_proba(df)[0][1]),
 *           "is_draw": float(model_draw.predict_proba(df)[0][1]),
 *       }
 */

import type { Board, Player } from './gameLogic'
import { encodeBoard, getValidMoves, applyMove, checkWinner, isDraw } from './gameLogic'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MLPrediction {
  x_wins: number  // probabilité que X gagne [0, 1]
  is_draw: number // probabilité de nulle    [0, 1]
}

// ─── Config ───────────────────────────────────────────────────────────────────

const API_URL = 'http://localhost:8123/predict'

// ─── Prediction ───────────────────────────────────────────────────────────────

/**
 * Appelle l'API ML pour prédire le résultat depuis un état du plateau.
 * En mode stub : retourne des valeurs aléatoires (permet de tester l'UI).
 */
export async function getMLPrediction(board: Board): Promise<MLPrediction> {
  const features = encodeBoard(board)
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(features),
  })

  if (!response.ok) {
    throw new Error(`API ML error: ${response.status}`)
  }

  return response.json() as Promise<MLPrediction>
}

// ─── ML Move selection ────────────────────────────────────────────────────────

/**
 * Mode IA (ML) : évalue chaque coup légal et retourne l'index du meilleur.
 * Stratégie : maximise x_wins si player=X, minimise x_wins si player=O.
 * En cas d'égalité sur x_wins, favorise is_draw (éviter de perdre).
 */
export async function getMLMove(board: Board, player: Player): Promise<number> {
  const moves = getValidMoves(board)
  if (moves.length === 0) throw new Error('No valid moves')

  // Vérification rapide : coup gagnant immédiat
  for (const move of moves) {
    const next = applyMove(board, move, player)
    if (checkWinner(next)?.winner === player) return move
  }

  // Vérification rapide : bloquer une victoire immédiate adverse
  const opponent = player === 'X' ? 'O' : 'X'
  for (const move of moves) {
    const next = applyMove(board, move, opponent)
    if (checkWinner(next)?.winner === opponent) return move
  }

  // Évaluation ML de chaque coup
  const scored = await Promise.all(
    moves.map(async (move) => {
      const next = applyMove(board, move, player)

      // Ne pas évaluer les états terminaux — résultat certain
      if (checkWinner(next) || isDraw(next)) {
        return { move, score: player === 'X' ? 1 : 0 }
      }

      const pred = await getMLPrediction(next)
      const score = player === 'X'
        ? pred.x_wins + pred.is_draw * 0.3   // X veut gagner ou nulle
        : (1 - pred.x_wins) + pred.is_draw * 0.3 // O veut que X perde ou nulle
      return { move, score }
    })
  )

  scored.sort((a, b) => b.score - a.score)
  return scored[0].move
}
