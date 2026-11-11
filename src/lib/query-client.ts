import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/services/api/client";

// Cache dos dados da API. Erro 4xx não muda se tentar de novo, então só erro de
// rede ou do servidor tenta outra vez.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (tentativas, erro) =>
        tentativas < 1 && !(erro instanceof ApiError && erro.status < 500),
    },
  },
});
