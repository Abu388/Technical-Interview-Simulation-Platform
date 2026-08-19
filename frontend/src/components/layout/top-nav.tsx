'use client'

import { useState } from 'react'
import { Search, Bell, ChevronDown, CheckCircle2, Copy, Brain } from 'lucide-react'

const NOTIFICATIONS = [
  { icon: CheckCircle2, text: 'Payment successful — $6.00', sub: '2 hours ago', color: 'text-emerald-500' },
  { icon: CheckCircle2, text: 'Interview completed by candidate', sub: '5 hours ago', color: 'text-blue-500' },
  { icon: Copy, text: 'Interview link copied', sub: 'Yesterday', color: 'text-slate-400' },
]

export function TopNav() {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-40">
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Brain size={15} className="text-white" />
        </div>
        <span className="font-semibold text-slate-900 text-sm">HirePath</span>
      </div>

      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions, interviews..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 relative">
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
        </button>

        {notifOpen && (
          <div className="absolute top-11 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
            </div>
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                <n.icon size={15} className={`mt-0.5 flex-shrink-0 ${n.color}`} />
                <div>
                  <p className="text-sm text-slate-800">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-indigo-700">TC</span>
          </div>
          <span className="text-sm font-medium text-slate-700">TechCorp</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>
    </header>
  )
}