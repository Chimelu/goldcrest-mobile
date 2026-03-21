/**
 * CryptoCompare News API (free, no key required for basic use).
 * https://min-api.cryptocompare.com/documentation?key=News&cat=News
 */

const NEWS_URL = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';

export type CryptoNewsArticle = {
  id: string;
  title: string;
  body: string;
  url: string;
  source: string;
  imageurl: string;
  published_on: number;
  categories?: string;
};

const FALLBACK_NEWS: CryptoNewsArticle[] = [
  {
    id: 'fallback-1',
    title: 'Bitcoin and Ether hold key support levels',
    body: 'Major crypto assets are consolidating after recent volatility. Analysts are watching macro signals and ETF flows for the next directional move.',
    url: 'https://www.coindesk.com/',
    source: 'Goldcrest Demo',
    imageurl: '',
    published_on: Math.floor(Date.now() / 1000) - 3600,
    categories: 'Markets',
  },
  {
    id: 'fallback-2',
    title: 'On-chain activity rises across leading networks',
    body: 'Transaction count and active wallet growth increased this week on several major chains, suggesting improving participation and liquidity.',
    url: 'https://www.coindesk.com/',
    source: 'Goldcrest Demo',
    imageurl: '',
    published_on: Math.floor(Date.now() / 1000) - 6 * 3600,
    categories: 'Blockchain',
  },
  {
    id: 'fallback-3',
    title: 'Risk management remains critical in choppy markets',
    body: 'With prices moving quickly, traders continue to prioritize position sizing and stop-loss discipline while waiting for clearer trend confirmation.',
    url: 'https://www.coindesk.com/',
    source: 'Goldcrest Demo',
    imageurl: '',
    published_on: Math.floor(Date.now() / 1000) - 24 * 3600,
    categories: 'Analysis',
  },
];

type CryptoCompareNewsResponse = {
  Data: CryptoNewsArticle[];
  HasWarning?: boolean;
};

export async function fetchCryptoNews(): Promise<CryptoNewsArticle[]> {
  try {
    const res = await fetch(NEWS_URL);
    if (!res.ok) {
      return FALLBACK_NEWS;
    }
    const json = (await res.json()) as CryptoCompareNewsResponse;
    const data = json.Data;
    if (!Array.isArray(data) || data.length === 0) {
      return FALLBACK_NEWS;
    }
    return data;
  } catch {
    return FALLBACK_NEWS;
  }
}

export function formatNewsTime(publishedOn: number): string {
  const d = new Date(publishedOn * 1000);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

/** First paragraph or ~220 chars for list preview */
export function summarizeBody(body: string, maxLen = 220): string {
  const trimmed = body.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen).trim()}…`;
}

export function primaryCategory(categories: string | undefined): string {
  if (!categories) return 'Crypto';
  const first = categories.split('|')[0]?.trim();
  return first || 'Crypto';
}
