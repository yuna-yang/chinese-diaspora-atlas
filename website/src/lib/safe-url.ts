/** Public evidence only; editorial review still decides whether content is safe. */
export function safeUrl(s: string): boolean {
  try {
    const u = new URL(s);
    const privateKeys = new Set([
      'token',
      'invite',
      'key',
      'auth',
      'access_token',
      'auth_token',
      'api_key',
      'apikey',
      'password',
    ]);
    const hasPrivateKey = [
      ...u.searchParams.keys(),
      ...new URLSearchParams(u.hash.slice(1)).keys(),
    ].some((k) => privateKeys.has(k.toLowerCase()));
    return (
      u.protocol === 'https:' &&
      !!u.hostname &&
      !u.username &&
      !u.password &&
      !hasPrivateKey &&
      !/\s/.test(s) &&
      !/(?:joinchat|\/invite\/|[?&](?:token|invite|key|auth)=)/i.test(s) &&
      !['chat.whatsapp.com', 'discord.gg'].includes(u.hostname.toLowerCase()) &&
      !(u.hostname === 't.me' && u.pathname.startsWith('/+'))
    );
  } catch {
    return false;
  }
}
