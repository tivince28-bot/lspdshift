import { SEED_GANGS } from "@/lib/map/seed";
import type { Board } from "@/lib/types";

const IDB_NAME = "ls-grid";
const IDB_STORE = "kv";
const IDB_KEY = "board-backup";
const META_KEY = "ls-grid-backup-meta";
const DISMISS_KEY = "ls-grid-restore-dismissed";

export type BoardBackup = Board & { savedAt: string };

export type BackupMeta = {
  savedAt: string;
  gangs: number;
  territories: number;
  pins: number;
};

const SEED_GANG_IDS = new Set(SEED_GANGS.map((g) => g.id));

function isBrowser() {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function readBackupMeta(): BackupMeta | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BackupMeta;
    if (!parsed?.savedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveBoardBackup(board: Board): Promise<void> {
  if (!isBrowser()) return;
  const payload: BoardBackup = {
    savedAt: new Date().toISOString(),
    gangs: board.gangs,
    territories: board.territories,
    pins: board.pins,
  };
  const meta: BackupMeta = {
    savedAt: payload.savedAt,
    gangs: board.gangs.length,
    territories: board.territories.length,
    pins: board.pins.length,
  };
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    /* quota on meta is unlikely */
  }
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(payload, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    try {
      localStorage.setItem(IDB_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota */
    }
  }
}

export async function loadBoardBackup(): Promise<BoardBackup | null> {
  if (!isBrowser()) return null;
  try {
    const db = await openDb();
    const row = await new Promise<BoardBackup | undefined>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => resolve(req.result as BoardBackup | undefined);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (row && Array.isArray(row.gangs)) return row;
  } catch {
    /* fall through */
  }
  try {
    const raw = localStorage.getItem(IDB_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BoardBackup;
    if (!Array.isArray(parsed?.gangs)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function boardLooksLikeSeed(board: Board): boolean {
  if (board.gangs.length === 0) return true;
  if (board.gangs.length > SEED_GANGS.length) return false;
  return board.gangs.every((g) => SEED_GANG_IDS.has(g.id));
}

export function backupIsRicher(backup: Board, server: Board): boolean {
  const extraGangs = backup.gangs.some((g) => !server.gangs.some((s) => s.id === g.id));
  const extraTurf = backup.territories.some(
    (t) => !server.territories.some((s) => s.id === t.id),
  );
  const extraPins = backup.pins.some((p) => !server.pins.some((s) => s.id === p.id));
  if (extraGangs || extraTurf || extraPins) return true;
  if (backup.gangs.length > server.gangs.length) return true;
  if (backup.territories.length > server.territories.length) return true;
  if (backup.pins.length > server.pins.length) return true;
  return false;
}

export function restoreWasDismissed(): boolean {
  if (!isBrowser()) return false;
  return sessionStorage.getItem(DISMISS_KEY) === "1";
}

export function dismissRestoreOffer(): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(DISMISS_KEY, "1");
}
