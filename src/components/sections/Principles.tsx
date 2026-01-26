"use client";

import { Container } from "@/components/ui/Container";
import { MotionWrap } from "@/components/motion/MotionWrap";

const principles = [
  {
    number: "01",
    title: "User First",
    description: "Every design decision is made with the user in mind",
  },
  {
    number: "02",
    title: "Performance",
    description: "Fast, efficient, and optimized for all devices",
  },
  {
    number: "03",
    title: "Clean Code",
    description: "Maintainable and scalable solutions for long-term success",
  },
  {
    number: "04",
    title: "Innovation",
    description: "Always exploring new technologies and best practices",
  },
];

export function Principles() {
  return (
    <section className="py-20 border-t border-indigo-500/20">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            My Principles
          </h2>
        </MotionWrap>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {principles.map((principle, index) => (
            <MotionWrap
              key={principle.number}
              delay={index * 0.1}
              direction="up"
            >
              <div className="space-y-2">
                <p className="text-5xl font-bold text-cyan-400 opacity-50">
                  {principle.number}
                </p>
                <h3 className="text-2xl font-bold">{principle.title}</h3>
                <p className="text-gray-400">{principle.description}</p>
              </div>
            </MotionWrap>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Principles;
