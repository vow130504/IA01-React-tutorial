import React, { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinning }: { value: string | null; onSquareClick: () => void; isWinning: boolean }) {
  return (
    <button
      className={`square ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''} ${isWinning ? 'winning' : ''}`}
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

  return (
    <div className="board">
      {Array(3).fill(null).map((_, row) => (
        <div key={row} className="board-row">
          {Array(3).fill(null).map((_, col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                isWinning={winningLine?.includes(index) || false}
              />
            );
          })}
        </div>
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
  const isDraw = !winnerInfo && currentSquares.every((square) => square !== null);
  const status = winnerInfo
    ? `Winner: ${winnerInfo}`
    : isDraw
    ? 'Draw! No one wins.'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  // Tạo trạng thái hiện tại cố định
  const currentPosition = history[currentMove].position;
  const currentStatus = `You are at move #${currentMove}${currentPosition !== null ? ` (${Math.floor(currentPosition / 3) + 1}, ${(currentPosition % 3) + 1})` : ''}`;

  // Tạo danh sách lịch sử, không bao gồm trạng thái hiện tại
  const moves = history.map((step, move) => {
    let description: string;
    let position = step.position !== null ? ` (${Math.floor(step.position / 3) + 1}, ${(step.position % 3) + 1})` : '';

    if (move === 0) {
      description = 'Go to game start';
    } else {
      description = `Go to move #${move}${position}`;
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
          <h2 className="history-title">History</h2>
          <div className="sort-btn-container">
            <button className="sort-btn" onClick={() => setIsAscending(!isAscending)}>
              {isAscending ? '↓ Desc' : '↑ Asc'}
            </button>
          </div>
          <div className="current-status">{currentStatus}</div>
          <ol className="history-list">{displayMoves}</ol>
        </div>
        <div className="game-container">
          <div className="game-board">
            <div className="status">{status}</div>
            <div className="board-wrapper">
              <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningLine={winningLine} />
            </div>
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