//#region node_modules/.nitro/vite/services/ssr/assets/seed-Cix6AtGD.js
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
/** Turf in GTA V game XY (lat = Y, lng = X). */
var SEED_TERRITORIES = [
	{
		id: "turf-gsf-davis",
		gangId: "gang-gsf",
		name: "Davis / Grove",
		kind: "turf",
		color: null,
		polygon: [
			{
				lat: -1680,
				lng: 40
			},
			{
				lat: -1680,
				lng: 230
			},
			{
				lat: -1860,
				lng: 230
			},
			{
				lat: -1860,
				lng: 40
			}
		],
		notes: "Grove Street and the Davis blocks.",
		createdAt: now,
		updatedAt: now
	},
	{
		id: "turf-ballas-chamberlain",
		gangId: "gang-ballas",
		name: "Chamberlain Hills",
		kind: "turf",
		color: null,
		polygon: [
			{
				lat: -1500,
				lng: -280
			},
			{
				lat: -1500,
				lng: -40
			},
			{
				lat: -1680,
				lng: -40
			},
			{
				lat: -1680,
				lng: -280
			}
		],
		notes: "Chamberlain and the Forum Drive cut.",
		createdAt: now,
		updatedAt: now
	},
	{
		id: "turf-vagos-rancho",
		gangId: "gang-vagos",
		name: "Rancho / El Burro",
		kind: "claimed",
		color: null,
		polygon: [
			{
				lat: -1740,
				lng: 280
			},
			{
				lat: -1740,
				lng: 560
			},
			{
				lat: -1980,
				lng: 560
			},
			{
				lat: -1980,
				lng: 280
			}
		],
		notes: "East LS yellow.",
		createdAt: now,
		updatedAt: now
	}
];
var SEED_PINS = [
	{
		id: "pin-gsf-grove",
		gangId: "gang-gsf",
		name: "Grove Street throw-up",
		kind: "throw-up",
		color: null,
		lat: -1750,
		lng: 112,
		notes: "Green GSF on the wall by the house.",
		dateFound: "2026-01-01",
		image: "",
		createdAt: now,
		updatedAt: now
	},
	{
		id: "pin-ballas-forum",
		gangId: "gang-ballas",
		name: "Forum Drive mural",
		kind: "mural",
		color: null,
		lat: -1595,
		lng: -165,
		notes: "",
		dateFound: "2026-01-01",
		image: "",
		createdAt: now,
		updatedAt: now
	},
	{
		id: "pin-vagos-elburro",
		gangId: "gang-vagos",
		name: "El Burro stencil",
		kind: "stencil",
		color: null,
		lat: -1923,
		lng: 1491,
		notes: "",
		dateFound: "2026-01-01",
		image: "",
		createdAt: now,
		updatedAt: now
	}
];
//#endregion
export { sortGangs as i, SEED_PINS as n, SEED_TERRITORIES as r, SEED_GANGS as t };
