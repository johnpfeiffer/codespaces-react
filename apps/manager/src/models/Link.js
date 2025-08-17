export class Link {
  constructor(url, title, tags = []) {
    this.id = Date.now() + Math.random();
    this.url = url;
    this.title = title;
    this.tags = tags;
    this.createdAt = new Date();
  }
}

export const sampleLinks = [
  new Link(
    "https://a16z.com/podcast/",
    "a16z Podcast",
    ["VC", "Technology", "Startups"]
  ),
  new Link(
    "https://fs.blog/",
    "Farnam Street Blog",
    ["Mental Models", "Decision Making", "Leadership"]
  ),
  new Link(
    "https://stratechery.com/",
    "Stratechery",
    ["Business Strategy", "Technology", "Analysis"]
  ),
  new Link(
    "https://www.ycombinator.com/blog",
    "Y Combinator Blog",
    ["VC", "Startups", "Entrepreneurship"]
  ),
  new Link(
    "https://hbr.org/podcasts",
    "Harvard Business Review Podcasts",
    ["Management", "Leadership", "Business"]
  ),
  new Link(
    "https://www.ted.com/topics/technology",
    "TED Talks - Technology",
    ["Technology", "Innovation", "Computer Science"]
  )
];