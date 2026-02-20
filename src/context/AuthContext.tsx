import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  adminName: string;
  adminRole: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("vixa_auth") === "true";
  });
  const [adminName] = useState("John Adeyemi");
  const [adminRole] = useState("Super Admin");

  const login = async (_email: string, _password: string) => {
    // Mocked auth — always succeeds
    await new Promise((r) => setTimeout(r, 800));
    setIsAuthenticated(true);
    sessionStorage.setItem("vixa_auth", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("vixa_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminName, adminRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
