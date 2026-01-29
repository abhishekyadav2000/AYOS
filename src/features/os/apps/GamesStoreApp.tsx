"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Play, Trophy, Info } from "lucide-react";
import DinoRunnerGame from "./games/DinoRunnerGame";

export default function GamesStoreApp() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: "dino-runner",
      name: "Dino Runner",
      description: "Classic endless runner game. Jump over obstacles and beat your high score!",
      icon: "🦖",
      component: DinoRunnerGame,
    },
  ];

  if (selectedGame) {
    const game = games.find((g) => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Game Header */}
          <div className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{game.icon}</span>
              <div>
                <h2 className="text-white font-semibold">{game.name}</h2>
                <p className="text-gray-400 text-sm">{game.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedGame(null)}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
            >
              Exit Game
            </button>
          </div>

          {/* Game Container */}
          <div className="flex-1 overflow-hidden">
            <GameComponent />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Store Header */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Games Store</h1>
          </div>
          <p className="text-gray-400">Play games directly in your browser</p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:border-cyan-500/50 overflow-hidden transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedGame(game.id)}
            >
              {/* Game Card */}
              <div className="p-6">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-5xl">{game.icon}</span>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {game.description}
                </p>

                {/* Play Button */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/50">
                  <Play className="w-4 h-4" />
                  Play Now
                </button>
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                Free
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Play className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Instant Play</h4>
              <p className="text-gray-400 text-sm">
                No downloads needed, play directly in your browser
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">High Scores</h4>
              <p className="text-gray-400 text-sm">
                Track your progress and beat your best scores
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Info className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">No Installation</h4>
              <p className="text-gray-400 text-sm">
                All games run securely in your browser sandbox
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
