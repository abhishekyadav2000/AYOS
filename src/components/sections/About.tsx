"use client";

import { Container } from "@/components/ui/Container";
import { MotionWrap } from "@/components/motion/MotionWrap";
import Image from "next/image";

export function About() {
  return (
    <section className="py-20">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
        </MotionWrap>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <MotionWrap direction="left" delay={0.2}>
            <div className="space-y-4 text-gray-300">
              <p>
                I'm Abhishek Yadav — a systems thinker, full-stack technologist, and community-driven builder currently pursuing a Master's in Information Systems & Technology (STEM) at the University of North Texas.
              </p>
              <p>
                I work at the intersection of technology, design, and human impact. My journey began with curiosity about how systems work — from embedded electronics and IoT to cloud platforms, data analytics, and secure digital infrastructure. Over time, that curiosity evolved into a mission: build reliable, scalable systems that genuinely help people and communities.
              </p>
              <p>
                I've worn many hats — IT assistant, student leader, designer, founder, and technologist — across campuses, schools, startups, and global education initiatives.
              </p>
            </div>
          </MotionWrap>

          <MotionWrap direction="right" delay={0.3}>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-indigo-500/20">
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
      </Container>
    </section>
  );
}

export default About;
