'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import ScoreHeatmap from '../components/ScoreHeatmap';
import RoastCard from '../components/RoastCard';

export default function Home() {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('roast');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const cardRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, mode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Could not reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `${result.username}-${mode}.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-16">
      <header className="mb-10 text-center">
        <p className="mb-2 text-xs uppercase tracking-widest text-muted">$ git blame --profile</p>
        <h1 className="font-display text-4xl font-bold text-paper">
          Roast My <span className="text-ember">GitHub</span>
        </h1>
        <p className="mt-3 text-sm text-muted">
          AI reviews your profile like a senior dev who has opinions. Pick your poison.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center rounded-md border border-border bg-surface px-3">
            <span className="text-muted">@</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-github-username"
              className="w-full bg-transparent py-3 px-2 text-paper outline-none placeholder:text-muted"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-ember px-5 py-3 font-bold text-canvas transition hover:bg-embersoft disabled:opacity-50"
          >
            {loading ? 'Reading commits…' : 'Review me'}
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setMode('roast')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              mode === 'roast' ? 'bg-diffred text-canvas' : 'border border-border text-muted'
            }`}
          >
            🔥 Roast Me
          </button>
          <button
            type="button"
            onClick={() => setMode('hype')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              mode === 'hype' ? 'bg-diffgreen text-canvas' : 'border border-border text-muted'
            }`}
          >
            ⚡ Hype Me
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 rounded-md border border-diffred bg-surface p-4 text-sm text-diffred">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <RoastCard
              ref={cardRef}
              username={result.username}
              avatarUrl={result.avatarUrl}
              roast={result.roast}
              overall={result.scoring.overall}
              mode={mode}
            />
          </div>

          <ScoreHeatmap scores={result.scoring.scores} overall={result.scoring.overall} />

          {result.scoring.flags.length > 0 && (
            <div className="rounded-md border border-border bg-surface p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-muted">flags detected</p>
              <ul className="space-y-1 text-sm text-muted">
                {result.scoring.flags.map((flag, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-diffred">–</span> {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={handleDownload}
              className="rounded-md border border-border px-5 py-2.5 text-sm font-bold text-paper transition hover:border-ember hover:text-ember"
            >
              Download card
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
