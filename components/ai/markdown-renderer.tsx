"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="ai-markdown text-sm leading-relaxed text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-3 mb-2">{children}</h3>,
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-slate-300">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cyan-500/50 pl-4 italic text-slate-300 my-3">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const isBlock = Boolean(match)
            if (isBlock) {
              return (
                <pre className="bg-slate-900/80 p-3 rounded-lg overflow-x-auto my-3 border border-slate-700">
                  <code className={className}>{children}</code>
                </pre>
              )
            }
            return (
              <code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-xs text-cyan-300 font-mono">
                {children}
              </code>
            )
          },
          pre: ({ children }) => <pre className="bg-slate-900/80 p-3 rounded-lg overflow-x-auto my-3 border border-slate-700">{children}</pre>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border border-slate-700 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-800/80">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-slate-700 last:border-0">{children}</tr>,
          th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-semibold text-white">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 text-xs text-slate-300">{children}</td>,
          a: ({ href, children }) => (
            <a href={href} className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          hr: () => <hr className="border-slate-700 my-4" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}