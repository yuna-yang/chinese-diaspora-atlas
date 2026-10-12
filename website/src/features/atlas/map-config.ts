export function mapConfig() {
  const url =
    process.env.NEXT_PUBLIC_TILE_URL ??
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  if (
    !url.startsWith('https://') ||
    !['{z}', '{x}', '{y}'].every((x) => url.includes(x))
  )
    throw new Error('Tile URL must be an HTTPS tile template');
  const attributionUrl =
    process.env.NEXT_PUBLIC_TILE_ATTRIBUTION_URL ??
    'https://www.openstreetmap.org/copyright';
  if (!attributionUrl.startsWith('https://'))
    throw new Error('Attribution link must be HTTPS');
  return {
    url,
    attributionUrl,
    attributionText:
      process.env.NEXT_PUBLIC_TILE_ATTRIBUTION_TEXT ??
      '© OpenStreetMap contributors',
  };
}
