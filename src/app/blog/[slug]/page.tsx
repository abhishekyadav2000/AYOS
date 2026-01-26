import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { MotionWrap } from "@/components/motion/MotionWrap";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen py-20 pt-32">
      <Container>
        <MotionWrap direction="up" delay={0.1}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
          >
            <ArrowLeft size={20} /> Back to Blog
          </Link>
        </MotionWrap>

        <MotionWrap direction="up" delay={0.2}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-400">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
            {post.author && (
              <>
                <span>•</span>
                <span>By {post.author}</span>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </MotionWrap>

        <MotionWrap direction="up" delay={0.3}>
          <div className="prose prose-invert max-w-none mb-12">
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="space-y-4 text-gray-300 leading-relaxed max-w-3xl"
            />
          </div>
        </MotionWrap>

        <MotionWrap direction="up" delay={0.4}>
          <div className="border-t border-indigo-500/20 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={20} /> Back to Blog
            </Link>
          </div>
        </MotionWrap>
      </Container>
    </article>
  );
}
