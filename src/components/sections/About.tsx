"use client";

import { Container } from "@/components/ui/Container";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { Tag } from "@/components/ui/Tag";
import Image from "next/image";

export function About() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vue.js"]
    },
    {
      title: "Backend",
      skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL"]
    },
    {
      title: "Tools & DevOps",
      skills: ["Git", "Docker", "AWS", "Vercel", "Linux", "CI/CD"]
    },
    {
      title: "Design",
      skills: ["Figma", "UI/UX", "Web Design", "Prototyping", "Accessibility"]
    },
    {
      title: "Systems",
      skills: ["IoT", "Embedded Systems", "Cloud Architecture", "Data Analytics", "Security"]
    }
  ];

  return (
    <section className="py-20">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
        </MotionWrap>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <MotionWrap direction="left" delay={0.2}>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed">
                I'm <span className="text-white font-semibold">Abhishek Yadav</span> — a systems thinker, full-stack technologist, and community-driven builder currently pursuing a Master's in Information Systems & Technology (STEM) at the University of North Texas.
              </p>
              <p className="text-lg leading-relaxed">
                I work at the intersection of technology, design, and human impact. My journey began with curiosity about how systems work — from embedded electronics and IoT to cloud platforms, data analytics, and secure digital infrastructure. Over time, that curiosity evolved into a mission: <span className="text-cyan-400">build reliable, scalable systems that genuinely help people and communities</span>.
              </p>
              <p className="text-lg leading-relaxed">
                I've worn many hats — IT assistant, student leader, designer, founder, and technologist — across campuses, schools, startups, and global education initiatives. Each experience shaped how I approach problems: with empathy, rigor, and a focus on sustainable solutions.
              </p>
            </div>
          </MotionWrap>

          <MotionWrap direction="right" delay={0.3}>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <Image
                src="/profile.jpeg"
                alt="Abhishek Yadav"
                fill
                className="object-cover"
                priority
              />
            </div>
          </MotionWrap>
        </div>

        {/* Skills Section */}
        <MotionWrap direction="up" delay={0.4}>
          <div className="border-t border-white/10 pt-12">
            <h3 className="text-3xl font-bold mb-8">Skills & Expertise</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillCategories.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-400">{category.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionWrap>

        {/* Core Values */}
        <MotionWrap direction="up" delay={0.5}>
          <div className="border-t border-white/10 mt-12 pt-12">
            <h3 className="text-3xl font-bold mb-6">Core Values</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition">
                <h4 className="font-semibold text-white mb-2">⚡ Innovation</h4>
                <p className="text-gray-400 text-sm">Pushing boundaries to create solutions that make a real difference</p>
              </div>
              <div className="p-6 rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition">
                <h4 className="font-semibold text-white mb-2">🤝 Collaboration</h4>
                <p className="text-gray-400 text-sm">Building with and for communities, believing in collective growth</p>
              </div>
              <div className="p-6 rounded-lg border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition">
                <h4 className="font-semibold text-white mb-2">🎯 Excellence</h4>
                <p className="text-gray-400 text-sm">Delivering quality solutions with attention to security and performance</p>
              </div>
            </div>
          </div>
        </MotionWrap>
      </Container>
    </section>
  );
}

export default About;
