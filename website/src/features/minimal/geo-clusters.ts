import type Supercluster from 'supercluster';
export function viewportClusters(
  index: Supercluster<{ id: string }>,
  bounds: { west: number; south: number; east: number; north: number },
  zoom: number,
) {
  return index.getClusters(
    [
      bounds.west,
      Math.max(-85, bounds.south),
      bounds.east,
      Math.min(85, bounds.north),
    ],
    Math.floor(zoom),
  );
}

export function visibleLongitudes(
  longitude: number,
  west: number,
  east: number,
): number[] {
  const first = Math.ceil((west - longitude) / 360),
    last = Math.floor((east - longitude) / 360);
  return Array.from(
    { length: Math.max(0, last - first + 1) },
    (_, i) => longitude + (first + i) * 360,
  );
}
export function nearestLongitude(longitude: number, center: number) {
  return longitude + Math.round((center - longitude) / 360) * 360;
}
