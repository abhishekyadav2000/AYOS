"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { siteConfig } from "@/config/site";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

export function MicroBusiness() {
  return (
    <section className="py-20 border-t border-indigo-500/20">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Micro Business
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Innovative digital ventures and platforms I've built
          </p>
        </MotionWrap>

        <div className="grid md:grid-cols-2 gap-8">
          {siteConfig.services.map((service, index) => {
            const IconComponent = LucideIcons[service.icon as IconName] as any;
            return (
              <MotionWrap key={service.id} delay={index * 0.1} direction="up">
                <Card>
                  <div className="flex gap-4">
                    {IconComponent && (
                      <IconComponent className="text-cyan-400 flex-shrink-0" size={32} />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-gray-400">{service.description}</p>
                    </div>
                  </div>
                </Card>
              </MotionWrap>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default MicroBusiness;
