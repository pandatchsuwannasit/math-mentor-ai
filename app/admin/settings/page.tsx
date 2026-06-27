"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, Bell, Shield, Palette, Globe } from "lucide-react"
import AdminLayout from "@/app/admin/layout"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Math Mentor AI",
    siteDescription: "AI-powered mathematics learning platform",
    defaultLanguage: "th",
    enableNotifications: true,
    enableAnalytics: true,
    maintenanceMode: false,
    maxQuestionsPerTopic: 100,
    defaultDifficulty: "medium",
    enableGuestAccess: true,
    requireEmailVerification: false,
  })

  const handleSave = () => {
    alert("Settings saved successfully! (Placeholder)")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-slate-400">Manage platform configuration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="size-6 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Default Language</label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="th">Thai</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="size-6 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Content</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Max Questions Per Topic</label>
              <input
                type="number"
                value={settings.maxQuestionsPerTopic}
                onChange={(e) => setSettings({ ...settings, maxQuestionsPerTopic: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Default Difficulty</label>
              <select
                value={settings.defaultDifficulty}
                onChange={(e) => setSettings({ ...settings, defaultDifficulty: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Settings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="size-6 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Access Control</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable Guest Access</p>
                <p className="text-xs text-slate-400">Allow users to access without registration</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableGuestAccess: !settings.enableGuestAccess })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableGuestAccess ? "bg-cyan-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableGuestAccess ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Require Email Verification</p>
                <p className="text-xs text-slate-400">Users must verify email before accessing</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireEmailVerification ? "bg-cyan-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireEmailVerification ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="size-6 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">System</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable Notifications</p>
                <p className="text-xs text-slate-400">Send system notifications to users</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableNotifications ? "bg-cyan-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable Analytics</p>
                <p className="text-xs text-slate-400">Collect usage analytics</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableAnalytics: !settings.enableAnalytics })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableAnalytics ? "bg-cyan-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableAnalytics ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Maintenance Mode</p>
                <p className="text-xs text-slate-400">Temporarily disable public access</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? "bg-red-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-400"
        >
          <Settings className="size-4" />
          Save Settings
        </button>
      </div>
    </div>
  )
}