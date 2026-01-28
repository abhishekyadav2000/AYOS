'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Users, DollarSign, CheckCircle } from 'lucide-react';

interface Session {
  id: string;
  type: 'consultation' | 'workshop' | 'mentorship';
  date: string;
  time: string;
  duration: number;
  status: 'available' | 'booked' | 'completed';
  price: number;
  capacity: number;
  attendees: number;
}

const SESSION_TYPES = [
  { id: 'consultation', label: '1-on-1 Consultation', price: 75, duration: 60 },
  { id: 'workshop', label: 'Group Workshop', price: 200, duration: 120 },
  { id: 'mentorship', label: 'Mentorship Session', price: 100, duration: 90 },
];

const AVAILABLE_SESSIONS: Session[] = [
  {
    id: '1',
    type: 'consultation',
    date: '2025-01-30',
    time: '10:00',
    duration: 60,
    status: 'available',
    price: 75,
    capacity: 1,
    attendees: 0,
  },
  {
    id: '2',
    type: 'consultation',
    date: '2025-01-30',
    time: '14:00',
    duration: 60,
    status: 'booked',
    price: 75,
    capacity: 1,
    attendees: 1,
  },
  {
    id: '3',
    type: 'workshop',
    date: '2025-02-01',
    time: '18:00',
    duration: 120,
    status: 'available',
    price: 200,
    capacity: 20,
    attendees: 3,
  },
  {
    id: '4',
    type: 'mentorship',
    date: '2025-02-02',
    time: '11:00',
    duration: 90,
    status: 'available',
    price: 100,
    capacity: 1,
    attendees: 0,
  },
];

interface SessionsAppProps {
  onClose: () => void;
}

export function SessionsApp({ onClose }: SessionsAppProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'booked' | 'completed'>('browse');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });

  const bookedSessions = AVAILABLE_SESSIONS.filter(s => s.status === 'booked');

  const handleBookSession = (session: Session) => {
    setSelectedSession(session);
    setShowBookingForm(true);
  };

  const submitBooking = () => {
    console.log('Booking submitted:', { session: selectedSession, ...formData });
    setShowBookingForm(false);
    setSelectedSession(null);
    setFormData({ name: '', email: '', notes: '' });
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">📅 Book Sessions</h1>
          <p className="text-xs text-gray-400">Schedule time with me</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-4 border-b border-white/10 bg-black/20">
        {(['browse', 'booked', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {tab === 'browse' && 'Browse Available'}
            {tab === 'booked' && `My Bookings (${bookedSessions.length})`}
            {tab === 'completed' && 'Completed (0)'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'browse' && (
          <div className="space-y-3">
            {AVAILABLE_SESSIONS.map(session => {
              const sessionType = SESSION_TYPES.find(t => t.id === session.type);
              return (
                <div
                  key={session.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all hover:border-blue-500/50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{sessionType?.label}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {session.time} ({session.duration}min)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">${session.price}</div>
                      {session.type !== 'consultation' && (
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Users size={12} />
                          {session.attendees}/{session.capacity}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookSession(session)}
                    disabled={session.status === 'booked'}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      session.status === 'booked'
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {session.status === 'booked' ? 'Fully Booked' : 'Book Now'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'booked' && (
          <div className="space-y-3">
            {bookedSessions.map(session => {
              const sessionType = SESSION_TYPES.find(t => t.id === session.type);
              return (
                <div key={session.id} className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={24} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{sessionType?.label}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(session.date).toLocaleDateString()} at {session.time}
                      </p>
                      <a
                        href="#"
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                      >
                        Join via Zoom →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
            {bookedSessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No bookings yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="text-center py-8 text-gray-500">
            <p>No completed sessions yet</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-gradient-to-br from-black/80 to-black/60 border border-white/10 rounded-lg p-6 w-96 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Booking</h2>

            <div className="space-y-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Session Type</p>
                <p className="text-white font-semibold">
                  {SESSION_TYPES.find(t => t.id === selectedSession.type)?.label}
                </p>
              </div>

              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />

              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />

              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none h-24"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
