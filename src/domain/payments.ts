// Payment helpers shared by the checkout screen.

/**
 * Links the checkout page wants to hand to another app: upi://, tez://, phonepe://, paytmmp:// and
 * Android intent:// links (turned into the plain upi:// link they wrap). Web pages stay inside.
 */
export function externalTarget(url: string): string | null {
  if (/^(https?|about|data|blob|javascript):/i.test(url)) return null;
  if (/^intent:/i.test(url)) {
    const scheme = url.match(/;scheme=([^;]+);/i)?.[1];
    const rest = url.replace(/^intent:\/\//i, '').split('#Intent')[0];
    return scheme ? `${scheme}://${rest}` : null;
  }
  return url;
}

