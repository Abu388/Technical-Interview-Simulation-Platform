import { Check, ChevronRight } from 'lucide-react'

const STEPS = ['Technical Setup', 'Behavioral', 'Review & Pay']

export function WizardProgress({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${i === current ? 'text-indigo-700' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i < current ? 'bg-emerald-500 text-white' : i === current ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {i < current ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-xs font-medium">{s}</span>
            </div>
            {i < 2 && <ChevronRight size={13} className="text-slate-300" />}
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full">
        <div
          className="h-1.5 bg-indigo-600 rounded-full transition-all"
          style={{ width: `${((current + 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  )
}