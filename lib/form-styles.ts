export const inputClassName =
  "w-full mt-2 p-3 rounded-lg bg-slate-800 text-white border border-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"

export const labelClassName = "text-slate-300 text-sm font-medium"

export const primaryButtonClassName =
  "w-full mt-6 p-3 rounded-lg bg-cyan-500 text-white font-semibold transition-colors hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"

export const secondaryLinkClassName =
  "block w-full mt-3 p-3 rounded-lg border border-slate-600 text-white text-center transition-colors hover:bg-slate-800"

export const cardClassName =
  "w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8"

export const errorClassName =
  "mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"

export const selectChipClassName = (selected: boolean) =>
  `rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
    selected
      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
      : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
  }`
