import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CircleDot,
  Download,
  Filter,
  Hand,
  HelpCircle,
  Pentagon,
  Square,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { GangPanel } from "@/components/gang-panel";
import {
  FiltersDialog,
  GangFormDialog,
  HelpDialog,
  PinFormDialog,
  TerritoryFormDialog,
} from "@/components/entity-dialog";
import { InspectorPanel } from "@/components/inspector-panel";
import {
  MapCanvas,
  type DrawTool,
  type MapSelection,
} from "@/components/map-canvas";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBoard } from "@/hooks/use-board";
import { JUMP_TARGETS, TILE_STYLES, type TileStyle } from "@/lib/map/coords";
import type { Board, LatLng, Pin, Territory } from "@/lib/types";
import { uid } from "@/lib/utils";

const MAP_SAFE = { lat: -900, lng: 50 };

const TOOLS: { id: DrawTool; label: string; hint: string; icon: typeof Hand }[] =
  [
    { id: "pan", label: "Pan", hint: "1", icon: Hand },
    { id: "polygon", label: "Territory", hint: "2", icon: Pentagon },
    { id: "rect", label: "Box", hint: "3", icon: Square },
    { id: "pin", label: "Tag", hint: "4", icon: CircleDot },
  ];

const HINT: Record<DrawTool, string> = {
  pan: "Click a territory or tag for its file. Drag corners to reshape a selected territory.",
  polygon:
    "Click corners. Double-click or Enter to close. Right-click undoes. Esc cancels.",
  rect: "Click and drag a rectangle over the map.",
  pin: "Click the map to drop a gang tag.",
};

type FocusTarget =
  | { kind: "bounds"; points: LatLng[] }
  | { kind: "point"; lat: number; lng: number; zoom?: number }
  | null;

export function Desk() {
  const board = useBoard();
  const { gangs, territories, pins, isLoading, error, reload } = board;

  const [tool, setTool] = useState<DrawTool>("pan");
  const [selection, setSelection] = useState<MapSelection>(null);
  const [focus, setFocus] = useState<FocusTarget>(null);
  const [tileStyle, setTileStyle] = useState<TileStyle>("atlas");
  const [hiddenGangIds, setHiddenGangIds] = useState<Set<string>>(new Set());
  const [showUnassigned, setShowUnassigned] = useState(true);
  const [showTerritories, setShowTerritories] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [turfGang, setTurfGang] = useState("all");
  const [tagGang, setTagGang] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(MAP_SAFE);
  const [mobilePanel, setMobilePanel] = useState<"sets" | "file" | null>(null);

  const [gangOpen, setGangOpen] = useState(false);
  const [editingGangId, setEditingGangId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const pendingTurf = useRef<LatLng[] | null>(null);
  const pendingPin = useRef<{ lat: number; lng: number } | null>(null);
  const [turfOpen, setTurfOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedGangId = selection?.type === "gang" ? selection.id : null;

  const flyToSelection = useCallback(
    (sel: MapSelection) => {
      if (!sel) return;
      if (sel.type === "pin") {
        const p = pins.find((x) => x.id === sel.id);
        if (p) setFocus({ kind: "point", lat: p.lat, lng: p.lng });
        return;
      }
      if (sel.type === "territory") {
        const t = territories.find((x) => x.id === sel.id);
        if (t) setFocus({ kind: "bounds", points: t.polygon });
        return;
      }
      const turf = territories.filter((t) => t.gangId === sel.id);
      const marks = pins.filter((p) => p.gangId === sel.id);
      const points: LatLng[] = [
        ...turf.flatMap((t) => t.polygon),
        ...marks.map((p) => ({ lat: p.lat, lng: p.lng })),
      ];
      if (points.length) setFocus({ kind: "bounds", points });
    },
    [pins, territories],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "1" || e.key === "v") setTool("pan");
      if (e.key === "2" || e.key === "z") setTool("polygon");
      if (e.key === "3" || e.key === "b") setTool("rect");
      if (e.key === "4" || e.key === "m") setTool("pin");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSelect = useCallback((sel: MapSelection) => {
    setSelection(sel);
    if (sel && sel.type !== "gang") setMobilePanel("file");
  }, []);

  const editingGang = useMemo(
    () => gangs.find((g) => g.id === editingGangId),
    [gangs, editingGangId],
  );

  async function handleDelete() {
    if (!selection) return;
    const ok = window.confirm("Remove this from the board?");
    if (!ok) return;
    if (selection.type === "gang") await board.removeGang(selection.id);
    if (selection.type === "territory") await board.removeTerritory(selection.id);
    if (selection.type === "pin") await board.removePin(selection.id);
    setSelection(null);
    toast("Removed");
  }

  function exportJson() {
    const payload = { gangs, territories, pins };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ls-grid-board.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Board exported");
  }

  async function onImportFile(file: File) {
    try {
      const raw = JSON.parse(await file.text()) as Board;
      if (!Array.isArray(raw.gangs)) throw new Error("Bad file");
      await board.replaceBoard(raw);
      toast("Board restored");
    } catch {
      toast.error("Could not read that file");
    }
  }

  const inspectorOpen = Boolean(selection);

  if (error && !gangs.length) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center bg-bg px-6 text-center text-fg">
        <p className="font-display text-2xl tracking-[0.18em]">LS GRID</p>
        <p className="mt-2 max-w-sm text-sm text-muted">{error}</p>
        <Button className="mt-4" onClick={() => void reload()}>
          Try again
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center bg-bg text-fg">
        <p className="font-display text-2xl tracking-[0.18em]">LS GRID</p>
        <p className="mt-2 text-sm text-muted">Opening the desk…</p>
      </main>
    );
  }

  const visibleTerritories: Territory[] = showTerritories
    ? territories.filter((t) => {
        if (turfGang !== "all" && t.gangId !== turfGang) return false;
        return true;
      })
    : [];
  const visiblePins: Pin[] = showTags
    ? pins.filter((p) => {
        if (tagGang !== "all" && p.gangId !== tagGang) return false;
        return true;
      })
    : [];

  const gangPanel = (
    <GangPanel
      gangs={gangs}
      territories={territories}
      pins={pins}
      query={query}
      onQuery={setQuery}
      selectedGangId={selectedGangId}
      hiddenGangIds={hiddenGangIds}
      showUnassigned={showUnassigned}
      onSelectGang={(id) => {
        const sel = { type: "gang" as const, id };
        setSelection(sel);
        flyToSelection(sel);
      }}
      onToggleHidden={(id) => {
        setHiddenGangIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }}
      onToggleUnassigned={() => setShowUnassigned((v) => !v)}
      onNewGang={() => {
        setEditingGangId(null);
        setGangOpen(true);
      }}
    />
  );

  const inspector = (
    <InspectorPanel
      selection={selection}
      gangs={gangs}
      territories={territories}
      pins={pins}
      onClose={() => {
        setSelection(null);
        setMobilePanel(null);
      }}
      onFocus={() => flyToSelection(selection)}
      onEditGang={(g) => {
        setEditingGangId(g.id);
        setGangOpen(true);
      }}
      onSaveGang={(g) => void board.saveGang(g)}
      onSaveTerritory={(t) => void board.saveTerritory(t)}
      onSavePin={(p) => void board.savePin(p)}
      onDelete={() => void handleDelete()}
      onSelectTerritory={(id) => {
        const sel = { type: "territory" as const, id };
        setSelection(sel);
        flyToSelection(sel);
      }}
      onSelectPin={(id) => {
        const sel = { type: "pin" as const, id };
        setSelection(sel);
        flyToSelection(sel);
      }}
    />
  );

  return (
    <TooltipProvider>
      <div className="relative flex h-dvh flex-col bg-bg text-fg">
        <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2 md:px-4">
          <div className="shrink-0">
            <p className="font-display text-lg leading-none tracking-[0.14em] text-fg md:text-xl">
              LS GRID
            </p>
            <p className="hidden text-xs text-muted sm:block">
              Los Santos territory desk
            </p>
          </div>

          <div className="flex items-center rounded-lg bg-surface p-0.5 shadow-[var(--shadow-border)]">
            {TOOLS.map((t) => (
              <Tooltip key={t.id}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant={tool === t.id ? "default" : "ghost"}
                    onClick={() => setTool(t.id)}
                    aria-label={t.label}
                    className="rounded-md"
                  >
                    <t.icon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t.label} · {t.hint}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="flex items-center rounded-lg bg-surface p-0.5 shadow-[var(--shadow-border)]">
            {(Object.keys(TILE_STYLES) as TileStyle[]).map((k) => (
              <Button
                key={k}
                size="sm"
                variant={tileStyle === k ? "default" : "ghost"}
                className="h-8 px-2.5 text-xs"
                onClick={() => setTileStyle(k)}
              >
                {TILE_STYLES[k].label}
              </Button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <select
              className="hidden h-8 rounded-md border border-border bg-surface px-2 text-xs text-fg md:block"
              defaultValue="ls"
              onChange={(e) => {
                const j = JUMP_TARGETS.find((x) => x.id === e.target.value);
                if (j)
                  setFocus({
                    kind: "point",
                    lat: j.lat,
                    lng: j.lng,
                    zoom: j.zoom,
                  });
              }}
              aria-label="Jump to area"
            >
              {JUMP_TARGETS.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="ghost"
              className="hidden h-8 md:inline-flex"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter className="size-3.5" />
              Filters
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="md:hidden"
              onClick={() => setFiltersOpen(true)}
              aria-label="Filters"
            >
              <Filter className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="md:hidden"
              onClick={() =>
                setMobilePanel((v) => (v === "sets" ? null : "sets"))
              }
              aria-label="Gangs"
            >
              <Users className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setHelpOpen(true)}
              aria-label="Help"
            >
              <HelpCircle className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={exportJson}
              aria-label="Export"
            >
              <Download className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => fileRef.current?.click()}
              aria-label="Import"
            >
              <Upload className="size-4" />
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onImportFile(f);
                e.target.value = "";
              }}
            />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="hidden w-80 shrink-0 flex-col border-r border-border bg-surface md:flex">
            <GangPanel
              gangs={gangs}
              territories={territories}
              pins={pins}
              query={query}
              onQuery={setQuery}
              selectedGangId={selectedGangId}
              hiddenGangIds={hiddenGangIds}
              showUnassigned={showUnassigned}
              onSelectGang={(id) => {
                const sel = { type: "gang" as const, id };
                setSelection(sel);
                flyToSelection(sel);
              }}
              onToggleHidden={(id) => {
                setHiddenGangIds((prev) => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                });
              }}
              onToggleUnassigned={() => setShowUnassigned((v) => !v)}
              onNewGang={() => {
                setEditingGangId(null);
                setGangOpen(true);
              }}
            />
          </aside>

          <div className="relative min-w-0 flex-1 overflow-hidden">
            <MapCanvas
              gangs={gangs}
              territories={visibleTerritories}
              pins={visiblePins}
              hiddenGangIds={hiddenGangIds}
              showUnassigned={showUnassigned}
              tileStyle={tileStyle}
              tool={tool}
              selection={selection}
              focus={focus}
              onSelect={onSelect}
              onCreateTerritory={(polygon) => {
                pendingTurf.current = polygon;
                setTurfOpen(true);
                setTool("pan");
              }}
              onCreatePin={(lat, lng) => {
                pendingPin.current = { lat, lng };
                setPinOpen(true);
              }}
              onMovePin={(id, lat, lng) => {
                const p = pins.find((x) => x.id === id);
                if (p) void board.savePin({ ...p, lat, lng });
              }}
              onUpdatePolygon={(id, polygon) => {
                const t = territories.find((x) => x.id === id);
                if (t) void board.saveTerritory({ ...t, polygon });
              }}
              onCursor={(lat, lng) => setCursor({ lat, lng })}
            />

            <div className="pointer-events-none absolute top-3 left-3 right-3 md:right-auto md:max-w-md">
              <div className="rounded-lg bg-bg/80 px-3 py-2 text-xs text-muted shadow-[var(--shadow-border)] backdrop-blur-sm">
                {HINT[tool]}
              </div>
            </div>

            {inspectorOpen ? (
              <div className="absolute inset-x-0 bottom-0 z-20 flex max-h-[58vh] flex-col overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-border)] md:inset-auto md:top-14 md:right-3 md:bottom-12 md:w-80 md:rounded-xl">
                {inspector}
              </div>
            ) : null}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-3 py-1.5 font-mono text-xs tabular-nums text-muted md:px-4">
          <span>
            X {cursor.lng.toFixed(0)}
            <span className="mx-2 text-subtle">·</span>Y {cursor.lat.toFixed(0)}
          </span>
          <span className="hidden sm:inline">
            {TILE_STYLES[tileStyle].label}
            <span className="mx-2 text-subtle">·</span>
            {gangs.length} gangs · {territories.length} turf · {pins.length} tags
          </span>
        </footer>

        {mobilePanel === "sets" ? (
          <div className="absolute inset-0 z-30 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-bg/60"
              onClick={() => setMobilePanel(null)}
              aria-label="Close"
            />
            <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-surface shadow-[var(--shadow-border)]">
              {gangPanel}
            </div>
          </div>
        ) : null}

        <GangFormDialog
          open={gangOpen}
          onOpenChange={setGangOpen}
          initial={editingGang}
          onSubmit={async (data) => {
            const id = editingGangId ?? uid("gang");
            await board.saveGang({ id, ...data });
            setGangOpen(false);
            setSelection({ type: "gang", id });
            toast(editingGangId ? "Gang updated" : "Gang added");
          }}
        />
        <TerritoryFormDialog
          open={turfOpen}
          onOpenChange={(v) => {
            setTurfOpen(v);
            if (!v) pendingTurf.current = null;
          }}
          gangs={gangs}
          onSubmit={async (data) => {
            const polygon = pendingTurf.current;
            if (!polygon) return;
            const id = uid("turf");
            await board.saveTerritory({ id, polygon, ...data });
            pendingTurf.current = null;
            setTurfOpen(false);
            setSelection({ type: "territory", id });
            toast("Territory added");
          }}
        />
        <PinFormDialog
          open={pinOpen}
          onOpenChange={(v) => {
            setPinOpen(v);
            if (!v) pendingPin.current = null;
          }}
          gangs={gangs}
          onSubmit={async (data) => {
            const loc = pendingPin.current;
            if (!loc) return;
            const id = uid("pin");
            await board.savePin({ id, lat: loc.lat, lng: loc.lng, ...data });
            pendingPin.current = null;
            setPinOpen(false);
            setSelection({ type: "pin", id });
            toast("Tag added");
          }}
        />
        <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
        <FiltersDialog
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          gangs={gangs}
          showTerritories={showTerritories}
          showTags={showTags}
          turfGang={turfGang}
          tagGang={tagGang}
          onShowTerritories={setShowTerritories}
          onShowTags={setShowTags}
          onTurfGang={setTurfGang}
          onTagGang={setTagGang}
        />
      </div>
    </TooltipProvider>
  );
}
