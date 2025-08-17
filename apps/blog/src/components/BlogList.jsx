import React, { useState, useEffect } from 'react';
import { extractMetadata } from '../markdownParser';

// Dynamically import all markdown files from the content directory
const markdownModules = import.meta.glob('../content/*.md', { as: 'raw', eager: true });

// BlogList discovers the list of markdown files in the content directory and returns a list of objects that have the filename, title, date, and excerpt
function BlogList({ onNavigateToPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // Process all imported markdown files
      const postData = Object.entries(markdownModules).map(([path, content]) => {
        // Extract filename from path (../content/filename.md -> filename)
        const filename = path.split('/').pop().replace('.md', '');
        
        // Extract metadata from content
        const { metadata } = extractMetadata(content);
        
        return {
          filename,
          title: metadata.title || filename.replace(/-/g, ' '),
          date: metadata.date || '',
          excerpt: metadata.excerpt || '',
          url: `/post/${filename}`
        };
      });

      // Sort by date (newest first)
      const sortedPosts = postData.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
      });

      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Blog</h1>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Blog</h1>
      
      {posts.length === 0 ? (
        <div style={{ marginTop: '2rem' }}>
          <p>No blog posts found.</p>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {posts.map((post) => (
            <article 
              key={post.filename}
              style={{ 
                marginBottom: '2rem', 
                paddingBottom: '2rem',
                borderBottom: '1px solid #e0e0e0'
              }}
            >
              <h2 style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => onNavigateToPost(post.filename)}
                  style={{ 
                    color: '#0066cc',
                    textDecoration: 'none',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    fontWeight: 'inherit'
                  }}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  {post.title}
                </button>
              </h2>
              
              {post.date && (
                <time 
                  style={{ 
                    fontSize: '0.9rem', 
                    color: '#666',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}
                >
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              
              {post.excerpt && (
                <p style={{ marginTop: '0.5rem', color: '#333' }}>
                  {post.excerpt}
                </p>
              )}
              
              <button
                onClick={() => onNavigateToPost(post.filename)}
                style={{ 
                  color: '#0066cc',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Read more →
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;