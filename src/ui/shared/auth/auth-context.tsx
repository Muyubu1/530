import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthGateway, AuthStatus, AuthUser } from "@/domain/auth";
import { supabaseAuthGateway } from "./supabase-auth-gateway";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  auth: AuthGateway;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Provides auth status/user + the gateway. Auth state resolves client-side only. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const apply = (u: AuthUser | null) => {
      setUser(u);
      setStatus(u ? "authed" : "unauthed");
    };
    const unsubscribe = supabaseAuthGateway.onAuthChange(apply);
    supabaseAuthGateway.getUser().then(apply);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, auth: supabaseAuthGateway }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
