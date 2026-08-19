'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Filter, Clock, Hash, FileText, DollarSign, Activity, TrendingUp, Sparkles, AlertCircle, Link2 as Link2Icon } from 'lucide-react'
import { DifficultyBadge } from '@/components/shared/difficulty-badge'
import { QUESTIONS, CATEGORIES } from '@/lib/data'
import { Difficulty } from '@/types'

const STATS = [
  { label: 'Questions Generated', value: '1,842', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Total Spent', value: '18,420 Br', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Interviews', value: '7', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
]

const ACTIVITY = [
  { icon: Sparkles, text: 'Created Backend Interview — 8 questions', time: '2 hours ago', color: 'text-indigo-500 bg-indigo-50' },
  { icon: DollarSign, text: 'Payment successful — $12.00', time: '5 hours ago', color: 'text-emerald-500 bg-emerald-50' },
  { icon: Link2Icon, text: 'Generated interview link for Senior Frontend', time: 'Yesterday', color: 'text-blue-500 bg-blue-50' },
  { icon: AlertCircle, text: 'Interview expired — Backend .NET Developer', time: '2 days ago', color: 'text-slate-400 bg-slate-100' },
]

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All')
  const [category, setCategory] = useState('All')

  const filtered = QUESTIONS.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase())
    const matchDiff = difficulty === 'All' || q.difficulty === difficulty
    const matchCat = category === 'All' || q.category === category
    return matchSearch && matchDiff && matchCat
  })

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={16} className={s.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Technical Question Library</h1>
            <p className="text-sm text-slate-500 mt-0.5">{filtered.length} questions available</p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus size={15} />
            Create Custom Interview
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter questions..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-400" />
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  difficulty === d
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer">
            <option>Sort: Most Used</option>
            <option>Sort: Newest</option>
            <option>Sort: Difficulty</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide w-24">Difficulty</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Question Title</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide w-40">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide w-28">
                  <div className="flex items-center gap-1"><Clock size={11} />Est. Time</div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide w-28">
                  <div className="flex items-center gap-1"><Hash size={11} />Uses</div>
                </th>
                <th className="py-3 px-4 w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr
                  key={q.id}
                  className={`group hover:bg-slate-50 transition-colors ${i !== filtered.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <td className="py-3 px-4"><DifficultyBadge difficulty={q.difficulty} /></td>
                  <td className="py-3 px-4">
                    <Link href={`/review/${q.id}`} className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 transition-colors">
                      {q.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-500">{q.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-slate-600">{q.time}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-slate-600">{q.uses.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/review/${q.id}`}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 inline-block"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Timeline */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg ${a.color.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
                  <a.icon size={13} className={a.color.split(' ')[0]} />
                </div>
                <p className="text-sm text-slate-700 flex-1">{a.text}</p>
                <p className="text-xs text-slate-400">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}