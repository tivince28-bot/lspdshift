/**
 * Public JSON of the board so a redeploy can snapshot tags/turf
 * (`GET /api/board`) without going through the RPC client.
 */
import { listBoard } from "../../src/lib/data";

interface BoardApiEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

export default async function boardApiMiddleware(
  event: BoardApiEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const path = event.url.pathname.replace(/\/$/, "") || "/";
  if (path !== "/api/board") return next();
  const method = (event.req.method ?? "GET").toUpperCase();
  if (method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const board = await listBoard();
    return new Response(JSON.stringify(board), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "board failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}
