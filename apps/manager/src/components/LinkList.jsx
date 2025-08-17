import React, { useState } from 'react';

function LinkList({ links }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = [...new Set(links.flatMap(link => link.tags))].sort();

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