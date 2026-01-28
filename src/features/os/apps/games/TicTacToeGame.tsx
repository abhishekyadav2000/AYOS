'use client';

import React, { useState } from 'react';
import { X, RotateCw } from 'lucide-react';
import { useAYOSGlobal } from '../../state/useAYOSGlobal';

type Player = 'X' | 'O' | null;

interface TicTacToeProps {
  onClose: () => void;
}

export function TicTacToeGame({ onClose }: TicTacToeProps) {
  const { setScore } = useAYOSGlobal();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player>(null);
  const [score, setGameScore] = useState(0);

  const calculateWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getAIMove = (squares: Player[]): number => {
    // Simple AI: try to win, block player, or take center
    const checkMove = (player: Player): number => {
      for (let i = 0; i < 9; i++) {
        if (squares[i] !== null) continue;
        const test = [...squares];
        test[i] = player;
        if (calculateWinner(test) === player) return i;
      }
      return -1;
    };

    const winMove = checkMove('O');
    if (winMove !== -1) return winMove;

    const blockMove = checkMove('X');
    if (blockMove !== -1) return blockMove;

    if (squares[4] === null) return 4;

    const corners = [0, 2, 6, 8].filter(i => squares[i] === null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

    const available = squares.map((_, i) => i).filter(i => squares[i] === null);
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleSquareClick = (idx: number) => {
    if (gameOver || board[idx] || !isXNext) return;

    const newBoard = [...board];
    newBoard[idx] = 'X';
    setBoard(newBoard);

    const w = calculateWinner(newBoard);
    if (w === 'X') {
      setGameOver(true);
      setWinner('X');
      setScore('tic-tac-toe', 10);
      setGameScore(10);
      return;
    }

    const isBoardFull = newBoard.every(sq => sq !== null);
    if (isBoardFull) {
      setGameOver(true);
      setScore('tic-tac-toe', 5);
      setGameScore(5);
      return;
    }

    // AI move
    setTimeout(() => {
      const aiIdx = getAIMove(newBoard);
      newBoard[aiIdx] = 'O';
      setBoard(newBoard);

      const aiWin = calculateWinner(newBoard);
      if (aiWin === 'O') {
        setGameOver(true);
        setWinner('O');
        return;
      }

      const fullAfterAI = newBoard.every(sq => sq !== null);
      if (fullAfterAI) {
        setGameOver(true);
        return;
      }

      setIsXNext(true);
    }, 600);

    setIsXNext(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setGameScore(0);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">⭕ Tic-Tac-Toe</h1>
          <p className="text-xs text-gray-400">Play against AI</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Status */}
      <div className="p-4 bg-black/20 border-b border-white/10 flex justify-between items-center">
        <div>
          {gameOver ? (
            <div>
              {winner === 'X' && <p className="text-green-400 font-bold">🎉 You Win!</p>}
              {winner === 'O' && <p className="text-red-400 font-bold">AI Wins</p>}
              {!winner && <p className="text-yellow-400 font-bold">Draw!</p>}
            </div>
          ) : (
            <p className="text-cyan-400 font-semibold">{isXNext ? 'Your Turn (X)' : 'AI Thinking...'}</p>
          )}
        </div>
        {gameOver && <p className="text-amber-400 font-bold">Score: {score}</p>}
        <button
          onClick={resetGame}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RotateCw size={16} />
          New Game
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-3 gap-2 bg-gray-900 p-4 rounded-lg border border-white/20">
          {board.map((value, idx) => (
            <button
              key={idx}
              onClick={() => handleSquareClick(idx)}
              disabled={value !== null || gameOver || !isXNext}
              className="w-20 h-20 text-3xl font-bold bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center"
            >
              {value === 'X' && <span className="text-cyan-400">X</span>}
              {value === 'O' && <span className="text-red-400">O</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 bg-black/20 text-center text-xs text-gray-400">
        <p>Click squares to place your mark (X) • AI plays as O</p>
      </div>
    </div>
  );
}
