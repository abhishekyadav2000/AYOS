'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw } from 'lucide-react';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const CELL_SIZE = 20;

const TETROMINOES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[0, 1, 0], [1, 1, 1]], // T
];

const COLORS = ['#0ea5e9', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];

interface TetrisProps {
  onClose: () => void;
}

export function TetrisGame({ onClose }: TetrisProps) {
  const [grid, setGrid] = useState<number[][]>(
    Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<number[][]>(TETROMINOES[0]);
  const [currentPos, setCurrentPos] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const isPieceValid = (piece: number[][], pos: { x: number; y: number }, testGrid: number[][]) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const gridX = pos.x + x;
          const gridY = pos.y + y;

          if (gridX < 0 || gridX >= GRID_WIDTH || gridY >= GRID_HEIGHT) return false;
          if (gridY >= 0 && testGrid[gridY][gridX]) return false;
        }
      }
    }
    return true;
  };

  const placePiece = (piece: number[][], pos: { x: number; y: number }, baseGrid: number[][]) => {
    const newGrid = baseGrid.map(row => [...row]);

    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const gridY = pos.y + y;
          const gridX = pos.x + x;
          if (gridY >= 0) {
            newGrid[gridY][gridX] = piece[y][x];
          }
        }
      }
    }

    return newGrid;
  };

  const clearLines = (baseGrid: number[][]) => {
    let clearedLines = 0;
    const newGrid = baseGrid.filter(row => {
      if (row.every(cell => cell !== 0)) {
        clearedLines++;
        return false;
      }
      return true;
    });

    while (newGrid.length < GRID_HEIGHT) {
      newGrid.unshift(Array(GRID_WIDTH).fill(0));
    }

    if (clearedLines > 0) {
      setScore(prev => prev + clearedLines * 100);
    }

    return newGrid;
  };

  const spawnNewPiece = () => {
    const newPiece = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
    const newPos = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 };

    if (!isPieceValid(newPiece, newPos, grid)) {
      setGameActive(false);
    } else {
      setCurrentPiece(newPiece);
      setCurrentPos(newPos);
    }
  };

  const moveDown = () => {
    if (!gameActive) return;

    const newPos = { ...currentPos, y: currentPos.y + 1 };

    if (isPieceValid(currentPiece, newPos, grid)) {
      setCurrentPos(newPos);
    } else {
      let newGrid = placePiece(currentPiece, currentPos, grid);
      newGrid = clearLines(newGrid);
      setGrid(newGrid);
      spawnNewPiece();
    }
  };

  const moveLeft = () => {
    const newPos = { ...currentPos, x: currentPos.x - 1 };
    if (isPieceValid(currentPiece, newPos, grid)) {
      setCurrentPos(newPos);
    }
  };

  const moveRight = () => {
    const newPos = { ...currentPos, x: currentPos.x + 1 };
    if (isPieceValid(currentPiece, newPos, grid)) {
      setCurrentPos(newPos);
    }
  };

  const rotatePiece = () => {
    const rotated = currentPiece[0].map((_, i) =>
      currentPiece.map(row => row[i]).reverse()
    );

    if (isPieceValid(rotated, currentPos, grid)) {
      setCurrentPiece(rotated);
    }
  };

  // Game loop
  useEffect(() => {
    if (gameActive) {
      gameLoopRef.current = setInterval(moveDown, 800);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameActive, grid, currentPiece, currentPos]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
      if (e.key === 'ArrowDown') moveDown();
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        rotatePiece();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPos, currentPiece, grid, gameActive]);

  // Render grid with piece
  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);

    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x]) {
          const gridY = currentPos.y + y;
          const gridX = currentPos.x + x;
          if (gridY >= 0 && gridY < GRID_HEIGHT && gridX >= 0 && gridX < GRID_WIDTH) {
            displayGrid[gridY][gridX] = currentPiece[y][x];
          }
        }
      }
    }

    return displayGrid;
  };

  const displayGrid = renderGrid();

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">🧩 Tetris</h1>
          <p className="text-xs text-gray-400">Classic block-stacking game</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Score */}
      <div className="p-4 bg-black/20 border-b border-white/10 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Score</p>
          <p className="text-2xl font-bold text-purple-400">{score}</p>
        </div>
        <div>
          {gameActive && <p className="text-sm text-green-400 font-semibold">Playing...</p>}
          {!gameActive && <p className="text-sm text-red-400 font-semibold">Game Over!</p>}
        </div>
        <button
          onClick={() => {
            setGrid(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0)));
            setScore(0);
            setGameActive(true);
            spawnNewPiece();
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RotateCw size={16} />
          New Game
        </button>
      </div>

      {/* Game Grid */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="bg-gray-900 border-2 border-white/20 rounded-lg"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
            gap: '1px',
            padding: '4px',
          }}
        >
          {displayGrid.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="bg-gray-800 border border-gray-700 transition-colors"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: cell ? COLORS[cell - 1] : '#1f2937',
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-black/20 border-t border-white/10 p-4 text-xs text-gray-400">
        <p>← → Arrow keys to move | ↑ or Space to rotate | ↓ to speed up</p>
      </div>
    </div>
  );
}
