import React, { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinning }: { value: string | null; onSquareClick: () => void; isWinning: boolean }) {
  return (
    <button
      className={`square ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''} ${isWinning ? 'bg-yellow-200' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningLine }: { xIsNext: boolean; squares: (string | null)[]; onPlay: (nextSquares: (string | null)[], position: number) => void; winningLine: number[] | null }) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : squares.every((square) => square !== null)
    ? 'Draw! No one wins.'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="board">
      {Array(9)
        .fill(null)
        .map((_, i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            isWinning={winningLine?.includes(i) || false}
          />
        ))}
    </div>
  );
}

interface HistoryStep {
  squares: (string | null)[];
  position: number | null;
}

export default function App() {
  const [history, setHistory] = useState<HistoryStep[]>([{ squares: Array(9).fill(null), position: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares: (string | null)[], position: number) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, position }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function restartGame() {
    setHistory([{ squares: Array(9).fill(null), position: null }]);
    setCurrentMove(0);
  }

  const winnerInfo = calculateWinner(currentSquares);
  const winningLine = winnerInfo ? getWinningLine(currentSquares) : null;

  const moves = history.map((step, move) => {
    let description: string;
    let position = step.position !== null ? ` (${Math.floor(step.position / 3) + 1}, ${(step.position % 3) + 1})` : '';

    if (move === currentMove) {
      description = `You are at move #${move}${position}`;
      return (
        <li key={move} className="history-item current">
          {description}
        </li>
      );
    } else if (move > 0) {
      description = `Go to move #${move}${position}`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move} className="history-item">
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const displayMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="app-container">
      <h1 className="main-title">Tic-Tac-Toe Game</h1>
      <div className="content-container">
        <div className="history-container">
          <div className="history-header">
            <h2>History</h2>
            <button className="sort-btn" onClick={() => setIsAscending(!isAscending)}>
              {isAscending ? '↓ Desc' : '↑ Asc'}
            </button>
          </div>
          <ol className="history-list">{displayMoves}</ol>
        </div>
        <div className="game-container">
          <div className="game-board">
            <div className="status">{`Next player: ${xIsNext ? 'X' : 'O'}`}</div>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningLine={winningLine} />
            <button className="restart-btn" onClick={restartGame}>
              Restart Game
            </button>
            <div className="text-sm text-gray-600 mt-2">
              Click on squares to play • Use history to jump to previous moves
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getWinningLine(squares: (string | null)[]): number[] | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}