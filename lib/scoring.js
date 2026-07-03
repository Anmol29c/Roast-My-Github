// Deterministic scoring — no AI involved here on purpose.
// The roast can be funny and chaotic; the score has to be honest,
// otherwise the whole tool is just a compliment machine with extra steps.

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

const GENERIC_REPO_NAMES = [
  'todo', 'todo-app', 'to-do', 'weather-app', 'calculator',
  'portfolio', 'my-portfolio', 'test', 'test-repo', 'hello-world',
  'learning', 'practice', 'demo', 'sample',
];

export function calculateScore(user, repos) {
  const ownRepos = repos.filter((r) => !r.fork);
  const forkedCount = repos.length - ownRepos.length;

  // --- Profile Strength ---
  let profileStrength = 0;
  if (user.bio) profileStrength += 20;
  if (user.blog) profileStrength += 15;
  if (user.company) profileStrength += 10;
  if (user.avatar_url && !user.avatar_url.includes('gravatar')) profileStrength += 10;
  profileStrength += Math.min(user.followers * 2, 25);
  if (ownRepos.some((r) => r.name.toLowerCase() === user.login.toLowerCase())) {
    profileStrength += 20; // has a profile README repo
  }
  profileStrength = clamp(profileStrength);

  // --- Project Depth ---
  const reposWithDescription = ownRepos.filter((r) => r.description && r.description.length > 15);
  const reposWithStars = ownRepos.filter((r) => r.stargazers_count > 0);
  const avgSize = ownRepos.length
    ? ownRepos.reduce((sum, r) => sum + r.size, 0) / ownRepos.length
    : 0;

  let projectDepth = 0;
  projectDepth += Math.min(ownRepos.length * 6, 30);
  projectDepth += clamp((reposWithDescription.length / Math.max(ownRepos.length, 1)) * 25, 0, 25);
  projectDepth += Math.min(reposWithStars.length * 8, 20);
  projectDepth += avgSize > 200 ? 25 : avgSize > 50 ? 15 : 5;
  projectDepth = clamp(projectDepth);

  // --- Originality ---
  const genericCount = ownRepos.filter((r) =>
    GENERIC_REPO_NAMES.some((g) => r.name.toLowerCase().includes(g))
  ).length;
  const languages = new Set(ownRepos.map((r) => r.language).filter(Boolean));

  let originality = 60;
  originality -= genericCount * 12;
  originality += Math.min(languages.size * 8, 30);
  originality -= forkedCount > ownRepos.length ? 20 : 0;
  originality = clamp(originality);

  // --- Consistency ---
  const now = new Date();
  const recentlyPushed = ownRepos.filter((r) => {
    const pushed = new Date(r.pushed_at);
    const monthsAgo = (now - pushed) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo <= 3;
  });
  const accountAgeYears = (now - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365);

  let consistency = 0;
  consistency += Math.min((recentlyPushed.length / Math.max(ownRepos.length, 1)) * 50, 50);
  consistency += accountAgeYears > 0.5 ? Math.min(ownRepos.length / accountAgeYears * 10, 30) : 10;
  consistency += user.public_repos > 3 ? 20 : 5;
  consistency = clamp(consistency);

  // --- Documentation ---
  let documentation = clamp(
    (reposWithDescription.length / Math.max(ownRepos.length, 1)) * 100
  );

  const overall = clamp(
    profileStrength * 0.2 +
    projectDepth * 0.3 +
    originality * 0.2 +
    consistency * 0.15 +
    documentation * 0.15
  );

  const flags = [];
  if (genericCount >= 2) flags.push(`${genericCount} generically-named repos (todo/weather/calculator energy)`);
  if (reposWithDescription.length < ownRepos.length * 0.4) flags.push('most repos have no real description');
  if (forkedCount > ownRepos.length) flags.push('forks outnumber original work');
  if (recentlyPushed.length === 0 && ownRepos.length > 0) flags.push('nothing pushed in the last 3 months');
  if (!user.bio) flags.push('empty bio');
  if (languages.size <= 1 && ownRepos.length > 3) flags.push('everything in one language, zero range');
  if (reposWithStars.length === 0 && ownRepos.length > 2) flags.push('zero stars across every repo');

  return {
    scores: {
      profileStrength,
      projectDepth,
      originality,
      consistency,
      documentation,
    },
    overall,
    flags,
    stats: {
      totalRepos: ownRepos.length,
      forkedCount,
      languages: Array.from(languages),
      totalStars: ownRepos.reduce((s, r) => s + r.stargazers_count, 0),
      accountAgeYears: Math.round(accountAgeYears * 10) / 10,
    },
  };
}
