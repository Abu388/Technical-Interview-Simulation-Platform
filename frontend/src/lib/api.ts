import { Interview, Question } from '@/types'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')
const TOKEN_KEY = 'hirepath_api_token'

export class ApiError extends Error {
  status: number
  details: unknown

  constructor(status: number, details: unknown) {
    super(typeof details === 'object' && details && 'detail' in details
      ? String((details as { detail: unknown }).detail)
      : `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function getToken() {
  if (typeof window === 'undefined') return undefined
  return window.localStorage.getItem(TOKEN_KEY) ?? undefined
}

export function hasApiToken() {
  return Boolean(getToken())
}

export function setApiToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearApiToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, body)
  setApiToken(String(body.token))
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Token ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, body)
  return body as T
}

type ApiCategory = { id: string; name: string }
type ApiQuestion = {
  id: string
  category: string | null
  title: string
  prompt: string
  constraints: string
  difficulty: 'easy' | 'medium' | 'hard'
  time_limit_seconds: number
}

type ApiInterview = {
  id: string
  company: string
  title: string
  questions: string[]
  status: 'draft' | 'paid' | 'generated' | 'active' | 'completed' | 'expired' | 'cancelled'
  expiration_date: string | null
  created_at: string
}

type ApiLink = {
  id: string
  interview: string
  url: string
  expires_at: string | null
}

type ApiCompany = { id: string; name: string }

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
const displayStatus = (value: ApiInterview['status']): Interview['status'] => {
  if (value === 'active') return 'Active'
  if (value === 'expired') return 'Expired'
  return 'Draft'
}
const formatDate = (value: string | null) => value
  ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
  : 'No expiry'

export async function getQuestions(): Promise<Question[]> {
  const [questions, categories] = await Promise.all([
    request<ApiQuestion[]>('/questions/'),
    request<ApiCategory[]>('/questions/categories/'),
  ])
  const categoryNames = new Map(categories.map(category => [category.id, category.name]))
  return questions.map(question => ({
    id: question.id,
    title: question.title,
    category: question.category ? categoryNames.get(question.category) ?? 'Uncategorized' : 'Uncategorized',
    difficulty: titleCase(question.difficulty) as Question['difficulty'],
    time: `${Math.round(question.time_limit_seconds / 60)} min`,
    uses: 0,
    description: question.prompt,
    sampleInput: '',
    sampleOutput: '',
    constraints: question.constraints ? question.constraints.split('\n').filter(Boolean) : [],
    testCases: [],
  }))
}

export async function getInterviewLinks(): Promise<Interview[]> {
  const [interviews, links, companies] = await Promise.all([
    request<ApiInterview[]>('/interviews/'),
    request<ApiLink[]>('/interviews/links/'),
    request<ApiCompany[]>('/companies/'),
  ])
  const companyNames = new Map(companies.map(company => [company.id, company.name]))
  const linksByInterview = new Map(links.map(link => [link.interview, link]))

  return interviews.map(interview => {
    const link = linksByInterview.get(interview.id)
    return {
      id: interview.id,
      title: interview.title,
      company: companyNames.get(interview.company) ?? 'Company',
      created: formatDate(interview.created_at),
      expires: formatDate(interview.expiration_date),
      questions: interview.questions.length,
      status: displayStatus(interview.status),
      candidates: 0,
      link: link ? `${window.location.origin}${link.url}` : 'No link generated',
    }
  })
}

export async function getCompanies() {
  return request<ApiCompany[]>('/companies/')
}

export async function createInterview(payload: {
  company: string
  title: string
  questions: string[]
  expiration_date: string | null
}) {
  return request<ApiInterview>('/interviews/', {
    method: 'POST',
    body: JSON.stringify({ ...payload, status: 'draft', allow_ai_behavioral_questions: true }),
  })
}

export async function createInterviewLink(payload: { interview: string; expires_at: string | null }) {
  return request<ApiLink>('/interviews/links/', {
    method: 'POST',
    body: JSON.stringify({ ...payload, max_attempts: 1 }),
  })
}