# 🔥 Roast My GitHub

AI reviews your GitHub profile like a senior developer doing a code review — except this reviewer has opinions and zero filter. Two modes: **Roast** (savage but fact-based) and **Hype** (genuinely enthusiastic, still honest).

Every score is calculated from real signals pulled from the GitHub API — original vs. forked repos, description quality, recent activity, language diversity, stars. The AI doesn't invent the score; it just writes the commentary around it.

**[Live Demo](#)** — add your deployed link here

## Why this exists

Most portfolio bots either flatter you or roast you with generic insults that could apply to anyone. This one is grounded: every joke or compliment has to reference an actual number from your profile — repo count, star count, how long since you last pushed, how many repos are just forks. The scoring logic is deterministic and separate from the AI, so the number you get is real, not vibes.

## Tech stack

- **Next.js 14** (App Router) — frontend + API route
- **GitHub REST API** — profile and repo data
- **Google Gemini API** — roast/hype generation
- **Tailwind CSS** — styling
- **html-to-image** — client-side shareable card generation, no server-side image rendering needed

## How scoring works

Five sub-scores, computed in [`lib/scoring.js`](./lib/scoring.js), purely from GitHub data — no AI:

| Category | Signal |
|---|---|
| Profile Strength | bio, blog link, company, followers, profile README |
| Project Depth | repo count, description quality, stars, repo size |
| Originality | generic repo names penalized, language diversity rewarded, fork ratio |
| Consistency | recent push activity relative to account age |
| Documentation | percentage of repos with a real description |

The AI (`lib/gemini.js`) receives these scores plus flagged issues (e.g. "3 generic repo names", "nothing pushed in 3 months") and writes commentary that has to reference at least 2 real numbers — this is enforced in the prompt to keep it from generating generic filler.

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/roast-my-github.git
cd roast-my-github
npm install
cp .env.local.example .env.local
# add your GEMINI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Get a Gemini API key (free)

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a key, paste it into `.env.local` as `GEMINI_API_KEY`

### Optional: GitHub token

Unauthenticated GitHub API requests are capped at 60/hour. Add a [personal access token](https://github.com/settings/tokens) (no scopes needed, public data only) as `GITHUB_TOKEN` to bump this to 5000/hour.

## Deploy

Push to GitHub, then import the repo on [Vercel](https://vercel.com/new). Add `GEMINI_API_KEY` (and optionally `GITHUB_TOKEN`) as environment variables in the Vercel dashboard. Done.

## Project structure

```
app/
  api/roast/route.js   → API endpoint: fetch GitHub data, score it, generate roast
  page.js              → main UI
  layout.js            → fonts + metadata
components/
  RoastCard.js          → shareable card (PR-comment styled)
  ScoreHeatmap.js       → commit-graph styled scorecard
lib/
  github.js             → GitHub API client
  scoring.js             → deterministic scoring engine
  gemini.js              → Gemini API wrapper + prompt
```

## Roadmap ideas

- Cache results per username (avoid re-hitting GitHub/Gemini on repeat views)
- Add a leaderboard of funniest roasts (opt-in share)
- Weight scoring by primary language / experience level
- Compare two profiles head-to-head

---

Built by [Anmol Chaturvedi](https://github.com/Anmol29c)
