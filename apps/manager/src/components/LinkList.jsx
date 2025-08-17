import React, { useState } from 'react';

function LinkList({ links, onAddLink }) {
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTags, setNewTags] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = [...new Set(links.flatMap(link => link.tags))].sort();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUrl && newTitle) {
      const tags = newTags.split(',').map(tag => tag.trim()).filter(Boolean);
      onAddLink(newUrl, newTitle, tags);
      setNewUrl('');
      setNewTitle('');
      setNewTags('');
    }
  };

  const toggleTagFilter = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredLinks = selectedTags.length > 0
    ? links.filter(link => selectedTags.some(tag => link.tags.includes(tag)))
    : links;

  return (
    <>
      <section className="add-link-form">
        <h3>Add New Link</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="url"
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
          />
          <button type="submit">Add Link</button>
        </form>
      </section>

      <section className="tag-filters">
        <h3>Filter by Tags</h3>
        <div className="tag-list">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTagFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <button className="clear-filters" onClick={() => setSelectedTags([])}>
            Clear Filters
          </button>
        )}
      </section>

      <section className="links">
        <h3>Links ({filteredLinks.length})</h3>
        {filteredLinks.map(link => (
          <article key={link.id} className="link-item">
            <h4>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            </h4>
            <div className="tags">
              {link.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export default LinkList;