"use client";

import React, { useEffect, useRef, useState } from "react";
import { Trophy, RotateCcw, Play } from "lucide-react";

type GameState = "IDLE" | "RUNNING" | "GAME_OVER";

interface GameStats {
  score: number;
  highScore: number;
}

export default function DinoRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [stats, setStats] = useState<GameStats>({ score: 0, highScore: 0 });
  const gameLoopRef = useRef<number | null>(null);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("dino-highscore");
    if (savedHighScore) {
      setStats((prev) => ({ ...prev, highScore: parseInt(savedHighScore) }));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const config = {
      gravity: 0.6,
      jumpVelocity: -12,
      groundY: canvas.height - 80,
      gameSpeed: 6,
      obstacleSpawnRate: 120,
    };

    const player = {
      x: 80,
      y: config.groundY,
      width: 40,
      height: 50,
      velocityY: 0,
      isJumping: false,
      isDucking: false,
      
      jump() {
        if (!this.isJumping) {
          this.velocityY = config.jumpVelocity;
          this.isJumping = true;
        }
      },

      duck(isDucking: boolean) {
        this.isDucking = isDucking;
        this.height = isDucking ? 30 : 50;
      },

      update() {
        this.velocityY += config.gravity;
        this.y += this.velocityY;

        if (this.y >= config.groundY) {
          this.y = config.groundY;
          this.velocityY = 0;
          this.isJumping = false;
        }
      },

      draw(ctx: CanvasRenderingContext2D) {
        const isDucking = this.isDucking;
        
        // Body
        ctx.fillStyle = "#00ff00";
        const bodyHeight = isDucking ? 20 : 30;
        const bodyY = isDucking ? this.y + 10 : this.y + 15;
        ctx.fillRect(this.x + 5, bodyY, 30, bodyHeight);
        
        // Head
        if (!isDucking) {
          ctx.fillRect(this.x + 25, this.y, 15, 18);
          
          // Eye
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(this.x + 32, this.y + 5, 4, 4);
          ctx.fillStyle = "#000000";
          ctx.fillRect(this.x + 33, this.y + 6, 2, 2);
          
          // Mouth
          ctx.fillStyle = "#000000";
          ctx.fillRect(this.x + 37, this.y + 13, 3, 2);
        }
        
        // Tail
        ctx.fillStyle = "#00ff00";
        const tailY = isDucking ? bodyY + 5 : bodyY + 10;
        ctx.fillRect(this.x, tailY, 8, 10);
        ctx.fillRect(this.x - 3, tailY + 3, 5, 5);
        
        // Legs
        const legY = bodyY + bodyHeight;
        ctx.fillRect(this.x + 10, legY, 6, 10);
        ctx.fillRect(this.x + 24, legY, 6, 10);
        
        // Feet
        ctx.fillRect(this.x + 8, legY + 10, 10, 3);
        ctx.fillRect(this.x + 22, legY + 10, 10, 3);
        
        // Arms (small T-Rex arms)
        if (!isDucking) {
          ctx.fillRect(this.x + 12, bodyY + 5, 4, 8);
          ctx.fillRect(this.x + 28, bodyY + 5, 4, 8);
        }
      },

      reset() {
        this.y = config.groundY;
        this.velocityY = 0;
        this.isJumping = false;
        this.isDucking = false;
        this.height = 50;
      },
    };

    const obstacles: any[] = [];
    let obstacleTimer = 0;

    const createObstacle = () => {
      const types = ["cactus", "pterodactyl"];
      const type = types[Math.floor(Math.random() * types.length)];
      
      obstacles.push({
        x: canvas.width,
        y: type === "cactus" ? config.groundY : config.groundY - 50,
        width: type === "cactus" ? 20 : 40,
        height: type === "cactus" ? 40 : 30,
        type,
        speed: config.gameSpeed,
      });
    };

    const checkCollision = (player: any, obstacle: any) => {
      return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
      );
    };

    let score = 0;
    let frameCount = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === "IDLE" || gameState === "GAME_OVER") {
        if (e.code === "Space" || e.code === "ArrowUp") {
          e.preventDefault();
          startGame();
        }
      } else if (gameState === "RUNNING") {
        if (e.code === "Space" || e.code === "ArrowUp") {
          e.preventDefault();
          player.jump();
        } else if (e.code === "ArrowDown") {
          e.preventDefault();
          player.duck(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        player.duck(false);
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (gameState === "IDLE" || gameState === "GAME_OVER") {
        startGame();
      } else if (gameState === "RUNNING") {
        player.jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouch);

    const startGame = () => {
      setGameState("RUNNING");
      player.reset();
      obstacles.length = 0;
      score = 0;
      obstacleTimer = 0;
      frameCount = 0;
    };

    const gameLoop = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, config.groundY + player.height);
      ctx.lineTo(canvas.width, config.groundY + player.height);
      ctx.stroke();

      if (gameState === "RUNNING") {
        frameCount++;
        
        player.update();

        obstacleTimer++;
        if (obstacleTimer > config.obstacleSpawnRate) {
          createObstacle();
          obstacleTimer = 0;
          config.obstacleSpawnRate = Math.max(60, 120 - Math.floor(score / 100));
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obstacle = obstacles[i];
          obstacle.x -= obstacle.speed;

          if (obstacle.type === "cactus") {
            // Draw cactus
            ctx.fillStyle = "#22aa22";
            // Main trunk
            ctx.fillRect(obstacle.x + 6, obstacle.y, 8, obstacle.height);
            // Left arm
            ctx.fillRect(obstacle.x + 2, obstacle.y + obstacle.height / 3, 6, 12);
            ctx.fillRect(obstacle.x + 2, obstacle.y + obstacle.height / 3, 4, 4);
            // Right arm
            ctx.fillRect(obstacle.x + 12, obstacle.y + obstacle.height / 2, 6, 10);
            ctx.fillRect(obstacle.x + 14, obstacle.y + obstacle.height / 2, 4, 4);
          } else {
            // Draw pterodactyl
            ctx.fillStyle = "#ff8800";
            // Body
            ctx.fillRect(obstacle.x + 8, obstacle.y + 10, 24, 10);
            // Head
            ctx.fillRect(obstacle.x + 28, obstacle.y + 8, 12, 8);
            // Beak
            ctx.fillRect(obstacle.x + 38, obstacle.y + 10, 6, 4);
            // Wings (animated up/down based on frame)
            const wingOffset = Math.floor(frameCount / 10) % 2 === 0 ? -5 : 5;
            ctx.fillRect(obstacle.x, obstacle.y + 10 + wingOffset, 18, 4);
            ctx.fillRect(obstacle.x + 20, obstacle.y + 10 + wingOffset, 18, 4);
          }

          if (checkCollision(player, obstacle)) {
            setGameState("GAME_OVER");
            
            const currentHighScore = stats.highScore;
            if (score > currentHighScore) {
              localStorage.setItem("dino-highscore", score.toString());
              setStats({ score, highScore: score });
            } else {
              setStats((prev) => ({ ...prev, score }));
            }
            return;
          }

          if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
          }
        }

        config.gameSpeed = 6 + Math.floor(score / 500);

        if (frameCount % 5 === 0) {
          score++;
        }
        setStats((prev) => ({ ...prev, score }));
      }

      player.draw(ctx);

      ctx.fillStyle = "#ffffff";
      ctx.font = "20px monospace";
      ctx.fillText(`Score: ${score}`, 20, 30);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameRef.current = { startGame };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("resize", resizeCanvas);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, stats.highScore]);

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-900">
      <div className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-lg">Score:</span>
            <span className="text-white font-bold text-xl">{stats.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 font-mono">High Score:</span>
            <span className="text-yellow-400 font-bold text-xl">{stats.highScore}</span>
          </div>
        </div>
        
        {gameState === "RUNNING" && (
          <div className="text-gray-400 text-sm">
            Press <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> to jump, 
            <kbd className="px-2 py-1 bg-white/10 rounded ml-1">↓</kbd> to duck
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ touchAction: "none" }}
        />

        {gameState !== "RUNNING" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              {gameState === "IDLE" && (
                <>
                  <h2 className="text-4xl font-bold text-white mb-4">🦖 Dino Runner</h2>
                  <p className="text-gray-300 mb-6">Jump over obstacles and survive as long as you can!</p>
                  <button
                    onClick={() => gameRef.current?.startGame()}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    Start Game
                  </button>
                  <div className="mt-6 text-gray-400 text-sm">
                    <p>Desktop: <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> or <kbd className="px-2 py-1 bg-white/10 rounded">↑</kbd> to jump</p>
                    <p className="mt-1">Mobile: Tap to jump</p>
                  </div>
                </>
              )}

              {gameState === "GAME_OVER" && (
                <>
                  <h2 className="text-4xl font-bold text-red-400 mb-4">Game Over!</h2>
                  <div className="mb-6">
                    <p className="text-xl text-white mb-2">Score: {stats.score}</p>
                    {stats.score === stats.highScore && stats.score > 0 && (
                      <p className="text-yellow-400 flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5" />
                        New High Score!
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => gameRef.current?.startGame()}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all mx-auto"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
