import { TopNav } from '@/components/layout/top-nav'
import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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