export interface Citation {
  index: number;
  url: string;
  domain: string;
}

export interface CitationResult {
  processedText: string;
  citations: Citation[];
}

/**
 * Detect URLs in text and replace them with numbered inline citations.
 * Returns the processed text and a list of unique citations.
 */
export function processCitations(text: string): CitationResult {
  const citations: Citation[] = [];
  const urlMap = new Map<string, number>();

  // Match URLs: http/https, optionally wrapped in markdown links or parentheses
  // Also handles URLs in markdown link syntax [text](url)
  const urlRegex = /(?:\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\))|(https?:\/\/[^\s\)\]>,]+)/g;

  const processedText = text.replace(urlRegex, (match, linkText, markdownUrl, bareUrl) => {
    const url = markdownUrl || bareUrl;
    if (!url) return match;

    let citationIndex: number;

    if (urlMap.has(url)) {
      citationIndex = urlMap.get(url)!;
    } else {
      citationIndex = citations.length + 1;
      urlMap.set(url, citationIndex);

      let domain: string;
      try {
        domain = new URL(url).hostname.replace(/^www\./, '');
      } catch {
        domain = url;
      }

      citations.push({ index: citationIndex, url, domain });
    }

    // If it was a markdown link [text](url), keep the text and add citation
    if (linkText && markdownUrl) {
      return `${linkText} [^${citationIndex}]`;
    }

    // Bare URL — replace with citation marker
    return `[^${citationIndex}]`;
  });

  return { processedText, citations };
}
