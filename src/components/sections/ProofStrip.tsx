"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { siteConfig } from "@/config/site";

export function ProofStrip() {
  return (
    <section className="py-20 border-y border-indigo-500/20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.highlights.map((highlight, index) => (
            <MotionWrap key={index} delay={index * 0.1} direction="up">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                  {highlight.value}
                </p>
                <p className="text-gray-400">{highlight.label}</p>
              </div>
            </MotionWrap>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ProofStrip;
