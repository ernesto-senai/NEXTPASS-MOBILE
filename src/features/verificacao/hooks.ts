import { useQuery } from "@tanstack/react-query";
import { verificacaoApi } from "./api";

// RN-04: telas que só o olheiro verificado usa (ex.: Criar avaliação) avisam
// antes de o olheiro preencher tudo.
export function useVerificacao() {
  return useQuery({ queryKey: ["verificacao"], queryFn: verificacaoApi.situacao });
}
