"use client";

import React from "react";
import { motion } from "framer-motion";

export function AboutApp() {
  const aboutContent = [
    {
      title: "Who I Am",
      content:
        "I'm Abhishek Yadav — a systems thinker, full-stack technologist, and community-driven builder pursuing a Master's in Information Systems & Technology (STEM) at the University of North Texas.",
    },
    {
      title: "My Mission",
      content:
        "I work at the intersection of technology, design, and human impact. My mission is to build reliable, scalable systems that genuinely help people and communities thrive.",
    },
    {
      title: "My Journey",
      content:
        "From embedded electronics and IoT to cloud platforms, data analytics, and secure digital infrastructure. I've worn many hats across campuses, schools, startups, and global education initiatives.",
    },
  ];

  const skillCategories = [
    { title: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { title: "Backend", skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "REST APIs"] },
    { title: "Tools", skills: ["Git", "Docker", "AWS", "Vercel", "Linux"] },
    { title: "Design", skills: ["Figma", "UI/UX", "Web Design", "Prototyping"] },
    { title: "Systems", skills: ["IoT", "Cloud Architecture", "Data Analytics", "Security"] },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 border-b border-indigo-500/30">
        <h1 className="text-2xl font-bold text-white">About Abhishek</h1>
        <p className="text-indigo-100 text-sm mt-1">Full Stack Developer & Designer</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* About Sections */}
        <div className="space-y-4">
          {aboutContent.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition"
            >
              <h3 className="font-semibold text-cyan-400 mb-2">{section.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="border-t border-white/10 pt-6">
          <h2 className="text-lg font-bold text-white mb-4">Skills & Expertise</h2>
          <div className="grid grid-cols-2 gap-4">
            {skillCategories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition"
              >
                <h4 className="font-semibold text-purple-400 mb-3 text-sm">{category.title}</h4>
                <div className="space-y-1">
                  {category.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="text-xs text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="border-t border-white/10 pt-6">
          <h2 className="text-lg font-bold text-white mb-4">Core Values</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-center hover:bg-cyan-500/10 transition">
              <p className="text-2xl mb-1">⚡</p>
              <p className="text-xs font-semibold text-cyan-400">Innovation</p>
              <p className="text-xs text-gray-400 mt-1">Pushing boundaries</p>
            </div>
            <div className="p-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 text-center hover:bg-indigo-500/10 transition">
              <p className="text-2xl mb-1">🤝</p>
              <p className="text-xs font-semibold text-indigo-400">Collaboration</p>
              <p className="text-xs text-gray-400 mt-1">Building together</p>
            </div>
            <div className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5 text-center hover:bg-purple-500/10 transition">
              <p className="text-2xl mb-1">🎯</p>
              <p className="text-xs font-semibold text-purple-400">Excellence</p>
              <p className="text-xs text-gray-400 mt-1">Quality focus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-indigo-500/20 bg-black/50 p-4 text-center">
        <p className="text-xs text-gray-500">Ready to build something amazing together? Let's connect!</p>
      </div>
    </div>
  );
}

export default AboutApp;
