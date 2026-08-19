'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, CreditCard } from 'lucide-react'
import { PAYMENT_METHODS } from '@/lib/data'

export default function PaymentPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('stripe')

  // Pricing: Easy=100 Br, Medium=200 Br, Hard/Custom=300 Br
  const easyQ = 4, mediumQ = 4, hardQ = 2, customQ = 3
  const subtotal = easyQ * 100 + mediumQ * 200 + hardQ * 300 + customQ * 300
  const tax = subtotal * 0.15
  const total = subtotal + tax

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Payment</h1>
        <p className="text-sm text-slate-500 mb-6">Review your order before completing payment</p>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Order Summary</h3>
          <div className="space-y-2.5">
            {[
              [`Easy Questions (×${easyQ})`, `${easyQ} × 100 Br`, `${easyQ * 100} Br`],
              [`Medium Questions (×${mediumQ})`, `${mediumQ} × 200 Br`, `${mediumQ * 200} Br`],
              [`Hard Questions (×${hardQ})`, `${hardQ} × 300 Br`, `${hardQ * 300} Br`],
              [`Custom Questions (×${customQ})`, `${customQ} × 300 Br`, `${customQ * 300} Br`],
            ].map(([label, rate, amount]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-700 font-medium">{label}</span>
                  <span className="text-slate-400 text-xs ml-2">{rate}</span>
                </div>
                <span className="font-mono font-medium text-slate-700">{amount}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-2.5 mt-2.5 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-mono font-medium text-slate-700">{subtotal.toLocaleString()} Br</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (15%)</span>
                <span className="font-mono font-medium text-slate-700">{tax.toLocaleString()} Br</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total</span>
                <span className="text-indigo-700 font-mono">{total.toLocaleString()} Br</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setSelected(pm.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  selected === pm.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-2xl">{pm.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${selected === pm.id ? 'text-indigo-800' : 'text-slate-800'}`}>{pm.name}</p>
                </div>
                {selected === pm.id && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.push('/behavioral')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={15} />Cancel
          </button>
          <button
            onClick={() => router.push('/success')}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <CreditCard size={15} />Pay {total.toLocaleString()} Br
          </button>
        </div>
      </div>
    </div>
  )
}