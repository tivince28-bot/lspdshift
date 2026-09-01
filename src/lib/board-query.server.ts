import { getSql } from "@/lib/db";
import boardSnapshot from "@/lib/map/board-snapshot.json";
import { SEED_GANGS, sortGangs } from "@/lib/map/seed";
import type { Board, Gang, LatLng, Pin, Territory } from "@/lib/types";

type GangRow = {
  id: string;
  name: string;
  tag: string;
  color: string;
  status: string;
  leader: string;
  description: string;
  members: string;
  notes: string;
  logo: string;
  created_at: string;
  updated_at: string;
};

type TerritoryRow = {
  id: string;
  gang_id: string | null;
  name: string;
  kind: string;
  color: string | null;
  polygon: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

type PinRow = {
  id: string;
  gang_id: string | null;
  name: string;
  kind: string;
  color: string | null;
  lat: number;
  lng: number;
  notes: string;
  date_found: string;
  image: string;
  created_at: string;
  updated_at: string;
};

function asText(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

function mapGang(row: GangRow): Gang {
  return {
    id: row.id,
    name: row.name,
    tag: row.tag,
    color: row.color,
    status: (row.status as Gang["status"]) || "active",
    leader: row.leader,
    description: row.description,
    members: row.members,
    notes: row.notes,
    logo: row.logo ?? "",
    createdAt: asText(row.created_at),
    updatedAt: asText(row.updated_at),
  };
}

function mapTerritory(row: TerritoryRow): Territory {
  let polygon: LatLng[] = [];
  try {
    const parsed = JSON.parse(row.polygon) as LatLng[];
    if (Array.isArray(parsed)) polygon = parsed;
  } catch {
    polygon = [];
  }
  return {
    id: row.id,
    gangId: row.gang_id,
    name: row.name,
    kind: (row.kind as Territory["kind"]) || "turf",
    color: row.color,
    polygon,
    notes: row.notes,
    createdAt: asText(row.created_at),
    updatedAt: asText(row.updated_at),
  };
}

function mapPin(row: PinRow): Pin {
  return {
    id: row.id,
    gangId: row.gang_id,
    name: row.name,
    kind: (row.kind as Pin["kind"]) || "graffiti",
    color: row.color,
    lat: Number(row.lat),
    lng: Number(row.lng),
    notes: row.notes,
    dateFound: row.date_found ?? "",
    image: row.image ?? "",
    createdAt: asText(row.created_at),
    updatedAt: asText(row.updated_at),
  };
}

async function ensureRoster(sql: Awaited<ReturnType<typeof getSql>>): Promise<void> {
  for (const g of SEED_GANGS) {
    await sql`
      insert into gangs (id, name, tag, color, status, leader, description, members, notes, logo)
      values (${g.id}, ${g.name}, ${g.tag}, ${g.color}, ${g.status}, ${g.leader}, ${g.description}, ${g.members}, ${g.notes}, ${g.logo})
      on conflict (id) do nothing
    `;
  }
  await sql`
    update gangs
    set name = ${"Families"}, tag = ${"FAM"}, color = ${"#2ecc71"}
    where id = ${"gang-gsf"} and name = ${"Grove Street Families"}
  `;
  await sql`
    update gangs
    set name = ${"VAGOS"}, tag = ${"VGS"}, color = ${"#f4d03f"}
    where id = ${"gang-vagos"} and name = ${"Los Santos Vagos"}
  `;
}

async function hydrateFromSnapshot(sql: Awaited<ReturnType<typeof getSql>>): Promise<void> {
  const snap = boardSnapshot as Board;
  const turfN = await sql<{ n: number }>`select count(*)::int as n from territories`;
  const pinN = await sql<{ n: number }>`select count(*)::int as n from pins`;
  if ((turfN[0]?.n ?? 0) > 0 || (pinN[0]?.n ?? 0) > 0) return;
  const territories = Array.isArray(snap.territories) ? snap.territories : [];
  const pins = Array.isArray(snap.pins) ? snap.pins : [];
  const gangs = Array.isArray(snap.gangs) ? snap.gangs : [];
  if (territories.length === 0 && pins.length === 0) return;

  for (const g of gangs) {
    if (!g?.id || !g?.name || !g?.color) continue;
    await sql`
      insert into gangs (id, name, tag, color, status, leader, description, members, notes, logo)
      values (
        ${g.id}, ${g.name}, ${g.tag ?? ""}, ${g.color}, ${g.status ?? "active"},
        ${g.leader ?? ""}, ${g.description ?? ""}, ${g.members ?? ""}, ${g.notes ?? ""}, ${g.logo ?? ""}
      )
      on conflict (id) do nothing
    `;
  }
  for (const t of territories) {
    if (!t?.id || !t?.name || !Array.isArray(t.polygon)) continue;
    await sql`
      insert into territories (id, gang_id, name, kind, color, polygon, notes)
      values (
        ${t.id}, ${t.gangId ?? null}, ${t.name}, ${t.kind ?? "turf"}, ${t.color ?? null},
        ${JSON.stringify(t.polygon)}, ${t.notes ?? ""}
      )
      on conflict (id) do nothing
    `;
  }
  for (const p of pins) {
    if (!p?.id || !p?.name || typeof p.lat !== "number" || typeof p.lng !== "number") continue;
    await sql`
      insert into pins (id, gang_id, name, kind, color, lat, lng, notes, date_found, image)
      values (
        ${p.id}, ${p.gangId ?? null}, ${p.name}, ${p.kind ?? "graffiti"}, ${p.color ?? null},
        ${p.lat}, ${p.lng}, ${p.notes ?? ""}, ${p.dateFound ?? ""}, ${p.image ?? ""}
      )
      on conflict (id) do nothing
    `;
  }
}

export async function loadBoardData(): Promise<Board> {
  const sql = await getSql();
  await ensureRoster(sql);
  await hydrateFromSnapshot(sql);
  const gangs = await sql<GangRow>`select * from gangs order by name asc`;
  const territories =
    await sql<TerritoryRow>`select * from territories order by name asc`;
  const pins = await sql<PinRow>`select * from pins order by name asc`;
  return {
    gangs: sortGangs(gangs.map(mapGang)),
    territories: territories.map(mapTerritory),
    pins: pins.map(mapPin),
  };
}
