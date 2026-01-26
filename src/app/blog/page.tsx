import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about web development, design, and technology",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="min-h-screen py-20 pt-32">
      <Container>
              <MotionWrap direction="up" delay={0.1}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Blog</h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-12">
            Thoughts on web development, design, and technology
          </p>
        </MotionWrap>

        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <MotionWrap key={post.slug} delay={index * 0.1 + 0.2} direction="up">
                <Link href={`/blog/${post.slug}`}>
                  <Card className="hover:border-cyan-400/50 group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-500">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-xs text-gray-600">
                            {post.readingTime} min read
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-400 mb-4">{post.description}</p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Tag key={tag} variant="default">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="text-cyan-400 flex-shrink-0 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </MotionWrap>
            ))}
          </div>
        ) : (
          <MotionWrap direction="up">
            <Card className="text-center py-12">
              <p className="text-gray-400">
                No blog posts yet. Check back soon for new articles!
              </p>
            </Card>
          </MotionWrap>
        )}
      </Container>
    </section>
  );
}
