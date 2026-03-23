import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { getAuthToken } from '../services/authApi';
import {
  fetchPortfolioSummary,
  type PortfolioSummary,
} from '../services/portfolioApi';

type PortfolioContextValue = {
  summary: PortfolioSummary | null;
  loading: boolean;
  error: string | null;
  /** Call from Trade (creates wallet server-side on first success) or Home/Wallet to refresh. */
  refresh: () => Promise<void>;
  /** Call on logout */
  clear: () => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clear = useCallback(() => {
    setSummary(null);
    setError(null);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    if (!getAuthToken()) {
      clear();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPortfolioSummary();
      setSummary(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load portfolio';
      setError(msg);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [clear]);

  const value = useMemo(
    () => ({
      summary,
      loading,
      error,
      refresh,
      clear,
    }),
    [summary, loading, error, refresh, clear],
  );

  return (
    <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
  );
};

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return ctx;
}
