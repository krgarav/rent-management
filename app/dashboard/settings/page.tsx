'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import { Moon, Sun, Save } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isSaving, setIsSaving] = useState(false)

  if (!user) {
    return <div className="text-center py-12">Access denied</div>
  }

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone
            </label>
            <input
              type="tel"
              defaultValue={user.phone || ''}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <input
              type="text"
              value={user.role.replace('_', ' ').toUpperCase()}
              disabled
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                  theme === 'light'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-background text-foreground hover:bg-secondary'
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-background text-foreground hover:bg-secondary'
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
        <div className="space-y-4">
          <button className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-left font-medium text-foreground hover:bg-secondary transition-colors">
            Change Password
          </button>
          <button className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-left font-medium text-foreground hover:bg-secondary transition-colors">
            Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              logout()
            }
          }}
          className="rounded-lg border border-destructive bg-destructive/10 px-4 py-2.5 font-medium text-destructive hover:bg-destructive/20 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button className="rounded-lg border border-border bg-background px-6 py-2.5 font-semibold text-foreground hover:bg-secondary transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
