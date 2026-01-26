"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  tags?: string[];
}

export function BlogPreview() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="py-20">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest Posts</h2>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Thoughts on web development, design, and technology
          </p>
        </MotionWrap>

        {!isLoading && posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <MotionWrap key={post.slug} delay={index * 0.1} direction="up">
                <Card className="h-full flex flex-col">
                  <span className="text-sm text-gray-500 mb-2">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-400 mb-4 flex-1">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {post.readingTime} min read
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                    >
                      Read <ArrowRight size={16} />
                    </Link>
                  </div>
                </Card>
              </MotionWrap>
            ))}
          </div>
        ) : (
          <MotionWrap direction="up">
            <Card className="text-center py-12">
              <p className="text-gray-400">No blog posts yet. Check back soon!</p>
            </Card>
          </MotionWrap>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            View All Posts <ArrowRight size={20} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default BlogPreview;
