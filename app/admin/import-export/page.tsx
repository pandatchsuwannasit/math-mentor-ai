"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Download, FileJson, FileText, CheckCircle2, AlertTriangle } from "lucide-react"
import AdminLayout from "@/app/admin/layout"

export default function ImportExportPage() {
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json")
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")

  const handleExport = () => {
    // Placeholder - would export actual data
    alert(`Exporting as ${exportFormat.toUpperCase()}...`)
  }

  const handleImport = () => {
    setImportStatus("success")
    setImportMessage("Import completed successfully! (Placeholder)")
    setTimeout(() => setImportStatus("idle"), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Import / Export</h1>
        <p className="mt-2 text-slate-400">Backup and restore content</p>
      </div>

      {/* Export Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="size-6 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Export Content</h2>
        </div>
        <p className="mb-4 text-sm text-slate-400">
          Download all lessons and questions as a backup file.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setExportFormat("json")}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
              exportFormat === "json"
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                : "border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <FileJson className="size-4" />
            JSON
          </button>
          <button
            onClick={() => setExportFormat("csv")}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
              exportFormat === "csv"
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                : "border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <FileText className="size-4" />
            CSV
          </button>
        </div>

        <button
          onClick={handleExport}
          className="mt-4 flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400"
        >
          <Download className="size-4" />
          Export Now
        </button>
      </div>

      {/* Import Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="size-6 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Import Content</h2>
        </div>
        <p className="mb-4 text-sm text-slate-400">
          Upload a backup file to restore lessons and questions. Validation will run automatically.
        </p>

        <div className="rounded-lg border-2 border-dashed border-slate-800 p-8 text-center">
          <FileJson className="mx-auto size-12 text-slate-600" />
          <p className="mt-2 text-sm text-slate-400">
            Drag and drop your file here, or click to browse
          </p>
          <input type="file" className="hidden" accept=".json,.csv" />
          <button className="mt-4 rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-400 hover:border-cyan-500/30 hover:text-white">
            Choose File
          </button>
        </div>

        {importStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 flex items-center gap-2 rounded-lg p-4 ${
              importStatus === "success"
                ? "border border-emerald-500/30 bg-emerald-500/10"
                : "border border-red-500/30 bg-red-500/10"
            }`}
          >
            {importStatus === "success" ? (
              <CheckCircle2 className="size-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="size-5 text-red-400" />
            )}
            <span className={`text-sm ${importStatus === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {importMessage}
            </span>
          </motion.div>
        )}

        <button
          onClick={handleImport}
          className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
        >
          <Upload className="size-4" />
          Import & Validate
        </button>
      </div>

      {/* Backup Info */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
        <p className="text-sm text-cyan-400">
          Tip: Regular backups are recommended. Export your content weekly to prevent data loss.
        </p>
      </div>
    </div>
  )
}