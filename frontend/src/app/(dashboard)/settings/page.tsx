'use client'

import { useState } from 'react'
import { clearApiToken, login } from '@/lib/api'

export default function SettingsPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const signIn = async () => {
    setError('')
    try {
      await login(username.trim(), password)
      setPassword('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to sign in.')
    }
  }

  const removeToken = () => {
    clearApiToken()
    setUsername('')
    setPassword('')
    setSaved(false)
    setError('')
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">Connect this dashboard to your Django account.</p>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900">Django account</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">Sign in with your company owner account to load and manage interview data.</p>
          <input
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
          <div className="flex items-center gap-3 mt-4">
            <button onClick={signIn} disabled={!username.trim() || !password} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg">
              Sign in
            </button>
            <button onClick={removeToken} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
              Clear token
            </button>
            {saved && <span className="text-xs text-emerald-600">Token saved</span>}
          </div>
          {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
        </div>
      </div>
    </div>
  )
}