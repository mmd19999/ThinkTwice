'use client';

import { useState } from 'react';

interface ChallengeVerdictCardProps {
  onContinue: (challenge: string) => Promise<void>;
}

export default function ChallengeVerdictCard({ onContinue }: ChallengeVerdictCardProps) {
  const [input, setInput] = useState('');
  const [isContinuing, setIsContinuing] = useState(false);

  const handleContinue = async () => {
    if (!input.trim() || isContinuing) return;
    setIsContinuing(true);
    try {
      await onContinue(input.trim());
    } catch {
      setIsContinuing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/10 to-zinc-900 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-amber-500/5 border-b border-amber-500/10">
        <span className="text-sm">&#x1F4AC;</span>
        <span className="font-semibold text-amber-300/80 text-xs uppercase tracking-widest">
          Not satisfied? Challenge the verdict
        </span>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-xs text-zinc-400 leading-relaxed">
          If you think the debate missed something or the reasoning was flawed, explain what was wrong.
          The debate will continue with additional rounds addressing your concerns.
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleContinue();
            }
          }}
          placeholder="e.g. You didn't consider the long-term maintenance costs, and the winner actually has terrible customer support based on recent reviews..."
          rows={3}
          disabled={isContinuing}
          className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition resize-none disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-500">
            Press Cmd+Enter to continue
          </span>
          <button
            onClick={handleContinue}
            disabled={!input.trim() || isContinuing}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition"
          >
            {isContinuing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                Continuing debate...
              </span>
            ) : (
              'Continue Debate \u2192'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
