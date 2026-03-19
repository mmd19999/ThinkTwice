'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SavedDebate } from '@/types/debate';

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function extractWinner(verdict: string): string | null {
  const match = verdict.match(/\*\*Winner:\s*(.+?)\*\*/);
  if (match) return match[1].trim();
  const match2 = verdict.match(/Winner:\s*(.+?)[\n\r*]/);
  if (match2) return match2[1].trim();
  return null;
}

export default function HistoryPage() {
  const router = useRouter();
  const [debates, setDebates] = useState<SavedDebate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('decision-maker-debates') || '[]') as SavedDebate[];
      setDebates(saved);
    } catch {
      setDebates([]);
    }
    setLoaded(true);
  }, []);

  const deleteDebate = (id: string) => {
    const updated = debates.filter((d) => d.id !== id);
    setDebates(updated);
    localStorage.setItem('decision-maker-debates', JSON.stringify(updated));
  };

  const clearAll = () => {
    setDebates([]);
    localStorage.removeItem('decision-maker-debates');
  };

  const optionColors = [
    'text-blue-400',
    'text-emerald-400',
    'text-violet-400',
    'text-orange-400',
    'text-pink-400',
    'text-cyan-400',
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              &larr; Back
            </button>
            <h1 className="text-2xl font-bold tracking-tight">Past Debates</h1>
            <p className="text-zinc-500 text-sm">
              {debates.length} debate{debates.length !== 1 ? 's' : ''} saved locally
            </p>
          </div>
          {debates.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-zinc-500 hover:text-red-400 transition px-3 py-1.5 rounded-lg hover:bg-red-900/20"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {loaded && debates.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="text-4xl">&#x1F4DC;</div>
            <p className="text-zinc-500 text-sm">No debates yet. Start your first one!</p>
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition"
            >
              Start a debate
            </button>
          </div>
        )}

        {/* Debate list */}
        <div className="space-y-3">
          {debates.map((debate) => {
            const winner = extractWinner(debate.verdict);

            return (
              <div
                key={debate.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition overflow-hidden group"
              >
                {/* Main card content */}
                <div className="px-5 py-4 space-y-3">
                  {/* Options as tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {debate.options.map((opt, i) => (
                      <span
                        key={i}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-800 ${
                          winner && opt === winner ? 'ring-1 ring-amber-500/50 text-amber-300' : optionColors[i % optionColors.length]
                        }`}
                      >
                        {winner && opt === winner && (
                          <span className="mr-1">&#x1F451;</span>
                        )}
                        {opt}
                      </span>
                    ))}
                  </div>

                  {/* Prompt (if smart mode was used) */}
                  {debate.prompt && (
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      &ldquo;{debate.prompt}&rdquo;
                    </p>
                  )}

                  {/* Expert labels */}
                  {debate.experts && debate.experts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {debate.experts.map((e, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded"
                        >
                          {e.option}: {e.expert}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                    <span>{debate.rounds.length} round{debate.rounds.length !== 1 ? 's' : ''}</span>
                    <span>&middot;</span>
                    <span>{debate.language}</span>
                    <span>&middot;</span>
                    <span>{debate.model}</span>
                    <span className="ml-auto">{formatDate(debate.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-800/30 border-t border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deleteDebate(debate.id)}
                    className="text-[10px] text-zinc-500 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        id: debate.id,
                        view: 'saved',
                      });
                      router.push(`/history/${debate.id}`);
                    }}
                    className="text-[10px] text-zinc-400 hover:text-white transition"
                  >
                    View full debate &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
