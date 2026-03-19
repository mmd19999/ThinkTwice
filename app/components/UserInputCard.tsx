'use client';

import { useState, useRef, useEffect } from 'react';

interface UserInputCardProps {
  question: string;
  roundNumber: number;
  onSubmit: (input: string) => void;
  isSubmitted: boolean;
  submittedAnswer?: string;
}

export default function UserInputCard({
  question,
  roundNumber,
  onSubmit,
  isSubmitted,
  submittedAnswer,
}: UserInputCardProps) {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  void roundNumber; // available for future use

  // Auto-focus textarea when card appears
  useEffect(() => {
    if (!isSubmitted && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isSubmitted]);

  const handleSubmit = () => {
    if (!input.trim() || isSubmitting) return;
    setIsSubmitting(true);
    onSubmit(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // After submission: show read-only card with the answer
  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-950/20 to-zinc-900 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-b border-green-500/15">
          <span className="text-sm">💬</span>
          <span className="font-semibold text-green-300 text-xs uppercase tracking-widest">
            Your Clarification
          </span>
          <span className="ml-auto text-[10px] text-green-400 font-medium">Submitted</span>
        </div>
        <div className="px-4 py-3 space-y-2">
          <p className="text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300">Judge asked:</span> {question}
          </p>
          <div className="text-xs text-zinc-300 bg-zinc-800/50 rounded-lg px-3 py-2 leading-relaxed">
            {submittedAnswer}
          </div>
        </div>
      </div>
    );
  }

  // Active input state
  return (
    <div className="rounded-xl border border-green-500/40 bg-gradient-to-br from-green-950/30 to-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border-b border-green-500/20">
        <span className="text-sm">💬</span>
        <span className="font-semibold text-green-300 text-xs uppercase tracking-widest">
          Judge Needs Your Input
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Debate paused
        </span>
      </div>

      {/* Question */}
      <div className="px-4 pt-3">
        <p className="text-sm text-zinc-200 font-medium leading-relaxed">{question}</p>
      </div>

      {/* Input area */}
      <div className="px-4 py-3 space-y-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer here..."
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-green-500/50 transition resize-none disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-500">
            Press Cmd+Enter to submit
          </span>
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isSubmitting}
            className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition"
          >
            {isSubmitting ? 'Submitting…' : 'Submit & Continue Debate'}
          </button>
        </div>
      </div>
    </div>
  );
}
