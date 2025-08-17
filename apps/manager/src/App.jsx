
import React, { useState } from 'react';
import { Link, sampleLinks } from './models/Link';
import LinkList from './components/LinkList';

function App() {
  const [links, setLinks] = useState(sampleLinks);

  const handleAddLink = (url, title, tags) => {
    const newLink = new Link(url, title, tags);
    setLinks([...links, newLink]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Manager's Resource Hub</h1>
        <p className="subtitle">Curated links for podcasts, blogs, and resources</p>
      </header>
      <LinkList links={links} onAddLink={handleAddLink} />
    </div>
  );
}

export default App;