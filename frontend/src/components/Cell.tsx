import type { Cell as CellType } from '../game/gameLogic'
import './Cell.css'

interface CellProps {
  value: CellType
  index: number
  onClick: () => void
  disabled: boolean
  isWinning: boolean
}

export default function Cell({ value, onClick, disabled, isWinning }: CellProps) {
  return (
    <button
      className={[
        'cell',
        isWinning ? 'cell--winning' : '',
        !value && !disabled ? 'cell--empty' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled || value !== null}
    >
      {value && (
        <span className={[
          'cell-symbol',
          `cell-symbol--${value.toLowerCase()}`,
          isWinning ? 'cell-symbol--winning' : '',
        ].filter(Boolean).join(' ')}>
          {value}
        </span>
      )}
    </button>
  )
}
