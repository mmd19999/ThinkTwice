'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownContent from '@/app/components/MarkdownContent';
import VerdictScorecard from '@/app/components/VerdictScorecard';
import { parseScorecard } from '@/lib/scorecard-parser';
import type { SavedDebate } from '@/types/debate';

function extractWinner(verdict: string): string | null {
  const match = verdict.match(/\*\*Winner:\s*(.+?)\*\*/);
  if (match) return match[1].trim();
  return null;
}

export default function SavedDebatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [debate, setDebate] = useState<SavedDebate | null>(null);
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('decision-maker-debates') || '[]') as SavedDebate[];
      const found = saved.find((d) => d.id === id);
      setDebate(found ?? null);
      // Expand all rounds by default
      if (found) {
        setExpandedRounds(new Set(found.rounds.map((r) => r.roundNumber)));
      }
    } catch {
      setDebate(null);
    }
  }, [id]);

  const toggleRound = (roundNumber: number) => {
    setExpandedRounds((prev) => {
      const next = new Set(prev);
      if (next.has(roundNumber)) {
        next.delete(roundNumber);
      } else {
        next.add(roundNumber);
      }
      return next;
    });
  };

  if (!debate) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-500">Debate not found</p>
          <button
            onClick={() => router.push('/history')}
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            &larr; Back to history
          </button>
        </div>
      </div>
    );
  }

  const scorecard = parseScorecard(debate.verdict);
  const winner = extractWinner(debate.verdict);

  const optionColors = [
    { border: 'border-blue-500/30', bg: 'bg-blue-950/20', text: 'text-blue-400', badge: 'bg-blue-500' },
    { border: 'border-emerald-500/30', bg: 'bg-emerald-950/20', text: 'text-emerald-400', badge: 'bg-emerald-500' },
    { border: 'border-violet-500/30', bg: 'bg-violet-950/20', text: 'text-violet-400', badge: 'bg-violet-500' },
    { border: 'border-orange-500/30', bg: 'bg-orange-950/20', text: 'text-orange-400', badge: 'bg-orange-500' },
    { border: 'border-pink-500/30', bg: 'bg-pink-950/20', text: 'text-pink-400', badge: 'bg-pink-500' },
    { border: 'border-cyan-500/30', bg: 'bg-cyan-950/20', text: 'text-cyan-400', badge: 'bg-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <button
          onClick={() => router.push('/history')}
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          &larr; Back to history
        </button>
        <span className="text-sm text-zinc-500">
          {debate.rounds.length} rounds &middot; {debate.language} &middot; {debate.model}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Options header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {debate.options.map((opt, i) => (
              <span
                key={i}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg bg-zinc-800 ${
                  winner && opt === winner ? 'ring-1 ring-amber-500/50 text-amber-300' : optionColors[i % optionColors.length].text
                }`}
              >
                {winner && opt === winner && <span className="mr-1">&#x1F451;</span>}
                {opt}
              </span>
            ))}
          </div>

          {debate.prompt && (
            <p className="text-sm text-zinc-400 italic">&ldquo;{debate.prompt}&rdquo;</p>
          )}

          {debate.experts && debate.experts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {debate.experts.map((e, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-lg border ${optionColors[i % optionColors.length].border} ${optionColors[i % optionColors.length].bg} ${optionColors[i % optionColors.length].text}`}>
                  {e.option}: {e.expert}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Verdict */}
        <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-950/40 to-zinc-900 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-amber-500/10 border-b border-amber-500/20">
            <span className="text-lg">&#x2696;&#xFE0F;</span>
            <span className="font-bold text-amber-300 text-sm uppercase tracking-widest">
              Judge&apos;s Verdict
            </span>
          </div>
          <div className="px-5 py-4">
            {scorecard && <VerdictScorecard scorecard={scorecard} />}
            <MarkdownContent content={debate.verdict} />
          </div>
        </div>

        {/* Rounds */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Debate Rounds</h2>

          {debate.rounds.map((round) => {
            const isExpanded = expandedRounds.has(round.roundNumber);

            return (
              <div key={round.roundNumber} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                {/* Round header */}
                <button
                  onClick={() => toggleRound(round.roundNumber)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition text-left"
                >
                  <span className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                    {round.roundNumber}
                  </span>
                  <span className="flex-1 text-sm text-zinc-300 truncate">{round.judgeQuestion}</span>
                  <span className="text-zinc-500 text-xs shrink-0">
                    {isExpanded ? '\u25B2' : '\u25BC'}
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-zinc-800/50">
                    {/* Judge question */}
                    <div className="pt-3">
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Judge&apos;s Question</p>
                      <p className="text-sm text-zinc-300">{round.judgeQuestion}</p>
                    </div>

                    {/* Advocate responses */}
                    {round.responses.map((resp, i) => {
                      const color = optionColors[i % optionColors.length];
                      return (
                        <div key={i} className={`rounded-lg border ${color.border} ${color.bg} p-4`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${color.badge}`}>
                              Advocate {i + 1}
                            </span>
                            <span className={`text-xs font-semibold ${color.text}`}>{resp.option}</span>
                            {debate.experts?.[i] && (
                              <span className="text-[10px] text-zinc-500 ml-auto">{debate.experts[i].expert}</span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-300 leading-relaxed">
                            <MarkdownContent content={resp.response} enableCitations />
                          </div>
                        </div>
                      );
                    })}

                    {/* User clarification */}
                    {round.userClarification && (
                      <div className="rounded-lg border border-green-500/30 bg-green-950/20 p-3">
                        <p className="text-[10px] font-semibold text-green-400 uppercase tracking-widest mb-1">User Clarification</p>
                        <p className="text-xs text-zinc-400"><span className="font-semibold text-zinc-300">Q:</span> {round.userClarification.question}</p>
                        <p className="text-xs text-zinc-300 mt-1"><span className="font-semibold">A:</span> {round.userClarification.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-16">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 transition"
          >
            Start a new debate
          </button>
        </div>
      </div>
    </div>
  );
}
