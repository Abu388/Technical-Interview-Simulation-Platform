'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Timer, Hash, Building2, Briefcase } from 'lucide-react'
import { WizardProgress } from '@/components/shared/wizard-progress'
import { createInterview, createInterviewLink, getCompanies, getQuestions } from '@/lib/api'

const TEMPLATES = ['Frontend React', 'Backend .NET', 'Flutter', 'Data Structures & Algorithms', 'System Design']

export default function CreateInterviewPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    company: 'TechCorp Inc.', job: 'Senior Frontend Engineer',
    description: 'We are looking for an experienced frontend engineer proficient in React, TypeScript, and modern web technologies to join our product team.',
    sampleInput: 'function reverseString(s) { ... }', expectedOutput: 'dlrow olleh',
    date: '2026-10-01', time: '09:00', numQuestions: 10,
    easy: 30, medium: 50, hard: 20,
  })

  const submitInterview = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const [companies, questions] = await Promise.all([getCompanies(), getQuestions()])
      const company = companies.find(item => item.name === form.company) ?? companies[0]
      if (!company) throw new Error('No approved company is available for this account.')
      if (!questions.length) throw new Error('Create at least one question before creating an interview.')

      const expiration = new Date(`${form.date}T${form.time}:00Z`).toISOString()
      const interview = await createInterview({
        company: company.id,
        title: form.job,
        questions: questions.slice(0, form.numQuestions).map(question => String(question.id)),
        expiration_date: expiration,
      })
      await createInterviewLink({ interview: interview.id, expires_at: expiration })
      router.push('/links')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to create the interview.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <WizardProgress current={0} />

        <h1 className="text-xl font-bold text-slate-900 mb-1">Create Custom Interview</h1>
        <p className="text-sm text-slate-500 mb-6">Step 1 of 3 — Technical Question Setup</p>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quick Templates</p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map(t => (
              <button key={t} className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all">
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <Building2 size={11} className="inline mr-1" />Company Name
              </label>
              <input
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <Briefcase size={11} className="inline mr-1" />Job Title
              </label>
              <input
                value={form.job}
                onChange={e => setForm({ ...form, job: e.target.value })}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sample Input / Test Case</label>
              <input
                value={form.sampleInput}
                onChange={e => setForm({ ...form, sampleInput: e.target.value })}
                className="w-full px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expected Output</label>
              <input
                value={form.expectedOutput}
                onChange={e => setForm({ ...form, expectedOutput: e.target.value })}
                className="w-full px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <Calendar size={11} className="inline mr-1" />Expected Completion Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <Timer size={11} className="inline mr-1" />Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              <Hash size={11} className="inline mr-1" />Number of Technical Questions
            </label>
            <input
              type="number"
              value={form.numQuestions}
              onChange={e => setForm({ ...form, numQuestions: parseInt(e.target.value) || 0 })}
              min={1} max={30}
              className="w-32 px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-3">Difficulty Distribution</label>
            <div className="space-y-3">
              {([['easy', 'Easy', 'bg-emerald-500'], ['medium', 'Medium', 'bg-amber-500'], ['hard', 'Hard', 'bg-red-500']] as const).map(([key, label, color]) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-xs font-medium text-slate-600 w-14">{label}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-2 ${color} rounded-full transition-all`} style={{ width: `${form[key]}%` }} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setForm({ ...form, [key]: Math.max(0, form[key] - 10) })}
                      className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-xs"
                    >−</button>
                    <span className="w-10 text-center text-xs font-mono font-semibold text-slate-700">{form[key]}%</span>
                    <button
                      onClick={() => setForm({ ...form, [key]: Math.min(100, form[key] + 10) })}
                      className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-xs"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={15} />Back
          </button>
          <button
            onClick={submitInterview}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            {submitting ? 'Creating...' : 'Create interview'}<ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}