import { useInfiniteQuery } from "@tanstack/react-query";
import { proximaPagina } from "@/lib/paginacao";
import { avaliacoesApi, type SituacaoInscricao } from "./api";

// Aba "Peneiras Abertas" do feed do atleta (RF-18).
export function useAvaliacoesAbertas() {
  return useInfiniteQuery({
    queryKey: ["avaliacoes", "abertas"],
    queryFn: ({ pageParam }) => avaliacoesApi.listarAbertas(pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
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
