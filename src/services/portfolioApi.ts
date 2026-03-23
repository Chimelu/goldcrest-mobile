import { getApiBaseUrl } from '../config/api';
import { getAuthToken } from './authApi';

function networkErrorMessage(): string {
  return (
    `Cannot reach the server (${getApiBaseUrl()}). ` +
    'Check EXPO_PUBLIC_API_BASE_URL and that goldcrest-api is running.'
  );
}

export type PortfolioSummary = {
  availableUsd: string;
  holdings: { symbol: string; quantity: string }[];
};

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  return (await res.json().catch(() => ({}))) as Record<string, unknown>;
}

/**
 * Loads (and lazily creates) the user wallet row via GET /portfolio/summary.
 * Requires Bearer token from login.
 */
export async function fetchPortfolioSummary(): Promise<PortfolioSummary> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not signed in');
  }

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/portfolio/summary`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as {
    message?: string;
    availableUsd?: string;
    holdings?: { symbol: string; quantity: string }[];
  };

  if (!res.ok) {
    throw new Error(json.message || 'Could not load portfolio');
  }

  if (typeof json.availableUsd !== 'string' || !Array.isArray(json.holdings)) {
    throw new Error('Invalid portfolio response');
  }

  return {
    availableUsd: json.availableUsd,
    holdings: json.holdings.map(h => ({
      symbol: String(h.symbol),
      quantity: String(h.quantity),
    })),
  };
}

export type BuyResult = {
  message: string;
  symbol: string;
  spendUsd: string;
  unitPriceUsd: string;
  cryptoAmount: string;
  newAvailableUsd: string;
  newQuantity: string;
};

export type SellResult = {
  message: string;
  symbol: string;
  cryptoAmount: string;
  unitPriceUsd: string;
  grossUsd: string;
  newAvailableUsd: string;
  newQuantity: string;
};

/** POST /portfolio/buy — spend USD, receive crypto at server CoinGecko price. */
export async function buyCrypto(symbol: string, spendUsd: number): Promise<BuyResult> {
  const token = getAuthToken();
  if (!token) throw new Error('Not signed in');

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/portfolio/buy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: symbol.trim().toUpperCase(),
        spendUsd,
      }),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as BuyResult & { message?: string };
  if (!res.ok) {
    throw new Error(
      (json as { message?: string }).message || 'Buy failed',
    );
  }
  return json as BuyResult;
}

/** POST /portfolio/sell — sell crypto amount for USD at server price. */
export async function sellCrypto(
  symbol: string,
  cryptoAmount: number,
): Promise<SellResult> {
  const token = getAuthToken();
  if (!token) throw new Error('Not signed in');

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/portfolio/sell`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: symbol.trim().toUpperCase(),
        cryptoAmount,
      }),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as SellResult & { message?: string };
  if (!res.ok) {
    throw new Error(
      (json as { message?: string }).message || 'Sell failed',
    );
  }
  return json as SellResult;
}

export type WithdrawalRow = {
  id: number;
  amountUsd: string;
  destinationAddress: string;
  network: string;
  status: string;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchWithdrawals(): Promise<WithdrawalRow[]> {
  const token = getAuthToken();
  if (!token) throw new Error('Not signed in');

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/portfolio/withdrawals`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as {
    withdrawals?: WithdrawalRow[];
    message?: string;
  };
  if (!res.ok) {
    throw new Error(json.message || 'Could not load withdrawals');
  }
  return json.withdrawals ?? [];
}

export async function createWithdrawal(payload: {
  amountUsd: number;
  destinationAddress: string;
  network: string;
}): Promise<WithdrawalRow & { newAvailableUsd: string; message: string }> {
  const token = getAuthToken();
  if (!token) throw new Error('Not signed in');

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/portfolio/withdrawals`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as {
    message?: string;
    id?: number;
    amountUsd?: string;
    destinationAddress?: string;
    network?: string;
    status?: string;
    createdAt?: string;
    newAvailableUsd?: string;
  };
  if (!res.ok) {
    throw new Error(json.message || 'Withdrawal request failed');
  }
  return {
    message: json.message || 'OK',
    id: json.id!,
    amountUsd: String(json.amountUsd),
    destinationAddress: String(json.destinationAddress),
    network: String(json.network),
    status: String(json.status),
    adminNote: null,
    createdAt: String(json.createdAt),
    updatedAt: String(json.createdAt),
    newAvailableUsd: String(json.newAvailableUsd),
  };
}
