import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/services/api/client";

// Cache do estado vindo da API (listas, perfis, avaliações). Erros 4xx (ex.:
// olheiro não verificado, dado inválido) não mudam se repetir, então só falhas
// de rede ou do servidor ganham uma nova tentativa.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (tentativas, erro) =>
        tentativas < 1 && !(erro instanceof ApiError && erro.status < 500),
    },
  },
});
