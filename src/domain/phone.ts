/** Indian mobile numbers: 10 digits starting 6–9. Returned with the 91 country code, no plus. */
export function normaliseIndianMobile(input: string): string | null {
  const digits = input.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? `91${digits}` : null;
}

export const displayPhone = (p?: string) => {
  if (!p) return '';
  const d = p.replace(/^91/, '');
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
};
