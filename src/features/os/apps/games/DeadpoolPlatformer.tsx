'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  velocityX: number;
  isJumping: boolean;
  isDucking: boolean;
  isFacingLeft: boolean;
  lives: number;
  score: number;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  leftBound: number;
  rightBound: number;
  active: boolean;
}

interface Collectible {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'platform' | 'hazard';
}

interface GameState {
  status: 'MENU' | 'PLAYING' | 'PAUSED' | 'LEVEL_COMPLETE' | 'GAME_OVER' | 'BOOT';
  level: number;
  score: number;
  highScore: number;
}

const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const MOVE_SPEED = 5;
const LEVEL_WIDTH = 2000;
const LEVEL_HEIGHT = 600;

export default function DeadpoolPlatformer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    status: 'MENU',
    level: 1,
    score: 0,
    highScore: parseInt(localStorage.getItem('deadpool-highscore') || '0', 10),
  });

  const playerRef = useRef<Player>({
    x: 50,
    y: 400,
    width: 32,
    height: 48,
    velocityY: 0,
    velocityX: 0,
    isJumping: false,
    isDucking: false,
    isFacingLeft: false,
    lives: 3,
    score: 0,
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const cameraRef = useRef({ x: 0, y: 0 });
  const enemiesRef = useRef<Enemy[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const platformsRef = useRef<Platform[]>([]);
  const frameCountRef = useRef(0);

  // Load level data
  const loadLevel = (levelNum: number) => {
    const levels: { [key: number]: { platforms: Platform[]; enemies: Enemy[]; collectibles: Collectible[] } } = {
      1: {
        platforms: [
          // Ground
          { x: 0, y: 550, width: 2000, height: 50, type: 'ground' },
          // Platform sequence
          { x: 200, y: 450, width: 150, height: 20, type: 'platform' },
          { x: 450, y: 380, width: 150, height: 20, type: 'platform' },
          { x: 700, y: 320, width: 150, height: 20, type: 'platform' },
          { x: 950, y: 380, width: 150, height: 20, type: 'platform' },
          { x: 1200, y: 450, width: 150, height: 20, type: 'platform' },
          // Hazard zone
          { x: 1400, y: 500, width: 100, height: 20, type: 'hazard' },
          { x: 1520, y: 500, width: 100, height: 20, type: 'hazard' },
          // Final platform
          { x: 1700, y: 400, width: 200, height: 20, type: 'platform' },
        ],
        enemies: [
          { x: 450, y: 350, width: 40, height: 40, velocityX: 2, leftBound: 400, rightBound: 550, active: true },
          { x: 950, y: 350, width: 40, height: 40, velocityX: -2, leftBound: 900, rightBound: 1050, active: true },
        ],
        collectibles: [
          { x: 220, y: 410, width: 16, height: 16, collected: false },
          { x: 470, y: 340, width: 16, height: 16, collected: false },
          { x: 720, y: 280, width: 16, height: 16, collected: false },
          { x: 970, y: 340, width: 16, height: 16, collected: false },
          { x: 1220, y: 410, width: 16, height: 16, collected: false },
          { x: 1750, y: 360, width: 16, height: 16, collected: false },
        ],
      },
      2: {
        platforms: [
          // Ground
          { x: 0, y: 550, width: 2000, height: 50, type: 'ground' },
          // More complex platforming
          { x: 150, y: 480, width: 120, height: 20, type: 'platform' },
          { x: 350, y: 400, width: 120, height: 20, type: 'platform' },
          { x: 550, y: 320, width: 120, height: 20, type: 'platform' },
          { x: 750, y: 240, width: 120, height: 20, type: 'platform' },
          { x: 950, y: 320, width: 120, height: 20, type: 'platform' },
          { x: 1150, y: 400, width: 120, height: 20, type: 'platform' },
          { x: 1350, y: 480, width: 120, height: 20, type: 'platform' },
          // Hazard cluster
          { x: 1500, y: 500, width: 80, height: 20, type: 'hazard' },
          { x: 1600, y: 500, width: 80, height: 20, type: 'hazard' },
          { x: 1700, y: 450, width: 120, height: 20, type: 'platform' },
        ],
        enemies: [
          { x: 400, y: 360, width: 40, height: 40, velocityX: 3, leftBound: 350, rightBound: 600, active: true },
          { x: 800, y: 280, width: 40, height: 40, velocityX: -3, leftBound: 700, rightBound: 850, active: true },
          { x: 1200, y: 360, width: 40, height: 40, velocityX: 2, leftBound: 1100, rightBound: 1400, active: true },
        ],
        collectibles: [
          { x: 170, y: 440, width: 16, height: 16, collected: false },
          { x: 370, y: 360, width: 16, height: 16, collected: false },
          { x: 570, y: 280, width: 16, height: 16, collected: false },
          { x: 770, y: 200, width: 16, height: 16, collected: false },
          { x: 970, y: 280, width: 16, height: 16, collected: false },
          { x: 1170, y: 360, width: 16, height: 16, collected: false },
          { x: 1370, y: 440, width: 16, height: 16, collected: false },
          { x: 1750, y: 410, width: 16, height: 16, collected: false },
        ],
      },
    };

    const level = levels[levelNum] || levels[1];
    platformsRef.current = level.platforms;
    enemiesRef.current = level.enemies;
    collectiblesRef.current = level.collectibles;
  };

  // Draw Deadpool sprite (pixel art style)
  const drawDeadpool = (ctx: CanvasRenderingContext2D, x: number, y: number, facingLeft: boolean) => {
    ctx.save();
    ctx.translate(x + 16, y);
    if (facingLeft) ctx.scale(-1, 1);

    const px = 2; // Pixel size for pixel art effect

    // Helper function to draw pixel blocks
    const drawPixel = (px_x: number, px_y: number, width: number, height: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(px_x * px, px_y * px, width * px, height * px);
    };

    // Head - Red with black outlines (mask style)
    drawPixel(-6, -12, 12, 10, '#E63946');
    
    // Black mask areas (eyes)
    drawPixel(-5, -11, 3, 5, '#1A1A1A');
    drawPixel(2, -11, 3, 5, '#1A1A1A');

    // White eye areas (deadpool's signature look)
    drawPixel(-4, -10, 2, 3, '#FFFFFF');
    drawPixel(3, -10, 2, 3, '#FFFFFF');

    // Black pupils
    drawPixel(-3, -9, 1, 1, '#000000');
    drawPixel(4, -9, 1, 1, '#000000');

    // Red mask mouth line
    drawPixel(-2, -6, 4, 1, '#8B0000');

    // Head top highlight (yellow)
    drawPixel(-5, -13, 2, 1, '#FFD700');
    drawPixel(3, -13, 2, 1, '#FFD700');

    // Body - Red suit
    drawPixel(-6, -2, 12, 8, '#E63946');

    // Black body outline/details
    drawPixel(-6, 2, 12, 2, '#1A1A1A');

    // Arms - Red
    drawPixel(-9, 0, 3, 6, '#E63946');
    drawPixel(6, 0, 3, 6, '#E63946');

    // Brown gloves/hands
    drawPixel(-10, 5, 2, 2, '#8B6F47');
    drawPixel(8, 5, 2, 2, '#8B6F47');

    // Belt - Brown/Gold
    drawPixel(-6, 3, 3, 1, '#A89968');
    drawPixel(3, 3, 3, 1, '#A89968');

    // Belt buckles
    drawPixel(-5, 3, 1, 1, '#FFD700');
    drawPixel(4, 3, 1, 1, '#FFD700');

    // Legs - Red
    drawPixel(-5, 6, 4, 6, '#E63946');
    drawPixel(1, 6, 4, 6, '#E63946');

    // Boots - Black
    drawPixel(-5, 11, 4, 2, '#1A1A1A');
    drawPixel(1, 11, 4, 2, '#1A1A1A');

    // Sword/Katana on back (right side)
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14 * px, -8 * px);
    ctx.lineTo(18 * px, 8 * px);
    ctx.stroke();

    // Sword handle
    drawPixel(17, 6, 1, 3, '#8B6F47');

    // Sword blade highlight
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(15 * px, -6 * px);
    ctx.lineTo(17 * px, 6 * px);
    ctx.stroke();

    ctx.restore();
  };

  // Draw game
  const draw = (ctx: CanvasRenderingContext2D) => {
    const player = playerRef.current;

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 800, 600);

    // Background parallax
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 3; i++) {
      const cloudX = (i * 300 - cameraRef.current.x * 0.3) % 800;
      ctx.fillRect(cloudX, 50 + i * 100, 200, 40);
    }

    // Update camera to follow player
    cameraRef.current.x = Math.max(0, Math.min(player.x - 200, LEVEL_WIDTH - 800));
    cameraRef.current.y = 0;

    ctx.save();
    ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

    // Draw platforms
    platformsRef.current.forEach((platform) => {
      if (platform.type === 'ground') {
        ctx.fillStyle = '#228B22';
      } else if (platform.type === 'hazard') {
        ctx.fillStyle = '#FF4500';
      } else {
        ctx.fillStyle = '#8B4513';
      }
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

      // Platform border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw collectibles
    collectiblesRef.current.forEach((collectible) => {
      if (!collectible.collected) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(collectible.x + 8, collectible.y + 8, 8, 0, Math.PI * 2);
        ctx.fill();

        // Star
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(collectible.x + 8, collectible.y + 8, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw enemies
    enemiesRef.current.forEach((enemy) => {
      if (enemy.active) {
        // Enemy body (simple skeleton)
        ctx.fillStyle = '#8B008B';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Enemy eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(enemy.x + 8, enemy.y + 8, 6, 6);
        ctx.fillRect(enemy.x + 26, enemy.y + 8, 6, 6);

        // Enemy border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
    });

    // Draw player (Deadpool)
    drawDeadpool(ctx, player.x, player.y, player.isFacingLeft);

    // Draw finish flag
    const finishX = 1800;
    const finishY = 350;
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(finishX - 5, finishY, 10, 100);
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(finishX + 5, finishY);
    ctx.lineTo(finishX + 5, finishY + 30);
    ctx.lineTo(finishX + 35, finishY + 15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Draw HUD
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${player.score}`, 20, 30);
    ctx.fillText(`Lives: ${player.lives}`, 20, 60);
    ctx.fillText(`Level: ${gameState.level}`, 20, 90);
    ctx.fillText(`High Score: ${gameState.highScore}`, 600, 30);
  };

  // Update game physics
  const update = () => {
    const player = playerRef.current;

    // Horizontal movement
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A']) {
      player.velocityX = -MOVE_SPEED;
      player.isFacingLeft = true;
    } else if (keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D']) {
      player.velocityX = MOVE_SPEED;
      player.isFacingLeft = false;
    } else {
      player.velocityX = 0;
    }

    // Jumping
    if ((keysPressed.current[' '] || keysPressed.current['w'] || keysPressed.current['W'] || keysPressed.current['ArrowUp']) && !player.isJumping) {
      player.velocityY = JUMP_STRENGTH;
      player.isJumping = true;
    }

    // Apply gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    player.x += player.velocityX;

    // Boundary check
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > LEVEL_WIDTH) player.x = LEVEL_WIDTH - player.width;

    // Platform collision
    let onGround = false;
    platformsRef.current.forEach((platform) => {
      // Check if player is above platform and falling
      if (
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.y + player.height >= platform.y &&
        player.y + player.height <= platform.y + platform.height + 10 &&
        player.velocityY >= 0
      ) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        onGround = true;

        // Hazard collision
        if (platform.type === 'hazard') {
          player.lives--;
          if (player.lives <= 0) {
            setGameState((prev) => ({ ...prev, status: 'GAME_OVER' }));
          } else {
            player.x = 50;
            player.y = 400;
          }
        }
      }
    });

    // Enemy collision
    enemiesRef.current.forEach((enemy) => {
      if (enemy.active) {
        // Update enemy position
        enemy.x += enemy.velocityX;
        if (enemy.x <= enemy.leftBound || enemy.x + enemy.width >= enemy.rightBound) {
          enemy.velocityX *= -1;
        }

        // Check collision with player
        if (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
        ) {
          // If player jumps on enemy from above
          if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y + 10) {
            enemy.active = false;
            player.velocityY = JUMP_STRENGTH * 0.7;
            player.score += 100;
          } else {
            // Enemy collision from side
            player.lives--;
            if (player.lives <= 0) {
              setGameState((prev) => ({ ...prev, status: 'GAME_OVER' }));
            } else {
              player.x = 50;
              player.y = 400;
            }
          }
        }
      }
    });

    // Collectible collision
    collectiblesRef.current.forEach((collectible) => {
      if (!collectible.collected) {
        if (
          player.x < collectible.x + collectible.width &&
          player.x + player.width > collectible.x &&
          player.y < collectible.y + collectible.height &&
          player.y + player.height > collectible.y
        ) {
          collectible.collected = true;
          player.score += 50;
        }
      }
    });

    // Finish line collision
    const finishX = 1800;
    const finishY = 350;
    if (player.x + player.width > finishX - 20 && player.x < finishX + 20 && player.y < finishY + 100) {
      if (gameState.level < 2) {
        setGameState((prev) => ({ ...prev, status: 'LEVEL_COMPLETE' }));
      } else {
        setGameState((prev) => ({ ...prev, status: 'LEVEL_COMPLETE' }));
      }
    }

    // Game over if fell off map
    if (player.y > LEVEL_HEIGHT) {
      player.lives--;
      if (player.lives <= 0) {
        setGameState((prev) => ({ ...prev, status: 'GAME_OVER' }));
      } else {
        player.x = 50;
        player.y = 400;
      }
    }
  };

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = Date.now();

    const gameLoop = () => {
      if (gameState.status === 'PLAYING') {
        update();
        frameCountRef.current++;
      }

      draw(ctx);
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId);
  }, [gameState.status]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;

      if (e.key === 'p' || e.key === 'P') {
        setGameState((prev) => ({
          ...prev,
          status: prev.status === 'PLAYING' ? 'PAUSED' : 'PLAYING',
        }));
      }

      if (e.key === 'r' || e.key === 'R') {
        resetGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const resetGame = () => {
    playerRef.current = {
      x: 50,
      y: 400,
      width: 32,
      height: 48,
      velocityY: 0,
      velocityX: 0,
      isJumping: false,
      isDucking: false,
      isFacingLeft: false,
      lives: 3,
      score: 0,
    };
    loadLevel(1);
    setGameState((prev) => ({ ...prev, status: 'MENU', level: 1 }));
  };

  const startGame = () => {
    playerRef.current.lives = 3;
    playerRef.current.score = 0;
    playerRef.current.x = 50;
    playerRef.current.y = 400;
    loadLevel(gameState.level);
    setGameState((prev) => ({ ...prev, status: 'PLAYING' }));
  };

  const nextLevel = () => {
    const nextLevelNum = gameState.level + 1;
    if (nextLevelNum <= 2) {
      setGameState((prev) => ({ ...prev, level: nextLevelNum }));
      playerRef.current.x = 50;
      playerRef.current.y = 400;
      playerRef.current.lives = 3;
      loadLevel(nextLevelNum);
      setGameState((prev) => ({ ...prev, status: 'PLAYING' }));
    } else {
      // Victory!
      const newHighScore = Math.max(gameState.highScore, playerRef.current.score);
      localStorage.setItem('deadpool-highscore', newHighScore.toString());
      setGameState((prev) => ({ ...prev, highScore: newHighScore, status: 'MENU' }));
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-red-600 rounded-lg shadow-2xl bg-sky-300"
        />

        {/* Menu overlay */}
        {gameState.status === 'MENU' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur">
            <h1 className="text-5xl font-black text-red-600 mb-4 text-center">DEADPOOL PLATFORMER</h1>
            <p className="text-white text-lg mb-8 text-center max-w-xs">
              Jump, collect coins, defeat enemies, and reach the flag!
            </p>
            <p className="text-yellow-300 text-sm mb-6 text-center">
              Level {gameState.level} | High Score: {gameState.highScore}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-lg flex items-center gap-2 transition"
            >
              <Play size={24} /> START GAME
            </button>
          </div>
        )}

        {/* Pause overlay */}
        {gameState.status === 'PAUSED' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur">
            <h2 className="text-4xl font-black text-yellow-300 mb-8">PAUSED</h2>
            <button
              onClick={() => setGameState((prev) => ({ ...prev, status: 'PLAYING' }))}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg flex items-center gap-2 mb-4 transition"
            >
              <Play size={20} /> RESUME
            </button>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg flex items-center gap-2 transition"
            >
              <RotateCcw size={20} /> RESTART
            </button>
          </div>
        )}

        {/* Level complete overlay */}
        {gameState.status === 'LEVEL_COMPLETE' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur">
            <h2 className="text-4xl font-black text-green-400 mb-4">LEVEL COMPLETE!</h2>
            <p className="text-white text-2xl mb-8">Score: {playerRef.current.score}</p>
            {gameState.level < 2 ? (
              <button
                onClick={nextLevel}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg flex items-center gap-2 transition"
              >
                NEXT LEVEL
              </button>
            ) : (
              <>
                <p className="text-yellow-300 text-xl mb-6">🎉 YOU WIN! 🎉</p>
                <button
                  onClick={resetGame}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg flex items-center gap-2 transition"
                >
                  PLAY AGAIN
                </button>
              </>
            )}
          </div>
        )}

        {/* Game over overlay */}
        {gameState.status === 'GAME_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur">
            <h2 className="text-4xl font-black text-red-600 mb-4">GAME OVER</h2>
            <p className="text-white text-2xl mb-8">Final Score: {playerRef.current.score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg flex items-center gap-2 transition"
            >
              <RotateCcw size={20} /> TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Controls info */}
      <div className="mt-6 text-white text-sm text-center max-w-md">
        <p className="font-bold mb-2">⌨️ CONTROLS</p>
        <p>← → or A/D: Move | SPACE/W/↑: Jump | P: Pause | R: Restart</p>
      </div>
    </div>
  );
}
