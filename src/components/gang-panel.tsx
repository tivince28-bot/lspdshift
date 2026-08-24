import { Eye, EyeOff, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  GANG_STATUS_LABEL,
  type Gang,
  type Pin,
  type Territory,
} from "@/lib/types";

type Props = {
  gangs: Gang[];
  territories: Territory[];
  pins: Pin[];
  query: string;
  onQuery: (q: string) => void;
  selectedGangId: string | null;
  hiddenGangIds: Set<string>;
  showUnassigned: boolean;
  onSelectGang: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onToggleUnassigned: () => void;
  onNewGang: () => void;
};

export function GangPanel({
  gangs,
  territories,
  pins,
  query,
  onQuery,
  selectedGangId,
  hiddenGangIds,
  showUnassigned,
  onSelectGang,
  onToggleHidden,
  onToggleUnassigned,
  onNewGang,
}: Props) {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? gangs.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.tag.toLowerCase().includes(q) ||
          g.leader.toLowerCase().includes(q),
      )
    : gangs;

  const unassignedTurf = territories.filter((t) => !t.gangId).length;
  const unassignedPins = pins.filter((p) => !p.gangId).length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
        <div>
          <p className="font-display text-lg tracking-wide text-fg">Gangs</p>
          <p className="text-xs text-muted">
            {gangs.length} on the board
          </p>
        </div>
        <Button size="sm" onClick={onNewGang}>
          <Plus className="size-3.5" />
          New
        </Button>
      </div>
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search gangs"
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1 px-2">
        <ul className="space-y-1 pb-4">
          {filtered.map((g) => {
            const turfN = territories.filter((t) => t.gangId === g.id).length;
            const pinN = pins.filter((p) => p.gangId === g.id).length;
            const hidden = hiddenGangIds.has(g.id);
            const selected = selectedGangId === g.id;
            return (
              <li key={g.id}>
                <div
                  className={cn(
                    "flex items-stretch gap-1 rounded-lg pr-1 transition-colors duration-[var(--motion-quick)]",
                    selected ? "bg-surface-2" : "hover:bg-surface-2/60",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectGang(g.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: g.color }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="truncate text-sm font-medium text-fg">
                          {g.name}
                        </span>
                        {g.tag ? (
                          <span className="font-mono text-xs text-subtle">
                            {g.tag}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        <Badge
                          variant={g.status === "active" ? "ok" : "default"}
                        >
                          {GANG_STATUS_LABEL[g.status]}
                        </Badge>
                        <span>
                          {turfN} turf · {pinN} tag{pinN === 1 ? "" : "s"}
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="self-center rounded-md p-2 text-subtle hover:bg-surface hover:text-fg"
                    onClick={() => onToggleHidden(g.id)}
                    aria-label={hidden ? "Show on map" : "Hide on map"}
                  >
                    {hidden ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </li>
            );
          })}
          <li>
            <div
              className={cn(
                "flex items-stretch gap-1 rounded-lg pr-1",
                showUnassigned ? "" : "opacity-50",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5">
                <span className="size-2.5 shrink-0 rounded-full bg-muted" />
                <span className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-fg">Unassigned</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {unassignedTurf} turf · {unassignedPins} tag
                    {unassignedPins === 1 ? "" : "s"}
                  </span>
                </span>
              </div>
              <button
                type="button"
                className="self-center rounded-md p-2 text-subtle hover:bg-surface hover:text-fg"
                onClick={onToggleUnassigned}
                aria-label={showUnassigned ? "Hide unassigned" : "Show unassigned"}
              >
                {showUnassigned ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </button>
            </div>
          </li>
        </ul>
      </ScrollArea>
    </div>
  );
}
