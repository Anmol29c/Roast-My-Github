import { NextResponse } from 'next/server';
import { fetchGithubProfile } from '../../../lib/github';
import { calculateScore } from '../../../lib/scoring';
import { generateRoast } from '../../../lib/gemini';

export async function POST(request) {
  try {
    const { username, mode } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const cleanUsername = username.trim().replace(/^@/, '');
    const { user, repos } = await fetchGithubProfile(cleanUsername);

    if (!Array.isArray(repos)) {
      return NextResponse.json({ error: 'Could not read repos for this user.' }, { status: 502 });
    }

    const scoring = calculateScore(user, repos);
    const roast = await generateRoast({
      username: cleanUsername,
      user,
      scoring,
      mode: mode === 'hype' ? 'hype' : 'roast',
    });

    return NextResponse.json({
      username: cleanUsername,
      avatarUrl: user.avatar_url,
      name: user.name,
      scoring,
      roast,
    });
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'That GitHub username does not exist.' }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Something broke. Try again in a bit.' }, { status: 500 });
  }
}
