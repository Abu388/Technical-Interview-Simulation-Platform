import { Interview } from '@/types'
import { cn } from '@/lib/utils'

const styles: Record<Interview['status'], string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Expired: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  Draft: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
}

export function StatusBadge({ status }: { status: Interview['status'] }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', styles[status])}>
      {status}
    </span>
  )
}