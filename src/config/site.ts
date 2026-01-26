export const siteConfig = {
  name: "Abhishek Yadav",
  title: "Full Stack Developer & Designer",
  tagline: "Crafting beautiful digital experiences with modern web technologies",
  description: "Portfolio website showcasing projects, blog posts, and services",
  email: "hello@abhishekyadav.dev",
  links: {
    twitter: "https://twitter.com/abhishekyadav2000",
    github: "https://github.com/abhishekyadav2000",
    linkedin: "https://www.linkedin.com/in/itsmebro",
    email: "mailto:hello@abhishekyadav.dev",
  },
  highlights: [
    { label: "Projects Completed", value: "20+" },
    { label: "Years Experience", value: "5+" },
    { label: "Happy Clients", value: "30+" },
  ],
  services: [
    {
      id: "mindmatrix-streams",
      title: "MindMatriX Streams +",
      description:
        "Premium streaming platform for content creators and audiences",
      icon: "Tv",
    },
    {
      id: "its-me-bro",
      title: "ITS ME BRO",
      description: "Personal branding and digital presence solutions",
      icon: "User",
    },
    {
      id: "web-development",
      title: "Web Development",
      description:
        "Custom websites and applications built with modern technologies",
      icon: "Code2",
    },
    {
      id: "consulting",
      title: "Consulting",
      description:
        "Expert guidance on technology strategy and implementation",
      icon: "Lightbulb",
    },
  ],
  projects: [
    {
      id: "project-1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce platform with payment integration",
      image: "/projects/project-1.jpg",
      tags: ["Next.js", "React", "Tailwind", "Stripe"],
      link: "#",
    },
    {
      id: "project-2",
      title: "Task Management App",
      description: "Real-time collaborative task management application",
      image: "/projects/project-2.jpg",
      tags: ["React", "Firebase", "TypeScript"],
      link: "#",
    },
    {
      id: "project-3",
      title: "Analytics Dashboard",
      description: "Data visualization and analytics dashboard for business insights",
      image: "/projects/project-3.jpg",
      tags: ["Next.js", "Chart.js", "PostgreSQL"],
      link: "#",
    },
  ],
  skills: [
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    {
      category: "Backend",
      items: ["Node.js", "Express", "PostgreSQL", "MongoDB"],
    },
    { category: "Tools", items: ["Git", "Docker", "AWS", "CI/CD"] },
    { category: "Design", items: ["Figma", "UI/UX", "Prototyping", "Wireframing"] },
  ],
};
