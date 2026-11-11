import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { proximaPagina } from "@/lib/paginacao";
import { atletasApi, type FiltrosAtleta } from "./api";

// RF-35 a RF-37: "Encontrar atleta". Ao mudar a busca, a lista anterior fica
// na tela até o novo resultado chegar.
export function useAtletas(filtros: FiltrosAtleta = {}) {
  return useInfiniteQuery({
    queryKey: ["atletas", filtros],
    queryFn: ({ pageParam }) => atletasApi.buscar(pageParam, filtros),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
    placeholderData: keepPreviousData,
  });
}

// RF-38: perfil de um atleta, aberto pela busca, pelo feed ou pelos participantes.
export function useAtleta(id: string) {
  return useQuery({ queryKey: ["atletas", "detalhe", id], queryFn: () => atletasApi.detalhe(id) });
}
