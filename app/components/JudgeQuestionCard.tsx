'use client';

import MarkdownContent from '@/app/components/MarkdownContent';

interface JudgeQuestionCardProps {
  roundNumber: number;
  maxRounds: number;
  question: string;
  isStreaming: boolean;
}

function StreamingCursor({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="inline-block w-0.5 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle" />;
}

export default function JudgeQuestionCard({
  roundNumber,
  maxRounds,
  question,
  isStreaming,
}: JudgeQuestionCardProps) {
  if (!question && !isStreaming) return null;

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/30 to-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-cyan-500/10 border-b border-cyan-500/20">
        <span className="text-lg">🔍</span>
        <span className="font-bold text-cyan-300 text-sm uppercase tracking-widest">
          Round {roundNumber}/{maxRounds} — Judge&apos;s Question
        </span>
        {isStreaming && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Formulating question…
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {!question && isStreaming && (
          <p className="text-sm text-zinc-500 italic">Judge is analyzing the options…</p>
        )}
        {question && (
          <div>
            <MarkdownContent content={question} className="font-medium" />
            <StreamingCursor show={isStreaming} />
          </div>
        )}
      </div>
    </div>
  );
}
