import { getApiBaseUrl } from '../config/api';

function apiUrl(path: string) {
  return `${getApiBaseUrl()}${path}`;
}

function networkErrorMessage(): string {
  return (
    `Cannot reach the server (${getApiBaseUrl()}). ` +
    'Run goldcrest-api on your machine, use the same Wi‑Fi as your phone, ' +
    'or set EXPO_PUBLIC_API_BASE_URL in a .env file (e.g. http://192.168.x.x:4000).'
  );
}

type RegisterPayload = {
  fullName?: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export type ProfilePayload = {
  fullName: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type ApiError = {
  message?: string;
  requiresVerification?: boolean;
};

export type LoginError = Error & { requiresVerification?: boolean };
export type LoginResponse = {
  token: string;
  user?: {
    id?: number;
    email?: string;
    fullName?: string | null;
    isVerified?: boolean;
    canTransact?: boolean;
  };
};

export type ProfileResponse = {
  id?: number;
  email?: string;
  fullName?: string | null;
  isVerified?: boolean;
  canTransact?: boolean;
};
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

function authHeader() {
  if (!authToken) {
    throw new Error('You are not authenticated. Please sign in again.');
  }
  return { Authorization: `Bearer ${authToken}` };
}

export function isLoginVerificationError(e: unknown): e is LoginError {
  return (
    e instanceof Error &&
    (e as LoginError).requiresVerification === true
  );
}

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  return (await res.json().catch(() => ({}))) as Record<string, unknown>;
}

export async function registerUser(payload: RegisterPayload) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as ApiError;
  if (!res.ok) {
    throw new Error(json.message || 'Failed to create account');
  }
  return json;
}

export async function verifyRegistrationOtp(email: string, otp: string) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/verify-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as ApiError;
  if (!res.ok) {
    throw new Error(json.message || 'Verification failed');
  }
  return json;
}

export async function resendRegistrationOtp(email: string) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/resend-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as ApiError;
  if (!res.ok) {
    throw new Error(json.message || 'Could not resend code');
  }
  return json;
}

export async function requestPasswordReset(email: string) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/forgot-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }
  const json = (await parseJson(res)) as ApiError;
  if (!res.ok) {
    throw new Error(json.message || 'Could not request reset');
  }
  return json;
}

export async function resendPasswordResetOtp(email: string) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/resend-password-reset'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }
  const json = (await parseJson(res)) as ApiError;
  if (!res.ok) {
    throw new Error(json.message || 'Could not resend code');
  }
  return json;
}

export async function verifyResetPasswordOtp(email: string, otp: string) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/verify-reset-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }
  const json = (await parseJson(res)) as ApiError & { resetToken?: string };
  if (!res.ok) {
    throw new Error(json.message || 'Verification failed');
  }
  if (!json.resetToken) {
    throw new Error('No reset token returned');
  }
  return json;
}

export async function resetPasswordWithToken(resetToken: string, newPassword: string) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/reset-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, newPassword }),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }
  const json = (await parseJson(res)) as ApiError;
  if (!res.ok) {
    throw new Error(json.message || 'Could not reset password');
  }
  return json;
}

export async function loginUser(payload: LoginPayload) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }

  const json = (await parseJson(res)) as ApiError & LoginResponse;

  if (res.status === 403 && json.requiresVerification) {
    const err = new Error(
      json.message || 'Please verify your email before signing in.',
    ) as LoginError;
    err.requiresVerification = true;
    throw err;
  }

  if (!res.ok) {
    throw new Error(json.message || 'Login failed');
  }
  if (!json.token) {
    throw new Error('No token returned');
  }
  setAuthToken(json.token);
  return json as LoginResponse;
}

export async function getProfile() {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/profile'), {
      method: 'GET',
      headers: { ...authHeader() },
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }
  const json = (await parseJson(res)) as ApiError & ProfileResponse;
  if (!res.ok) {
    throw new Error(json.message || 'Could not fetch profile');
  }
  return json as ProfileResponse;
}

export async function updateProfile(payload: ProfilePayload) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/profile'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }
  const json = (await parseJson(res)) as ApiError & {
    fullName?: string | null;
    email?: string;
  };
  if (!res.ok) {
    throw new Error(json.message || 'Could not update profile');
  }
  return json;
}

export async function changePassword(payload: ChangePasswordPayload) {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/change-password'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }
  const json = (await parseJson(res)) as ApiError;
  if (!res.ok) {
    throw new Error(json.message || 'Could not change password');
  }
  return json;
}

export async function deleteAccount() {
  let res: Response;
  try {
    res = await fetch(apiUrl('/auth/account'), {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(networkErrorMessage());
    }
    throw e;
  }
  const json = (await parseJson(res)) as ApiError;
  if (!res.ok) {
    throw new Error(json.message || 'Could not delete account');
  }
  return json;
}
