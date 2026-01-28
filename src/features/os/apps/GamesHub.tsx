'use client';

import React, { useState } from 'react';
import { X, Gamepad2, Trophy } from 'lucide-react';
import { useWindowStore } from '../state/useWindowStore';
import { useAYOSGlobal } from '../state/useAYOSGlobal';
import type { AppId } from './registry';

interface GameDefinition {
  id: string;
  title: string;
  icon: string;
  description: string;
  appId: AppId;
}

const GAMES: GameDefinition[] = [
  {
    id: 'snake',
    title: 'Snake',
    icon: '🐍',
    description: 'Classic snake game. Eat food, grow, don\'t hit walls!',
    appId: 'snake',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: '💣',
    description: 'Classic puzzle game. Find all mines without hitting one!',
    appId: 'minesweeper',
  },
  {
    id: 'memory',
    title: 'Memory',
    icon: '🧠',
    description: 'Match pairs of cards. Test your memory!',
    appId: 'memory',
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    icon: '⭕',
    description: 'Play against AI. Can you win?',
    appId: 'tic-tac-toe',
  },
  {
    id: '2048',
    title: '2048',
    icon: '🔢',
    description: 'Slide tiles to combine numbers and reach 2048!',
    appId: '2048',
  },
];

interface GamesHubProps {
  onClose: () => void;
}

export function GamesHub({ onClose }: GamesHubProps) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const { scores } = useAYOSGlobal();

  const handleGameClick = (game: GameDefinition) => {
    openWindow(game.appId);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 to-red-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">🎮 Games Hub</h1>
          <p className="text-xs text-gray-400">Play and compete for high scores</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => handleGameClick(game)}
              className="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-lg transition-all text-left hover:scale-105 transform duration-200"
            >
              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{game.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{game.description}</p>
              {scores[game.id] && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1 text-yellow-400 text-xs">
                  <Trophy size={12} />
                  {scores[game.id]}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 bg-black/20 text-center text-sm text-gray-500">
        <p>Click any game to play. High scores saved automatically.</p>
      </div>
    </div>
  );
}
