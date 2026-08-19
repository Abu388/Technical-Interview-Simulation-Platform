'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Eye, Plus, Share2 } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const link = 'https://interview.hirepath.ai/i/x9q21z'
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Interview Successfully Created</h2>
        <p className="text-sm text-slate-500 mb-8">Your interview is ready to share with candidates</p>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 text-left">
          <div className="space-y-3">
            {[
              ['Interview ID', 'INT-005'],
              ['Questions', '13 questions'],
              ['Expires', 'Aug 7, 2025'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-800">{value}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-3 mt-1">
              <p className="text-xs font-semibold text-slate-500 mb-2">Interview Link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 truncate">
                  {link}
                </div>
                <button
                  onClick={copy}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
              <Share2 size={14} />Share
            </button>
            <button
              onClick={() => router.push('/links')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Eye size={14} />View Interview
            </button>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-indigo-600 hover:bg-indigo-50 text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={14} />Generate Another
          </button>
        </div>
      </div>
    </div>
  )
}