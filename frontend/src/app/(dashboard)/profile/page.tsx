'use client'

import { useState } from 'react'
import { Plus, FileText, Check, CheckCircle2 } from 'lucide-react'

interface ProfileForm {
  name: string
  email: string
  contactEmail: string
  industry: string
  website: string
  location: string
  size: string
  description: string
}

const INITIAL: ProfileForm = {
  name: 'TechCorp Inc.',
  email: 'hr@techcorp.com',
  contactEmail: 'hr@techcorp.com',
  industry: 'Software & Technology',
  website: 'https://techcorp.com',
  location: 'Addis Ababa, Ethiopia',
  size: '51–200 employees',
  description: 'TechCorp builds scalable enterprise software solutions for African markets.',
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<ProfileForm>(INITIAL)
  const [draft, setDraft] = useState<ProfileForm>(INITIAL)

  const handleSave = () => {
    setForm(draft)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }
  const handleCancel = () => {
    setDraft(form)
    setEditing(false)
  }

  const field = (label: string, key: keyof ProfileForm, type = 'text', textarea = false) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {editing ? (
        textarea ? (
          <textarea
            value={draft[key]}
            onChange={e => setDraft({ ...draft, [key]: e.target.value })}
            rows={3}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-none"
          />
        ) : (
          <input
            type={type}
            value={draft[key]}
            onChange={e => setDraft({ ...draft, [key]: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
          />
        )
      ) : (
        <p className="text-sm text-slate-800 py-2.5">{form[key] || <span className="text-slate-400">—</span>}</p>
      )}
    </div>
  )

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-5 flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-100">
              <span className="text-3xl font-bold text-white select-none">TC</span>
            </div>
            {editing && (
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 transition-colors">
                <Plus size={13} className="text-slate-500" />
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900">{form.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{form.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                Active Account
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                Company
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors ring-1 ring-indigo-200"
              >
                <FileText size={14} />Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Check size={14} />Save
                </button>
              </div>
            )}
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium mb-5">
            <CheckCircle2 size={15} />Profile updated successfully
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Company Information</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {field('Company Name', 'name')}
            {field('Industry', 'industry')}
            {field('Website', 'website', 'url')}
            {field('Location', 'location')}
            {field('Company Size', 'size')}
          </div>
          <div className="mt-5">
            {field('About', 'description', 'text', true)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Contact & Account</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {field('Contact Email', 'contactEmail', 'email')}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Member Since</label>
              <p className="text-sm text-slate-800 py-2.5">July 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}