# 🧠 QuickRev AI

> **Upload, Automate and Ace**
>
> An AI-powered revision platform that transforms your study material — PDFs, web pages, or pasted notes — into flashcards, quizzes, and summaries using spaced repetition.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [How It Works](#-how-it-works)

---

## 🌟 Overview

Students spend hours rereading the same notes — but passive revision leads to poor long-term retention. **QuickRev AI** fixes that.

You can **upload a PDF**, **paste a URL**, or **type your notes**. The app automatically generates:
- 📝 Concise summaries
- 🗂️ Flashcards
- 🎯 Quizzes

Powered by **Google Gemini** and backed by a spaced repetition engine (SM-2 algorithm), it schedules your reviews so that hard topics come back more often, and mastered ones less. **Study smarter, not longer.**

---

## ✨ Features

### 🚀 Phase 1 (Prototype)
- **PDF Upload** — Upload lecture notes or textbook chapters (up to 25 MB).
- **URL Scraping** — Paste any article or documentation URL and extract text automatically.
- **Text Paste** — Paste raw notes directly into the app.
- **AI Summarization** — Get a concise 3–5 sentence overview of your material.
- **Flashcard Generation** — 15 auto-generated Q&A pairs per session.
- **Quiz Generation** — 5 MCQ questions with 4 options and instant feedback.
- **User Authentication** — Secure registration & login with email/password (JWT).

### 🔮 Phase 2 (Completed ✅ / Planned ⏳)
- [x] SM-2 spaced repetition scheduler
- [x] Easy / Good / Hard / Again card rating
- [x] Analytics dashboard with mastery charts
- [ ] Revision calendar heatmap
- [ ] Google OAuth login

---

## 💻 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React + Vite | SPA UI |
| **Styling** | Tailwind CSS | Utility-first styling (Dark Slate & Teal UI) |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB + Mongoose | Users, documents, flashcards |
| **AI** | Google Gemini API | Summarization + flashcard/quiz generation |
| **Auth** | JWT + bcrypt | Secure authentication |
| **File Storage** | Cloudinary | PDF storage |
| **PDF Parsing** | `pdf-parse` | Text extraction from PDFs |
| **Web Scraping** | Axios + Cheerio | URL content extraction |
| **Hosting** | Vercel (FE) + Render (BE)| Cloud deployment |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following before you begin:
- **Node.js** (v18+)
- **MongoDB Atlas** account (free) — [cloud.mongodb.com](https://cloud.mongodb.com/)
- **Google Gemini API Key** (free) — [aistudio.google.com](https://aistudio.google.com/)
- **Cloudinary** account (free) — [cloudinary.com](https://cloudinary.com/)

### Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/your-username/quickrev-ai.git
cd quickrev-ai
```

**2. Install dependencies**
```bash
bash setup.sh
```

**3. Configure Environment Variables**
Copy the example environment file:
```bash
cp server/.env.example server/.env
```
Open `server/.env` and fill in your credentials:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any long random string |
| `GEMINI_API_KEY` | Google AI Studio → Get API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard |

**4. Run the application**

Start the backend server (Terminal 1):
```bash
cd server
node index.js
```

Start the frontend development server (Terminal 2):
```bash
cd client
npm run dev
```

> **Open [http://localhost:5173](http://localhost:5173) in your browser to view the app!**

---

## 📂 Project Structure

```text
quickrev-ai/
├── client/                     # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/         # UI Elements (Flashcards, Quizzes, etc.)
│       ├── pages/              # App Views (Login, Dashboard, Review, Analytics)
│       ├── api/                # Axios API calls
│       └── App.jsx
│
├── server/                     # Node.js + Express backend
│   ├── routes/                 # API endpoints (auth, generate, review, analytics)
│   ├── models/                 # Mongoose schemas (User, Document, ReviewLog)
│   ├── middleware/             # Express middlewares (Auth, etc.)
│   ├── utils/                  # Helpers (Gemini, PDF Parsing, Scraper, sm2)
│   └── index.js                # Server entry point
│
├── .env.example
├── .gitignore
├── setup.sh
├── DEPENDENCIES.md
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register using email and password |
| `POST` | `/api/auth/login` | Login, returns JWT |

### Content Generation
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/generate/pdf` | `multipart/form-data` (file) | Upload and parse a PDF |
| `POST` | `/api/generate/url` | `{ "url": "...", "title": "..." }` | Scrape text from a URL |
| `POST` | `/api/generate/text` | `{ "text": "...", "title": "..." }` | Submit raw pasted text |

### Documents & Spaced Repetition
| Method | Endpoint | Description |
|---|---|---|
| `GET`  | `/api/generate/` | Fetch all documents generated by the user |
| `GET`  | `/api/generate/:id` | Fetch specific document by ID |
| `DELETE` | `/api/generate/:id` | Delete a specific document by ID |
| `GET`  | `/api/generate/due` | Fetch all flashcards due for review today |
| `POST` | `/api/generate/review/:docId/:cardIndex` | Process SM-2 rating review for a flashcard |
| `GET`  | `/api/generate/analytics` | Fetch detailed spaced repetition metrics & progress |

> **Note:** All routes except `/api/auth/*` require an `Authorization: Bearer <token>` header.

---

## ⚙️ How It Works

1. **User Input:** User provides content via PDF, URL, or plain text.
2. **Text Extraction:** Backend extracts raw text using:
   - `pdf-parse` for PDFs
   - `axios` + `cheerio` for URLs (strips navigation, footers, scripts)
   - Direct parsing for plain text
3. **AI Processing:** Raw text is sent to the Google Gemini API with a structured prompt to return a predefined JSON format containing a summary, 15 flashcards, and a 5-question quiz.
4. **Data Storage:** The generated content is linked to the user's account and saved in MongoDB.
5. **UI Rendering:** The React frontend fetches the data to render the Summary card, Flashcard UI, and interactive MCQ Quizzes.

### 🌐 URL Scraping Compatibility

| ✅ Supported | ❌ Not Supported |
|---|---|
| Wikipedia, GeeksforGeeks, MDN Docs | Twitter / X, LinkedIn |
| Medium articles, Towards Data Science | Notion (public pages), Pages behind login |
| Static HTML blogs and articles | React/Angular SPAs |

> For unsupported pages, please use the **Paste text** feature.

---

<p align="center">
  <b>QuickRev AI — built to make revision smarter, not harder.</b>
</p>
