'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, Code2, ChevronRight } from 'lucide-react'
import { DifficultyBadge } from '@/components/shared/difficulty-badge'
import { QUESTIONS } from '@/lib/data'

export default function ReviewQuestionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const q = QUESTIONS.find(item => item.id === Number(params.id)) ?? QUESTIONS[0]

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />Back to Library
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{q.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <DifficultyBadge difficulty={q.difficulty} />
              <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={11} />{q.time}</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Code2 size={11} />{q.category}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Problem Description</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{q.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Sample Input</h3>
            <pre className="text-sm font-mono bg-slate-50 rounded-lg p-3 text-slate-800 overflow-auto">{q.sampleInput}</pre>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Sample Output</h3>
            <pre className="text-sm font-mono bg-slate-50 rounded-lg p-3 text-slate-800 overflow-auto">{q.sampleOutput}</pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Constraints</h3>
          <ul className="space-y-1.5">
            {q.constraints.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <code className="font-mono text-xs bg-slate-50 px-1.5 py-0.5 rounded">{c}</code>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Test Cases</h3>
          <div className="space-y-2">
            {q.testCases.map((tc, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">Input</p>
                  <code className="text-xs font-mono text-slate-700">{tc.input}</code>
                </div>
                <ChevronRight size={13} className="text-slate-300" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">Output</p>
                  <code className="text-xs font-mono text-emerald-600">{tc.output}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={15} />Back
          </button>
          <button
            onClick={() => router.push('/behavioral')}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Add to Interview<ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}