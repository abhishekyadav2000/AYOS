import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { siteConfig } from "@/config/site";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Showcase of my recent work and projects",
};

export default function ProjectsPage() {
  return (
    <section className="min-h-screen py-20 pt-32">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Projects</h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-12">
            A selection of projects I've worked on, ranging from full-stack
            applications to design-focused interfaces.
          </p>
        </MotionWrap>

        <div className="grid md:grid-cols-2 gap-8">
          {siteConfig.projects.map((project, index) => (
            <MotionWrap
              key={project.id}
              direction="up"
              delay={index * 0.1 + 0.2}
            >
              <Card className="h-full flex flex-col">
                <div className="aspect-video bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 rounded-lg mb-6 overflow-hidden">
                  <p className="h-full flex items-center justify-center text-gray-500">
                    Image Placeholder
                  </p>
                </div>
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-400 mb-6 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Tag key={tag} variant="accent">
                      {tag}
                    </Tag>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
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
