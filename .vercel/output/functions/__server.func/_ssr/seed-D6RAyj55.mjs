//#region node_modules/.nitro/vite/services/ssr/assets/seed-D6RAyj55.js
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
export { sortGangs as n, SEED_GANGS as t };
