'use client';
import type { Locale } from '../../lib/contracts';
import { messages } from '../../lib/i18n';
import type { useVisitorLocation } from './useVisitorLocation';
export default function LocationControl({
  locale,
  location,
}: {
  locale: Locale;
  location: ReturnType<typeof useVisitorLocation>;
}) {
  const t = messages(locale);
  return (
    <div className="location-control">
      <div className="location-actions">
        <button
          className="location-button"
          onClick={location.request}
          disabled={location.status === 'locating'}
        >
          <span aria-hidden="true">◎</span>{' '}
          {location.status === 'locating' ? t.locating : t.locate}
        </button>
        {location.status === 'located' || location.status === 'locating' ? (
          <button className="text-button" onClick={location.clear}>
            {t.clearLocation}
          </button>
        ) : null}
      </div>
      <small>{t.locationDisclosure}</small>
      <p
        className={location.error ? 'location-error' : 'location-status'}
        role="status"
      >
        {location.error
          ? t[location.error]
          : location.status === 'located'
            ? location.position!.accuracy > 5000
              ? t.locationApproximate
              : t.locationFound
            : location.status === 'locating'
              ? t.locating
              : ''}
      </p>
    </div>
  );
}
