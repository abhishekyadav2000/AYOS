'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, Tag, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
}

// Sample blog posts - will be fetched from API
const SAMPLE_POSTS: Post[] = [
  {
    slug: 'nextjs-portfolio',
    title: 'Building an Interactive Next.js Portfolio',
    description: 'Learn how to create a Windows-like portfolio interface with React and Next.js',
    date: '2025-01-20',
    tags: ['Next.js', 'React', 'Portfolio'],
    published: true,
  },
  {
    slug: 'typescript-guide',
    title: 'TypeScript Best Practices for Modern Web',
    description: 'Master TypeScript with practical examples and real-world patterns',
    date: '2025-01-15',
    tags: ['TypeScript', 'Web Dev'],
    published: true,
  },
  {
    slug: 'web-design-principles',
    title: 'Web Design Principles That Convert',
    description: 'Design patterns and principles that improve user engagement and conversion',
    date: '2025-01-10',
    tags: ['Design', 'UX'],
    published: true,
  },
  {
    slug: 'draft-ai-features',
    title: 'Integrating AI Features into Your App',
    description: 'Draft: How to add AI/ML capabilities to modern web applications',
    date: '2025-01-25',
    tags: ['AI', 'Machine Learning'],
    published: false,
  },
];

interface BlogAppProps {
  onClose: () => void;
}

export function BlogApp({ onClose }: BlogAppProps) {
  const [selectedTab, setSelectedTab] = useState<'published' | 'drafts' | 'scheduled'>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    let posts = SAMPLE_POSTS;

    // Filter by tab
    if (selectedTab === 'published') {
      posts = posts.filter(p => p.published);
    } else if (selectedTab === 'drafts') {
      posts = posts.filter(p => !p.published);
    }

    // Filter by search
    if (searchQuery) {
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag) {
      posts = posts.filter(p => p.tags.includes(selectedTag));
    }

    return posts;
  }, [selectedTab, searchQuery, selectedTag]);

  const allTags = Array.from(new Set(SAMPLE_POSTS.flatMap(p => p.tags)));

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">📖 Blog Reader</h1>
          <p className="text-xs text-gray-400">Read and explore articles</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-4 border-b border-white/10 bg-black/20">
        {(['published', 'drafts', 'scheduled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              selectedTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {tab === 'published' && `Published (${SAMPLE_POSTS.filter(p => p.published).length})`}
            {tab === 'drafts' && `Drafts (${SAMPLE_POSTS.filter(p => !p.published).length})`}
            {tab === 'scheduled' && 'Scheduled (0)'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Tag size={12} className="inline mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-3 mt-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="group p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer block"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{post.description}</p>
                      <div className="flex gap-2 mt-2">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <Calendar size={12} />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-500 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No posts found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 bg-black/20 text-center text-xs text-gray-500">
        {filteredPosts.length} posts • {selectedTab} view
      </div>
    </div>
  );
}
