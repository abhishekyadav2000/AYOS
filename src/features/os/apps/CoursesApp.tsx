'use client';

import React, { useState } from 'react';
import { X, Book, Play, Award, Download, Lock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  type: 'video' | 'text' | 'quiz';
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  students: number;
  rating: number;
  progress: number;
  enrolled: boolean;
  modules: number;
  lessons: Lesson[];
}

const COURSES: Course[] = [
  {
    id: '1',
    title: 'Modern Web Development with React',
    description: 'Learn React from basics to advanced patterns',
    price: 79.99,
    level: 'beginner',
    students: 2341,
    rating: 4.8,
    progress: 65,
    enrolled: true,
    modules: 8,
    lessons: [
      { id: '1-1', title: 'React Fundamentals', duration: 45, completed: true, type: 'video' },
      { id: '1-2', title: 'Hooks Deep Dive', duration: 60, completed: true, type: 'video' },
      { id: '1-3', title: 'Project: Todo App', duration: 120, completed: false, type: 'text' },
    ],
  },
  {
    id: '2',
    title: 'Next.js Full Stack Mastery',
    description: 'Build production-ready full stack apps',
    price: 99.99,
    level: 'intermediate',
    students: 1542,
    rating: 4.9,
    progress: 0,
    enrolled: false,
    modules: 10,
    lessons: [],
  },
  {
    id: '3',
    title: 'System Design for Scalability',
    description: 'Design systems that scale to millions',
    price: 149.99,
    level: 'advanced',
    students: 834,
    rating: 4.7,
    progress: 0,
    enrolled: false,
    modules: 12,
    lessons: [],
  },
];

interface CoursesAppProps {
  onClose: () => void;
}

export function CoursesApp({ onClose }: CoursesAppProps) {
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const enrolledCourses = COURSES.filter(c => c.enrolled);
  const availableCourses = COURSES.filter(c => !c.enrolled);

  const displayCourses = activeTab === 'enrolled' ? enrolledCourses : availableCourses;

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">🎓 Courses</h1>
          <p className="text-xs text-gray-400">Learn new skills</p>
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
        {(['enrolled', 'available'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {tab === 'enrolled' && `Enrolled (${enrolledCourses.length})`}
            {tab === 'available' && `Available (${availableCourses.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex">
        {/* Courses List */}
        <div className={`${selectedCourse ? 'w-1/3' : 'w-full'} border-r border-white/10 transition-all`}>
          <div className="p-4 space-y-3">
            {displayCourses.map(course => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedCourse?.id === course.id
                    ? 'bg-purple-600/20 border-purple-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <h3 className="font-semibold text-white">{course.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    <span className="text-xs bg-purple-600/40 text-purple-200 px-2 py-1 rounded capitalize">
                      {course.level}
                    </span>
                    {course.enrolled && (
                      <>
                        <span className="text-xs bg-green-600/40 text-green-200 px-2 py-1 rounded">
                          {course.progress}% done
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-purple-400 font-bold">${course.price}</span>
                </div>
                {course.enrolled && (
                  <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Course Detail */}
        {selectedCourse && (
          <div className="w-2/3 p-6 overflow-y-auto flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedCourse.title}</h2>
            <p className="text-gray-400 mb-4">{selectedCourse.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Students</p>
                <p className="text-lg font-bold text-white">{selectedCourse.students.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Rating</p>
                <p className="text-lg font-bold text-yellow-400">⭐ {selectedCourse.rating}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Modules</p>
                <p className="text-lg font-bold text-white">{selectedCourse.modules}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Level</p>
                <p className="text-lg font-bold text-purple-400 capitalize">{selectedCourse.level}</p>
              </div>
            </div>

            {/* Lessons */}
            {selectedCourse.enrolled && selectedCourse.lessons.length > 0 && (
              <div className="flex-1">
                <h3 className="font-bold text-white mb-3">Course Content</h3>
                <div className="space-y-2">
                  {selectedCourse.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="bg-white/5 p-3 rounded-lg flex items-center gap-3 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <Award size={18} className="text-green-400" />
                        ) : lesson.type === 'quiz' ? (
                          <Lock size={18} className="text-gray-400" />
                        ) : (
                          <Play size={18} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{lesson.title}</p>
                        <p className="text-xs text-gray-400">{lesson.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-white/10">
              {selectedCourse.enrolled ? (
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Play size={16} />
                  Continue Learning
                </button>
              ) : (
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors">
                  Enroll Now - ${selectedCourse.price}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
