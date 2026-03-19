import { DebateRound } from '@/types/debate';

/**
 * In-memory store for debate rounds that can be continued.
 * When a user wants to continue a debate after verdict, the frontend
 * stores the completed rounds here so the new debate can reference them.
 * Auto-cleans after 30 minutes.
 */

export interface ContinuationData {
  rounds: DebateRound[];
  verdict: string;
}

export const continuationStore = new Map<string, ContinuationData>();

export function storeContinuationData(debateId: string, data: ContinuationData) {
  continuationStore.set(debateId, data);
  // Auto-clean after 30 minutes
  setTimeout(() => continuationStore.delete(debateId), 30 * 60 * 1000);
}
