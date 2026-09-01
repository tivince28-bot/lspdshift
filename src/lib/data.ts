import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { sortGangs } from "@/lib/map/seed";
import type { Board, Gang, LatLng, Pin, Territory } from "@/lib/types";

const gangStatus = z.enum(["active", "dormant", "unknown"]);
const territoryKind = z.enum(["turf", "contested", "claimed"]);
const pinKind = z.enum([
  "graffiti",
  "throw-up",
  "mural",
  "stencil",
  "slap",
  "other",
]);
const latLng = z.object({ lat: z.number(), lng: z.number() });

const gangInput = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(80),
  tag: z.string().max(12).default(""),
  color: z.string().min(4).max(16),
  status: gangStatus.default("active"),
  leader: z.string().max(80).default(""),
  description: z.string().max(2000).default(""),
  members: z.string().max(4000).default(""),
  notes: z.string().max(4000).default(""),
  logo: z.string().max(400_000).default(""),
});

const territoryInput = z.object({
  id: z.string().min(1),
  gangId: z.string().nullable().default(null),
  name: z.string().min(1).max(80),
  kind: territoryKind.default("turf"),
  color: z.string().max(16).nullable().default(null),
  polygon: z.array(latLng).min(3).max(200),
  notes: z.string().max(4000).default(""),
});

const pinInput = z.object({
  id: z.string().min(1),
  gangId: z.string().nullable().default(null),
  name: z.string().min(1).max(80),
  kind: pinKind.default("graffiti"),
  color: z.string().max(16).nullable().default(null),
  lat: z.number(),
  lng: z.number(),
  notes: z.string().max(4000).default(""),
  dateFound: z.string().max(32).default(""),
  image: z.string().max(400_000).default(""),
});

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

export const listBoard = createServerFn({ method: "GET" }).handler(
  async (): Promise<Board> => {
    const { loadBoardData } = await import("./board-query.server");
    return loadBoardData();
  },
);

export const upsertGang = createServerFn({ method: "POST" })
  .validator((d: unknown) => gangInput.parse(d))
  .handler(async ({ data }): Promise<Gang> => {
    const sql = await getSql();
    const rows = await sql<GangRow>`
      insert into gangs (id, name, tag, color, status, leader, description, members, notes, logo, updated_at)
      values (
        ${data.id}, ${data.name}, ${data.tag}, ${data.color}, ${data.status},
        ${data.leader}, ${data.description}, ${data.members}, ${data.notes}, ${data.logo}, now()
      )
      on conflict (id) do update set
        name = excluded.name,
        tag = excluded.tag,
        color = excluded.color,
        status = excluded.status,
        leader = excluded.leader,
        description = excluded.description,
        members = excluded.members,
        notes = excluded.notes,
        logo = excluded.logo,
        updated_at = now()
      returning *
    `;
    return mapGang(rows[0]);
  });

export const deleteGang = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const sql = await getSql();
    await sql`update territories set gang_id = null where gang_id = ${data.id}`;
    await sql`update pins set gang_id = null where gang_id = ${data.id}`;
    await sql`delete from gangs where id = ${data.id}`;
    return { id: data.id };
  });

export const upsertTerritory = createServerFn({ method: "POST" })
  .validator((d: unknown) => territoryInput.parse(d))
  .handler(async ({ data }): Promise<Territory> => {
    const sql = await getSql();
    const rows = await sql<TerritoryRow>`
      insert into territories (id, gang_id, name, kind, color, polygon, notes, updated_at)
      values (
        ${data.id}, ${data.gangId}, ${data.name}, ${data.kind}, ${data.color},
        ${JSON.stringify(data.polygon)}, ${data.notes}, now()
      )
      on conflict (id) do update set
        gang_id = excluded.gang_id,
        name = excluded.name,
        kind = excluded.kind,
        color = excluded.color,
        polygon = excluded.polygon,
        notes = excluded.notes,
        updated_at = now()
      returning *
    `;
    return mapTerritory(rows[0]);
  });

export const deleteTerritory = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const sql = await getSql();
    await sql`delete from territories where id = ${data.id}`;
    return { id: data.id };
  });

export const upsertPin = createServerFn({ method: "POST" })
  .validator((d: unknown) => pinInput.parse(d))
  .handler(async ({ data }): Promise<Pin> => {
    const sql = await getSql();
    const rows = await sql<PinRow>`
      insert into pins (id, gang_id, name, kind, color, lat, lng, notes, date_found, image, updated_at)
      values (
        ${data.id}, ${data.gangId}, ${data.name}, ${data.kind}, ${data.color},
        ${data.lat}, ${data.lng}, ${data.notes}, ${data.dateFound}, ${data.image}, now()
      )
      on conflict (id) do update set
        gang_id = excluded.gang_id,
        name = excluded.name,
        kind = excluded.kind,
        color = excluded.color,
        lat = excluded.lat,
        lng = excluded.lng,
        notes = excluded.notes,
        date_found = excluded.date_found,
        image = excluded.image,
        updated_at = now()
      returning *
    `;
    return mapPin(rows[0]);
  });

export const deletePin = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const sql = await getSql();
    await sql`delete from pins where id = ${data.id}`;
    return { id: data.id };
  });

const boardInput = z.object({
  gangs: z.array(gangInput).max(200),
  territories: z.array(territoryInput).max(400),
  pins: z.array(pinInput).max(800),
});

export const importBoard = createServerFn({ method: "POST" })
  .validator((d: unknown) => boardInput.parse(d))
  .handler(async ({ data }): Promise<Board> => {
    const sql = await getSql();
    await sql`delete from pins`;
    await sql`delete from territories`;
    await sql`delete from gangs`;
    for (const g of data.gangs) {
      await sql`
        insert into gangs (id, name, tag, color, status, leader, description, members, notes, logo, updated_at)
        values (
          ${g.id}, ${g.name}, ${g.tag}, ${g.color}, ${g.status},
          ${g.leader}, ${g.description}, ${g.members}, ${g.notes}, ${g.logo}, now()
        )
        on conflict (id) do update set
          name = excluded.name,
          tag = excluded.tag,
          color = excluded.color,
          status = excluded.status,
          leader = excluded.leader,
          description = excluded.description,
          members = excluded.members,
          notes = excluded.notes,
          logo = excluded.logo,
          updated_at = now()
      `;
    }
    for (const t of data.territories) {
      await sql`
        insert into territories (id, gang_id, name, kind, color, polygon, notes, updated_at)
        values (
          ${t.id}, ${t.gangId}, ${t.name}, ${t.kind}, ${t.color},
          ${JSON.stringify(t.polygon)}, ${t.notes}, now()
        )
        on conflict (id) do update set
          gang_id = excluded.gang_id,
          name = excluded.name,
          kind = excluded.kind,
          color = excluded.color,
          polygon = excluded.polygon,
          notes = excluded.notes,
          updated_at = now()
      `;
    }
    for (const p of data.pins) {
      await sql`
        insert into pins (id, gang_id, name, kind, color, lat, lng, notes, date_found, image, updated_at)
        values (
          ${p.id}, ${p.gangId}, ${p.name}, ${p.kind}, ${p.color},
          ${p.lat}, ${p.lng}, ${p.notes}, ${p.dateFound}, ${p.image}, now()
        )
        on conflict (id) do update set
          gang_id = excluded.gang_id,
          name = excluded.name,
          kind = excluded.kind,
          color = excluded.color,
          lat = excluded.lat,
          lng = excluded.lng,
          notes = excluded.notes,
          date_found = excluded.date_found,
          image = excluded.image,
          updated_at = now()
      `;
    }
    const gangs = await sql<GangRow>`select * from gangs order by name asc`;
    const territories =
      await sql<TerritoryRow>`select * from territories order by name asc`;
    const pins = await sql<PinRow>`select * from pins order by name asc`;
    return {
      gangs: sortGangs(gangs.map(mapGang)),
      territories: territories.map(mapTerritory),
      pins: pins.map(mapPin),
    };
  });
