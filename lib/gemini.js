import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt({ username, user, scoring, mode }) {
  const { scores, overall, flags, stats } = scoring;

  const tone =
    mode === 'hype'
      ? 'You are a hype-man code reviewer. Genuinely enthusiastic, specific, never generic. Still honest — find the real good stuff, don\'t make things up.'
      : 'You are a savage but fair senior developer doing a code review roast. Witty, sharp, a little mean, but every joke must be backed by an actual fact from the data below — never generic insults.';

  return `${tone}

Return ONLY valid JSON, no markdown fences, no preamble. Shape:
{
  "headline": "one punchy sentence, max 18 words, the single best roast/hype line",
  "body": "3-4 sentences, conversational, referencing specific real facts from the data",
  "verdict": "one short closing line, max 12 words"
}

GitHub profile data for @${username}:
- Bio: ${user.bio || 'none'}
- Public repos: ${user.public_repos}
- Followers: ${user.followers}
- Account age: ${stats.accountAgeYears} years
- Original (non-fork) repos: ${stats.totalRepos}
- Forked repos: ${stats.forkedCount}
- Languages used: ${stats.languages.join(', ') || 'none detected'}
- Total stars across repos: ${stats.totalStars}
- Overall score: ${overall}/100
- Sub-scores: Profile Strength ${scores.profileStrength}, Project Depth ${scores.projectDepth}, Originality ${scores.originality}, Consistency ${scores.consistency}, Documentation ${scores.documentation}
- Flags detected: ${flags.length ? flags.join('; ') : 'none — profile is clean'}

Rules: reference at least 2 specific numbers or facts from above. Do not invent details not present in the data. Keep it sharp, not cruel — this should be funny to read even for the person it's about.`;
}

export async function generateRoast({ username, user, scoring, mode }) {
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = buildPrompt({ username, user, scoring, mode });
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    // Fallback if the model wraps or slightly malforms JSON
    return {
      headline: mode === 'hype' ? 'Solid profile, real work in there.' : 'This profile has... choices.',
      body: text.slice(0, 400),
      verdict: mode === 'hype' ? 'Keep shipping.' : 'Do better. Or don\'t. Whatever.',
    };
  }
}
