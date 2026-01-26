"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { siteConfig } from "@/config/site";
import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen py-20 pt-32">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <div className="max-w-2xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Get in Touch</h1>
            <p className="text-gray-400 text-lg">
              Have a project in mind or just want to chat? Feel free to reach
              out. I'll get back to you as soon as possible.
            </p>
          </div>
        </MotionWrap>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <MotionWrap direction="up" delay={0.2}>
            <Card className="text-center h-full flex flex-col items-center justify-center">
              <Mail className="text-cyan-400 mb-4" size={32} />
              <h3 className="font-bold mb-2">Email</h3>
              <a
                href="mailto:abhishekyadav@my.unt.edu"
                className="text-gray-400 hover:text-cyan-400 transition-colors break-all"
              >
                abhishekyadav@my.unt.edu
              </a>
            </Card>
          </MotionWrap>

          <MotionWrap direction="up" delay={0.3}>
            <Card className="text-center h-full flex flex-col items-center justify-center">
              <Phone className="text-cyan-400 mb-4" size={32} />
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
            <Card className="text-center h-full flex flex-col items-center justify-center">
              <MapPin className="text-cyan-400 mb-4" size={32} />
              <h3 className="font-bold mb-2">Location</h3>
              <p className="text-gray-400">Frisco, Texas</p>
            </Card>
          </MotionWrap>
        </div>

        <MotionWrap direction="up" delay={0.5}>
          <Card className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Let's Connect</h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
                Thank you! I'll get back to you soon.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                There was an error sending your message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/40 border border-indigo-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/40 border border-indigo-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-black/40 border border-indigo-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </MotionWrap>
      </Container>
    </section>
  );
}
