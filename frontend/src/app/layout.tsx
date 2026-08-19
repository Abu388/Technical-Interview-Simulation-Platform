import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HirePath — SaaS Interview Platform',
  description: 'AI-powered technical interview generation and management for companies.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen bg-[#f8f9fc] overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}