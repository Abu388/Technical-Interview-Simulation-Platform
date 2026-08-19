'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, ListChecks, BarChart3, Zap, Clock, Building2, Calendar,
  FileText, User, Link2, Copy, Check, Share2, Eye, RefreshCw, Download,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { INTERVIEWS } from '@/lib/data'

export default function GeneratedLinksPage() {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = (id: string, link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const summaryCards = [
    { label: 'Total Interviews', value: INTERVIEWS.length, icon: ListChecks, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Questions Generated', value: INTERVIEWS.reduce((a, b) => a + b.questions, 0), icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Links', value: INTERVIEWS.filter(i => i.status === 'Active').length, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Expired Links', value: INTERVIEWS.filter(i => i.status === 'Expired').length, icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100' },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Generated Interviews</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and share your interview links</p>
          </div>
          <button
            onClick={() => router.push('/create')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus size={15} />New Interview
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {summaryCards.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={16} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {INTERVIEWS.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">{inv.title}</h3>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Building2 size={11} />{inv.company}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />Created {inv.created}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />Expires {inv.expires}</span>
                    <span className="flex items-center gap-1"><FileText size={11} />{inv.questions} questions</span>
                    <span className="flex items-center gap-1"><User size={11} />{inv.candidates} candidates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                      <Link2 size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-mono text-slate-600 truncate">{inv.link}</span>
                    </div>
                    <button
                      onClick={() => copy(inv.id, inv.link)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                        copiedId === inv.id ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {copiedId === inv.id ? <Check size={12} /> : <Copy size={12} />}
                      {copiedId === inv.id ? 'Copied!' : 'Copy'}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg transition-colors">
                      <Share2 size={12} />Share
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Eye size={12} />View
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <RefreshCw size={12} />Regenerate
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <Download size={12} />Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}