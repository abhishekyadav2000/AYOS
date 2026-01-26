"use client";

import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={isOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden border-t border-indigo-500/20 bg-black/95 backdrop-blur-md"
    >
      <Container className="py-4 space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="block text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors py-2"
          >
            {link.label}
          </Link>
        ))}
      </Container>
    </motion.div>
  );
}

export default MobileMenu;
