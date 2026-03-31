import type { GameMode } from '../game/gameLogic'
import './ModeSelector.css'

interface ModeSelectorProps {
  current: GameMode
  onChange: (mode: GameMode) => void
}

const MODES: { id: GameMode; label: string; description: string; badge?: string }[] = [
  {
    id: 'human',
    label: 'Humain vs Humain',
    description: 'Deux joueurs s\'affrontent',
  },
  {
    id: 'ai-ml',
    label: 'vs IA (ML)',
    description: 'L\'IA utilise les modèles ML',
    badge: 'ML',
  },
  {
    id: 'ai-hybrid',
    label: 'vs IA (Hybride)',
    description: 'Minimax + ML aux feuilles',
    badge: 'Hybride',
  },
]

export default function ModeSelector({ current, onChange }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          className={['mode-btn', current === mode.id ? 'mode-btn--active' : ''].join(' ')}
          onClick={() => onChange(mode.id)}
        >
          <span className="mode-btn-label">
            {mode.label}
            {mode.badge && <span className="mode-badge">{mode.badge}</span>}
          </span>
          <span className="mode-btn-desc">{mode.description}</span>
        </button>
      ))}
    </div>
  )
}
