import type { Board, Player, GameMode } from './gameLogic'
import { getMLMove } from './aiInterface'
import { getHybridMove } from './minimax'

// ─── Interface ────────────────────────────────────────────────────────────────

export interface AIPlayer {
  getMove(board: Board, player: Player): Promise<number>
}

// ─── Implementations ──────────────────────────────────────────────────────────

class MLAIPlayer implements AIPlayer {
  getMove(board: Board, player: Player) {
    return getMLMove(board, player)
  }
}

class HybridAIPlayer implements AIPlayer {
  getMove(board: Board, player: Player) {
    return getHybridMove(board, player)
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/** Retourne l'adaptateur IA correspondant au mode, ou null si Human vs Human. */
export function createAIPlayer(mode: GameMode): AIPlayer | null {
  if (mode === 'ai-ml') return new MLAIPlayer()
  if (mode === 'ai-hybrid') return new HybridAIPlayer()
  return null
}
