export async function fetchGithubProfile(username) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  if (userRes.status === 404) {
    throw new Error('NOT_FOUND');
  }
  if (!userRes.ok) {
    throw new Error('GITHUB_API_ERROR');
  }
  const user = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );
  if (!reposRes.ok) {
    throw new Error('GITHUB_API_ERROR');
  }
  const repos = await reposRes.json();

  return { user, repos };
}
