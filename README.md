# 🔥 Roast My GitHub

> **An AI-powered GitHub profile reviewer that turns real GitHub signals into fact-based roasts and hype.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://roast-my-github-rose.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Gemini](https://img.shields.io/badge/AI-Gemini-8E75B6)](https://ai.google.dev/)
[![GitHub API](https://img.shields.io/badge/API-GitHub-181717?logo=github)](https://docs.github.com/en/rest)

## 🌐 Live Demo

https://roast-my-github-rose.vercel.app

## 🎯 The Idea

Most GitHub portfolio reviewers either produce generic compliments or generic insults. Roast My GitHub takes a different approach: **the scoring engine is deterministic, while AI is used only to communicate the result.**

A profile is evaluated using real signals from the GitHub API, then Gemini turns those findings into either a **Roast** or **Hype** review.

```text
GitHub Username
      ↓
GitHub REST API
      ↓
Profile + Repository Signals
      ↓
Deterministic Scoring Engine
      ↓
Gemini Commentary
      ↓
Roast / Hype Result
```

## ✨ Features

- 🔎 GitHub profile and repository analysis
- 📊 Deterministic multi-factor scoring
- 🔥 Roast mode
- 🚀 Hype mode
- 🧠 AI-generated commentary grounded in actual profile data
- 🃏 Shareable result cards
- 📱 Responsive interface

## 📐 Scoring Model

The scoring logic lives in `lib/scoring.js` and uses GitHub data rather than asking an AI model to invent a score.

| Category | Signals |
|---|---|
| Profile Strength | Bio, blog, company, followers, profile README |
| Project Depth | Repository count, descriptions, stars, repository size |
| Originality | Generic names, language diversity, fork ratio |
| Consistency | Recent push activity relative to account age |
| Documentation | Repository description coverage |

Gemini receives the calculated scores and flagged observations, then produces the human-readable review.

## 🛠️ Tech Stack

- **Next.js 14 / App Router** — application and API route
- **React** — UI
- **GitHub REST API** — profile/repository data
- **Google Gemini API** — review generation
- **Tailwind CSS** — styling
- **html-to-image** — client-side shareable cards
- **Vercel** — deployment

## 📂 Project Structure

```text
app/
├── api/roast/route.js   # API workflow
├── page.js              # Main UI
└── layout.js            # Metadata and fonts

components/
├── RoastCard.js         # Shareable result card
└── ScoreHeatmap.js      # Score visualization

lib/
├── github.js            # GitHub API client
├── scoring.js           # Deterministic scoring engine
└── gemini.js            # Gemini integration and prompt
```

## 🚀 Run Locally

```bash
git clone https://github.com/Anmol29c/Roast-My-Github.git
cd Roast-My-Github
npm install
cp .env.local.example .env.local
```

Add your API credentials to `.env.local`, then:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Environment Variables

```env
GEMINI_API_KEY=your_key
GITHUB_TOKEN=optional_token
```

The GitHub token is optional and can increase API rate limits. Never commit secrets.

## ☁️ Deploy

The application is designed for straightforward Vercel deployment. Configure the required environment variables in the deployment platform and deploy the repository.

## 🧠 Engineering Takeaways

This project explores a useful AI pattern: **keep objective computation in code and use an LLM for interpretation and communication.** That separation makes the output easier to reason about than letting an LLM decide the underlying score.

## 🗺️ Roadmap

- [ ] Cache repeated profile analyses
- [ ] Optional public leaderboard
- [ ] Experience-aware scoring profiles
- [ ] Head-to-head profile comparison
- [ ] More detailed repository-level insights

## 👨‍💻 Author

**Anmol Chaturvedi**  
AI/ML Developer • Full-Stack Builder

[GitHub](https://github.com/Anmol29c) • [LinkedIn](https://www.linkedin.com/in/anmol-chaturvedi-a911b5413/)

---

⭐ If you enjoy the project, star the repository and try your GitHub profile.