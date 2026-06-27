import type { Hint } from "./types"

export function getHints(topicId: string, questionType: string): Hint[] {
  // Base hints that apply to most math problems
  const baseHints: Hint[] = [
    {
      level: 1,
      text: "Read the question carefully. What is it asking for?",
    },
    {
      level: 2,
      text: "Think about what formula or method you need to use.",
    },
    {
      level: 3,
      text: "Write down the first step to solve this problem.",
    },
    {
      level: 4,
      text: "Try isolating the variable. What operation would help?",
    },
  ]

  // Topic-specific hints
  const topicHints: Record<string, Hint[]> = {
    "m1-integers": [
      { level: 1, text: "Remember the rules for adding and subtracting negative numbers." },
      { level: 2, text: "Think about the number line. Which direction are you moving?" },
      { level: 3, text: "Convert subtraction to addition of the opposite." },
      { level: 4, text: "Example: 5 - 3 = 5 + (-3) = 2" },
    ],
    "m1-linear-equations": [
      { level: 1, text: "Your goal is to isolate the variable on one side." },
      { level: 2, text: "Remember: whatever you do to one side, do to the other." },
      { level: 3, text: "Move all terms with the variable to one side first." },
      { level: 4, text: "Example: 2x + 5 = 15 → 2x = 10 → x = 5" },
    ],
    "m2-factoring": [
      { level: 1, text: "Look for a common factor in all terms." },
      { level: 2, text: "For ax² + bx + c, find two numbers that multiply to ac and add to b." },
      { level: 3, text: "Try factoring by grouping if there are 4 terms." },
      { level: 4, text: "Example: x² + 5x + 6 = (x + 2)(x + 3)" },
    ],
    "m3-quadratics": [
      { level: 1, text: "Is the equation in standard form: ax² + bx + c = 0?" },
      { level: 2, text: "You can use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a" },
      { level: 3, text: "Calculate the discriminant first: b² - 4ac" },
      { level: 4, text: "If discriminant > 0, two real solutions. If = 0, one solution. If < 0, no real solutions." },
    ],
  }

  // Return topic-specific hints if available, otherwise base hints
  return topicHints[topicId] || baseHints
}

export function getHintForLevel(hints: Hint[], level: number): Hint | null {
  return hints.find((h) => h.level === level) || null
}

export function getNextHint(hints: Hint[], currentLevel: number): Hint | null {
  const nextLevel = currentLevel + 1
  return hints.find((h) => h.level === nextLevel) || null
}