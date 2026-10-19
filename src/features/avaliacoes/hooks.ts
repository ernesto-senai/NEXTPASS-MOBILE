import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { proximaPagina } from "@/lib/paginacao";
import {
  avaliacoesApi,
  type FiltrosAvaliacao,
  type SituacaoAvaliacao,
  type SituacaoInscricao,
} from "./api";

// Aba "Peneiras Abertas" do feed (RF-18) e tela de Pesquisa (RF-23, RF-24).
// Ao mudar a busca, a lista anterior fica na tela até o novo resultado chegar.
export function useAvaliacoes(filtros: FiltrosAvaliacao = {}) {
  return useInfiniteQuery({
    queryKey: ["avaliacoes", filtros],
    queryFn: ({ pageParam }) => avaliacoesApi.listar(pageParam, filtros),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
    placeholderData: keepPreviousData,
  });
}

// RF-41: a nova avaliação entra nas listas que já estavam na tela.
export function useCriarAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: avaliacoesApi.criar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["avaliacoes"] }),
  });
}

// RF-42: avaliações do olheiro, com os participantes de cada uma.
export function useMinhasAvaliacoes(situacao: SituacaoAvaliacao) {
  return useInfiniteQuery({
    queryKey: ["avaliacoes", "minhas", situacao],
    queryFn: ({ pageParam }) => avaliacoesApi.minhas(situacao, pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
  });
}

// RF-43: a avaliação cancelada sai de "Próximas" e vai para "Anteriores".
export function useCancelarAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: avaliacoesApi.cancelar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["avaliacoes"] }),
  });
}

// Abas "Inscrições" e "Participadas" (RF-19).
export function useMinhasInscricoes(situacao: SituacaoInscricao) {
  return useInfiniteQuery({
    queryKey: ["inscricoes", situacao],
    queryFn: ({ pageParam }) => avaliacoesApi.minhasInscricoes(situacao, pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
  });
}
