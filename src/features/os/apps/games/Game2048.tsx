'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw } from 'lucide-react';

const GRID_WIDTH = 4;
const GRID_HEIGHT = 5;
const CELL_SIZE = 60;

const NUMBERS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

const getColor = (value: number): string => {
  const colors: { [key: number]: string } = {
    2: 'bg-blue-200 text-blue-900',
    4: 'bg-blue-300 text-blue-900',
    8: 'bg-blue-400 text-white',
    16: 'bg-cyan-400 text-white',
    32: 'bg-cyan-500 text-white',
    64: 'bg-purple-400 text-white',
    128: 'bg-purple-500 text-white',
    256: 'bg-pink-400 text-white',
    512: 'bg-pink-500 text-white',
    1024: 'bg-orange-400 text-white',
    2048: 'bg-orange-600 text-white',
  };
  return colors[value] || 'bg-gray-300 text-gray-900';
};

interface Game2048Props {
  onClose: () => void;
}

export function Game2048({ onClose }: Game2048Props) {
  const [grid, setGrid] = useState<(number | null)[][]>(
    Array(GRID_HEIGHT)
      .fill(null)
      .map(() => Array(GRID_WIDTH).fill(null))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize game
  useEffect(() => {
    const newGrid = Array(GRID_HEIGHT)
      .fill(null)
      .map(() => Array(GRID_WIDTH).fill(null));
    addNewTile(newGrid);
    addNewTile(newGrid);
    setGrid(newGrid);
  }, []);

  const addNewTile = (gameGrid: (number | null)[][]) => {
    const empty: [number, number][] = [];
    gameGrid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === null) empty.push([x, y]);
      });
    });

    if (empty.length === 0) return;

    const [x, y] = empty[Math.floor(Math.random() * empty.length)];
    gameGrid[y][x] = Math.random() < 0.9 ? 2 : 4;
  };

  const canMove = (gameGrid: (number | null)[][]): boolean => {
    // Check horizontal
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH - 1; x++) {
        if (gameGrid[y][x] === gameGrid[y][x + 1] && gameGrid[y][x] !== null) return true;
      }
    }
    // Check vertical
    for (let y = 0; y < GRID_HEIGHT - 1; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (gameGrid[y][x] === gameGrid[y + 1][x] && gameGrid[y][x] !== null) return true;
      }
    }
    // Check for empty spaces
    return gameGrid.some(row => row.some(cell => cell === null));
  };

  const moveGrid = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const compress = (arr: (number | null)[]) => arr.filter(val => val !== null);
    const merge = (arr: (number | null)[]) => {
      const compressed = compress(arr);
      for (let i = 0; i < compressed.length - 1; i++) {
        if (compressed[i] === compressed[i + 1]) {
          compressed[i] = compressed[i]! * 2;
          newScore += compressed[i];
          if (compressed[i] === 2048) setWon(true);
          compressed.splice(i + 1, 1);
          moved = true;
        }
      }
      return compressed;
    };

    if (direction === 'left' || direction === 'right') {
      newGrid = newGrid.map(row => {
        let newRow = direction === 'left' ? merge(row) : merge(row.reverse()).reverse();
        while (newRow.length < GRID_WIDTH) {
          direction === 'left' ? newRow.push(null as any) : newRow.unshift(null as any);
        }
        return newRow;
      });
    } else {
      for (let x = 0; x < GRID_WIDTH; x++) {
        let col = newGrid.map(row => row[x]);
        col = direction === 'up' ? merge(col) : merge(col.reverse()).reverse();
        while (col.length < GRID_HEIGHT) {
          direction === 'up' ? col.push(null as any) : col.unshift(null as any);
        }
        for (let y = 0; y < GRID_HEIGHT; y++) {
          newGrid[y][x] = col[y];
        }
      }
    }

    if (moved) {
      addNewTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);

      if (!canMove(newGrid)) {
        setGameOver(true);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') moveGrid('left');
        if (e.key === 'ArrowRight') moveGrid('right');
        if (e.key === 'ArrowUp') moveGrid('up');
        if (e.key === 'ArrowDown') moveGrid('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver]);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">🔢 2048</h1>
          <p className="text-xs text-gray-400">Slide tiles to combine numbers</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Score */}
      <div className="p-4 bg-black/20 border-b border-white/10">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-xs text-gray-400">Score</p>
            <p className="text-2xl font-bold text-cyan-400">{score}</p>
          </div>
          <button
            onClick={() => {
              const newGrid = Array(GRID_HEIGHT)
                .fill(null)
                .map(() => Array(GRID_WIDTH).fill(null));
              addNewTile(newGrid);
              addNewTile(newGrid);
              setGrid(newGrid);
              setScore(0);
              setGameOver(false);
              setWon(false);
            }}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RotateCw size={16} />
            New Game
          </button>
        </div>
        {won && <p className="text-sm text-green-400 font-semibold">🎉 You reached 2048!</p>}
        {gameOver && <p className="text-sm text-red-400 font-semibold">Game Over!</p>}
      </div>

      {/* Game Grid */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          ref={canvasRef}
          className="bg-gray-900 border-2 border-white/20 rounded-lg p-3"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
            gap: '8px',
          }}
        >
          {grid.map((row, y) =>
            row.map((value, x) => (
              <div
                key={`${x}-${y}`}
                className={`${
                  value ? getColor(value) : 'bg-gray-800'
                } flex items-center justify-center font-bold text-xl rounded transition-all`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              >
                {value}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-black/20 border-t border-white/10 p-4 text-xs text-gray-400">
        <p>Use arrow keys to move tiles. Combine numbers to reach 2048!</p>
      </div>
    </div>
  );
}
