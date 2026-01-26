"use client";

import { Container } from "@/components/ui/Container";
import { MotionWrap } from "@/components/motion/MotionWrap";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      label: "Twitter",
      href: siteConfig.links.twitter,
      icon: Twitter,
    },
    {
      label: "GitHub",
      href: siteConfig.links.github,
      icon: Github,
    },
    {
      label: "LinkedIn",
      href: siteConfig.links.linkedin,
      icon: Linkedin,
    },
    {
      label: "Email",
      href: siteConfig.links.email,
      icon: Mail,
    },
  ];

  return (
    <footer className="border-t border-indigo-500/20 bg-black/50 backdrop-blur-md">
      <Container className="py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <MotionWrap direction="up" delay={0.1}>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent mb-4">
                {siteConfig.name}
              </h3>
              <p className="text-gray-400">{siteConfig.tagline}</p>
            </div>
          </MotionWrap>

          <MotionWrap direction="up" delay={0.2}>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: "Home", href: "/" },
                  { label: "Projects", href: "/projects" },
                  { label: "Blog", href: "/blog" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </MotionWrap>

          <MotionWrap direction="up" delay={0.3}>
            <div>
              <h4 className="font-bold mb-4">Follow</h4>
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                      aria-label={link.label}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </MotionWrap>
        </div>

        <div className="border-t border-indigo-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
