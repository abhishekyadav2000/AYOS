"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  published?: boolean;
}

export interface Post extends PostMetadata {
  content: string;
  readingTime: number;
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory);
  const posts: Post[] = [];

  files.forEach((file) => {
    if (!file.endsWith(".mdx")) return;

    const filePath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const slug = file.replace(/\.mdx$/, "");
    const time = readingTime(content);
    const rawHtml = marked(content) as string;
    const htmlContent = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr", "blockquote", "pre", "code",
        "ul", "ol", "li", "dl", "dt", "dd",
        "table", "thead", "tbody", "tr", "th", "td",
        "strong", "em", "b", "i", "u", "s", "del",
        "a", "img",
        "div", "span", "section", "article"
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
      ALLOW_DATA_ATTR: false,
    });

    posts.push({
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      author: data.author,
      tags: data.tags || [],
      published: data.published !== false,
      content: htmlContent,
      readingTime: time.minutes,
    });
  });

  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const time = readingTime(content);
  const rawHtml = marked(content) as string;
  const htmlContent = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr", "blockquote", "pre", "code",
      "ul", "ol", "li", "dl", "dt", "dd",
      "table", "thead", "tbody", "tr", "th", "td",
      "strong", "em", "b", "i", "u", "s", "del",
      "a", "img",
      "div", "span", "section", "article"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
    ALLOW_DATA_ATTR: false,
  });

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    author: data.author,
    tags: data.tags || [],
    published: data.published !== false,
    content: htmlContent,
    readingTime: time.minutes,
  };
}
