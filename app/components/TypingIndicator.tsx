'use client';

import { DebatePhase } from '@/types/debate';

interface TypingIndicatorProps {
  phase: DebatePhase;
  currentRound: number;
  maxRounds: number;
  activeAgentCount: number;
}

function AnimatedDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

export default function TypingIndicator({
  phase,
  currentRound,
  maxRounds,
  activeAgentCount,
}: TypingIndicatorProps) {
  if (phase === 'idle' || phase === 'complete') return null;

  const getMessage = (): { icon: string; text: string; color: string } => {
    switch (phase) {
      case 'judge_question':
        return {
          icon: '🔍',
          text: `Judge is formulating question for Round ${currentRound}/${maxRounds}`,
          color: 'text-cyan-400',
        };
      case 'advocate_response':
        return {
          icon: '⚔️',
          text: `${activeAgentCount} advocate${activeAgentCount !== 1 ? 's' : ''} researching & responding`,
          color: 'text-blue-400',
        };
      case 'evaluation':
        return {
          icon: '📝',
          text: `Judge is evaluating Round ${currentRound} responses`,
          color: 'text-indigo-400',
        };
      case 'user_input':
        return {
          icon: '💬',
          text: 'Debate paused — waiting for your response',
          color: 'text-green-400',
        };
      case 'verdict':
        return {
          icon: '⚖️',
          text: 'Judge is delivering the final verdict',
          color: 'text-amber-400',
        };
      default:
        return { icon: '', text: '', color: '' };
    }
  };

  const { icon, text, color } = getMessage();
  if (!text) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 backdrop-blur-sm border border-zinc-700/50 shadow-lg">
        <span className="text-sm">{icon}</span>
        <span className={`text-xs font-medium ${color}`}>
          {text}
          <AnimatedDots />
        </span>
      </div>
    </div>
  );
}
