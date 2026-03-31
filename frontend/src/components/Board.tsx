import type { Board as BoardType } from '../game/gameLogic'
import Cell from './Cell'
import './Board.css'

interface BoardProps {
  board: BoardType
  onCellClick: (index: number) => void
  winningCells: number[]
  disabled: boolean
}

export default function Board({ board, onCellClick, winningCells, disabled }: BoardProps) {
  return (
    <div className="board-wrapper">
      <div className="board" role="grid" aria-label="Morpion board">
        {board.map((cell, index) => (
          <Cell
            key={index}
            index={index}
            value={cell}
            onClick={() => onCellClick(index)}
            disabled={disabled}
            isWinning={winningCells.includes(index)}
          />
        ))}
      </div>
    </div>
  )
}
