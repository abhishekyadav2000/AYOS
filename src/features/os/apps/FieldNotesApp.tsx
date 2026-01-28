'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { fieldNotesConfig } from '@/config/content';

interface FieldNote {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export function FieldNotesApp() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    fieldNotesConfig[0]?.id || null
  );

  const selectedNote = fieldNotesConfig.find((n) => n.id === selectedNoteId);
  const currentIndex = fieldNotesConfig.findIndex((n) => n.id === selectedNoteId);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedNoteId(fieldNotesConfig[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < fieldNotesConfig.length - 1) {
      setSelectedNoteId(fieldNotesConfig[currentIndex + 1].id);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 to-blue-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">📖 Field Notes</h1>
          <p className="text-xs text-gray-400">Personal stories and reflections</p>
        </div>
        <button className="px-3 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white">
          ✕
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Notes list sidebar */}
        <div className="w-48 flex flex-col border border-white/10 rounded-lg bg-black/20 overflow-y-auto">
          {fieldNotesConfig.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`text-left px-4 py-3 border-b border-white/5 hover:bg-white/10 transition ${
                selectedNoteId === note.id
                  ? 'bg-white/20 border-l-2 border-l-cyan-400'
                  : ''
              }`}
            >
              <div className="text-sm font-medium text-white truncate">
                {note.title}
              </div>
              <div className="text-xs text-gray-400 mt-1">{note.date}</div>
              <div className="text-xs text-cyan-400/70 mt-1 flex flex-wrap gap-1">
                {note.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-cyan-500/20 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Note content */}
        <div className="flex-1 flex flex-col border border-white/10 rounded-lg bg-black/20 overflow-hidden">
          {selectedNote ? (
            <>
              <div className="border-b border-white/10 p-4">
                <h2 className="text-2xl font-bold text-white">{selectedNote.title}</h2>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>{selectedNote.date}</span>
                  <span>•</span>
                  <div className="flex gap-1">
                    {selectedNote.tags.map((tag) => (
                      <span key={tag} className="text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="prose prose-invert max-w-none text-white/80 text-sm leading-relaxed">
                  {selectedNote.content.split('\n').map((paragraph, idx) => (
                    <div key={idx} className="mb-3">
                      {paragraph}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="border-t border-white/10 p-4 flex justify-between items-center bg-black/20">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="p-2 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>

                <div className="text-xs text-gray-400">
                  {currentIndex + 1} / {fieldNotesConfig.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === fieldNotesConfig.length - 1}
                  className="p-2 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No notes yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
