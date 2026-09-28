import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { proximaPagina } from "@/lib/paginacao";
import { ApiError } from "@/services/api/client";
import { lancesApi } from "./api";

// RF-32: feed de lances. Olheiro sem verificação recebe OLHEIRO_NAO_VERIFICADO
// (RN-04); nesse caso não adianta tentar de novo.
export function useFeedDeLances() {
  return useInfiniteQuery({
    queryKey: ["lances", "feed"],
    queryFn: ({ pageParam }) => lancesApi.feed(pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
    retry: (tentativas, erro) =>
      !(erro instanceof ApiError && erro.codigo === "OLHEIRO_NAO_VERIFICADO") && tentativas < 1,
  });
}

// RF-33: conta uma visualização quando o lance aparece na tela.
export function useRegistrarVisualizacao() {
  return useMutation({ mutationFn: lancesApi.registrarVisualizacao });
}
