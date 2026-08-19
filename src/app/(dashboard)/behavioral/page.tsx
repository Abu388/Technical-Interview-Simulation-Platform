'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Plus, X, Check } from 'lucide-react'
import { WizardProgress } from '@/components/shared/wizard-progress'

export default function BehavioralSetupPage() {
  const router = useRouter()
  const [useAI, setUseAI] = useState(true)
  const [questions, setQuestions] = useState([
    'Tell me about a difficult project you handled.',
    'Describe a time you had a conflict with a teammate.',
    "What's your biggest technical achievement?",
  ])
  const [expiry, setExpiry] = useState('2025-08-07')
  const [duration, setDuration] = useState('90')
  const [expiryPreset, setExpiryPreset] = useState('1week')

  const addQuestion = () => setQuestions([...questions, ''])
  const updateQuestion = (i: number, val: string) => {
    const updated = [...questions]
    updated[i] = val
    setQuestions(updated)
  }
  const removeQuestion = (i: number) => setQuestions(questions.filter((_, idx) => idx !== i))

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <WizardProgress current={1} />

        <h1 className="text-xl font-bold text-slate-900 mb-1">Behavioral Questions</h1>
        <p className="text-sm text-slate-500 mb-6">Step 2 of 3 — Behavioral Interview Setup</p>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setUseAI(!useAI)}
              className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${useAI ? 'bg-indigo-600' : 'border-2 border-slate-300'}`}
            >
              {useAI && <Check size={12} className="text-white" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Generate AI behavioral questions using the candidate's resume</p>
              <p className="text-xs text-slate-500 mt-0.5">Our AI will automatically generate relevant behavioral questions based on the candidate's uploaded resume and job requirements.</p>
            </div>
          </label>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Custom Behavioral Questions</h3>
            <button
              onClick={addQuestion}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={13} />Add Question
            </button>
          </div>
          <div className="space-y-2.5">
            {questions.map((q, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 w-5 flex-shrink-0">{i + 1}.</span>
                <input
                  value={q}
                  onChange={e => updateQuestion(i, e.target.value)}
                  placeholder="e.g. Tell me about a difficult project you handled."
                  className="flex-1 px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                />
                <button onClick={() => removeQuestion(i)} className="w-7 h-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Scheduling & Limits</h3>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Interview Expiration</label>
            <div className="flex gap-2 mb-2">
              {[['24h', '24 hours'], ['3d', '3 days'], ['1week', '1 week'], ['custom', 'Custom']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setExpiryPreset(val)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    expiryPreset === val ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {expiryPreset === 'custom' && (
              <input
                type="date"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Time Limit per Interview</label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 transition-all cursor-pointer"
            >
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.push('/create')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={15} />Back
          </button>
          <button
            onClick={() => router.push('/generating')}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Generate Interview Link<ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}