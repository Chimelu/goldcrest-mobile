/**
 * CoinGecko public API — same source for watchlist + trade quote.
 * https://www.coingecko.com/en/api/documentation
 * (Free tier: rate-limited; poll ~60s in production.)
 */

const BASE = 'https://api.coingecko.com/api/v3';

export type CoinGeckoSimpleRow = {
  usd: number;
  usd_24h_change?: number;
};

export type CoinGeckoSimpleResponse = Record<string, CoinGeckoSimpleRow>;
export type CoinGeckoMarketsRow = {
  id: string;
  current_price: number;
  price_change_percentage_24h?: number;
  sparkline_in_7d?: {
    price?: number[];
  };
};

export type ChartPeriod = '24H' | '7D' | '30D';

export async function fetchSimpleUsdPrices(
  coingeckoIds: string[],
): Promise<CoinGeckoSimpleResponse> {
  const unique = [...new Set(coingeckoIds.filter(Boolean))];
  if (unique.length === 0) {
    return {};
  }

  const params = new URLSearchParams({
    ids: unique.join(','),
    vs_currencies: 'usd',
    include_24hr_change: 'true',
  });

  const url = `${BASE}/simple/price?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`CoinGecko ${res.status}`);
  }

  return res.json() as Promise<CoinGeckoSimpleResponse>;
}

export async function fetchMarketsUsd(
  coingeckoIds: string[],
): Promise<CoinGeckoMarketsRow[]> {
  const unique = [...new Set(coingeckoIds.filter(Boolean))];
  if (unique.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    vs_currency: 'usd',
    ids: unique.join(','),
    sparkline: 'true',
    price_change_percentage: '24h',
  });

  const url = `${BASE}/coins/markets?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko ${res.status}`);
  }
  return res.json() as Promise<CoinGeckoMarketsRow[]>;
}

export async function fetchAssetChartUsd(
  coingeckoId: string,
  period: ChartPeriod,
): Promise<number[]> {
  const days = period === '24H' ? '1' : period === '7D' ? '7' : '30';
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days,
  });

  const url = `${BASE}/coins/${encodeURIComponent(coingeckoId)}/market_chart?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CoinGecko ${res.status}`);
  }

  const json = (await res.json()) as { prices?: [number, number][] };
  const points = Array.isArray(json.prices)
    ? json.prices.map(p => p[1]).filter(n => typeof n === 'number')
    : [];
  return points;
}

export function formatChangePercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatUsdPrice(value: number): string {
  if (value >= 1) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (value >= 0.01) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 8,
  });
}
