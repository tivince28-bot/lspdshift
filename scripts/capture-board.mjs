/**
 * Pull the live board (tags + turf) into src/lib/map/board-snapshot.json
 * so the next production build hydrates an empty database with the current map.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const snapshotPath = join(root, "src/lib/map/board-snapshot.json");

function score(board) {
  if (!board || !Array.isArray(board.territories) || !Array.isArray(board.pins)) return 0;
  return board.territories.length * 10 + board.pins.length;
}

function readSnapshot() {
  try {
    return JSON.parse(readFileSync(snapshotPath, "utf8"));
  } catch {
    return { gangs: [], territories: [], pins: [] };
  }
}

async function fetchBoard(url) {
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const data = await res.json();
  if (!data || !Array.isArray(data.territories) || !Array.isArray(data.pins)) {
    throw new Error(`${url} did not return a board`);
  }
  return data;
}

const urls = [
  process.env.BOARD_CAPTURE_URL,
  "https://lspdshift.co/api/board",
  "http://127.0.0.1:8080/api/board",
].filter(Boolean);

const existing = readSnapshot();
let best = existing;
let from = "existing snapshot";

for (const url of urls) {
  try {
    const board = await fetchBoard(url);
    if (score(board) > 0 && score(board) >= score(best)) {
      best = board;
      from = url;
    }
    console.log(`[capture-board] ${url}: ${board.territories.length} turf · ${board.pins.length} tags`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`[capture-board] skip ${url}: ${message}`);
  }
}

if (score(best) > score(existing) || (score(best) > 0 && from !== "existing snapshot")) {
  const payload = {
    gangs: best.gangs ?? [],
    territories: best.territories ?? [],
    pins: best.pins ?? [],
  };
  writeFileSync(snapshotPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `[capture-board] wrote ${payload.territories.length} turf · ${payload.pins.length} tags from ${from}`,
  );
} else {
  console.log(
    `[capture-board] keep snapshot (${existing.territories?.length ?? 0} turf · ${existing.pins?.length ?? 0} tags)`,
  );
}
