export function parseMarkdown(markdown) {
  let html = markdown;
  
  // Escape HTML
  html = html.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;');
  
  // Headers (h1-h6)
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');
  html = html.replace(/^___$/gm, '<hr>');
  
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');
  
  // Unordered lists
  html = html.replace(/^\* (.+)$/gm, '<ul><li>$1</li></ul>');
  html = html.replace(/^- (.+)$/gm, '<ul><li>$1</li></ul>');
  html = html.replace(/^\+ (.+)$/gm, '<ul><li>$1</li></ul>');
  // Merge consecutive ul items
  html = html.replace(/<\/ul>\n<ul>/g, '');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<ol><li>$1</li></ol>');
  // Merge consecutive ol items
  html = html.replace(/<\/ol>\n<ol>/g, '');
  
  // Bold (must come before italic to handle ***text***)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Links with titles
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\s+"([^"]+)"\)/g, '<a href="$2" title="$3">$1</a>');
  // Links without titles
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Line breaks (two spaces at end of line)
  html = html.replace(/  $/gm, '<br>');
  
  // Paragraphs (wrap lines that aren't already wrapped in tags)
  const lines = html.split('\n');
  const processedLines = [];
  let inParagraph = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '') {
      if (inParagraph) {
        processedLines[processedLines.length - 1] += '</p>';
        inParagraph = false;
      }
      continue;
    }
    
    // Check if line is already wrapped in a block-level tag
    const isBlockLevel = /^<(h[1-6]|ul|ol|li|blockquote|hr|p)/.test(line);
    
    if (!isBlockLevel) {
      if (!inParagraph) {
        processedLines.push('<p>' + line);
        inParagraph = true;
      } else {
        processedLines[processedLines.length - 1] += '\n' + line;
      }
    } else {
      if (inParagraph) {
        processedLines[processedLines.length - 1] += '</p>';
        inParagraph = false;
      }
      processedLines.push(line);
    }
  }
  
  if (inParagraph) {
    processedLines[processedLines.length - 1] += '</p>';
  }
  
  return processedLines.join('\n');
}

export function extractMetadata(markdown) {
  const lines = markdown.split('\n');
  const metadata = {
    title: '',
    date: '',
    excerpt: ''
  };
  
  // Check for front matter (simple format)
  if (lines[0] === '---') {
    let i = 1;
    while (i < lines.length && lines[i] !== '---') {
      const [key, ...valueParts] = lines[i].split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        if (key.trim().toLowerCase() === 'title') {
          metadata.title = value;
        } else if (key.trim().toLowerCase() === 'date') {
          metadata.date = value;
        } else if (key.trim().toLowerCase() === 'excerpt') {
          metadata.excerpt = value;
        }
      }
      i++;
    }
    // Remove front matter from content
    if (i < lines.length) {
      markdown = lines.slice(i + 1).join('\n');
    }
  }
  
  // If no title in front matter, try to extract from first h1
  if (!metadata.title) {
    const h1Match = markdown.match(/^# (.+)$/m);
    if (h1Match) {
      metadata.title = h1Match[1];
    }
  }
  
  // Generate excerpt if not provided
  if (!metadata.excerpt) {
    const cleanText = markdown
      .replace(/^#+ .+$/gm, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove link URLs
      .replace(/[*_]+/g, '') // Remove emphasis markers
      .replace(/^---$/gm, '') // Remove horizontal rules
      .replace(/^[>\-*+] /gm, '') // Remove list/quote markers
      .trim();
    
    metadata.excerpt = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
  }
  
  return { metadata, content: markdown };
}