import { NextRequest, NextResponse } from 'next/server';
import { debateStore } from '../route';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, input } = body as { id: string; input: string };

  if (!id || typeof input !== 'string') {
    return NextResponse.json(
      { error: 'Missing debate id or input' },
      { status: 400 }
    );
  }

  const entry = debateStore.get(id);
  if (!entry) {
    return NextResponse.json(
      { error: 'Debate not found' },
      { status: 404 }
    );
  }

  if (!entry.waitingForUserInput || !entry.userInputResolve) {
    return NextResponse.json(
      { error: 'Debate is not waiting for user input' },
      { status: 409 }
    );
  }

  // Resolve the promise — this unblocks the orchestrator
  const resolver = entry.userInputResolve;
  entry.userInputResolve = null;
  entry.waitingForUserInput = false;
  resolver(input.trim() || 'No additional context provided.');

  return NextResponse.json({ ok: true });
}
