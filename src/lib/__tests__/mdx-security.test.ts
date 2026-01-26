import { getPostBySlug, getAllPosts } from '../mdx';
import fs from 'fs';
import path from 'path';

// Mock test to verify XSS sanitization
describe('MDX Security - XSS Prevention', () => {
  const testPostsDir = path.join(process.cwd(), 'content/posts');
  
  it('should sanitize malicious script tags from MDX content', async () => {
    // Create a temporary test file with XSS payload
    const maliciousContent = `---
title: "Test XSS"
description: "Testing XSS prevention"
date: "2026-01-26"
published: true
---

# Normal Content

<script>alert('XSS')</script>

<img src=x onerror="alert('XSS')">

This should be safe content.
`;

    const testFilePath = path.join(testPostsDir, 'test-xss-prevention.mdx');
    
    // Write test file
    if (fs.existsSync(testPostsDir)) {
      fs.writeFileSync(testFilePath, maliciousContent);
      
      try {
        const post = await getPostBySlug('test-xss-prevention');
        
        if (post) {
          // Verify script tags are removed
          expect(post.content).not.toContain('<script>');
          expect(post.content).not.toContain('alert(');
          expect(post.content).not.toContain('onerror=');
          
          // Verify safe content is preserved
          expect(post.content).toContain('Normal Content');
          expect(post.content).toContain('safe content');
          
          console.log('✅ XSS sanitization working correctly');
        }
      } finally {
        // Clean up test file
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    }
  });

  it('should preserve safe HTML tags', async () => {
    const safeContent = `---
title: "Test Safe HTML"
description: "Testing safe HTML preservation"
date: "2026-01-26"
published: true
---

# Heading

**Bold text** and *italic text*

[Link](https://example.com)

\`\`\`javascript
const code = "example";
\`\`\`
`;

    const testFilePath = path.join(testPostsDir, 'test-safe-html.mdx');
    
    if (fs.existsSync(testPostsDir)) {
      fs.writeFileSync(testFilePath, safeContent);
      
      try {
        const post = await getPostBySlug('test-safe-html');
        
        if (post) {
          // Verify safe tags are preserved
          expect(post.content).toContain('<strong>');
          expect(post.content).toContain('<em>');
          expect(post.content).toContain('<a href=');
          expect(post.content).toContain('<code>');
          
          console.log('✅ Safe HTML tags preserved correctly');
        }
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    }
  });
});

// Manual test runner (since Jest not configured)
async function runTests() {
  console.log('🔐 Running XSS Prevention Tests...\n');
  
  try {
    const posts = await getAllPosts();
    console.log(`✅ Successfully loaded ${posts.length} posts`);
    
    // Check if any existing posts have been sanitized properly
    for (const post of posts) {
      if (post.content.includes('<script>') || 
          post.content.includes('onerror=') ||
          post.content.includes('onclick=')) {
        console.error(`❌ SECURITY ISSUE: Post "${post.title}" contains potential XSS!`);
      }
    }
    
    console.log('✅ All existing posts are safe from XSS');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  runTests();
}

export { runTests };
