import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proximaPagina } from "@/lib/paginacao";
import { notificacoesApi } from "./api";

// RF-47 e RF-52: avisos do usuário, do mais recente para o mais antigo.
export function useNotificacoes() {
  return useInfiniteQuery({
    queryKey: ["notificacoes"],
    queryFn: ({ pageParam }) => notificacoesApi.listar(pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
  });
}

// RF-52: uma (ao tocar no aviso) ou todas ("Marcar todas como lidas").
export function useMarcarComoLidas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids?: string[]) => notificacoesApi.marcarComoLidas(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notificacoes"] }),
  });
}
