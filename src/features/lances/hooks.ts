import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { proximaPagina } from "@/lib/paginacao";
import { lancesApi, type NovoLance } from "./api";

// RF-32: feed de lances (só para olheiro verificado, RN-04).
export function useFeedDeLances() {
  return useInfiniteQuery({
    queryKey: ["lances", "feed"],
    queryFn: ({ pageParam }) => lancesApi.feed(pageParam),
    initialPageParam: 1,
    getNextPageParam: proximaPagina,
  });
}

// RF-33: conta uma visualização quando o lance aparece na tela.
export function useRegistrarVisualizacao() {
  return useMutation({ mutationFn: lancesApi.registrarVisualizacao });
}

// RF-28: lances do próprio atleta, com os destaques do carrossel primeiro.
export function useMeusLances() {
  return useQuery({ queryKey: ["lances", "meus"], queryFn: lancesApi.meus });
}

// RF-30 e RF-31: editar e excluir recarregam o perfil e o feed.
function useAlterarLances<T>(mutationFn: (dados: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lances"] }),
  });
}

export const useEditarLance = () => useAlterarLances(lancesApi.editar);
export const useExcluirLance = () => useAlterarLances(lancesApi.excluir);

// RF-25: publica o lance e acompanha o progresso do envio, de 0 a 1 (RNF-05).
export function usePublicarLance() {
  const queryClient = useQueryClient();
  const [progresso, setProgresso] = useState(0);

  const publicacao = useMutation({
    mutationFn: (lance: NovoLance) => {
      setProgresso(0);
      return lancesApi.publicar(lance, setProgresso);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lances"] }),
  });

  return { ...publicacao, progresso };
}
