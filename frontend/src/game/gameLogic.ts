// ─── Types ────────────────────────────────────────────────────────────────────

export type Player = 'X' | 'O'
export type Cell = Player | null
export type Board = Cell[] // 9 cells, indices 0-8

export type GameResult =
  | { status: 'playing' }
  | { status: 'won'; winner: Player; line: number[] }
  | { status: 'draw' }

export type GameMode = 'human' | 'ai-ml' | 'ai-hybrid'

// ─── Win conditions ───────────────────────────────────────────────────────────

const WIN_LINES = [
  [0, 1, 2], // top row
  [3, 4, 5], // mid row
  [6, 7, 8], // bot row
  [0, 3, 6], // left col
  [1, 4, 7], // mid col
  [2, 5, 8], // right col
  [0, 4, 8], // diag
  [2, 4, 6], // anti-diag
]

// ─── Core logic ───────────────────────────────────────────────────────────────

export function checkWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line }
    }
  }
  return null
}

export function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && checkWinner(board) === null
}

export function getGameResult(board: Board): GameResult {
  const won = checkWinner(board)
  if (won) return { status: 'won', winner: won.winner, line: won.line }
  if (isDraw(board)) return { status: 'draw' }
  return { status: 'playing' }
}

export function getValidMoves(board: Board): number[] {
  return board.map((cell, i) => (cell === null ? i : -1)).filter((i) => i !== -1)
}

export function applyMove(board: Board, index: number, player: Player): Board {
  const next = [...board] as Board
  next[index] = player
  return next
}

export function nextPlayer(player: Player): Player {
  return player === 'X' ? 'O' : 'X'
}

export function createEmptyBoard(): Board {
  return Array(9).fill(null) as Board
}

// ─── Encoding: board → 18 features (matching dataset.csv format) ──────────────
// c0_x, c0_o, c1_x, c1_o, ..., c8_x, c8_o

export type Features18 = Record<string, 0 | 1>

export function encodeBoard(board: Board): Features18 {
  const features: Features18 = {}
  for (let i = 0; i < 9; i++) {
    features[`c${i}_x`] = board[i] === 'X' ? 1 : 0
    features[`c${i}_o`] = board[i] === 'O' ? 1 : 0
  }
  return features
}
