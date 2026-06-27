"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileEdit, Save, Eye, Plus, Trash2 } from "lucide-react"
import AdminLayout from "@/app/admin/layout"

export default function QuestionEditorPage() {
  const [question, setQuestion] = useState({
    text: "",
    choices: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    hints: [""],
    difficulty: "medium",
    curriculum: "M1",
    topic: "",
    learningObjective: "",
    estimatedTime: 60,
    tags: "",
  })

  const handleSave = () => {
    console.log("Saving question:", question)
    alert("Question saved successfully!")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Question Editor</h1>
          <p className="mt-2 text-slate-400">Create and edit questions</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-400 hover:border-cyan-500/30 hover:text-white">
            <Eye className="size-4" />
            Preview
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400">
            <Save className="size-4" />
            Save
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Question Details</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Question Text</label>
                <textarea
                  value={question.text}
                  onChange={(e) => setQuestion({ ...question, text: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter your question..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Curriculum</label>
                  <select
                    value={question.curriculum}
                    onChange={(e) => setQuestion({ ...question, curriculum: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                    <option value="M3">M3</option>
                    <option value="M4">M4</option>
                    <option value="M5">M5</option>
                    <option value="M6">M6</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Topic ID</label>
                  <input
                    type="text"
                    value={question.topic}
                    onChange={(e) => setQuestion({ ...question, topic: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g., m1-integers"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Difficulty</label>
                  <select
                    value={question.difficulty}
                    onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Estimated Time (seconds)</label>
                  <input
                    type="number"
                    value={question.estimatedTime}
                    onChange={(e) => setQuestion({ ...question, estimatedTime: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Learning Objective</label>
                <input
                  type="text"
                  value={question.learningObjective}
                  onChange={(e) => setQuestion({ ...question, learningObjective: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="What will students learn?"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={question.tags}
                  onChange={(e) => setQuestion({ ...question, tags: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g., addition, integers, basic"
                />
              </div>
            </div>
          </div>

          {/* Choices */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Answer Choices</h2>
            <div className="space-y-3">
              {question.choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={question.correctAnswer === index}
                    onChange={() => setQuestion({ ...question, correctAnswer: index })}
                    className="size-4 text-cyan-500"
                  />
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...question.choices]
                      newChoices[index] = e.target.value
                      setQuestion({ ...question, choices: newChoices })
                    }}
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder={`Choice ${index + 1}`}
                  />
                  {question.choices.length > 2 && (
                    <button
                      onClick={() => {
                        const newChoices = question.choices.filter((_, i) => i !== index)
                        setQuestion({ ...question, choices: newChoices })
                      }}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
              {question.choices.length < 6 && (
                <button
                  onClick={() => setQuestion({ ...question, choices: [...question.choices, ""] })}
                  className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  <Plus className="size-4" />
                  Add Choice
                </button>
              )}
            </div>
          </div>

          {/* Explanation & Hints */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Explanation & Hints</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Explanation</label>
                <textarea
                  value={question.explanation}
                  onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="Explain the correct answer..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Hints</label>
                {question.hints.map((hint, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <input
                      type="text"
                      value={hint}
                      onChange={(e) => {
                        const newHints = [...question.hints]
                        newHints[index] = e.target.value
                        setQuestion({ ...question, hints: newHints })
                      }}
                      className="flex-1 rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      placeholder={`Hint ${index + 1}`}
                    />
                    {question.hints.length > 1 && (
                      <button
                        onClick={() => {
                          const newHints = question.hints.filter((_, i) => i !== index)
                          setQuestion({ ...question, hints: newHints })
                        }}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setQuestion({ ...question, hints: [...question.hints, ""] })}
                  className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  <Plus className="size-4" />
                  Add Hint
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Preview</h2>
          <div className="space-y-4">
            <div>
              <span
                className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                  question.difficulty === "easy"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : question.difficulty === "medium"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {question.difficulty}
              </span>
            </div>
            <p className="text-white">{question.text || "Question preview will appear here..."}</p>
            <div className="space-y-2">
              {question.choices.map((choice, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-3 ${
                    question.correctAnswer === index
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-800 bg-slate-950/50"
                  }`}
                >
                  <span className="text-sm text-white">{choice || `Choice ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  )
}
