import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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

  const reload = useCallback(async () => {
    try {
      const next = await listBoard();
      setBoard(next);
      setError(null);
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
          return {
            ...b,
            gangs: exists
              ? b.gangs.map((x) => (x.id === saved.id ? saved : x))
              : [...b.gangs, saved],
          };
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
          return {
            ...b,
            territories: exists
              ? b.territories.map((x) => (x.id === saved.id ? saved : x))
              : [...b.territories, saved],
          };
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
          return {
            ...b,
            pins: exists
              ? b.pins.map((x) => (x.id === saved.id ? saved : x))
              : [...b.pins, saved],
          };
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
          return {
            gangs: b.gangs.filter((g) => g.id !== id),
            territories: b.territories.map((t) =>
              t.gangId === id ? { ...t, gangId: null } : t,
            ),
            pins: b.pins.map((p) => (p.gangId === id ? { ...p, gangId: null } : p)),
          };
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
        setBoard((b) =>
          b ? { ...b, territories: b.territories.filter((t) => t.id !== id) } : b,
        );
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
        setBoard((b) => (b ? { ...b, pins: b.pins.filter((p) => p.id !== id) } : b));
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
        setBoard(next);
      } catch {
        toast.error("Could not import that file");
        await reload();
      }
    },
    [reload],
  );

  return {
    board,
    gangs: board?.gangs ?? [],
    territories: board?.territories ?? [],
    pins: board?.pins ?? [],
    isLoading: !board && !error,
    error,
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
