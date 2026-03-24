import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshSession() {
    try {
      const response = await apiRequest("/auth/me");
      setUser(response?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  async function login(credentials) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });

    setUser(response.user);
    return response.user;
  }

  async function register(payload) {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    setUser(response.user);
    return response.user;
  }

  async function logout() {
    await apiRequest("/auth/logout", {
      method: "POST"
    });

    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isLoading, login, logout, refreshSession, register, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
