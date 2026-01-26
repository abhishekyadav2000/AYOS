"use client";

import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "AYOS", href: "/os" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === "/os") {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-indigo-500/20 bg-black/80 backdrop-blur-md">
      <Container className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent"
        >
          AY
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-cyan-400 hover:text-cyan-300"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      {isOpen && <MobileMenu onClose={() => setIsOpen(false)} />}
    </nav>
  );
}

interface MobileMenuProps {
  onClose: () => void;
}

function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
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

export default Navbar;
