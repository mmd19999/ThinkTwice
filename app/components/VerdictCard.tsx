'use client';

import { useMemo } from 'react';
import MarkdownContent from '@/app/components/MarkdownContent';
import VerdictScorecard from '@/app/components/VerdictScorecard';
import { parseScorecard } from '@/lib/scorecard-parser';

interface VerdictCardProps {
  text: string;
  isStreaming: boolean;
}

function StreamingCursor({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="inline-block w-0.5 h-4 bg-amber-400 animate-pulse ml-0.5 align-middle" />;
}

export default function VerdictCard({ text, isStreaming }: VerdictCardProps) {
  if (!text && !isStreaming) return null;

  const scorecard = useMemo(() => {
    if (isStreaming || !text) return null;
    return parseScorecard(text);
  }, [text, isStreaming]);

  return (
    <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-950/40 to-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-amber-500/10 border-b border-amber-500/20">
        <span className="text-lg">⚖️</span>
        <span className="font-bold text-amber-300 text-sm uppercase tracking-widest">
          Judge&apos;s Verdict
        </span>
        {isStreaming && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Deliberating…
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {!text && isStreaming && (
          <p className="text-sm text-zinc-500 italic">Reading all arguments and forming verdict…</p>
        )}
        {text && (
          <div>
            {/* Scorecard visualization */}
            {scorecard && <VerdictScorecard scorecard={scorecard} />}

            {/* Verdict text */}
            <MarkdownContent content={text} />
            <StreamingCursor show={isStreaming} />
          </div>
        )}
      </div>
    </div>
  );
}
