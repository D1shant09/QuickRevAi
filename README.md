# QuickRev AI 🧠
### Upload, Automate and Ace

> An AI-powered revision platform that transforms your study material — PDFs, web pages, or pasted notes — into flashcards, quizzes, and summaries using spaced repetition.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Roadmap](#roadmap)
- [Team](#team)

---

## Overview

Students spend hours rereading the same notes — but passive revision leads to poor long-term retention. **QuickRev AI** fixes that.

You upload a PDF, paste a URL, or type your notes. The app automatically generates flashcards and quizzes from your content using Google Gemini. A spaced repetition engine (SM-2 algorithm) then schedules your reviews — hard topics come back more often, mastered ones less. You study smarter, not longer.

---

## Features

### Phase 1 (Prototype)
- **PDF upload** — upload lecture notes or textbook chapters (up to 25 MB)
- **URL scraping** — paste any article or documentation URL and extract the text automatically
- **Text paste** — paste raw notes directly into the app
- **AI summarization** — get a concise 3–5 sentence overview of your material
- **Flashcard generation** — 15 auto-generated Q&A pairs per session
- **Quiz generation** — 5 MCQ questions with 4 options and instant feedback
- **User auth** — register and login with email/password (JWT)

### Phase 2 (Planned)
- SM-2 spaced repetition scheduler
- Easy / Good / Hard / Again card rating
- Analytics dashboard with mastery charts
- Revision calendar heatmap
- Google OAuth login

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | SPA UI |
| Styling | Tailwind CSS | Responsive utility-first styling |
| Backend | Node.js + Express | REST API server |
| Database | MongoDB + Mongoose | Users, documents, flashcards |
| AI | Google Gemini API | Summarization + flashcard/quiz generation |
| Auth | JWT + bcrypt | Secure authentication |
| File Storage | Cloudinary | PDF storage |
| PDF Parsing | pdf-parse | Text extraction from PDFs |
| Web Scraping | axios + cheerio | URL content extraction |
| Hosting | Vercel (FE) + Render (BE) | Cloud deployment |

---

## Project Structure

```
quickrev-ai/
│
├── client/                     # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Flashcard.jsx   # Flip card UI
│       │   ├── Quiz.jsx        # MCQ quiz component
│       │   ├── Summary.jsx     # Topic summary display
│       │   └── UploadTabs.jsx  # PDF / URL / Paste tab switcher
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Upload.jsx
│       │   └── Dashboard.jsx
│       ├── api/                # Axios API calls to backend
│       └── App.jsx
│
├── server/                     # Node.js + Express backend
│   ├── routes/
│   │   ├── auth.js             # /api/auth (register, login)
│   │   ├── upload.js           # /api/upload (PDF)
│   │   ├── scrape.js           # /api/scrape (URL)
│   │   ├── paste.js            # /api/paste (raw text)
│   │   └── generate.js         # /api/generate (Gemini call)
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   └── Flashcard.js
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── utils/
│   │   ├── gemini.js           # Gemini API wrapper
│   │   ├── pdfParser.js        # pdf-parse wrapper
│   │   └── scraper.js          # axios + cheerio scraper
│   └── index.js                # Entry point
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) — cloud.mongodb.com
- Google Gemini API key (free) — aistudio.google.com
- Cloudinary account (free) — cloudinary.com

### 1. Clone the repo
git clone https://github.com/your-username/quickrev-ai.git
cd quickrev-ai

### 2. Install all dependencies
bash setup.sh

### 3. Set up environment variables
cp server/.env.example server/.env
# Open server/.env and fill in your credentials

### 4. Run the app
# Terminal 1 — backend
cd server && node index.js

# Terminal 2 — frontend
cd client && npm run dev

Open http://localhost:5173

### Environment Variables
| Variable | Where to get it |
|---|---|
| MONGODB_URI | cloud.mongodb.com → Connect → Drivers |
| JWT_SECRET | Any long random string |
| GEMINI_API_KEY | aistudio.google.com → Get API key |
| CLOUDINARY_CLOUD_NAME | cloudinary.com → Dashboard |
| CLOUDINARY_API_KEY | cloudinary.com → Dashboard |
| CLOUDINARY_API_SECRET | cloudinary.com → Dashboard |

---

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register with email + password |
| POST | `/api/auth/login` | Login, returns JWT |

### Input

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/upload` | `multipart/form-data` (PDF file) | Upload and parse a PDF |
| POST | `/api/scrape` | `{ url: "https://..." }` | Scrape text from a URL |
| POST | `/api/paste` | `{ text: "..." }` | Submit raw pasted text |

### Generate

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/generate` | Sends extracted text to Gemini, returns summary + flashcards + quiz |
| GET | `/api/documents/:id` | Fetch saved flashcards and quiz for a document |

> All routes except `/api/auth/*` require an `Authorization: Bearer <token>` header.

---

## How It Works

```
User input (PDF / URL / text)
        ↓
Backend extracts raw text
  - PDF   → pdf-parse
  - URL   → axios + cheerio (strips nav, footer, scripts)
  - Text  → used directly
        ↓
Text sent to Google Gemini API with structured prompt
  → returns: { summary, flashcards[15], quiz[5] }
        ↓
Results saved to MongoDB (linked to user account)
        ↓
React frontend fetches and renders:
  - Summary card
  - Flashcard flip UI
  - MCQ quiz with instant feedback
```

### Gemini Prompt Template

```
You are a study assistant. Given the text below, return ONLY a valid JSON
object with no markdown formatting, no explanation — just the JSON.

Schema:
{
  "summary": "3-5 sentence overview",
  "flashcards": [{ "question": "...", "answer": "..." }],  // 15 items
  "quiz": [{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": 0   // index of correct option
  }]  // 5 items
}

TEXT:
{extracted_text}
```

### URL Scraping — Supported vs Not Supported

| Works | Does Not Work |
|---|---|
| Wikipedia | Twitter / X |
| GeeksforGeeks | LinkedIn |
| MDN Docs | Notion (public pages) |
| Medium articles | React/Angular SPAs |
| Towards Data Science | Pages behind login |

For unsupported pages, users can copy-paste the text manually using the **Paste text** tab.

---

> QuickRev AI — built to make revision smarter, not harder.
