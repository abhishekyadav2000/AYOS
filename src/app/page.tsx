"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, Code, Briefcase, Mail, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const mainActions = [
    {
      icon: Terminal,
      label: "Launch AYOS",
      description: "Experience the interactive OS",
      href: "/os",
      color: "from-cyan-400 to-blue-500",
      primary: true,
    },
    {
      icon: Briefcase,
      label: "Projects",
      description: "View my work",
      href: "/projects",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Code,
      label: "Blog",
      description: "Read articles",
      href: "/blog",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Mail,
      label: "Contact",
      description: "Get in touch",
      href: "/contact",
      color: "from-orange-400 to-red-500",
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <Container className="text-center py-20">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Abhishek Yadav
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Full-Stack Developer & Security Researcher
            <br />
            <span className="text-lg text-gray-500">
              Building the future, one line of code at a time
            </span>
          </p>
        </motion.div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {mainActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={action.href}
                  className={`block relative overflow-hidden rounded-2xl p-8 backdrop-blur-lg transition-all duration-300 ${
                    action.primary
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="relative z-10">
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${action.color} mb-4`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {action.label}
                    </h3>
                    <p className="text-gray-400">{action.description}</p>
                    {action.primary && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-cyan-400">
                        <Rocket size={20} />
                        <span className="text-sm font-semibold">
                          Click to Launch
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover glow effect */}
                  <div
                    className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${action.color} blur-2xl -z-10`}
                    style={{ transform: 'scale(0.8)' }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { label: "Years Experience", value: "5+" },
            { label: "Projects Completed", value: "50+" },
            { label: "Technologies", value: "20+" },
            { label: "Coffee Consumed", value: "∞" },
          ].map((stat, i) => (
            <div key={i} className="px-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
