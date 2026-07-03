'use client';

const LABELS = {
  profileStrength: 'Profile Strength',
  projectDepth: 'Project Depth',
  originality: 'Originality',
  consistency: 'Consistency',
  documentation: 'Documentation',
};

function intensityColor(level) {
  // level 0-9, mimics a contribution-graph gradient but in ember tones
  const stops = ['#161B22', '#3A1F14', '#7A3A1E', '#C4531F', '#FF6B35', '#FFA36C'];
  const idx = Math.min(Math.floor((level / 9) * (stops.length - 1)), stops.length - 1);
  return stops[idx];
}

function ScoreRow({ label, value }) {
  const litSquares = Math.round((value / 100) * 10);
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-36 shrink-0 text-xs text-muted">{label}</span>
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-[2px]"
            style={{
              backgroundColor: i < litSquares ? intensityColor(litSquares) : '#161B22',
              border: '1px solid #30363D',
            }}
          />
        ))}
      </div>
      <span className="ml-1 text-xs font-bold text-embersoft">{value}</span>
    </div>
  );
}

export default function ScoreHeatmap({ scores, overall }) {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wide text-muted">score.log</span>
        <span className="font-display text-2xl font-bold text-ember">{overall}/100</span>
      </div>
      {Object.entries(scores).map(([key, value]) => (
        <ScoreRow key={key} label={LABELS[key] || key} value={value} />
      ))}
    </div>
  );
}
