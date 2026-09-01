import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  backupIsRicher,
  dismissRestoreOffer,
  loadBoardBackup,
  restoreWasDismissed,
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

export function useBoard() {
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restoreOffer, setRestoreOffer] = useState<BoardBackup | null>(null);
  const checkedBackup = useRef(false);

  const commit = useCallback((next: Board) => {
    setBoard(next);
    void saveBoardBackup(next);
  }, []);

  const reload = useCallback(async () => {
    try {
      const next = await listBoard();
      setError(null);
      if (!checkedBackup.current) {
        checkedBackup.current = true;
        const bak = await loadBoardBackup();
        if (
          bak &&
          backupIsRicher(bak, next) &&
          !restoreWasDismissed()
        ) {
          setRestoreOffer(bak);
          setBoard(next);
          return;
        }
        setBoard(next);
        if (!bak || !backupIsRicher(bak, next)) {
          void saveBoardBackup(next);
        }
        return;
      }
      setBoard(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load the board";
      setError(message);
    }
  }, []);

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
        setBoard((b) => {
          if (!b) return b;
          const exists = b.gangs.some((x) => x.id === saved.id);
          const next = {
            ...b,
            gangs: exists
              ? b.gangs.map((x) => (x.id === saved.id ? saved : x))
              : [...b.gangs, saved],
          };
          void saveBoardBackup(next);
          return next;
        });
      } catch {
        toast.error("Could not save gang");
        await reload();
      }
    },
    [reload],
  );

  const saveTerritory = useCallback(
    async (t: Omit<Territory, "createdAt" | "updatedAt">) => {
      try {
        const saved = await upsertTerritory({ data: turfPayload(t) });
        setBoard((b) => {
          if (!b) return b;
          const exists = b.territories.some((x) => x.id === saved.id);
          const next = {
            ...b,
            territories: exists
              ? b.territories.map((x) => (x.id === saved.id ? saved : x))
              : [...b.territories, saved],
          };
          void saveBoardBackup(next);
          return next;
        });
      } catch {
        toast.error("Could not save territory");
        await reload();
      }
    },
    [reload],
  );

  const savePin = useCallback(
    async (p: Omit<Pin, "createdAt" | "updatedAt">) => {
      try {
        const saved = await upsertPin({ data: pinPayload(p) });
        setBoard((b) => {
          if (!b) return b;
          const exists = b.pins.some((x) => x.id === saved.id);
          const next = {
            ...b,
            pins: exists
              ? b.pins.map((x) => (x.id === saved.id ? saved : x))
              : [...b.pins, saved],
          };
          void saveBoardBackup(next);
          return next;
        });
      } catch {
        toast.error("Could not save tag");
        await reload();
      }
    },
    [reload],
  );

  const removeGang = useCallback(
    async (id: string) => {
      try {
        await deleteGang({ data: { id } });
        setBoard((b) => {
          if (!b) return b;
          const next = {
            gangs: b.gangs.filter((g) => g.id !== id),
            territories: b.territories.map((t) =>
              t.gangId === id ? { ...t, gangId: null } : t,
            ),
            pins: b.pins.map((p) => (p.gangId === id ? { ...p, gangId: null } : p)),
          };
          void saveBoardBackup(next);
          return next;
        });
      } catch {
        toast.error("Could not remove gang");
        await reload();
      }
    },
    [reload],
  );

  const removeTerritory = useCallback(
    async (id: string) => {
      try {
        await deleteTerritory({ data: { id } });
        setBoard((b) => {
          if (!b) return b;
          const next = {
            ...b,
            territories: b.territories.filter((t) => t.id !== id),
          };
          void saveBoardBackup(next);
          return next;
        });
      } catch {
        toast.error("Could not remove territory");
        await reload();
      }
    },
    [reload],
  );

  const removePin = useCallback(
    async (id: string) => {
      try {
        await deletePin({ data: { id } });
        setBoard((b) => {
          if (!b) return b;
          const next = { ...b, pins: b.pins.filter((p) => p.id !== id) };
          void saveBoardBackup(next);
          return next;
        });
      } catch {
        toast.error("Could not remove tag");
        await reload();
      }
    },
    [reload],
  );

  const replaceBoard = useCallback(
    async (incoming: Board) => {
      try {
        const next = await importBoard({
          data: {
            gangs: incoming.gangs.map(gangPayload),
            territories: incoming.territories.map(turfPayload),
            pins: incoming.pins.map(pinPayload),
          },
        });
        commit(next);
      } catch {
        toast.error("Could not import that file");
        await reload();
      }
    },
    [commit, reload],
  );

  const applyRestore = useCallback(async () => {
    if (!restoreOffer) return;
    const incoming = restoreOffer;
    setRestoreOffer(null);
    await replaceBoard(incoming);
    toast("Board restored from this browser");
  }, [restoreOffer, replaceBoard]);

  const skipRestore = useCallback(() => {
    dismissRestoreOffer();
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
