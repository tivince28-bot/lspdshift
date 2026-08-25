import { MapPinned, Pencil, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectField } from "@/components/ui/select-field";
import { ColorSwatches, ImageField } from "@/components/entity-dialog";
import {
  GANG_STATUSES,
  GANG_STATUS_LABEL,
  PIN_KIND_LABEL,
  PIN_KINDS,
  TERRITORY_KIND_LABEL,
  TERRITORY_KINDS,
  type Gang,
  type GangStatus,
  type Pin,
  type PinKind,
  type Territory,
  type TerritoryKind,
} from "@/lib/types";
import type { MapSelection } from "@/components/map-canvas";

type Props = {
  selection: MapSelection;
  gangs: Gang[];
  territories: Territory[];
  pins: Pin[];
  onClose: () => void;
  onFocus: () => void;
  onEditGang: (g: Gang) => void;
  onSaveGang: (g: Gang) => void;
  onSaveTerritory: (t: Territory) => void;
  onSavePin: (p: Pin) => void;
  onDelete: () => void;
  onSelectTerritory: (id: string) => void;
  onSelectPin: (id: string) => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function InspectorPanel({
  selection,
  gangs,
  territories,
  pins,
  onClose,
  onFocus,
  onEditGang,
  onSaveGang,
  onSaveTerritory,
  onSavePin,
  onDelete,
  onSelectTerritory,
  onSelectPin,
}: Props) {
  if (!selection) return null;

  if (selection.type === "gang") {
    const g = gangs.find((x) => x.id === selection.id);
    if (!g) return null;
    const turf = territories.filter((t) => t.gangId === g.id);
    const marks = pins.filter((p) => p.gangId === g.id);
    return (
      <PanelShell
        title={g.name}
        subtitle={g.tag || "Gang file"}
        color={g.color}
        onClose={onClose}
        onFocus={onFocus}
        onDelete={onDelete}
        extra={
          <Button size="sm" variant="secondary" onClick={() => onEditGang(g)}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant={g.status === "active" ? "ok" : "default"}>
            {GANG_STATUS_LABEL[g.status]}
          </Badge>
          {g.leader ? (
            <Badge variant="outline">Lead {g.leader}</Badge>
          ) : null}
        </div>
        {g.logo ? (
          <img
            src={g.logo}
            alt=""
            className="h-24 w-full rounded-md object-cover shadow-[var(--shadow-border)]"
          />
        ) : null}
        {g.description ? (
          <p className="text-sm leading-relaxed text-muted">{g.description}</p>
        ) : null}
        <Field label="Status">
          <SelectField
            value={g.status}
            onChange={(e) =>
              onSaveGang({ ...g, status: e.target.value as GangStatus })
            }
          >
            {GANG_STATUSES.map((s) => (
              <option key={s} value={s}>
                {GANG_STATUS_LABEL[s]}
              </option>
            ))}
          </SelectField>
        </Field>
        <Field label="Color">
          <ColorSwatches
            value={g.color}
            onChange={(color) => onSaveGang({ ...g, color })}
          />
        </Field>
        {g.members ? (
          <div>
            <Label>Members</Label>
            <ul className="mt-1.5 space-y-1 text-sm text-fg">
              {g.members.split("\n").map((line) =>
                line.trim() ? <li key={line}>{line}</li> : null,
              )}
            </ul>
          </div>
        ) : null}
        {g.notes ? (
          <p className="text-sm text-muted">{g.notes}</p>
        ) : null}
        <section>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted">
            Zones
          </p>
          {turf.length === 0 ? (
            <p className="text-sm text-subtle">No turf drawn yet.</p>
          ) : (
            <ul className="space-y-1">
              {turf.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className="w-full rounded-md px-2 py-1.5 text-left text-sm text-fg hover:bg-surface-2"
                    onClick={() => onSelectTerritory(t.id)}
                  >
                    {t.name}
                    <span className="ml-2 text-xs text-subtle">
                      {TERRITORY_KIND_LABEL[t.kind]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted">
            Tags
          </p>
          {marks.length === 0 ? (
            <p className="text-sm text-subtle">No tags yet.</p>
          ) : (
            <ul className="space-y-1">
              {marks.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-fg hover:bg-surface-2"
                    onClick={() => onSelectPin(p.id)}
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        background:
                          p.color ??
                          gangs.find((g) => g.id === p.gangId)?.color ??
                          "#8b8e96",
                      }}
                    />
                    {p.name}
                    <span className="ml-2 text-xs text-subtle">
                      {PIN_KIND_LABEL[p.kind]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </PanelShell>
    );
  }

  if (selection.type === "territory") {
    const t = territories.find((x) => x.id === selection.id);
    if (!t) return null;
    const owner = gangs.find((g) => g.id === t.gangId);
    const color = t.color ?? owner?.color ?? "#8b8e96";
    return (
      <PanelShell
        title={t.name}
        subtitle="Territory"
        color={color}
        onClose={onClose}
        onFocus={onFocus}
        onDelete={onDelete}
      >
        <p className="text-xs text-subtle">
          Drag the corner dots on the map to reshape this territory.
        </p>
        {owner ? (
          <div className="rounded-lg bg-surface-2 p-3">
            <p className="text-xs tracking-wide text-muted uppercase">Controlling gang</p>
            <p className="mt-1 font-medium text-fg">{owner.name}</p>
            {owner.leader ? (
              <p className="text-sm text-muted">Leader {owner.leader}</p>
            ) : null}
            {owner.description ? (
              <p className="mt-1 text-sm text-muted">{owner.description}</p>
            ) : null}
          </div>
        ) : null}
        <Field label="Name">
          <Input
            defaultValue={t.name}
            key={t.id + t.name}
            onBlur={(e) => {
              const name = e.target.value.trim();
              if (name && name !== t.name) onSaveTerritory({ ...t, name });
            }}
            maxLength={80}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gang">
            <SelectField
              value={t.gangId ?? ""}
              onChange={(e) =>
                onSaveTerritory({ ...t, gangId: e.target.value || null })
              }
            >
              <option value="">Unassigned</option>
              {gangs.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Kind">
            <SelectField
              value={t.kind}
              onChange={(e) =>
                onSaveTerritory({
                  ...t,
                  kind: e.target.value as TerritoryKind,
                })
              }
            >
              {TERRITORY_KINDS.map((k) => (
                <option key={k} value={k}>
                  {TERRITORY_KIND_LABEL[k]}
                </option>
              ))}
            </SelectField>
          </Field>
        </div>
        <Field label="Notes">
          <Textarea
            defaultValue={t.notes}
            key={t.id + "-notes"}
            rows={4}
            onBlur={(e) => {
              const notes = e.target.value;
              if (notes !== t.notes) onSaveTerritory({ ...t, notes });
            }}
            maxLength={4000}
          />
        </Field>
      </PanelShell>
    );
  }

  const pin = pins.find((x) => x.id === selection.id);
  if (!pin) return null;
  const color =
    pin.color ?? gangs.find((g) => g.id === pin.gangId)?.color ?? "#8b8e96";
  return (
    <PanelShell
      title={pin.name}
      subtitle={PIN_KIND_LABEL[pin.kind]}
      color={color}
      onClose={onClose}
      onFocus={onFocus}
      onDelete={onDelete}
    >
      <p className="text-xs text-subtle">
        Drag this tag on the map to move it. X {pin.lng.toFixed(0)} · Y{" "}
        {pin.lat.toFixed(0)}
      </p>
      <Field label="Tag type / name">
        <Input
          defaultValue={pin.name}
          key={pin.id + pin.name}
          onBlur={(e) => {
            const name = e.target.value.trim();
            if (name && name !== pin.name) onSavePin({ ...pin, name });
          }}
          maxLength={80}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Kind">
          <SelectField
            value={pin.kind}
            onChange={(e) =>
              onSavePin({ ...pin, kind: e.target.value as PinKind })
            }
          >
            {PIN_KINDS.map((k) => (
              <option key={k} value={k}>
                {PIN_KIND_LABEL[k]}
              </option>
            ))}
          </SelectField>
        </Field>
        <Field label="Gang">
          <SelectField
            value={pin.gangId ?? ""}
            onChange={(e) =>
              onSavePin({ ...pin, gangId: e.target.value || null })
            }
          >
            <option value="">Unassigned</option>
            {gangs.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </SelectField>
        </Field>
      </div>
      <Field label="Dot color">
        <ColorSwatches
          value={color}
          onChange={(next) => onSavePin({ ...pin, color: next })}
        />
      </Field>
      <Field label="Date found">
        <Input
          type="date"
          defaultValue={pin.dateFound}
          key={pin.id + "-date"}
          onBlur={(e) => {
            if (e.target.value !== pin.dateFound) {
              onSavePin({ ...pin, dateFound: e.target.value });
            }
          }}
        />
      </Field>
      <Field label="Notes">
        <Textarea
          defaultValue={pin.notes}
          key={pin.id + "-notes"}
          rows={4}
          onBlur={(e) => {
            const notes = e.target.value;
            if (notes !== pin.notes) onSavePin({ ...pin, notes });
          }}
          maxLength={4000}
        />
      </Field>
      <ImageField
        label="Photo"
        value={pin.image}
        onChange={(image) => onSavePin({ ...pin, image })}
      />
    </PanelShell>
  );
}

function PanelShell({
  title,
  subtitle,
  color,
  onClose,
  onFocus,
  onDelete,
  extra,
  children,
}: {
  title: string;
  subtitle: string;
  color: string;
  onClose: () => void;
  onFocus: () => void;
  onDelete: () => void;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start gap-3 border-b border-border px-4 py-3">
        <span
          className="mt-1 size-3 shrink-0 rounded-full"
          style={{ background: color }}
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl leading-tight tracking-wide text-fg">
            {title}
          </h2>
          <p className="text-xs tracking-wide text-muted uppercase">{subtitle}</p>
        </div>
        {extra}
        <Button size="icon-sm" variant="ghost" onClick={onClose} aria-label="Close">
          <X className="size-4" />
        </Button>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 px-4 py-4">{children}</div>
      </ScrollArea>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <Button size="sm" variant="secondary" onClick={onFocus}>
          <MapPinned className="size-3.5" />
          Fly to
        </Button>
        <Button size="sm" variant="ghost" className="ml-auto text-danger" onClick={onDelete}>
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
