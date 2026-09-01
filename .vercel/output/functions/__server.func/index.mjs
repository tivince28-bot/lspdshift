globalThis.__nitro_main__ = import.meta.url;
import { i as toEventHandler, n as HTTPError, o as NodeResponse, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as createServerFn } from "./_libs/@tanstack/start-client-core+[...].mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "./_libs/zod.mjs";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region migrations/0002_schema.sql?raw
var _0002_schema_default = "-- LS GRID — public unowned board (auth off)\ncreate table if not exists gangs (\n  id           text primary key,\n  name         text not null,\n  tag          text not null default '',\n  color        text not null,\n  status       text not null default 'active',\n  leader       text not null default '',\n  description  text not null default '',\n  members      text not null default '',\n  notes        text not null default '',\n  logo         text not null default '',\n  created_at   timestamptz not null default now(),\n  updated_at   timestamptz not null default now()\n);\n\ncreate table if not exists territories (\n  id           text primary key,\n  gang_id      text,\n  name         text not null,\n  kind         text not null default 'turf',\n  color        text,\n  polygon      text not null,\n  notes        text not null default '',\n  created_at   timestamptz not null default now(),\n  updated_at   timestamptz not null default now()\n);\n\ncreate table if not exists pins (\n  id           text primary key,\n  gang_id      text,\n  name         text not null,\n  kind         text not null default 'graffiti',\n  color        text,\n  lat          double precision not null,\n  lng          double precision not null,\n  notes        text not null default '',\n  date_found   text not null default '',\n  image        text not null default '',\n  created_at   timestamptz not null default now(),\n  updated_at   timestamptz not null default now()\n);\n\ncreate index if not exists territories_gang_id_idx on territories (gang_id);\ncreate index if not exists pins_gang_id_idx on pins (gang_id);\n";
//#endregion
//#region scripts/migration-plan.mjs
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
//#endregion
//#region src/lib/db.ts
function envValue(key) {
	if (typeof process === "undefined") return void 0;
	const bag = process.env;
	if (!bag) return void 0;
	const value = bag[key];
	if (typeof value !== "string") return void 0;
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
function readDatabaseUrl() {
	return envValue("DATABASE_URL");
}
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed).
* Local preview without a URL uses embedded **PGLite**. Deployed runtimes
* never fall back to PGLite — that path is in-memory and looks like a reset.
*/
function getDbSource() {
	if (readDatabaseUrl()) return "neon";
	return "pglite";
}
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const url = readDatabaseUrl();
		if (!url) throw new Error("DATABASE_URL is missing");
		const { Pool, types } = await import("./_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: url });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("./_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_schema.sql": _0002_schema_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return getDbSource() === "neon" ? createNeonSql() : createPgliteSql();
}
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
var board_snapshot_default = {
	gangs: [
		{
			"id": "gang-gsf",
			"name": "Families",
			"tag": "FAM",
			"color": "#2ecc71",
			"status": "active",
			"leader": "",
			"description": "South LS classic. Davis and Grove.",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:00:54.385Z",
			"updatedAt": "2026-09-01T12:00:54.385Z"
		},
		{
			"id": "gang-vagos",
			"name": "VAGOS",
			"tag": "VGS",
			"color": "#f4d03f",
			"status": "active",
			"leader": "",
			"description": "East side — Rancho to El Burro.",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:00:54.387Z",
			"updatedAt": "2026-09-01T12:00:54.387Z"
		},
		{
			"id": "gang-88",
			"name": "88",
			"tag": "88",
			"color": "#e67e22",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.532Z",
			"updatedAt": "2026-09-01T12:17:24.532Z"
		},
		{
			"id": "gang-r60",
			"name": "Rolling 60S",
			"tag": "R60",
			"color": "#1d4ed8",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.533Z",
			"updatedAt": "2026-09-01T12:17:24.533Z"
		},
		{
			"id": "gang-lost-mc",
			"name": "Lost MC",
			"tag": "LMC",
			"color": "#111111",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.534Z",
			"updatedAt": "2026-09-01T12:17:24.534Z"
		},
		{
			"id": "gang-cdi",
			"name": "Cartel de la isla",
			"tag": "CDI",
			"color": "#f5a3c7",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.539Z",
			"updatedAt": "2026-09-01T12:17:24.539Z"
		},
		{
			"id": "gang-duvals",
			"name": "Duvals",
			"tag": "DVL",
			"color": "#166534",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.540Z",
			"updatedAt": "2026-09-01T12:17:24.540Z"
		},
		{
			"id": "gang-stb",
			"name": "Satan's bastards",
			"tag": "STB",
			"color": "#dc2626",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.541Z",
			"updatedAt": "2026-09-01T12:17:24.541Z"
		},
		{
			"id": "gang-navarro",
			"name": "NAVARRO",
			"tag": "NAV",
			"color": "#9a8b1a",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.541Z",
			"updatedAt": "2026-09-01T12:17:24.541Z"
		},
		{
			"id": "gang-otg",
			"name": "OTG",
			"tag": "OTG",
			"color": "#22d3ee",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.542Z",
			"updatedAt": "2026-09-01T12:17:24.542Z"
		},
		{
			"id": "gang-crimson",
			"name": "Crimson District",
			"tag": "CRD",
			"color": "#c084fc",
			"status": "active",
			"leader": "",
			"description": "",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:17:24.542Z",
			"updatedAt": "2026-09-01T12:17:24.542Z"
		},
		{
			"id": "gang-ballas",
			"name": "Ballas",
			"tag": "BLS",
			"color": "#9b59b6",
			"status": "active",
			"leader": "",
			"description": "Davis / Chamberlain.",
			"members": "",
			"notes": "",
			"logo": "",
			"createdAt": "2026-09-01T12:00:54.386Z",
			"updatedAt": "2026-09-01T12:00:54.386Z"
		}
	],
	territories: [
		{
			"id": "turf-ballas-chamberlain",
			"gangId": "gang-ballas",
			"name": "Chamberlain Hills",
			"kind": "turf",
			"color": null,
			"polygon": [
				{
					"lat": -1500,
					"lng": -280
				},
				{
					"lat": -1500,
					"lng": -40
				},
				{
					"lat": -1680,
					"lng": -40
				},
				{
					"lat": -1680,
					"lng": -280
				}
			],
			"notes": "Chamberlain and the Forum Drive cut.",
			"createdAt": "2026-09-01T12:00:54.388Z",
			"updatedAt": "2026-09-01T12:00:54.388Z"
		},
		{
			"id": "turf-gsf-davis",
			"gangId": "gang-gsf",
			"name": "Davis / Grove",
			"kind": "turf",
			"color": null,
			"polygon": [
				{
					"lat": -1680,
					"lng": 40
				},
				{
					"lat": -1680,
					"lng": 230
				},
				{
					"lat": -1860,
					"lng": 230
				},
				{
					"lat": -1860,
					"lng": 40
				}
			],
			"notes": "Grove Street and the Davis blocks.",
			"createdAt": "2026-09-01T12:00:54.387Z",
			"updatedAt": "2026-09-01T12:00:54.387Z"
		},
		{
			"id": "turf-vagos-rancho",
			"gangId": "gang-vagos",
			"name": "Rancho / El Burro",
			"kind": "claimed",
			"color": null,
			"polygon": [
				{
					"lat": -1740,
					"lng": 280
				},
				{
					"lat": -1740,
					"lng": 560
				},
				{
					"lat": -1980,
					"lng": 560
				},
				{
					"lat": -1980,
					"lng": 280
				}
			],
			"notes": "East LS yellow.",
			"createdAt": "2026-09-01T12:00:54.389Z",
			"updatedAt": "2026-09-01T12:00:54.389Z"
		}
	],
	pins: [
		{
			"id": "pin-vagos-elburro",
			"gangId": "gang-vagos",
			"name": "El Burro stencil",
			"kind": "stencil",
			"color": null,
			"lat": -1923,
			"lng": 1491,
			"notes": "",
			"dateFound": "2026-01-01",
			"image": "",
			"createdAt": "2026-09-01T12:00:54.391Z",
			"updatedAt": "2026-09-01T12:00:54.391Z"
		},
		{
			"id": "pin-ballas-forum",
			"gangId": "gang-ballas",
			"name": "Forum Drive mural",
			"kind": "mural",
			"color": null,
			"lat": -1595,
			"lng": -165,
			"notes": "",
			"dateFound": "2026-01-01",
			"image": "",
			"createdAt": "2026-09-01T12:00:54.391Z",
			"updatedAt": "2026-09-01T12:00:54.391Z"
		},
		{
			"id": "pin-gsf-grove",
			"gangId": "gang-gsf",
			"name": "Grove Street throw-up",
			"kind": "throw-up",
			"color": null,
			"lat": -1750,
			"lng": 112,
			"notes": "Green GSF on the wall by the house.",
			"dateFound": "2026-01-01",
			"image": "",
			"createdAt": "2026-09-01T12:00:54.390Z",
			"updatedAt": "2026-09-01T12:00:54.390Z"
		}
	]
};
//#endregion
//#region src/lib/map/seed.ts
var now = "2026-01-01T00:00:00.000Z";
function gang(id, name, tag, color, description = "") {
	return {
		id,
		name,
		tag,
		color,
		status: "active",
		leader: "",
		description,
		members: "",
		notes: "",
		logo: "",
		createdAt: now,
		updatedAt: now
	};
}
/** Roster from the set legend — order is the list order. */
var SEED_GANGS = [
	gang("gang-gsf", "Families", "FAM", "#2ecc71", "South LS. Davis and Grove."),
	gang("gang-vagos", "VAGOS", "VGS", "#f4d03f", "East side — Rancho to El Burro."),
	gang("gang-88", "88", "88", "#e67e22"),
	gang("gang-r60", "Rolling 60S", "R60", "#1d4ed8"),
	gang("gang-lost-mc", "Lost MC", "LMC", "#111111"),
	gang("gang-cdi", "Cartel de la isla", "CDI", "#f5a3c7"),
	gang("gang-duvals", "Duvals", "DVL", "#166534"),
	gang("gang-stb", "Satan's bastards", "STB", "#dc2626"),
	gang("gang-navarro", "NAVARRO", "NAV", "#9a8b1a"),
	gang("gang-otg", "OTG", "OTG", "#22d3ee"),
	gang("gang-crimson", "Crimson District", "CRD", "#c084fc"),
	gang("gang-ballas", "Ballas", "BLS", "#9b59b6", "Davis / Chamberlain.")
];
function sortGangs(gangs) {
	const idx = new Map(SEED_GANGS.map((g, i) => [g.id, i]));
	return [...gangs].sort((a, b) => {
		const ai = idx.get(a.id) ?? 1e3;
		const bi = idx.get(b.id) ?? 1e3;
		if (ai !== bi) return ai - bi;
		return a.name.localeCompare(b.name);
	});
}
//#endregion
//#region src/lib/data.ts
var gangStatus = _enum([
	"active",
	"dormant",
	"unknown"
]);
var territoryKind = _enum([
	"turf",
	"contested",
	"claimed"
]);
var pinKind = _enum([
	"graffiti",
	"throw-up",
	"mural",
	"stencil",
	"slap",
	"other"
]);
var latLng = object({
	lat: number(),
	lng: number()
});
var gangInput = object({
	id: string().min(1),
	name: string().min(1).max(80),
	tag: string().max(12).default(""),
	color: string().min(4).max(16),
	status: gangStatus.default("active"),
	leader: string().max(80).default(""),
	description: string().max(2e3).default(""),
	members: string().max(4e3).default(""),
	notes: string().max(4e3).default(""),
	logo: string().max(4e5).default("")
});
var territoryInput = object({
	id: string().min(1),
	gangId: string().nullable().default(null),
	name: string().min(1).max(80),
	kind: territoryKind.default("turf"),
	color: string().max(16).nullable().default(null),
	polygon: array(latLng).min(3).max(200),
	notes: string().max(4e3).default("")
});
var pinInput = object({
	id: string().min(1),
	gangId: string().nullable().default(null),
	name: string().min(1).max(80),
	kind: pinKind.default("graffiti"),
	color: string().max(16).nullable().default(null),
	lat: number(),
	lng: number(),
	notes: string().max(4e3).default(""),
	dateFound: string().max(32).default(""),
	image: string().max(4e5).default("")
});
function asText(value) {
	if (value instanceof Date) return value.toISOString();
	return String(value ?? "");
}
function mapGang(row) {
	return {
		id: row.id,
		name: row.name,
		tag: row.tag,
		color: row.color,
		status: row.status || "active",
		leader: row.leader,
		description: row.description,
		members: row.members,
		notes: row.notes,
		logo: row.logo ?? "",
		createdAt: asText(row.created_at),
		updatedAt: asText(row.updated_at)
	};
}
function mapTerritory(row) {
	let polygon = [];
	try {
		const parsed = JSON.parse(row.polygon);
		if (Array.isArray(parsed)) polygon = parsed;
	} catch {
		polygon = [];
	}
	return {
		id: row.id,
		gangId: row.gang_id,
		name: row.name,
		kind: row.kind || "turf",
		color: row.color,
		polygon,
		notes: row.notes,
		createdAt: asText(row.created_at),
		updatedAt: asText(row.updated_at)
	};
}
function mapPin(row) {
	return {
		id: row.id,
		gangId: row.gang_id,
		name: row.name,
		kind: row.kind || "graffiti",
		color: row.color,
		lat: Number(row.lat),
		lng: Number(row.lng),
		notes: row.notes,
		dateFound: row.date_found ?? "",
		image: row.image ?? "",
		createdAt: asText(row.created_at),
		updatedAt: asText(row.updated_at)
	};
}
async function insertSeed(sql) {
	for (const g of SEED_GANGS) await sql`
      insert into gangs (id, name, tag, color, status, leader, description, members, notes, logo)
      values (${g.id}, ${g.name}, ${g.tag}, ${g.color}, ${g.status}, ${g.leader}, ${g.description}, ${g.members}, ${g.notes}, ${g.logo})
      on conflict (id) do nothing
    `;
}
async function ensureRoster(sql) {
	await insertSeed(sql);
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
async function hydrateFromSnapshot(sql) {
	const snap = board_snapshot_default;
	const turfN = await sql`select count(*)::int as n from territories`;
	const pinN = await sql`select count(*)::int as n from pins`;
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
function isServerlessRuntime() {
	if (typeof process === "undefined") return false;
	return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
}
async function maybeWriteSnapshot(board) {
	if (isServerlessRuntime()) return;
	if (board.territories.length === 0 && board.pins.length === 0) return;
	try {
		const { writeFile } = await import("node:fs/promises");
		const { join } = await import("node:path");
		await writeFile(join(process.cwd(), "src/lib/map/board-snapshot.json"), `${JSON.stringify({
			gangs: board.gangs,
			territories: board.territories,
			pins: board.pins
		}, null, 2)}\n`);
	} catch {}
}
async function ensureSeed() {
	const sql = await getSql();
	await ensureRoster(sql);
	await hydrateFromSnapshot(sql);
}
async function loadBoardData() {
	await ensureSeed();
	const sql = await getSql();
	const gangs = await sql`select * from gangs order by name asc`;
	const territories = await sql`select * from territories order by name asc`;
	const pins = await sql`select * from pins order by name asc`;
	const board = {
		gangs: sortGangs(gangs.map(mapGang)),
		territories: territories.map(mapTerritory),
		pins: pins.map(mapPin)
	};
	maybeWriteSnapshot(board);
	return board;
}
var listBoard = createServerFn({ method: "GET" }).handler(async () => loadBoardData());
createServerFn({ method: "POST" }).validator((d) => gangInput.parse(d)).handler(async ({ data }) => {
	return mapGang((await (await getSql())`
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
    `)[0]);
});
createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(async ({ data }) => {
	const sql = await getSql();
	await sql`update territories set gang_id = null where gang_id = ${data.id}`;
	await sql`update pins set gang_id = null where gang_id = ${data.id}`;
	await sql`delete from gangs where id = ${data.id}`;
	return { id: data.id };
});
createServerFn({ method: "POST" }).validator((d) => territoryInput.parse(d)).handler(async ({ data }) => {
	return mapTerritory((await (await getSql())`
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
    `)[0]);
});
createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(async ({ data }) => {
	await (await getSql())`delete from territories where id = ${data.id}`;
	return { id: data.id };
});
createServerFn({ method: "POST" }).validator((d) => pinInput.parse(d)).handler(async ({ data }) => {
	return mapPin((await (await getSql())`
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
    `)[0]);
});
createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(async ({ data }) => {
	await (await getSql())`delete from pins where id = ${data.id}`;
	return { id: data.id };
});
var boardInput = object({
	gangs: array(gangInput).max(200),
	territories: array(territoryInput).max(400),
	pins: array(pinInput).max(800)
});
createServerFn({ method: "POST" }).validator((d) => boardInput.parse(d)).handler(async ({ data }) => {
	const sql = await getSql();
	await sql`delete from pins`;
	await sql`delete from territories`;
	await sql`delete from gangs`;
	for (const g of data.gangs) await sql`
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
	for (const t of data.territories) await sql`
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
	for (const p of data.pins) await sql`
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
	const gangs = await sql`select * from gangs order by name asc`;
	const territories = await sql`select * from territories order by name asc`;
	const pins = await sql`select * from pins order by name asc`;
	return {
		gangs: sortGangs(gangs.map(mapGang)),
		territories: territories.map(mapTerritory),
		pins: pins.map(mapPin)
	};
});
//#endregion
//#region server/middleware/board-api.ts
/**
* Public JSON of the board so a redeploy can snapshot tags/turf
* (`GET /api/board`) without going through the RPC client.
*/
async function boardApiMiddleware(event, next) {
	if ((event.url.pathname.replace(/\/$/, "") || "/") !== "/api/board") return next();
	if ((event.req.method ?? "GET").toUpperCase() !== "GET") return new Response("Method Not Allowed", { status: 405 });
	try {
		const board = await listBoard();
		return new Response(JSON.stringify(board), { headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store"
		} });
	} catch (err) {
		const message = err instanceof Error ? err.message : "board failed";
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { "content-type": "application/json; charset=utf-8" }
		});
	}
}
//#endregion
//#region scripts/install-page.html?raw
var install_page_default = "<!DOCTYPE html>\n<html lang=\"en\" class=\"device-desktop\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, viewport-fit=cover\"\n    />\n    <meta name=\"color-scheme\" content=\"dark\" />\n    <meta name=\"theme-color\" content=\"#000000\" />\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\" />\n    <meta name=\"apple-mobile-web-app-title\" content=\"{{APP_NAME}}\" />\n    <title>Add {{APP_NAME}} to your Home Screen</title>\n    <link rel=\"manifest\" href=\"/__grok/manifest.webmanifest\" />\n    <link rel=\"apple-touch-icon\" href=\"/__grok/icon-180.png\" />\n    <link rel=\"stylesheet\" href=\"/__grok/install/styles.css\" />\n    <script>\n      (function () {\n        var ua = navigator.userAgent || \"\";\n        var touch = navigator.maxTouchPoints || 0;\n        var isiPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && touch > 1);\n        var isiPhone = /iPhone|iPod/.test(ua);\n        var isIOS = isiPhone || isiPad;\n        var isAndroid = /Android/i.test(ua);\n        var isAndroidPhone = isAndroid && /Mobile/i.test(ua);\n        var isAndroidTablet = isAndroid && !/Mobile/i.test(ua);\n        var minSide = Math.min(screen.width || 0, screen.height || 0);\n        var maxSide = Math.max(screen.width || 0, screen.height || 0);\n\n        var type = \"desktop\";\n        if (isiPhone) type = \"phone\";\n        else if (isiPad || isAndroidTablet) type = \"tablet\";\n        else if (isAndroidPhone) type = \"phone\";\n        else if (touch > 0 && minSide > 0 && minSide <= 500) type = \"phone\";\n        else if (touch > 0 && minSide > 500 && maxSide <= 1400) type = \"tablet\";\n\n        var iosMajor = null;\n        var osToken = null;\n        var safariToken = null;\n        var iphoneOs = ua.match(/iPhone OS (\\d+)[._]/);\n        var ipadOs = ua.match(/CPU OS (\\d+)[._](\\d+) like Mac OS X/);\n        var safariVer = ua.match(/Version\\/(\\d+)[._]/);\n        if (iphoneOs) osToken = parseInt(iphoneOs[1], 10);\n        else if (ipadOs) osToken = parseInt(ipadOs[1], 10);\n        if (isIOS && safariVer) safariToken = parseInt(safariVer[1], 10);\n        if (osToken != null || safariToken != null) {\n          iosMajor = Math.max(osToken || 0, safariToken || 0);\n        }\n\n        var root = document.documentElement;\n        var classes = [\"device-\" + type];\n        if (iosMajor != null) {\n          root.dataset.ios = String(iosMajor);\n          classes.push(iosMajor >= 27 ? \"ios-27-plus\" : \"ios-below-27\");\n        }\n        root.className = classes.join(\" \");\n      })();\n    <\/script>\n  </head>\n  <body>\n    <div class=\"page\">\n      <header class=\"powered\" aria-label=\"Powered by Grok\">\n        <span class=\"powered-by\">Powered by</span>\n        <span class=\"powered-brand\">\n          <img\n            class=\"grok-logo\"\n            src=\"/__grok/install/assets/homescreen/logo-grok.svg\"\n            width=\"14\"\n            height=\"14\"\n            alt=\"\"\n          />\n          <span class=\"powered-grok\">Grok</span>\n        </span>\n      </header>\n\n      <main class=\"content\">\n        <div class=\"ob\" aria-hidden=\"true\">\n          <img\n            class=\"ob-img ob-phone\"\n            src=\"/__grok/install/assets/homescreen/ob-phone.png\"\n            width=\"338\"\n            height=\"294\"\n            alt=\"\"\n          />\n          <img\n            class=\"ob-img ob-ipad\"\n            src=\"/__grok/install/assets/homescreen/ob-ipad.png\"\n            width=\"634\"\n            height=\"294\"\n            alt=\"\"\n          />\n        </div>\n\n        <section class=\"copy\">\n          <h1>Add {{APP_NAME}} to your&nbsp;Home&nbsp;Screen</h1>\n\n          <div class=\"steps\">\n            <p class=\"step step-tap step-ios27\">\n              <span class=\"muted\">Tap</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-puzzle.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n              <span class=\"muted loc loc-phone\">in the bottom bar, then</span>\n              <span class=\"muted loc loc-ipad\">in the tool bar, then</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-share.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n            </p>\n\n            <p class=\"step step-tap step-ios-legacy\">\n              <span class=\"muted\">Tap</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-share.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n              <span class=\"muted loc loc-phone\">in the bottom bar</span>\n              <span class=\"muted loc loc-ipad\">in the tool bar</span>\n            </p>\n\n            <p class=\"step step-select\">\n              <span class=\"muted\">Select</span>\n              <span class=\"add-label\">\n                <img\n                  class=\"plus-icon\"\n                  src=\"/__grok/install/assets/homescreen/plus.svg\"\n                  width=\"16\"\n                  height=\"16\"\n                  alt=\"\"\n                />\n                <span class=\"add-text\">Add to Home Screen</span>\n              </span>\n            </p>\n          </div>\n        </section>\n      </main>\n\n      <main class=\"content content-desktop\">\n        <section class=\"copy\">\n          <h1>Open this link on your iPhone&nbsp;or&nbsp;iPad</h1>\n          <p class=\"desktop-note\">\n            This page shows how to add {{APP_NAME}} to an iOS Home Screen.\n          </p>\n          <a class=\"desktop-open\" href=\"{{APP_URL}}\">Open {{APP_NAME}}</a>\n        </section>\n      </main>\n    </div>\n  </body>\n</html>\n";
//#endregion
//#region \0virtual:grok-og-identity
var grokOgIdentity = { "site": {
	"title": "LS GRID",
	"card": "custom",
	"image": "/og.jpg"
} };
//#endregion
//#region scripts/grok-pwa-shared.mjs
/**
* Single source of truth for platform head chrome (PWA, extensions.js, OG),
* shared by the Vite plugin and Nitro middleware. Plain ESM so `node --test`
* and the Nitro bundler can both consume it.
*/
var DEFAULT_APP_NAME = "Grok App";
var OG_SITE_REL_PATH = "src/lib/og/site.json";
var SHARE_META_KEYS = /* @__PURE__ */ new Set([
	"og:title",
	"og:description",
	"og:image",
	"og:image:width",
	"og:image:height",
	"og:type",
	"og:url",
	"og:site_name",
	"twitter:card",
	"twitter:title",
	"twitter:image",
	"twitter:description",
	"x:game:image",
	"x:game:image:width",
	"x:game:image:height"
]);
function escapeHtml(value) {
	return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
/** Inverse of escapeHtml. Decode &amp; last so a single pass undoes one encode. */
function unescapeHtml(value) {
	return String(value).replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", "\"").replaceAll("&#39;", "'").replaceAll("&amp;", "&");
}
/** 6-digit hex for the og.grok.me placeholder, or "" if site.color is missing/invalid. */
function placeholderCardColor(site = {}) {
	const raw = String(site.color ?? "").trim();
	const hex = raw.startsWith("#") ? raw.slice(1) : raw;
	return /^[0-9a-fA-F]{6}$/.test(hex) ? hex : "";
}
/**
* "wild-race.grok.me" → "Wild Race". Only published app hosts encode the
* display name in the first label. Preview / guest hosts are image origins
* only — slugifying them produced internal names like "Hds Abc 3000 Xy".
*/
function appNameFromHost(hostHeader) {
	const host = String(hostHeader ?? "").split(",")[0].trim().split(":")[0].toLowerCase();
	if (!host.endsWith(".grok.me")) return DEFAULT_APP_NAME;
	const slug = host.split(".")[0] ?? "";
	if (!slug || slug === "www" || !/^[a-z0-9-]{1,63}$/.test(slug)) return DEFAULT_APP_NAME;
	return slug.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") || "Grok App";
}
/** True for Vercel system domains. Envoy rewrites origin Host to these; they SSO-protect `/og.jpg`. */
function isVercelSystemHost(host) {
	return host === "vercel.app" || host.endsWith(".vercel.app") || host === "vercel.com" || host.endsWith(".vercel.com");
}
/** Hostname suitable for absolute og:image URLs. Preview guests (X-Forwarded-Host) are allowed. */
function publicAppHost(hostHeader) {
	const host = String(hostHeader ?? "").split(",")[0].trim().split(":")[0].toLowerCase();
	if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
	if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
	if (isVercelSystemHost(host)) return "";
	return host;
}
/**
* Published apps always use `VITE_PUBLIC_HOSTNAME` (the grok.me host the
* deployer injects). Live preview has no such env, so fall back to the
* request host / X-Forwarded-Host. Never prefer request Host on a published
* app — Envoy rewrites it to `*.vercel.app`.
*/
function resolvePublicHost(hostHeader) {
	return publicAppHost(process.env?.VITE_PUBLIC_HOSTNAME) || publicAppHost(hostHeader);
}
function isInstallQuery(url) {
	const query = String(url ?? "").split("?", 2)[1] ?? "";
	const params = new URLSearchParams(query);
	const install = params.get("install");
	const platform = (params.get("platform") ?? "").toLowerCase();
	return (install === "1" || install === "true") && platform === "ios";
}
/** Paths that can carry an app document (vs assets / API / internals). */
function isDocumentPath(pathname) {
	const path = String(pathname ?? "");
	return !path.startsWith("/__grok/") && !path.startsWith("/api/") && !path.startsWith("/@") && !path.startsWith("/node_modules") && !/\.[a-z0-9]+$/i.test(path);
}
function acceptsHtml(accept) {
	const value = String(accept ?? "");
	return value === "" || value.includes("text/html") || value.includes("*/*");
}
/** The same URL without the install-tutorial params (used as the app link). */
function stripInstallParams(url) {
	const [path = "/", query = ""] = String(url ?? "/").split("?", 2);
	const params = new URLSearchParams(query);
	params.delete("install");
	params.delete("platform");
	const rest = params.toString();
	return rest ? `${path}?${rest}` : path;
}
function renderInstallPageHtml(template, { host, url } = {}) {
	return String(template).replaceAll("{{APP_NAME}}", escapeHtml(appNameFromHost(host))).replaceAll("{{APP_URL}}", escapeHtml(stripInstallParams(url)));
}
function renderWebManifest(hostHeader) {
	const name = appNameFromHost(hostHeader);
	return JSON.stringify({
		name,
		short_name: name,
		id: "/",
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#000000",
		icons: [{
			src: "/__grok/icon-180.png",
			sizes: "180x180",
			type: "image/png"
		}]
	}, null, 2);
}
function grokPwaHeadTags(appName = DEFAULT_APP_NAME) {
	return [
		["manifest", "<link rel=\"manifest\" href=\"/__grok/manifest.webmanifest\">"],
		["apple-touch-icon", "<link rel=\"apple-touch-icon\" href=\"/__grok/icon-180.png\">"],
		["apple-mobile-web-app-title", `<meta name="apple-mobile-web-app-title" content="${escapeHtml(appName)}">`],
		["apple-mobile-web-app-status-bar-style", "<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">"],
		["theme-color", "<meta name=\"theme-color\" content=\"#000000\">"]
	];
}
var GROK_EXTENSIONS_SCRIPT_SRC = "https://grok.com/grok-app-builder/extensions.js";
function readGrokProjectId() {
	const fromProcess = typeof process !== "undefined" ? process.env?.VITE_PROJECT_ID : "";
	return String(fromProcess ?? "").trim();
}
function readXCreator() {
	const fromProcess = typeof process !== "undefined" ? process.env?.X_CREATOR : "";
	return String(fromProcess ?? "").trim();
}
function readXCreatorId() {
	const fromProcess = typeof process !== "undefined" ? process.env?.X_CREATOR_ID : "";
	return String(fromProcess ?? "").trim();
}
function grokXCreatorHeadTags(creator = readXCreator(), creatorId = readXCreatorId()) {
	const name = String(creator ?? "").trim();
	const id = String(creatorId ?? "").trim();
	if (!name || !id) return [];
	return [`<meta property="x:creator" content="${escapeHtml(name)}">`, `<meta property="x:creator:id" content="${escapeHtml(id)}">`];
}
/** Platform "Created with Grok" banner — injected into every HTML document. */
function grokExtensionsHeadTags(projectId = readGrokProjectId()) {
	const id = escapeHtml(projectId);
	const tags = [];
	if (projectId) tags.push(`<meta name="grok-project-id" content="${id}">`);
	tags.push(`<script src="${GROK_EXTENSIONS_SCRIPT_SRC}"${projectId ? ` data-project-id="${id}"` : ""} defer><\/script>`);
	return tags;
}
function readOgSite(cwd = process.cwd()) {
	try {
		const raw = readFileSync(join(cwd, OG_SITE_REL_PATH), "utf8");
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
/** Public path of an on-disk share card, or "" if neither file exists. */
function ogCardPublicPath(cwd = process.cwd()) {
	if (existsSync(join(cwd, "public/og.jpg"))) return "/og.jpg";
	if (existsSync(join(cwd, "public/og.png"))) return "/og.png";
	return "";
}
function detectCustomOgCard(cwd = process.cwd(), site = {}) {
	if (ogCardPublicPath(cwd)) return true;
	return siteHasCustomCard(site) || Boolean(String(site.image ?? "").trim());
}
/** Snapshot for Vite/Nitro to bake into the server bundle (Vercel has no workspace FS). */
function snapshotOgIdentity(cwd = process.cwd()) {
	const site = { ...readOgSite(cwd) };
	const disk = ogCardPublicPath(cwd);
	if (disk) {
		site.card = "custom";
		site.image = disk;
	} else {
		if (siteHasCustomCard(site)) delete site.card;
		if (site.image) delete site.image;
	}
	if (existsSync(join(cwd, "public/x-banner.jpg"))) site.banner = site.banner || "/x-banner.jpg";
	return { site };
}
function ogServiceUrl() {
	return (String(process.env?.VITE_OG_SERVICE_URL ?? "").trim() || "https://og.grok.me").replace(/\/+$/, "");
}
function titleFromDocument(html) {
	const match = String(html ?? "").match(/<title\b[^>]*>([^<]*)<\/title>/i);
	return match ? unescapeHtml(match[1]).trim() : "";
}
function resolveOgTitle(site = {}, appName = DEFAULT_APP_NAME, host = "", documentTitle = "") {
	const fromSite = String(site.title ?? "").trim();
	if (fromSite) return fromSite;
	const fromDoc = String(documentTitle ?? "").trim();
	if (fromDoc) return fromDoc;
	const fromHost = appNameFromHost(host);
	if (fromHost && fromHost !== "Grok App") return fromHost;
	return String(appName ?? "").trim() || "Grok App";
}
function siteHasCustomCard(site = {}) {
	return String(site.card ?? "").toLowerCase() === "custom";
}
/**
* Preview: public/og.jpg|png on disk.
* Vercel: the bake (`card=custom` / `image`) because the function cannot stat public/.
* Otherwise empty — caller emits the og.grok.me placeholder.
*/
function resolveOgCardAsset(site = {}, cwd = process.cwd()) {
	return ogCardPublicPath(cwd) || (detectCustomOgCard(cwd, site) ? String(site.image ?? "").trim() || "/og.jpg" : "");
}
/** Stamp `card=custom` when public/og.jpg or public/og.png is on disk. */
function applyCustomCardFromFs(site, cwd) {
	const disk = ogCardPublicPath(cwd);
	if (!disk) return site;
	return {
		...site,
		card: "custom",
		image: disk
	};
}
function grokOgHeadTags({ host = "", appName = DEFAULT_APP_NAME, site = {}, documentTitle = "", cwd = process.cwd() } = {}) {
	const title = resolveOgTitle(site, appName, host, documentTitle);
	const publicHost = resolvePublicHost(host);
	const tags = [`<meta name="twitter:card" content="summary_large_image">`, `<meta property="og:title" content="${escapeHtml(title)}">`];
	const description = String(site.description ?? "").trim();
	if (description) tags.push(`<meta property="og:description" content="${escapeHtml(description)}">`);
	if (String(site.type ?? "").toLowerCase() === "x:game") tags.push(`<meta property="og:type" content="x:game">`);
	if (publicHost) {
		const asset = resolveOgCardAsset(site, cwd);
		const custom = Boolean(asset);
		let image = custom ? `https://${publicHost}${asset.startsWith("/") ? asset : `/${asset}`}` : `${ogServiceUrl()}/v1/card.png?host=${encodeURIComponent(publicHost)}&title=${encodeURIComponent(title)}`;
		const color = !custom ? placeholderCardColor(site) : "";
		if (color) image += `&color=${encodeURIComponent(color)}`;
		tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
		tags.push(`<meta property="og:image:width" content="1200">`);
		tags.push(`<meta property="og:image:height" content="630">`);
		const banner = String(site.banner ?? "").trim();
		if (banner) {
			const bannerUrl = `https://${publicHost}${banner.startsWith("/") ? banner : `/${banner}`}`;
			tags.push(`<meta property="x:game:image" content="${escapeHtml(bannerUrl)}">`);
			tags.push(`<meta property="x:game:image:width" content="1200">`);
			tags.push(`<meta property="x:game:image:height" content="264">`);
		}
	}
	return tags;
}
function stripShareMetaTags(html) {
	return String(html).replace(/<meta\b[^>]*>/gi, (tag) => {
		const attrs = [...tag.matchAll(/\b(?:property|name)\s*=\s*["']([^"']+)["']/gi)];
		for (const match of attrs) if (SHARE_META_KEYS.has(String(match[1]).toLowerCase())) return "";
		return tag;
	});
}
function insertAfterHeadOpen(html, snippet) {
	if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (open) => `${open}${snippet}`);
	if (/<html\b[^>]*>/i.test(html)) return html.replace(/<html\b[^>]*>/i, (open) => `${open}<head>${snippet}</head>`);
	return `<!doctype html><html><head>${snippet}</head>${html}`;
}
function insertBeforeHeadClose(html, snippet) {
	if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${snippet}</head>`);
	return insertAfterHeadOpen(html, snippet);
}
function normalizeHeadContext(ctx = {}) {
	const cwd = ctx.cwd ?? process.cwd();
	const site = applyCustomCardFromFs(ctx.site !== void 0 ? ctx.site : snapshotOgIdentity(cwd).site, cwd);
	return {
		appName: resolveOgTitle(site, ctx.appName ?? "Grok App", ctx.host ?? ""),
		projectId: ctx.projectId ?? readGrokProjectId(),
		creator: ctx.creator ?? readXCreator(),
		creatorId: ctx.creatorId ?? readXCreatorId(),
		host: ctx.host ?? "",
		cwd,
		site
	};
}
function injectGrokPwaHead(html, ctx = {}) {
	if (typeof html !== "string") return html;
	const { site, projectId, creator, creatorId, host, cwd } = normalizeHeadContext(ctx);
	const documentTitle = titleFromDocument(html);
	const appName = resolveOgTitle(site, ctx.appName ?? "Grok App", host, documentTitle);
	let next = stripShareMetaTags(html);
	const missing = grokPwaHeadTags(appName).filter(([key]) => {
		if (key === "manifest") return !next.includes("href=\"/__grok/manifest.webmanifest\"");
		if (key === "apple-touch-icon") return !next.includes("href=\"/__grok/icon-180.png\"");
		return !next.includes(`name="${key}"`);
	}).map(([, tag]) => tag);
	next = insertAfterHeadOpen(next, grokOgHeadTags({
		host,
		appName,
		site,
		documentTitle,
		cwd
	}).join(""));
	if (!next.includes("/grok-app-builder/extensions.js")) missing.push(...grokExtensionsHeadTags(projectId));
	else if (projectId && !next.includes("name=\"grok-project-id\"")) missing.push(`<meta name="grok-project-id" content="${escapeHtml(projectId)}">`);
	if (projectId && !next.includes("property=\"grok:app_id\"") && !next.includes("property='grok:app_id'")) missing.push(`<meta property="grok:app_id" content="${escapeHtml(projectId)}">`);
	const creatorTags = grokXCreatorHeadTags(creator, creatorId);
	if (creatorTags.length > 0) {
		if (!(next.includes("property=\"x:creator\" content=") || next.includes("property='x:creator' content="))) missing.push(creatorTags[0]);
		if (!next.includes("property=\"x:creator:id\"")) missing.push(creatorTags[1]);
	}
	if (missing.length === 0) return next;
	return insertBeforeHeadClose(next, missing.join(""));
}
function findHeadClose(buf) {
	return buf.toString("latin1").search(/<\/head>/i);
}
/**
* Streaming head injector: buffers only until `</head>` (ASCII marker; never
* appears inside a UTF-8 continuation byte), overwrites share-card metas,
* then passes later chunks through so streaming SSR keeps streaming.
*/
function createHeadInjector(ctx = {}) {
	const normalized = normalizeHeadContext(ctx);
	/** @type {Buffer[]} */
	let pending = [];
	let done = false;
	const apply = (html) => injectGrokPwaHead(html, {
		appName: normalized.appName,
		projectId: normalized.projectId,
		creator: normalized.creator,
		creatorId: normalized.creatorId,
		host: normalized.host,
		cwd: normalized.cwd,
		site: normalized.site
	});
	return {
		/** @param {Uint8Array | string} chunk @returns {Buffer[]} chunks ready to emit */
		push(chunk) {
			const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			if (done) return [buf];
			pending.push(buf);
			const joined = Buffer.concat(pending);
			const at = findHeadClose(joined);
			if (at === -1) return [];
			done = true;
			pending = [];
			const closeLen = joined.toString("latin1", at).match(/^<\/head>/i)[0].length;
			const head = apply(joined.subarray(0, at + closeLen).toString("utf8"));
			return [Buffer.concat([Buffer.from(head, "utf8"), joined.subarray(at + closeLen)])];
		},
		/** @returns {Buffer[]} whatever is still buffered (no `</head>` seen) */
		flush() {
			if (done || pending.length === 0) return [];
			const rest = Buffer.concat(pending);
			pending = [];
			done = true;
			return [Buffer.from(apply(rest.toString("utf8")), "utf8")];
		}
	};
}
//#endregion
//#region server/middleware/grok-pwa.ts
/**
* Deployed-app (Nitro) half of the platform PWA chrome. Auto-registered as
* global h3 middleware because vite.config.ts sets `serverDir: "./server"` —
* without that option Nitro v3 never scans this directory.
*
* - `?install=1&platform=ios` on a document path → the Home Screen tutorial,
*   bundled into the server build via `?raw` (the public/ directory is CDN
*   static output on Vercel and not readable from the function).
* - `/__grok/manifest.webmanifest` → per-app-named manifest (kept out of
*   public/ so this dynamic response is the only one).
* - Other HTML documents → stream-inject PWA + OG head tags at `</head>`.
*   OG identity is baked via `virtual:grok-og-identity` at `vite build`
*   (this function cannot read `src/lib/og/site.json` or `public/og.jpg`).
*   This must be a middleware transforming `next()`: h3 discards the `response`
*   runtime hook's return value, and `render:html` does not exist in Nitro v3.
*/
function requestHost(event) {
	return event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host;
}
function injectHeadStreaming(response, host) {
	const injector = createHeadInjector({
		host,
		site: grokOgIdentity.site
	});
	const transformed = response.body.pipeThrough(new TransformStream({
		transform(chunk, controller) {
			for (const out of injector.push(chunk)) controller.enqueue(out);
		},
		flush(controller) {
			for (const out of injector.flush()) controller.enqueue(out);
		}
	}));
	const headers = new Headers(response.headers);
	headers.delete("content-length");
	return new Response(transformed, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
async function grokPwaMiddleware(event, next) {
	if ((event.req.method ?? "GET").toUpperCase() !== "GET") return next();
	const path = event.url.pathname;
	const urlWithQuery = path + event.url.search;
	if (path === "/__grok/manifest.webmanifest" || path === "/__grok/manifest.json") return new Response(renderWebManifest(requestHost(event)), { headers: {
		"content-type": "application/manifest+json; charset=utf-8",
		"cache-control": "no-cache"
	} });
	if (isInstallQuery(urlWithQuery) && isDocumentPath(path) && acceptsHtml(event.req.headers.get("accept"))) {
		const html = renderInstallPageHtml(install_page_default, {
			host: requestHost(event),
			url: urlWithQuery
		});
		return new Response(html, { headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": "no-cache"
		} });
	}
	if (!isDocumentPath(path)) return next();
	const result = await next();
	if (result instanceof Response && result.body && String(result.headers.get("content-type") ?? "").includes("text/html") && !result.headers.get("content-encoding")) return injectHeadStreaming(result, requestHost(event));
	return result;
}
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_IO091Z = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_IO091Z
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(boardApiMiddleware), toEventHandler(grokPwaMiddleware)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/vercel/runtime/isr.mjs
var ISR_URL_PARAM = "__isr_route";
function isrRouteRewrite(reqUrl, xNowRouteMatches) {
	if (xNowRouteMatches) {
		const isrURL = new URLSearchParams(xNowRouteMatches).get(ISR_URL_PARAM);
		if (isrURL) return [decodeURIComponent(isrURL), ""];
	} else {
		const queryIndex = reqUrl.indexOf("?");
		if (queryIndex !== -1) {
			const params = new URLSearchParams(reqUrl.slice(queryIndex + 1));
			const isrURL = params.get(ISR_URL_PARAM);
			if (isrURL) {
				params.delete(ISR_URL_PARAM);
				return [decodeURIComponent(isrURL), params.toString()];
			}
		}
	}
}
//#endregion
//#region node_modules/nitro/dist/presets/vercel/runtime/vercel.web.mjs
var nitroApp = useNitroApp();
var vercel_web_default = { async fetch(req, context) {
	const isrURL = isrRouteRewrite(req.url, req.headers.get("x-now-route-matches"));
	if (isrURL) {
		const { routeRules } = getRouteRules("", isrURL[0]);
		if (routeRules?.isr) req = new Request(new URL(isrURL[0] + (isrURL[1] ? `?${isrURL[1]}` : ""), req.url).href, req);
	}
	req.runtime ??= { name: "vercel" };
	req.runtime.vercel = { context };
	let ip;
	Object.defineProperty(req, "ip", { get() {
		const h = req.headers.get("x-forwarded-for");
		return ip ??= h?.split(",").shift()?.trim();
	} });
	req.waitUntil = context?.waitUntil;
	return nitroApp.fetch(req);
} };
//#endregion
export { vercel_web_default as default };
