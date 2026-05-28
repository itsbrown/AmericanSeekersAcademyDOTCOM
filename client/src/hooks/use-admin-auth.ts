import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const AUTH_TOKEN_KEY = "admin_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => void;
  logout: () => Promise<void>;
  getAuthHeaders: () => HeadersInit;
  loginPending: boolean;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verify existing session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          clearStoredToken();
        }
      } catch {
        clearStoredToken();
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await apiRequest("POST", "/api/admin/login", { password: pwd });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.token) {
        setStoredToken(data.token);
        setIsAuthenticated(true);
        toast({ title: "Logged in successfully" });
      }
    },
    onError: () => {
      toast({ title: "Invalid password", variant: "destructive" });
    },
  });

  const logout = async () => {
    const token = getStoredToken();
    if (token) {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    clearStoredToken();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login: (password: string) => loginMutation.mutate(password),
    logout,
    getAuthHeaders,
    loginPending: loginMutation.isPending,
  };
}
