"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

      <Container className="text-center">
        <MotionWrap delay={0.1} direction="up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Abhishek Yadav
            </span>
          </h1>
        </MotionWrap>

        <MotionWrap delay={0.2} direction="up">
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Crafting beautiful, modern web experiences with cutting-edge
            technologies. Let's build something amazing together.
          </p>
        </MotionWrap>

        <MotionWrap delay={0.3} direction="up">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/projects">
                View My Work <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </MotionWrap>

        <MotionWrap delay={0.4} direction="up">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block"
          >
            <p className="text-gray-500 text-sm">↓ Scroll to explore</p>
          </motion.div>
        </MotionWrap>
      </Container>
    </section>
  );
}

export default Hero;
