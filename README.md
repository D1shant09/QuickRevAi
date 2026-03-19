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
- MongoDB Atlas account (free tier)
- Google Gemini API key — get it free at [aistudio.google.com](https://aistudio.google.com)
- Cloudinary account (free tier)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/quickrev-ai.git
cd quickrev-ai
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Fill in your values (see Environment Variables section below)
```

### 4. Run the app locally

```bash
# Terminal 1 — backend
cd server
npm run dev        # runs on http://localhost:5000

# Terminal 2 — frontend
cd client
npm run dev        # runs on http://localhost:5173
```

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/quickrevai

# JWT
JWT_SECRET=your_super_secret_key_here

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=5000
CLIENT_URL=http://localhost:5173
```

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

## Roadmap

- [x] Project structure and API design
- [ ] User authentication (JWT)
- [ ] PDF upload + text extraction
- [ ] URL scraping
- [ ] Text paste input
- [ ] Gemini API integration
- [ ] Flashcard + quiz UI
- [ ] SM-2 spaced repetition engine
- [ ] Analytics dashboard
- [ ] Google OAuth
- [ ] Deployment (Vercel + Render)

---

## Team

**MLR Institute of Technology, Hyderabad — Department of Information Technology**
Mini Project | Batch 01 | 2023–2027

| Name | Roll Number | Role |
|---|---|---|
| F. Dishant | 23R21A12E0 | Team Lead |
| K. Eeshytva | 23R21A12F3 | Developer |
| K. Mahathi | 23R21A12F4 | Developer |
| P.V. Sarika | 23R21A12H1 | Developer |

**Guide:** Dr. B. VeeraSekhar Reddy (Assistant Professor, IT Department)

---

> QuickRev AI — built to make revision smarter, not harder.