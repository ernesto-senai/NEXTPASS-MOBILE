import { useMutation } from "@tanstack/react-query";
import { denunciasApi } from "./api";

// RF-54: a denúncia vai para a fila de moderação da equipe (RF-58).
export function useDenunciar() {
  return useMutation({ mutationFn: denunciasApi.enviar });
}
