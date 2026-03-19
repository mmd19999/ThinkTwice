'use client';

import MarkdownContent from '@/app/components/MarkdownContent';

interface JudgeNotesCardProps {
  text: string;
  isStreaming: boolean;
  decision: 'continue' | 'verdict' | null;
}

export default function JudgeNotesCard({ text, isStreaming, decision }: JudgeNotesCardProps) {
  if (!text && !isStreaming) return null;

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 to-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border-b border-indigo-500/15">
        <span className="text-sm">📝</span>
        <span className="font-semibold text-indigo-300 text-xs uppercase tracking-widest">
          Judge&apos;s Notes
        </span>
        {isStreaming && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-indigo-400">
            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
            Evaluating…
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {!text && isStreaming && (
          <p className="text-xs text-zinc-500 italic">Judge is reviewing all responses…</p>
        )}
        {text && (
          <MarkdownContent content={text} className="text-xs [&_p]:text-xs [&_p]:text-zinc-400 [&_strong]:text-zinc-300" />
        )}
      </div>

      {/* Footer: decision indicator */}
      {decision === 'continue' && !isStreaming && (
        <div className="px-4 py-2 border-t border-indigo-500/15 bg-indigo-500/5">
          <p className="text-[10px] text-indigo-400 font-medium">
            → Continuing to next round
          </p>
        </div>
      )}
    </div>
  );
}
