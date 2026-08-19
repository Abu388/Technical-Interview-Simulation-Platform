'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Code2, Sparkles, Link2, Settings, User } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/data'

const ICONS = { Code2, Sparkles, Link2, Settings, User }

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col pt-4 pb-6 px-3 flex-shrink-0">
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => {
          const Icon = ICONS[item.icon as keyof typeof ICONS]
          const isActive =
            pathname === item.href ||
            (item.href === '/' && pathname.startsWith('/review'))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}