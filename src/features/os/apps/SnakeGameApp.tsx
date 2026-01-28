"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export function SnakeGameApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "paused" | "gameOver">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const snake = useRef<Position[]>([{ x: 10, y: 10 }]);
  const direction = useRef<Direction>("RIGHT");
  const nextDirection = useRef<Direction>("RIGHT");
  const food = useRef<Position>({ x: 15, y: 15 });
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const GRID_SIZE = 20;
  const CELL_SIZE = 20;

  const generateFood = useCallback(() => {
    const maxX = GRID_SIZE;
    const maxY = GRID_SIZE;
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
      };
    } while (snake.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food.current = newFood;
  }, []);

  const resetGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = "RIGHT";
    nextDirection.current = "RIGHT";
    setScore(0);
    generateFood();
  }, [generateFood]);

  const startGame = useCallback(() => {
    resetGame();
    setGameState("playing");
  }, [resetGame]);

  const pauseGame = () => {
    setGameState(prev => prev === "playing" ? "paused" : "playing");
  };

  const gameLoop = useCallback(() => {
    direction.current = nextDirection.current;
    
    const head = snake.current[0];
    let newHead: Position;

    switch (direction.current) {
      case "UP":
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case "DOWN":
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case "LEFT":
        newHead = { x: head.x - 1, y: head.y };
        break;
      case "RIGHT":
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setGameState("gameOver");
      if (score > highScore) setHighScore(score);
      return;
    }

    // Check self collision
    if (snake.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameState("gameOver");
      if (score > highScore) setHighScore(score);
      return;
    }

    snake.current = [newHead, ...snake.current];

    // Check food collision
    if (newHead.x === food.current.x && newHead.y === food.current.y) {
      setScore(prev => prev + 10);
      generateFood();
    } else {
      snake.current.pop();
    }

    // Draw
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#1a1a1a";
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.current.x * CELL_SIZE + 2, food.current.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Draw snake
    snake.current.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        (segment.x + 1) * CELL_SIZE,
        (segment.y + 1) * CELL_SIZE
      );
      gradient.addColorStop(0, index === 0 ? "#22d3ee" : "#06b6d4");
      gradient.addColorStop(1, index === 0 ? "#06b6d4" : "#0891b2");
      ctx.fillStyle = gradient;
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });
  }, [score, highScore, generateFood]);

  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = setInterval(gameLoop, 100);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (direction.current !== "DOWN") nextDirection.current = "UP";
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
          if (direction.current !== "UP") nextDirection.current = "DOWN";
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
          if (direction.current !== "RIGHT") nextDirection.current = "LEFT";
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
          if (direction.current !== "LEFT") nextDirection.current = "RIGHT";
          e.preventDefault();
          break;
        case " ":
          pauseGame();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">Snake Game</h1>
        <div className="flex gap-6 justify-center text-white">
          <div>Score: <span className="text-cyan-400 font-bold">{score}</span></div>
          <div>High Score: <span className="text-purple-400 font-bold">{highScore}</span></div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="border-2 border-cyan-400/30 rounded-lg shadow-2xl"
      />

      <div className="mt-6 space-y-3">
        {gameState === "idle" && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition"
          >
            Start Game
          </button>
        )}

        {gameState === "playing" && (
          <button
            onClick={pauseGame}
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Pause (Space)
          </button>
        )}

        {gameState === "paused" && (
          <button
            onClick={pauseGame}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Resume (Space)
          </button>
        )}

        {gameState === "gameOver" && (
          <div className="text-center space-y-3">
            <p className="text-red-400 text-xl font-bold">Game Over!</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition"
            >
              Play Again
            </button>
          </div>
        )}

        <p className="text-gray-400 text-sm text-center mt-4">
          Use Arrow Keys or WASD to move | Space to pause
        </p>
      </div>
    </div>
  );
}

export default SnakeGameApp;
