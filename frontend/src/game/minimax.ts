/**
 * Mode Hybride : Minimax Alpha-Bêta (profondeur 3) + évaluation ML aux feuilles
 * ═══════════════════════════════════════════════════════════════════════════════
 * Jusqu'à profondeur 3 : recherche Minimax classique avec élagage Alpha-Bêta.
 * Aux feuilles (profondeur max atteinte) : les modèles ML prédisent le résultat
 * depuis cet état au lieu d'une heuristique codée en dur.
 */

import type { Board, Player } from './gameLogic'
import { applyMove, getValidMoves, checkWinner, isDraw } from './gameLogic'
import { getMLPrediction } from './aiInterface'

const MAX_DEPTH = 3

// ─── Évaluation terminale certaine ───────────────────────────────────────────

function terminalScore(board: Board, maximizingPlayer: Player): number | null {
  const won = checkWinner(board)
  if (won) return won.winner === maximizingPlayer ? 1 : -1
  if (isDraw(board)) return 0
  return null
}

// ─── Évaluation ML aux feuilles (async) ──────────────────────────────────────

async function mlEvaluate(board: Board, maximizingPlayer: Player): Promise<number> {
  const pred = await getMLPrediction(board)
  if (maximizingPlayer === 'X') {
    // X veut maximiser : x_wins positif, is_draw légèrement positif
    return pred.x_wins - (1 - pred.x_wins - pred.is_draw) + pred.is_draw * 0.1
  } else {
    // O veut minimiser les gains de X
    return (1 - pred.x_wins) - pred.x_wins + pred.is_draw * 0.1
  }
}

// ─── Minimax Alpha-Bêta ───────────────────────────────────────────────────────

async function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  maximizingPlayer: Player,
  minimizingPlayer: Player,
): Promise<number> {
  // 1. État terminal certain
  const terminal = terminalScore(board, maximizingPlayer)
  if (terminal !== null) return terminal

  // 2. Feuille : évaluation ML
  if (depth === 0) {
    return mlEvaluate(board, maximizingPlayer)
  }

  const moves = getValidMoves(board)
  const currentPlayer = isMaximizing ? maximizingPlayer : minimizingPlayer

  if (isMaximizing) {
    let best = -Infinity
    for (const move of moves) {
      const next = applyMove(board, move, currentPlayer)
      const score = await minimax(next, depth - 1, alpha, beta, false, maximizingPlayer, minimizingPlayer)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break // élagage bêta
    }
    return best
  } else {
    let best = Infinity
    for (const move of moves) {
      const next = applyMove(board, move, currentPlayer)
      const score = await minimax(next, depth - 1, alpha, beta, true, maximizingPlayer, minimizingPlayer)
      best = Math.min(best, score)
      beta = Math.min(beta, best)
      if (beta <= alpha) break // élagage alpha
    }
    return best
  }
}

// ─── Point d'entrée public ────────────────────────────────────────────────────

/**
 * Retourne l'index du meilleur coup pour `player` depuis `board`.
 * Utilise Minimax profondeur 3 + ML aux feuilles.
 */
export async function getHybridMove(board: Board, player: Player): Promise<number> {
  const moves = getValidMoves(board)
  if (moves.length === 0) throw new Error('No valid moves')

  const opponent: Player = player === 'X' ? 'O' : 'X'

  let bestScore = -Infinity
  let bestMove = moves[0]

  for (const move of moves) {
    const next = applyMove(board, move, player)
    const score = await minimax(
      next,
      MAX_DEPTH - 1,
      -Infinity,
      Infinity,
      false,         // opponent plays next
      player,
      opponent,
    )
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
