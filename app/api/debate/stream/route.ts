import { NextRequest } from 'next/server';
import { debateStore } from '../route';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing debate id', { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Wait up to 5s for the debate job to be registered
      let waited = 0;
      while (!debateStore.has(id) && waited < 5000) {
        await sleep(100);
        waited += 100;
      }

      const entry = debateStore.get(id);
      if (!entry) {
        controller.enqueue(encoder.encode('data: {"type":"error","error":"Debate not found"}\n\n'));
        controller.close();
        return;
      }

      let cursor = 0;

      while (true) {
        // Drain any buffered events
        while (cursor < entry.events.length) {
          controller.enqueue(encoder.encode(entry.events[cursor]));
          cursor++;
        }

        // If debate is done and we've sent everything, close
        if (entry.done && cursor >= entry.events.length) {
          controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
          controller.close();
          return;
        }

        // Wait for next event (or done signal)
        await new Promise<void>((resolve) => {
          entry.resolve = resolve;
        });
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
