import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { assets } from '../data/tradingAssets';
import type { AssetItem } from '../data/tradingAssets';
import { fetchMarketsUsd } from '../services/coinGecko';

export type LiveQuote = {
  priceUsd: number;
  change24hPercent: number | null;
  sparkline7d: number[] | null;
  source: 'live' | 'fallback';
};

type CryptoPricesContextValue = {
  /** By app asset id */
  quotesByAssetId: Record<string, LiveQuote>;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  getQuote: (asset: AssetItem) => LiveQuote;
};

const POLL_MS = 60_000;

const CryptoPricesContext = createContext<CryptoPricesContextValue | null>(
  null,
);

const cryptoWithIds = assets.filter(
  (a): a is AssetItem & { coingeckoId: string } =>
    a.type === 'crypto' && Boolean(a.coingeckoId),
);

function fallbackQuote(asset: AssetItem): LiveQuote {
  return {
    priceUsd: Number(asset.sellPrice) || 0,
    change24hPercent: null,
    sparkline7d: null,
    source: 'fallback',
  };
}

export const CryptoPricesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quotesByAssetId, setQuotesByAssetId] = useState<
    Record<string, LiveQuote>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    const ids = cryptoWithIds.map(a => a.coingeckoId);
    try {
      setError(null);
      const rows = await fetchMarketsUsd(ids);
      const dataById = Object.fromEntries(rows.map(row => [row.id, row]));
      const next: Record<string, LiveQuote> = {};

      for (const asset of cryptoWithIds) {
        const row = dataById[asset.coingeckoId];
        if (row && typeof row.current_price === 'number') {
          next[asset.id] = {
            priceUsd: row.current_price,
            change24hPercent:
              typeof row.price_change_percentage_24h === 'number'
                ? row.price_change_percentage_24h
                : null,
            sparkline7d:
              Array.isArray(row.sparkline_in_7d?.price) &&
              row.sparkline_in_7d.price.length > 1
                ? row.sparkline_in_7d.price
                : null,
            source: 'live',
          };
        } else {
          next[asset.id] = { ...fallbackQuote(asset), source: 'fallback' };
        }
      }

      setQuotesByAssetId(next);
      setLastUpdated(new Date());
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Price fetch failed';
      setError(msg);
      const next: Record<string, LiveQuote> = {};
      for (const asset of cryptoWithIds) {
        next[asset.id] = fallbackQuote(asset);
      }
      setQuotesByAssetId(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [load]);

  const getQuote = useCallback(
    (asset: AssetItem): LiveQuote => {
      if (asset.type !== 'crypto' || !asset.coingeckoId) {
        return fallbackQuote(asset);
      }
      return quotesByAssetId[asset.id] ?? fallbackQuote(asset);
    },
    [quotesByAssetId],
  );

  const value = useMemo(
    () => ({
      quotesByAssetId,
      loading,
      error,
      lastUpdated,
      refresh: load,
      getQuote,
    }),
    [quotesByAssetId, loading, error, lastUpdated, load, getQuote],
  );

  return (
    <CryptoPricesContext.Provider value={value}>
      {children}
    </CryptoPricesContext.Provider>
  );
};

export function useCryptoPrices(): CryptoPricesContextValue {
  const ctx = useContext(CryptoPricesContext);
  if (!ctx) {
    throw new Error('useCryptoPrices must be used inside CryptoPricesProvider');
  }
  return ctx;
}

/** Safe for optional usage (returns fallback if provider missing — shouldn't happen) */
export function useCryptoQuote(asset: AssetItem | undefined): LiveQuote | null {
  const ctx = useContext(CryptoPricesContext);
  if (!asset) return null;
  if (!ctx) return fallbackQuote(asset);
  return ctx.getQuote(asset);
}
