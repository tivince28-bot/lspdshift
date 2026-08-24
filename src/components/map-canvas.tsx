import { useEffect, useRef } from "react";
import type L from "leaflet";
import {
  CRS_A,
  CRS_B,
  CRS_C,
  CRS_D,
  LABELED_BOUNDS,
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAX_BOUNDS,
  TILE_EXTENT,
  TILE_STYLES,
  TRANSPARENT_TILE,
  type TileStyle,
} from "@/lib/map/coords";
import type { Gang, LatLng, Pin, Territory } from "@/lib/types";

export type DrawTool = "pan" | "polygon" | "rect" | "pin";
export type MapSelection =
  | { type: "territory"; id: string }
  | { type: "pin"; id: string }
  | { type: "gang"; id: string }
  | null;

type FocusTarget =
  | { kind: "bounds"; points: LatLng[] }
  | { kind: "point"; lat: number; lng: number; zoom?: number }
  | null;

type Props = {
  gangs: Gang[];
  territories: Territory[];
  pins: Pin[];
  hiddenGangIds: Set<string>;
  showUnassigned: boolean;
  tileStyle: TileStyle;
  tool: DrawTool;
  selection: MapSelection;
  focus: FocusTarget;
  onSelect: (selection: MapSelection) => void;
  onCreateTerritory: (polygon: LatLng[]) => void;
  onCreatePin: (lat: number, lng: number) => void;
  onMovePin: (id: string, lat: number, lng: number) => void;
  onUpdatePolygon: (id: string, polygon: LatLng[]) => void;
  onCursor: (lat: number, lng: number) => void;
};

type LeafletNS = typeof import("leaflet");

function gangColor(gangs: Gang[], gangId: string | null, fallback: string | null) {
  if (fallback) return fallback;
  if (!gangId) return "#8b8e96";
  return gangs.find((g) => g.id === gangId)?.color ?? "#8b8e96";
}

function pinHtml(color: string) {
  return `<span class="ls-pin-dot" style="background:${color}"></span>`;
}

function closeEnough(
  L: LeafletNS,
  a: L.LatLng,
  b: L.LatLng,
  map: L.Map,
  px = 14,
) {
  return map.latLngToLayerPoint(a).distanceTo(map.latLngToLayerPoint(b)) <= px;
}

function makeCrs(L: LeafletNS): L.CRS {
  return L.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    scale(zoom: number) {
      return Math.pow(2, zoom);
    },
    zoom(scale: number) {
      return Math.log(scale) / Math.LN2;
    },
    distance(latlng1: L.LatLng, latlng2: L.LatLng) {
      const dx = latlng2.lng - latlng1.lng;
      const dy = latlng2.lat - latlng1.lat;
      return Math.sqrt(dx * dx + dy * dy);
    },
    transformation: new L.Transformation(CRS_A, CRS_B, CRS_C, CRS_D),
    infinite: true,
  }) as L.CRS;
}

function makeTileLayer(L: LeafletNS, urlTemplate: string): L.TileLayer {
  const FetchTiles = L.TileLayer.extend({
    getTileUrl(this: L.TileLayer, coords: L.Coords) {
      const extent = TILE_EXTENT[coords.z];
      if (
        !extent ||
        coords.x < 0 ||
        coords.y < 0 ||
        coords.x > extent.maxX ||
        coords.y > extent.maxY
      ) {
        return TRANSPARENT_TILE;
      }
      return L.TileLayer.prototype.getTileUrl.call(this, coords);
    },
  });
  const Layer = FetchTiles as unknown as new (
    url: string,
    options?: L.TileLayerOptions,
  ) => L.TileLayer;
  return new Layer(urlTemplate, {
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
    maxNativeZoom: MAP_MAX_ZOOM,
    noWrap: true,
    errorTileUrl: TRANSPARENT_TILE,
    attribution: "San Andreas atlas",
  });
}

function applyLabeledOverlay(
  L: LeafletNS,
  map: L.Map,
  overlay: string | null,
  layerRef: { current: L.ImageOverlay | null },
  tiles: L.TileLayer | null,
) {
  const bounds = L.latLngBounds(LABELED_BOUNDS[0], LABELED_BOUNDS[1]);
  if (overlay) {
    if (layerRef.current) {
      layerRef.current.setUrl(overlay);
      layerRef.current.setBounds(bounds);
      if (!map.hasLayer(layerRef.current)) layerRef.current.addTo(map);
    } else {
      layerRef.current = L.imageOverlay(overlay, bounds, {
        pane: "basemap",
        interactive: false,
        opacity: 1,
      }).addTo(map);
    }
    tiles?.setOpacity(0);
  } else {
    if (layerRef.current && map.hasLayer(layerRef.current)) {
      map.removeLayer(layerRef.current);
    }
    tiles?.setOpacity(1);
  }
}

function gangName(gangs: Gang[], id: string | null) {
  if (!id) return "Unassigned";
  return gangs.find((g) => g.id === id)?.name ?? "Unknown";
}

export function MapCanvas(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const Lref = useRef<LeafletNS | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const labeledRef = useRef<L.ImageOverlay | null>(null);
  const turfLayerRef = useRef<L.FeatureGroup | null>(null);
  const pinLayerRef = useRef<L.FeatureGroup | null>(null);
  const drawLayerRef = useRef<L.LayerGroup | null>(null);
  const vertexLayerRef = useRef<L.LayerGroup | null>(null);
  const turfById = useRef(new Map<string, L.Polygon>());
  const pinById = useRef(new Map<string, L.Marker>());
  const propsRef = useRef(props);
  propsRef.current = props;
  const toolRef = useRef(props.tool);
  toolRef.current = props.tool;
  const draftRef = useRef<L.LatLng[]>([]);
  const rectStartRef = useRef<L.LatLng | null>(null);
  const draggingVertexRef = useRef(false);
  const workingPolyRef = useRef<LatLng[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: L.Map | null = null;

    async function boot() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !hostRef.current) return;
      Lref.current = L;

      map = L.map(hostRef.current, {
        crs: makeCrs(L),
        center: MAP_CENTER,
        zoom: MAP_DEFAULT_ZOOM,
        minZoom: MAP_MIN_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
        maxBounds: L.latLngBounds(MAX_BOUNDS[0], MAX_BOUNDS[1]),
        maxBoundsViscosity: 0.7,
        zoomControl: true,
        attributionControl: true,
        doubleClickZoom: false,
        zoomSnap: 1,
        zoomDelta: 1,
        wheelPxPerZoomLevel: 80,
        zoomAnimation: true,
        markerZoomAnimation: true,
      });
      map.attributionControl.setPrefix("");
      map.attributionControl.setPosition("bottomleft");
      map.zoomControl.setPosition("bottomright");
      mapRef.current = map;

      map.createPane("basemap");
      const basePane = map.getPane("basemap");
      if (basePane) {
        basePane.style.zIndex = "250";
        basePane.style.pointerEvents = "none";
      }

      const initial = TILE_STYLES[propsRef.current.tileStyle];
      const tiles = makeTileLayer(L, initial.url).addTo(map);
      tileRef.current = tiles;
      hostRef.current.style.background = initial.background;
      applyLabeledOverlay(L, map, initial.overlay, labeledRef, tiles);

      turfLayerRef.current = L.featureGroup().addTo(map);
      pinLayerRef.current = L.featureGroup().addTo(map);
      drawLayerRef.current = L.layerGroup().addTo(map);
      vertexLayerRef.current = L.layerGroup().addTo(map);

      map.on("mousemove", (e: L.LeafletMouseEvent) => {
        propsRef.current.onCursor(e.latlng.lat, e.latlng.lng);
        if (toolRef.current === "polygon" && draftRef.current.length > 0) {
          paintDraft(L, [...draftRef.current, e.latlng], false);
        }
        if (toolRef.current === "rect" && rectStartRef.current) {
          paintRect(L, rectStartRef.current, e.latlng);
        }
      });

      map.on("mousedown", (e: L.LeafletMouseEvent) => {
        if (toolRef.current !== "rect") return;
        if (e.originalEvent.button !== 0) return;
        rectStartRef.current = e.latlng;
        map?.dragging.disable();
      });

      map.on("mouseup", (e: L.LeafletMouseEvent) => {
        if (toolRef.current !== "rect" || !rectStartRef.current) return;
        const start = rectStartRef.current;
        rectStartRef.current = null;
        map?.dragging.enable();
        drawLayerRef.current?.clearLayers();
        const dy = Math.abs(start.lat - e.latlng.lat);
        const dx = Math.abs(start.lng - e.latlng.lng);
        if (dy > 40 || dx > 40) {
          propsRef.current.onCreateTerritory(rectToPolygon(start, e.latlng));
        }
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        const tool = toolRef.current;
        if (tool === "pin") {
          propsRef.current.onCreatePin(e.latlng.lat, e.latlng.lng);
          return;
        }
        if (tool === "polygon") {
          const pts = draftRef.current;
          if (pts.length >= 3 && closeEnough(L, pts[0], e.latlng, map as L.Map)) {
            finishPolygon();
            return;
          }
          pts.push(e.latlng);
          paintDraft(L, pts, false);
          return;
        }
        if (tool === "pan") {
          propsRef.current.onSelect(null);
        }
      });

      map.on("dblclick", () => {
        if (toolRef.current === "polygon" && draftRef.current.length >= 3) {
          finishPolygon();
        }
      });

      map.on("contextmenu", (e: L.LeafletMouseEvent) => {
        e.originalEvent.preventDefault();
        if (toolRef.current === "polygon" && draftRef.current.length > 0) {
          draftRef.current.pop();
          paintDraft(L, draftRef.current, false);
          return;
        }
        cancelDraft();
      });

      const ro = new ResizeObserver(() => {
        map?.invalidateSize({ animate: false });
      });
      ro.observe(hostRef.current);
      (map as L.Map & { __ro?: ResizeObserver }).__ro = ro;
      requestAnimationFrame(() => map?.invalidateSize({ animate: false }));

      const onKey = (ev: KeyboardEvent) => {
        const tag = (ev.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        if (ev.key === "Escape") cancelDraft();
        if (
          (ev.key === "Enter" || ev.key === " ") &&
          toolRef.current === "polygon" &&
          draftRef.current.length >= 3
        ) {
          ev.preventDefault();
          finishPolygon();
        }
      };
      window.addEventListener("keydown", onKey);
      (map as L.Map & { __onKey?: (e: KeyboardEvent) => void }).__onKey = onKey;

      syncAll();
    }

    function finishPolygon() {
      const pts = draftRef.current;
      if (pts.length < 3) return;
      const polygon = pts.map((p) => ({ lat: p.lat, lng: p.lng }));
      draftRef.current = [];
      drawLayerRef.current?.clearLayers();
      propsRef.current.onCreateTerritory(polygon);
    }

    function cancelDraft() {
      draftRef.current = [];
      rectStartRef.current = null;
      drawLayerRef.current?.clearLayers();
    }

    function paintDraft(L: LeafletNS, pts: L.LatLng[], closed: boolean) {
      const layer = drawLayerRef.current;
      if (!layer) return;
      layer.clearLayers();
      if (pts.length === 0) return;
      L.polyline(pts, {
        color: "#ecece6",
        weight: 2,
        dashArray: "5 6",
        interactive: false,
      }).addTo(layer);
      if (closed) {
        L.polygon(pts, {
          color: "#ecece6",
          weight: 1,
          fillColor: "#ecece6",
          fillOpacity: 0.12,
          interactive: false,
        }).addTo(layer);
      }
      pts.forEach((p, i) => {
        L.circleMarker(p, {
          radius: i === 0 ? 6 : 4,
          color: "#0c0d0f",
          weight: 2,
          fillColor: "#ecece6",
          fillOpacity: 1,
          interactive: false,
        }).addTo(layer);
      });
    }

    function paintRect(L: LeafletNS, a: L.LatLng, b: L.LatLng) {
      const layer = drawLayerRef.current;
      if (!layer) return;
      layer.clearLayers();
      L.rectangle(L.latLngBounds(a, b), {
        color: "#ecece6",
        weight: 2,
        dashArray: "5 6",
        fillColor: "#ecece6",
        fillOpacity: 0.12,
        interactive: false,
      }).addTo(layer);
    }

    function rectToPolygon(a: L.LatLng, b: L.LatLng): LatLng[] {
      const south = Math.min(a.lat, b.lat);
      const north = Math.max(a.lat, b.lat);
      const west = Math.min(a.lng, b.lng);
      const east = Math.max(a.lng, b.lng);
      return [
        { lat: south, lng: west },
        { lat: south, lng: east },
        { lat: north, lng: east },
        { lat: north, lng: west },
      ];
    }

    void boot();

    return () => {
      cancelled = true;
      const m = mapRef.current;
      if (m) {
        const key = (m as L.Map & { __onKey?: (e: KeyboardEvent) => void }).__onKey;
        if (key) window.removeEventListener("keydown", key);
        const ro = (m as L.Map & { __ro?: ResizeObserver }).__ro;
        ro?.disconnect();
        m.remove();
      }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncVertices() {
    const L = Lref.current;
    const layer = vertexLayerRef.current;
    if (!L || !layer) return;
    if (draggingVertexRef.current) return;
    layer.clearLayers();
    const p = propsRef.current;
    const sel = p.selection;
    if (p.tool !== "pan" || sel?.type !== "territory") return;
    const t = p.territories.find((x) => x.id === sel.id);
    if (!t) return;
    const poly = turfById.current.get(t.id);
    workingPolyRef.current = t.polygon.map((pt) => ({ ...pt }));
    t.polygon.forEach((pt, i) => {
      const marker = L.marker([pt.lat, pt.lng], {
        draggable: true,
        zIndexOffset: 1200,
        icon: L.divIcon({
          className: "ls-vertex-wrap",
          html: `<span class="ls-vertex"></span>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
      });
      marker.on("mousedown", (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
      });
      marker.on("click", (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
      });
      marker.on("dragstart", () => {
        draggingVertexRef.current = true;
      });
      marker.on("drag", () => {
        const ll = marker.getLatLng();
        const next = (workingPolyRef.current ?? t.polygon).map((q, j) =>
          j === i ? { lat: ll.lat, lng: ll.lng } : q,
        );
        workingPolyRef.current = next;
        poly?.setLatLngs(next.map((q) => L.latLng(q.lat, q.lng)));
      });
      marker.on("dragend", () => {
        draggingVertexRef.current = false;
        const next = workingPolyRef.current;
        if (next && next.length >= 3) {
          propsRef.current.onUpdatePolygon(t.id, next);
        }
      });
      marker.addTo(layer);
    });
  }

  function syncAll() {
    const L = Lref.current;
    const map = mapRef.current;
    const turfLayer = turfLayerRef.current;
    const pinLayer = pinLayerRef.current;
    if (!L || !map || !turfLayer || !pinLayer) return;
    const p = propsRef.current;

    const visibleTurf = p.territories.filter((t) => {
      if (t.gangId && p.hiddenGangIds.has(t.gangId)) return false;
      if (!t.gangId && !p.showUnassigned) return false;
      return t.polygon.length >= 3;
    });
    const visiblePins = p.pins.filter((pin) => {
      if (pin.gangId && p.hiddenGangIds.has(pin.gangId)) return false;
      if (!pin.gangId && !p.showUnassigned) return false;
      return true;
    });

    const nextTurf = new Set(visibleTurf.map((t) => t.id));
    for (const [id, layer] of turfById.current) {
      if (!nextTurf.has(id)) {
        turfLayer.removeLayer(layer);
        turfById.current.delete(id);
      }
    }
    for (const t of visibleTurf) {
      const color = gangColor(p.gangs, t.gangId, t.color);
      const selected =
        p.selection?.type === "territory" && p.selection.id === t.id;
      const style: L.PathOptions = {
        color,
        weight: selected ? 3.5 : t.kind === "contested" ? 2.5 : 2,
        dashArray: t.kind === "contested" ? "6 5" : undefined,
        fillColor: color,
        fillOpacity: selected ? 0.5 : 0.36,
        opacity: 0.95,
      };
      const latlngs = t.polygon.map((pt) => L.latLng(pt.lat, pt.lng));
      let poly = turfById.current.get(t.id);
      const tip = `${t.name} · ${gangName(p.gangs, t.gangId)}`;
      if (!poly) {
        poly = L.polygon(latlngs, style);
        poly.on("click", (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          if (toolRef.current !== "pan") return;
          propsRef.current.onSelect({ type: "territory", id: t.id });
        });
        poly.bindTooltip(tip, {
          sticky: true,
          opacity: 0.95,
          className: "ls-tip",
        });
        poly.addTo(turfLayer);
        turfById.current.set(t.id, poly);
      } else if (!draggingVertexRef.current) {
        poly.setLatLngs(latlngs);
        poly.setStyle(style);
        poly.setTooltipContent(tip);
      } else {
        poly.setStyle(style);
      }
      if (selected) poly.bringToFront();
    }

    const nextPins = new Set(visiblePins.map((pin) => pin.id));
    for (const [id, layer] of pinById.current) {
      if (!nextPins.has(id)) {
        pinLayer.removeLayer(layer);
        pinById.current.delete(id);
      }
    }
    for (const pin of visiblePins) {
      const color = gangColor(p.gangs, pin.gangId, pin.color);
      const selected = p.selection?.type === "pin" && p.selection.id === pin.id;
      const icon = L.divIcon({
        className: `ls-pin${selected ? " is-selected" : ""}`,
        html: pinHtml(color),
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      let marker = pinById.current.get(pin.id);
      const tip = `${pin.name} · ${gangName(p.gangs, pin.gangId)}`;
      if (!marker) {
        marker = L.marker([pin.lat, pin.lng], {
          icon,
          draggable: false,
          riseOnHover: true,
          zIndexOffset: selected ? 800 : 200,
        });
        marker.on("click", (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          if (toolRef.current !== "pan") return;
          propsRef.current.onSelect({ type: "pin", id: pin.id });
        });
        marker.on("dragend", () => {
          const ll = marker?.getLatLng();
          if (ll) propsRef.current.onMovePin(pin.id, ll.lat, ll.lng);
        });
        marker.bindTooltip(tip, { opacity: 0.95, className: "ls-tip" });
        marker.addTo(pinLayer);
        pinById.current.set(pin.id, marker);
      } else {
        marker.setLatLng([pin.lat, pin.lng]);
        marker.setIcon(icon);
        marker.setZIndexOffset(selected ? 800 : 200);
        marker.setTooltipContent(tip);
      }
      if (selected) marker.dragging?.enable();
      else marker.dragging?.disable();
    }

    syncVertices();
  }

  useEffect(() => {
    syncAll();
  });

  useEffect(() => {
    const L = Lref.current;
    const map = mapRef.current;
    if (!L || !map) return;
    const style = TILE_STYLES[props.tileStyle];
    if (hostRef.current) hostRef.current.style.background = style.background;
    const current = tileRef.current;
    if (current) {
      current.setUrl(style.url);
    } else {
      const next = makeTileLayer(L, style.url).addTo(map);
      tileRef.current = next;
      next.bringToBack();
    }
    map.getContainer().style.background = style.background;
    applyLabeledOverlay(L, map, style.overlay, labeledRef, tileRef.current);
  }, [props.tileStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getContainer().style.cursor =
      props.tool === "pan" ? "" : "crosshair";
    if (props.tool !== "polygon") {
      draftRef.current = [];
      drawLayerRef.current?.clearLayers();
    }
    if (props.tool !== "rect") rectStartRef.current = null;
    if (props.tool === "rect") map.dragging.disable();
    else map.dragging.enable();
  }, [props.tool]);

  useEffect(() => {
    const map = mapRef.current;
    const L = Lref.current;
    if (!map || !L || !props.focus) return;
    if (props.focus.kind === "point") {
      const z = props.focus.zoom ?? Math.max(map.getZoom(), 5);
      map.flyTo([props.focus.lat, props.focus.lng], z, {
        duration: 0.55,
      });
    } else if (props.focus.points.length >= 1) {
      const b = L.latLngBounds(
        props.focus.points.map((pt) => L.latLng(pt.lat, pt.lng)),
      );
      map.fitBounds(b.pad(0.4), { maxZoom: 6, animate: true });
    }
  }, [props.focus]);

  return <div ref={hostRef} className="ls-map h-full w-full" />;
}
