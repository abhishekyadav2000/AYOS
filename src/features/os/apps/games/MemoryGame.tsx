'use client';

import React, { useState, useEffect } from 'react';
import { X, RotateCw } from 'lucide-react';
import { useAYOSGlobal } from '../../state/useAYOSGlobal';

const CARD_COUNT = 16;

interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onClose: () => void;
}

const SYMBOLS = ['🌟', '🎨', '🎭', '🎪', '🎬', '🎸', '🎹', '🎺'];

export function MemoryGame({ onClose }: MemoryGameProps) {
  const { setScore, scores } = useAYOSGlobal();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for match
  useEffect(() => {
    if (flipped.length !== 2) return;

    const [first, second] = flipped;
    if (cards[first].symbol === cards[second].symbol) {
      // Match!
      const newCards = cards.map((card, idx) =>
        idx === first || idx === second ? { ...card, isMatched: true } : card
      );
      setCards(newCards);
      setMatches(m => {
        const newMatches = m + 1;
        if (newMatches === CARD_COUNT / 2) {
          setGameWon(true);
          setScore('memory', Math.max(0, 100 - moves * 2));
        }
        return newMatches;
      });
    }
    setMoves(m => m + 1);
    setTimeout(() => setFlipped([]), 600);
  }, [flipped, cards, moves, setScore]);

  const initializeGame = () => {
    const symbols = [...SYMBOLS, ...SYMBOLS];
    const shuffled = symbols.sort(() => Math.random() - 0.5);
    const newCards = shuffled.map((symbol, idx) => ({
      id: idx,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setMoves(0);
    setMatches(0);
    setFlipped([]);
    setGameWon(false);
  };

  const handleCardClick = (idx: number) => {
    if (flipped.length === 2) return;
    if (cards[idx].isMatched || flipped.includes(idx)) return;

    setFlipped([...flipped, idx]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">🧠 Memory Game</h1>
          <p className="text-xs text-gray-400">Match all pairs to win</p>
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
            <p className="text-xs text-gray-400">Moves</p>
            <p className="text-lg font-bold text-cyan-400">{moves}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Matches</p>
            <p className="text-lg font-bold text-green-400">{matches}/{CARD_COUNT / 2}</p>
          </div>
        </div>
        {gameWon && <p className="text-green-400 font-bold">🎉 You Won!</p>}
        <button
          onClick={initializeGame}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RotateCw size={16} />
          New Game
        </button>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-4 gap-3 bg-gray-900 p-6 rounded-lg border border-white/20">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg border-2 transition-all transform hover:scale-105 ${
                flipped.includes(idx) || card.isMatched
                  ? 'bg-purple-600 border-purple-400'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
            >
              {flipped.includes(idx) || card.isMatched ? card.symbol : '?'}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 bg-black/20 text-center text-xs text-gray-400">
        <p>Click cards to find matching pairs • Score depends on speed!</p>
      </div>
    </div>
  );
}
