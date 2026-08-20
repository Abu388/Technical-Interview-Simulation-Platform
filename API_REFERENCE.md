# AI Interview Platform — API Reference

Prepared for the Frontend Team. This document defines every endpoint in the platform — public and authenticated — with exact request and response formats taken from the current models, serializers, and views.

---

## 1. General Architecture & Conventions

### 1.1 Split Architecture

The platform is split into two Django backends plus a frontend:

```
AI interview/
├── API_REFERENCE.md      # This document
├── backend/              # B2B / Admin API (Companies, Questions, Interviews)
│   ├── manage.py
│   ├── config/
│   └── apps/
│       ├── core/         # Abstract UUID + timestamp base models
│       ├── companies/    # Company profiles & applications
│       ├── questions/    # Question engine (categories, questions, test cases, templates)
│       └── interviews/   # Interview configs, links, candidate sessions
├── public-backend/       # B2C / Candidate API
│   └── candidates/       # Candidate registration & profiles
└── frontend/             # Next.js frontend
```

| Backend | Audience | Apps | Base URL (dev) |
|---|---|---|---|
| `backend/` | B2B — companies & admins | `core`, `companies`, `questions`, `interviews` | `http://localhost:8000/api` |
| `public-backend/` | B2C — candidates | `candidates` | `http://localhost:8001/api` |

> Note: the candidate-facing *execution* endpoints (link validate / start / submit) live in the `interviews` app of `backend/`, but are consumed by candidates via public links. They are documented in **Section 3**.

### 1.2 Authentication Rules

- **Token auth** (`Authorization: Token <token>`) is required for every endpoint except the three marked **PUBLIC**:

| # | PUBLIC Endpoint | Method |
|---|---|---|
| 1 | `/api/companies/apply/` | `POST` |
| 2 | `/api/candidates/register/` | `POST` |
| 3 | `/api/interviews/links/validate/{code}/` | `GET` |

- **Candidates** receive their token from `POST /api/candidates/register/`.
- **Company owners** currently receive tokens via Django admin (no login endpoint yet — planned).
- An unauthenticated request returns **HTTP 403** with `{"detail": "Authentication credentials were not provided."}`. The API returns 403 rather than 401 because DRF token auth emits no `WWW-Authenticate` header.

### 1.3 Standard Formats

| Item | Value |
|---|---|
| Content-Type | `application/json` for all requests/responses |
| Primary keys | **UUID** strings, e.g. `3fa85f64-5717-4562-b3fc-2c963f66afa6` — except `user.id` (integer) |
| Enums | Lowercase strings (`pending`, `medium`, `python`, ...) |
| Timestamps | UTC ISO-8601 strings, e.g. `"2026-08-08T10:00:00Z"` |
| Pagination | None — list endpoints return plain JSON arrays |

### 1.4 Role Visibility (data scoping)

| Role | What they can see |
|---|---|
| Staff / admin | Everything in all apps |
| Company owner | Only resources of their own companies; only **approved + active** companies in `/companies/`; only sessions of their own companies' interviews |
| Candidate | Only their own sessions (`candidate_email` == account email); public link validation |

---

## 2. B2B Backend (`/backend/apps/`)

### 2.1 Companies — `companies/`

Mounted at `/api/companies/`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/companies/apply/` | **PUBLIC** | Submit a registration application (status → `pending`) |
| `GET` | `/api/companies/` | Token | List companies (staff: all; owner: own approved + active) |
| `POST` | `/api/companies/` | Token | Create a company |
| `GET` | `/api/companies/{id}/` | Token | Retrieve one company |
| `PUT` / `PATCH` | `/api/companies/{id}/` | Token | Update a company |
| `DELETE` | `/api/companies/{id}/` | Token | Delete a company |

#### `POST /api/companies/apply/` (PUBLIC)

Request:

```json
{
  "name": "Acme Logistics",
  "about": "We build logistics software for fleet operators.",
  "website": "https://acme.example.com",
  "industry": "logistics",
  "location": "Addis Ababa, Ethiopia",
  "contact_email": "hr@acme.example.com"
}
```

Response — `201 Created`:

```json
{
  "message": "Application submitted successfully and is pending admin approval.",
  "company": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Acme Logistics",
    "about": "We build logistics software for fleet operators.",
    "website": "https://acme.example.com",
    "industry": "logistics",
    "location": "Addis Ababa, Ethiopia",
    "contact_email": "hr@acme.example.com",
    "status": "pending",
    "is_active": false,
    "member_since": null,
    "created_at": "2026-08-08T10:00:00Z"
  }
}
```

Field notes:
- `about` maps to the internal `description` field and is required.
- `website` is optional (`allow_blank`).
- `status` is always `pending` and `is_active` always `false` on apply; admin approval flips these.

#### `POST /api/companies/` (Token)

Writable fields: `name`, `description`, `website`, `industry`, `location`, `company_size`, `contact_email`. Read-only: `id`, `status`, `is_active`, `member_since`, `created_at`.

Request:

```json
{
  "name": "Acme Logistics",
  "description": "We build logistics software for fleet operators.",
  "website": "https://acme.example.com",
  "industry": "logistics",
  "location": "Addis Ababa, Ethiopia",
  "company_size": "51-200",
  "contact_email": "hr@acme.example.com"
}
```

Response — `201 Created`:

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Acme Logistics",
  "description": "We build logistics software for fleet operators.",
  "website": "https://acme.example.com",
  "industry": "logistics",
  "location": "Addis Ababa, Ethiopia",
  "company_size": "51-200",
  "contact_email": "hr@acme.example.com",
  "status": "pending",
  "is_active": false,
  "member_since": null,
  "created_at": "2026-08-08T10:00:00Z"
}
```

#### `GET /api/companies/` (Token)

Returns a JSON array of company objects (same shape as above). Non-staff users only see companies where `status == "approved"`, `is_active == true`, and `owner` is the requesting user.

#### `GET /api/companies/{id}/` (Token)

Returns a single company object (same shape as above). `404` if not visible to the requesting user.

`status` values: `pending` | `approved` | `rejected`.

---

### 2.2 Questions — `questions/`

Mounted at `/api/questions/`. All endpoints require Token auth. Full CRUD (list, create, retrieve, update, partial update, delete) is available on each.

| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/questions/categories/` | List / create categories |
| `GET/PUT/PATCH/DELETE` | `/api/questions/categories/{id}/` | Retrieve / update / delete a category |
| `GET/POST` | `/api/questions/test-cases/` | List / create test cases |
| `GET/PUT/PATCH/DELETE` | `/api/questions/test-cases/{id}/` | Retrieve / update / delete a test case |
| `GET/POST` | `/api/questions/` | List / create questions |
| `GET/PUT/PATCH/DELETE` | `/api/questions/{id}/` | Retrieve / update / delete a question |

#### `GET/POST /api/questions/categories/`

Category fields: `id`, `company`, `is_global`, `name`, `description`, `created_at`. Read-only: `id`, `created_at`.

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "company": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "is_global": false,
  "name": "Arrays & Hashing",
  "description": "Problems on array manipulation and hash maps.",
  "created_at": "2026-08-08T10:00:00Z"
}
```

#### `GET/POST /api/questions/test-cases/`

Test case fields: `id`, `question`, `input_data`, `expected_output`, `is_hidden`, `weight`. Read-only: `id`.

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "question": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "input_data": "[2,7,11,15]\n9",
  "expected_output": "[0,1]",
  "is_hidden": false,
  "weight": 1
}
```

#### `GET/POST /api/questions/`

Question fields: `id`, `company`, `category`, `is_global`, `title`, `prompt`, `constraints`, `difficulty`, `time_limit_seconds`, `is_active`, `code_templates`, `created_at`. Read-only: `id`, `created_at`, and `code_templates` (nested, read-only).

**Auto-calculated time limits:** when a question is created without `time_limit_seconds`, it is derived from `difficulty` on save:

| difficulty | time_limit_seconds |
|---|---|
| `easy` | `900` (15 min) |
| `medium` | `1800` (30 min) |
| `hard` | `2700` (45 min) |

`difficulty` values: `easy` | `medium` | `hard`.

**Read-only code templates:** each question embeds its `code_templates` (created via admin/seeding, not writable through the API). Languages: `python` | `java` | `cpp` | `javascript`.

Request:

```json
{
  "company": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "category": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "is_global": false,
  "title": "Two Sum",
  "prompt": "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
  "constraints": "1 <= nums.length <= 10^4",
  "difficulty": "easy",
  "is_active": true
}
```

Response — `201 Created`:

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "company": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "category": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "is_global": false,
  "title": "Two Sum",
  "prompt": "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
  "constraints": "1 <= nums.length <= 10^4",
  "difficulty": "easy",
  "time_limit_seconds": 900,
  "is_active": true,
  "code_templates": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "question": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "language": "python",
      "starter_code": "def two_sum(nums, target):\n    pass\n",
      "created_at": "2026-08-08T10:00:00Z"
    }
  ],
  "created_at": "2026-08-08T10:00:00Z"
}
```

---

### 2.3 Interviews — `interviews/`

Mounted at `/api/interviews/`. All endpoints require Token auth. Full CRUD on each viewset.

| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/interviews/` | List / create interview configurations |
| `GET/PUT/PATCH/DELETE` | `/api/interviews/{id}/` | Retrieve / update / delete an interview |
| `GET/POST` | `/api/interviews/behavioral-questions/` | List / create behavioral questions |
| `GET/PUT/PATCH/DELETE` | `/api/interviews/behavioral-questions/{id}/` | Retrieve / update / delete a behavioral question |
| `GET/POST` | `/api/interviews/links/` | List / create interview links |
| `GET/PUT/PATCH/DELETE` | `/api/interviews/links/{id}/` | Retrieve / update / delete a link |
| `GET/POST` | `/api/interviews/sessions/` | List sessions / create (admin) |
| `GET/PUT/PATCH/DELETE` | `/api/interviews/sessions/{id}/` | Retrieve / update / delete a session |
| `POST` | `/api/interviews/sessions/{id}/submit/` | Candidate submits an interview (Section 3.3) |

#### Interview Configurations — `/api/interviews/`

Fields: `id`, `company`, `title`, `questions` (array of question UUIDs), `status`, `expiration_date`, `allow_ai_behavioral_questions`, `created_at`. Read-only: `id`, `created_at`.

`status` values: `draft` | `paid` | `generated` | `active` | `completed` | `expired` | `cancelled`.

Request:

```json
{
  "company": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "Backend Engineer Screening",
  "questions": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "status": "draft",
  "expiration_date": "2026-09-08T10:00:00Z",
  "allow_ai_behavioral_questions": true
}
```

Response — `201 Created`:

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "company": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "Backend Engineer Screening",
  "questions": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "status": "draft",
  "expiration_date": "2026-09-08T10:00:00Z",
  "allow_ai_behavioral_questions": true,
  "created_at": "2026-08-08T10:00:00Z"
}
```

#### Behavioral Questions — `/api/interviews/behavioral-questions/`

Fields: `id`, `interview`, `text`, `order`. Read-only: `id`.

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "interview": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "text": "Tell us about a time you had to debug a difficult production issue.",
  "order": 1
}
```

#### Interview Links — `/api/interviews/links/`

Fields: `id`, `interview`, `code`, `url`, `expires_at`, `max_attempts`, `created_at`. Read-only: `id`, `code` (auto-generated 32-char uppercase hex), `url` (computed, e.g. `/interview/ABC123...`), `created_at`.

Request:

```json
{
  "interview": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "expires_at": "2026-09-08T10:00:00Z",
  "max_attempts": 1
}
```

Response — `201 Created`:

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "interview": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "code": "3FA85F6457174562B3FC2C963F66AFA6",
  "url": "/interview/3FA85F6457174562B3FC2C963F66AFA6",
  "expires_at": "2026-09-08T10:00:00Z",
  "max_attempts": 1,
  "created_at": "2026-08-08T10:00:00Z"
}
```

#### Company Session Dashboard — `/api/interviews/sessions/`

Fields: `id`, `link`, `candidate_name`, `candidate_email`, `status`, `score`, `recording_url`, `answers` (nested, read-only), `duration` (computed, read-only), `interview_title` (computed, read-only), `started_at`, `completed_at`, `created_at`. Read-only: `id`, `created_at`.

**Scoping:** companies only see sessions for their own interviews — non-staff users with a company get `sessions` filtered to `link__interview__company__owner == user`. Candidates see only their own (`candidate_email` match).

`status` values: `pending` | `in_progress` | `completed` | `expired`.

`duration` is only populated for completed sessions and is formatted like `"1h 2m 30s"` (omitting empty units); otherwise `null`.

Response:

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "link": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "candidate_name": "Sara Ahmed",
  "candidate_email": "sara@example.com",
  "status": "completed",
  "score": null,
  "recording_url": "https://cdn.example.com/recordings/session-123.mp4",
  "answers": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "session": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "question": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "submitted_code": "def two_sum(nums, target):\n    return [0, 1]\n",
      "language": "python",
      "created_at": "2026-08-08T11:30:00Z"
    }
  ],
  "duration": "1h 2m 30s",
  "interview_title": "Backend Engineer Screening",
  "started_at": "2026-08-08T10:00:00Z",
  "completed_at": "2026-08-08T11:02:30Z",
  "created_at": "2026-08-08T10:00:00Z"
}
```

---

## 3. Public Backend & Redemptions (`/public-backend/` & Public Links)

The candidate-facing flows: account creation (public backend), then link validation, starting the IDE session, and submitting answers (served by the `interviews` app in `backend/`, consumed via shareable links).

### 3.1 Candidate Registration — `candidates/`

Mounted at `/api/candidates/register/` on the public backend (`http://localhost:8001/api/candidates/register/`).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/candidates/register/` | **PUBLIC** | Create a candidate account, returns the Auth Token |

Request:

```json
{
  "first_name": "Sara",
  "last_name": "Ahmed",
  "email": "Sara@Example.com",
  "password": "super-secret-123"
}
```

Field notes:
- `email` is normalized to lowercase and must be unique (checked case-insensitively against both `email` and `username`); a duplicate returns a `400` validation error.
- `password` must be at least 8 characters.

Response — `201 Created` (returns the Auth Token):

```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 42,
    "first_name": "Sara",
    "last_name": "Ahmed",
    "email": "sara@example.com"
  }
}
```

> `user.id` is an **integer** (Django `User`), unlike all other resource IDs which are UUIDs. A `CandidateProfile` row is created automatically for the user (fields: `phone_number`, `github_url` — not exposed via API yet).

### 3.2 Public Link Validation & Start — `interviews/links/`

These endpoints are served by `backend/apps/interviews` but are consumed by candidates holding a shareable link code.

#### `GET /api/interviews/links/validate/{code}/` (PUBLIC)

Validates that a link code exists and is not expired. `code` is matched case-insensitively. A missing or expired link returns `404` with `{"detail": "Invalid interview link."}` or `{"detail": "This interview link has expired."}`.

Response — `200 OK`:

```json
{
  "company_name": "Acme Logistics",
  "interview_title": "Backend Engineer Screening",
  "expires_at": "2026-09-08T10:00:00Z"
}
```

`expires_at` is `null` when the link never expires.

#### `POST /api/interviews/links/start/{code}/` (Token)

Starts (or resumes) a candidate session for the authenticated user's email. The IDE payload contains **questions with visible test cases only** (`is_hidden == false`) plus read-only code templates.

Behavior:
- Creates a new session (`status: in_progress`, `started_at: now`) if the user has no session for this link, otherwise resets the existing session to `in_progress`.
- `candidate_name` is derived from `user.get_full_name()` (fallback: `username`).

Response — `201 Created`:

```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "questions": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "title": "Two Sum",
      "prompt": "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
      "constraints": "1 <= nums.length <= 10^4",
      "difficulty": "easy",
      "time_limit_seconds": 900,
      "code_templates": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "question": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "language": "python",
          "starter_code": "def two_sum(nums, target):\n    pass\n",
          "created_at": "2026-08-08T10:00:00Z"
        }
      ],
      "test_cases": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "question": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "input_data": "[2,7,11,15]\n9",
          "expected_output": "[0,1]",
          "is_hidden": false,
          "weight": 1
        }
      ]
    }
  ]
}
```

### 3.3 Session Submission — `/api/interviews/sessions/{id}/submit/`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/interviews/sessions/{id}/submit/` | Token | Submit a recording + code answers; completes the session |

Rules:
- Only the candidate who owns the session (`session.candidate_email` == authenticated user's email) may submit; anyone else gets `403` with `{"detail": "You are not authorized to submit this session."}`.
- `answers` are upserted per `(session, question)` — submitting again overwrites previous code.
- The session is set to `status: completed`, `completed_at: now`, and `recording_url` is stored.
- Answer items must include `question_id` (the question UUID) — this exact key is required.

Request:

```json
{
  "recording_url": "https://cdn.example.com/recordings/session-123.mp4",
  "answers": [
    {
      "question_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "submitted_code": "def two_sum(nums, target):\n    return [0, 1]\n",
      "language": "python"
    }
  ]
}
```

Response — `200 OK`:

```json
{
  "message": "Interview submitted successfully."
}
```

---

## Error Handling

| Scenario | Status | Body |
|---|---|---|
| Missing/invalid token | `403` | `{"detail": "Authentication credentials were not provided."}` |
| Validation failure | `400` | DRF field errors, e.g. `{"email": ["A user with this email is already registered."]}` |
| Invalid/expired link | `404` | `{"detail": "Invalid interview link."}` / `{"detail": "This interview link has expired."}` |
| Submitting someone else's session | `403` | `{"detail": "You are not authorized to submit this session."}` |