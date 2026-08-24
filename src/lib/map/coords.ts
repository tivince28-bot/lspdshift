/**
 * GTA V game XY → shared labeled atlas/satellite/print images (same crop & scale).
 * CRS fitted so Paleto, Chiliad, downtown LS and the port line up with game coords.
 */
export const CRS_A = 0.01605;
export const CRS_B = 51.2;
export const CRS_C = -0.01745;
export const CRS_D = 137.8;

export function gameToLatLng(x: number, y: number): { lat: number; lng: number } {
  return { lat: y, lng: x };
}
export function latLngToGame(lat: number, lng: number): { x: number; y: number } {
  return { x: lng, y: lat };
}

export const MAP_CENTER: [number, number] = [-900, 50];
export const MAP_DEFAULT_ZOOM = 4;
export const MAP_MIN_ZOOM = 1;
export const MAP_MAX_ZOOM = 7;

export const TILE_STYLES = {
  atlas: {
    url: "https://s.rsg.sc/sc/images/games/GTAV/map/game/{z}/{x}/{y}.jpg",
    overlay: "/maps/atlas-labeled.jpg",
    background: "#2f4148",
    label: "Atlas",
  },
  satellite: {
    url: "https://s.rsg.sc/sc/images/games/GTAV/map/render/{z}/{x}/{y}.jpg",
    overlay: "/maps/satellite-labeled.jpg",
    background: "#0c2a4e",
    label: "Satellite",
  },
  print: {
    url: "https://s.rsg.sc/sc/images/games/GTAV/map/print/{z}/{x}/{y}.jpg",
    overlay: "/maps/print-labeled.jpg",
    background: "#4aa8c8",
    label: "Print",
  },
} as const;

export type TileStyle = keyof typeof TILE_STYLES;

export const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-3600, -3800],
  [7800, 4500],
];

export const JUMP_TARGETS = [
  { id: "ls", name: "Los Santos", lat: -900, lng: 50, zoom: 4 },
  { id: "sandy", name: "Sandy Shores", lat: 3665, lng: 2050, zoom: 5 },
  { id: "paleto", name: "Paleto Bay", lat: 6465, lng: -110, zoom: 5 },
  { id: "state", name: "San Andreas", lat: 1800, lng: 200, zoom: 2 },
] as const;

export const TRANSPARENT_TILE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const TILE_EXTENT: Record<number, { maxX: number; maxY: number }> = {
  0: { maxX: 0, maxY: 0 },
  1: { maxX: 0, maxY: 1 },
  2: { maxX: 1, maxY: 2 },
  3: { maxX: 3, maxY: 5 },
  4: { maxX: 7, maxY: 11 },
  5: { maxX: 15, maxY: 23 },
  6: { maxX: 31, maxY: 47 },
  7: { maxX: 63, maxY: 95 },
};

/**
 * Game-XY bounds of the labeled satellite/print images (MapGenie crop).
 * Fitted to RSG landmarks; SW is min lat/lng, NE is max.
 */
export const LABELED_BOUNDS: [[number, number], [number, number]] = [
  [-3437.36, -4582.76],
  [7894.6, 7745.05],
];
