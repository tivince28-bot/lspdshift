export const GANG_STATUSES = ["active", "dormant", "unknown"] as const;
export type GangStatus = (typeof GANG_STATUSES)[number];

export const TERRITORY_KINDS = ["turf", "contested", "claimed"] as const;
export type TerritoryKind = (typeof TERRITORY_KINDS)[number];

export const PIN_KINDS = [
  "graffiti",
  "throw-up",
  "mural",
  "stencil",
  "slap",
  "other",
] as const;
export type PinKind = (typeof PIN_KINDS)[number];

export type LatLng = { lat: number; lng: number };

export type Gang = {
  id: string;
  name: string;
  tag: string;
  color: string;
  status: GangStatus;
  leader: string;
  description: string;
  members: string;
  notes: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
};

export type Territory = {
  id: string;
  gangId: string | null;
  name: string;
  kind: TerritoryKind;
  color: string | null;
  polygon: LatLng[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Pin = {
  id: string;
  gangId: string | null;
  name: string;
  kind: PinKind;
  color: string | null;
  lat: number;
  lng: number;
  notes: string;
  dateFound: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type Board = {
  gangs: Gang[];
  territories: Territory[];
  pins: Pin[];
};

export const PIN_KIND_LABEL: Record<PinKind, string> = {
  graffiti: "Graffiti",
  "throw-up": "Throw-up",
  mural: "Mural",
  stencil: "Stencil",
  slap: "Slap",
  other: "Other",
};

export const TERRITORY_KIND_LABEL: Record<TerritoryKind, string> = {
  turf: "Turf",
  contested: "Contested",
  claimed: "Claimed",
};

export const GANG_STATUS_LABEL: Record<GangStatus, string> = {
  active: "Active",
  dormant: "Dormant",
  unknown: "Unknown",
};

export const GANG_COLOR_PRESETS = [
  "#b33a3a",
  "#2f7a3a",
  "#c4a035",
  "#2a7f98",
  "#5c3d8a",
  "#2f4f8a",
  "#8a5a2f",
  "#1f1f1f",
  "#d8d4c8",
  "#6a3d5c",
  "#3d6a5c",
  "#7a4a1f",
];
