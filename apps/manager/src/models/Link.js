import linksData from '../content/links.json';

export class Link {
  constructor(url, title, tags = []) {
    this.id = Date.now() + Math.random();
    this.url = url;
    this.title = title;
    this.tags = tags;
    this.createdAt = new Date();
  }
}

export const sampleLinks = linksData.links.map(link =>
  new Link(link.url, link.title, link.tags)
);

