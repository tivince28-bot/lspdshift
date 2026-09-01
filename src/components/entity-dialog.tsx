import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { ExpandableImage } from "@/components/image-lightbox";
import { cn, readImageFile, todayIsoDate } from "@/lib/utils";
import {
  GANG_COLOR_PRESETS,
  GANG_STATUSES,
  GANG_STATUS_LABEL,
  PIN_KIND_LABEL,
  PIN_KINDS,
  TERRITORY_KIND_LABEL,
  TERRITORY_KINDS,
  type Gang,
  type GangStatus,
  type PinKind,
  type TerritoryKind,
} from "@/lib/types";

export function ColorSwatches({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {GANG_COLOR_PRESETS.map((c) => (
        <button
          key={c}
          type="button"
          className={cn(
            "size-7 rounded-md border transition-[transform,box-shadow] duration-[var(--motion-quick)]",
            value.toLowerCase() === c.toLowerCase()
              ? "border-fg scale-105"
              : "border-border hover:border-muted",
          )}
          style={{ background: c }}
          onClick={() => onChange(c)}
          aria-label={c}
        />
      ))}
      <label className="size-7 overflow-hidden rounded-md border border-border">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-10 -translate-x-1 -translate-y-1 cursor-pointer"
          aria-label="Custom color"
        />
      </label>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  layout = "row",
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  layout?: "row" | "hero";
}) {
  const fileInput = (
    <input
      type="file"
      accept="image/*"
      className="text-xs text-muted file:mr-2 file:rounded-md file:border-0 file:bg-surface-2 file:px-2 file:py-1 file:text-xs file:text-fg"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        void readImageFile(file)
          .then(onChange)
          .catch(() => {});
        e.target.value = "";
      }}
    />
  );
  const remove = value ? (
    <button
      type="button"
      className="text-left text-xs text-muted hover:text-fg"
      onClick={() => onChange("")}
    >
      Remove
    </button>
  ) : null;

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {layout === "hero" ? (
        <div className="space-y-2">
          {value ? (
            <ExpandableImage
              src={value}
              alt={label}
              className="h-40 w-full rounded-md bg-surface-2 shadow-[var(--shadow-border)]"
              fit="contain"
            />
          ) : (
            <span className="grid h-20 w-full place-items-center rounded-md bg-surface-2 text-xs text-subtle">
              no photo
            </span>
          )}
          <div className="flex flex-col gap-1">
            {fileInput}
            {remove}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {value ? (
            <ExpandableImage
              src={value}
              alt={label}
              className="size-12 shrink-0 rounded-md shadow-[var(--shadow-border)]"
              showHint={false}
            />
          ) : (
            <span className="grid size-12 place-items-center rounded-md bg-surface-2 text-xs text-subtle">
              none
            </span>
          )}
          <div className="flex flex-col gap-1">
            {fileInput}
            {remove}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function GangFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<Gang>;
  onSubmit: (data: {
    name: string;
    tag: string;
    color: string;
    status: GangStatus;
    leader: string;
    description: string;
    members: string;
    notes: string;
    logo: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [color, setColor] = useState(GANG_COLOR_PRESETS[0]);
  const [status, setStatus] = useState<GangStatus>("active");
  const [leader, setLeader] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState("");
  const [notes, setNotes] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setTag(initial?.tag ?? "");
    setColor(initial?.color ?? GANG_COLOR_PRESETS[0]);
    setStatus(initial?.status ?? "active");
    setLeader(initial?.leader ?? "");
    setDescription(initial?.description ?? "");
    setMembers(initial?.members ?? "");
    setNotes(initial?.notes ?? "");
    setLogo(initial?.logo ?? "");
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Edit gang" : "New gang"}</DialogTitle>
          <DialogDescription>
            Name, color, leader, and an optional logo.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            onSubmit({
              name: name.trim(),
              tag: tag.trim().toUpperCase(),
              color,
              status,
              leader: leader.trim(),
              description: description.trim(),
              members: members.trim(),
              notes: notes.trim(),
              logo,
            });
          }}
        >
          <Field label="Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ballas"
              autoFocus
              required
              maxLength={80}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tag">
              <Input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="BLS"
                maxLength={12}
              />
            </Field>
            <Field label="Status">
              <SelectField
                value={status}
                onChange={(e) => setStatus(e.target.value as GangStatus)}
              >
                {GANG_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {GANG_STATUS_LABEL[s]}
                  </option>
                ))}
              </SelectField>
            </Field>
          </div>
          <Field label="Color">
            <ColorSwatches value={color} onChange={setColor} />
          </Field>
          <Field label="Leader">
            <Input
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              placeholder="Unknown"
              maxLength={80}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </Field>
          <Field label="Members (one per line)">
            <Textarea
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              rows={3}
              maxLength={4000}
            />
          </Field>
          <Field label="Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={4000}
            />
          </Field>
          <ImageField label="Logo (optional)" value={logo} onChange={setLogo} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save gang</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TerritoryFormDialog({
  open,
  onOpenChange,
  gangs,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  gangs: Gang[];
  onSubmit: (data: {
    name: string;
    gangId: string | null;
    kind: TerritoryKind;
    color: string | null;
    notes: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [gangId, setGangId] = useState<string>("");
  const [kind, setKind] = useState<TerritoryKind>("turf");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setGangId(gangs[0]?.id ?? "");
    setKind("turf");
    setNotes("");
  }, [open, gangs]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New territory</DialogTitle>
          <DialogDescription>
            Assign the turf you just drew. Drag corners later to reshape it.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            onSubmit({
              name: name.trim(),
              gangId: gangId || null,
              kind,
              color: null,
              notes: notes.trim(),
            });
          }}
        >
          <Field label="Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Davis block"
              autoFocus
              required
              maxLength={80}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Gang">
              <SelectField value={gangId} onChange={(e) => setGangId(e.target.value)}>
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
                value={kind}
                onChange={(e) => setKind(e.target.value as TerritoryKind)}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={4000}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Discard
            </Button>
            <Button type="submit">Save territory</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PinFormDialog({
  open,
  onOpenChange,
  gangs,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  gangs: Gang[];
  onSubmit: (data: {
    name: string;
    gangId: string | null;
    kind: PinKind;
    color: string | null;
    notes: string;
    dateFound: string;
    image: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [gangId, setGangId] = useState("");
  const [kind, setKind] = useState<PinKind>("graffiti");
  const [color, setColor] = useState(GANG_COLOR_PRESETS[0]);
  const [notes, setNotes] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setGangId(gangs[0]?.id ?? "");
    setKind("graffiti");
    setColor(gangs[0]?.color ?? GANG_COLOR_PRESETS[0]);
    setNotes("");
    setDateFound(todayIsoDate());
    setImage("");
  }, [open, gangs]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New gang tag</DialogTitle>
          <DialogDescription>
            A colored dot on the map. Color can differ from the gang.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            onSubmit({
              name: name.trim(),
              gangId: gangId || null,
              kind,
              color,
              notes: notes.trim(),
              dateFound,
              image,
            });
          }}
        >
          <Field label="Tag type / name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Davis alley throw-up"
              autoFocus
              required
              maxLength={80}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kind">
              <SelectField
                value={kind}
                onChange={(e) => setKind(e.target.value as PinKind)}
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
                value={gangId}
                onChange={(e) => {
                  const id = e.target.value;
                  setGangId(id);
                  const g = gangs.find((x) => x.id === id);
                  if (g) setColor(g.color);
                }}
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
            <ColorSwatches value={color} onChange={setColor} />
          </Field>
          <Field label="Date found">
            <Input
              type="date"
              value={dateFound}
              onChange={(e) => setDateFound(e.target.value)}
            />
          </Field>
          <Field label="Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={4000}
            />
          </Field>
          <ImageField label="Photo (optional)" value={image} onChange={setImage} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Discard
            </Button>
            <Button type="submit">Save tag</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How it works</DialogTitle>
          <DialogDescription>
            Draw turf, drop gang tags, click anything for the file.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-3 text-sm text-muted">
          <li>
            <span className="font-medium text-fg">Map</span> — Atlas (pause-menu),
            Satellite (aerial with street names), or Print (paper map with street
            names). Switch them in the header.
          </li>
          <li>
            <span className="font-medium text-fg">Territory</span> — click corners,
            then double-click or Enter to close. Right-click undoes. Esc cancels.
          </li>
          <li>
            <span className="font-medium text-fg">Box</span> — click and drag a
            rectangle.
          </li>
          <li>
            <span className="font-medium text-fg">Tag</span> — click the map to drop a
            colored dot. Set the color in the form or the file panel.
          </li>
          <li>
            <span className="font-medium text-fg">Reshape</span> — select a territory,
            then drag the solid corner dots. Drag or click a hollow edge dot to
            add a point. Double-click a corner to remove it. Drag any tag to move it.
          </li>
          <li>
            The board is public and shared — no sign-in. Anyone can add turf and tags. Export JSON for a backup.
          </li>
        </ul>
        <div className="flex justify-end pt-2">
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FiltersDialog({
  open,
  onOpenChange,
  gangs,
  showTerritories,
  showTags,
  turfGang,
  tagGang,
  onShowTerritories,
  onShowTags,
  onTurfGang,
  onTagGang,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  gangs: Gang[];
  showTerritories: boolean;
  showTags: boolean;
  turfGang: string;
  tagGang: string;
  onShowTerritories: (v: boolean) => void;
  onShowTags: (v: boolean) => void;
  onTurfGang: (id: string) => void;
  onTagGang: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>
            Toggle layers and limit them to one gang.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-fg">
            <input
              type="checkbox"
              checked={showTerritories}
              onChange={(e) => onShowTerritories(e.target.checked)}
            />
            Show territories
          </label>
          <Field label="Territories for">
            <SelectField
              value={turfGang}
              onChange={(e) => onTurfGang(e.target.value)}
              disabled={!showTerritories}
            >
              <option value="all">All gangs</option>
              {gangs.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </SelectField>
          </Field>
          <label className="flex items-center gap-2 text-sm text-fg">
            <input
              type="checkbox"
              checked={showTags}
              onChange={(e) => onShowTags(e.target.checked)}
            />
            Show gang tags
          </label>
          <Field label="Tags for">
            <SelectField
              value={tagGang}
              onChange={(e) => onTagGang(e.target.value)}
              disabled={!showTags}
            >
              <option value="all">All gangs</option>
              {gangs.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </SelectField>
          </Field>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
