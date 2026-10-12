import type { Organization, ReferenceData } from '../../lib/contracts';
export interface AtlasMarker {
  id: string;
  organizationId: string;
  cityId: string;
  latitude: number;
  longitude: number;
}
export function buildMarkers(
  records: Organization[],
  refs: ReferenceData,
): AtlasMarker[] {
  const cities = new Map(refs.cities.map((c) => [c.id, c]));
  return records.flatMap((o) =>
    o.online_only
      ? []
      : o.locations.flatMap((l) => {
          const city = cities.get(l.city_id ?? '');
          return city
            ? [
                {
                  id: `${o.id}:${city.id}`,
                  organizationId: o.id,
                  cityId: city.id,
                  latitude: city.latitude,
                  longitude: city.longitude,
                },
              ]
            : [];
        }),
  );
}
