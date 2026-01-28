'use client';

import React, { useState, useEffect } from 'react';
import { X, RotateCw } from 'lucide-react';
import { useAYOSGlobal } from '../../state/useAYOSGlobal';

const GRID_SIZE = 10;
const MINE_COUNT = 15;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

interface MinesweeperProps {
  onClose: () => void;
}

export function MinesweeperGame({ onClose }: MinesweeperProps) {
  const { setScore, scores } = useAYOSGlobal();
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [flagCount, setFlagCount] = useState(0);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver || won) return;
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameOver, won]);

  const initializeGame = () => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE).fill(null).map(() => ({
          isMine: Math.random() < MINE_COUNT / (GRID_SIZE * GRID_SIZE),
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
      );

    // Calculate adjacent mines
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE && newGrid[ny][nx].isMine) {
              count++;
            }
          }
        }
        newGrid[y][x].adjacentMines = count;
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWon(false);
    setTime(0);
    setFlagCount(0);
  };

  const revealCell = (y: number, x: number) => {
    if (gameOver || won || grid[y][x].isRevealed || grid[y][x].isFlagged) return;

    const newGrid = grid.map(row => [...row]);

    if (newGrid[y][x].isMine) {
      setGameOver(true);
      // Reveal all mines
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newGrid[i][j].isMine) newGrid[i][j].isRevealed = true;
        }
      }
      setGrid(newGrid);
      return;
    }

    // Flood fill for empty cells
    const flood = (cy: number, cx: number) => {
      if (cy < 0 || cy >= GRID_SIZE || cx < 0 || cx >= GRID_SIZE) return;
      if (newGrid[cy][cx].isRevealed || newGrid[cy][cx].isFlagged) return;

      newGrid[cy][cx].isRevealed = true;

      if (newGrid[cy][cx].adjacentMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            flood(cy + dy, cx + dx);
          }
        }
      }
    };

    flood(y, x);
    setGrid(newGrid);

    // Check win condition
    if (checkWin(newGrid)) {
      setWon(true);
      setScore('minesweeper', time);
    }
  };

  const toggleFlag = (y: number, x: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || won || grid[y][x].isRevealed) return;

    const newGrid = grid.map(row => [...row]);
    newGrid[y][x].isFlagged = !newGrid[y][x].isFlagged;
    setFlagCount(newGrid.reduce((sum, row) => sum + row.filter(c => c.isFlagged).length, 0));
    setGrid(newGrid);
  };

  const checkWin = (gameGrid: Cell[][]): boolean => {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = gameGrid[y][x];
        if (!cell.isMine && !cell.isRevealed) return false;
      }
    }
    return true;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 to-red-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">💣 Minesweeper</h1>
          <p className="text-xs text-gray-400">Reveal all safe squares without hitting mines</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 bg-black/20 border-b border-white/10 flex justify-between items-center">
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-gray-400">Time</p>
            <p className="text-lg font-bold text-cyan-400">{time}s</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Flags</p>
            <p className="text-lg font-bold text-amber-400">{flagCount}/{MINE_COUNT}</p>
          </div>
        </div>
        {gameOver && <p className="text-red-400 font-bold">💥 Game Over!</p>}
        {won && <p className="text-green-400 font-bold">🎉 You Won!</p>}
        <button
          onClick={initializeGame}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RotateCw size={16} />
          New Game
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div className="bg-gray-900 p-2 rounded-lg border border-white/20">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 30px)` }}>
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <button
                  key={`${x}-${y}`}
                  onClick={() => revealCell(y, x)}
                  onContextMenu={(e) => toggleFlag(y, x, e)}
                  className={`w-8 h-8 text-xs font-bold border transition-all ${
                    cell.isRevealed
                      ? cell.isMine
                        ? 'bg-red-600 text-white border-red-700'
                        : `bg-gray-700 border-gray-600 ${
                            cell.adjacentMines > 0 ? 'text-cyan-400' : 'text-gray-700'
                          }`
                      : cell.isFlagged
                      ? 'bg-amber-600 border-amber-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-500 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {cell.isRevealed ? (cell.isMine ? '💣' : cell.adjacentMines || '') : cell.isFlagged ? '🚩' : ''}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t border-white/10 p-4 bg-black/20 text-xs text-gray-400">
        <p>Left-click to reveal • Right-click to flag • Reveal all safe squares to win</p>
      </div>
    </div>
  );
}
