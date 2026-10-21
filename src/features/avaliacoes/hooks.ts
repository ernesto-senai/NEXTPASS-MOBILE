import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
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

// RF-20: detalhes de uma avaliação.
export function useAvaliacao(id: string) {
  return useQuery({
    queryKey: ["avaliacoes", "detalhe", id],
    queryFn: () => avaliacoesApi.detalhe(id),
  });
}

// RF-44: participantes de uma avaliação do olheiro, com busca pelo nome.
export function useParticipantes(id: string, busca: string) {
  return useInfiniteQuery({
    queryKey: ["avaliacoes", "participantes", id, busca],
    queryFn: ({ pageParam }) => avaliacoesApi.participantes(id, busca, pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
    placeholderData: keepPreviousData,
  });
}

// Inscrever, cancelar, remover ou aprovar mudam vagas e listas: tudo de
// avaliações e inscrições é recarregado.
function useAlterarAvaliacoes<T, R>(mutationFn: (dados: T) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all(
        ["avaliacoes", "inscricoes", "convites"].map((chave) =>
          queryClient.invalidateQueries({ queryKey: [chave] }),
        ),
      ),
  });
}

// RF-21: "Quero participar da avaliação".
export const useParticipar = () => useAlterarAvaliacoes(avaliacoesApi.participar);
// RF-22, RF-46 e RF-50: mudança de status da inscrição.
export const useAlterarInscricao = () => useAlterarAvaliacoes(avaliacoesApi.alterarInscricao);
// RF-43: edição da avaliação pelo olheiro.
export const useEditarAvaliacao = () => useAlterarAvaliacoes(avaliacoesApi.editar);

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

// RF-50: inscrições dos atletas vinculados esperando o responsável.
export function useInscricoesParaAprovar() {
  return useInfiniteQuery({
    queryKey: ["inscricoes", "aprovar"],
    queryFn: ({ pageParam }) => avaliacoesApi.paraAprovar(pageParam),
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
