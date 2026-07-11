export type AIMode = "tutor" | "summary" | "quiz" | "coach"

export interface AIRequest {
  mode: AIMode
  prompt: string
  context?: string
}

export interface AIResponse {
  success: boolean
  response?: string
  error?: string
}