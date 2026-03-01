import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const u = await api.getMe();
      setUser(u);
      return u;
    } catch (e) {
      if (e.status === 401) setUser(null);
      else throw e;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await api.getMe();
        if (!cancelled) setUser(u);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (courriel, password) => {
    await api.login(courriel, password);
    const user = await refreshMe();
    return user;
  }, [refreshMe]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const register = useCallback(async (body) => {
    await api.register(body);
    // Backend does not log in after signup; user must log in separately
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    refreshMe,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
