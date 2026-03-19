export interface Scorecard {
  options: string[];
  categories: string[];
  scores: number[][]; // scores[optionIndex][categoryIndex]
}

/**
 * Parse a markdown scorecard table from the verdict text.
 * Expects format:
 * | Option | Evidence | Relevance | Practicality | Overall |
 * | --- | --- | --- | --- | --- |
 * | Option A | 8 | 7 | 9 | 8 |
 * | Option B | 6 | 8 | 5 | 6 |
 */
export function parseScorecard(verdictText: string): Scorecard | null {
  // Find the scores table section
  const lines = verdictText.split('\n');

  // Look for a table header line containing "Option" and score categories
  let headerLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && /option/i.test(line) && (
      /evidence/i.test(line) || /relevance/i.test(line) ||
      /overall/i.test(line) || /score/i.test(line) ||
      /practicality/i.test(line) || /quality/i.test(line)
    )) {
      headerLineIdx = i;
      break;
    }
  }

  if (headerLineIdx === -1) return null;

  // Parse header columns
  const headerCells = lines[headerLineIdx]
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean);

  if (headerCells.length < 3) return null;

  // First cell is "Option", rest are categories
  const categories = headerCells.slice(1);

  // Skip separator line (| --- | --- | ...)
  const dataStartIdx = headerLineIdx + 2;

  const options: string[] = [];
  const scores: number[][] = [];

  for (let i = dataStartIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) break;

    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);

    if (cells.length < 2) break;

    options.push(cells[0]);
    const rowScores = cells.slice(1).map((c) => {
      const num = parseFloat(c.replace(/[^\d.]/g, ''));
      return isNaN(num) ? 0 : Math.min(10, Math.max(0, num));
    });

    // Pad with 0s if fewer scores than categories
    while (rowScores.length < categories.length) {
      rowScores.push(0);
    }

    scores.push(rowScores);
  }

  if (options.length < 2 || categories.length < 2) return null;

  return { options, categories, scores };
}
