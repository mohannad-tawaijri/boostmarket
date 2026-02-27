"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { API_URL } from "@/lib/config";

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, refreshToken: string, userData: User) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proactive refresh: refresh the access token before it expires
const ACCESS_TOKEN_REFRESH_MARGIN_MS = 2 * 60 * 1000; // refresh 2 minutes before expiry

function parseJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRefreshingRef = useRef(false);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const doRefresh = useCallback(async (): Promise<{ token: string; refreshToken: string; user: User } | null> => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) return null;

    if (isRefreshingRef.current) return null;
    isRefreshingRef.current = true;

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        // Refresh token is invalid — clear everything
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        return null;
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const scheduleRefresh = useCallback(
    (accessToken: string) => {
      clearRefreshTimer();
      const exp = parseJwtExp(accessToken);
      if (!exp) return;

      const msUntilRefresh = exp - Date.now() - ACCESS_TOKEN_REFRESH_MARGIN_MS;
      const delay = Math.max(msUntilRefresh, 0);

      refreshTimerRef.current = setTimeout(async () => {
        const result = await doRefresh();
        if (result) {
          scheduleRefresh(result.token);
        }
      }, delay);
    },
    [clearRefreshTimer, doRefresh],
  );

  // Get a valid access token, refreshing if needed
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    const exp = parseJwtExp(token);
    if (exp && exp > Date.now() + 30_000) {
      // Token is still valid for at least 30 seconds
      return token;
    }

    // Token is expired or about to expire — try refreshing
    const result = await doRefresh();
    if (result) {
      scheduleRefresh(result.token);
      return result.token;
    }

    return null;
  }, [doRefresh, scheduleRefresh]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const exp = parseJwtExp(token);
          // If access token is still valid, use it
          if (exp && exp > Date.now()) {
            const response = await fetch(`${API_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              scheduleRefresh(token);
            } else {
              // Access token rejected — try refresh
              const result = await doRefresh();
              if (result) {
                scheduleRefresh(result.token);
              }
            }
          } else {
            // Access token expired — try refresh
            const result = await doRefresh();
            if (result) {
              scheduleRefresh(result.token);
            }
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Try refresh as fallback
          const result = await doRefresh();
          if (result) {
            scheduleRefresh(result.token);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    return () => clearRefreshTimer();
  }, [doRefresh, scheduleRefresh, clearRefreshTimer]);

  const login = (token: string, refreshToken: string, userData: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(userData);
    scheduleRefresh(token);
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      scheduleRefresh(data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      scheduleRefresh(data.token);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    clearRefreshTimer();

    // Revoke refresh token on server
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // Ignore errors during logout
      }
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, register, logout, isLoading, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
