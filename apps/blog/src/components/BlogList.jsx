import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { extractMetadata } from '../markdownParser';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // Fetch the list of markdown files
      const response = await fetch('/posts/index.json');
      
      if (!response.ok) {
        // If index.json doesn't exist, try to discover markdown files
        console.log('No index.json found, looking for markdown files...');
        setPosts([]);
        setLoading(false);
        return;
      }

      const fileList = await response.json();
      
      // Load each markdown file and extract metadata
      const postData = await Promise.all(
        fileList.map(async (filename) => {
          try {
            const res = await fetch(`/posts/${filename}`);
            const content = await res.text();
            const { metadata } = extractMetadata(content);
            
            return {
              filename: filename.replace('.md', ''),
              title: metadata.title || filename.replace('.md', '').replace(/-/g, ' '),
              date: metadata.date || '',
              excerpt: metadata.excerpt || ''
            };
          } catch (err) {
            console.error(`Error loading ${filename}:`, err);
            return null;
          }
        })
      );

      // Filter out null entries and sort by date (newest first)
      const validPosts = postData
        .filter(post => post !== null)
        .sort((a, b) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date) - new Date(a.date);
        });

      setPosts(validPosts);
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
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
            To add blog posts, create markdown files in <code>/apps/blog/public/posts/</code> 
            and add an <code>index.json</code> file listing the markdown filenames.
          </p>
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
                <Link 
                  to={`/post/${post.filename}`}
                  style={{ 
                    color: '#0066cc',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  {post.title}
                </Link>
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
              
              <Link 
                to={`/post/${post.filename}`}
                style={{ 
                  color: '#0066cc',
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;