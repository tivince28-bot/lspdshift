import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  backupIsRicher,
  loadBoardBackup,
  saveBoardBackup,
  type BoardBackup,
} from "@/lib/backup";
import {
  deleteGang,
  deletePin,
  deleteTerritory,
  importBoard,
  listBoard,
  upsertGang,
  upsertPin,
  upsertTerritory,
} from "@/lib/data";
import type { Board, Gang, Pin, Territory } from "@/lib/types";

function gangPayload(g: Omit<Gang, "createdAt" | "updatedAt">) {
  return {
    id: g.id,
    name: g.name,
    tag: g.tag ?? "",
    color: g.color,
    status: g.status,
    leader: g.leader ?? "",
    description: g.description ?? "",
    members: g.members ?? "",
    notes: g.notes ?? "",
    logo: g.logo ?? "",
  };
}

function turfPayload(t: Omit<Territory, "createdAt" | "updatedAt">) {
  return {
    id: t.id,
    gangId: t.gangId ?? null,
    name: t.name,
    kind: t.kind,
    color: t.color ?? null,
    polygon: t.polygon,
    notes: t.notes ?? "",
  };
}

function pinPayload(p: Omit<Pin, "createdAt" | "updatedAt">) {
  return {
    id: p.id,
    gangId: p.gangId ?? null,
    name: p.name,
    kind: p.kind,
    color: p.color ?? null,
    lat: p.lat,
    lng: p.lng,
    notes: p.notes ?? "",
    dateFound: p.dateFound ?? "",
    image: p.image ?? "",
  };
}

function toImport(board: Board) {
  return {
    gangs: board.gangs.map(gangPayload),
    territories: board.territories.map(turfPayload),
    pins: board.pins.map(pinPayload),
  };
}

export function useBoard() {
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restoreOffer, setRestoreOffer] = useState<BoardBackup | null>(null);
  const boardRef = useRef<Board | null>(null);
  const restoring = useRef(false);

  const persist = useCallback((next: Board) => {
    boardRef.current = next;
    setBoard(next);
    void saveBoardBackup(next);
  }, []);

  const pushBoard = useCallback(async (incoming: Board) => {
    const next = await importBoard({ data: toImport(incoming) });
    persist(next);
    return next;
  }, [persist]);

  const reload = useCallback(async () => {
    if (restoring.current) return;
    try {
      const next = await listBoard();
      setError(null);
      const bak = await loadBoardBackup();
      const memory = boardRef.current;
      const candidate =
        memory && backupIsRicher(memory, next)
          ? memory
          : bak && backupIsRicher(bak, next)
            ? bak
            : null;
      if (candidate) {
        restoring.current = true;
        try {
          await pushBoard(candidate);
          toast("Board restored — tags and turf were kept");
        } catch {
          persist(candidate);
          toast.error("Could not sync the board; local copy kept");
        } finally {
          restoring.current = false;
        }
        return;
      }
      persist(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load the board";
      setError(message);
      const bak = await loadBoardBackup();
      if (bak) persist(bak);
    }
  }, [persist, pushBoard]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const onFocus = () => {
      void reload();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [reload]);

  const saveGang = useCallback(
    async (g: Omit<Gang, "createdAt" | "updatedAt">) => {
      try {
        const saved = await upsertGang({ data: gangPayload(g) });
        const current = boardRef.current;
        if (!current) return;
        const exists = current.gangs.some((x) => x.id === saved.id);
        persist({
          ...current,
          gangs: exists
            ? current.gangs.map((x) => (x.id === saved.id ? saved : x))
            : [...current.gangs, saved],
        });
      } catch {
        toast.error("Could not save gang");
        await reload();
      }
    },
    [persist, reload],
  );

  const saveTerritory = useCallback(
    async (t: Omit<Territory, "createdAt" | "updatedAt">) => {
      try {
        const saved = await upsertTerritory({ data: turfPayload(t) });
        const current = boardRef.current;
        if (!current) return;
        const exists = current.territories.some((x) => x.id === saved.id);
        persist({
          ...current,
          territories: exists
            ? current.territories.map((x) => (x.id === saved.id ? saved : x))
            : [...current.territories, saved],
        });
      } catch {
        toast.error("Could not save territory");
        await reload();
      }
    },
    [persist, reload],
  );

  const savePin = useCallback(
    async (p: Omit<Pin, "createdAt" | "updatedAt">) => {
      try {
        const saved = await upsertPin({ data: pinPayload(p) });
        const current = boardRef.current;
        if (!current) return;
        const exists = current.pins.some((x) => x.id === saved.id);
        persist({
          ...current,
          pins: exists
            ? current.pins.map((x) => (x.id === saved.id ? saved : x))
            : [...current.pins, saved],
        });
      } catch {
        toast.error("Could not save tag");
        await reload();
      }
    },
    [persist, reload],
  );

  const removeGang = useCallback(
    async (id: string) => {
      try {
        await deleteGang({ data: { id } });
        const current = boardRef.current;
        if (!current) return;
        persist({
          gangs: current.gangs.filter((g) => g.id !== id),
          territories: current.territories.map((t) =>
            t.gangId === id ? { ...t, gangId: null } : t,
          ),
          pins: current.pins.map((p) => (p.gangId === id ? { ...p, gangId: null } : p)),
        });
      } catch {
        toast.error("Could not remove gang");
        await reload();
      }
    },
    [persist, reload],
  );

  const removeTerritory = useCallback(
    async (id: string) => {
      try {
        await deleteTerritory({ data: { id } });
        const current = boardRef.current;
        if (!current) return;
        persist({
          ...current,
          territories: current.territories.filter((t) => t.id !== id),
        });
      } catch {
        toast.error("Could not remove territory");
        await reload();
      }
    },
    [persist, reload],
  );

  const removePin = useCallback(
    async (id: string) => {
      try {
        await deletePin({ data: { id } });
        const current = boardRef.current;
        if (!current) return;
        persist({
          ...current,
          pins: current.pins.filter((p) => p.id !== id),
        });
      } catch {
        toast.error("Could not remove tag");
        await reload();
      }
    },
    [persist, reload],
  );

  const replaceBoard = useCallback(
    async (incoming: Board) => {
      try {
        await pushBoard(incoming);
      } catch {
        toast.error("Could not import that file");
        await reload();
      }
    },
    [pushBoard, reload],
  );

  const applyRestore = useCallback(async () => {
    if (!restoreOffer) return;
    const incoming = restoreOffer;
    setRestoreOffer(null);
    await replaceBoard(incoming);
  }, [restoreOffer, replaceBoard]);

  const skipRestore = useCallback(() => {
    setRestoreOffer(null);
  }, []);

  return {
    board,
    gangs: board?.gangs ?? [],
    territories: board?.territories ?? [],
    pins: board?.pins ?? [],
    isLoading: !board && !error,
    error,
    restoreOffer,
    applyRestore,
    skipRestore,
    reload,
    saveGang,
    saveTerritory,
    savePin,
    removeGang,
    removeTerritory,
    removePin,
    replaceBoard,
  };
}
