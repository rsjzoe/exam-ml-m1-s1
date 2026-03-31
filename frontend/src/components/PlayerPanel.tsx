import type { Player } from "../game/gameLogic";
import "./PlayerPanel.css";

interface PlayerPanelProps {
  player: Player;
  name: string;
  avatar: string;
  wins: number;
  isActive: boolean;
}

export default function PlayerPanel({
  player,
  name,
  avatar,
  wins,
  isActive,
}: PlayerPanelProps) {
  return (
    <div
      className={["player-panel", isActive ? "player-panel--active" : ""].join(
        " ",
      )}
    >
      <div className="player-avatar-wrap">
        <img src={avatar} alt={name} className="player-avatar" />
      </div>
      <div className="player-name">{name}</div>
      <div className={`player-symbol player-symbol--${player.toLowerCase()}`}>
        {player}
      </div>
      <div className="player-wins">Win Rounds: {wins}</div>
    </div>
  );
}
