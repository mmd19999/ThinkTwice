export interface TopicPosition {
  option: string;
  summary: string;
}

export interface TopicComparison {
  topic: string;
  positions: TopicPosition[];
}

/**
 * Extract topics from advocate responses using heuristic parsing.
 * Looks for bold headers and their following content to identify
 * key discussion points, then groups similar topics across advocates.
 */
export function extractTopics(
  responses: string[],
  options: string[]
): TopicComparison[] {
  // Extract topics from each advocate's response
  const advocateTopics: { option: string; topics: { heading: string; content: string }[] }[] = [];

  for (let i = 0; i < responses.length; i++) {
    const option = options[i] || `Option ${i + 1}`;
    const response = responses[i];
    if (!response) continue;

    const topics: { heading: string; content: string }[] = [];

    // Pattern 1: Bold headers like **Direct Answer**, **Evidence**, etc.
    const boldPattern = /\*\*([^*]+)\*\*[:\s]*([\s\S]*?)(?=\n\*\*[^*]+\*\*|\n#{1,4}\s|$)/g;
    let match;

    while ((match = boldPattern.exec(response)) !== null) {
      const heading = match[1].trim();
      const content = match[2].trim();

      // Skip very short content or generic headers
      if (content.length < 20) continue;
      if (/^(direct answer|evidence|why|conclusion|summary)$/i.test(heading)) {
        // Keep these — they are structured response sections
      }

      // Truncate content to first 150 chars for summary
      const summary = content.length > 150
        ? content.slice(0, 150).replace(/\s+\S*$/, '') + '…'
        : content;

      topics.push({ heading, content: summary });
    }

    // Pattern 2: Markdown headers like ### Evidence, ## Key Points
    if (topics.length === 0) {
      const headerPattern = /^#{1,4}\s+(.+)$/gm;
      const sections = response.split(/^#{1,4}\s+/m).slice(1);
      const headers: string[] = [];

      while ((match = headerPattern.exec(response)) !== null) {
        headers.push(match[1].trim());
      }

      for (let j = 0; j < headers.length && j < sections.length; j++) {
        const content = sections[j].split('\n').slice(1).join(' ').trim();
        if (content.length < 20) continue;

        const summary = content.length > 150
          ? content.slice(0, 150).replace(/\s+\S*$/, '') + '…'
          : content;

        topics.push({ heading: headers[j], content: summary });
      }
    }

    advocateTopics.push({ option, topics: topics.slice(0, 4) });
  }

  // Group similar topics across advocates
  const comparisonMap = new Map<string, TopicComparison>();

  // Use standardized topic names to group
  const standardize = (heading: string): string => {
    const lower = heading.toLowerCase().trim();
    if (/direct\s*answer/i.test(lower)) return 'Direct Answer';
    if (/evidence|data|research|statistics/i.test(lower)) return 'Evidence';
    if (/why|advantage|benefit|favors/i.test(lower)) return 'Key Advantage';
    if (/practical|cost|price|budget/i.test(lower)) return 'Practicality';
    if (/performance|speed|benchmark/i.test(lower)) return 'Performance';
    return heading;
  };

  for (const advocate of advocateTopics) {
    for (const topic of advocate.topics) {
      const key = standardize(topic.heading);
      if (!comparisonMap.has(key)) {
        comparisonMap.set(key, { topic: key, positions: [] });
      }
      comparisonMap.get(key)!.positions.push({
        option: advocate.option,
        summary: topic.content,
      });
    }
  }

  // Only return topics that have positions from multiple advocates
  const results = Array.from(comparisonMap.values())
    .filter((t) => t.positions.length >= 2)
    .slice(0, 3); // Max 3 topics

  return results;
}
