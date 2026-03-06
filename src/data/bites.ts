// Knowledge bites loaded from knowledge_bites.json
// Types reflect the JSON structure: quiz, fact, and tip types

export interface Bite {
  id: number;
  category: "Technical" | "Soft Skills" | "General Knowledge";
  type: "quiz" | "fact" | "tip";
  content: string;
  options: string[] | null;
  answer: string | null;
  explanation: string | null;
  tags: string[];
  last_delivered: string | null;
}

// This will be populated at runtime from the JSON file
let _bites: Bite[] = [];
let _loaded = false;
let _loadPromise: Promise<void> | null = null;

export async function loadBites(): Promise<Bite[]> {
  if (_loaded) return _bites;
  if (_loadPromise) {
    await _loadPromise;
    return _bites;
  }
  _loadPromise = fetch("/data/knowledge_bites.json")
    .then((res) => res.json())
    .then((data: Bite[]) => {
      _bites = data;
      _loaded = true;
    })
    .catch((err) => {
      console.error("Failed to load bites:", err);
      _bites = [];
      _loaded = true;
    });
  await _loadPromise;
  return _bites;
}

// Synchronous access (returns empty array until loaded)
export function getBites(): Bite[] {
  return _bites;
}

// Helper: get only quiz-type bites
export function getQuizBites(): Bite[] {
  return _bites.filter((b) => b.type === "quiz" && b.options && b.answer);
}

// Helper: get random unique quiz bites (for challenges/duels)
export function getRandomQuizBites(count: number = 5, excludeIds: number[] = []): Bite[] {
  const quizzes = getQuizBites().filter((b) => !excludeIds.includes(b.id));
  const shuffled = [...quizzes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Helper: get bites by category
export function getBitesByCategory(category: string): Bite[] {
  return _bites.filter((b) => b.category === category);
}

// Keep backward compat: export as `bites` (synchronous, populated after load)
export { _bites as bites };
