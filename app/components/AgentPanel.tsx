'use client';

import MarkdownContent from '@/app/components/MarkdownContent';

interface AgentPanelProps {
  option: string;
  index: number;
  roundNumber: number;
  responseText: string;
  isActive: boolean;
  isDone: boolean;
  expertLabel?: string;
}

const COLORS = [
  { border: 'border-blue-500', badge: 'bg-blue-500', header: 'bg-blue-500/10', dot: 'bg-blue-400' },
  { border: 'border-emerald-500', badge: 'bg-emerald-500', header: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
  { border: 'border-violet-500', badge: 'bg-violet-500', header: 'bg-violet-500/10', dot: 'bg-violet-400' },
  { border: 'border-orange-500', badge: 'bg-orange-500', header: 'bg-orange-500/10', dot: 'bg-orange-400' },
];

function StreamingDot({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="inline-flex items-center gap-1 ml-2">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

export default function AgentPanel({
  option,
  index,
  roundNumber,
  responseText,
  isActive,
  isDone,
  expertLabel,
}: AgentPanelProps) {
  const color = COLORS[index % COLORS.length];

  const statusLabel = isActive
    ? 'Researching & responding…'
    : isDone
    ? 'Response submitted'
    : 'Waiting for judge\'s question…';

  return (
    <div className={`flex flex-col rounded-2xl border ${color.border} bg-zinc-900 overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 ${color.header}`}>
        <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${color.badge}`}>
          Advocate {index + 1}
        </span>
        <span className="font-semibold text-white truncate">{option}</span>
        <StreamingDot active={isActive} />
        {expertLabel && (
          <span className="ml-auto text-[10px] text-zinc-400 truncate max-w-[200px]" title={expertLabel}>
            {expertLabel}
          </span>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800">
        <span className={`w-2 h-2 rounded-full ${isActive ? `${color.dot} animate-pulse` : isDone ? 'bg-green-500' : 'bg-zinc-600'}`} />
        <span className="text-xs text-zinc-400">{statusLabel}</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto max-h-[50vh]">
        {!responseText && !isActive && !isDone && (
          <p className="text-xs text-zinc-600 italic">Waiting for judge&apos;s question…</p>
        )}
        {!responseText && isDone && (
          <p className="text-xs text-zinc-500 italic">Response was not captured for this round.</p>
        )}
        {responseText && (
          <MarkdownContent content={responseText} enableCitations />
        )}
        {isActive && !responseText && (
          <p className="text-xs text-zinc-500 italic">Searching the web and forming response…</p>
        )}
      </div>
    </div>
  );
}
