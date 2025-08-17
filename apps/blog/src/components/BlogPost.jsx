import React, { useState, useEffect } from 'react';
import { parseMarkdown, extractMetadata } from '../markdownParser';

// Dynamically import all markdown files from the content directory
const markdownModules = import.meta.glob('../content/*.md', { as: 'raw', eager: true });

function BlogPost({ slug, onNavigateToList }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the matching markdown file
      const matchingPath = Object.keys(markdownModules).find(path => 
        path.endsWith(`/${slug}.md`)
      );
      
      if (!matchingPath) {
        throw new Error('Post not found');
      }

      const markdown = markdownModules[matchingPath];
      const { metadata, content } = extractMetadata(markdown);
      const html = parseMarkdown(content);

      setPost({
        title: metadata.title || slug.replace(/-/g, ' '),
        date: metadata.date,
        content: html
      });
    } catch (err) {
      console.error('Error loading post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Post Not Found</h1>
        <p>The blog post you're looking for doesn't exist.</p>
        <button
          onClick={onNavigateToList}
          style={{ 
            color: '#0066cc',
            textDecoration: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
        >
          ← Back to all posts
        </button>
      </div>
    );
  }

  return (
    <article style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onNavigateToList}
        style={{ 
          color: '#0066cc',
          textDecoration: 'none',
          fontSize: '0.9rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}
        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
      >
        ← Back to all posts
      </button>
      
      <header style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>{post.title}</h1>
        {post.date && (
          <time 
            style={{ 
              fontSize: '0.9rem', 
              color: '#666'
            }}
          >
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        )}
      </header>

      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{
          lineHeight: '1.6',
          fontSize: '1.1rem'
        }}
      />
      
      <style>{`
        .markdown-content h1 {
          font-size: 2rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .markdown-content h2 {
          font-size: 1.5rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .markdown-content h3 {
          font-size: 1.25rem;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content p {
          margin-bottom: 1rem;
        }
        .markdown-content blockquote {
          border-left: 4px solid #e0e0e0;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #666;
          font-style: italic;
        }
        .markdown-content ul, .markdown-content ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        .markdown-content li {
          margin-bottom: 0.25rem;
        }
        .markdown-content hr {
          border: none;
          border-top: 1px solid #e0e0e0;
          margin: 2rem 0;
        }
        .markdown-content a {
          color: #0066cc;
          text-decoration: none;
        }
        .markdown-content a:hover {
          text-decoration: underline;
        }
        .markdown-content code {
          background-color: #f5f5f5;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }
      `}</style>
    </article>
  );
}

export default BlogPost;