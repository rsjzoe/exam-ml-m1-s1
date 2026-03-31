import { useState, useEffect, useCallback, useMemo } from "react";
import {
  createEmptyBoard,
  getGameResult,
  nextPlayer,
  type Board,
  type Player,
  type GameResult,
  type GameMode,
} from "./game/gameLogic";
import { createAIPlayer } from "./game/aiPlayer";
import GameBoard from "./components/Board";
import GameStatus from "./components/GameStatus";
import ModeSelector from "./components/ModeSelector";
import PlayerPanel from "./components/PlayerPanel";
import "./App.css";

// ── Helpers ──────────────────────────────────────────────────────────────────

function ordinalSuffix(n: number): string {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [mode, setMode] = useState<GameMode>("human");
  const [result, setResult] = useState<GameResult>({ status: "playing" });
  const [isThinking, setIsThinking] = useState(false);
  const [scores, setScores] = useState<Record<Player, number>>({ X: 0, O: 0 });
  const [round, setRound] = useState(1);

  const ai = useMemo(() => createAIPlayer(mode), [mode]);
  const winningCells = result.status === "won" ? result.line : [];
  const isAIMode = ai !== null;

  // ── AI turn trigger ──────────────────────────────────────────────────────────

  const triggerAIMove = useCallback(
    async (currentBoard: Board, player: Player) => {
      if (!ai) return;
      setIsThinking(true);
      try {
        const move = await ai.getMove(currentBoard, player);
        const nextBoard = [...currentBoard] as Board;
        nextBoard[move] = player;
        const nextResult = getGameResult(nextBoard);
        setBoard(nextBoard);
        setResult(nextResult);
        setCurrentPlayer(nextPlayer(player));
        if (nextResult.status === "won") {
          setScores((s) => ({
            ...s,
            [nextResult.winner]: s[nextResult.winner] + 1,
          }));
        }
      } catch (err) {
        console.error("AI move failed:", err);
      } finally {
        setIsThinking(false);
      }
    },
    [ai],
  );

  // ── Effect: trigger AI when it's O's turn ───────────────────────────────────

  useEffect(() => {
    const isAITurn = ai !== null && currentPlayer === "O";
    const gameOver = result.status !== "playing";
    if (isAITurn && !gameOver && !isThinking) {
      triggerAIMove(board, "O");
    }
  }, [board, currentPlayer, ai, result, isThinking, triggerAIMove]);

  // ── Human click ──────────────────────────────────────────────────────────────

  function handleCellClick(index: number) {
    if (result.status !== "playing") return;
    if (isThinking) return;
    if (board[index] !== null) return;
    if (ai !== null && currentPlayer === "O") return;

    const nextBoard = [...board] as Board;
    nextBoard[index] = currentPlayer;
    const nextResult = getGameResult(nextBoard);
    setBoard(nextBoard);
    setResult(nextResult);
    setCurrentPlayer(nextPlayer(currentPlayer));
    if (nextResult.status === "won") {
      setScores((s) => ({
        ...s,
        [nextResult.winner]: s[nextResult.winner] + 1,
      }));
    }
  }

  // ── Mode change ──────────────────────────────────────────────────────────────

  function handleModeChange(newMode: GameMode) {
    setMode(newMode);
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setResult({ status: "playing" });
    setIsThinking(false);
    setScores({ X: 0, O: 0 });
    setRound(1);
  }

  // ── Restart (manual) ─────────────────────────────────────────────────────────

  function handleNextRound() {
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setResult({ status: "playing" });
    setIsThinking(false);
    setRound((r) => r + 1);
  }

  function handleRestart() {
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setResult({ status: "playing" });
    setIsThinking(false);
    setScores({ X: 0, O: 0 });
    setRound(1);
  }

  // ── Player meta ──────────────────────────────────────────────────────────────

  const playerMeta: Record<Player, { name: string; avatar: string }> = {
    X: { name: "Joueur 1", avatar: "/fox.png" },
    O: isAIMode
      ? { name: "IA", avatar: "/ia.jpeg" }
      : { name: "Joueur 2", avatar: "/mechantpurple.png" },
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const isBoardDisabled =
    result.status !== "playing" ||
    isThinking ||
    (ai !== null && currentPlayer === "O");

  return (
    <div className="app">
      <h1 className="game-title">
        TIC <span className="tac">TAC</span> TOE
      </h1>

      <div className="app-content">
        <ModeSelector current={mode} onChange={handleModeChange} />

        <div className="game-card">
          {/* Header */}
          <div className="card-header">
            <div className="round-badge">
              <div className="round-number-flex">
                <span className="round-number">{round}</span>
                <span className="round-ordinal">{ordinalSuffix(round)}</span>
              </div>
              <span className="round-label">Round</span>
            </div>
          </div>

          {/* Body: player left | board | player right */}
          <div className="card-body">
            <PlayerPanel
              player="X"
              name={playerMeta.X.name}
              avatar={playerMeta.X.avatar}
              wins={scores.X}
              isActive={currentPlayer === "X" && result.status === "playing"}
            />

            <div className="board-area">
              <GameBoard
                board={board}
                onCellClick={handleCellClick}
                winningCells={winningCells}
                disabled={isBoardDisabled}
              />
            </div>

            <PlayerPanel
              player="O"
              name={playerMeta.O.name}
              avatar={playerMeta.O.avatar}
              wins={scores.O}
              isActive={currentPlayer === "O" && result.status === "playing"}
            />
          </div>

          {/* Footer */}
          <div className="card-footer">
            <GameStatus
              result={result}
              currentPlayer={currentPlayer}
              isThinking={isThinking}
              isAIMode={isAIMode}
            />
            {result.status !== "playing" && (
              <button
                className="restart-btn restart-btn--next"
                onClick={handleNextRound}
              >
                Round suivant →
              </button>
            )}
            <button className="restart-btn" onClick={handleRestart}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
