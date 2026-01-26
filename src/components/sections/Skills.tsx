"use client";

import { Container } from "@/components/ui/Container";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { siteConfig } from "@/config/site";

export function Skills() {
  return (
    <section className="py-20 border-t border-indigo-500/20">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Skills & Expertise
          </h2>
        </MotionWrap>

        <div className="grid md:grid-cols-4 gap-8">
          {siteConfig.skills.map((skillGroup, index) => (
            <MotionWrap key={skillGroup.category} delay={index * 0.1} direction="up">
              <div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((item) => (
                    <li key={item} className="text-gray-400 hover:text-cyan-400 transition-colors">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </MotionWrap>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Skills;
