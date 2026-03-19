'use client';

import { useState, useEffect } from 'react';

interface CollapsibleRoundProps {
  roundNumber: number;
  maxRounds: number;
  isCurrentRound: boolean;
  judgeQuestion: string;
  children: React.ReactNode;
}

export default function CollapsibleRound({
  roundNumber,
  maxRounds,
  isCurrentRound,
  judgeQuestion,
  children,
}: CollapsibleRoundProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-collapse when round is no longer current
  useEffect(() => {
    if (!isCurrentRound) {
      // Small delay so user sees the transition
      const timeout = setTimeout(() => setIsExpanded(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setIsExpanded(true);
    }
  }, [isCurrentRound]);

  // Current round cannot be collapsed
  if (isCurrentRound) {
    return <div>{children}</div>;
  }

  const truncatedQuestion = judgeQuestion.length > 80
    ? judgeQuestion.slice(0, 80) + '…'
    : judgeQuestion;

  return (
    <div>
      {/* Collapsed header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition group text-left"
      >
        <span className="text-xs font-bold text-zinc-500 shrink-0">
          R{roundNumber}/{maxRounds}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
        <span className="text-xs text-zinc-400 truncate flex-1">
          {truncatedQuestion || 'Round complete'}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable content */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
