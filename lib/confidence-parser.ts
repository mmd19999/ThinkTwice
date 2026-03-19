/**
 * Parse confidence scores from the judge's evaluation text.
 * Expects format: SCORES: [Option A]=7/10, [Option B]=5/10
 */
export function parseConfidenceScores(
  evaluationText: string,
  options: string[]
): Record<string, number> | null {
  // Look for SCORES: line
  const lines = evaluationText.split('\n');
  let scoresLine = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('SCORES:')) {
      scoresLine = trimmed.slice('SCORES:'.length).trim();
      break;
    }
  }

  if (!scoresLine) return null;

  const scores: Record<string, number> = {};

  // Parse [Option]=X/10 or Option=X/10 patterns
  const pattern = /\[?([^\]=]+)\]?\s*=\s*(\d+(?:\.\d+)?)\s*\/\s*10/g;
  let match;

  while ((match = pattern.exec(scoresLine)) !== null) {
    const name = match[1].trim();
    const score = parseFloat(match[2]);

    if (!isNaN(score)) {
      // Try to match against known options (case-insensitive, partial match)
      const matchedOption = options.find(
        (o) =>
          o.toLowerCase() === name.toLowerCase() ||
          o.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(o.toLowerCase())
      );

      if (matchedOption) {
        scores[matchedOption] = Math.min(10, Math.max(0, score));
      } else {
        scores[name] = Math.min(10, Math.max(0, score));
      }
    }
  }

  return Object.keys(scores).length > 0 ? scores : null;
}
