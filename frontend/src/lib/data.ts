import { Question, Interview, PaymentMethod } from '@/types'

export const QUESTIONS: Question[] = [
  {
    id: 1, title: 'Two Sum', category: 'Arrays', difficulty: 'Easy', time: '15 min', uses: 1240,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    sampleInput: 'nums = [2,7,11,15], target = 9', sampleOutput: '[0,1]',
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists.'],
    testCases: [{ input: '[3,2,4], 6', output: '[1,2]' }, { input: '[3,3], 6', output: '[0,1]' }]
  },
  {
    id: 2, title: 'LRU Cache', category: 'Design', difficulty: 'Medium', time: '30 min', uses: 892,
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get and put methods.',
    sampleInput: 'capacity = 2', sampleOutput: 'cache operations result',
    constraints: ['1 ≤ capacity ≤ 3000', '0 ≤ key ≤ 10⁴', '0 ≤ value ≤ 10⁵'],
    testCases: [{ input: 'put(1,1), put(2,2), get(1)', output: '1' }]
  },
  {
    id: 3, title: 'Merge K Sorted Lists', category: 'Linked Lists', difficulty: 'Hard', time: '45 min', uses: 654,
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]', sampleOutput: '[1,1,2,3,4,4,5,6]',
    constraints: ['k == lists.length', '0 ≤ k ≤ 10⁴', '0 ≤ lists[i].length ≤ 500'],
    testCases: [{ input: '[[]]', output: '[]' }, { input: '[]', output: '[]' }]
  },
  {
    id: 4, title: 'Valid Parentheses', category: 'Stacks', difficulty: 'Easy', time: '15 min', uses: 2100,
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    sampleInput: 's = "()[]{}"', sampleOutput: 'true',
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
    testCases: [{ input: '"(]"', output: 'false' }, { input: '"{[]}"', output: 'true' }]
  },
  {
    id: 5, title: 'Binary Tree Level Order', category: 'Trees', difficulty: 'Medium', time: '25 min', uses: 743,
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    sampleInput: 'root = [3,9,20,null,null,15,7]', sampleOutput: '[[3],[9,20],[15,7]]',
    constraints: ['The number of nodes is in [0, 2000]', '-1000 ≤ Node.val ≤ 1000'],
    testCases: [{ input: '[]', output: '[]' }, { input: '[1]', output: '[[1]]' }]
  },
  {
    id: 6, title: 'Word Break', category: 'Dynamic Programming', difficulty: 'Medium', time: '35 min', uses: 521,
    description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
    sampleInput: 's = "leetcode", wordDict = ["leet","code"]', sampleOutput: 'true',
    constraints: ['1 ≤ s.length ≤ 300', '1 ≤ wordDict.length ≤ 1000'],
    testCases: [{ input: '"applepenapple", ["apple","pen"]', output: 'true' }]
  },
  {
    id: 7, title: 'Median of Two Arrays', category: 'Binary Search', difficulty: 'Hard', time: '50 min', uses: 398,
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    sampleInput: 'nums1 = [1,3], nums2 = [2]', sampleOutput: '2.00000',
    constraints: ['0 ≤ m, n ≤ 1000', '-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶'],
    testCases: [{ input: '[1,2],[3,4]', output: '2.50000' }]
  },
  {
    id: 8, title: 'Course Schedule', category: 'Graphs', difficulty: 'Medium', time: '30 min', uses: 610,
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.',
    sampleInput: 'numCourses = 2, prerequisites = [[1,0]]', sampleOutput: 'true',
    constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000'],
    testCases: [{ input: '2, [[1,0],[0,1]]', output: 'false' }]
  },
]

export const INTERVIEWS: Interview[] = [
  {
    id: 'INT-001', title: 'Senior Frontend Engineer', company: 'TechCorp Inc.',
    created: 'Jul 12, 2025', expires: 'Jul 26, 2025', questions: 12, status: 'Active',
    candidates: 4, link: 'https://interview.hirepath.ai/i/fc8a2b'
  },
  {
    id: 'INT-002', title: 'Backend .NET Developer', company: 'TechCorp Inc.',
    created: 'Jul 8, 2025', expires: 'Jul 22, 2025', questions: 8, status: 'Expired',
    candidates: 11, link: 'https://interview.hirepath.ai/i/d3e91c'
  },
  {
    id: 'INT-003', title: 'Data Structures & Algorithms', company: 'TechCorp Inc.',
    created: 'Jul 15, 2025', expires: 'Aug 1, 2025', questions: 15, status: 'Active',
    candidates: 2, link: 'https://interview.hirepath.ai/i/a71f4d'
  },
  {
    id: 'INT-004', title: 'Flutter Mobile Developer', company: 'TechCorp Inc.',
    created: 'Jul 3, 2025', expires: 'Jul 17, 2025', questions: 10, status: 'Draft',
    candidates: 0, link: 'https://interview.hirepath.ai/i/b29e6f'
  },
]

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia', icon: '🏦', color: '#1a56db' },
  { id: 'dashen', name: 'Dashen Bank', icon: '🏛️', color: '#0891b2' },
  { id: 'awash', name: 'Awash Bank', icon: '🏢', color: '#059669' },
  { id: 'telebirr', name: 'Telebirr', icon: '📱', color: '#7c3aed' },
  { id: 'chapa', name: 'Chapa', icon: '⚡', color: '#d97706' },
  { id: 'stripe', name: 'Stripe', icon: '💳', color: '#635bff' },
]

export const GENERATING_STEPS = [
  'Understanding job description',
  'Generating coding questions',
  'Creating test cases',
  'Validating difficulty',
  'Preparing interview',
]

export const CATEGORIES = [
  'All', 'Arrays', 'Design', 'Linked Lists', 'Stacks', 'Trees',
  'Dynamic Programming', 'Binary Search', 'Graphs',
]

export const NAV_ITEMS = [
  { href: '/', label: 'Technical Questions', icon: 'Code2' },
  { href: '/create', label: 'Custom Questions', icon: 'Sparkles' },
  { href: '/links', label: 'Generated Links', icon: 'Link2' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
  { href: '/profile', label: 'Profile', icon: 'User' },
] as const