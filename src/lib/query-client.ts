import { QueryClient } from "@tanstack/react-query";

// Cache do estado vindo da API (listas, perfis, avaliações).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});
