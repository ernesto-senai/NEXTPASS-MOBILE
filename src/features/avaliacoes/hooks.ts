import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { proximaPagina } from "@/lib/paginacao";
import { avaliacoesApi, type FiltrosAvaliacao, type SituacaoInscricao } from "./api";

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

// Abas "Inscrições" e "Participadas" (RF-19).
export function useMinhasInscricoes(situacao: SituacaoInscricao) {
  return useInfiniteQuery({
    queryKey: ["inscricoes", situacao],
    queryFn: ({ pageParam }) => avaliacoesApi.minhasInscricoes(situacao, pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
  });
}
