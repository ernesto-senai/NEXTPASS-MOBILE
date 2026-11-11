import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { abrirSessao } from "../auth/hooks";
import { type AceiteDeVinculo, vinculosApi } from "./api";

// RF-15: responsáveis indicados pelo atleta.
export function useVinculosDoAtleta() {
  return useQuery({ queryKey: ["vinculos"], queryFn: vinculosApi.doAtleta });
}

// RF-49: atletas que o responsável acompanha.
export function useAtletasVinculados() {
  return useQuery({ queryKey: ["vinculos"], queryFn: vinculosApi.doResponsavel });
}

// RF-15: envia (ou reenvia) o link ao responsável. O perfil mostra a situação
// do vínculo, então também é recarregado.
export function usePedirVinculo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vinculosApi.pedir,
    onSuccess: () =>
      Promise.all(
        ["vinculos", "perfil"].map((chave) => queryClient.invalidateQueries({ queryKey: [chave] })),
      ),
  });
}

// RF-48: dados do pedido pelo token do link.
export function usePedidoDeVinculo(token: string) {
  return useQuery({
    queryKey: ["vinculos", "pedido", token],
    queryFn: () => vinculosApi.pedido(token),
    enabled: token.length > 0,
    retry: false,
  });
}

// RF-48: confirma o vínculo e já entra no app como responsável.
export function useAceitarVinculo() {
  return useMutation({
    mutationFn: async (dados: AceiteDeVinculo) => {
      await abrirSessao(await vinculosApi.aceitar(dados), true);
    },
  });
}
