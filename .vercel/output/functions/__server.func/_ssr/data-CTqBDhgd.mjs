import { n as sortGangs } from "./seed-D6RAyj55.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-CTqBDhgd.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var _0002_schema_default = "-- LS GRID — public unowned board (auth off)\ncreate table if not exists gangs (\n  id           text primary key,\n  name         text not null,\n  tag          text not null default '',\n  color        text not null,\n  status       text not null default 'active',\n  leader       text not null default '',\n  description  text not null default '',\n  members      text not null default '',\n  notes        text not null default '',\n  logo         text not null default '',\n  created_at   timestamptz not null default now(),\n  updated_at   timestamptz not null default now()\n);\n\ncreate table if not exists territories (\n  id           text primary key,\n  gang_id      text,\n  name         text not null,\n  kind         text not null default 'turf',\n  color        text,\n  polygon      text not null,\n  notes        text not null default '',\n  created_at   timestamptz not null default now(),\n  updated_at   timestamptz not null default now()\n);\n\ncreate table if not exists pins (\n  id           text primary key,\n  gang_id      text,\n  name         text not null,\n  kind         text not null default 'graffiti',\n  color        text,\n  lat          double precision not null,\n  lng          double precision not null,\n  notes        text not null default '',\n  date_found   text not null default '',\n  image        text not null default '',\n  created_at   timestamptz not null default now(),\n  updated_at   timestamptz not null default now()\n);\n\ncreate index if not exists territories_gang_id_idx on territories (gang_id);\ncreate index if not exists pins_gang_id_idx on pins (gang_id);\n";
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
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
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
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
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
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var data_exports = /* @__PURE__ */ __exportAll({
	deleteGang_createServerFn_handler: () => deleteGang_createServerFn_handler,
	deletePin_createServerFn_handler: () => deletePin_createServerFn_handler,
	deleteTerritory_createServerFn_handler: () => deleteTerritory_createServerFn_handler,
	importBoard_createServerFn_handler: () => importBoard_createServerFn_handler,
	listBoard_createServerFn_handler: () => listBoard_createServerFn_handler,
	upsertGang_createServerFn_handler: () => upsertGang_createServerFn_handler,
	upsertPin_createServerFn_handler: () => upsertPin_createServerFn_handler,
	upsertTerritory_createServerFn_handler: () => upsertTerritory_createServerFn_handler
});
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
var listBoard_createServerFn_handler = createServerRpc({
	id: "1678c0ce9cf5e5855f534bbe484f5d912f849adbb25be4b052440661b6622093",
	name: "listBoard",
	filename: "src/lib/data.ts"
}, (opts) => listBoard.__executeServer(opts));
var listBoard = createServerFn({ method: "GET" }).handler(listBoard_createServerFn_handler, async () => {
	const { loadBoardData } = await import("./board-query.server-DkOmjjvU.mjs");
	return loadBoardData();
});
var upsertGang_createServerFn_handler = createServerRpc({
	id: "add49301031c26dff9f8f3332ad72a4ae9a85bfa56cfd2dfbba3e853b7df1082",
	name: "upsertGang",
	filename: "src/lib/data.ts"
}, (opts) => upsertGang.__executeServer(opts));
var upsertGang = createServerFn({ method: "POST" }).validator((d) => gangInput.parse(d)).handler(upsertGang_createServerFn_handler, async ({ data }) => {
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
var deleteGang_createServerFn_handler = createServerRpc({
	id: "42e5fa216a365ebcfa5177b7eb1c22df48ca0758625bb847654f067cd85c69b1",
	name: "deleteGang",
	filename: "src/lib/data.ts"
}, (opts) => deleteGang.__executeServer(opts));
var deleteGang = createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(deleteGang_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql`update territories set gang_id = null where gang_id = ${data.id}`;
	await sql`update pins set gang_id = null where gang_id = ${data.id}`;
	await sql`delete from gangs where id = ${data.id}`;
	return { id: data.id };
});
var upsertTerritory_createServerFn_handler = createServerRpc({
	id: "1a89d2d7230127a4459fe28aea42a5551b0fe7b7192adb172375e8a5cd6ea2ba",
	name: "upsertTerritory",
	filename: "src/lib/data.ts"
}, (opts) => upsertTerritory.__executeServer(opts));
var upsertTerritory = createServerFn({ method: "POST" }).validator((d) => territoryInput.parse(d)).handler(upsertTerritory_createServerFn_handler, async ({ data }) => {
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
var deleteTerritory_createServerFn_handler = createServerRpc({
	id: "a487e89a8913ebe8f5bb341ff3755b365b4732986d06c597126a088e65248c01",
	name: "deleteTerritory",
	filename: "src/lib/data.ts"
}, (opts) => deleteTerritory.__executeServer(opts));
var deleteTerritory = createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(deleteTerritory_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from territories where id = ${data.id}`;
	return { id: data.id };
});
var upsertPin_createServerFn_handler = createServerRpc({
	id: "009c229b773fbbc3829f72547ba61a43535c368b5bf7492eea2b2e37de3b53ca",
	name: "upsertPin",
	filename: "src/lib/data.ts"
}, (opts) => upsertPin.__executeServer(opts));
var upsertPin = createServerFn({ method: "POST" }).validator((d) => pinInput.parse(d)).handler(upsertPin_createServerFn_handler, async ({ data }) => {
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
var deletePin_createServerFn_handler = createServerRpc({
	id: "9891d80107180abe55dd593cf6a3fe3a900482bf120040c2830324d702de3b96",
	name: "deletePin",
	filename: "src/lib/data.ts"
}, (opts) => deletePin.__executeServer(opts));
var deletePin = createServerFn({ method: "POST" }).validator((d) => object({ id: string().min(1) }).parse(d)).handler(deletePin_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from pins where id = ${data.id}`;
	return { id: data.id };
});
var boardInput = object({
	gangs: array(gangInput).max(200),
	territories: array(territoryInput).max(400),
	pins: array(pinInput).max(800)
});
var importBoard_createServerFn_handler = createServerRpc({
	id: "0fea9bf3b563d1391c1ead4c38c9b34c39b16367254b58afddb9266070a88e38",
	name: "importBoard",
	filename: "src/lib/data.ts"
}, (opts) => importBoard.__executeServer(opts));
var importBoard = createServerFn({ method: "POST" }).validator((d) => boardInput.parse(d)).handler(importBoard_createServerFn_handler, async ({ data }) => {
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
export { getSql as n, data_exports as t };
