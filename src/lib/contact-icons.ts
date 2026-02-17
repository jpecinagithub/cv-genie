const EMAIL_RE = /[\w.-]+@[\w.-]+\.\w+/i;
const PHONE_RE = /(\+?\d[\d\s\-().]{7,})/;

export function getContactIcon(value: string): string {
  const normalized = value.trim().toLowerCase();

  if (EMAIL_RE.test(normalized)) return '✉';
  if (PHONE_RE.test(normalized)) return '☎';
  if (normalized.includes('linkedin.com')) return '🔗';
  if (normalized.includes('github.com')) return '💻';
  if (normalized.includes('http://') || normalized.includes('https://') || normalized.includes('www.')) return '🌐';
  if (
    normalized.includes('resid') ||
    normalized.includes('ubic') ||
    normalized.includes('location') ||
    normalized.includes('city') ||
    normalized.includes('country')
  ) return '⌂';

  return '•';
}
