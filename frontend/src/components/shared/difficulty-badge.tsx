import { Difficulty } from '@/types'
import { cn } from '@/lib/utils'

const styles: Record<Difficulty, string> = {
  Easy: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Hard: 'bg-red-50 text-red-700 ring-1 ring-red-200',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', styles[difficulty])}>
      {difficulty}
    </span>
  )
}