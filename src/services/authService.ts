"use client";

const TOKEN_KEYS = ["auth_token", "authToken", "token"];

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
};

type ResetPasswordPayload = {
  email: string;
};

type UpdatePasswordPayload = {
  accessToken: string;
  password: string;
};

type AuthResponse = {
  access_token?: string;
  token?: string;
  jwt?: string;
  user?: unknown;
};

type StoredUser = {
  name?: string;
  email?: string;
};

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function pickToken(data: AuthResponse) {
  return data.access_token ?? data.token ?? data.jwt;
}

function pickUser(data: AuthResponse, fallback?: AuthPayload): StoredUser {
  const user = typeof data.user === "object" && data.user !== null
    ? (data.user as Record<string, unknown>)
    : {};
  const metadata =
    typeof user.user_metadata === "object" && user.user_metadata !== null
      ? (user.user_metadata as Record<string, unknown>)
      : {};

  return {
    name: String(metadata.name ?? fallback?.name ?? user.email ?? fallback?.email ?? "Aythiya User"),
    email: String(user.email ?? fallback?.email ?? ""),
  };
}

async function postAuth(path: string, payload: AuthPayload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? `Auth failed: ${response.status}`);
  }

  return response.json() as Promise<AuthResponse>;
}

async function postJson<TPayload extends Record<string, unknown>>(
  path: string,
  payload: TPayload
) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? `Request failed: ${response.status}`);
  }

  return response.json();
}

export const authService = {
  getToken() {
    const localStorage = storage();
    if (!localStorage) return undefined;

    for (const key of TOKEN_KEYS) {
      const token = localStorage.getItem(key);
      if (token) return token;
    }

    return undefined;
  },

  setToken(token: string) {
    const localStorage = storage();
    if (!localStorage) return;
    localStorage.setItem("auth_token", token);
  },

  setUser(user: StoredUser) {
    const localStorage = storage();
    if (!localStorage) return;
    localStorage.setItem("auth_user", JSON.stringify(user));
  },

  getUser(): StoredUser | undefined {
    const localStorage = storage();
    if (!localStorage) return undefined;
    const raw = localStorage.getItem("auth_user");
    if (!raw) return undefined;

    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return undefined;
    }
  },

  clearToken() {
    const localStorage = storage();
    if (!localStorage) return;
    TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem("auth_user");
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  async login(payload: AuthPayload) {
    const data = await postAuth("/api/auth/login", payload);
    const token = pickToken(data);
    if (!token) throw new Error("No token returned from auth provider.");
    this.setToken(token);
    this.setUser(pickUser(data, payload));
    return data;
  },

  async register(payload: AuthPayload) {
    const data = await postAuth("/api/auth/register", payload);
    const token = pickToken(data);
    if (!token) {
      throw new Error(
        "Account created, but no session token was returned. Please confirm the email and sign in."
      );
    }
    this.setToken(token);
    this.setUser(pickUser(data, payload));
    return data;
  },

  async requestPasswordReset(payload: ResetPasswordPayload) {
    return postJson("/api/auth/forgot-password", payload);
  },

  async updatePassword(payload: UpdatePasswordPayload) {
    return postJson("/api/auth/reset-password", payload);
  },
};
