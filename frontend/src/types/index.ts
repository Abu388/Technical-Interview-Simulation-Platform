export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Question {
  id: number
  title: string
  category: string
  difficulty: Difficulty
  time: string
  uses: number
  description: string
  sampleInput: string
  sampleOutput: string
  constraints: string[]
  testCases: { input: string; output: string }[]
}

export interface Interview {
  id: string
  title: string
  company: string
  created: string
  expires: string
  questions: number
  status: 'Active' | 'Expired' | 'Draft'
  candidates: number
  link: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  color: string
}