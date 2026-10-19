import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proximaPagina } from "@/lib/paginacao";
import { convitesApi } from "./api";

// RF-26: caixa de convites do atleta.
export function useConvitesRecebidos() {
  return useInfiniteQuery({
    queryKey: ["convites"],
    queryFn: ({ pageParam }) => convitesApi.recebidos(pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
  });
}

// RF-27: o aceite cria a inscrição e ocupa vaga, então a caixa, as inscrições
// e as avaliações abertas são recarregadas.
export function useResponderConvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convitesApi.responder,
    onSuccess: () =>
      Promise.all(
        ["convites", "inscricoes", "avaliacoes"].map((chave) =>
          queryClient.invalidateQueries({ queryKey: [chave] }),
        ),
      ),
  });
}
