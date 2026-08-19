import { TopNav } from '@/components/layout/top-nav'

export default function FullscreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </>
  )
}