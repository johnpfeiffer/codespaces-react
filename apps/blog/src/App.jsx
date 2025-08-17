
import React, { useState, useEffect } from 'react';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';

function App() {
  const [currentView, setCurrentView] = useState('list');
  const [currentSlug, setCurrentSlug] = useState('');

  useEffect(() => {
    // Simple routing based on URL path
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    // Remove the app name from segments if present
    const relevantSegments = segments.length > 0 && segments[0] === 'blog' ? segments.slice(1) : segments;
    
    if (relevantSegments.length === 0) {
      setCurrentView('list');
    } else if (relevantSegments[0] === 'post' && relevantSegments[1]) {
      setCurrentView('post');
      setCurrentSlug(relevantSegments[1]);
    } else {
      setCurrentView('list');
    }
  }, []);

  // Handle navigation
  const navigateToPost = (slug) => {
    setCurrentView('post');
    setCurrentSlug(slug);
    // Update URL without causing a page reload
    window.history.pushState(null, '', `/blog/post/${slug}`);
  };

  const navigateToList = () => {
    setCurrentView('list');
    setCurrentSlug('');
    window.history.pushState(null, '', '/blog/');
  };

  return (
    <div className="App">
      {currentView === 'list' ? (
        <BlogList onNavigateToPost={navigateToPost} />
      ) : (
        <BlogPost slug={currentSlug} onNavigateToList={navigateToList} />
      )}
    </div>
  );
}

export default App;