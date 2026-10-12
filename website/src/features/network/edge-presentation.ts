import type { Relationship } from '../../lib/contracts';
export function edgePresentation(e: Relationship) {
  const type = e.types.length > 1 ? 'mixed' : (e.types[0] ?? 'unclassified');
  const styles = {
    bonding: { color: '#94650a', dashArray: undefined },
    bridging: { color: '#166b5b', dashArray: '8 4' },
    linking: { color: '#81509c', dashArray: '2 4' },
    unclassified: { color: '#666666', dashArray: '1 7' },
    mixed: { color: '#81509c', dashArray: '8 3 2 3' },
  };
  return {
    ...styles[type],
    opacity:
      e.temporal_status === 'past'
        ? 0.45
        : e.temporal_status === 'unknown'
          ? 0.65
          : 0.85,
  };
}
/** Geography is illustrative; the complete accessible relation list is never capped. */
export function visibleEdges(
  edges: Relationship[],
  zoom: number,
  selected: string | null,
) {
  const chosen = edges.find((e) => e.id === selected);
  if (zoom < 4) return chosen ? [chosen] : [];
  return [
    ...(chosen ? [chosen] : []),
    ...edges.filter((e) => e.id !== selected),
  ].slice(0, 200);
}
