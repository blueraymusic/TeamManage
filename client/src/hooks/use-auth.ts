import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: number;
}

interface AuthResponse {
  user: User;
  organization?: {
    id: number;
    name: string;
    code: string;
  };
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<{ user: User } | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
  });

  const user = data?.user || null;
  
  console.log("useAuth - Raw data:", data);
  console.log("useAuth - Extracted user:", user);
  console.log("useAuth - User role:", user?.role);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response;
    },
    onSuccess: () => {
      // Clear all React Query cache
      queryClient.clear();
      
      // Clear any local storage items if they exist
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Force a complete page reload to clear all state
      window.location.replace("/");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even on error, try to clear local state and redirect
      queryClient.clear();
      localStorage.clear();
      window.location.replace("/");
    },
  });
}
