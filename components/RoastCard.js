'use client';

import { forwardRef } from 'react';

const RoastCard = forwardRef(function RoastCard(
  { username, avatarUrl, roast, overall, mode },
  ref
) {
  const isHype = mode === 'hype';
  const accent = isHype ? '#3FB950' : '#F85149';
  const underlineClass = isHype ? 'hype-underline' : 'roast-underline';

  return (
    <div
      ref={ref}
      className="w-[560px] rounded-lg border p-6"
      style={{ backgroundColor: '#0D1117', borderColor: '#30363D' }}
    >
      <div className="mb-4 flex items-center gap-2 text-xs" style={{ color: '#8B949E' }}>
        <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: accent, color: '#0D1117', fontWeight: 700 }}>
          {isHype ? 'HYPE MODE' : 'ROAST MODE'}
        </span>
        <span>ai-reviewer commented on @{username}&apos;s profile</span>
      </div>

      <div className="mb-4 flex items-start gap-3">
        {avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={username} className="h-10 w-10 rounded-full" crossOrigin="anonymous" />
        )}
        <div className={`${isHype ? 'diff-mark-add' : 'diff-mark-remove'} flex-1 rounded px-3 py-2`}>
          <p className={`font-display text-lg font-bold leading-snug ${underlineClass}`} style={{ color: '#E6EDF3' }}>
            {roast.headline}
          </p>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed" style={{ color: '#8B949E' }}>
        {roast.body}
      </p>

      <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: '#30363D' }}>
        <span className="text-sm font-bold" style={{ color: accent }}>
          {roast.verdict}
        </span>
        <span className="font-display text-xl font-bold" style={{ color: '#FF6B35' }}>
          {overall}/100
        </span>
      </div>

      <div className="mt-4 text-center text-[10px]" style={{ color: '#30363D' }}>
        roastmy.github — try yours
      </div>
    </div>
  );
});

export default RoastCard;
