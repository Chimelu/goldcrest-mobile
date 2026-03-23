import { assets, type AssetItem } from '../data/tradingAssets';
import type { PortfolioSummary } from '../services/portfolioApi';

/** Pretty-print crypto amount for labels */
export function formatCryptoQuantity(ticker: string, amount: number): string {
  if (amount === 0) return '0';
  const upper = ticker.toUpperCase();
  if (upper === 'BTC' || upper === 'ETH') {
    return amount.toFixed(6).replace(/\.?0+$/, '') || '0';
  }
  if (upper === 'XRP' || upper === 'DOGE') {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  return amount.toFixed(4).replace(/\.?0+$/, '') || '0';
}

export function getCryptoQuantityForTicker(
  summary: PortfolioSummary | null,
  ticker: string,
): number {
  if (!summary) return 0;
  const row = summary.holdings.find(
    h => h.symbol.toUpperCase() === ticker.toUpperCase(),
  );
  if (!row) return 0;
  const n = Number(row.quantity);
  return Number.isFinite(n) ? n : 0;
}

/** Map API holdings to app assets + numeric quantity (drops unknown symbols & zero qty). */
export function enrichHoldings(
  holdings: PortfolioSummary['holdings'],
): { asset: AssetItem; amount: number }[] {
  return holdings
    .map(h => {
      const asset = assets.find(
        a =>
          a.type === 'crypto' &&
          a.fromTicker.toUpperCase() === h.symbol.toUpperCase(),
      );
      const amount = Number(h.quantity);
      if (!asset || !Number.isFinite(amount) || amount <= 0) return null;
      return { asset, amount };
    })
    .filter((x): x is { asset: AssetItem; amount: number } => x != null);
}

export function computePortfolioTotals(
  availableUsd: string,
  enriched: { asset: AssetItem; amount: number }[],
  getQuote: (asset: AssetItem) => { priceUsd: number },
): { cashUsd: number; cryptoValueUsd: number; totalUsd: number } {
  const cashUsd = Number(availableUsd) || 0;
  const cryptoValueUsd = enriched.reduce(
    (sum, { asset, amount }) => sum + amount * getQuote(asset).priceUsd,
    0,
  );
  return {
    cashUsd,
    cryptoValueUsd,
    totalUsd: cashUsd + cryptoValueUsd,
  };
}
