import type { GameResult, Player } from '../game/gameLogic'
import './GameStatus.css'

interface GameStatusProps {
  result: GameResult
  currentPlayer: Player
  isThinking: boolean
  isAIMode: boolean
}

export default function GameStatus({ result, currentPlayer, isThinking, isAIMode }: GameStatusProps) {
  function getLabel(): string {
    if (result.status === 'won') {
      const isAIWin = isAIMode && result.winner === 'O'
      return isAIWin ? "L'IA gagne !" : `${result.winner} gagne !`
    }
    if (result.status === 'draw') return 'Match nul !'
    if (isThinking) return "L'IA réfléchit…"
    const isAITurn = isAIMode && currentPlayer === 'O'
    if (isAITurn) return "L'IA joue…"
    return 'Your Turn'
  }

  const isGameOver = result.status !== 'playing'

  return (
    <div className={[
      'status-pill',
      isGameOver ? 'status-pill--result' : '',
      isThinking ? 'status-pill--thinking' : '',
    ].filter(Boolean).join(' ')}>
      {isThinking && (
        <span className="thinking-dots">
          <span /><span /><span />
        </span>
      )}
      <span className="status-label">{getLabel()}</span>
    </div>
  )
}
