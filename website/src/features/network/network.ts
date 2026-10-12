import type {
  Dataset,
  AtlasState,
  Organization,
  Relationship,
  ReferenceData,
} from '../../lib/contracts';
export const institutionTypes = [
  'culture',
  'education',
  'ngo',
  'municipality_public',
  'migrant_diaspora',
  'media',
  'foundation_funder',
  'commercial',
  'state_affiliated',
  'other',
] as const;
export const relationshipTypes = [
  'bonding',
  'bridging',
  'linking',
  'unclassified',
] as const;
export const periodStatuses = ['current', 'past', 'unknown'] as const;
export function normalizeSelection(
  d: Dataset,
  s: AtlasState,
  visibleIds: string[],
): AtlasState {
  const selectedNodeId = d.organizations.some((o) => o.id === s.selectedNodeId)
    ? s.selectedNodeId
    : null;
  const edge = filterRelationships(d, s).find(
    (e) => e.id === s.selectedRelationshipId,
  );
  const roots = new Set(selectedNodeId ? [selectedNodeId] : visibleIds);
  const selectedRelationshipId =
    edge && (roots.has(edge.source_id) || roots.has(edge.target_id))
      ? edge.id
      : null;
  return { ...s, selectedNodeId, selectedRelationshipId };
}
export function filterRelationships(d: Dataset, s: AtlasState): Relationship[] {
  return d.relationships.filter(
    (e) =>
      s.periodStatuses.includes(e.temporal_status) &&
      (e.types.length
        ? e.types.some((t) => s.relationshipTypes.includes(t))
        : s.relationshipTypes.includes('unclassified')),
  );
}
export function contextNodes(
  d: Dataset,
  visible: Organization[],
  selected: string | null,
  edges: Relationship[],
): Organization[] {
  const roots = new Set(selected ? [selected] : visible.map((o) => o.id));
  const ids = new Set([...visible.map((o) => o.id), ...roots]);
  for (const e of edges) {
    if (roots.has(e.source_id)) ids.add(e.target_id);
    if (roots.has(e.target_id)) ids.add(e.source_id);
  }
  return d.organizations.filter((o) => ids.has(o.id));
}
export function contextEdges(
  edges: Relationship[],
  visible: Organization[],
  selected: string | null,
) {
  const roots = new Set(selected ? [selected] : visible.map((o) => o.id));
  return edges.filter((e) => roots.has(e.source_id) || roots.has(e.target_id));
}
export function resolveRelationshipAnchors(
  e: Relationship,
  nodes: Organization[],
  refs: ReferenceData,
) {
  const resolve = (id: string, explicit: string | null) => {
    const node = nodes.find((o) => o.id === id);
    if (!node || node.online_only) return null;
    const cities = [
      ...new Set(
        node.locations.map((l) => l.city_id).filter((c): c is string => !!c),
      ),
    ];
    const city = explicit
      ? cities.includes(explicit)
        ? explicit
        : null
      : cities.length === 1
        ? cities[0]
        : null;
    return refs.cities.some((c) => c.id === city) ? city : null;
  };
  const sourceCityId = resolve(e.source_id, e.source_city_id),
    targetCityId = resolve(e.target_id, e.target_city_id);
  return sourceCityId && targetCityId ? { sourceCityId, targetCityId } : null;
}
