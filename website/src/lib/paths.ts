export function publicPath(
  path: string,
  base = process.env.NEXT_PUBLIC_BASE_PATH ?? '',
): string {
  if (base && !/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+$/.test(base))
    throw new Error('Invalid base path');
  if (!path.startsWith('/') || path.startsWith('//'))
    throw new Error('Expected local absolute path');
  return `${base}${path}`;
}
