
import React from 'react';
import { sampleLinks } from './models/Link';
import LinkList from './components/LinkList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Manager's Resource Hub</h1>
        <p className="subtitle">Curated links for podcasts, blogs, and resources</p>
      </header>
      <LinkList links={sampleLinks} />
    </div>
  );
}

export default App;