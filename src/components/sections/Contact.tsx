"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function Contact() {
  return (
    <section className="py-20">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Let's Talk Business
            </h2>
            <p className="text-gray-400">
              Have a project in mind? I'd love to hear from you.
            </p>
          </div>
        </MotionWrap>

        <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
          <MotionWrap direction="up" delay={0.2}>
            <Card className="text-center">
              <Mail className="text-cyan-400 mx-auto mb-4" size={32} />
              <h3 className="font-bold mb-2">Email</h3>
              <a
                href="mailto:abhishekyadav@my.unt.edu?subject=Let's Work Together&body=Hi Abhishek,%0D%0A%0D%0AI'm reaching out regarding..."
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                abhishekyadav@my.unt.edu
              </a>
            </Card>
          </MotionWrap>

          <MotionWrap direction="up" delay={0.3}>
            <Card className="text-center">
              <Phone className="text-cyan-400 mx-auto mb-4" size={32} />
              <h3 className="font-bold mb-2">Phone</h3>
              <a
                href="tel:+12148992073"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                +1 (214) 899-2073
              </a>
            </Card>
          </MotionWrap>

          <MotionWrap direction="up" delay={0.4}>
            <Card className="text-center">
              <MapPin className="text-cyan-400 mx-auto mb-4" size={32} />
              <h3 className="font-bold mb-2">Location</h3>
              <p className="text-gray-400">Frisco, Texas</p>
            </Card>
          </MotionWrap>
        </div>

        <MotionWrap direction="up" delay={0.5}>
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/contact">Send Me a Message</Link>
            </Button>
          </div>
        </MotionWrap>
      </Container>
    </section>
  );
}

export default Contact;
