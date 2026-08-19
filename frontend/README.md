# HirePath — SaaS Interview Platform

A modern, enterprise-grade interview management dashboard built for company owners. Companies can browse a technical question library, create AI-generated custom interviews, set up behavioral rounds, generate shareable candidate links, and manage their company profile — all in one place.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5 (strict mode) |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (Vite plugin, no PostCSS) |
| Icons | Lucide React |
| Font | Inter (Google Fonts) + JetBrains Mono |
| Package Manager | pnpm |
| Runtime Target | ES2020, DOM |

---

## Folder Structure

```
hirepath/
├── src/
│   ├── App.tsx              # Entire application — all pages, components, types, and data
│   ├── main.tsx             # React entry point — mounts <App /> into #root
│   ├── index.css            # Global styles: Google Fonts import, Tailwind import, CSS tokens, scrollbar rules
│   ├── vite-env.d.ts        # Vite client type declarations
│   └── imports/
│       └── pasted_text/
│           └── saas-interview-dashboard.md   # Original design brief
│
├── index.html               # HTML shell — Vite injects bundle here
├── vite.config.ts           # Vite config: React plugin, Tailwind plugin, path alias (@/), Figma Make plugins
├── tsconfig.json            # TypeScript config: strict, noUnusedLocals, bundler resolution, @/* alias
├── package.json             # Dependencies and scripts
├── pnpm-lock.yaml           # Lockfile
└── AGENTS.md / CLAUDE.md    # Figma Make agent instructions
```

---

## Architecture

### Single-file component model

All UI lives in `src/App.tsx`. Pages are plain React functions — no routing library. Navigation is handled by a `page` state variable in the root `App` component that acts as a simple client-side router:

```
App (root)
 ├── TopNav          — sticky header: logo, search, notifications, profile
 ├── Sidebar         — left nav + active state
 └── renderPage()    — switches on `page` state to mount the active view
      ├── QuestionLibrary     (page = 'library')
      ├── CreateInterview     (page = 'create')
      ├── ReviewQuestion      (page = 'review')
      ├── BehavioralSetup     (page = 'behavioral')
      ├── GeneratingScreen    (page = 'generating')
      ├── Payment             (page = 'payment')
      ├── SuccessScreen       (page = 'success')
      ├── GeneratedLinks      (page = 'links')
      └── CompanyProfile      (page = 'profile')
```

### Page / State flow

```
library  ──[View question]──►  review  ──[Add to Interview]──►  behavioral
   │                                                                 │
   └──[Create Custom Interview]──►  create  ──[Next]──►  behavioral
                                                              │
                                                         generating  (auto-advance ~5s)
                                                              │
                                                           payment  ──[Pay]──►  success
                                                                                   │
                                                                    ┌──────────────┤
                                                                    ▼              ▼
                                                                  links        library
```

### Types

Defined at the top of `App.tsx`:

| Type | Purpose |
|---|---|
| `Page` | Union of all valid page identifiers |
| `Difficulty` | `'Easy' \| 'Medium' \| 'Hard'` |
| `Question` | Technical question with constraints, test cases, sample I/O |
| `Interview` | Generated interview link record with status and candidate count |

### Static data

Mock data is defined as module-level constants:

| Constant | Contents |
|---|---|
| `QUESTIONS` | 8 technical questions across Arrays, Trees, DP, Graphs, etc. |
| `INTERVIEWS` | 4 generated interview records in various states |
| `PAYMENT_METHODS` | 6 payment options: CBE, Dashen, Awash, Telebirr, Chapa, Stripe |
| `GENERATING_STEPS` | 5 AI generation progress step labels |
| `CATEGORIES` | Filter options for the question library |
| `NAV_ITEMS` | Sidebar navigation entries |

### Shared components (inline)

| Component | Used in |
|---|---|
| `DifficultyBadge` | Question table rows, Review page header |
| `StatusBadge` | Generated Links cards |

---

## Pages

### 1. Technical Question Library (`library`)
- Analytics stat cards: Questions Generated, Total Spent, Active Interviews, Success Rate
- Filterable, searchable question table (difficulty badge, title, category, time, uses)
- Difficulty filter buttons + category dropdown + sort dropdown
- Row hover reveals "View" action
- Recent activity timeline

### 2. Create Custom Interview (`create`)
- 3-step wizard progress indicator (step 1 of 3)
- Quick-start templates: Frontend React, Backend .NET, Flutter, DSA, System Design
- Form: Company Name, Job Title, Job Description, Sample Input/Output, Date & Time, Question Count
- Difficulty distribution sliders with live progress bars (Easy / Medium / Hard %)

### 3. Review Technical Question (`review`)
- Full problem view: description, sample I/O in mono blocks, constraints list, test case pairs
- Navigates into the wizard flow on "Add to Interview"

### 4. Behavioral Interview Setup (`behavioral`)
- AI resume checkbox toggle
- Dynamic behavioral question list (add / remove rows)
- Expiration presets: 24 hours, 3 days, 1 week, Custom date
- Time limit selector

### 5. AI Generation Screen (`generating`)
- 5-step animated progress list with spinner on active step
- Smooth progress bar
- Auto-advances to Payment after ~5 seconds

### 6. Payment (`payment`)
- Line-item order summary with per-difficulty pricing:
  - Easy → 100 Br
  - Medium → 200 Br
  - Hard → 300 Br
  - Custom → 300 Br
- 15% tax calculated and displayed
- 6 selectable payment method cards (highlighted on selection)

### 7. Success Screen (`success`)
- Interview ID, question count, expiration date
- Copy link button with confirmation state
- Share / View Interview / Generate Another actions

### 8. Generated Interview Links (`links`)
- Summary stats: Total Interviews, Questions Generated, Active Links, Expired Links
- Interview cards: title, company, dates, question count, candidates, status badge
- Per-card actions: Copy link, Share, View, Regenerate, Export

### 9. Company Profile (`profile`)
- Header card: logo initials avatar, company name, email, account badges, Edit Profile button
- Inline edit mode: all fields become inputs; Save commits, Cancel reverts
- Success banner on save
- Company Information: Name, Industry, Website, Location, Size, About
- Contact & Account: Contact Email, Member Since

---

## Pricing Model

Companies are charged per question generated, billed in Ethiopian Birr (Br):

| Question Type | Price |
|---|---|
| Easy | 100 Br |
| Medium | 200 Br |
| Hard | 300 Br |
| Custom | 300 Br |

Tax of 15% is added at checkout. Payment is made at interview generation time — no token or credit system.

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start dev server (hot reload on port 8443 by default)
pnpm dev

# Type-check without emitting
npx tsc --noEmit

# Production build
pnpm build
```

The dev server binds to `0.0.0.0` and reads the port from the `$PORT` environment variable (default `8443`).

---

## Path Alias

`@/` maps to `./src/` — configured in both `tsconfig.json` and `vite.config.ts`:

```ts
import Something from '@/components/Something'
// resolves to ./src/components/Something
```
