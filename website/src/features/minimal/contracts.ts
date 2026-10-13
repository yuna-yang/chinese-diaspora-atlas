export type Text = { en: string | null; zh: string | null };
export type Evidence = { url: string; title: string; accessedAt: string };
export type Point = { id: string; x: number; y: number };
export type Camera = { x: number; y: number; k: number };
export interface MapNode {
  id: string;
  names: Text;
  summary: Text;
  onlineOnly: boolean;
  locations: {
    cityId: string | null;
    city: Text | null;
    country: Text;
    latitude: number | null;
    longitude: number | null;
  }[];
  links: { url: string; kind: string }[];
  contacts: { value: string; kind: string; sourceUrl: string }[];
  sources: Evidence[];
  verifiedAt: string;
  basis: 'public_information' | 'interview' | 'both';
  interview: {
    excerpt: Text;
    date: string;
    attribution: string;
    sourceUrl: string;
  } | null;
}
export interface MapLink {
  id: string;
  sourceId: string;
  targetId: string;
  sourceCityId: string | null;
  targetCityId: string | null;
  summary: Text;
  period: { start: string | null; end: string | null; label: Text };
  sources: Evidence[];
  verifiedAt: string;
}
export interface MapSnapshot {
  schemaVersion: 1;
  datasetVersion: string;
  generatedAt: string;
  demo: boolean;
  nodes: MapNode[];
  links: MapLink[];
}
export type AtlasView = 'scatter' | 'gather';
export type GeoMemory = {
  viewport: { latitude: number; longitude: number; zoom: number } | null;
  handledLocation: number;
  origins: Record<string, { x: number; y: number }>;
};
export type GraphMemory = {
  version: string;
  positions: Point[];
  camera: Camera;
  dragged: Set<string>;
  moved: boolean;
  settled?: boolean;
  origins?: Record<string, { x: number; y: number }>;
};
