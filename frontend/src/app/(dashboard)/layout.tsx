'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { hasApiToken } from '@/lib/api'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname !== '/settings' && !hasApiToken()) router.replace('/settings')
  }, [pathname, router])

  if (pathname !== '/settings' && !hasApiToken()) return null

  return (
    <>
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {children}
      </div>
    </>
  )
}