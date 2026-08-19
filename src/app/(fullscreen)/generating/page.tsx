'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { GENERATING_STEPS } from '@/lib/data'

export default function GeneratingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < GENERATING_STEPS.length - 1 ? s + 1 : s))
    }, 500)
    const timeout = setTimeout(() => router.push('/payment'), 5000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
          <Sparkles size={28} className="text-white animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Generating Your Interview</h2>
        <p className="text-sm text-slate-500 mb-8">Our AI is crafting personalized questions for your role</p>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 text-left">
          <div className="space-y-3">
            {GENERATING_STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-3 transition-all ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  i < step ? 'bg-emerald-500' : i === step ? 'bg-indigo-600' : 'bg-slate-100'
                }`}>
                  {i < step ? (
                    <Check size={12} className="text-white" />
                  ) : i === step ? (
                    <Loader2 size={12} className="text-white animate-spin" />
                  ) : (
                    <span className="text-xs text-slate-400">{i + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${i <= step ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (step / (GENERATING_STEPS.length - 1)) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{Math.round((step / (GENERATING_STEPS.length - 1)) * 100)}% complete</p>
      </div>
    </div>
  )
}