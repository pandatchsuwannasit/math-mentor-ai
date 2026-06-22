export { M1_QUESTIONS } from "./m1"
export { M2_QUESTIONS } from "./m2"
export { M3_QUESTIONS } from "./m3"
export { M4_QUESTIONS } from "./m4"
export { M5_QUESTIONS } from "./m5"
export { M6_QUESTIONS } from "./m6"

import type { TopicQuestions } from "./types"
import { M1_QUESTIONS } from "./m1"
import { M2_QUESTIONS } from "./m2"
import { M3_QUESTIONS } from "./m3"
import { M4_QUESTIONS } from "./m4"
import { M5_QUESTIONS } from "./m5"
import { M6_QUESTIONS } from "./m6"

export const QUESTION_BANK: Record<string, TopicQuestions> = {
  M1: M1_QUESTIONS,
  M2: M2_QUESTIONS,
  M3: M3_QUESTIONS,
  M4: M4_QUESTIONS,
  M5: M5_QUESTIONS,
  M6: M6_QUESTIONS,
}

export function getQuestionsForTopic(topicId: string): import("./types").QuizQuestion[] {
  for (const [, topics] of Object.entries(QUESTION_BANK)) {
    if (topics[topicId]) {
      return topics[topicId]
    }
  }
  return []
}

export function getTopicProgress(topicId: string): import("./types").TopicProgress | null {
  try {
    const stored = localStorage.getItem("mathmentor-topic-progress")
    if (!stored) return null
    const allProgress: Record<string, import("./types").TopicProgress> = JSON.parse(stored)
    return allProgress[topicId] || null
  } catch {
    return null
  }
}

export function getAllTopicProgress(): Record<string, import("./types").TopicProgress> {
  try {
    const stored = localStorage.getItem("mathmentor-topic-progress")
    if (!stored) return {}
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export function saveTopicProgress(topicId: string, progress: import("./types").TopicProgress): void {
  try {
    const stored = localStorage.getItem("mathmentor-topic-progress")
    const allProgress: Record<string, import("./types").TopicProgress> = stored ? JSON.parse(stored) : {}
    allProgress[topicId] = progress
    localStorage.setItem("mathmentor-topic-progress", JSON.stringify(allProgress))
  } catch {
    // ignore storage errors
  }
}