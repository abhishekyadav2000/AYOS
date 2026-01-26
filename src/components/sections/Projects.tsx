"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { siteConfig } from "@/config/site";
import { ExternalLink } from "lucide-react";

export function Projects() {
  return (
    <section className="py-20">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Projects</h2>
          <p className="text-gray-400 mb-12 max-w-2xl">
            A selection of my recent work and side projects
          </p>
        </MotionWrap>

        <div className="grid md:grid-cols-3 gap-8">
          {siteConfig.projects.map((project, index) => (
            <MotionWrap key={project.id} delay={index * 0.1} direction="up">
              <Card className="group h-full flex flex-col">
                <div className="aspect-video bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 rounded-lg mb-4 overflow-hidden">
                  <p className="h-full flex items-center justify-center text-gray-500">
                    Image Placeholder
                  </p>
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Tag key={tag} variant="accent">
                      {tag}
                    </Tag>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View Project <ExternalLink size={16} />
                </a>
              </Card>
            </MotionWrap>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Projects;
