/**
 * Simple fuzzy search: scores how well `query` matches `text`.
 * Returns 0 for no match, higher for better matches.
 * Rewards consecutive character runs and early matches.
 */
export function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  if (!q) return 0;

  let qi = 0;
  let score = 0;
  let consecutive = 0;
  let lastMatchIndex = -2;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      // Bonus for consecutive matches
      consecutive = ti === lastMatchIndex + 1 ? consecutive + 1 : 1;
      score += consecutive;
      // Bonus for matching at start or after a separator
      if (ti === 0 || t[ti - 1] === ' ' || t[ti - 1] === '-' || t[ti - 1] === '/') {
        score += 2;
      }
      lastMatchIndex = ti;
    }
  }

  // All query chars must be found
  if (qi < q.length) return 0;

  return score;
}

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  iconColor: string;
  status: string;
  score: number;
}

export function fuzzyFilter(
  query: string,
  items: { title: string; description: string; href: string; iconColor: string; status: string }[],
): SearchResult[] {
  if (!query.trim()) return [];

  return items
    .map((item) => {
      const titleScore = fuzzyScore(query, item.title) * 2;
      const descScore = fuzzyScore(query, item.description);
      const score = Math.max(titleScore, descScore);
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}
