import { NextRequest, NextResponse } from 'next/server';
import { storeContinuationData } from '@/lib/continuation-store';
import type { DebateRound } from '@/types/debate';

/**
 * POST /api/debate/continue
 *
 * Stores the completed rounds and verdict from a finished debate so a
 * continuation debate can reference them.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { debateId, rounds, verdict } = body as {
    debateId: string;
    rounds: DebateRound[];
    verdict: string;
  };

  if (!debateId || !rounds || !verdict) {
    return NextResponse.json(
      { error: 'Missing debateId, rounds, or verdict' },
      { status: 400 }
    );
  }

  storeContinuationData(debateId, { rounds, verdict });

  return NextResponse.json({ ok: true });
}
