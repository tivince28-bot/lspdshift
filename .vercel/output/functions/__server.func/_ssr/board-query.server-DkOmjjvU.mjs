import { n as sortGangs, t as SEED_GANGS } from "./seed-D6RAyj55.mjs";
import { n as getSql } from "./data-CTqBDhgd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-query.server-DkOmjjvU.js
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
async function ensureRoster(sql) {
	for (const g of SEED_GANGS) await sql`
      insert into gangs (id, name, tag, color, status, leader, description, members, notes, logo)
      values (${g.id}, ${g.name}, ${g.tag}, ${g.color}, ${g.status}, ${g.leader}, ${g.description}, ${g.members}, ${g.notes}, ${g.logo})
      on conflict (id) do nothing
    `;
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
async function loadBoardData() {
	const sql = await getSql();
	await ensureRoster(sql);
	await hydrateFromSnapshot(sql);
	const gangs = await sql`select * from gangs order by name asc`;
	const territories = await sql`select * from territories order by name asc`;
	const pins = await sql`select * from pins order by name asc`;
	return {
		gangs: sortGangs(gangs.map(mapGang)),
		territories: territories.map(mapTerritory),
		pins: pins.map(mapPin)
	};
}
//#endregion
export { loadBoardData };
